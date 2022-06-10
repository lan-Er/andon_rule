/**
 * @Description: 发货单平台--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-09 11:36:03
 * @LastEditors: yiping.liu
 */
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import moment from 'moment';

import codeConfig from '@/common/codeConfig';

const { common, lwmsShipPlatform } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.shipPlatform.model';
const commonCode = 'lwms.common.model';

const headDS = () => {
  return {
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrg`).d('发货组织'),
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
        name: 'shipOrderObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrder`).d('发货单号'),
        lovCode: lwmsShipPlatform.shipOrder,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record?.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'shipOrderId',
        type: 'string',
        bind: 'shipOrderObj.shipOrderId',
      },
      {
        name: 'shipOrderNum',
        type: 'string',
        bind: 'shipOrderObj.shipOrderNum',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${preCode}.customer`).d('客户'),
        lovCode: lwmsShipPlatform.customer,
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customer',
        type: 'string',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'shipOrderStatus',
        type: 'string',
        label: intl.get(`${preCode}.shipOrderStatus`).d('发货单状态'),
        lookupCode: lwmsShipPlatform.shipOrderStatus,
        multiple: true,
        defaultValue: ['NEW', 'RELEASED', 'PICKED', 'EXECUTED'],
      },
      {
        name: 'poNumObj',
        type: 'object',
        label: intl.get(`${preCode}.poNum`).d('销售订单号'),
        lovCode: lwmsShipPlatform.poNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            customerId: record?.get('customerId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'poNumObj.soHeaderId',
      },
      {
        name: 'poNum',
        type: 'string',
        bind: 'poNumObj.soHeaderNumber',
      },
      {
        name: 'salesmanObj',
        type: 'object',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
        lovCode: common.worker,
        ignore: 'always',
        lovPara: { workerType: 'SALESMAN' },
      },
      {
        name: 'salesmanId',
        type: 'string',
        bind: 'salesmanObj.workerId',
      },
      {
        name: 'salesman',
        type: 'string',
        bind: 'salesmanObj.workerName',
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
        name: 'itemName',
        type: 'string',
        bind: 'itemObj.itemCode',
        ignore: 'always',
      },
      {
        name: 'shipOrderTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrderType`).d('发货单类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'WM_SHIP_ORDER' },
        ignore: 'always',
        textField: 'documentTypeName',
      },
      {
        name: 'shipOrderTypeId',
        type: 'string',
        bind: 'shipOrderTypeObj.documentTypeId',
      },
      {
        name: 'shipOrderType',
        type: 'string',
        bind: 'shipOrderTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'demandNumObj',
        type: 'object',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
        lovCode: lwmsShipPlatform.demandNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            customerId: record?.get('customerId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'demandNumId',
        type: 'string',
        bind: 'demandNumObj.demandId',
        ignore: 'always',
      },
      {
        name: 'demandNum',
        type: 'string',
        bind: 'demandNumObj.demandNumber',
      },
      {
        name: 'createWorkerObj',
        type: 'object',
        label: intl.get(`${commonCode}.createWorker`).d('制单员工'),
        lovCode: common.worker,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record?.get('organizationId'),
          }),
        },
      },
      {
        name: 'creatorId',
        type: 'string',
        bind: 'createWorkerObj.workerId',
      },
      {
        name: 'creatorName',
        type: 'string',
        bind: 'createWorkerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'startDate',
        type: 'date',
        label: intl.get(`${preCode}.minShippedDate`).d('发出时间>='),
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record?.get('endDate'))) {
              return 'endDate';
            }
          },
        },
      },
      {
        name: 'endDate',
        type: 'date',
        label: intl.get(`${preCode}.maxShippedDate`).d('发出时间<='),
        min: 'startDate',
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        name: 'customerReceiveType',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveType`).d('客户接收类型'),
      },
      {
        name: 'customerReceiveOrg',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveOrg`).d('客户接收组织'),
      },
      {
        name: 'customerReceiveWm',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveWm`).d('客户接收仓库'),
      },
      {
        name: 'customerInventoryWm',
        type: 'string',
        label: intl.get(`${preCode}.customerInventoryWm`).d('客户入库仓库'),
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPO`).d('客户PO'),
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.toWarehouse`).d('发出仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record?.get('organizationId'),
          }),
        },
      },
      {
        name: 'warehouseId',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseName',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'creationDateLeft',
        type: 'date',
        label: intl.get(`${preCode}.creationDateLeft`).d('制单时间>='),
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record?.get('creationDateRight'))) {
              return 'creationDateRight';
            }
          },
        },
      },
      {
        name: 'creationDateRight',
        type: 'date',
        label: intl.get(`${preCode}.creationDateRight`).d('制单时间<='),
        min: 'creationDateLeft',
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      },
    ],
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        ignore: 'always',
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
        name: 'shipOrganization',
        type: 'string',
        label: intl.get(`${preCode}.shipOrg`).d('发货组织'),
      },
      {
        name: 'shipOrderObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrder`).d('发货单号'),
        lovCode: lwmsShipPlatform.shipOrder,
        ignore: 'always',
      },
      {
        name: 'shipOrderId',
        type: 'string',
        bind: 'shipOrderObj.id',
      },
      {
        name: 'shipOrderNum',
        type: 'string',
        bind: 'shipOrderObj.shipOrderNum',
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${preCode}.customer`).d('客户'),
        transformRequest: (val, obj) => val || obj.customer,
      },
      {
        name: 'customerSiteName',
        type: 'string',
        label: intl.get(`${preCode}.customerSite`).d('客户地点'),
      },
      {
        name: 'shipOrderTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrderType`).d('发货单类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'WM_SHIP_ORDER' },
        ignore: 'always',
      },
      {
        name: 'shipOrderTypeId',
        type: 'string',
        bind: 'shipOrderTypeObj.documentTypeId',
      },
      {
        name: 'shipOrderTypeName',
        type: 'string',
        bind: 'shipOrderTypeObj.documentTypeName',
      },
      {
        name: 'shipOrderStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.shipOrderStatus`).d('发货单状态'),
      },
      {
        name: 'sopOuName',
        type: 'string',
        label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      },
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${preCode}.poNum`).d('销售订单号'),
      },
      {
        name: 'poLineNum',
        type: 'string',
        label: intl.get(`${preCode}.poLineNum`).d('销售订单行号'),
      },
      {
        name: 'demandNum',
        type: 'string',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      },
      {
        name: 'salesman',
        type: 'string',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
      },
      {
        name: 'wareHouse',
        type: 'string',
        label: intl.get(`${preCode}.warehouse`).d('发出仓库'),
      },
      {
        name: 'wmArea',
        type: 'string',
        label: intl.get(`${preCode}.wmArea`).d('发出货位'),
      },
      {
        name: 'customerReceiveType',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveType`).d('客户接收类型'),
      },
      {
        name: 'customerReceiveOrg',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveOrg`).d('客户接收组织'),
      },
      {
        name: 'customerReceiveWm',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveWm`).d('客户接收仓库'),
      },
      {
        name: 'customerInventoryWm',
        type: 'string',
        label: intl.get(`${preCode}.customerInventoryWm`).d('客户入库仓库'),
      },
      {
        name: 'shipOrderGroup',
        type: 'string',
        label: intl.get(`${preCode}.shipOrderGroup`).d('发货单组'),
      },
      {
        name: 'shipToSite',
        type: 'string',
        label: intl.get(`${preCode}.shipToSite`).d('收货地点'),
      },
      {
        name: 'customerContact',
        type: 'string',
        label: intl.get(`${preCode}.customerContact`).d('客户联系人'),
      },
      {
        name: 'contactPhone',
        type: 'string',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'contactEmail',
        type: 'string',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'customerAddress',
        type: 'string',
        label: intl.get(`${preCode}.customerAddress`).d('客户地址'),
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPO`).d('客户PO'),
      },
      {
        name: 'customerPoLine',
        type: 'string',
        label: intl.get(`${preCode}.customerPOLine`).d('客户PO行'),
      },
      {
        name: 'creatorName',
        type: 'string',
        label: intl.get(`${commonCode}.creator`).d('制单人'),
      },
      {
        name: 'approvalRuleMeaning',
        type: 'string',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
      },
      {
        name: 'approvalWorkflow',
        type: 'string',
        label: intl.get(`${preCode}.approvalWorkflow`).d('审批工作流'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${commonCode}.creationDate`).d('制单时间'),
      },
      {
        name: 'printedFlag',
        type: 'boolean',
        label: intl.get(`${commonCode}.printedFlag`).d('打印标识'),
      },
      {
        name: 'printedDate',
        type: 'string',
        label: intl.get(`${commonCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'sourceDocType',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'docProcessRuleName',
        type: 'string',
        label: intl.get(`${commonCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'externalShipType',
        type: 'string',
        label: intl.get(`${preCode}.externalShipType`).d('外部单据类型'),
      },
      {
        name: 'externalId',
        type: 'string',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'carrier',
        type: 'string',
        label: intl.get(`${commonCode}.carrier`).d('承运人'),
      },
      {
        name: 'carrierContact',
        type: 'string',
        label: intl.get(`${commonCode}.carrierContact`).d('承运人联系方式'),
      },
      {
        name: 'shipTicket',
        type: 'string',
        label: intl.get(`${preCode}.shipOrder`).d('发货单号'),
      },
      {
        name: 'plateNum',
        type: 'string',
        label: intl.get(`${commonCode}.plateNum`).d('车牌号'),
      },
      {
        name: 'freight',
        type: 'string',
        label: intl.get(`${commonCode}.freight`).d('运费'),
      },
      {
        name: 'shippingMethod',
        type: 'string',
        label: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
        lookupCode: lwmsShipPlatform.shippingMethod,
      },
      {
        name: 'currency',
        type: 'string',
        label: intl.get(`${commonCode}.currency`).d('币种'),
      },
      {
        name: 'planShipDate',
        type: 'string',
        label: intl.get(`${preCode}.planShipDate`).d('计划发货时间'),
      },
      {
        name: 'applyShipDate',
        type: 'string',
        label: intl.get(`${preCode}.applyShipDate`).d('请求发货时间'),
      },
      {
        name: 'shippedDate',
        type: 'string',
        label: intl.get(`${preCode}.shippedDate`).d('发出时间'),
      },
      {
        name: 'shipWorker',
        type: 'string',
        label: intl.get(`${preCode}.shipWorker`).d('发出员工'),
      },
      {
        name: 'expectedArrivalDate',
        type: 'string',
        label: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达时间'),
      },
      {
        name: 'arrivedDate',
        type: 'string',
        label: intl.get(`${preCode}.arrivedDate`).d('到达时间'),
      },
      {
        name: 'confirmWorker',
        type: 'string',
        label: intl.get(`${preCode}.confirmWorker`).d('到货确认员工'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { shipOrderStatus: statusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers`, {
            statusList,
          }),
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          data: {
            ...data,
            shipOrderStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

const lineDS = () => {
  return {
    pageSize: 100,
    fields: [
      {
        name: 'no',
        type: 'string',
        label: intl.get(`${preCode}.shipLineNum`).d('行号'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'uom',
        type: 'string',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'applyQty',
        type: 'object',
        label: intl.get(`${commonCode}.applyQty`).d('申请数量'),
      },
      {
        name: 'soNum',
        type: 'string',
        label: intl.get(`${preCode}.poNum`).d('销售订单号'),
      },
      {
        name: 'soLineNum',
        type: 'string',
        label: intl.get(`${preCode}.poLineNum`).d('销售订单行号'),
      },
      {
        name: 'demandNum',
        type: 'string',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      },
      {
        name: 'promiseDate',
        type: 'string',
        label: intl.get(`${commonCode}.promiseShipDate`).d('承诺日期'),
      },
      {
        name: 'lineStatusMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.shipLineStatus`).d('行状态'),
      },
      {
        name: 'wareHouse',
        type: 'string',
        label: intl.get(`${preCode}.warehouse`).d('发出仓库'),
      },
      {
        name: 'wmArea',
        type: 'string',
        label: intl.get(`${preCode}.wmArea`).d('发出货位'),
      },
      {
        name: 'toWareHouse',
        type: 'string',
        label: intl.get(`${commonCode}.toWarehouse`).d('目标仓库'),
      },
      {
        name: 'toWmArea',
        type: 'string',
        label: intl.get(`${commonCode}.toWmArea`).d('目标货位'),
      },
      {
        name: 'customerReceiveType',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveType`).d('客户接收类型'),
      },
      {
        name: 'customerReceiveOrg',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveOrg`).d('客户接收组织'),
      },
      {
        name: 'customerReceiveWm',
        type: 'string',
        label: intl.get(`${preCode}.customerReceiveWm`).d('客户接收仓库'),
      },
      {
        name: 'customerInventoryWm',
        type: 'string',
        label: intl.get(`${preCode}.customerInventoryWm`).d('客户入库仓库'),
      },
      {
        name: 'itemControlTypeMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
      },
      {
        name: 'secondUom',
        type: 'string',
        label: intl.get(`${commonCode}.secondUOM`).d('辅助单位'),
      },
      {
        name: 'secondApplyQty',
        type: 'string',
        label: intl.get(`${commonCode}.secondApplyQty`).d('辅助单位数量'),
      },
      {
        name: 'customerItem',
        type: 'string',
        label: intl.get(`${preCode}.customerItem`).d('客户物料'),
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPO`).d('客户PO'),
      },
      {
        name: 'customerPoLine',
        type: 'string',
        label: intl.get(`${preCode}.customerPOLine`).d('客户PO行'),
      },
      {
        name: 'sourceDocType',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${commonCode}.lineRemark`).d('行备注'),
      },
      {
        name: 'externalId',
        type: 'string',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'externalLineId',
        type: 'string',
        label: intl.get(`${commonCode}.externalLineID`).d('外部行ID'),
      },
      {
        name: 'externalLineNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalLineNum`).d('外部单据行号'),
      },
      {
        name: 'pickedFlag',
        type: 'string',
        label: intl.get(`${preCode}.pickedFlag`).d('拣货标识'),
      },
      {
        name: 'pickedQty',
        type: 'string',
        label: intl.get(`${preCode}.pickedQty`).d('拣货数量'),
      },
      {
        name: 'shippedQty',
        type: 'string',
        label: intl.get(`${commonCode}.shippedQty`).d('发出数量'),
      },
      {
        name: 'confirmedQty',
        type: 'string',
        label: intl.get(`${preCode}.confirmedQty`).d('收货数量'),
      },
      {
        name: 'qcOkQty',
        type: 'string',
        label: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      },
      {
        name: 'qcNgQty',
        type: 'string',
        label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'qcDocNum',
        type: 'string',
        label: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
      },
      {
        name: 'qcNgReason',
        type: 'string',
        label: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
      },
      {
        name: 'pickedWorker',
        type: 'string',
        label: intl.get(`${preCode}.pickedWorker`).d('拣货员工'),
      },
      {
        name: 'pickRule',
        type: 'string',
        label: intl.get(`${preCode}.pickRule`).d('拣货规则'),
      },
      {
        name: 'reservationRule',
        type: 'string',
        label: intl.get(`${commonCode}.reservationRule`).d('预留规则'),
      },
      {
        name: 'fifoRule',
        type: 'string',
        label: intl.get(`${preCode}.fifoRule`).d('FIFO规则'),
      },
      {
        name: 'shipRule',
        type: 'string',
        label: intl.get(`${preCode}.shipRule`).d('发货规则'),
      },
      {
        name: 'packingRule',
        type: 'string',
        label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      },
      {
        name: 'wmInspectRule',
        type: 'string',
        label: intl.get(`${preCode}.wmInspectRule`).d('质检规则'),
      },
      {
        name: 'packingFormatMeaning',
        type: 'string',
        label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      },
      {
        name: 'packingMaterial',
        type: 'string',
        label: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
      },
      {
        name: 'minPackingQty',
        type: 'string',
        label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
      },
      {
        name: 'packingQty',
        type: 'string',
        label: intl.get(`${preCode}.packingQty`).d('单位包装数'),
      },
      {
        name: 'containerQty',
        type: 'string',
        label: intl.get(`${preCode}.containerQty`).d('箱数'),
      },
      {
        name: 'palletQty',
        type: 'string',
        label: intl.get(`${preCode}.palletQty`).d('托盘数'),
      },
      {
        name: 'packageNum',
        type: 'string',
        label: intl.get(`${preCode}.packageNum`).d('包装编号'),
      },
      {
        name: 'tagTemplate',
        type: 'string',
        label: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${commonCode}.lotNumber`).d('指定批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('指定标签'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/ship-order-lines`,
          method: 'GET',
        };
      },
    },
  };
};

export { headDS, lineDS };
