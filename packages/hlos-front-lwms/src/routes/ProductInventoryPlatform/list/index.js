/*
 * @module: 生产入库单平台
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-03-01 14:31:06
 * @LastEditTime: 2021-03-01 14:31:06
 * @copyright: Copyright (c) 2021,Hand
 */
import React, { Fragment, useEffect, useState } from 'react';
import {
  CheckBox,
  DataSet,
  Button,
  Lov,
  TextField,
  Modal,
  Form,
  Select,
  DatePicker,
  PerformanceTable,
  Pagination,
} from 'choerodon-ui/pro';
import { Input } from 'choerodon-ui';
import { Button as ButtonPermission } from 'components/Permission';
import { isEmpty, isUndefined } from 'lodash';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import moment from 'moment';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { HZERO_RPT, API_HOST } from 'utils/config';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData, queryReportData } from 'hlos-front/lib/services/api';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { queryDocumentType } from '@/services/api';
import {
  getResponse,
  getAccessToken,
  getRequestId,
  getCurrentOrganizationId,
  filterNullValueObject,
} from 'utils/utils';
import {
  releaseApi,
  cancelApi,
  closeApi,
  deleteApi,
  confirmReceive,
  rejectReasonsApi,
} from '@/services/productInventoryPlatformService';
import {
  productInventoryPlatformDS,
  productInventoryPlatformLineDS,
  confirmReceiveDS,
} from '@/stores/productInventoryPlatformDS';
import codeConfig from '@/common/codeConfig';
import './index.less';

const { TextArea } = Input;
const preCode = 'lwms.productInventoryPlatform';
const commonCode = 'lwms.common.model';
const intlPrefix = 'lwms.productInventoryPlatform.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const headDS = new DataSet(productInventoryPlatformDS());
const lineDS = new DataSet(productInventoryPlatformLineDS());
const receiveDS = new DataSet(confirmReceiveDS());

