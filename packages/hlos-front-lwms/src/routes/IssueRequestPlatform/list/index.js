/*
 * @Description: 领料单平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-08 16:24:13
 * @LastEditors: mingbo.zhang@hand-china.com
 */
import moment from 'moment';
import React, { useState, useEffect, Fragment } from 'react';
import { Icon } from 'choerodon-ui';
import {
  PerformanceTable,
  Button,
  Tabs,
  DataSet,
  CheckBox,
  Modal,
  Form,
  Lov,
  TextField,
  Select,
  DateTimePicker,
  Pagination,
} from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  getResponse,
  getAccessToken,
  getRequestId,
} from 'utils/utils';
import { isEmpty, cloneDeep } from 'lodash';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { HZERO_RPT, API_HOST } from 'utils/config';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData, queryReportData, userSetting } from 'hlos-front/lib/services/api';

import { issueRequestPlatformDS } from '@/stores/issueRequestDS';
import {
  releaseApi,
  cancelApi,
  closeApi,
  deleteApi,
  executeApi,
  queryHeadApi,
  queryLineApi,
} from '@/services/issueRequestService';
import { queryDocumentType } from '@/services/api';
import codeConfig from '@/common/codeConfig';

import { MainLineTable, ExecLineTable } from './issueRequestLineTable';
import IssueReqCreateModal from './createModal';
import './style.less';

const intlPrefix = 'lwms.issueRequestPlatform';
const commonPrefix = 'lwms.common';
const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;
const { common } = codeConfig.code;
let modal = null;

/**
 *设置默认查询条件
 */
async function setDefaultDSValue(ds) {
  const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
  if (getResponse(res)) {
    if (res && res.content && res.content.length && ds.queryDataSet && ds.queryDataSet.current) {
      ds.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationName: res.content[0].organizationName,
      });
    }
  }
}

const modalKey = Modal.key();

