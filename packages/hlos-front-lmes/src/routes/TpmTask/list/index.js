/**
 * @Description: TPM任务管理信息--头table
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:58:47
 * @LastEditors: yu.na
 */

import React, { createRef, Fragment, useEffect, useMemo, useState } from 'react';
import {
  Lov,
  Form,
  Button,
  DatePicker,
  DateTimePicker,
  TextField,
  Select,
  PerformanceTable,
  Pagination,
  Modal,
  DataSet,
  CheckBox,
} from 'choerodon-ui/pro';
import { isUndefined, isEmpty } from 'lodash';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { TpmTaskQueryDS, TpmTaskListDS, TpmLineListDS } from '@/stores/tpmTaskDS';
import codeConfig from '@/common/codeConfig';
import {
  releaseTask,
  runTask,
  pauseTask,
  unholdTask,
  holdTask,
  cancelTask,
  closeTask,
} from '@/services/taskService';
import LineList from './LineList';
import './style.less';

const organizationId = getCurrentOrganizationId();
const { common } = codeConfig.code;
const preCode = 'lmes.tpmTask';
const tableRef = createRef();
const lineTableRef = createRef();
const maxLineShowLength = 3;
const queryFactory = () => new DataSet(TpmTaskQueryDS());

const TpmTask = ({ history }) => {
  const queryDS = useDataSet(queryFactory, TpmTask);
  const listDS = useMemo(() => new DataSet(TpmTaskListDS()), []);
  const lineDS = useMemo(() => new DataSet(TpmLineListDS()), []);
  const [showFlag, setShowFlag] = useState(false);
  const [showLine, setShowLine] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
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
  const [checkValues, setCheckValues] = useState([]);
  const [workerObj, setWorkerObj] = useState({});

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    queryDS.create({}, 0);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          queryDS.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }

      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes)) {
        if (workerRes && workerRes.content && workerRes.content[0]) {
          setWorkerObj(workerRes.content[0]);
        }
      }
    }

    defaultLovSetting();
  }, [queryDS]);

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
      <Lov name="resourceObj" noCache key="resourceObj" />,
      <Select name="taskStatus" key="taskStatus" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Lov name="workcellObj" noCache key="workcellObj" />,
      <Lov name="taskTypeObj" noCache key="taskTypeObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="workerGroupObj" noCache key="workerGroupObj" />,
      <TextField name="taskGroup" key="taskGroup" />,
      <Select name="inspectedResult" key="inspectedResult" />,
      <DatePicker name="calendarDay" key="calendarDay" />,
      <Select name="calendarShiftCode" key="calendarShiftCode" />,
      <Lov name="sourceDocTypeObj" noCache key="sourceDocTypeObj" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <DateTimePicker name="startDateStart" key="startDateStart" />,
      <DateTimePicker name="startDateEnd" key="startDateEnd" />,
      <DateTimePicker name="endDateStart" key="endDateStart" />,
      <DateTimePicker name="endDateEnd" key="endDateEnd" />,
    ];
  }

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={checkValues.length > 0 && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'taskId',
        key: 'taskId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) =>
          handleCheckCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${preCode}.org`).d('组织'),
        dataIndex: 'organization',
        key: 'organization',
        width: 128,
        fixed: true,
        resizable: true,
        render: ({ rowData }) =>
          `${rowData.organizationCode || ''} ${rowData.organizationName || ''}`,
      },
      {
        title: intl.get(`${preCode}.taskNum`).d('任务号'),
        dataIndex: 'taskNum',
        key: 'taskNum',
        width: 128,
        fixed: true,
        resizable: true,
        render: ({ rowData, dataIndex }) => linkRenderer(rowData, dataIndex),
      },
      {
        title: intl.get(`${preCode}.taskStatus`).d('任务状态'),
        dataIndex: 'taskStatusMeaning',
        key: 'taskStatusMeaning',
        width: 90,
        fixed: true,
        resizable: true,
        render: ({ rowData, dataIndex }) => statusRender(rowData.taskStatus, rowData[dataIndex]),
      },
      {
        title: intl.get(`${preCode}.description`).d('描述'),
        dataIndex: 'description',
        key: 'description',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.taskType`).d('任务类型'),
        dataIndex: 'taskTypeName',
        key: 'taskTypeName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.resourceClass`).d('资源分类'),
        dataIndex: 'resourceClassMeaning',
        key: 'resourceClassMeaning',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.resource`).d('资源'),
        dataIndex: 'resourceName',
        key: 'resourceName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.prodLine`).d('生产线'),
        dataIndex: 'produceLineName',
        key: 'produceLineName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.equipment`).d('设备'),
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.workcell`).d('工位'),
        dataIndex: 'workcellName',
        key: 'workcellName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.workGroup`).d('班组'),
        dataIndex: 'workerGroupName',
        key: 'workerGroupName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.declare`).d('提报人'),
        dataIndex: 'declare',
        key: 'declare',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.supervisor`).d('管理员'),
        dataIndex: 'supervisor',
        key: 'supervisor',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.worker`).d('操作工'),
        dataIndex: 'workerName',
        key: 'workerName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.tpmResult`).d('TPM结果'),
        dataIndex: 'inspectedResultMeaning',
        key: 'inspectedResultMeaning',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inspectionGroup`).d('检验组'),
        dataIndex: 'inspectionGroupName',
        key: 'inspectionGroupName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.exception`).d('异常'),
        dataIndex: 'exceptionName',
        key: 'exceptionName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.taskGroup`).d('任务组'),
        dataIndex: 'taskGroup',
        key: 'taskGroup',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.location`).d('地点'),
        dataIndex: 'locationName',
        key: 'locationName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
        dataIndex: 'outsideLocation',
        key: 'outsideLocation',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.calendarDay`).d('指定日期'),
        dataIndex: 'calendarDay',
        key: 'calendarDay',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.calendarShift`).d('指定班次'),
        dataIndex: 'calendarShiftCodeMeaning',
        key: 'calendarShiftCodeMeaning',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
        dataIndex: 'planStartTime',
        key: 'planStartTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
        dataIndex: 'planEndTime',
        key: 'planEndTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.actualStartDate`).d('实际开始时间'),
        dataIndex: 'actualStartTime',
        key: 'actualStartTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.actualEndDate`).d('实际结束时间'),
        dataIndex: 'actualEndTime',
        key: 'actualEndTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.planProcessTime`).d('计划处理时间'),
        dataIndex: 'planProcessTime',
        key: 'planProcessTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.processedTime`).d('实际处理时间'),
        dataIndex: 'processedTime',
        key: 'processedTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.referenceDoc`).d('参考文件'),
        dataIndex: 'referenceDocument',
        key: 'referenceDocument',
        width: 200,
        resizable: true,
        render: ({ rowData, dataIndex }) => commonRenderer(rowData, dataIndex),
      },
      {
        title: intl.get(`${preCode}.instruction`).d('操作说明'),
        dataIndex: 'instruction',
        key: 'instruction',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.picture`).d('图片'),
        dataIndex: 'pictureIds',
        key: 'pictureIds',
        width: 128,
        resizable: true,
        render: ({ rowData, dataIndex }) => commonRenderer(rowData, dataIndex),
      },
      {
        title: intl.get(`${preCode}.priority`).d('优先级'),
        dataIndex: 'priority',
        key: 'priority',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
        dataIndex: 'printedFlag',
        key: 'printedFlag',
        align: 'center',
        width: 70,
        resizable: true,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${preCode}.printedDate`).d('打印时间'),
        dataIndex: 'printedDate',
        key: 'printedDate',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        dataIndex: 'documentTypeName',
        key: 'documentTypeName',
        width: 106,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        dataIndex: 'documentNum',
        key: 'documentNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
        dataIndex: 'docProcessRule',
        key: 'docProcessRule',
        width: 128,
        resizable: true,
        render: ({ rowData, dataIndex }) => commonRenderer(rowData, dataIndex),
      },
      {
        title: intl.get(`${preCode}.remark`).d('备注'),
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
        resizable: true,
      },
    ];
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.taskId}
        checked={checkValues.findIndex((i) => i.taskId === rowData.taskId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
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

  function linkRenderer(record, dataIndex) {
    return (
      <a onClick={() => handleToDetailPage(`/lmes/tpm-task/detail/${record.taskId}`)}>
        {record[dataIndex]}
      </a>
    );
  }

  function commonRenderer(record, dataIndex) {
    return <a>{record[dataIndex]}</a>;
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
      taskStatus: fieldsValue?.taskStatus.join(),
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
    if (flag) {
      setCurrentPage(1);
    }
    listDS.queryParameter = {
      ...queryDS.current.toJSONData(),
      page,
      size: pageSize,
    };
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
    const pageContainer = document.getElementsByClassName('lmes-tpm-task-content')[0];
    const queryContainer = document.getElementById('tpmTaskHeaderQuery');
    const lineContainer = document.getElementById('tpm-task-line-table-wrapper');
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 75;
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
    handleLineSearch(rec);
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
    handleLineSearch(showLine, pageValue - 1, pageSizeValue);
  }

  async function handleLineSearch(rec, page, pageSize) {
    const params = {
      taskId: !isEmpty(rec) ? rec.taskId : showLine.taskId,
      page,
      size: pageSize,
    };
    lineDS.queryParameter = params;
    setLineLoading(true);
    const lineRes = await lineDS.query();
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
      setLineTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
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
  function handleToDetailPage(url) {
    history.push(url);
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
          .get(`${preCode}.view.message.submitLimit`)
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
        handleSearch(0, size, true);
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
          .d('只有已下达、已分派、排队中和暂停状态的TPM任务才允许运行！'),
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
        handleSearch(0, size, true);
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
          .d('只有运行中的TPM任务才允许暂停！'),
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
        handleSearch(0, size, true);
      }
    });
  }

  /**
   *复原
   */
  function handleRestore() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.taskStatus === 'PENDING')) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.restoreLimit`)
          .d('只有已暂挂状态的任务才允许复原！'),
      });
      return;
    }
    const ids = checkValues.map((item) => item.taskId);
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.restoreTask`).d('是否复原任务？')}</p>,
      onOk: () =>
        unholdTask(ids).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            handleSearch(0, size, true);
          }
        }),
    });
  }

  /**
   *暂挂
   */
  async function handlePending() {
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
          .get(`${preCode}.view.message.pendingLimit`)
          .d('只有新增、已下达、已分派、排队中、运行中、暂停状态的任务才允许暂挂！'),
      });
      return;
    }
    const ids = checkValues.map((item) => item.taskId);
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.pendingTask`).d('是否暂挂任务？')}</p>,
      onOk: () =>
        holdTask(ids).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            handleSearch(0, size, true);
          }
        }),
    });
  }

  /**
   *取消
   */
  function handleCancel() {
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
      const ids = checkValues.map((item) => item.taskId);
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.cancelTask`).d('是否取消任务？')}</p>,
        onOk: () =>
          cancelTask(ids).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              handleSearch(0, size, true);
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('已完成、已取消、已关闭状态的任务不允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
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
      const ids = checkValues.map((item) => item.taskId);
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeTask`).d('是否关闭任务？')}</p>,
        onOk: () =>
          closeTask(ids).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              handleSearch(0, size, true);
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('新增、已取消、已关闭状态的任务不允许关闭！'),
      });
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.tpmTask`).d('TPM任务')}>
        {/* <Button */}
        {/* icon="add" */}
        {/* color="primary" */}
        {/* onClick={() => handleToDetailPage('/lmes/tpm-task/create')} */}
        {/* > */}
        {/* {intl.get('hzero.common.button.create').d('新建')} */}
        {/* </Button> */}
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/tasks/tpm/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handleClose}>{intl.get('hzero.common.button.close').d('关闭')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handlePending}>{intl.get('lmes.common.button.pending').d('暂挂')}</Button>
        <Button onClick={handleRestore}>{intl.get('lmes.common.button.restore').d('复原')}</Button>
        <Button onClick={handlePause}>{intl.get('lmes.common.button.pause').d('暂停')}</Button>
        <Button onClick={handleRun}>{intl.get('lmes.common.button.run').d('运行')}</Button>
        <Button onClick={handleRelease}>{intl.get('lmes.common.button.release').d('下达')}</Button>
      </Header>
      <Content className="lmes-tpm-task-content">
        <div
          id="tpmTaskHeaderQuery"
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
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
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={columns()}
          height={tableHeight}
          loading={showLoading}
          onRowClick={handleRowChange}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        <div id="tpm-task-line-table-wrapper">
          {!isEmpty(showLine) && (
            <LineList
              lineTableRef={lineTableRef}
              lineDataSource={lineDataSource}
              lineTotalElements={lineTotalElements}
              lineSize={lineSize}
              lineTableHeight={lineTableHeight}
              currentLinePage={currentLinePage}
              lineLoading={lineLoading}
              onLinePageChange={handleLinePageChange}
            />
          )}
        </div>
      </Content>
    </Fragment>
  );
};

export default TpmTask;