function ProductInventoryPlatform({
  dispatch,
  history,
  headList,
  lineList,
  pagination,
  linePagination,
  headRequestId,
}) {
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
  let textareaValue = '';

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
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      resizable: true,
      fixed: 'left',
      render: ({ rowData }) => {
        return `${rowData.organizationCode} ${rowData.organizationName}`;
      },
    },
    {
      title: intl.get(`${intlPrefix}.requestNum`).d('入库单号'),
      dataIndex: 'requestNum',
      width: 144,
      resizable: true,
      render: ({ rowData }) => linkRenderer(rowData),
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.moNum`).d('生产订单'),
      dataIndex: 'moNum',
      resizable: true,
      width: 144,
    },
    {
      title: intl.get(`${intlPrefix}.requestTypeName`).d('入库单类型'),
      dataIndex: 'requestTypeName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlPrefix}.requestStatus`).d('入库单状态'),
      dataIndex: 'requestStatusMeaning',
      width: 84,
      resizable: true,
      render: ({ rowData }) => statusRender(rowData.requestStatus, rowData.requestStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.warehouseName`).d('完工仓库'),
      dataIndex: 'warehouseName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.warehouseCode} ${rowData.warehouseName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.wmAreaName`).d('完工货位'),
      dataIndex: 'wmAreaName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.wmAreaCode} ${rowData.wmAreaName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouseName`).d('入库仓库'),
      dataIndex: 'toWarehouseName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.toWarehouseCode} ${rowData.toWarehouseName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.toWmAreaName`).d('入库货位'),
      dataIndex: 'toWmAreaName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.toWmAreaCode} ${rowData.toWmAreaName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${commonCode}.prodLine`).d('生产线'),
      dataIndex: 'prodLineName',
      width: 128,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${commonCode}.workcell`).d('工位'),
      dataIndex: 'workcellName',
      width: 128,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      width: 128,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.requestGroup`).d('入库单组'),
      dataIndex: 'requestGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.executedWorker`).d('执行员工'),
      dataIndex: 'executedWorker',
      width: 82,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.executedTime`).d('执行时间'),
      dataIndex: 'executedTime',
      width: 140,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${commonCode}.createWorker`).d('制单员工'),
      dataIndex: 'creator',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.creationDate`).d('制单时间'),
      dataIndex: 'creationDate',
      width: 140,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${commonCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 70,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${commonCode}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      width: 140,
      align: 'center',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.approvalRule`).d('审批策略'),
      dataIndex: 'approvalRuleMeaning',
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
      title: intl.get(`${commonCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      width: 128,
      resizable: true,
      render: ({ rowData }) =>
        !rowData.docProcessRule || rowData.docProcessRule === 'null' ? '' : rowData.docProcessRule,
    },
    {
      title: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalType`).d('外部类型'),
      dataIndex: 'externalType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.rejectReasons`).d('驳回原因'),
      dataIndex: 'rejectReasons',
      width: 200,
      resizable: true,
      render: ({ rowData }) => {
        return rowData.requestReason ? `${rowData.requestReason}` : '';
      },
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      render: ({ rowData }) => {
        return [
          <Button
            key="edit"
            color="primary"
            funcType="flat"
            onClick={(e) => handleReceive(e, 'row', rowData)}
          >
            {intl.get('hzero.common.button.receive').d('接收')}
          </Button>,
        ];
      },
      fixed: 'right',
    },
  ];

  const lineColumns = [
    {
      title: intl.get(`${commonCode}.lineNum`).d('行号'),
      dataIndex: 'requestLineNum',
      width: 70,
      resizable: true,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      resizable: true,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.applyQty`).d('申请数量'),
      dataIndex: 'applyQty',
      width: 82,
      resizable: true,
      align: 'left',
    },
    {
      title: intl.get(`${commonCode}.shipLineStatus`).d('行状态'),
      dataIndex: 'requestLineStatusMeaning',
      width: 84,
      resizable: true,
      render: ({ rowData }) =>
        statusRender(rowData.requestLineStatus, rowData.requestLineStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.executedQty`).d('入库数量'),
      dataIndex: 'executedQty',
      width: 82,
      resizable: true,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouseName`).d('入库仓库'),
      dataIndex: 'toWarehouseName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.toWarehouseCode} ${rowData.toWarehouseName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.toWmAreaName`).d('入库货位'),
      dataIndex: 'toWmAreaName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.toWmAreaCode} ${rowData.toWmAreaName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.warehouseName`).d('完工仓库'),
      dataIndex: 'warehouseName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.warehouseCode} ${rowData.warehouseName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.wmAreaName`).d('完工货位'),
      dataIndex: 'wmAreaName',
      width: 144,
      resizable: true,
      tooltip: 'overflow',
      render: ({ rowData }) => {
        return `${rowData.wmAreaCode} ${rowData.wmAreaName}`.replace(/undefined/g, ' ');
      },
    },
    {
      title: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      width: 128,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyPackQty`).d('包装数量'),
      dataIndex: 'applyPackQty',
      width: 82,
      resizable: true,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.applyWeight`).d('重量'),
      dataIndex: 'applyWeight',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.secondUomName`).d('辅助单位'),
      dataIndex: 'secondUomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
      dataIndex: 'secondApplyQty',
      width: 82,
      resizable: true,
      align: 'left',
    },
    {
      title: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.lineRemark`).d('行备注'),
      dataIndex: 'lineRemark',
      width: 200,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalLineID`).d('外部行ID'),
      dataIndex: 'externalLineId',
      width: 70,
      resizable: true,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${commonCode}.externalLineNum`).d('外部单据行号'),
      dataIndex: 'externalLineNum',
      width: 70,
      resizable: true,
    },
  ];

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

  useEffect(() => {
    async function queryDefaultWorker() {
      const res = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
      if (getResponse(res) && !res.failed && res.content && res.content[0]) {
        setWorker(res.content[0]);
      }
    }
    queryDefaultWorker();
    receiveDS.create({}, 0);
    headDS.addEventListener('query', () => setHeadId(null));
    headDS.queryDataSet.addEventListener('reset', handleReset);
    headDS.queryDataSet.addEventListener('update', handleUpdate);
    if (!headDS.current) {
      setDefaultDSValue(headDS);
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
    return () => {
      headDS.reset();
      headDS.removeEventListener('query');
      headDS.queryDataSet.removeEventListener('reset');
      headDS.queryDataSet.removeEventListener('update');
    };
  }, []);

  /**
   * 设置默认查询条件
   */
  async function setDefaultDSValue(ds) {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (
        res &&
        Array.isArray(res.content) &&
        res.content.length &&
        ds.queryDataSet &&
        ds.queryDataSet.current
      ) {
        ds.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
        receiveDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
        handleSearch();
      }
    }
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
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

  async function handleLineSearch(requestId = headId, page = currentLinePage, pageSize = lineSize) {
    lineDS.setQueryParameter('requestId', requestId);
    lineDS.setQueryParameter('page', page - 1);
    lineDS.setQueryParameter('pageSize', pageSize);
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

  const handleHeadRowClick = (record) => {
    if (!onProcess) {
      toggleOnProcess(true);
      const curClickHeadId = record?.requestId;
      setHeadId(curClickHeadId);
      // lineDS.query().then(() => toggleOnProcess(false));
      handleLineSearch(curClickHeadId);
    }
  };

  function linkRenderer(rowData) {
    return <a onClick={(e) => handleToDetail(e, rowData.requestId)}>{rowData.requestNum}</a>;
  }

  /**
   * 跳转详情页面
   * @param {*} id
   */
  function handleToDetail(e, id) {
    if (e) e.stopPropagation();
    dispatch({
      type: 'productInventoryPlatform/updateState',
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
    const pathName = `/lwms/product-inventory-platform/detail/${id}`;
    history.push(pathName);
  }

  function handleReset() {
    headDS.queryDataSet.current.reset();
    headDS.queryDataSet.current.set('requestStatusList', []);
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
   * 计算头表高度
   * @param {*} dataLength 表格当前查询数据量
   */
  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-pip')[0];
    const queryContainer = document.getElementsByClassName('lwms-pip-query-header')[0];
    const lineContainer = document.getElementsByClassName('lwms-pip-line-wrapper')[0];
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

  function handleUpdate({ record, name, value, oldValue }) {
    // 组织变化，清空mo,完工仓库，入库仓库，产成品，执行员工，制单员工
    if (name === 'organizationObj') {
      if (oldValue && value && value.organizationId === oldValue.organizationId) {
        record.set('organizationObj', value);
      } else {
        record.set('moObj', null);
        record.set('wareHouseObj', null);
        record.set('toWareHouseObj', null);
        record.set('assemblyItemObj', null);
        record.set('executedWorkerObj', null);
        record.set('createWorkerObj', null);
        record.set('prodLineObj', null);
      }
    }
  }

  /**
   * 打印
   */
  async function handlePrint() {
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
      const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&shipoNum=${requestNum}`;
      window.open(requestUrl);
    }
  }

  function handleWarehouseChange(value) {
    if (value && value.wmAreaFlag) {
      // 仓库启用货位，货位必输
      receiveDS.current.getField('toWmAreaObj').set('required', true);
      receiveDS.current.getField('toWmAreaObj').set('disabled', false);
    } else {
      receiveDS.current.getField('toWmAreaObj').set('required', false);
      receiveDS.current.getField('toWmAreaObj').set('disabled', true);
    }
    receiveDS.current.set('toWmAreaObj', {});
  }
  /**
   * 确认接收
   */
  async function handleReceive(e, type, record) {
    if (e) e.stopPropagation();
    if (type === 'row') {
      // 行上的接收按钮
      receiveDS.current.getField('toWareHouseObj').set('required', true);
      // headDS.select(record);
      handleCheckboxChange(true, record);

      if (record?.toWarehouseId) {
        receiveDS.current.set('toWareHouseObj', {
          warehouseId: record?.toWarehouseId,
          warehouseCode: record?.toWarehouseCode,
          warehouseName: record?.toWarehouseName,
          wmAreaFlag: record?.toWmAreaFlag,
        });
        // 有默认值带出则不可输入
        receiveDS.current.getField('toWareHouseObj').set('disabled', true);
        // 入库仓库启用货位则货位必输
        if (record?.toWmAreaFlag) {
          receiveDS.current.getField('toWmAreaObj').set('disabled', false);
          receiveDS.current.getField('toWmAreaObj').set('required', true);
        } else {
          // 若仓库未启用货位，货位字段不可输入/非必输
          receiveDS.current.getField('toWmAreaObj').set('disabled', true);
          receiveDS.current.getField('toWmAreaObj').set('required', false);
        }
      } else {
        receiveDS.current.getField('toWareHouseObj').set('disabled', false);
      }
      if (record?.toWmAreaId) {
        receiveDS.current.set('toWmAreaObj', {
          wmAreaId: record?.toWmAreaId,
          wmAreaCode: record?.toWmAreaCode,
          wmAreaName: record?.toWmAreaName,
        });
        // 有默认值带出则不可输入
        receiveDS.current.getField('toWmAreaObj').set('disabled', true);
      }
      Modal.open({
        key: 'lwms-product-inventory-platform-receive',
        title: '确认接收',
        className: 'lwms-product-inventory-platform-receive',
        closable: true,
        children: (
          <div>
            <Form dataSet={receiveDS}>
              <Lov
                name="toWareHouseObj"
                noCache
                onChange={(value) => handleWarehouseChange(value)}
              />
              <Lov name="toWmAreaObj" noCache />
              <TextField name="remark" />
            </Form>
          </div>
        ),
        onOk: () => handleOk('row', record),
        onClose: () => handleModalClose(true),
      });
    } else {
      if (checkValues.length === 0) {
        notification.error({
          message: intl.get(`lwms.common.message.validation.select`).d('请至少选择一条数据'),
        });
        return;
      }
      Modal.open({
        key: 'lwms-product-inventory-platform-receive',
        title: '确认接收',
        className: 'lwms-product-inventory-platform-receive',
        closable: true,
        children: (
          <div>
            <Form dataSet={receiveDS}>
              <Lov
                name="toWareHouseObj"
                noCache
                onChange={(value) => handleWarehouseChange(value)}
              />
              <Lov name="toWmAreaObj" noCache />
              <TextField name="remark" />
            </Form>
          </div>
        ),
        onOk: () => handleOk(checkValues),
        onClose: () => handleModalClose(),
      });
    }
  }

  // 弹窗选择完入库仓库、入库货位和备注后确认接收
  async function handleOk(type, selectedValues = checkValues) {
    console.log(receiveDS);
    const { toWarehouseId, toWmAreaFlag, toWmAreaId } = receiveDS.current.toJSONData();
    if (type === 'row' && (!toWarehouseId || (toWmAreaFlag && !toWmAreaId))) {
      notification.error({ message: '请先输入必填字段！' });
      return false;
    }
    const requestParams = [];
    let requestValues = [];
    if (selectedValues instanceof Array) {
      requestValues = selectedValues;
    } else {
      requestValues.push(selectedValues);
    }
    requestValues.forEach(async (item) => {
      const request = item;
      const params = {
        requestId: request.requestId,
        requestNum: request.requestNum,
        executedWorkerId: worker.workerId,
        executedWorker: worker.workerCode,
        executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
        toWarehouseId: receiveDS.current.get('toWarehouseId')
          ? receiveDS.current.get('toWarehouseId')
          : request.toWarehouseId,
        toWarehouseCode: receiveDS.current.get('toWarehouseCode')
          ? receiveDS.current.get('toWarehouseCode')
          : request.toWarehouseCode,
        toWmAreaId: receiveDS.current.get('toWmAreaId')
          ? receiveDS.current.get('toWmAreaId')
          : request.toWmAreaId,
        toWmAreaCode: receiveDS.current.get('toWmAreaCode')
          ? receiveDS.current.get('toWmAreaCode')
          : request.toWmAreaCode,
        remark: receiveDS.current.get('remark'),
        confirmProductionWmLineDTOList: [],
      };
      requestParams.push(params);
    });
    if (requestParams.length === 0) {
      notification.error({ message: '请求参数有误！' });
      return;
    }
    const receiveRes = await confirmReceive(requestParams);
    if (receiveRes === '操作成功' || getResponse(receiveRes)) {
      notification.success();
      // headDS.query();
      await handleSearch(currentPage, size);
      handleModalClose(true);
    }
  }

  function handleModalClose(unSelectAll) {
    receiveDS.current.getField('toWareHouseObj').set('required', false);
    receiveDS.current.getField('toWmAreaObj').set('required', false);
    receiveDS.current.getField('toWareHouseObj').set('disabled', false);
    receiveDS.current.getField('toWmAreaObj').set('disabled', false);
    receiveDS.current.reset();
    receiveDS.current.set('organizationObj', {
      organizationId: headDS.queryDataSet.current.get('organizationId'),
      organizationName: headDS.queryDataSet.current.get('organizationName'),
    });
    if (unSelectAll) setCheckValues([]); // headDS.unSelectAll();
  }

  /**
   * 提交
   */
  async function handleSubmit() {
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
      await handleSearch(1, 10, true);
    }
  }

  /**
   * 删除
   */
  async function handleDelete() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const res = await deleteApi(checkValues);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      // await headDS.query();
      await handleSearch(1, 10, true);
    }
  }

  /**
   * 取消
   */
  async function handleCancel() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const ids = checkValues.map((i) => i.requestId);
    const res = await cancelApi(ids);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      await handleSearch(1, 10, true);
    }
  }

  /**
   * 关闭
   */
  async function handleClose() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const ids = checkValues.map((i) => i.requestId);
    const res = await closeApi(ids);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      await handleSearch(1, 10, true);
    }
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = headDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  const queryFields = () => {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="productRequestObj" noCache key="productRequestObj" />,
      <Lov name="moObj" noCache key="moObj" />,
      <Select name="requestStatusList" key="requestStatusList" />,
      <Lov name="wareHouseObj" noCache key="wareHouseObj" />,
      <Lov name="toWareHouseObj" noCache key="toWareHouseObj" />,
      <Lov name="assemblyItemObj" noCache key="assemblyItemObj" />,
      <Lov name="documentTypeObj" noCache key="documentTypeObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="executedWorkerObj" noCache key="executedWorkerObj" />,
      <DatePicker name="executedTimeStart" key="executedTimeStart" />,
      <DatePicker name="executedTimeEnd" key="executedTimeEnd" />,
      <Lov name="createWorkerObj" noCache key="createWorkerObj" />,
      <DatePicker name="startCreationDate" key="startCreationDate" />,
      <DatePicker name="endCreationDate" key="endCreationDate" />,
    ];
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

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

  // 点击驳回弹出框填写驳回原因
  function handleReject() {
    // 当没有选中数据时，提示至少选择一条数据
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.dataNumber`).d('请至少选择一条数据'),
      });
      return 0;
    }
    // 当入库单状态不为‘已提交’时，显示提示信息
    let flag = true;
    checkValues.forEach((el) => {
      if (el.requestStatusMeaning !== '已提交') {
        flag = false;
      }
    });
    if (!flag) {
      notification.error({
        message: intl
          .get(`hzero.common.message.validation.status`)
          .d('请选择入库单状态为已提交的数据'),
      });
      return false;
    }
    Modal.open({
      key: 'lwms-product-inventory-platform-reject',
      title: '驳回原因',
      className: 'lwms-product-inventory-platform-reject',
      closable: true,
      children: (
        <div>
          <TextArea placeholder="请输入驳回原因" onChange={(e) => getTextAreaValue(e)} />
        </div>
      ),
      onOk: () => handleOkReject(),
      onClose: () => handleModalClose(),
    });
  }

  async function getTextAreaValue(e) {
    e.persist();
    textareaValue = e.target.value;
    console.log(textareaValue);
  }

  async function handleOkReject() {
    const list = [];
    checkValues.forEach((el) => {
      list.push({
        requestId: el.requestId,
        requestReason: textareaValue,
      });
    });
    const res = await rejectReasonsApi(list);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      await handleSearch(1, 10, true);
    }
  }

  return (
    <Fragment>
      <Header title="生产入库单">
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${organizationId}/request-headers/inventory/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handlePrint}>
          {intl.get(`${preCode}.reportQuery.option.print`).d('打印')}
        </Button>
        <ButtonPermission
          type="c7n-pro"
          color="primary"
          onClick={handleReceive}
          permissionList={[
            {
              code: 'hlos.lwms.product.inventory.platform.ps.button.receive',
              type: 'button',
              meaning: '确认接收',
            },
          ]}
        >
          {intl.get(`${preCode}.button.receive`).d('确认接收')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleSubmit}
          permissionList={[
            {
              code: 'hlos.lwms.product.inventory.platform.ps.button.submit',
              type: 'button',
              meaning: '提交',
            },
          ]}
        >
          {intl.get('hzero.common.button.submit').d('提交')}
        </ButtonPermission>
        <Button onClick={handleDelete}>{intl.get('hzero.common.button.delete').d('删除')}</Button>
        <ButtonPermission
          type="c7n-pro"
          onClick={() => handleCancel(true)}
          permissionList={[
            {
              code: 'hlos.lwms.product.inventory.platform.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleClose}
          permissionList={[
            {
              code: 'hlos.lwms.product.inventory.platform.ps.button.close',
              type: 'button',
              meaning: '关闭',
            },
          ]}
        >
          {intl.get('hzero.common.button.close').d('关闭')}
        </ButtonPermission>
        {/* checkValues[0].requestStatusMeaning === '已提交' ? */}
        <Button onClick={handleReject}>{intl.get('hzero.common.button.reject').d('驳回')}</Button>
      </Header>
      <Content className="lwms-pip">
        <div className="lwms-pip-query-header">
          <Form dataSet={headDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}>
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
        <div className="lwms-pip-line-wrapper">
          {headId && (
            <>
              <PerformanceTable
                virtualized
                data={lineDataSource}
                height={lineTableHeight}
                columns={lineColumns}
                loading={lineLoading}
              />
              <Pagination
                pageSizeOptions={['10', '100', '200', '500', '1000', '5000', '10000']}
                total={lineTotalElements}
                onChange={handleLinePageChange}
                pageSize={lineSize}
                page={currentLinePage}
              />
            </>
          )}
        </div>
      </Content>
    </Fragment>
  );
}

export default connect(({ productInventoryPlatform }) => ({
  headList: productInventoryPlatform?.headList || [],
  lineList: productInventoryPlatform?.lineList || [],
  pagination: productInventoryPlatform?.pagination || {},
  linePagination: productInventoryPlatform?.linePagination || {},
  headRequestId: productInventoryPlatform?.headRequestId || null,
}))(
  formatterCollections({
    code: [`${intlPrefix}`, `${preCode}`, `${commonCode}`],
  })(ProductInventoryPlatform)
);
