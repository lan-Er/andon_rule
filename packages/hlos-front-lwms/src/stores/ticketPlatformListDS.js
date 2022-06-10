/*
 * @Author: zhang yang
 * @Description: 送货单平台
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-02-04 16:11:04
 */

import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsTicket } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.ticket.model';
const commonCode = 'lwms.common.model';

const TicketDS = () => {
  return {
    pageSize: 100,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.scmOu`).d('收货组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'ticketNumObj',
        type: 'object',
        label: intl.get(`${preCode}.ticketNum`).d('送货单号'),
        lovCode: lwmsTicket.ticketNum,
        cascadeMap: { organizationId: 'organizationId' },
        ignore: 'always',
      },
      {
        name: 'ticketId',
        type: 'string',
        bind: 'ticketNumObj.ticketId',
      },
      {
        name: 'ticketNum',
        type: 'string',
        bind: 'ticketNumObj.ticketNum',
        ignore: 'always',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${preCode}.supplier`).d('供应商'),
        lovCode: lwmsTicket.party,
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'supplierObj.partyId',
      },
      {
        name: 'partyName',
        type: 'string',
        bind: 'supplierObj.partyName',
        ignore: 'always',
      },
      {
        name: 'ticketStatus',
        type: 'string',
        lookupCode: lwmsTicket.ticketStatus,
        label: intl.get(`${preCode}.ticketStatus`).d('送货单状态'),
        multiple: true,
      },
      {
        name: 'poNumObj',
        type: 'object',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
        lovCode: common.document,
        lovPara: { documentClass: 'PO' },
        ignore: 'always',
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'poNumObj.documentId',
      },
      {
        name: 'buyerObj',
        type: 'object',
        label: intl.get(`${preCode}.buyer`).d('采购员'),
        lovCode: lwmsTicket.buyer,
        lovPara: {
          workerType: 'BUYER',
        },
        ignore: 'always',
      },
      {
        name: 'buyerId',
        type: 'string',
        bind: 'buyerObj.workerId',
      },
      {
        name: 'buyerName',
        type: 'string',
        bind: 'buyerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
        ignore: 'always',
      },
      {
        name: 'ticketTypeObj',
        type: 'object',
        lovCode: lwmsTicket.ticketType,
        label: intl.get(`${preCode}.ticketType`).d('送货单类型'),
        lovPara: { documentClass: 'WM_DELIVERY' },
        ignore: 'always',
      },
      {
        name: 'ticketTypeId',
        type: 'string',
        bind: 'ticketTypeObj.documentTypeId',
      },
      {
        name: 'ticketTypeCode',
        type: 'string',
        bind: 'ticketTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'expectedArrivalDateStart',
        type: 'date',
        label: intl.get(`${preCode}.expectedArrivalDateStart`).d('预计到达>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('expectedArrivalDateEnd')) {
              return 'expectedArrivalDateEnd';
            }
          },
        },
      },
      {
        name: 'expectedArrivalDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.expectedArrivalDateEnd`).d('预计到达<='),
        min: 'expectedArrivalDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'actualArrivalTimeStart',
        type: 'dateTime',
        label: intl.get(`${preCode}.actualArrivalTimeStart`).d('接收时间>='),
      },
      {
        name: 'actualArrivalTimeEnd',
        type: 'dateTime',
        label: intl.get(`${preCode}.actualArrivalTimeEnd`).d('接收时间<='),
      },
      {
        name: 'receiveWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'receiveWarehouseId',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseId',
      },
      {
        name: 'receiveWarehouseName',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseName',
      },
      {
        name: 'inventoryWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'inventoryWarehouseId',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseId',
      },
      {
        name: 'inventoryWarehouseName',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseName',
      },
    ],
    fields: [
      {
        name: 'receiveOrganization',
        label: intl.get(`${preCode}.organization`).d('收货组织'),
      },
      {
        name: 'ticketNum',
        label: intl.get(`${preCode}.ticketNum`).d('送货单号'),
      },
      {
        name: 'partyName',
        label: intl.get(`${preCode}.party`).d('供应商'),
      },
      {
        name: 'partySiteName',
        label: intl.get(`${preCode}.partySite`).d('供应商地点'),
      },
      {
        name: 'ticketTypeName',
        label: intl.get(`${preCode}.ticketType`).d('送货单类型'),
      },
      {
        name: 'ticketStatusMeaning',
        label: intl.get(`${preCode}.ticketStatus`).d('送货单状态'),
      },
      {
        name: 'scmOuName',
        label: intl.get(`${preCode}.scmOu`).d('采购中心'),
      },
      {
        name: 'poNum',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
      },
      {
        name: 'poLineNum',
        label: intl.get(`${preCode}.poLineNum`).d('采购订单行号'),
      },
      {
        name: 'buyer',
        label: intl.get(`${preCode}.buyer`).d('采购员'),
      },
      {
        name: 'deliveryArea',
        label: intl.get(`${preCode}.deliveryArea`).d('收货区域'),
      },
      {
        name: 'ticketSourceTypeMeaning',
        label: intl.get(`${preCode}.ticketSourceType`).d('来源类型'),
      },
      {
        name: 'shippedDate',
        label: intl.get(`${preCode}.shippedDate`).d('发货时间'),
      },
      {
        name: 'expectedArrivalDate',
        label: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达日期'),
      },
      {
        name: 'carrier',
        label: intl.get(`${preCode}.carrier`).d('承运人'),
      },
      {
        name: 'carrierContact',
        label: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
      },
      {
        name: 'shipTicket',
        label: intl.get(`${preCode}.shipTicket`).d('发运单号'),
      },
      {
        name: 'plateNum',
        label: intl.get(`${preCode}.plateNum`).d('车牌号'),
      },
      {
        name: 'freight',
        label: intl.get(`${preCode}.freight`).d('运费'),
      },
      {
        name: 'currencyName',
        label: intl.get(`${preCode}.currency`).d('币种'),
      },
      {
        name: 'creator',
        label: intl.get(`${preCode}.creator`).d('制单人'),
      },
      {
        name: 'ticketCreatedDate',
        label: intl.get(`${preCode}.ticketCreatedDate`).d('制单时间'),
      },
      {
        name: 'ticketCroup',
        label: intl.get(`${preCode}.ticketCroup`).d('单据组'),
      },
      {
        name: 'printedFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      },
      {
        name: 'printedDate',
        label: intl.get(`${preCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'sourceDocTypeName',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'docProcessRule',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'approvalRule',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
      },
      {
        name: 'approvalWorkflow',
        label: intl.get(`${preCode}.approvalWorkflow`).d('审批工作流'),
      },
      {
        name: 'remark',
        label: intl.get(`${preCode}.remark`).d('备注'),
      },
      {
        name: 'externalTicketTypeMeaning',
        label: intl.get(`${preCode}.externalTicketTypeMeaning`).d('外部类型'),
      },
      {
        name: 'externalId',
        label: intl.get(`${preCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'actualArrivalTime',
        label: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
      },
      {
        name: 'receiveWorkerName',
        label: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
      },
      {
        name: 'inspectedTime',
        label: intl.get(`${preCode}.inspectedTime`).d('检验时间'),
      },
      {
        name: 'inspectorName',
        label: intl.get(`${preCode}.inspector`).d('检验员工'),
      },
      {
        name: 'inventoryTime',
        label: intl.get(`${preCode}.inventoryTime`).d('入库时间'),
      },
      {
        name: 'inventoryWorkerName',
        label: intl.get(`${preCode}.inventoryWorker`).d('入库员工'),
      },
      {
        name: 'receiveWarehouseName',
        label: intl.get(`${preCode}.receiveWarehouse`).d('默认接收仓库'),
      },
      {
        name: 'receiveWmAreaName',
        label: intl.get(`${preCode}.receiveWmArea`).d('默认接收货位'),
      },
      {
        name: 'inventoryWarehouseName',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('默认入库仓库'),
      },
      {
        name: 'inventoryWmAreaName',
        label: intl.get(`${preCode}.inventoryWmArea`).d('默认入库货位'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { ticketStatus: ticketStatusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets`, {
            ticketStatusList,
          }),
          data: {
            ...data,
            ticketStatus: undefined,
          },
          method: 'GET',
        };
      },
      destroy: (data) => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/delivery-tickets`,
          data: data.map((item) => item.ticketId),
          method: 'DELETE',
        };
      },
    },
  };
};

const TicketLineDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'ticketLineNum',
        label: intl.get(`${preCode}.ticketLineNum`).d('行号'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${preCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
      },
      {
        name: 'uom',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'deliveryQty',
        label: intl.get(`${preCode}.deliveryQty`).d('送货数量'),
      },
      {
        name: 'poNum',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
      },
      {
        name: 'poLineNum',
        label: intl.get(`${preCode}.poLineNum`).d('采购订单行号'),
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      },
      {
        name: 'ticketLineStatusMeaning',
        label: intl.get(`${preCode}.ticketLineStatus`).d('行状态'),
      },
      {
        name: 'recieveRuleMeaning',
        label: intl.get(`${preCode}.recieveRule`).d('收货类型'),
      },
      {
        name: 'itemControlTypeMeaning',
        label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
      },
      {
        name: 'secondUom',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondDeliveryQty',
        label: intl.get(`${preCode}.secondDeliveryQty`).d('辅助单位数量'),
      },
      {
        name: 'receiveToleranceTypeMeaninng',
        label: intl.get(`${preCode}.receiveToleranceType`).d('允差类型'),
      },
      {
        name: 'receiveTolerance',
        label: intl.get(`${preCode}.receiveTolerance`).d('允差值'),
      },
      {
        name: 'partyLotCode',
        label: intl.get(`${preCode}.partyLotCode`).d('供应商批次'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tagCode`).d('指定标签'),
      },
      {
        name: 'packingQty',
        label: intl.get(`${preCode}.packingQty`).d('单位包装数量'),
      },
      {
        name: 'containerQty',
        label: intl.get(`${preCode}.containerQty`).d('包装数量'),
      },
      {
        name: 'sourceDocTypeName',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'lineRemark',
        label: intl.get(`${preCode}.lineRemark`).d('行备注'),
      },
      {
        name: 'externalId',
        label: intl.get(`${preCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'externalLineId',
        label: intl.get(`${preCode}.externalLineId`).d('外部行ID'),
      },
      {
        name: 'externalLineNum',
        label: intl.get(`${preCode}.externalLineNum`).d('外部单据行号'),
      },
      {
        name: 'receivedQty',
        label: intl.get(`${preCode}.receivedQty`).d('实收数量'),
      },
      {
        name: 'inventoryQty',
        label: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${preCode}.qcOkQty`).d('检验合格数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${preCode}.qcNgQty`).d('检验不合格数量'),
      },
      {
        name: 'qcNgReason',
        label: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
      },
      {
        name: 'qcDocNum',
        label: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
      },
      {
        name: 'returnedQty',
        label: intl.get(`${preCode}.returnedQty`).d('退货数量'),
      },
      {
        name: 'actualArrivalTime',
        label: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
      },
      {
        name: 'receiveWorkerName',
        label: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
      },
      {
        name: 'inspectedTime',
        label: intl.get(`${preCode}.inspectedTime`).d('检验时间'),
      },
      {
        name: 'inspectorName',
        label: intl.get(`${preCode}.inspector`).d('检验员工'),
      },
      {
        name: 'inventoryTime',
        label: intl.get(`${preCode}.inventoryTime`).d('入库时间'),
      },
      {
        name: 'inventoryWorkerName',
        label: intl.get(`${preCode}.inventoryWorker`).d('入库员工'),
      },
      {
        name: 'receiveWarehouseName',
        label: intl.get(`${preCode}.receiveWarehouseReal`).d('接收仓库'),
      },
      {
        name: 'receiveWmAreaName',
        label: intl.get(`${preCode}.receiveWmAreaReal`).d('接收货位'),
      },
      {
        name: 'inventoryWarehouseName',
        label: intl.get(`${preCode}.inventoryWarehouseReal`).d('入库仓库'),
      },
      {
        name: 'inventoryWmAreaName',
        label: intl.get(`${preCode}.inventoryWmAreaReal`).d('入库货位'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/delivery-ticket-lines`,
          method: 'GET',
        };
      },
    },
  };
};

export { TicketDS, TicketLineDS };