function IssueRequestPlatform({
  dispatch,
  history,
  headList,
  lineList,
  pagination,
  linePagination,
  headRequestId,
}) {
  const headDS = useDataSet(() => new DataSet(issueRequestPlatformDS()), IssueRequestPlatform);
  const [inProgress, setInProgress] = useState(false);
  const [headId, setHeadId] = useState(null);
  const [showFlag, setShowFlag] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTotalElements, setLineTotalElements] = useState(100);
  const [currentLinePage, setLineCurrentPage] = useState(1);
  const [lineSize, setLineSize] = useState(100);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const maxLineShowLength = 3;
  // const [summaryDisabled, setSummaryDisabled] = useState(true);

  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    // bind query event
    headDS.addEventListener('query', handleChangeHeadId);
    setDefaultDSValue(headDS);
    return () => {
      headDS.removeEventListener('query', handleChangeHeadId);
    };
  }, []);

  useEffect(() => {
    const { pathname } = history.location;
    if (pathname && pathname.startsWith('/lwms/issue-request-platform/list')) {
      const isQuery = sessionStorage.getItem('IssueRequestCostCenterCreate') || false;
      const isQueryTwo = sessionStorage.getItem('IssueRequestPlatformProNotLimit') || false;
      if (isQuery || isQueryTwo) {
        handleSearch(1, 100, true).then(() => {
          sessionStorage.removeItem('IssueRequestCostCenterCreate');
          sessionStorage.removeItem('IssueRequestPlatformProNotLimit');
        });
      } else {
        setDataSource(headList);
        setTotalElements(pagination.totalElements || 0);
        setCurrentPage(pagination.currentPage || 1);
        setSize(pagination.size || 100);
        setTableHeight(pagination.tableHeight || 80);
        setLineDataSource(lineList);
        setLineTotalElements(linePagination.lineTotalElements || 0);
        setLineCurrentPage(linePagination.currentLinePage || 1);
        setLineSize(linePagination.lineSize || 100);
        setLineTableHeight(linePagination.lineTableHeight || 80);
        setHeadId(headRequestId || null);
      }
    }
  }, [history]);

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

  function handleChangeHeadId() {
    setHeadId(null);
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

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.requestId}
        checked={checkValues.findIndex((i) => i.requestId === rowData.requestId) !== -1}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  // 头表行
  const headColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
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
      title: intl.get(`${commonPrefix}.organization`).d('组织'),
      dataIndex: 'organization',
      width: 128,
      resizable: true,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.issueRequestNum`).d('领料单号'),
      dataIndex: 'requestNum',
      width: 128,
      resizable: true,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.moNum`).d('MO'),
      dataIndex: 'moNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.assembly`).d('装配件'),
      dataIndex: 'assemblyItemCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.assemblyDescription`).d('装配件描述'),
      dataIndex: 'assemblyItemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.issueRequestType`).d('领料单类型'),
      dataIndex: 'requestTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.issueRequestStatus`).d('领料单状态'),
      dataIndex: 'requestStatusMeaning',
      width: 84,
      align: 'center',
      resizable: true,
      // TODO: add style depending on current state
      render: ({ rowData }) => statusRender(rowData.requestStatus, rowData.requestStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.planDemandDate`).d('需求时间'),
      dataIndex: 'planDemandDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.prodLine`).d('生产线'),
      dataIndex: 'prodLineName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.workcell`).d('工位'),
      dataIndex: 'workcellName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.location`).d('地点'),
      dataIndex: 'locationObj',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.fromWarehouse`).d('发出仓库'),
      dataIndex: 'warehouseName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.fromWMArea`).d('发出货位'),
      dataIndex: 'wmAreaName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestGroup`).d('领料单组'),
      dataIndex: 'requestGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestDepartment`).d('申领部门'),
      dataIndex: 'requestDepartment',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestWorker`).d('申领员工'),
      dataIndex: 'requestWorker',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestReason`).d('领用原因'),
      dataIndex: 'requestReason',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.outerNum`).d('申领单号'),
      dataIndex: 'outerRequestNum',
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
      title: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
      dataIndex: 'costCenterName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      width: 128,
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
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.approvalRule`).d('审批策略'),
      dataIndex: 'approvalRule',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.approvalWorkflow`).d('审批工作流'),
      dataIndex: 'approvalWorkflow',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocTypeName',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
      // editor: (record) => (record.editing ? <CheckBox /> : false),
    },
    {
      title: intl.get(`${commonPrefix}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      width: 136,
      align: 'center',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.externalType`).d('外部类型'),
      dataIndex: 'externalType',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.externalID`).d('外部ID'),
      dataIndex: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonPrefix}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 128,
      resizable: true,
    },
  ];

  const lineProps = {
    dataSource: lineDataSource,
    totalElements: lineTotalElements,
    currentPage: currentLinePage,
    size: lineSize,
    loading: lineLoading,
    tableHeight: lineTableHeight,
    onPageChange: handleLinePageChange,
  };

  // tab数组
  function tabsArr() {
    return [
      { code: 'main', title: '主要', component: <MainLineTable {...lineProps} /> },
      { code: 'exec', title: '执行', component: <ExecLineTable {...lineProps} /> },
    ];
  }

  // 头行点击
  const handleHeadRowClick = (record) => {
    if (!inProgress) {
      setInProgress(true);
      const curClickHeadId = record.requestId; // record.get('requestId');
      setHeadId(curClickHeadId);
      handleLineSearch(curClickHeadId);
    }
  };

  /**
   * @description: 新建打开弹窗
   */
  const handleCreate = () => {
    modal = Modal.open({
      key: modalKey,
      title: '新建领料单',
      footer: null,
      className: 'lwms-issue-request-modal',
      closable: true,
      children: (
        <IssueReqCreateModal history={history} modal={modal} onModalOk={handleChangePage} />
      ),
    });
  };

  const handleChangePage = () => {
    dispatch({
      type: 'issueRequestPlatform/updateState',
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
    };
  };

  // 打印
  const handlePrint = async () => {
    let mulitPrint = false; // 是否批量打印
    let requestIdStr = ''; // 批量打印id字符串
    let requestNumStr = ''; // 批量打印Num字符串
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    } else if (checkValues.length > 1) {
      // notification.error({
      //   message: intl.get(`lwms.common.message.validation.onlyone`).d('只能选择一条数据'),
      // });
      // return;

      // 广日新增多个批量打印逻辑
      let printFlag = true;
      mulitPrint = true;
      requestIdStr = checkValues.map((ele) => ele.requestId).toString();
      requestNumStr = checkValues.map((ele) => ele.requestNum).toString();
      const { shipOrderTypeId } = checkValues[0];
      checkValues.forEach((item) => {
        if (shipOrderTypeId !== item.shipOrderTypeId) {
          printFlag = false;
        }
      });
      if (!printFlag) {
        notification.error({
          message: '所选单据类型不唯一，请重新选择！',
        });
        return;
      }
    }
    // const requestTypeCodeArr = headDS.selected.map((i) => i.data.requestTypeCode);
    // const requestNumArr = headDS.selected.map((i) => i.data.requestNum);

    const { requestId, requestNum, requestTypeId } = checkValues[0] || {};
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
        message: intl
          .get(`${intlPrefix}.message.validation.print`)
          .d('未获取当前单据类型的打印样式'),
      });
      return;
    }
    const res = await queryReportData(reportCode);
    if (res && res.content && res.content.length > 0) {
      const { reportUuid } = res.content[0];
      const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
      if (mulitPrint) {
        const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&requestId=${requestIdStr}&requestNum=${requestNumStr}`;
        window.open(requestUrl);
      } else {
        const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&requestId=${requestId}&requestNum=${requestNum}`;
        window.open(requestUrl);
      }
    }
  };

  // 物料合并打印
  const handleMergePrint = async () => {
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const requestIdString = checkValues.map((ele) => ele.requestId).toString();
    const res = await queryReportData('LWSS.REQUEST_ITEM_MERGE');
    if (res && res.content && res.content.length > 0) {
      const { reportUuid } = res.content[0];
      const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
      const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&requestIdString=${requestIdString}`;
      window.open(requestUrl);
    }
  };

  // 执行
  const handleExecute = async () => {
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const requestIdArr = checkValues.map((i) => i.requestId);
    const requestNumArr = checkValues.map((i) => i.requestNum);
    const res = await userSetting({ defaultFlag: 'Y' });
    const params = [];
    for (let i = 0; i < requestIdArr.length; i++) {
      const obj = {
        requestId: requestIdArr[i],
        requestNum: requestNumArr[i],
        executedWorkerId: res.content[0].workerId,
        executedWorker: res.content[0].workerCode,
        executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      };
      params.push(obj);
    }
    const resp = await executeApi(params);
    getResponse(resp);
    if (resp && !resp.failed) {
      notification.success();
      await handleSearch(1, 100, true);
    }
  };

  // render buttons
  const renderFunctionButtons = () => (
    <Fragment>
      <ButtonPermission
        type="c7n-pro"
        icon="add"
        color="primary"
        onClick={handleCreate}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.create',
            type: 'button',
            meaning: '新建',
          },
        ]}
      >
        {intl.get('hzero.common.button.create').d('新建')}
      </ButtonPermission>
      <ExcelExport
        requestUrl={`${HLOS_LWMS}/v1/${organizationId}/request-headers/issue/excel`}
        queryParams={getExportQueryParams}
      />
      <ButtonPermission
        type="c7n-pro"
        onClick={handleClose}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.close',
            type: 'button',
            meaning: '关闭',
          },
        ]}
      >
        {intl.get('hzero.common.button.close').d('关闭')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={handleCancel}
        loading={cancelLoading}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.cancel',
            type: 'button',
            meaning: '取消',
          },
        ]}
      >
        {intl.get('hzero.common.button.cancel').d('取消')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={handleDelete}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.delete',
            type: 'button',
            meaning: '删除',
          },
        ]}
      >
        {intl.get('hzero.common.btn.delete').d('删除')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={handleRelease}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.release',
            type: 'button',
            meaning: '下达',
          },
          {
            code: 'hlos.warehouse.issue.request.platform.ps.button.release',
            type: 'button',
            meaning: '下达',
          },
        ]}
      >
        {intl.get('hzero.common.button.submit').d('保存')}
      </ButtonPermission>
      {/* <Button disabled={summaryDisabled} onClick={handleSummary}>
        汇总
      </Button> */}
      <Button onClick={handlePrint}>打印</Button>
      <ButtonPermission
        type="c7n-pro"
        onClick={handleExecute}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.execute',
            type: 'button',
            meaning: '执行',
          },
        ]}
      >
        {intl.get('hzero.common.button.trigger').d('执行')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        onClick={handleMergePrint}
        permissionList={[
          {
            code: 'hlos.lwms.issue.request.platform.ps.button.itemmergeprint',
            type: 'button',
            meaning: '物料合并打印',
          },
        ]}
      >
        物料合并打印
      </ButtonPermission>
    </Fragment>
  );

  // 删除
  const handleDelete = async () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    Modal.confirm({
      key: Modal.key(),
      children: (
        <div style={{ fontSize: 15, alignItems: 'center', display: 'flex' }}>
          <Icon type="info-o" style={{ fontSize: 20, color: 'red', marginRight: '10px' }} />
          {intl.get(`${intlPrefix}.view.message.return.confirm`).d('确定删除选中领料单？')}
        </div>
      ),
      cancelText: '否',
      okText: '是',
    }).then(async (button) => {
      if (button === 'ok') {
        const res = await deleteApi(checkValues);
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
        } else if (res && !res.failed) {
          notification.success();
          await handleSearch(1, 100, true);
        }
      }
    });
  };

  // 关闭
  const handleClose = async () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    Modal.confirm({
      key: Modal.key(),
      children: (
        <div style={{ fontSize: 15, alignItems: 'center', display: 'flex' }}>
          <Icon type="info-o" style={{ fontSize: 20, color: 'red', marginRight: '10px' }} />
          {intl.get(`${intlPrefix}.view.message.return.confirm`).d('确定关闭选中领料单？')}
        </div>
      ),
      cancelText: '否',
      okText: '是',
    }).then(async (button) => {
      if (button === 'ok') {
        const ids = checkValues.map((i) => i.requestId);
        const res = await closeApi(ids);
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
        } else if (res && !res.failed) {
          notification.success();
          await handleSearch(1, 100, true);
        }
      }
    });
  };

  // 取消
  const handleCancel = async () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    Modal.confirm({
      key: Modal.key(),
      children: (
        <div style={{ fontSize: 15, alignItems: 'center', display: 'flex' }}>
          <Icon type="info-o" style={{ fontSize: 20, color: 'red', marginRight: '10px' }} />
          {intl.get(`${intlPrefix}.view.message.return.confirm`).d('确定取消选中领料单？')}
        </div>
      ),
      cancelText: '否',
      okText: '是',
    }).then(async (button) => {
      if (button === 'ok') {
        setCancelLoading(true);
        const ids = checkValues.map((i) => i.requestId);
        const res = await cancelApi(ids);
        setCancelLoading(false);
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
        } else if (res && !res.failed) {
          notification.success();
          await handleSearch(1, 100, true);
        }
      }
    });
  };

  // 下达
  const handleRelease = async () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const ids = checkValues.map((i) => i.requestId);
    const res = await releaseApi(ids);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      await handleSearch(1, 100, true);
    }
  };

  // const handleSummary = () => {
  //   const { dispatch } = props;
  //   dispatch(
  //     routerRedux.push({
  //       pathname: `/lwms/issue-request-platform/summary`,
  //     })
  //   );
  // };

  /**
   *查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="issueRequestNumObj" noCache key="issueRequestNumObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <Select name="requestStatusList" key="requestStatusList" />,
      <Lov name="assemblyItemObj" noCache key="assemblyItemObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="requestDepartmentObj" noCache key="requestDepartmentObj" />,
      <Lov name="requestTypeObj" noCache key="requestTypeObj" />,
      <Lov name="wmMoveTypeObj" noCache key="wmMoveTypeObj" />,
      <Lov name="creatorObj" noCache key="creatorObj" />,
      <DateTimePicker name="startCreationDate" key="startCreationDate" />,
      <DateTimePicker name="endCreationDate" key="endCreationDate" />,
      <Lov name="warehouseObj" noCache key="warehouseObj" />,
      <TextField name="externalNum" key="externalNum" />,
      <TextField name="outerRequestNum" key="outerRequestNum" />,
      <DateTimePicker name="planDemandDateStart" key="planDemandDateStart" />,
      <DateTimePicker name="planDemandDateEnd" key="planDemandDateEnd" />,
    ];
  }

  /**
   * 头查询
   */
  async function handleSearch(page = currentPage, pageSize = size, flag = false) {
    const validateValue = await headDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (flag) {
      setCurrentPage(1);
      setSize(100);
    }
    headDS.queryParameter = {
      ...headDS.queryDataSet.current.toJSONData(),
      requestOperationType: 'ISSUE',
      // requestStatus: null,
      page: flag ? 0 : page - 1,
      size: flag ? 100 : pageSize,
    };
    setListLoading(true);
    // const res = await headDS.query();
    const res = await queryHeadApi(headDS.queryParameter);
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
   * 行查询
   * @param {*} rec
   * @param {*} page
   * @param {*} pageSize
   */
  function handleLineSearch(requestId = headId, page = currentLinePage, pageSize = lineSize) {
    const params = {
      requestId,
      page: page - 1,
      size: pageSize,
      requestOperationType: 'ISSUE',
      showOperationName: true,
    };
    queryLine(params);
  }

  async function queryLine(params) {
    setLineLoading(true);
    const lineRes = await queryLineApi(params);
    setLineLoading(false);
    setInProgress(false);
    if (getResponse(lineRes) && lineRes.content && lineRes.content.length) {
      await setLineDataSource(cloneDeep(lineRes.content));
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
   * 重置
   */
  function handleReset() {
    headDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  async function handleToggle() {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  }

  /**
   * 计算头表高度
   * @param {*} dataLength 表格当前查询数据量
   */
  async function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-issue-request-content')[0];
    const queryContainer = document.getElementById('issueRequestHeaderQuery');
    const lineContainer = document.getElementById('lineTableWrapper');
    // 10: queryContainer的margin, 32: pageContainer的padding
    const tableContainerHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 10 - 32;
    // 31: 分页组件高度
    const maxTableHeight = tableContainerHeight - lineContainer.offsetHeight - 31;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      await setTableHeight(dataLength * 30 + 33 + 10);
      // 115: 31*2(两个分页) + 37(tab高度) + 16(tab下的margin)
      setLineTableHeight(tableContainerHeight - tableHeight - 115);
    } else if (maxTableHeight < 80) {
      // 当头表高度小于80时重新调整头行表高度
      const lineHeight = lineTableHeight - (80 - maxTableHeight);
      setTableHeight(80);
      setLineTableHeight(lineHeight < 80 ? 80 : lineHeight);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  useEffect(() => {
    const pageContainer = document.getElementsByClassName('lwms-issue-request-content')[0];
    const queryContainer = document.getElementById('issueRequestHeaderQuery');
    if (
      dataSource.length * 30 + 33 + 10 + (lineDataSource.length * 30 + 33 + 10) <
      pageContainer.offsetHeight - queryContainer.offsetHeight - 137
    ) {
      setTableHeight(dataSource.length > 0 ? dataSource.length * 30 + 33 + 10 : 80);
      setLineTableHeight(lineDataSource.length > 0 ? lineDataSource.length * 30 + 33 + 10 : 80);
    }
  }, [tableHeight, lineTableHeight]);

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

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.issueRequestPlatform`).d('领料单平台')}>
        {renderFunctionButtons()}
      </Header>
      <Content className="lwms-issue-request-content">
        <div
          style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}
          id="issueRequestHeaderQuery"
        >
          <Form dataSet={headDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.1rem 0',
            }}
          >
            <Button onClick={handleToggle} className="more-btn">
              {intl.get('hzero.common.button.more').d('更多')}
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(1, 100, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          rowKey="requestId"
          data={dataSource}
          height={tableHeight}
          columns={headColumns}
          loading={listLoading}
          onRowClick={handleHeadRowClick}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        <div id="lineTableWrapper">
          {headId && (
            <Tabs defaultActiveKey="main">
              {tabsArr().map((tab) => (
                <TabPane
                  tab={intl.get(`${intlPrefix}.view.title.${tab.code}`).d(tab.title)}
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

export default connect(({ issueRequestPlatform }) => ({
  headList: issueRequestPlatform?.headList || [],
  lineList: issueRequestPlatform?.lineList || [],
  pagination: issueRequestPlatform?.pagination || {},
  linePagination: issueRequestPlatform?.linePagination || {},
  headRequestId: issueRequestPlatform?.headRequestId || '',
}))(
  formatterCollections({
    code: [`${intlPrefix}`, `${commonPrefix}`],
  })(IssueRequestPlatform)
);
