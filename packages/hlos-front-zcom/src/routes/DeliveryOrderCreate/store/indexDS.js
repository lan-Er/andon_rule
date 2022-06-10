/*
 * @Descripttion: 发货单列表DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-29 10:04:23
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryOrderCreate.model';
const { common, deliveryOrderCreate } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const url = `${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`;
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines`;

const DeliveryOrderListDS = () => {
  return {
    autoQuery: true,
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
        name: 'customerObj',
        type: 'object',
        lovCode: common.customer,
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerTenantId',
        type: 'string',
        bind: 'customerObj.customerTenantId',
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: deliveryOrderCreate.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('发货单类型'),
      },
      {
        name: 'deliveryOrderStatusList',
        type: 'string',
        lookupCode: deliveryOrderCreate.deliveryOrderStatus,
        multiple: true,
        label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('发货单状态'),
        defaultValue: ['NEW', 'DELIVERED'],
      },
      {
        name: 'externalStockOutStatus',
        type: 'string',
        lookupCode: deliveryOrderCreate.externalDeliveryStatus,
        label: intl.get(`${intlPrefix}.externalStockOutStatus`).d('下发状态'),
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.poInventoryOrg`).d('发货组织'),
        lovCode: common.inventoryOrg,
        ignore: 'always',
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'recvObj',
        type: 'object',
        lovCode: deliveryOrderCreate.recv,
        label: intl.get(`${intlPrefix}.recv`).d('接收方'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('customerTenantId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'recvSupplierId',
        type: 'string',
        bind: 'recvObj.recvSupplierId',
      },
      {
        name: 'recvCompanyId',
        type: 'string',
        bind: 'recvObj.recvCompanyId',
      },
      {
        name: 'receivingType',
        type: 'string',
        bind: 'recvObj.receivingType',
      },
      // {
      //   name: 'relatedDeliveryApplyNum',
      //   type: 'string',
      //   label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('关联预约单号'),
      // },
      {
        name: 'deliveryOrderDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deliveryOrderDateEnd',
        type: 'date',
        bind: 'deliveryOrderDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'arrivalDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'arrivalDateEnd',
        type: 'date',
        bind: 'arrivalDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
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
        name: 'recvName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recv`).d('接收方'),
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
        name: 'externalStockOutStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.externalStockOutStatusMeaning`).d('下发状态'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('客户组织'),
      },
      {
        name: 'recvInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('接收组织'),
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
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('关联预约单号'),
      },
      {
        name: 'deliveryOrderStatusMeaning',
        type: 'string',
        lookupCode: deliveryOrderCreate.deliveryApplyStatus,
        label: intl.get(`${intlPrefix}.deliveryOrderStatusMeaning`).d('发货单状态'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { deliveryOrderStatusList, receivingType = '' } = data;

        let params;
        if (receivingType === 'SUB_COMPANY') {
          params = {
            recvSupplierId: null,
          };
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          params = {
            recvCompanyId: null,
          };
        }

        return {
          url: generateUrlWithGetParam(url, {
            deliveryOrderStatusList,
          }),
          data: {
            ...data,
            ...params,
            customerTenantId: null,
            deliveryOrderDateStart: data.deliveryOrderDateStart
              ? `${data.deliveryOrderDateStart} 00:00:00`
              : null,
            deliveryOrderDateEnd: data.deliveryOrderDateEnd
              ? `${data.deliveryOrderDateEnd} 23:59:59`
              : null,
            arrivalDateStart: data.arrivalDateStart ? `${data.arrivalDateStart} 00:00:00` : null,
            arrivalDateEnd: data.arrivalDateEnd ? `${data.arrivalDateEnd} 23:59:59` : null,
            deliveryOrderStatusList: null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryOrderLineListDS = () => {
  return {
    autoQuery: true,
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
        name: 'deliveryOrderLineStatusList',
        type: 'string',
        lookupCode: deliveryOrderCreate.deliveryOrderStatus,
        multiple: true,
        label: intl.get(`${intlPrefix}.deliveryLineOrderStatus`).d('发货单状态'),
      },
      {
        name: 'customerObj',
        type: 'object',
        lovCode: common.customer,
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerTenantId',
        type: 'string',
        bind: 'customerObj.customerTenantId',
      },
      {
        name: 'companyObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.companyObj`).d('公司'),
        lovCode: common.company,
        ignore: 'always',
      },
      {
        name: 'supplierCompanyId',
        type: 'string',
        bind: 'companyObj.companyId',
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.poInventoryOrg`).d('发货组织'),
        lovCode: common.inventoryOrg,
        ignore: 'always',
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'customerItemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
        lovCode: common.itemMaindata,
        ignore: 'always',
      },
      {
        name: 'supplierItemId',
        type: 'string',
        bind: 'customerItemObj.itemId',
      },
      // {
      //   name: 'customerItemCode',
      //   type: 'string',
      //   bind: 'customerItemObj.itemCode',
      // },
      {
        name: 'recvObj',
        type: 'object',
        lovCode: deliveryOrderCreate.recv,
        label: intl.get(`${intlPrefix}.recv`).d('接收方'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('customerTenantId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'recvSupplierId',
        type: 'string',
        bind: 'recvObj.recvSupplierId',
      },
      {
        name: 'recvCompanyId',
        type: 'string',
        bind: 'recvObj.recvCompanyId',
      },
      {
        name: 'receivingType',
        type: 'string',
        bind: 'recvObj.receivingType',
      },
      {
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('关联预约单号'),
      },
      {
        name: 'deliveryOrderDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deliveryOrderDateEnd',
        type: 'date',
        bind: 'deliveryOrderDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'arrivalDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'arrivalDateEnd',
        type: 'date',
        bind: 'arrivalDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('发货单号'),
      },
      {
        name: 'deliveryOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('行号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('客户物料信息'),
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDesc`).d('客户物料信息'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料信息'),
      },
      {
        name: 'supplierItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemDesc`).d('供应商物料信息'),
      },
      {
        name: 'itemAttr',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'supplierUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierUomName`).d('单位'),
      },
      {
        name: 'supplierDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDeliveryQty`).d('发货数量'),
      },
      {
        name: 'supplierReceivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierReceivedQty`).d('接收数量'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDeliveryQty`).d('来源单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierReceivedQty`).d('来源单行号'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'supplierCompanyName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('公司'),
      },
      {
        name: 'recvName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recv`).d('接收方'),
      },
      {
        name: 'deliveryOrderDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
      },
      {
        name: 'arrivalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
      },
      {
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('关联预约单号'),
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrgName`).d('发货组织'),
      },
      {
        name: 'deliveryAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryAddress`).d('发货地点'),
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
        name: 'deliveryOrderLineStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineStatusMeaning`).d('发货单状态'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { deliveryOrderLineStatusList, receivingType } = data;
        let params;
        if (receivingType === 'SUB_COMPANY') {
          params = {
            recvSupplierId: null,
          };
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          params = {
            recvCompanyId: null,
          };
        }
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/query-all-delivery-line`,
            {
              deliveryOrderLineStatusList,
            }
          ),
          data: {
            ...data,
            ...params,
            deliveryOrderDateStart: data.deliveryOrderDateStart
              ? `${data.deliveryOrderDateStart} 00:00:00`
              : null,
            deliveryOrderDateEnd: data.deliveryOrderDateEnd
              ? `${data.deliveryOrderDateEnd} 23:59:59`
              : null,
            arrivalDateStart: data.arrivalDateStart ? `${data.arrivalDateStart} 00:00:00` : null,
            arrivalDateEnd: data.arrivalDateEnd ? `${data.arrivalDateEnd} 23:59:59` : null,
            deliveryOrderLineStatusList: null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryOrderHeadDS = () => {
  return {
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
      },
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: deliveryOrderCreate.deliveryOrderStatus,
        label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('发货单状态'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('供应商组织'),
      },
      {
        name: 'deliveryAddress',
        type: 'string',
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
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'arrivalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('关联预约单号'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('客户组织'),
      },
      {
        name: 'recvSupplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvSupplierName`).d('接收方'),
      },
      {
        name: 'recvCompanyName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvCompanyName`).d('接收方'),
      },
      {
        name: 'recvSupplierOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvSupplierOrgName`).d('接收组织'),
      },
      {
        name: 'recvInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvInventoryOrgName`).d('接收组织'),
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
          url: `${url}/${deliveryOrderId}`,
          data: {
            ...data,
            deliveryOrderId: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryOrderLineDS = () => {
  return {
    autoQuery: false,
    fields: [
      {
        name: 'deliveryOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('行号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
      },
      {
        name: 'supplierItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
      },
      {
        name: 'itemAttr',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'supplierUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierUomName`).d('单位'),
      },
      {
        name: 'supplierPromiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierPromiseQty`).d('总数量'),
      },
      {
        name: 'supplierShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierShippableQty`).d('订单未发货数量'),
      },
      {
        name: 'supplierUnshippedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierUnshippedQty`).d('已预约未发货数量'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('订单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('订单行号'),
      },
      {
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('关联预约单号'),
      },
      {
        name: 'customerDemandDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.customerDemandDate`).d('期望到货日期'),
      },
      {
        name: 'supplierPromiseDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('承诺到货日期'),
      },
      {
        name: 'supplierDeliveryQty',
        type: 'number',
        validator: positiveNumberValidator,
        label: intl.get(`${intlPrefix}.supplierDeliveryQty`).d('本次发货数量'),
        required: true,
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          data,
          url: lineUrl,
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryDetailLogisticsDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'sourceDocId',
        type: 'string',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
      },
      {
        name: 'logisticsCompany',
        type: 'string',
        label: intl.get(`${intlPrefix}.logisticsCompany`).d('物流公司'),
      },
      {
        name: 'logisticsNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.logisticsNumber`).d('物流单号'),
      },
      {
        name: 'freight',
        type: 'string',
        label: intl.get(`${intlPrefix}.freight`).d('物流费用（元）'),
      },
      {
        name: 'deliverer',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliverer`).d('承运人'),
      },
      {
        name: 'delivererPhone',
        type: 'string',
        label: intl.get(`${intlPrefix}.delivererPhone`).d('承运人联系方式'),
      },
      {
        name: 'consigneePhone',
        type: 'string',
        label: intl.get(`${intlPrefix}.consigneePhone`).d('收件人手机号'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          data,
          url: `${HLOS_ZCOM}/v1/${organizationId}/logisticss`,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        const { logisticsId = '' } = data[0];
        return {
          data: {
            ...data[0],
            tenantId: organizationId,
            logisticsSourceType: 'DELIVERY',
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/logisticss`,
          method: logisticsId ? 'PUT' : 'POST',
        };
      },
      // create: ({ data }) => {
      //   return {
      //     url: `${HLOS_ZCOM}/v1/${organizationId}/logisticss`,
      //     data: data[0],
      //     method: 'POST',
      //   };
      // },
    },
  };
};

export {
  DeliveryOrderListDS,
  DeliveryOrderLineListDS,
  DeliveryOrderHeadDS,
  DeliveryOrderLineDS,
  DeliveryDetailLogisticsDS,
};
