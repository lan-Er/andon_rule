/*
 * @Description: 转移单平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-06 17:27:09
 * @LastEditors: Please set LastEditors
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  PerformanceTable,
  Pagination,
  Button,
  Tabs,
  DataSet,
  CheckBox,
  Lov,
  Select,
  DateTimePicker,
} from 'choerodon-ui/pro';
import { connect } from 'dva';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  getResponse,
  getAccessToken,
  getRequestId,
} from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { HZERO_RPT, API_HOST } from 'utils/config';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Button as ButtonPermission } from 'components/Permission';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData, queryReportData } from 'hlos-front/lib/services/api';
import moment from 'moment';
import { isEmpty } from 'lodash';

import { queryDocumentType } from '@/services/api';
import { transferRequestPlatformDS, transferRequestLineDS } from '@/stores/transferRequestDS';
import codeConfig from '@/common/codeConfig';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';

import { LineTable } from './lineTable';
import '../style/index.less';

const preCode = 'lwms.transferRequestPlatform';
const commonPrefix = 'lwms.common';
const intlPrefix = 'lwms.transferRequestPlatform.model';
const commonIntlPrefix = 'lwms.common.model';
const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;
const { common } = codeConfig.code;
const headDS = new DataSet(transferRequestPlatformDS());
const lineDS = new DataSet(transferRequestLineDS());

/**
 *设置默认查询条件
 */
async function setDefaultDSValue(ds) {
  const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
  if (getResponse(res)) {
    if (res && Array.isArray(res.content) && ds.queryDataSet && ds.queryDataSet.current) {
      ds.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationCode: res.content[0].organizationCode,
        organizationName: res.content[0].organizationName,
      });
    }
  }
}

