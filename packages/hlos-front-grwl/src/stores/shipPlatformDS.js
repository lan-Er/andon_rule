/*
 * @module: 发货单平台
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-20 10:29:44
 * @LastEditTime: 2021-06-25 19:04:40
 * @copyright: Copyright (c) 2020,Hand
 */
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { myModule } from '@/common/index';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';

import codeConfig from '@/common/codeConfig';

const { common, lwmsShipPlatform } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.shipPlatform.model';
const commonCode = 'lwms.common.model';

const headDS = () => {
  return {
    pageSize: 20,
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
            organizationId: record.get('organizationId'),
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
            customerId: record.get('customerId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'soId',
        type: 'string',
        bind: 'poNumObj.soHeaderId',
      },
      {
        name: 'soNum',
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
            customerId: record.get('customerId'),
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
            organizationId: record.get('organizationId'),
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
        name: 'shippedDateStart',
        type: 'date',
        label: intl.get(`${preCode}.minShippedDate`).d('发出时间>='),
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record.get('shippedDateEnd'))) {
              return 'shippedDateEnd';
            }
          },
        },
      },
      {
        name: 'shippedDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.maxShippedDate`).d('发出时间<='),
        min: 'shippedDateStart',
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
        name: 'customerPoNum',
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
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'fromWarehouseId',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'fromWarehouseName',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'creationDateStart',
        type: 'date',
        label: intl.get(`${preCode}.creationDateStart`).d('制单时间>='),
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record.get('creationDateEnd'))) {
              return 'creationDateEnd';
            }
          },
        },
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.creationDateEnd`).d('制单时间<='),
        min: 'creationDateStart',
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        name: 'customerDeliveryTicketNum',
        type: 'string',
        label: intl.get(`${commonCode}.customerDeliveryTicketNum`).d('客户送货单号'),
      },
      {
        name: 'srmFlag',
        label: '是否传给SRM',
        type: 'string',
        lookupCode: common.flagInt,
      },
      {
        name: 'printedFlag',
        label: '是否已打印',
        type: 'string',
        lookupCode: common.printStatus,
      },
    ],
    transport: {
      read: ({ data }) => {
        const { shipOrderStatus: shipOrderStatusList } = data;
        return {
          url: generateUrlWithGetParam(`${myModule.lwmss}/v1/${organizationId}/grwl-ship-orders`, {
            shipOrderStatusList,
          }),
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
    selection: false,
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
        label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
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
