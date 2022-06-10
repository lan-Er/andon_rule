/**
 * @Description: 发货单平台--头表
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-09 15:00:19
 * @LastEditors: yiping.liu
 */
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import {
  Button,
  Tabs,
  Lov,
  TextField,
  Form,
  Select,
  DatePicker,
  CheckBox,
  DataSet,
  Modal,
  Spin,
  PerformanceTable,
  Pagination,
} from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData, queryReportData, userSetting } from 'hlos-front/lib/services/api';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  getResponse,
  getAccessToken,
  getRequestId,
} from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { HZERO_RPT, API_HOST } from 'utils/config';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';

import { queryDocumentType } from '@/services/api';
import codeConfig from '@/common/codeConfig';
import { headDS, lineDS } from '@/stores/shipPlatformDS';

import LineTable from './shipPlatformLine';
import TypeModal from './TypeModal';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const preCode = 'lwms.shipPlatform';
const intlCode = 'lwms.shipPlatform.model';
const commonCode = 'lwms.common.model';
const { common } = codeConfig.code;
const { TabPane } = Tabs;
let modal = null;

function ShipPlatform(props) {
  // let headDataSet = new DataSet(headDS());
  // const lineDataSet = new DataSet(lineDS());
  let headDataSet = useDataSet(() => new DataSet(headDS()), ShipPlatform);
  const lineDataSet = useDataSet(() => new DataSet(lineDS()));
  const [loading, setLoading] = useState(false);
  const [moreQuery, setMoreQuery] = useState(false);
  const [shipOrderId, setShipOrderId] = useState(-1);
  const [dataSource, setDataSource] = useState([]);
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
  const [checkValues, setCheckValues] = useState([]);
  const maxLineShowLength = 3;

  const {
    dispatch,
    history,
    headList,
    lineList,
    pagination,
    linePagination,
    headShipOrderId,
  } = props;

  useEffect(() => {
    defaultLovSetting();
    const myQuery = sessionStorage.getItem('shipPlatformParentQuery') || false;
    if (location.pathname === '/lwms/ship-platform/list' && myQuery) {
      handleSearch().then(() => {
        sessionStorage.removeItem('shipPlatformParentQuery');
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
      setShipOrderId(headShipOrderId || -1);
    }
    return () => {
      headDataSet = new DataSet(headDS());
      sessionStorage.removeItem('shipPlatformParentQuery');
      sessionStorage.removeItem('shipOrderTypeObj');
    };
  }, []);

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

  const mainColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'shipOrderId',
      key: 'shipOrderId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${intlCode}.shipOrg`).d('发货组织'),
      dataIndex: 'shipOrganization',
      resizable: true,
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlCode}.shipOrder`).d('发货单号'),
      dataIndex: 'shipOrderNum',
      resizable: true,
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${intlCode}.customerSite`).d('客户地点'),
      dataIndex: 'customerSiteName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.shipOrderType`).d('发货单类型'),
      dataIndex: 'shipOrderTypeName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.shipOrderStatus`).d('发货单状态'),
      dataIndex: 'shipOrderStatusMeaning',
      resizable: true,
      width: 82,
      align: 'center',
      render: ({ rowData }) =>
        statusRender(rowData.shipOrderStatus, rowData.shipOrderStatusMeaning),
    },
    {
      title: intl.get(`${intlCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOuName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.poNum`).d('销售订单号'),
      dataIndex: 'poNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.poLineNum`).d('销售订单行号'),
      dataIndex: 'poLineNum',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${intlCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.salesman`).d('销售员'),
      dataIndex: 'salesman',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.warehouse`).d('发出仓库'),
      dataIndex: 'wareHouse',
      resizable: true,
      width: 128,
      render: ({ rowData }) => (
        <span>
          {rowData.warehouseCode} {rowData.wareHouseOrganizationName}
        </span>
      ),
    },
    {
      title: intl.get(`${intlCode}.wmArea`).d('发出货位'),
      dataIndex: 'wmArea',
      resizable: true,
      width: 128,
      render: ({ rowData }) => (
        <span>
          {rowData.wmAreaCode} {rowData.wmAreaOrganizationName}
        </span>
      ),
    },
    {
      title: intl.get(`${intlCode}.customerReceiveType`).d('客户接收类型'),
      dataIndex: 'customerReceiveType',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerReceiveOrg`).d('客户接收组织'),
      dataIndex: 'customerReceiveOrg',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerReceiveWm`).d('客户接收仓库'),
      dataIndex: 'customerReceiveWm',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerInventoryWm`).d('客户入库仓库'),
      dataIndex: 'customerInventoryWm',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.shipOrderGroup`).d('发货单组'),
      dataIndex: 'shipOrderGroup',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.shipToSite`).d('收货地点'),
      dataIndex: 'shipToSite',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerContact`).d('客户联系人'),
      dataIndex: 'customerContact',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.contactPhone`).d('联系电话'),
      dataIndex: 'contactPhone',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.contactEmail`).d('联系邮箱'),
      dataIndex: 'contactEmail',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerAddress`).d('客户地址'),
      dataIndex: 'customerAddress',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${intlCode}.customerPO`).d('客户PO'),
      dataIndex: 'customerPo',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerPOLine`).d('客户PO行'),
      dataIndex: 'customerPoLine',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${commonCode}.creator`).d('制单人'),
      dataIndex: 'creatorName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.approvalRule`).d('审批策略'),
      dataIndex: 'approvalRuleMeaning',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${intlCode}.approvalWorkflow`).d('审批工作流'),
      dataIndex: 'approvalWorkflow',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.creationDate`).d('制单时间'),
      dataIndex: 'creationDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${commonCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${commonCode}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocType',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${commonCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRuleName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.remark`).d('备注'),
      dataIndex: 'remark',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${intlCode}.externalShipType`).d('外部单据类型'),
      dataIndex: 'externalShipType',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      resizable: true,
      width: 128,
    },
  ];

  const shipColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'shipOrderId',
      key: 'shipOrderId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${intlCode}.shipOrg`).d('发货组织'),
      dataIndex: 'shipOrganization',
      resizable: true,
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlCode}.shipOrder`).d('发货单号'),
      dataIndex: 'shipOrderNum',
      resizable: true,
      width: 128,
      // renderer: ({ record, value }) => {
      //   const id = record.get('shipOrderId');
      //   return <a onClick={() => handleToDetail(id)}>{value.shipOrderNum || ''}</a>;
      // },
      fixed: 'left',
    },
    {
      title: intl.get(`${intlCode}.warehouse`).d('发出仓库'),
      dataIndex: 'wareHouse',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.wmArea`).d('发出货位'),
      dataIndex: 'wmArea',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerReceiveType`).d('客户接收类型'),
      dataIndex: 'customerReceiveType',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerReceiveOrg`).d('客户接收组织'),
      dataIndex: 'customerReceiveOrg',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerReceiveWm`).d('客户接收仓库'),
      dataIndex: 'customerReceiveWm',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.customerInventoryWm`).d('客户入库仓库'),
      dataIndex: 'customerInventoryWm',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.shippingMethod`).d('发运方式'),
      dataIndex: 'shippingMethodMeaning',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.carrier`).d('承运人'),
      dataIndex: 'carrier',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.carrierContact`).d('承运人联系方式'),
      dataIndex: 'carrierContact',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.shipOrder`).d('发货单号'),
      dataIndex: 'shipTicket',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.plateNum`).d('车牌号'),
      dataIndex: 'plateNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.freight`).d('运费'),
      dataIndex: 'freight',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${commonCode}.currency`).d('币种'),
      dataIndex: 'currency',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${intlCode}.planShipDate`).d('计划发货时间'),
      dataIndex: 'planShipDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${intlCode}.applyShipDate`).d('请求发货时间'),
      dataIndex: 'applyShipDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${intlCode}.shippedDate`).d('发出时间'),
      dataIndex: 'shippedDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${intlCode}.shipWorker`).d('发出员工'),
      dataIndex: 'shipWorker',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${intlCode}.expectedArrivalDate`).d('预计到达时间'),
      dataIndex: 'expectedArrivalDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${intlCode}.arrivedDate`).d('到达时间'),
      dataIndex: 'arrivedDate',
      resizable: true,
      width: 136,
    },
    {
      title: intl.get(`${intlCode}.confirmWorker`).d('到货确认员工'),
      dataIndex: 'confirmWorker',
      resizable: true,
      width: 128,
    },
  ];

  const lineProps = {
    lineDataSource,
    lineTotalElements,
    currentLinePage,
    lineSize,
    lineLoading,
    lineTableHeight,
    onPageChange: handleLinePageChange,
  };

  /**
   *重置
   *
   */
  function handleReset() {
    headDataSet.queryDataSet.current.reset();
  }

  /**
   * 头查询
   *
   * @returns
   */
  async function handleSearch(page = currentPage, pageSize = size, flag) {
    setShipOrderId(-1);
    const validateValue = await headDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (flag) {
      setCurrentPage(1);
      setSize(100);
    }
    headDataSet.setQueryParameter('page', flag ? 0 : page - 1);
    headDataSet.setQueryParameter('size', flag ? 100 : pageSize);
    setListLoading(true);
    const res = await headDataSet.query();
    setListLoading(false);
    if (getResponse(res) && res.content) {
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
  async function handleLineSearch(
    headId = shipOrderId,
    page = currentLinePage,
    pageSize = lineSize,
    flag
  ) {
    if (flag) {
      setLineCurrentPage(1);
      setLineSize(100);
    }
    lineDataSet.queryParameter = {
      shipOrderId: headId,
      page: flag ? 0 : page - 1,
      size: flag ? 100 : pageSize,
    };
    setLineLoading(true);
    const lineRes = await lineDataSet.query();
    setLineLoading(false);
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
   *行tab
   *
   * @returns
   */
  function tabsArr() {
    return [
      { code: 'main', title: '主要', component: <LineTable {...lineProps} value="main" /> },
      { code: 'ship', title: '发货', component: <LineTable {...lineProps} value="ship" /> },
    ];
  }

  /**
   *头点击事件
   *
   */
  function handleClick(record) {
    setShipOrderId(record.shipOrderId);
    handleLineSearch(record.shipOrderId, 0, 100, true);
  }

  /**
   *导出
   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headDataSet && headDataSet.queryDataSet && headDataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
      shipOrderStatus: queryDataDsValue?.shipOrderStatus?.join(),
    };
  }

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (!isEmpty(res.content) && headDataSet.queryDataSet && headDataSet.queryDataSet.current) {
        headDataSet.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  function handleShowTypeSelectModal() {
    modal = Modal.open({
      key: 'lwms-ship-return-platform-type-modal',
      title: '新建订单',
      className: styles['lwms-ship-return-platform-type-modal'],
      movable: false,
      children: <TypeModal onModalCancel={handleModalCancel} onModalOk={handleModalOk} />,
      footer: null,
    });
  }

  function handleModalCancel() {
    modal.close();
  }

  function handleModalOk(rec) {
    if (!isEmpty(rec)) {
      handleToDetail(rec);
    }
    modal.close();
  }

  /**
   * 跳转详情页面
   * @param {*} id
   */
  function handleToDetail(param) {
    let pathname = `/lwms/ship-platform/list`;
    if (param.documentTypeCode === 'SO_SHIP_ORDER') {
      pathname = `/lwms/ship-platform/create/sales`;
    } else if (param.documentTypeCode === 'STANDARD_SHIP_ORDER') {
      pathname = `/lwms/ship-platform/create/normal`;
    } else {
      notification.warning({
        message: '当前单据类型不支持',
      });
    }
    dispatch({
      type: 'shipPlatform/updateState',
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
        headShipOrderId: shipOrderId,
      },
    });

    history.push({
      pathname,
      state: {
        shipOrderTypeObj: param,
      },
    });
  }

  /**
   * 改变头状态 - 取消/关闭
   * @param {*} type 操作状态类型
   */
  function handleHeadStatus(type) {
    Modal.confirm({
      children: <p>是否{type === 'close' ? '关闭' : '取消'}发货单？</p>,
    }).then((button) => {
      if (button === 'ok') {
        setLoading(true);
        return new Promise((resolve) => {
          const lists = checkValues.map((item) => item.shipOrderId);
          dispatch({
            type: 'shipPlatform/changeHeadStatus',
            payload: {
              type,
              lists,
            },
          }).then((res) => {
            if (res && !res.failed) {
              notification.success({
                message: '操作成功',
              });
              // headDataSet.query();
              handleSearch(1, size, true);
            }
            resolve(setLoading(false));
          });
        });
      }
    });
  }

  // 删除发货单
  function handleHeadDelete() {
    Modal.confirm({
      children: <p>是否删除发货单？</p>,
    }).then((button) => {
      if (button === 'ok') {
        setLoading(true);
        return new Promise((resolve) => {
          const lists = checkValues.map((item) => item.shipOrderId);
          dispatch({
            type: 'shipPlatform/deleteShipOrder',
            payload: {
              lists,
            },
          }).then((res) => {
            if (res && !res.failed) {
              notification.success({
                message: '操作成功',
              });
              // headDataSet.query();
              handleSearch(1, size, true);
            }
            resolve(setLoading(false));
          });
        });
      }
    });
  }

  // 提交发货单
  function handleHeadSubmit() {
    setLoading(true);
    return new Promise((resolve) => {
      const lists = checkValues.map((item) => item.shipOrderId);
      dispatch({
        type: 'shipPlatform/submitShipOrder',
        payload: {
          lists,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          // headDataSet.query();
          handleSearch(1, size, true);
        }
        resolve(setLoading(false));
      });
    });
  }

  // 打印
  const handlePrint = async () => {
    let mulitPrint = false; // 是否批量打印
    let shipOrderIdStr = ''; // 批量打印id字符串
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
      shipOrderIdStr = checkValues.map((item) => item.shipOrderId).toString();
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
    const { shipOrderNum, shipOrderTypeId } = checkValues[0];
    let reportCode = null;
    if (!isEmpty(shipOrderTypeId)) {
      const documentType = await queryDocumentType({ documentTypeId: shipOrderTypeId });
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
      if (mulitPrint) {
        const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&shipOrderId=${shipOrderIdStr}`;
        window.open(requestUrl);
      } else {
        const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&shipoNum=${shipOrderNum}`;
        window.open(requestUrl);
      }
    }
  };

  // 执行
  const handleExecute = async () => {
    const shipOrderIdArr = checkValues.map((i) => i.shipOrderId);
    const shipOrderNumArr = checkValues.map((i) => i.shipOrderNum);
    const remarkArr = checkValues.map((i) => i.remark);
    const res = await userSetting({ defaultFlag: 'Y' });
    const params = [];
    for (let i = 0; i < shipOrderIdArr.length; i++) {
      const obj = {
        shipOrderId: shipOrderIdArr[i],
        shipOrderNum: shipOrderNumArr[i],
        remark: remarkArr[i] || null,
        executedWorkerId: res.content[0].workerId,
        executedWorker: res.content[0].workerCode,
        executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      };
      params.push(obj);
    }
    setLoading(true);
    return new Promise((resolve) => {
      const lists = params;
      dispatch({
        type: 'shipPlatform/executeShipOrder',
        payload: {
          lists,
        },
      }).then((resp) => {
        if (resp && !resp.failed) {
          notification.success({
            message: '操作成功',
          });
          // headDataSet.query();
          handleSearch(1, size, true);
        }
        resolve(setLoading(false));
      });
    });
  };

  // 页码更改
  function handlePageChange(page = currentPage, pageSize = size) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSize);
    setShipOrderId(-1);
    handleSearch(pageValue, pageSize);
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
    handleLineSearch(shipOrderId, pageValue, pageSizeValue);
  }

  // 计算头表格高度
  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lwms-ship-platform-content'])[0];
    const queryContainer = document.getElementsByClassName(styles['lwms-ship-platform-query'])[0];
    const lineContainer = document.getElementById('ship-platform-line-table');
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 120;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
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

  /**
   * 全选
   * @param {*} value
   */
  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.shipOrderId}
        checked={checkValues.findIndex((i) => i.shipOrderId === rowData.shipOrderId) !== -1}
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
        newCheckValues.findIndex((i) => i.shipOrderId === rowData.shipOrderId),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  /**
   * 切换显示隐藏
   */
  async function handleToggle() {
    await setMoreQuery(!moreQuery);
    calcTableHeight(dataSource.length);
  }

  return (
    <div className={styles['lwms-ship-platform']}>
      <Spin spinning={loading}>
        <Header title={intl.get(`${preCode}.view.title.shipPlatform`).d('发货单平台')}>
          <ButtonPermission
            type="c7n-pro"
            icon="add"
            color="primary"
            onClick={handleShowTypeSelectModal}
            permissionList={[
              {
                code: 'hlos.lwms.ship-platform.ps.button.create',
                type: 'button',
                meaning: '新建',
              },
            ]}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </ButtonPermission>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/excel`}
            queryParams={getExportQueryParams}
          />
          <ButtonPermission
            type="c7n-pro"
            onClick={() => handleHeadStatus('close')}
            disabled={checkValues.length === 0}
            permissionList={[
              {
                code: 'hlos.lwms.ship-platform.ps.button.close',
                type: 'button',
                meaning: '关闭',
              },
            ]}
          >
            {intl.get('hzero.common.button.close').d('关闭')}
          </ButtonPermission>
          <ButtonPermission
            type="c7n-pro"
            onClick={() => handleHeadStatus('cancel')}
            disabled={checkValues.length === 0}
            permissionList={[
              {
                code: 'hlos.lwms.ship-platform.ps.button.cancel',
                type: 'button',
                meaning: '取消',
              },
            ]}
          >
            {intl.get('hzero.common.button.cancel').d('取消')}
          </ButtonPermission>
          <ButtonPermission
            type="c7n-pro"
            onClick={handleHeadDelete}
            disabled={checkValues.length === 0}
            permissionList={[
              {
                code: 'hlos.lwms.ship-platform.ps.button.delete',
                type: 'button',
                meaning: '删除',
              },
            ]}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </ButtonPermission>
          <ButtonPermission
            type="c7n-pro"
            onClick={handleHeadSubmit}
            disabled={checkValues.length === 0}
            permissionList={[
              {
                code: 'hlos.lwms.ship-platform.ps.button.submit',
                type: 'button',
                meaning: '提交',
              },
            ]}
          >
            {intl.get('hzero.common.button.submit').d('提交')}
          </ButtonPermission>
          <Button onClick={handlePrint} disabled={checkValues.length === 0}>
            {intl.get('lwms.common.view.title.print').d('打印')}
          </Button>
          <ButtonPermission
            type="c7n-pro"
            onClick={handleExecute}
            disabled={checkValues.length === 0}
            permissionList={[
              {
                code: 'hlos.lwms.ship-platform.ps.button.execute',
                type: 'button',
                meaning: '执行',
              },
            ]}
          >
            {intl.get('hzero.common.button.trigger').d('执行')}
          </ButtonPermission>
        </Header>
        <Content className={styles['lwms-ship-platform-content']}>
          <div className={styles['lwms-ship-platform-query']}>
            <Form dataSet={headDataSet.queryDataSet} columns={4}>
              <Lov name="organizationObj" clearButton noCache />
              <Lov name="shipOrderObj" clearButton noCache />
              <Lov name="customerObj" clearButton noCache />
              <Select name="shipOrderStatus" />
              {moreQuery && <Lov name="poNumObj" clearButton noCache />}
              {moreQuery && <Lov name="salesmanObj" clearButton noCache />}
              {moreQuery && <Lov name="itemObj" clearButton noCache />}
              {moreQuery && <Lov name="shipOrderTypeObj" clearButton noCache />}
              {moreQuery && <Lov name="demandNumObj" clearButton noCache />}
              {moreQuery && <Lov name="createWorkerObj" clearButton noCache />}
              {moreQuery && <DatePicker mode="dateTime" name="creationDateLeft" />}
              {moreQuery && <DatePicker mode="dateTime" name="creationDateRight" />}
              {moreQuery && <TextField name="customerPo" key="customerPo" />}
              {moreQuery && <Lov name="warehouseObj" clearButton noCache />}
              {moreQuery && <DatePicker mode="dateTime" name="startDate" />}
              {moreQuery && <DatePicker mode="dateTime" name="endDate" />}
              {moreQuery && <TextField name="customerReceiveType" key="customerReceiveType" />}
              {moreQuery && <TextField name="customerReceiveOrg" key="customerReceiveOrg" />}
              {moreQuery && <TextField name="customerReceiveWm" key="customerReceiveWm" />}
              {moreQuery && <TextField name="customerInventoryWm" key="customerInventoryWm" />}
            </Form>
            <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
              <Button onClick={handleToggle}>
                {moreQuery
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
              </Button>
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => handleSearch(1, size, true)}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Tabs defaultActiveKey="main">
            <TabPane tab="主要" key="main">
              <PerformanceTable
                virtualized
                data={dataSource}
                columns={mainColumns}
                height={tableHeight}
                loading={listLoading}
                onRowClick={(record) => handleClick(record)}
              />
              <Pagination
                pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
                total={totalElements}
                onChange={handlePageChange}
                pageSize={size}
                page={currentPage}
              />
            </TabPane>
            <TabPane tab="发货" key="ship">
              <PerformanceTable
                virtualized
                data={dataSource}
                columns={shipColumns}
                height={tableHeight}
                loading={listLoading}
                onRowClick={(record) => handleClick(record)}
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
          <div id="ship-platform-line-table">
            {shipOrderId !== -1 && (
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
      </Spin>
    </div>
  );
}

export default connect(({ shipPlatform }) => ({
  headList: shipPlatform?.headList || [],
  lineList: shipPlatform?.lineList || [],
  pagination: shipPlatform?.pagination || {},
  linePagination: shipPlatform?.linePagination || {},
  headShipOrderId: shipPlatform?.headShipOrderId || '',
}))(
  formatterCollections({
    code: [`${intlCode}`, `${preCode}`, `${commonCode}`],
  })(ShipPlatform)
);