function TransferRequest(props) {
  const {
    history,
    dispatch,
    headList,
    lineList,
    pagination,
    linePagination,
    headRequestId,
  } = props;
  const [onProcess, toggleOnProcess] = useState(false);
  const [headId, setHeadId] = useState(null);
  const [worker, setWorker] = useState({});
  const [showFlag, setShowFlag] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [currentLinePage, setLineCurrentPage] = useState(1);
  const [lineSize, setLineSize] = useState(10);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const maxLineShowLength = 3;

  useDataSetEvent(headDS.queryDataSet, 'update', ({ record, name }) => {
    if (name === 'organizationObj') {
      record.set('warehouseObj', null);
    }
    if (name === 'toOrganizationObj') {
      record.set('toWarehouseObj', null);
    }
  });

  useEffect(() => {
    async function queryDefaultWorker() {
      const res = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
      if (getResponse(res) && !res.failed && res.content && res.content[0]) {
        setWorker(res.content[0]);
      }
    }
    queryDefaultWorker();
    const myQuery = sessionStorage.getItem('transferRequestParentQuery') || false;
    if (location.pathname === '/lwms/transfer-request-platform/list' && myQuery) {
      handleSearch(1, 10, true).then(() => {
        sessionStorage.removeItem('transferRequestParentQuery');
      });
    } else {
      setDataSource(headList);
      setTotalElements(pagination.totalElements || 0);
      setCurrentPage(pagination.currentPage || 1);
      setSize(pagination.size || 10);
      setTableHeight(pagination.tableHeight || 80);
      setLineDataSource(lineList);
      setLineTotalElements(linePagination.lineTotalElements || 0);
      setLineCurrentPage(linePagination.currentLinePage || 1);
      setLineSize(linePagination.lineSize || 10);
      setLineTableHeight(linePagination.lineTableHeight || 80);
      setHeadId(headRequestId || null);
    }
    if (!headDS.current) {
      setDefaultDSValue(headDS);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleResize() {
      calcLineTableHeight(lineDataSource.length);
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource, lineDataSource]);

  // 头表行
  const headColumns = [
    {
      title: (
        <CheckBox
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'requestId',
      key: 'requestId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${commonIntlPrefix}.org`).d('组织'),
      dataIndex: 'organization',
      width: 128,
      resizable: true,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.transferRequestNum`).d('转移单号'),
      dataIndex: 'requestNum',
      width: 128,
      resizable: true,
      fixed: 'left',
      render: ({ rowData }) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClickCapture={(e) => {
            // prevent trigger query line data
            e.stopPropagation();
            // go to detail
            handleGoDetail(rowData);
          }}
        >
          {(rowData && rowData.requestNum) || ''}
        </span>
      ),
    },
    {
      title: intl.get(`${intlPrefix}.transferRequestType`).d('转移单类型'),
      dataIndex: 'requestTypeName',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.transferRequestStatus`).d('转移单状态'),
      dataIndex: 'requestStatus',
      width: 84,
      resizable: true,
      render: ({ rowData }) => statusRender(rowData.requestStatus, rowData.requestStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
      dataIndex: 'warehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
      dataIndex: 'wmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toOrganization`).d('目标组织'),
      dataIndex: 'toOrganization',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
      dataIndex: 'toWarehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
      dataIndex: 'toWmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      dataIndex: 'wmMoveTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.creator`).d('制单员工'),
      dataIndex: 'creator',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.creationDate`).d('制单时间'),
      dataIndex: 'creationDate',
      width: 136,
      align: 'center',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.executedWorker`).d('执行员工'),
      dataIndex: 'executedWorker',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.executedTime`).d('执行时间'),
      dataIndex: 'executedTime',
      width: 136,
      align: 'center',
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      width: 150,
      resizable: true,
      render: ({ rowData }) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClickCapture={(e) => {
            // prevent trigger query line data
            e.stopPropagation();
            // do something here ...
          }}
        >
          {!rowData.docProcessRule || rowData.docProcessRule === 'null'
            ? ''
            : rowData.docProcessRule}
        </span>
      ),
    },
    {
      title: intl.get(`${commonIntlPrefix}.approvalRule`).d('审批策略'),
      dataIndex: 'approvalRule',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.approvalWorkflow`).d('审批工作流'),
      dataIndex: 'approvalWorkflow',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.approvalWorkflow`).d('转移单组'),
      dataIndex: 'requestGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 70,
      render: yesOrNoRender,
      // editor: (record) => (record.editing ? <CheckBox /> : false),
    },
    {
      title: intl.get(`${commonIntlPrefix}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      width: 136,
      align: 'center',
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.externalRequestType`).d('外部类型'),
      dataIndex: 'externalRequestType',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 128,
      resizable: true,
    },
  ];

  const lineProps = {
    lineDataSource,
    lineLoading,
    lineTotalElements,
    lineSize,
    currentLinePage,
    lineTableHeight,
    onPageChange: handleLinePageChange,
  };

  // tab数组
  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: <LineTable {...lineProps} type="main" />,
      },
      {
        code: 'exec',
        title: '执行',
        component: <LineTable {...lineProps} type="exec" />,
      },
    ];
  }

  // 头行点击
  const handleHeadRowClick = (rowData) => {
    // prevent multiple trigger
    if (!onProcess) {
      toggleOnProcess(true);
      const curClickHeadId = rowData.requestId;
      setHeadId(curClickHeadId);
      lineDS.setQueryParameter('requestId', curClickHeadId);
      // lineDS.query().then(() => toggleOnProcess(false));
      handleLineSearch(curClickHeadId);
    }
  };

  /**
   * 跳转详情页面
   * @param record
   */
  const handleGoDetail = (rowData) => {
    dispatch({
      type: 'transferRequest/updateState',
      payload: {
        headList: dataSource,
        pagination: {
          currentPage,
          size,
          totalElements,
          tableHeight,
        },
        lineList: lineDataSource,
        linePagination: {
          currentLinePage,
          lineSize,
          lineTotalElements,
          lineTableHeight,
        },
        headRequestId: headId,
      },
    });
    if (rowData.requestId) {
      history.push({
        pathname: `/lwms/transfer-request-platform/detail/${rowData.requestId}`,
      });
    }
  };

  const handleButtonAction = (actionType) => {
    let warningMsg;
    const type = `transferRequest/${actionType}TR`;
    // const { selected } = headDS;
    let payload = checkValues.map((i) => i.requestId);
    if (actionType === 'delete') {
      payload = checkValues;
    }
    if (actionType === 'executeByRequest') {
      payload = checkValues.map((item) => ({
        requestId: item.requestId,
        requestNum: item.requestNum,
        executedWorkerId: worker.workerId,
        executedWorker: worker.workerCode,
        executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      }));
    }
    const selectedTRStatus = checkValues.map((i) => i.requestStatus);
    // let callback;
    if (actionType === 'create') {
      dispatch({
        type: 'transferRequest/updateState',
        payload: {
          headList: dataSource,
          pagination: {
            currentPage,
            size,
            totalElements,
            tableHeight,
          },
          lineList: lineDataSource,
          linePagination: {
            currentLinePage,
            lineSize,
            lineTotalElements,
            lineTableHeight,
          },
          headRequestId: headId,
        },
      });
      history.push({
        pathname: `/lwms/transfer-request-platform/create`,
      });
      return;
    }
    if (checkValues && checkValues.length === 0) {
      notification.warning({
        message: intl.get(`${intlPrefix}.view.warning.selectOneItem`).d('请至少选择一条单据'),
      });
      return;
    }
    switch (actionType) {
      case 'submit':
        warningMsg = intl
          .get(`${preCode}.view.warning.onlyNewStatusTRCanSubmit`)
          .d('只有“新增”状态的转移单才允许提交');
        if (selectedTRStatus.some((s) => s !== 'NEW')) {
          notification.warning({ message: warningMsg });
          return;
        }
        break;
      case 'delete':
        warningMsg = intl
          .get(`${preCode}.view.warning.onlyNewStatusTRCanDelete`)
          .d('只有“新增”状态的转移单才允许删除');
        if (selectedTRStatus.some((s) => s !== 'NEW')) {
          notification.warning({ message: warningMsg });
          return;
        }
        break;
      case 'cancel':
        warningMsg = intl
          .get(`${preCode}.view.warning.onlyNewAndReleaseStatusTRCanCancel`)
          .d('只有“新增”和“已提交”状态的转移单才允许取消');
        if (selectedTRStatus.some((s) => s !== 'NEW' && s !== 'RELEASED')) {
          notification.warning({ message: warningMsg });
          return;
        }
        break;
      case 'close':
        warningMsg = intl
          .get(`${preCode}.view.warning.newAndCanceledAndClosedStatusTRCanNotClose`)
          .d('“新增”，“已取消”和“已关闭”状态的转移单不允许关闭');
        if (selectedTRStatus.some((s) => s === 'NEW' || s === 'CANCELLED' || s === 'CLOSED')) {
          notification.warning({ message: warningMsg });
          return;
        }
        break;
      default:
    }
    dispatch({
      type,
      payload,
    })
      .then((res) => {
        if (res) {
          notification.success({
            message: intl.get(`${preCode}.view.warning.successfulOperation`).d('操作成功'),
          });
          // headDS.query();
          handleSearch(1, 10, true);
        }
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  };

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  const getExportQueryParams = () => {
    const queryDataDs = headDS && headDS.queryDataSet && headDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
      requestStatus: queryDataDsValue?.requestStatus?.join(),
    };
  };

  const handlePrint = async () => {
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    } else if (checkValues.length > 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.onlyone`).d('只能选择一条数据'),
      });
      return;
    }
    const { requestNum, requestTypeId } = checkValues[0];

    let reportCode = null;
    if (!isEmpty(requestTypeId)) {
      const documentType = await queryDocumentType({ documentTypeId: requestTypeId });
      if (documentType && documentType.content && documentType.content.length > 0) {
        const { printTemplate } = documentType.content[0] || {};
        reportCode = printTemplate;
      }
    }
    if (isEmpty(reportCode)) {
      notification.error({
        message: intl.get(`${preCode}.message.validation.print`).d('单据类型未关联打印模板'),
      });
      return;
    }
    const res = await queryReportData(reportCode);
    if (res && res.content && res.content[0]) {
      const { reportUuid } = res.content[0];
      const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
      const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&requestNum=${requestNum}`;
      window.open(requestUrl);
    }
  };

  // render buttons
  const renderFunctionButtons = () => (
    <Fragment>
      <ButtonPermission
        type="c7n-pro"
        icon="add"
        color="primary"
        onClick={() => handleButtonAction('create')}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.create',
            type: 'button',
            meaning: '新建',
          },
        ]}
      >
        {intl.get('hzero.common.button.create').d('新建')}
      </ButtonPermission>
      <ExcelExport
        requestUrl={`${HLOS_LWMS}/v1/${organizationId}/request-headers/transfer/excel`}
        queryParams={getExportQueryParams}
      />
      <ButtonPermission
        type="c7n-pro"
        onClick={() => handleButtonAction('close')}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.close',
            type: 'button',
            meaning: '关闭',
          },
        ]}
      >
        {intl.get('hzero.common.button.close').d('关闭')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={() => handleButtonAction('cancel')}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.cancel',
            type: 'button',
            meaning: '取消',
          },
        ]}
      >
        {intl.get('hzero.common.button.cancel').d('取消')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={() => handleButtonAction('delete')}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.delete',
            type: 'button',
            meaning: '删除',
          },
        ]}
      >
        {intl.get('hzero.common.btn.delete').d('删除')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={() => handleButtonAction('submit')}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.submit-button',
            type: 'button',
            meaning: '提交',
          },
        ]}
      >
        {intl.get('hzero.common.button.submit').d('提交')}
      </ButtonPermission>
      <Button onClick={handlePrint}>
        {intl.get(`${preCode}.reportQuery.option.print`).d('打印')}
      </Button>
      <ButtonPermission
        type="c7n-pro"
        onClick={() => handleButtonAction('executeByRequest')}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.execute',
            type: 'button',
            meaning: '执行',
          },
        ]}
      >
        {intl.get('hzero.common.button.receive.by.request').d('执行')}
      </ButtonPermission>
    </Fragment>
  );

  const queryFields = () => {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="transferRequestNumObj" noCache key="transferRequestNumObj" />,
      <Lov name="warehouseObj" noCache key="warehouseObj" />,
      <Select name="requestStatusList" key="requestStatusList" />,
      <Lov name="toOrganizationObj" noCache key="toOrganizationObj" />,
      <Lov name="toWarehouseObj" noCache key="toWarehouseObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="requestTypeObj" noCache key="requestTypeObj" />,
      <Lov name="wmMoveTypeObj" noCache key="wmMoveTypeObj" />,
      <Lov name="creatorObj" noCache key="creatorObj" />,
      <DateTimePicker name="startCreationDate" key="startCreationDate" />,
      <DateTimePicker name="endCreationDate" key="endCreationDate" />,
    ];
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  /**
   * 重置
   */
  function handleReset() {
    headDS.queryDataSet.current.reset();
    headDS.queryDataSet.current.set('requestStatusList', []);
  }

  // 头表格页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  }

  // 行表格页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== lineSize) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(headId, pageValue, pageSizeValue);
  }

  /**
   * 头表格查询
   * @param {*} [page=currentPage]
   * @param {*} [pageSize=size]
   * @returns
   */
  async function handleSearch(page = currentPage, pageSize = size, flag = false) {
    // await headDS.query();
    const validateValue = await headDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (flag) {
      setCurrentPage(1);
      setSize(10);
    }
    headDS.setQueryParameter('page', flag ? 0 : page - 1);
    headDS.setQueryParameter('size', flag ? 10 : pageSize);
    setListLoading(true);
    const res = await headDS.query();
    // const res = await queryHeadApi(headDS.queryParameter);
    setListLoading(false);
    if (res && res.content) {
      setHeadId(null);
      setLineDataSource([]);
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  }

  /**
   * 行表格查询
   * @param {*} [requestId=headId]
   * @param {*} [page=currentLinePage]
   * @param {*} [pageSize=lineSize]
   */
  async function handleLineSearch(requestId = headId, page = currentLinePage, pageSize = lineSize) {
    lineDS.setQueryParameter('requestId', requestId);
    lineDS.setQueryParameter('page', page - 1);
    lineDS.setQueryParameter('size', pageSize);
    setLineLoading(true);
    const lineRes = await lineDS.query();
    setLineLoading(false);
    toggleOnProcess(false);
    if (getResponse(lineRes) && lineRes.content && lineRes.content.length) {
      await setLineDataSource(lineRes.content);
      await setLineTotalElements(lineRes.totalElements || 0);
      calcLineTableHeight(lineRes.content.length);
      calcTableHeight(dataSource.length);
    } else {
      await setLineDataSource([]);
      await setLineTotalElements(0);
      calcLineTableHeight(0);
      calcTableHeight(dataSource.length);
    }
  }

  /**
   * 计算头表高度
   * @param {*} dataLength 表格当前查询数据量
   */
  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-trp')[0];
    const queryContainer = document.getElementsByClassName('lwms-trp-header')[0];
    const lineContainer = document.getElementsByClassName('lwms-trp-line-wrapper')[0];
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else if (maxTableHeight < 80) {
      // 当头表高度小于80时重新调整头行表高度
      const lineHeight = lineTableHeight - (80 - maxTableHeight);
      setTableHeight(80);
      setLineTableHeight(lineHeight < 80 ? 80 : lineHeight);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  /**
   * 计算行表格高度
   * @param {*} dataLength
   */
  function calcLineTableHeight(dataLength) {
    const maxTableHeight = maxLineShowLength * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.requestId}
        checked={checkValues.findIndex((i) => i.requestId === rowData.requestId) !== -1}
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
        newCheckValues.findIndex((i) => i.requestId === rowData.requestId),
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

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.transferRequestPlatform`).d('转移单平台')}>
        {renderFunctionButtons()}
      </Header>
      <Content className="lwms-trp">
        <div className="lwms-trp-header">
          <Form dataSet={headDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div className="lwms-trp-header-more-query">
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(1, 10, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          data={dataSource}
          height={tableHeight}
          columns={headColumns}
          loading={listLoading}
          onRowClick={handleHeadRowClick}
        />
        <Pagination
          pageSizeOptions={['10', '100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        {/* <Table
          className="lwms-trp"
          dataSet={headDS}
          columns={headColumns}
          queryFieldsLimit={4}
          columnResizable="true"
          border={false}
          onRow={({ record }) => handleHeadRowClick(record)}
        /> */}
        <div className="lwms-trp-line-wrapper">
          {headId && (
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
          )}
        </div>
      </Content>
    </Fragment>
  );
}

const WrappedComponent = formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`, `${preCode}`],
})(TransferRequest);

export default connect(({ transferRequest }) => ({
  headList: transferRequest?.headList || [],
  lineList: transferRequest?.lineList || [],
  pagination: transferRequest?.pagination || {},
  linePagination: transferRequest?.linePagination || {},
  headRequestId: transferRequest?.headRequestId || null,
}))(WrappedComponent);
