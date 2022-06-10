/**
 * @Description: 生产任务管理信息--头table
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:58:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Lov,
  Form,
  Button,
  DateTimePicker,
  TextField,
  Select,
  Modal,
  Tabs,
  CheckBox,
  DataSet,
} from 'choerodon-ui/pro';
import { connect } from 'dva';
import queryString from 'query-string';
import { isUndefined, isEmpty } from 'lodash';
import moment from 'moment';
import intl from 'utils/intl';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  getResponse,
  getAccessToken,
} from 'utils/utils';
import notification from 'utils/notification';
import { DATETIME_MIN, DATETIME_MAX, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { downloadFile } from 'services/api';
import {
  ProductionTaskListDS,
  ProductionTaskQueryDS,
  ModalDS,
  ItemLineListDS,
  StepLineListDS,
} from '@/stores/productionTaskDS';
import codeConfig from '@/common/codeConfig';

import {
  releaseTask,
  runTask,
  pauseTask,
  unholdTask,
  holdTask,
  cancelTask,
  closeTask,
  queryReportData,
  adjustTask,
  updateTaskProcessedTime,
} from '@/services/taskService';
import TabComponent from './TabComponent';
import LineList from './LineList';
import AdjustHourLine from './AdjustHourLine';
import './style.less';

const organizationId = getCurrentOrganizationId();

const { common } = codeConfig.code;

const preCode = 'lmes.productionTask';
const tpmCode = 'lmes.tpmTask';
const { TabPane } = Tabs;
const modalKey = Modal.key();
const tableRef = React.createRef();
const lineTableRef = React.createRef();
const maxLineShowLength = 3;

const queryFactory = () => new DataSet(ProductionTaskQueryDS());

const ProductionTask = ({
  history,
  location,
  dispatch,
  taskList,
  paginations,
  lineList,
  linePaginations,
}) => {
  const queryDS = useDataSet(queryFactory, ProductionTask);
  const listDS = useMemo(() => new DataSet(ProductionTaskListDS()), []);
  const modalDS = useMemo(() => new DataSet(ModalDS()), []);
  const itemLineListDS = useMemo(() => new DataSet(ItemLineListDS()), []);
  const stepLineListDS = useMemo(() => new DataSet(StepLineListDS()), []);

  const [showFlag, setShowFlag] = useState(false);
  const [showLine, setShowLine] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [workerObj, setWorkerObj] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [size, setSize] = useState(100);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [currentLinePage, setLineCurrentPage] = useState(1);
  const [lineSize, setLineSize] = useState(100);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [currentLineType, setCurrentLineType] = useState('item');
  const [checkValues, setCheckValues] = useState([]);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    async function defaultLovSetting() {
      // const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      // if (getResponse(res)) {
      //   if (res && res.content && res.content[0]) {
      //     queryDS.current.set('organizationObj', {
      //       organizationId: res.content[0].organizationId,
      //       organizationName: res.content[0].organizationName,
      //     });
      //   }
      // }
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes)) {
        if (workerRes && workerRes.content && workerRes.content[0]) {
          setWorkerObj(workerRes.content[0]);
        }
      }
      await paramSetting();
    }
    async function paramSetting() {
      if (location) {
        const { search = {} } = location;
        const params = search ? queryString.parse(search) : {};
        if (params.moId) {
          queryDS.current.set('sourceDocObj', {
            documentId: params.moId,
            documentNum: params.moNum,
          });
          handleSearch();
        }
      }
    }
    defaultLovSetting();
  }, [queryDS, location]);

  useEffect(() => {
    const myQuery = sessionStorage.getItem('productionTaskRefresh') || false;
    if (myQuery) {
      listDS.queryParameter = {
        ...queryDS.current.toJSONData(),
      };
      listDS.query().then((res) => {
        sessionStorage.removeItem('productionTaskRefresh');
        if (res && res.content) {
          setDataSource(res.content);
          setTotalElements(res.totalElements || 0);
          calcTableHeight(res.content.length);
        }
      });
    } else {
      setDataSource(taskList);
      setTotalElements(paginations.totalElements || 0);
      setCurrentPage(paginations.currentPage || 1);
      setSize(paginations.size || 100);
      setTableHeight(paginations.tableHeight || 80);
      setLineDataSource(lineList);
      setLineTotalElements(linePaginations.lineTotalElements || 0);
      setLineCurrentPage(linePaginations.currentLinePage || 1);
      setLineSize(linePaginations.lineSize || 100);
      setLineTableHeight(linePaginations.lineTableHeight || 80);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
      calcLineTableHeight(lineDataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource, lineDataSource]);

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="taskObj" noCache key="taskObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Select name="taskStatus" key="taskStatus" />,
      <Lov name="productObj" noCache key="productObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Lov name="workcellObj" noCache key="workcellObj" />,
      <Lov name="taskTypeObj" noCache key="taskTypeObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="workerGroupObj" noCache key="workerGroupObj" />,
      <Lov name="sourceTaskObj" noCache key="sourceTaskObj" />,
      <TextField name="taskGroup" key="taskGroup" />,
      <Lov name="sourceDocTypeObj" noCache key="sourceDocTypeObj" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <TextField name="documentLineNum" key="documentLineNum" />,
      <TextField name="operation" key="operation" />,
      <DateTimePicker name="startDateStart" key="startDateStart" />,
      <DateTimePicker name="startDateEnd" key="startDateEnd" />,
      <DateTimePicker name="endDateStart" key="endDateStart" />,
      <DateTimePicker name="endDateEnd" key="endDateEnd" />,
      <DateTimePicker name="actualStartTimeLeft" key="actualStartTimeLeft" />,
      <DateTimePicker name="actualStartTimeRight" key="actualStartTimeRight" />,
    ];
  }

  const tabProps = {
    tableRef,
    tabType: 'main',
    dataSource,
    showLoading,
    tableHeight,
    totalElements,
    size,
    currentPage,
    checkValues,
    onToDetailPage: handleToDetailPage,
    onPageChange: handlePageChange,
    onRowChange: handleRowChange,
    onCheckCell: handleCheckCell,
    onCheckAllChange: handleCheckAllChange,
  };

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.taskId}
        checked={checkValues.findIndex((i) => i.taskId === rowData.taskId) !== -1}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckboxChange(value, rowData) {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.taskId === rowData.taskId),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: <TabComponent {...tabProps} tabType="main" />,
      },
      {
        code: 'execute',
        title: '执行',
        component: <TabComponent {...tabProps} tabType="execute" />,
      },
    ];
  }

  const lineTabProps = {
    lineDataSource,
    lineTotalElements,
    lineTableRef,
    currentLinePage,
    lineSize,
    lineLoading,
    lineTableHeight,
    onLinePageChange: handleLinePageChange,
  };

  /**
   *tab数组
   * @returns
   */
  function lineTabsArr() {
    return [
      {
        code: 'item',
        title: '物料',
        component: <LineList {...lineTabProps} tabType="item" />,
      },
      {
        code: 'step',
        title: '步骤',
        component: <LineList {...lineTabProps} tabType="step" />,
      },
    ];
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = queryDS.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100, flag) {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLine({});
    listDS.queryParameter = {
      ...queryDS.current.toJSONData(),
      page,
      size: pageSize,
    };
    if (flag) {
      setCurrentPage(1);
    }
    setShowLoading(true);
    const res = await listDS.query();
    setShowLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lmes-production-task-content')[0];
    const queryContainer = document.getElementById('productionTaskHeaderQuery');
    const lineContainer = document.getElementById('production-task-line-table-wrapper');
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 130;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  // 页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    setShowLine({});
    handleSearch(pageValue - 1, pageSizeValue);
  }

  async function handleRowChange(rec) {
    setShowLine(rec);
    handleLineSearch(rec, currentLineType);
  }

  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(showLine, currentLineType, pageValue - 1, pageSizeValue);
  }

  async function handleLineSearch(rec, lineType, page, pageSize) {
    const params = {
      taskId: !isEmpty(rec) ? rec.taskId : showLine.taskId,
      page,
      size: pageSize,
    };
    itemLineListDS.queryParameter = params;
    setLineLoading(true);
    let lineRes = {};
    if (lineType === 'step') {
      stepLineListDS.queryParameter = params;
      lineRes = await stepLineListDS.query();
    } else {
      itemLineListDS.queryParameter = params;
      lineRes = await itemLineListDS.query();
    }
    setLineLoading(false);
    if (lineRes && lineRes.content) {
      setLineDataSource(lineRes.content);
      setLineTotalElements(lineRes.totalElements || 0);
      calcLineTableHeight(lineRes.content.length);
      calcTableHeight(dataSource.length);
    }
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = maxLineShowLength * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  /**
   * 重置
   */
  function handleReset() {
    queryDS.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(e, url, params) {
    if (e) {
      e.stopPropagation();
    }
    dispatch({
      type: 'productionTask/updateState',
      payload: {
        taskList: dataSource,
        paginations: {
          currentPage,
          size,
          totalElements,
          tableHeight,
        },
        lineList: lineDataSource,
        linePaginations: {
          currentLinePage,
          lineSize,
          lineTotalElements,
          lineTableHeight,
        },
      },
    });
    history.push({
      pathname: url,
      state: params,
    });
  }

  async function actionSuccess() {
    notification.success();
    setShowLoading(true);
    const dataRes = await listDS.query();
    setShowLoading(false);
    if (dataRes && dataRes.content) {
      setDataSource(dataRes.content);
      setTotalElements(dataRes.totalElements || 0);
      calcTableHeight(dataRes.content.length);
      setCheckValues([]);
    }
  }

  /**
   *下达
   */
  function handleRelease() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.taskStatus === 'NEW')) {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.submitLimit`)
          .d('只有新增状态的任务才允许下达！'),
      });
      return;
    }
    const ids = checkValues.map((item) => item.taskId);
    releaseTask(ids).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        actionSuccess();
      }
    });
  }

  /**
   *运行
   */
  function handleRun() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      !checkValues.every(
        (item) =>
          item.taskStatus === 'RELEASED' ||
          item.taskStatus === 'DISPATCHED' ||
          item.taskStatus === 'QUEUING' ||
          item.taskStatus === 'PAUSE'
      )
    ) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.runLimit`)
          .d('只有已下达、已分派、排队中和暂停状态的生产任务才允许运行！'),
      });
      return;
    }
    const ids = checkValues.map((item) => item.taskId);
    runTask({
      taskIds: ids,
      worker: workerObj.workerCode,
      workerId: workerObj.workerId,
    }).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        actionSuccess();
      }
    });
  }

  /**
   *暂停
   */
  function handlePause() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.taskStatus === 'RUNNING')) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.pauseLimit`)
          .d('只有运行中的生产任务才允许暂停！'),
      });
      return;
    }
    const ids = checkValues.map((item) => item.taskId);
    pauseTask(ids).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        actionSuccess();
      }
    });
  }

  /**
   *复原
   */
  function handleRestore() {
    const ids = checkValues.map((item) => item.taskId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.taskStatus === 'PENDING')) {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.restoreLimit`)
          .d('只有已暂挂状态的任务才允许复原！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${tpmCode}.view.message.restoreTask`).d('是否复原任务？')}</p>,
      onOk: () =>
        unholdTask(ids).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            actionSuccess();
          }
        }),
    });
  }

  /**
   *暂挂
   */
  async function handlePending() {
    const ids = checkValues.map((item) => item.taskId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      !checkValues.every(
        (item) =>
          item.taskStatus === 'NEW' ||
          item.taskStatus === 'DISPATCHED' ||
          item.taskStatus === 'RELEASED' ||
          item.taskStatus === 'QUEUING' ||
          item.taskStatus === 'RUNNING' ||
          item.taskStatus === 'PAUSE'
      )
    ) {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.pendingLimit`)
          .d('只有新增、已下达、已分派、排队中、运行中、暂停状态的任务才允许暂挂！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${tpmCode}.view.message.pendingTask`).d('是否暂挂任务？')}</p>,
      onOk: () =>
        holdTask(ids).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            actionSuccess();
          }
        }),
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    const ids = checkValues.map((item) => item.taskId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      checkValues.every(
        (item) =>
          item.taskStatus !== 'CANCELLED' &&
          item.taskStatus !== 'CLOSED' &&
          item.taskStatus !== 'COMPLETED'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.cancelTask`).d('是否取消任务？')}</p>,
        onOk: () =>
          cancelTask(ids).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              actionSuccess();
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.cancelLimit`)
          .d('已完成、已取消、已关闭状态的任务不允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    const ids = checkValues.map((item) => item.taskId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      checkValues.every(
        (item) =>
          (item.taskStatus !== 'CANCELLED' && item.taskStatus !== 'CLOSED') ||
          item.taskStatus !== 'NEW'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.closeTask`).d('是否关闭任务？')}</p>,
        onOk: () =>
          closeTask(ids).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              actionSuccess();
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.closeLimit`)
          .d('新增、已取消、已关闭状态的任务不允许关闭！'),
      });
    }
  }

  /**
   * 导出计划表
   */
  async function handleExportPlanReport() {
    if (!queryDS.current.get('organizationId')) {
      notification.warning({
        message: '请输入组织',
      });
      return;
    }
    if (!queryDS.current.get('prodLineId')) {
      notification.warning({
        message: '请输入生产线',
      });
      return;
    }
    if (!queryDS.current.get('taskStatus').length) {
      notification.warning({
        message: '请选择任务状态',
      });
      return;
    }
    if (
      queryDS.current.toJSONData().taskStatus.length !== 1 ||
      (queryDS.current.toJSONData().taskStatus.length === 1 &&
        queryDS.current.toJSONData().taskStatus[0] !== 'RELEASED')
    ) {
      notification.warning({
        message: '任务状态必须仅为已下达',
      });
      return;
    }
    if (!queryDS.current.get('startDateStart')) {
      notification.warning({
        message: '请输入计划开始>=',
      });
      return;
    }

    const startMin = moment(queryDS.current.get('startDateStart')).format(DEFAULT_DATETIME_FORMAT);
    const startMax = moment(queryDS.current.get('startDateEnd')).format(DEFAULT_DATETIME_FORMAT);
    const endMin = moment(queryDS.current.get('endDateStart')).format(DEFAULT_DATETIME_FORMAT);
    const endMax = moment(queryDS.current.get('endDateEnd')).format(DEFAULT_DATETIME_FORMAT);
    if (startMin === startMax && startMin === endMin && startMin === endMax) {
      const res = await queryReportData('HG.LMES.TASK_PRODUCT');
      if (res && !res.failed && res.content && res.content[0]) {
        const { reportUuid } = res.content[0];
        const startDateStart = moment(queryDS.current.get('startDateStart')).format(DATETIME_MIN);
        const endDateEnd = moment(queryDS.current.get('startDateStart')).format(DATETIME_MAX);
        const orgId = queryDS.current.get('organizationId');
        const prodLineId = queryDS.current.get('prodLineId');
        const prodLineName = queryDS.current.get('produceLineName');
        downloadFile({
          requestUrl: `/hrpt/v1/${getCurrentOrganizationId()}/reports/export/${reportUuid}/XLSX?access_token=${getAccessToken()}&f-templateCode=HGLMES_TASK_PRODUCT%400&f-lang=zh_CN`,
          queryParams: [
            { name: 'statusList', value: 'RELEASED' },
            { name: 'startDateStart', value: startDateStart },
            { name: 'endDateEnd', value: endDateEnd },
            { name: 'organizationId', value: orgId },
            { name: 'prodLineId', value: prodLineId },
            { name: 'prodLineName', value: prodLineName },
          ],
        });
      }
    } else {
      notification.warning({
        message: '计划开始>=、 计划开始<=、 计划结束>=、 计划结束<=必须为同一时间',
      });
    }
  }

  function handleAdjustModalOpen() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    Modal.open({
      key: modalKey,
      title: '任务等级',
      className: 'production-task-adjust-modal',
      closable: true,
      children: (
        <div>
          <Select dataSet={modalDS} name="taskRank" />
          <span style={{ color: 'red', marginLeft: 16 }}>任务紧急程度从0-4依次递增</span>
        </div>
      ),
      onOk: handleAdjust,
    });
  }

  // 工时调整
  function handleAdjustHourModalOpen() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    Modal.open({
      key: modalKey,
      title: '工时调整',
      className: 'production-task-adjust-hour-modal',
      closable: true,
      children: (
        <>
          {
            checkValues.map(rec => (
              <AdjustHourLine {...rec} onModifyHour={(value) => handleModifyHour(value, rec)} />
            ))
          }
        </>
      ),
      onOk: handleAdjustHour,
    });
  }

  function handleModifyHour(value, record) {
    const _checkValues = [...checkValues];
    _checkValues.forEach(v => {
      if(v.taskId === record.taskId) {
        v.changedHour = value;
      };
    });
    setCheckValues(_checkValues);
  }

  async function handleAdjustHour() {
    const params = checkValues.map(v => ({taskId: v.taskId, processedTime: v.changedHour}));
    const res = await updateTaskProcessedTime(params);
    if(getResponse(res)) {
      notification.success({
        message: '更新成功',
      });
      handleSearch();
    }
  }

  async function handleAdjust() {
    const validateValue = await modalDS.validate(false, false);
    if (!validateValue) return false;
    const arr = [];
    checkValues.forEach((i) => {
      arr.push({
        taskId: i.taskId,
        taskRank: modalDS.current.get('taskRank'),
      });
    });
    const res = await adjustTask(arr);
    if (getResponse(res)) {
      notification.success();
      await listDS.query();
    }
  }

  function handleLineTabChange(type) {
    setCurrentLineType(type);
    handleLineSearch(showLine, type);
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.productionTask`).d('生产任务')}>
        <Button
          icon="add"
          color="primary"
          onClick={(e) => handleToDetailPage(e, '/lmes/production-task/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/tasks/produce/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handleClose}>{intl.get('hzero.common.button.close').d('关闭')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handlePending}>{intl.get('lmes.common.button.pending').d('暂挂')}</Button>
        <Button onClick={handleRestore}>{intl.get('lmes.common.button.restore').d('复原')}</Button>
        <Button onClick={handlePause}>{intl.get('lmes.common.button.pause').d('暂停')}</Button>
        <Button onClick={handleRun}>{intl.get('lmes.common.button.run').d('运行')}</Button>
        <Button onClick={handleRelease}>{intl.get('lmes.common.button.release').d('下达')}</Button>
        <Button onClick={handleAdjustModalOpen}>
          {intl.get('lmes.common.button.adjust').d('调整')}
        </Button>
        <Button onClick={handleAdjustHourModalOpen}>
          {intl.get('lmes.common.button.adjustHour').d('工时调整')}
        </Button>
        <ButtonPermission
          icon="export"
          type="c7n-pro"
          onClick={handleExportPlanReport}
          permissionList={[
            {
              code: `hlos.lmes.production.task.ps.hg.button.exportreport`,
              type: 'button',
              meaning: '导出计划表',
            },
          ]}
        >
          {intl.get('lmes.common.button.export.plan.report').d('导出计划表')}
        </ButtonPermission>
      </Header>
      <Content className="lmes-production-task-content">
        <div
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
          id="productionTaskHeaderQuery"
        >
          <Form dataSet={queryDS} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey="main">
          {tabsArr().map((tab) => (
            <TabPane
              tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
              key={tab.code}
            >
              {tab.component}
            </TabPane>
          ))}
        </Tabs>
        <div id="production-task-line-table-wrapper">
          {!isEmpty(showLine) && (
            <Tabs defaultActiveKey="item" onChange={handleLineTabChange}>
              {lineTabsArr().map((tab) => (
                <TabPane
                  tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                  key={tab.code}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          )}
        </div>
      </Content>
    </Fragment>
  );
};
export default connect(({ productionTask }) => ({
  taskList: productionTask?.taskList || [],
  lineList: productionTask?.lineList || [],
  paginations: productionTask?.paginations || {},
  linePaginations: productionTask?.linePaginations || {},
}))(ProductionTask);
