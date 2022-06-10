/**
 * @Description: 销售订单管理信息--头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-01-10 14:18:08
 * @LastEditors: tw
 */

import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  PerformanceTable,
  Pagination,
  // Table,
  Tabs,
  Lov,
  CheckBox,
  Form,
  Modal,
  Button,
  DatePicker,
  TextField,
  Select,
  DataSet,
} from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { isEmpty, isUndefined } from 'lodash';
import queryString from 'query-string';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ExcelExport from 'components/ExcelExport';
// import { ExportButton } from 'hlos-front/lib/components';
import { queryLovData } from 'hlos-front/lib/services/api';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';

import { SalesOrderListDS, SalesOrderLineDS } from '@/stores/salesOrderDS';
import { releaseSo, cancelSo, closeSo, deliverySoHeafers } from '@/services/salesOrderService';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

// import LineList from './SalesOrderLine';
import './index.less';

const tableRef = React.createRef();
const { common } = codeConfig.code;
const { TabPane } = Tabs;
const organizationId = getCurrentOrganizationId();

const commonCode = 'lsop.common.model';
const preCodeIndex = 'lsop.salesOrder';
const preCode = 'lsop.salesOrder.model';
const modelCode = 'lsop.SalesOrderModel';
const {
  importTemplateCode: { salesOrder },
} = statusConfig.statusValue.lsop;

const ListDS = () => new DataSet(SalesOrderListDS());
const LineDS = () => new DataSet(SalesOrderLineDS());

