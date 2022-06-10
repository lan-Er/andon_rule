/*
 * @Author: zhang yang
 * @Description: 送货单平台
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-02-04 16:11:04
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Button as ButtonPermission } from 'components/Permission';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { queryLovData } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import {
  PerformanceTable,
  Pagination,
  // Table,
  Lov,
  Tabs,
  Form,
  Button,
  CheckBox,
  Select,
  DatePicker,
  DateTimePicker,
  Modal,
  Spin,
  DataSet,
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { TicketDS, TicketLineDS } from '@/stores/ticketPlatformListDS';
import { deliveryTickets } from '@/services/TicketPlatformService';

// import LineList from './LineList';
import './index.less';

const organizationId = getCurrentOrganizationId();

const { common } = codeConfig.code;
const { TabPane } = Tabs;
const preCode = 'lwms.ticket';
const modelCode = 'lwms.TicketPlatform';

const tableRef = React.createRef();

const dsFactory = () => new DataSet(TicketDS());
const lineDsFactory = () => new DataSet(TicketLineDS());

function TicketPlatformPage({ history, dispatch, ticketModelData }) {
  // const { dataSet, lineDataSet } = useContext(Store);
  const dataSet = useDataSet(dsFactory, TicketPlatformPage);
  const lineDataSet = useDataSet(lineDsFactory);

  const [loading, setLoading] = useState(false);
  const [ToPoHeaderId, setToPoHeaderId] = useState(-1);
  const [worker, setWorker] = useState({});
  const [showFlag, setShowFlag] = useState(false);
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
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res.content[0]) {
          dataSet.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    async function queryDefaultWorker() {
      const res = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
      if (getResponse(res) && !res.failed && res.content && res.content[0]) {
        setWorker(res.content[0]);
      }
    }
    queryDefaultWorker();
    defaultLovSetting();
    calcTableHeight(0);
  }, [dataSet]);

  useEffect(() => {
    const myQuery = sessionStorage.getItem('ticketPlatform/refreshFlag') || false;
    if (myQuery) {
      handleSearch().then(() => {
        sessionStorage.removeItem('ticketPlatform/refreshFlag');
      });
    } else {
      setShowFlag(ticketModelData.showFlag);
      setShowLoading(ticketModelData.showLoading);
      setShowLineLoading(ticketModelData.showLineLoading);
      setDataSource(ticketModelData.dataSource || []);
      setLineDataSource(ticketModelData.lineDataSource);
      setCurrentPage(ticketModelData.currentPage);
      setLineCurrentPage(ticketModelData.lineCurrentPage);
      setSize(ticketModelData.size);
      setLineSize(ticketModelData.lineSize);
      setTotalElements(ticketModelData.totalElements);
      setLineTotalElements(ticketModelData.totalElements);
      setTableHeight(ticketModelData.tableHeight);
      setLineTableHeight(ticketModelData.lineTableHeight);
      setCheckValues(ticketModelData.checkValues);
      setCurRowData(ticketModelData.curRowData);
    }
    return () => {
      sessionStorage.removeItem('ticketPlatform/refreshFlag');
    };
  }, []);

  /**
   *表格-头-主要
   * @returns
   */
  const columns = () => {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'ticketId',
        key: 'ticketId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${preCode}.organization`).d('收货组织'),
        dataIndex: 'receiveOrganization',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketNum`).d('送货单号'),
        dataIndex: 'ticketNum',
        width: 128,
        render: linkRenderer,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.party`).d('供应商'),
        dataIndex: 'partyName',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.partySite`).d('供应商地点'),
        dataIndex: 'partySiteName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketType`).d('送货单类型'),
        dataIndex: 'ticketTypeName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketStatus`).d('送货单状态'),
        dataIndex: 'ticketStatusMeaning',
        width: 84,
        align: 'center',
        render: ({ rowData, dataIndex }) => statusRender(rowData.ticketStatus, rowData[dataIndex]),
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.scmOu`).d('采购中心'),
        dataIndex: 'scmOuName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.poNum`).d('采购订单号'),
        dataIndex: 'poNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.poLineNum`).d('采购订单行号'),
        dataIndex: 'poLineNum',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.buyer`).d('采购员'),
        dataIndex: 'buyer',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.deliveryArea`).d('收货区域'),
        dataIndex: 'deliveryArea',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketSourceType`).d('来源类型'),
        dataIndex: 'ticketSourceTypeMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shippedDate`).d('发货时间'),
        dataIndex: 'shippedDate',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达日期'),
        dataIndex: 'expectedArrivalDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.carrier`).d('承运人'),
        dataIndex: 'carrier',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
        dataIndex: 'carrierContact',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shipTicket`).d('发运单号'),
        dataIndex: 'shipTicket',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.plateNum`).d('车牌号'),
        dataIndex: 'plateNum',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.freight`).d('运费'),
        dataIndex: 'freight',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.currency`).d('币种'),
        dataIndex: 'currencyName',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.creator`).d('制单人'),
        dataIndex: 'creator',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketCreatedDate`).d('制单时间'),
        dataIndex: 'ticketCreatedDate',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketCroup`).d('单据组'),
        dataIndex: 'ticketCroup',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        dataIndex: 'sourceDocTypeName',
        width: 100,
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
        title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
        dataIndex: 'docProcessRule',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        dataIndex: 'approvalRule',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.approvalWorkflow`).d('审批工作流'),
        dataIndex: 'approvalWorkflow',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
        dataIndex: 'printedFlag',
        width: 70,
        render: yesOrNoRender,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.printedDate`).d('打印时间'),
        dataIndex: 'printedDate',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalTicketTypeMeaning`).d('外部类型'),
        dataIndex: 'externalTicketTypeMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalId`).d('外部ID'),
        dataIndex: 'externalId',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalNum`).d('外部单据号'),
        dataIndex: 'externalNum',
        width: 128,
        resizable: true,
      },
    ];
  };

  /**
   *表格-头-收货
   * @returns
   */
  const getColumns = () => {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'ticketId',
        key: 'ticketId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${preCode}.organization`).d('收货组织'),
        dataIndex: 'receiveOrganization',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ticketNum`).d('送货单号'),
        dataIndex: 'ticketNum',
        width: 128,
        render: linkRenderer,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.shippedDate`).d('发货时间'),
        dataIndex: 'shippedDate',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达日期'),
        dataIndex: 'expectedArrivalDate',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
        dataIndex: 'receiveWorkerName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
        dataIndex: 'actualArrivalTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inspector`).d('检验员工'),
        dataIndex: 'inspectorName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inspectedTime`).d('检验时间'),
        dataIndex: 'inspectedTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryWorker`).d('入库员工'),
        dataIndex: 'inventoryWorkerName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryTime`).d('入库时间'),
        dataIndex: 'inventoryTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWarehouse`).d('默认接收仓库'),
        dataIndex: 'receiveWarehouseName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWmArea`).d('默认接收货位'),
        dataIndex: 'receiveWmAreaName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryWarehouse`).d('默认入库仓库'),
        dataIndex: 'inventoryWarehouseName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryWmArea`).d('默认入库货位'),
        dataIndex: 'inventoryWmAreaName',
        width: 128,
        resizable: true,
        flexGrow: 1,
      },
    ];
  };

  const lineMainColumns = () => {
    return [
      {
        title: intl.get(`${preCode}.ticketLineNum`).d('行号'),
        dataIndex: 'ticketLineNum',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemDescription`).d('物料描述'),
        dataIndex: 'itemDescription',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.uom`).d('单位'),
        dataIndex: 'uom',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.deliveryQty`).d('送货数量'),
        dataIndex: 'deliveryQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.poNum`).d('采购订单号'),
        dataIndex: 'poNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.poLineNum`).d('采购订单行号'),
        dataIndex: 'poLineNum',
        width: 70,
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
        title: intl.get(`${preCode}.ticketLineStatus`).d('行状态'),
        dataIndex: 'ticketLineStatusMeaning',
        width: 84,
        render: ({ rowData, dataIndex }) =>
          statusRender(rowData.ticketLineStatus, rowData[dataIndex]),
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.recieveRule`).d('收货类型'),
        dataIndex: 'recieveRuleMeaning',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
        dataIndex: 'itemControlTypeMeaning',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        dataIndex: 'secondUom',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondDeliveryQty`).d('辅助单位数量'),
        dataIndex: 'secondDeliveryQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveToleranceType`).d('允差类型'),
        dataIndex: 'receiveToleranceTypeMeaninng',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveTolerance`).d('允差值'),
        dataIndex: 'receiveTolerance',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.partyLotCode`).d('供应商批次'),
        dataIndex: 'partyLotCode',
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
      {
        title: intl.get(`${preCode}.packingQty`).d('单位包装数量'),
        dataIndex: 'packingQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.containerQty`).d('包装数量'),
        dataIndex: 'containerQty',
        width: 84,
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
        title: intl.get(`${preCode}.lineRemark`).d('行备注'),
        dataIndex: 'lineRemark',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.pictures`).d('图片'),
        dataIndex: 'pictures',
        width: 128,
        render: ({ rowData }) => pictureRenderer(rowData.pictures),
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalId`).d('外部ID'),
        dataIndex: 'externalId',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalNum`).d('外部单据号'),
        dataIndex: 'externalNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalLineId`).d('外部行ID'),
        dataIndex: 'externalLineId',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.externalLineNum`).d('外部单据行号'),
        dataIndex: 'externalLineNum',
        width: 70,
        resizable: true,
      },
    ];
  };

  const lineGetColumns = () => {
    return [
      {
        title: intl.get(`${preCode}.ticketLineNum`).d('行号'),
        dataIndex: 'ticketLineNum',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.deliveryQty`).d('送货数量'),
        dataIndex: 'deliveryQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receivedQty`).d('实收数量'),
        dataIndex: 'receivedQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
        dataIndex: 'inventoryQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.qcOkQty`).d('检验合格数量'),
        dataIndex: 'qcOkQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.qcNgQty`).d('检验不合格数量'),
        dataIndex: 'qcNgQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
        dataIndex: 'qcNgReason',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
        dataIndex: 'qcDocNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.returnedQty`).d('退货数量'),
        dataIndex: 'returnedQty',
        width: 84,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
        dataIndex: 'receiveWorkerName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
        dataIndex: 'actualArrivalTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inspector`).d('检验员工'),
        dataIndex: 'inspectorName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inspectedTime`).d('检验时间'),
        dataIndex: 'inspectedTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryWorker`).d('入库员工'),
        dataIndex: 'inventoryWorkerName',
        width: 100,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryTime`).d('入库时间'),
        dataIndex: 'inventoryTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWarehouseReal`).d('接收仓库'),
        dataIndex: 'receiveWarehouseName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.receiveWmAreaReal`).d('接收货位'),
        dataIndex: 'receiveWmAreaName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryWarehouseReal`).d('入库仓库'),
        dataIndex: 'inventoryWarehouseName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryWmAreaReal`).d('入库货位'),
        dataIndex: 'inventoryWmAreaName',
        width: 128,
        resizable: true,
        flexGrow: 1,
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
        value={rowData.ticketId}
        checked={checkValues.findIndex((i) => i.ticketId === rowData.ticketId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  };

  const handleCheckBoxChange = (rowData) => {
    const _checkValues = [...checkValues];
    if (_checkValues.findIndex((i) => i.ticketId === rowData.ticketId) === -1) {
      _checkValues.push(rowData);
    } else {
      _checkValues.splice(
        _checkValues.findIndex((i) => i.ticketId === rowData.ticketId),
        1
      );
    }
    setCheckValues(_checkValues);
  };

  function linkRenderer({ rowData, dataIndex }) {
    return <a onClick={(e) => handleToView(e, rowData.ticketId)}>{rowData[dataIndex]}</a>;
  }

  /**
   *显示超链接
   * @returns
   */
  function pictureRenderer(value) {
    const pictures = [];
    if (value) {
      value.split('#').forEach((item) => {
        pictures.push({
          url: item,
          uid: uuidv4(),
          name: item.split('@')[1],
          status: 'done',
        });
      });
    }
    return pictures.length > 0 ? (
      <a
        onClick={() => {
          Modal.open({
            key: 'lmes-inspection-doc-pic-modal',
            title: intl.get(`${preCode}.view.title.lookpicture`).d('查看图片'),
            className: 'lwms-ticket-platform-pic-modal',
            children: (
              <div className="wrapper">
                <div className="img-list">
                  <Upload
                    disabled
                    listType="picture-card"
                    onPreview={(file) => {
                      if (!file.url) return;
                      window.open(file.url);
                    }}
                    fileList={pictures}
                  />
                </div>
              </div>
            ),
            footer: null,
            movable: true,
            closable: true,
          });
        }}
      >
        查看图片
      </a>
    ) : (
      ''
    );
  }

  /**
   *通过点击来查行.
   * @param {*} { rowData }
   * @returns
   */
  const onClickChange = (rowData) => {
    setToPoHeaderId(rowData.ticketId);
    // lineDataSet.queryParameter = { ticketId: rowData.ticketId };
    // lineDataSet.query();
    setCurRowData(rowData);
    handleLineSearch(lineCurrentPage, lineSize, rowData);
  };

  /**
   *导出字段   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = dataSet && dataSet.queryDataSet && dataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
      ticketStatus: queryDataDsValue?.ticketStatus?.join(),
    };
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource?.length || 0);
  };

  /**
   * 重置
   */
  function handleReset() {
    dataSet.queryDataSet.current.reset();
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-ticket-order-content')[0];
    const queryContainer = document.getElementsByClassName('lwms-ticket-order-query')[0];
    const lineContent = document.getElementsByClassName('lwms-ticket-order-line-content')[0];
    const maxTableHeight =
      pageContainer.offsetHeight -
      queryContainer.offsetHeight -
      (lineContent?.offsetHeight || 0) -
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

  /**
   * 查询
   */
  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await dataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setCurrentPage(1);
    setShowLoading(true);
    dataSet.queryDataSet.current.set('page', page - 1);
    dataSet.queryDataSet.current.set('size', pageSize);
    const res = await dataSet.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
    setShowLoading(false);
    setToPoHeaderId(-1);
  }

  const handleLineSearch = async (page = currentPage, pageSize = size, rowData = curRowData) => {
    setShowLineLoading(true);
    const params = {
      ticketId: rowData.ticketId,
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
    setToPoHeaderId(-1);
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
   * 跳转新建页面
   * @param {*} id
   */
  function handleCreate() {
    const pathName = `/lwms/ticket-platform/create`;
    history.push(pathName);
    dispatch({
      type: 'TicketPlatform/updateState',
      payload: {
        ticketModelData: {
          showFlag,
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
  }

  /**
   * 跳转详情页面
   * @param {*} id
   */
  function handleToView(e, id) {
    e.stopPropagation();
    const pathName = `/lwms/ticket-platform/view/${id}`;
    history.push(pathName);
    dispatch({
      type: 'TicketPlatform/updateState',
      payload: {
        ticketModelData: {
          showFlag,
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
  }

  /**
   * 改变头状态 - 取消/关闭
   * @param {*} type 操作状态类型
   */
  function handleHeadStatus(type) {
    setLoading(true);
    return new Promise((resolve) => {
      const ticketIds = checkValues.map((item) => item.ticketId);
      const receiveParamsList = checkValues.map((item) => ({
        ticketId: item.ticketId,
        ticketNum: item.ticketNum,
        receiveWorkerId: worker.workerId,
        receiveWorker: worker.workerCode,
        receivedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      }));
      dispatch({
        type: 'TicketPlatform/changeHeadStatus',
        payload: {
          type,
          ticketIds,
          receiveParamsList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          handleSearch();
        }
        resolve(setLoading(false));
      });
    });
  }

  /**
   * 上部分删除
   */
  async function handleHeadDel() {
    // dataSet.delete(checkValues, '是否删除送货单');
    Modal.confirm({
      children: <p>是否删除送货单</p>,
      content: '',
      onOk() {
        const data = checkValues.map((item) => item.ticketId);
        deliveryTickets(data).then((res) => {
          if (res && res.failed) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success();
          }
        });
      },
      onCancel() {},
    });
  }

  /**
   * 上部分复制
   */
  function handleHeadCopy() {
    if (checkValues.length !== 1) {
      notification.warning({
        message: '请选择一条送货单进行复制',
      });
      return false;
    }
    const pathName = `/lwms/ticket-platform/copy/${checkValues[0].ticketId}`;
    history.push(pathName);
    dispatch({
      type: 'TicketPlatform/updateState',
      payload: {
        ticketModelData: {
          showFlag,
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
  }

  function handleOpenModal(type, meaning) {
    Modal.confirm({
      style: {
        width: 450,
      },
      children: <span>是否{meaning}送货单?</span>,
      onOk: () => handleHeadStatus(type),
    });
  }

  return (
    <React.Fragment>
      <Spin spinning={loading} className="lwms-ticket-order">
        <Header title={intl.get(`${preCode}.view.title.ticket`).d('送货单平台')}>
          <ButtonPermission
            icon="add"
            color="primary"
            onClick={() => handleCreate()}
            permissionList={[
              {
                code: 'hlos.lwms.ticket.platform.ps.button.create',
                type: 'button',
                meaning: '新建',
              },
            ]}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </ButtonPermission>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets/excel`}
            queryParams={getExportQueryParams}
          />
          <ButtonPermission
            icon="delete"
            onClick={handleHeadDel}
            disabled={!checkValues.length > 0}
            permissionList={[
              {
                code: 'hlos.lwms.ticket.platform.ps.button.delete',
                type: 'button',
                meaning: '删除',
              },
            ]}
          >
            删除
          </ButtonPermission>
          <ButtonPermission
            icon="close"
            onClick={() => handleOpenModal('close', '关闭')}
            disabled={!checkValues.length > 0}
            permissionList={[
              {
                code: 'hlos.lwms.ticket.platform.ps.button.close',
                type: 'button',
                meaning: '关闭',
              },
            ]}
          >
            关闭
          </ButtonPermission>
          <ButtonPermission
            icon="cancel"
            onClick={() => handleOpenModal('cancel', '取消')}
            disabled={!checkValues.length > 0}
            permissionList={[
              {
                code: 'hlos.lwms.ticket.platform.ps.button.cancel',
                type: 'button',
                meaning: '取消',
              },
            ]}
          >
            取消
          </ButtonPermission>
          <Button icon="content_copy" onClick={handleHeadCopy} disabled={!checkValues.length > 0}>
            复制
          </Button>
          <ButtonPermission
            icon="publish2"
            onClick={() => handleOpenModal('release', '提交')}
            disabled={!checkValues.length > 0}
            permissionList={[
              {
                code: 'hlos.lwms.ticket.platform.ps.button.submit',
                type: 'button',
                meaning: '提交',
              },
            ]}
          >
            提交
          </ButtonPermission>
          <ButtonPermission
            icon="check"
            onClick={() => handleOpenModal('receive-by-ticket', '执行')}
            disabled={!checkValues.length > 0}
            permissionList={[
              {
                code: 'hlos.lwms.ticket.platform.ps.button.execute',
                type: 'button',
                meaning: '执行',
              },
            ]}
          >
            执行
          </ButtonPermission>
        </Header>
        <Content className="lwms-ticket-order-content">
          <div
            style={{ display: 'flex', alignItems: 'flex-start' }}
            className="lwms-ticket-order-query"
          >
            <Form dataSet={dataSet.queryDataSet} columns={4}>
              <Lov name="organizationObj" clearButton noCache />
              <Lov name="ticketNumObj" clearButton noCache />
              <Lov name="supplierObj" clearButton noCache />
              <Select name="ticketStatus" />
              {showFlag && <Lov name="poNumObj" clearButton noCache />}
              {showFlag && <Lov name="buyerObj" clearButton noCache />}
              {showFlag && <Lov name="itemObj" clearButton noCache />}
              {showFlag && <Lov name="ticketTypeObj" clearButton noCache />}
              {showFlag && <DatePicker name="expectedArrivalDateStart" />}
              {showFlag && <DatePicker name="expectedArrivalDateEnd" />}
              {showFlag && <DateTimePicker name="actualArrivalTimeStart" />}
              {showFlag && <DateTimePicker name="actualArrivalTimeEnd" />}
              {showFlag && <Lov name="receiveWarehouseObj" />}
              {showFlag && <Lov name="inventoryWarehouseObj" />}
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
              <Button onClick={handleToggle}>
                {showFlag
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
              </Button>
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Tabs>
            <TabPane tab="主要" key="main" className="ticket-tab-content">
              <PerformanceTable
                virtualized
                rowKey="ticketId"
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
            </TabPane>
            <TabPane tab="收货" key="get" className="ticket-tab-content">
              <PerformanceTable
                virtualized
                data={dataSource}
                ref={tableRef}
                columns={getColumns()}
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
            </TabPane>
          </Tabs>
          {ToPoHeaderId !== -1 && (
            <Tabs defaultActiveKey="lineMain" className="lwms-ticket-order-line-content">
              <TabPane tab="主要" key="lineMain" className="ticket-line-tab-content">
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
              <TabPane tab="退货" key="lineGet" className="ticket-line-tab-content">
                <PerformanceTable
                  virtualized
                  data={lineDataSource}
                  ref={tableRef}
                  columns={lineGetColumns()}
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
      </Spin>
    </React.Fragment>
  );
}

export default connect(({ TicketPlatform }) => ({
  ticketModelData: TicketPlatform?.ticketModelData || [],
}))(
  formatterCollections({
    code: [`${modelCode}`],
  })(TicketPlatformPage)
);
