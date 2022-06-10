/*
 * @Description: 采购退货单平台
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-14 15:02:27
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import {
  DataSet,
  Pagination,
  Form,
  Lov,
  Button,
  Select,
  DatePicker,
  Modal,
  PerformanceTable,
  CheckBox,
} from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import { isUndefined } from 'lodash';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import { Button as ButtonPermission } from 'components/Permission';
import { queryLovData } from 'hlos-front/lib/services/api';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';

import { PurchaseDS, PurchaseLineDS } from '../../../stores/purchaseReturnOrderPlatformDS';
import {
  submitDeliveryReturn,
  cancelDeliveryReturn,
  closeDeliveryReturn,
} from '../../../services/purchaseReturnOrderPlatformService';
import OrderTypeCard from './createModal';
import '../index.less';

const { TabPane } = Tabs;
const listDS = new DataSet(PurchaseDS());
const lineDS = new DataSet(PurchaseLineDS());
const preCode = 'lwms.PurchaseReturnModel';
let modal = null;
const tableRef = React.createRef();

function PurchaseReturnOrderPlatform({ history, dispatch, location, purchaseModelData }) {
  const [showFlag, setShowFlag] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [deliveryReturnId, setQueryId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showLineLoading, setShowLineLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lineCurrentPage, setLineCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [lineSize, setLineSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);
  const [curRowData, setCurRowData] = useState({});

  useEffect(() => {
    handleQueryDefaultOrg();
    const myQuery = JSON.parse(sessionStorage.getItem('purchaseReturnParentQuery')) || false;
    if (location.pathname === '/lwms/purchase-return-order-platform/list' && myQuery) {
      handleSearch();
      sessionStorage.removeItem('purchaseReturnParentQuery');
    } else {
      setShowFlag(purchaseModelData.showFlag);
      setInProgress(purchaseModelData.inProgress);
      setQueryId(purchaseModelData.deliveryReturxnId);
      setShowLoading(purchaseModelData.showLoading);
      setShowLineLoading(purchaseModelData.showLineLoading);
      setDataSource(purchaseModelData.dataSource);
      setLineDataSource(purchaseModelData.lineDataSource);
      setCurrentPage(purchaseModelData.currentPage);
      setLineCurrentPage(purchaseModelData.lineCurrentPage);
      setSize(purchaseModelData.size);
      setLineSize(purchaseModelData.lineSize);
      setTotalElements(purchaseModelData.totalElements);
      setLineTotalElements(purchaseModelData.totalElements);
      setTableHeight(purchaseModelData.tableHeight);
      setLineTableHeight(purchaseModelData.lineTableHeight);
      setCheckValues(purchaseModelData.checkValues);
      setCurRowData(purchaseModelData.curRowData);
    }
    return () => {
      sessionStorage.removeItem('purchaseReturnParentQuery');
    };
  }, []);

  const handleQueryDefaultOrg = async () => {
    const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    if (res && res.content && res.content.length && listDS.queryDataSet.current) {
      listDS.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationCode: res.content[0].organizationCode,
        organizationName: res.content[0].organizationName,
      });
    }
  };

  const queryFields = () => {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="deliveryReturnObj" noCache key="deliveryReturnObj" />,
      <Lov name="supplierObj" noCache key="supplierObj" />,
      <Select name="deliveryStatus" noCache key="deliveryStatus" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="documentObj" noCache key="documentObj" />,
      <Lov name="deliveryObj" noCache key="deliveryObj" />,
      <Lov name="returnOrderObj" noCache key="returnOrderObj" />,
      <Lov name="buyerObj" noCache key="buyerObj" />,
      <Lov name="makeObj" noCache key="makeObj" />,
      <DatePicker name="returnedTimeFrom" />,
      <DatePicker name="returnedTimeTo" />,
    ];
  };

  const mainColumns = () => {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'deliveryReturnId',
        key: 'deliveryReturnId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: '退货单组织',
        resizable: true,
        dataIndex: 'organizationName',
        width: 120,
        tooltip: 'overflow',
        fixed: true,
      },
      {
        title: '退货单号',
        resizable: true,
        dataIndex: 'deliveryReturnNum',
        width: 120,
        tooltip: 'overflow',
        fixed: true,
      },
      {
        title: '供应商',
        resizable: true,
        dataIndex: 'partyName',
        width: 120,
        tooltip: 'overflow',
        fixed: true,
      },
      {
        title: '退货单类型',
        resizable: true,
        dataIndex: 'deliveryReturnTypeName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '状态',
        resizable: true,
        dataIndex: 'deliveryReturnStatusMeaning',
        width: 120,
        tooltip: 'overflow',
        render: ({ rowData }) =>
          statusRender(rowData.deliveryReturnStatus, rowData.deliveryReturnStatusMeaning),
      },
      { title: '采购订单', resizable: true, dataIndex: 'poNum', width: 120, tooltip: 'overflow' },
      {
        title: '采购订单行',
        resizable: true,
        dataIndex: 'poLineNum',
        width: 70,
        tooltip: 'overflow',
      },
      {
        title: '送货单',
        resizable: true,
        dataIndex: 'deliveryTicketNum',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '送货单行',
        resizable: true,
        dataIndex: 'deliveryTicketLineNum',
        width: 70,
        tooltip: 'overflow',
      },
      { title: '采购员', resizable: true, dataIndex: 'buyerName', width: 120, tooltip: 'overflow' },
      {
        title: '制单人',
        resizable: true,
        dataIndex: 'creatorName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '单据处理规则',
        resizable: true,
        dataIndex: 'docProcessRuleName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '供应商地点',
        resizable: true,
        dataIndex: 'partySiteName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '联系人',
        resizable: true,
        dataIndex: 'partyContact',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '电话',
        resizable: true,
        dataIndex: 'contactPhone',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '邮箱',
        resizable: true,
        dataIndex: 'contactEmail',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '来源单据类型',
        resizable: true,
        dataIndex: 'sourceDocTypeMeaning',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '来源单据',
        resizable: true,
        dataIndex: 'sourceDocNum',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '来源单据行',
        resizable: true,
        dataIndex: 'sourceDocLineNum',
        width: 70,
        tooltip: 'overflow',
      },
      {
        title: '打印标识',
        resizable: true,
        dataIndex: 'printFlag',
        width: 70,
        tooltip: 'overflow',
      },
      {
        title: '打印次数',
        resizable: true,
        dataIndex: 'printCount',
        width: 120,
        tooltip: 'overflow',
      },
      { title: '备注', resizable: true, dataIndex: 'remark', width: 120, tooltip: 'overflow' },
    ];
  };

  const returnColumns = () => {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'deliveryReturnId',
        key: 'deliveryReturnId',
        width: 80,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: '退货组织',
        resizable: true,
        dataIndex: 'organizationName',
        width: 120,
        tooltip: 'overflow',
        fixed: true,
      },
      {
        title: '退货单号',
        resizable: true,
        dataIndex: 'deliveryReturnNum',
        width: 120,
        tooltip: 'overflow',
        fixed: true,
      },
      {
        title: '退货仓库',
        resizable: true,
        dataIndex: 'returnWarehouseName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货货位',
        resizable: true,
        dataIndex: 'returnWmAreaName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货员',
        resizable: true,
        dataIndex: 'returnWorkerName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货时间',
        resizable: true,
        dataIndex: 'returnTime',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货发运单',
        resizable: true,
        dataIndex: 'returnShipTicket',
        width: 120,
        tooltip: 'overflow',
      },
      { title: '运费', resizable: true, dataIndex: 'freight', width: 120, tooltip: 'overflow' },
      { title: '币种', resizable: true, dataIndex: 'currency', width: 120, tooltip: 'overflow' },
      { title: '承运人', resizable: true, dataIndex: 'carrier', width: 120, tooltip: 'overflow' },
      {
        title: '承运人电话',
        resizable: true,
        dataIndex: 'carrierContact',
        width: 120,
        tooltip: 'overflow',
      },
      { title: '车牌号', resizable: true, dataIndex: 'plateNum', width: 120, tooltip: 'overflow' },
    ];
  };

  const commonLineColumns = () => {
    return [
      {
        title: '行号',
        resizable: true,
        dataIndex: 'returnLineNum',
        width: 70,
        tooltip: 'overflow',
        fixed: true,
      },
      {
        title: '物料',
        resizable: true,
        dataIndex: 'itemCode',
        width: 120,
        tooltip: 'overflow',
        fixed: true,
      },
      { title: '描述', resizable: true, dataIndex: 'itemName', width: 120, tooltip: 'overflow' },
      { title: '制单数量', resizable: true, dataIndex: 'applyQty', width: 82, tooltip: 'overflow' },
      {
        title: '退货数量',
        resizable: true,
        dataIndex: 'returnedQty',
        width: 82,
        tooltip: 'overflow',
      },
    ];
  };

  const lineMainColumns = () => {
    return [
      ...commonLineColumns(),
      {
        title: '行状态',
        resizable: true,
        dataIndex: 'deliveryReturnStatusMeaning',
        width: 120,
        tooltip: 'overflow',
        render: ({ rowData }) =>
          statusRender(rowData.returnLineStatus, rowData.deliveryReturnStatusMeaning),
      },
      { title: '采购订单', resizable: true, dataIndex: 'poNum', width: 120, tooltip: 'overflow' },
      {
        title: '采购订单行',
        resizable: true,
        dataIndex: 'poLineNum',
        width: 70,
        tooltip: 'overflow',
      },
      {
        title: '送货单',
        resizable: true,
        dataIndex: 'deliveryTicketNum',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '送货单行',
        resizable: true,
        dataIndex: 'deliveryTicketLineNum',
        width: 70,
        tooltip: 'overflow',
      },
      {
        title: '来源单据类型',
        resizable: true,
        dataIndex: 'sourceDocType',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '来源单据',
        resizable: true,
        dataIndex: 'sourceDocNum',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '来源单据行',
        resizable: true,
        dataIndex: 'sourceDocLineNum',
        width: 70,
        tooltip: 'overflow',
      },
      {
        title: '物料控制类型',
        resizable: true,
        dataIndex: 'itemControlTypeMeaning',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货原因',
        resizable: true,
        dataIndex: 'returnReason',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '备注',
        resizable: true,
        dataIndex: 'lineRemark',
        width: 120,
        tooltip: 'overflow',
        flexGrow: 1,
      },
    ];
  };

  const lineReturnColumns = () => {
    return [
      ...commonLineColumns(),
      {
        title: '拣料标识',
        resizable: true,
        dataIndex: 'pickedFlag',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '拣料数量',
        resizable: true,
        dataIndex: 'pickedQty',
        width: 82,
        tooltip: 'overflow',
      },
      {
        title: '退货仓库',
        resizable: true,
        dataIndex: 'returnWarehouseName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货货位',
        resizable: true,
        dataIndex: 'returnWmAreaName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货时间',
        resizable: true,
        dataIndex: 'returnTime',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '退货员',
        resizable: true,
        dataIndex: 'returnWorkerName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        title: '拣料员',
        resizable: true,
        dataIndex: 'pickedWorkerName',
        width: 120,
        tooltip: 'overflow',
      },
      { title: '批次', resizable: true, dataIndex: 'lotNumber', width: 120, tooltip: 'overflow' },
      {
        title: '标签',
        resizable: true,
        dataIndex: 'tagCode',
        width: 120,
        tooltip: 'overflow',
        flexGrow: 1,
      },
    ];
  };

  const handleCheckAllChange = (value) => {
    if (value) {
      setCheckValues(dataSource.map((i) => i.deliveryReturnId));
    } else {
      setCheckValues([]);
    }
  };

  const checkCell = ({ rowData, rowIndex }) => {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.deliveryReturnId}
        checked={checkValues.indexOf(rowData.deliveryReturnId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  };

  const handleCheckBoxChange = (rowData) => {
    const _checkValues = checkValues.slice();
    if (_checkValues.indexOf(rowData.deliveryReturnId) === -1) {
      _checkValues.push(rowData.deliveryReturnId);
    } else {
      _checkValues.splice(_checkValues.indexOf(rowData.deliveryReturnId), 1);
    }
    setCheckValues(_checkValues);
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  const handleReset = () => {
    listDS.queryDataSet.reset();
  };

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-purchase-return-order-content')[0];
    const queryContainer = document.getElementsByClassName('lwms-purchase-return-order-query')[0];
    const lineContent = document.getElementsByClassName(
      'lwms-purchase-return-order-line-content'
    )[0];
    const maxTableHeight =
      pageContainer.offsetHeight -
      queryContainer.offsetHeight -
      (lineContent?.offsetHeight ?? 0) -
      75 -
      52;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength <= 3) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  const handleQuery = () => {
    setCurrentPage(1);
    setQueryId(null);
    handleSearch();
  };

  const handleSearch = async (page = currentPage, pageSize = size) => {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    listDS.queryDataSet.current.set('page', page - 1);
    listDS.queryDataSet.current.set('size', pageSize);
    const res = await listDS.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
    setShowLoading(false);
  };

  const handleLineSearch = async (
    page = lineCurrentPage,
    pageSize = lineSize,
    rowData = curRowData
  ) => {
    setShowLineLoading(true);
    const params = {
      deliveryReturnId: rowData.deliveryReturnId,
      page: page - 1,
      size: pageSize,
    };
    lineDS.queryParameter = params;
    const res = await lineDS.query();
    if (getResponse(res) && res.content) {
      setInProgress(false);
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(dataSource.length);
    }
    setShowLineLoading(false);
  };

  const handleClose = async () => {
    if (!checkValues.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const res = await closeDeliveryReturn(checkValues);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '关闭成功',
      });
      handleSearch();
    }
  };

  const handleCancel = async () => {
    if (!checkValues.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const res = await cancelDeliveryReturn(checkValues);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '取消成功',
      });
      handleSearch();
    }
  };

  const handleSubmit = async () => {
    if (!checkValues.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const res = await submitDeliveryReturn(checkValues);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '提交成功',
      });
      handleSearch();
    }
  };

  const handleCreate = () => {
    modal = Modal.open({
      key: 'purchase-return-order-platform-modal',
      className: 'purchase-return-order-platform-modal',
      title: '新建订单',
      footer: null,
      closable: true,
      children: (
        <OrderTypeCard
          history={history}
          modal={modal}
          orderStatus={listDS?.queryDataSet?.current?.get('deliveryStatus')}
          toCreatePage={handleToCreatePage}
        />
      ),
    });
  };

  const handleToCreatePage = (actRecord) => {
    history.push({
      pathname: '/lwms/purchase-return-order-platform/create',
      state: {
        orderStatus: listDS?.queryDataSet?.current?.get('deliveryStatus') ?? '',
        returnOrderObj: actRecord,
      },
    });

    dispatch({
      type: 'PurchaseReturnModel/updateState',
      payload: {
        purchaseModelData: {
          showFlag,
          inProgress,
          deliveryReturnId,
          showLoading,
          showLineLoading,
          dataSource,
          lineDataSource,
          currentPage,
          lineCurrentPage,
          size,
          lineSize,
          totalElements,
          lineTotalElements,
          tableHeight,
          lineTableHeight,
          checkValues,
          curRowData,
        },
      },
    });
  };

  const handleHeadRowClick = (rowData) => {
    if (!inProgress) {
      setInProgress(true);
      setQueryId(rowData.deliveryReturnId);
      setCurRowData(rowData);
      handleLineSearch(lineCurrentPage, lineSize, rowData);
    }
  };

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }
  const handlePrint = async () => {
    let printFlag = true;
    const deliveryReturnIdList = [];
    if (checkValues.length === 0) {
      notification.error({
        message: '请选择一条数据',
      });
      return;
    }

    checkValues.forEach((item) => {
      if (dataSource.find((v) => v.deliveryReturnId === item).deliveryReturnStatus !== 'EXECUTED') {
        printFlag = false;
      }
      deliveryReturnIdList.push(item.deliveryReturnId);
    });
    if (!printFlag) {
      notification.error({
        message: '退货单状态不为已执行，请重新选择！',
      });
      return;
    }

    const deliveryReturnIds = checkValues;
    history.push({
      pathname: `/lwms/purchase-return-order-platform/print`,
      search: `tenantId=${getCurrentOrganizationId()}`,
      state: deliveryReturnIds,
    });

    dispatch({
      type: 'PurchaseReturnModel/updateState',
      payload: {
        purchaseModelData: {
          showFlag,
          inProgress,
          deliveryReturnId,
          showLoading,
          showLineLoading,
          dataSource,
          lineDataSource,
          currentPage,
          lineCurrentPage,
          size,
          lineSize,
          totalElements,
          lineTotalElements,
          tableHeight,
          lineTableHeight,
          checkValues,
          curRowData,
        },
      },
    });
  };

  // 头页码更改
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

  // 行页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== lineSize) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(pageValue, pageSizeValue);
  }

  return (
    <Fragment>
      <Header>
        <ButtonPermission
          type="c7n-pro"
          color="primary"
          icon="add"
          onClick={handleCreate}
          permissionList={[
            {
              code: 'hlos.lwms.purchase.return.order.platform.ps.button.create',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          新建
        </ButtonPermission>
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/delivery-returns/excel`}
          queryParams={getExportQueryParams}
        />
        <ButtonPermission
          type="c7n-pro"
          onClick={handleClose}
          permissionList={[
            {
              code: 'hlos.lwms.purchase.return.order.platform.ps.button.close',
              type: 'button',
              meaning: '关闭',
            },
          ]}
        >
          关闭
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleCancel}
          permissionList={[
            {
              code: 'hlos.lwms.purchase.return.order.platform.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          取消
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleSubmit}
          permissionList={[
            {
              code: 'hlos.lwms.purchase.return.order.platform.ps.button.submit',
              type: 'button',
              meaning: '提交',
            },
          ]}
        >
          提交
        </ButtonPermission>
        <Button onClick={handlePrint}>打印</Button>
      </Header>
      <Content className="lwms-purchase-return-order-content">
        <div
          style={{ display: 'flex', alignItems: 'flex-start' }}
          className="lwms-purchase-return-order-query"
        >
          <Form dataSet={listDS.queryDataSet} columns={4}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              marginLeft: 8,
              marginTop: 10,
            }}
          >
            <Button onClick={handleToggle}>{!showFlag ? '更多查询' : '收起查询'}</Button>
            <Button onClick={handleReset}>重置</Button>
            <Button color="primary" onClick={() => handleQuery()}>
              查询
            </Button>
          </div>
        </div>
        <Tabs>
          <TabPane tab="主要" key="main" className="purchase-tab-content">
            <PerformanceTable
              virtualized
              rowKey="deliveryReturnId"
              data={dataSource}
              ref={tableRef}
              columns={mainColumns()}
              height={tableHeight}
              loading={showLoading}
              onRowClick={handleHeadRowClick}
            />
            <Pagination
              pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
              total={totalElements}
              onChange={handlePageChange}
              pageSize={size}
              page={currentPage}
            />
          </TabPane>
          <TabPane tab="退货" key="returnGoods" className="purchase-tab-content">
            <PerformanceTable
              virtualized
              data={dataSource}
              ref={tableRef}
              columns={returnColumns()}
              height={tableHeight}
              loading={showLoading}
            />
            <Pagination
              pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
              total={totalElements}
              onChange={handlePageChange}
              pageSize={size}
              page={currentPage}
            />
          </TabPane>
        </Tabs>
        {deliveryReturnId && (
          <Tabs className="lwms-purchase-return-order-line-content">
            <TabPane tab="主要" key="lineMain" className="purchase-line-tab-content">
              <PerformanceTable
                virtualized
                data={lineDataSource}
                ref={tableRef}
                columns={lineMainColumns()}
                height={lineTableHeight}
                loading={showLineLoading}
              />
              <Pagination
                pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
                total={lineTotalElements}
                onChange={handleLinePageChange}
                pageSize={lineSize}
                page={lineCurrentPage}
              />
            </TabPane>
            <TabPane tab="退货" key="lineReturnGoods" className="purchase-line-tab-content">
              <PerformanceTable
                virtualized
                data={lineDataSource}
                ref={tableRef}
                columns={lineReturnColumns()}
                height={lineTableHeight}
                loading={showLineLoading}
              />
              <Pagination
                pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
                total={lineTotalElements}
                onChange={handleLinePageChange}
                pageSize={lineSize}
                page={lineCurrentPage}
              />
            </TabPane>
          </Tabs>
        )}
      </Content>
    </Fragment>
  );
}

export default connect(({ PurchaseReturnModel }) => ({
  purchaseModelData: PurchaseReturnModel?.purchaseModelData || {},
}))(
  formatterCollections({
    code: [`${preCode}`],
  })(PurchaseReturnOrderPlatform)
);
