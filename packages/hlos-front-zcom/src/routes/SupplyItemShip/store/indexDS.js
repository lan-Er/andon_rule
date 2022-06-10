/**
 * @Description: 采购方供料发货DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-08 15:17:21
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.supplyItemShip.model';
const organizationId = getCurrentOrganizationId();
const { common, deliveryOrderCreate } = codeConfig.code;

const SupplyItemToShipDetailLineDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('订单号'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      lovCode: common.supplier,
      label: intl.get(`${commonPrefix}.suplier`).d('供应商'),
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'poInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${intlPrefix}.poInventoryOrg`).d('发货组织'),
      ignore: 'always',
    },
    {
      name: 'poInventoryOrgId',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'customerItemObj',
      type: 'object',
      lovCode: common.itemMaindata,
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      ignore: 'always',
    },
    {
      name: 'customerItemId',
      type: 'string',
      bind: 'customerItemObj.itemId',
    },
    {
      name: 'customerPromiseDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.customerPromiseDate`).d('预计到货日期'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'customerPromiseDateEnd',
      type: 'date',
      bind: 'customerPromiseDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
  ],
  fields: [
    {
      name: 'customerItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('订单号'),
    },
    {
      name: 'poOutsourceNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poOutsourceNum`).d('外协行号'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'customerPromiseQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPromiseQty`).d('需求数量'),
    },
    {
      name: 'customerUnshipped',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerUnshipped`).d('未发货数量'),
    },
    {
      name: 'customerPromiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPromiseDate`).d('预计到货日期'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/po-outsources/create-out-list`,
        data: {
          ...data,
          poStatus: 'CONFIRMED',
        },
        method: 'GET',
      };
    },
  },
});

// 已预约待发货明细
const reserveDetailLineDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'relatedDeliveryApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('预约单号'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      lovCode: common.supplier,
      label: intl.get(`${commonPrefix}.suplier`).d('供应商'),
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('订单号'),
    },
    {
      name: 'customerInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${intlPrefix}.customerInventoryOrgObj`).d('发货组织'),
      ignore: 'always',
    },
    {
      name: 'customerInventoryOrgId',
      type: 'string',
      bind: 'customerInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'customerItemObj',
      type: 'object',
      lovCode: common.itemMaindata,
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      ignore: 'always',
    },
    {
      name: 'customerItemId',
      type: 'string',
      bind: 'customerItemObj.itemId',
    },
    {
      name: 'arrivalDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'arrivalDateEnd',
      type: 'date',
      bind: 'arrivalDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
  ],
  fields: [
    {
      name: 'customerItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'relatedDeliveryApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('预约单号'),
    },
    {
      name: 'relatedApplyLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.relatedApplyLineNum`).d('行号'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'customerDeliveryQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDeliveryQty`).d('预约数量'),
    },
    {
      name: 'customerUnshippedQty', // 预约数量 - 创建发货数量
      type: 'string',
      label: intl.get(`${intlPrefix}.customerUnshippedQty`).d('已预约未发货数量'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源外协行号'),
    },
    {
      name: 'customerPromiseQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPromiseQty`).d('需求数量'),
    },
    {
      name: 'customerShippableQty', // 需求数量  -  已发货数量
      type: 'string',
      label: intl.get(`${intlPrefix}.customerShippableQty`).d('外协未发货数量'),
    },
    {
      name: 'customerUncreatedDeliveryQty', // 需求数量  -  创建发货数量
      type: 'string',
      label: intl.get(`${intlPrefix}.customerUncreatedDeliveryQty`).d('未创建发货数量'),
    },
    {
      name: 'customerInventoryOrgName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerInventoryOrgName`).d('发货组织'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
    },
    {
      name: 'deliveryOrderDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('预约发货日期'),
    },
    {
      name: 'arrivalDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consignerName`).d('发货人'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-apply-lines/query-to-create-delivery-order`,
        data: {
          ...data,
          deliverySourceType: 'PO_OUTSOURCE',
          customerTenantId: organizationId,
        },
        method: 'GET',
      };
    },
  },
});

const ShipOrderListDS = () => ({
  autoQuery: false,
  selection: 'single',
  queryFields: [
    {
      name: 'deliveryOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('发货单号'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      lovCode: common.supplier,
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'deliveryOrderType',
      type: 'string',
      lookupCode: deliveryOrderCreate.deliveryOrderType,
      label: intl.get(`${intlPrefix}.deliveryOrderType`).d('发货单类型'),
      defaultValue: 'CUSTOMER_SUPPLY_ASN',
      disabled: true,
    },
    {
      name: 'deliveryOrderStatusList',
      type: 'string',
      lookupCode: deliveryOrderCreate.deliveryOrderStatus,
      label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('发货单状态'),
      multiple: true,
    },
    {
      name: 'externalStockOutStatus',
      type: 'string',
      lookupCode: deliveryOrderCreate.externalDeliveryStatus,
      label: intl.get(`${intlPrefix}.externalStockOutStatus`).d('下发状态'),
    },
    {
      name: 'customerInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('发货组织'),
      ignore: 'always',
    },
    {
      name: 'customerInventoryOrgId',
      type: 'string',
      bind: 'customerInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'deliveryOrderDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'deliveryOrderDateEnd',
      type: 'date',
      bind: 'deliveryOrderDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
    {
      name: 'arrivalDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'arrivalDateEnd',
      type: 'date',
      bind: 'arrivalDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
  ],
  fields: [
    {
      name: 'deliveryOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('发货单号'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${commonPrefix}.customer`).d('客户'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
    },
    {
      name: 'deliveryOrderDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
    },
    {
      name: 'arrivalDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
    },
    {
      name: 'customerInventoryOrgName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('发货组织'),
    },
    {
      name: 'supplierInventoryOrgName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('供应商组织'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系方式'),
    },
    {
      name: 'externalStockOutStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalStockOutStatusMeaning`).d('下发状态'),
    },
    {
      name: 'deliveryOrderStatus',
      type: 'string',
      lookupCode: deliveryOrderCreate.deliveryOrderStatus,
      label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { deliveryOrderStatusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
          deliveryOrderStatusList,
        }),
        data: {
          ...data,
          deliveryOrderStatusList: null,
        },
        method: 'GET',
      };
    },
  },
});

const ShipOrderHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'deliveryOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('发货单号'),
    },
    {
      name: 'deliveryOrderType',
      type: 'string',
      lookupCode: deliveryOrderCreate.deliveryOrderType,
      label: intl.get(`${intlPrefix}.deliveryOrderType`).d('发货单类型'),
      required: true,
      defaultValue: 'CUSTOMER_SUPPLY_ASN',
    },
    {
      name: 'deliveryOrderStatus',
      type: 'string',
      lookupCode: deliveryOrderCreate.deliveryOrderStatus,
      label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('发货单状态'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${commonPrefix}.customer`).d('客户'),
    },
    {
      name: 'customerInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('发货组织'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'customerInventoryOrgId',
      type: 'string',
      bind: 'customerInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'customerInventoryOrgCode',
      type: 'string',
      bind: 'customerInventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'customerInventoryOrgName',
      type: 'string',
      bind: 'customerInventoryOrgObj.inventoryOrgName',
    },
    {
      name: 'deliveryAddress',
      type: 'string',
      bind: 'customerInventoryOrgObj.fullAddress',
      label: intl.get(`${intlPrefix}.deliveryAddress`).d('发货地点'),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consignerName`).d('发货人'),
    },
    {
      name: 'consignerPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consignerPhone`).d('发货人联系电话'),
    },
    {
      name: 'deliveryWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryWarehouse`).d('发货仓库'),
    },
    {
      name: 'deliveryOrderDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
      transformRequest: (val) => (val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : ''),
      required: true,
    },
    {
      name: 'arrivalDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
      transformRequest: (val) => (val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : ''),
      required: true,
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
    },
    {
      name: 'supplierInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('供应商组织'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: record.get('supplierTenantId'),
        }),
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'supplierInventoryOrgId',
      type: 'string',
      bind: 'supplierInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'supplierInventoryOrgCode',
      type: 'string',
      bind: 'supplierInventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'supplierInventoryOrgName',
      type: 'string',
      bind: 'supplierInventoryOrgObj.inventoryOrgName',
    },
    {
      name: 'receivingAddress',
      type: 'string',
      bind: 'supplierInventoryOrgObj.fullAddress',
      label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
    },
    {
      name: 'receivingWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.receivingWarehouse`).d('收货仓库'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { deliveryOrderId } = data;
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/${deliveryOrderId}`,
        data: {
          ...data,
          deliveryOrderId: undefined,
        },
        method: 'GET',
      };
    },
  },
});

const ShipOrderLineDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'deliveryOrderLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('行号'),
    },
    {
      name: 'customerItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'customerDemandQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDemandQty`).d('需求数量'),
    },
    {
      name: 'customerShippableQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerShippableQty`).d('未发货数量'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('订单号'),
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('外协行号'),
    },
    {
      name: 'customerDeliveryQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.customerDeliveryQty`).d('本次发货数量'),
      required: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines`,
        method: 'GET',
      };
    },
  },
});

export {
  SupplyItemToShipDetailLineDS,
  reserveDetailLineDS,
  ShipOrderListDS,
  ShipOrderHeadDS,
  ShipOrderLineDS,
};