const SalesOrder = ({ history, dispatch, salesOrderModelData }) => {
  const listDS = useDataSet(ListDS, SalesOrder);
  const lineDataSet = useDataSet(LineDS);
  const [soHeaderId, setSoHeaderId] = useState(-1);
  const [showFlag, setShowFlag] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
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
    /**
     *设置默认查询条件
     */
    async function defaultLovSetting() {
      const res = await Promise.all([
        queryLovData({ lovCode: common.sopOu, defaultFlag: 'Y' }),
        queryLovData({ lovCode: common.worker, defaultFlag: 'Y', workerType: 'SALESMAN' }),
      ]);

      if (getResponse(res)) {
        if (res[0] && res[0].content && res[0].content[0]) {
          listDS.queryDataSet.current.set('sopOuObj', {
            sopOuId: res[0].content[0].sopOuId,
            sopOuName: res[0].content[0].sopOuName,
          });
        }
        if (res[1] && res[1].content && res[1].content[0]) {
          listDS.queryDataSet.current.set('salesmanObj', {
            salesmanId: res[1].content[0].workerId,
            salesmanName: res[1].content[0].workerName,
          });
        }
        handleSearch();
      }
    }

    if (
      listDS &&
      listDS.queryDataSet &&
      listDS.queryDataSet.current &&
      listDS.queryDataSet.current.get('sopOuId')
    ) {
      return;
    }
    defaultLovSetting();
    calcTableHeight(0);
  }, [listDS]);

  useEffect(() => {
    const flag = sessionStorage.getItem('salesOrderIsSave') || false;
    if (location.pathname === '/lsop/sales-order/list' && flag) {
      handleSearch().then(() => {
        sessionStorage.removeItem('salesOrderIsSave');
      });
    } else {
      setShowFlag(salesOrderModelData.showFlag);
      setShowLoading(salesOrderModelData.showLoading);
      setShowLineLoading(salesOrderModelData.showLineLoading);
      setSoHeaderId(salesOrderModelData.soHeaderId);
      setDataSource(salesOrderModelData.dataSource || []);
      setLineDataSource(salesOrderModelData.lineDataSource);
      setCurrentPage(salesOrderModelData.currentPage);
      setLineCurrentPage(salesOrderModelData.lineCurrentPage);
      setSize(salesOrderModelData.size);
      setLineSize(salesOrderModelData.lineSize);
      setTotalElements(salesOrderModelData.totalElements);
      setLineTotalElements(salesOrderModelData.totalElements);
      setTableHeight(salesOrderModelData.tableHeight);
      setLineTableHeight(salesOrderModelData.lineTableHeight);
      setCheckValues(salesOrderModelData.checkValues);
      setCurRowData(salesOrderModelData.curRowData);
    }
    return () => {
      sessionStorage.removeItem('salesOrderIsSave');
    };
  }, [location.pathname]);

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
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'soHeaderId',
        key: 'soHeaderId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${preCode}.sopOu`).d('销售中心'),
        dataIndex: 'sopOu',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.soNum`).d('销售订单号'),
        dataIndex: 'soNum',
        width: 128,
        fixed: true,
        resizable: true,
        render: linkRenderer,
      },
      {
        title: intl.get(`${preCode}.soType`).d('订单类型'),
        dataIndex: 'soTypeName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.soStatus`).d('订单状态'),
        dataIndex: 'soStatusMeaning',
        width: 90,
        resizable: true,
        render: ({ rowData, dataIndex }) => statusRender(rowData.soStatus, rowData[dataIndex]),
      },
      {
        title: intl.get(`${preCode}.salesman`).d('销售员'),
        dataIndex: 'salesmanName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customer`).d('客户'),
        dataIndex: 'customerName',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerSite`).d('客户地点'),
        dataIndex: 'customerSiteName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerPo`).d('客户PO'),
        dataIndex: 'customerPo',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
        dataIndex: 'customerPoLine',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerOrderedTime`).d('客户下单日期'),
        dataIndex: 'customerOrderedTime',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.soConfirmedTime`).d('订单确认日期'),
        dataIndex: 'soConfirmedTime',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerContact`).d('客户联系人'),
        dataIndex: 'customerContact',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.contactPhone`).d('联系电话'),
        dataIndex: 'contactPhone',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
        dataIndex: 'contactEmail',
        width: 160,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveAddress`).d('收货地址'),
        dataIndex: 'receiveAddress',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.currency`).d('币种'),
        dataIndex: 'currencyName',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.totalAmount`).d('订单总价'),
        dataIndex: 'totalAmount',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.taxRate`).d('税率'),
        dataIndex: 'taxRate',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.exchangeRate`).d('汇率'),
        dataIndex: 'exchangeRate',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
        dataIndex: 'paymentDeadlineMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
        dataIndex: 'paymentMethodMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.soVersion`).d('订单版本'),
        dataIndex: 'soVersion',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        dataIndex: 'approvalRuleMeaning',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.approvalChart`).d('审批流程'),
        dataIndex: 'approvalChart',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
        dataIndex: 'docProcessRuleName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.externalId`).d('外部ID'),
        dataIndex: 'externalId',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}}.externalNum`).d('外部编号'),
        dataIndex: 'externalNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}}.creator`).d('创建人'),
        dataIndex: 'creator',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 128,
        resizable: true,
      },
    ];
  }

  const lineMainColumns = () => {
    return [
      {
        title: intl.get(`${preCode}.soLineNum`).d('行号'),
        dataIndex: 'soLineNum',
        width: 70,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        dataIndex: 'itemDescription',
        width: 200,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemFeature`).d('物料特征值'),
        dataIndex: 'featureCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.featureDesc`).d('特征值描述'),
        dataIndex: 'featureDesc',
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
        title: intl.get(`${preCode}.demandQty`).d('需求数量'),
        dataIndex: 'demandQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.demandDate`).d('需求日期'),
        dataIndex: 'demandDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
        dataIndex: 'promiseDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shipOrganization`).d('发运组织'),
        dataIndex: 'shipOrganizationName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.soLineType`).d('行类型'),
        dataIndex: 'soLineTypeMeaning',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.soLineStatus`).d('行状态'),
        dataIndex: 'soLineStatusMeaning',
        width: 90,
        resizable: true,
        render: ({ rowData, dataIndex }) => statusRender(rowData.soLineStatus, rowData[dataIndex]),
      },
      {
        title: intl.get(`${preCode}.unitPrice`).d('单价'),
        dataIndex: 'unitPrice',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.lineAmount`).d('行总价'),
        dataIndex: 'lineAmount',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerItem`).d('客户物料'),
        dataIndex: 'customerItemCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
        dataIndex: 'customerItemDesc',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerPo`).d('客户PO'),
        dataIndex: 'customerPo',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
        dataIndex: 'customerPoLine',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        dataIndex: 'secondUomName',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
        dataIndex: 'secondDemandQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemCategory`).d('物料销售类别'),
        dataIndex: 'itemCategoryName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        dataIndex: 'sourceDocTypeName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        dataIndex: 'sourceDocNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        dataIndex: 'sourceDocLineNum',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.externalId`).d('外部ID'),
        dataIndex: 'externalId',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}}.externalNum`).d('外部编号'),
        dataIndex: 'externalNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.lineRemark`).d('行备注'),
        dataIndex: 'lineRemark',
        width: 200,
        resizable: true,
      },
    ];
  };

  const lineShipColumns = () => {
    return [
      {
        title: intl.get(`${preCode}.soLineNum`).d('行号'),
        dataIndex: 'soLineNum',
        width: 70,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.plannedQty`).d('已计划数量'),
        dataIndex: 'plannedQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shippedQty`).d('发货数量'),
        dataIndex: 'shippedQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.returnedQty`).d('退货数量'),
        dataIndex: 'returnedQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.planShipDate`).d('计划交货日期'),
        dataIndex: 'planShipDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.applyShipDate`).d('请求发运日期'),
        dataIndex: 'applyShipDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.lastShippedDate`).d('最近发运日期'),
        dataIndex: 'lastShippedDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWarehouse`).d('发运仓库'),
        dataIndex: 'warehouse',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWmArea`).d('发运货位'),
        dataIndex: 'wmArea',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shipToSiteName`).d('发运地点'),
        dataIndex: 'shipToSiteName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerReceiveOrg`).d('客户接收组织'),
        dataIndex: 'customerReceiveOrg',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerReceiveWm`).d('客户接收仓库'),
        dataIndex: 'customerReceiveWm',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerInventoryWm`).d('客户入库仓库'),
        dataIndex: 'customerInventoryWm',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.customerReceiveType`).d('客户接收类型'),
        dataIndex: 'customerReceiveType',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
        dataIndex: 'shippingMethodMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shipRule`).d('发运规则'),
        dataIndex: 'shipRuleName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.packingRule`).d('装箱规则'),
        dataIndex: 'packingRuleName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.packingFormat`).d('包装方式'),
        dataIndex: 'packingFormatMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
        dataIndex: 'packingMaterial',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
        dataIndex: 'minPackingQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.packingQty`).d('单位包装数'),
        dataIndex: 'packingQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.containerQty`).d('箱数'),
        dataIndex: 'containerQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.palletQty`).d('托盘数'),
        dataIndex: 'palletContainerQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.packageNum`).d('包装编号'),
        dataIndex: 'packageNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
        dataIndex: 'tagTemplate',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.lotNumber`).d('指定批次'),
        dataIndex: 'lotNumber',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.tagCode`).d('指定标签'),
        dataIndex: 'tagCode',
        width: 128,
        resizable: true,
      },
    ];
  };

  const handleCheckAllChange = (value) => {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  };

  const checkCell = ({ rowData, rowIndex }) => {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.soHeaderId}
        checked={checkValues.findIndex((i) => i.soHeaderId === rowData.soHeaderId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  };

  const handleCheckBoxChange = (rowData) => {
    const _checkValues = [...checkValues];
    if (_checkValues.findIndex((i) => i.soHeaderId === rowData.soHeaderId) === -1) {
      _checkValues.push(rowData);
    } else {
      _checkValues.splice(
        _checkValues.findIndex((i) => i.soHeaderId === rowData.soHeaderId),
        1
      );
    }
    setCheckValues(_checkValues);
  };

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer({ rowData, dataIndex }) {
    return (
      <a onClick={(e) => handleToDetailPage(e, `/lsop/sales-order/detail/${rowData.soHeaderId}`)}>
        {rowData[dataIndex]}
      </a>
    );
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="sopOuObj" noCache key="sopOuObj" />,
      <Lov name="soNumObj" noCache key="soNumObj" />,
      <Lov name="customerObj" noCache key="customerObj" />,
      <Select name="soStatus" key="soStatus" />,
      <Lov name="shipOrganizationObj" noCache key="shipOrganizationObj" />,
      <Lov name="salesmanObj" noCache key="salesmanObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="soTypeObj" noCache key="soTypeObj" />,
      <TextField name="customerPo" key="customerPo" />,
      <TextField name="customerItemCode" key="customerItemCode" />,
      <DatePicker name="startDemandDate" key="startDemandDate" />,
      <DatePicker name="endDemandDate" key="endDemandDate" />,
      <DatePicker name="customerOrderedTimeStart" key="customerOrderedTimeStart" />,
      <DatePicker name="customerOrderedTimeEnd" key="customerOrderedTimeEnd" />,
    ];
  }

  /**
   *通过点击来查行,并且在此设置行颜色。
   * @param {*} { record }
   * @returns
   */
  /**
   *通过点击来查行.
   * @param {*} { rowData }
   * @returns
   */
  const onClickChange = (rowData) => {
    setSoHeaderId(rowData.soHeaderId);
    // lineDataSet.queryParameter = { soHeaderId: rowData.soHeaderId };
    // lineDataSet.query();
    setCurRowData(rowData);
    handleLineSearch(lineCurrentPage, lineSize, rowData);
  };

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lsop-salesOrder-content')[0];
    const queryContainer = document.getElementsByClassName('lsop-sales-order-query')[0];
    const lineContent = document.getElementsByClassName('lsop-sales-order-line-content')[0];
    const maxTableHeight =
      pageContainer.offsetHeight -
      queryContainer.offsetHeight -
      (lineContent?.offsetHeight || 0) -
      75;
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

  /**
   * 查询
   */
  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    setCurrentPage(1);
    setShowLoading(true);
    listDS.queryDataSet.current.set('page', page - 1);
    listDS.queryDataSet.current.set('size', pageSize);
    const res = await listDS.query();
    setSoHeaderId(-1);
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
    setShowLoading(false);
  }
  const handleLineSearch = async (page = currentPage, pageSize = size, rowData = curRowData) => {
    setShowLineLoading(true);
    const params = {
      soHeaderId: rowData.soHeaderId,
      page: page - 1,
      size: pageSize,
    };
    lineDataSet.queryParameter = params;
    const res = await lineDataSet.query();
    if (getResponse(res) && res.content) {
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(dataSource.length);
    }
    setShowLineLoading(false);
  };

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  async function handleToggle() {
    await setShowFlag(!showFlag);
    calcLineTableHeight(lineDataSource.length || 0);
    calcTableHeight(dataSource.length || 0);
  }

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
    setSoHeaderId(-1);
    handleSearch(pageValue, pageSizeValue);
  }

  // 行页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(pageValue, pageSizeValue);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(e, url) {
    e.stopPropagation();
    history.push(url);
    dispatch({
      type: 'SalesOrderModel/updateState',
      payload: {
        salesOrderModelData: {
          showFlag,
          showLoading,
          showLineLoading,
          soHeaderId,
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
  }

  /**
   *提交
   */
  function handleSubmit() {
    const ids = checkValues.map((item) => item.soHeaderId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.soStatus === 'NEW')) {
      notification.error({
        message: intl
          .get(`${preCodeIndex}.view.message.submitLimit`)
          .d('只有新增状态的销售订单才允许提交!'),
      });
      return;
    }
    releaseSo(ids).then((res) => {
      if (res) {
        notification.success();
        handleSearch();
      }
    });
  }

  /**
   *删除
   */
  async function handleDelete() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (checkValues.every((item) => item.soStatus === 'NEW')) {
      // const res = await listDS.delete(listDS.selected);
      Modal.confirm({
        children: <p>是否删除选中行</p>,
        content: '',
        onOk() {
          deliverySoHeafers(checkValues).then((res) => {
            if (!isEmpty(res) && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              handleSearch();
            }
          });
        },
        onCancel() {},
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCodeIndex}.view.message.delLimit`)
          .d('只有新增状态的销售订单才允许删除!'),
      });
    }
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
          item.soStatus === 'NEW' || item.soStatus === 'APPROVING' || item.soStatus === 'RELEASED'
      )
    ) {
      const ids = checkValues.map((item) => item.soHeaderId);
      cancelSo(ids).then((res) => {
        if (!isEmpty(res) && res.failed && res.message) {
          notification.error({
            message: res.message,
          });
        } else {
          handleSearch();
        }
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCodeIndex}.view.message.cancelLimit`)
          .d('只有新增、审批中、已提交状态的销售订单才允许取消!'),
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
      checkValues.filter((item) => item.soStatus === 'CANCELLED' || item.soStatus === 'CLOSED')
        .length !== checkValues.length
    ) {
      const ids = checkValues.map((item) => item.soHeaderId);
      closeSo(ids).then((res) => {
        if (!isEmpty(res) && res.failed && res.message) {
          notification.error({
            message: res.message,
          });
        } else {
          handleSearch();
        }
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCodeIndex}.view.message.closeLimit`)
          .d('已取消、已关闭状态的销售订单不允许关闭!'),
      });
    }
  }

  // 导入
  function handleBatchImport() {
    openTab({
      key: `/himp/commentImport/${salesOrder}`,
      title: intl.get(`${preCodeIndex}.view.title.customerImport`).d('销售订单导入'),
      search: queryString.stringify({
        action: intl.get(`${preCodeIndex}.view.title.customerImport`).d('销售订单导入'),
      }),
    });
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
      soStatusList: fieldsValue?.soStatus?.join(),
      soStatus: undefined,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCodeIndex}.view.title.salesOrder`).d('销售订单')}>
        <Button
          icon="add"
          color="primary"
          onClick={(e) => handleToDetailPage(e, '/lsop/sales-order/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LSOP}/v1/${organizationId}/so-headers/excel`}
          queryParams={getExportQueryParams}
        />
        {/* <ExportButton */}
        {/* reportCode={['LSOP.SO_HEADER', 'LSOP.SO_LINE']} */}
        {/* exportTitle={ */}
        {/* intl.get(`${preCodeIndex}.view.title.salesOrder`).d('销售订单') +*/}
        {/* intl.get('hzero.common.button.export').d('导出') */}
        {/* } */}
        {/* /> */}
        <Button onClick={handleClose}>{intl.get('hzero.common.button.close').d('关闭')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handleDelete}>{intl.get('hzero.common.button.delete').d('删除')}</Button>
        <Button onClick={handleSubmit}>{intl.get('hzero.common.button.submit').d('提交')}</Button>
      </Header>
      <Content className="lsop-salesOrder-content">
        <div
          style={{ display: 'flex', alignItems: 'flex-start' }}
          className="lsop-sales-order-query"
        >
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          rowKey="soHeaderId"
          data={dataSource}
          ref={tableRef}
          columns={columns()}
          height={tableHeight}
          loading={showLoading}
          onRowClick={onClickChange}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        {soHeaderId !== -1 && (
          <Tabs defaultActiveKey="lineMain" className="lsop-sales-order-line-content">
            <TabPane tab="主要" key="lineMain" className="sales-order-line-tab-content">
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
            <TabPane tab="发运" key="lineShip" className="sales-order-line-tab-content">
              <PerformanceTable
                virtualized
                data={lineDataSource}
                ref={tableRef}
                columns={lineShipColumns()}
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
};

export default connect(({ SalesOrderModel }) => ({
  salesOrderModelData: SalesOrderModel?.salesOrderModelData || [],
}))(
  formatterCollections({
    code: [`${modelCode}`],
  })(SalesOrder)
);
