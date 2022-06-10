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
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryOrderCreate.model';
const { common, deliveryOrderCreate } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const url = `${HLOS_ZCOM}/v1/${organizationId}/delivery-apply-lines/query-to-create-delivery-order`;
const headerurl = `${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`;
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines`;
const DeliveryOrderListDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('预约单号'),
      },
      {
        name: 'customerObj',
        type: 'object',
        lovCode: common.customer,
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovPara: { cooperationFlag: 1 },
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('发货组织'),
        ignore: 'always',
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'customerInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('客户组织'),
        cascadeMap: { companyId: 'customerCompanyId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('customerTenantId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'customerInventoryOrgId',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'supplierItemObj',
        type: 'object',
        lovCode: common.itemMaindata,
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
        cascadeMap: { inventoryOrgId: 'supplierInventoryOrgId' },
        ignore: 'always',
      },
      {
        name: 'supplierItemId',
        type: 'string',
        bind: 'supplierItemObj.itemId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
      },
      {
        name: 'deliveryApplyDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.deliveryApplyDate`).d('预约发货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deliveryApplyDateEnd',
        type: 'date',
        bind: 'deliveryApplyDateStart.end',
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
        name: 'relatedDeliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedDeliveryApplyNum`).d('预约单号'),
      },
      {
        name: 'relatedApplyLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.relatedApplyLineNum`).d('预约单行号'),
      },
      {
        name: 'supplierUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'supplierDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('预约数量'),
      },
      {
        name: 'supplierUnshippedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierUnshippedQty`).d('已预约未发货数量'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单行号'),
      },
      {
        name: 'supplierPromiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierPromiseQty`).d('订单确认数量'),
      },
      {
        name: 'supplierPoUnshippedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierPoUnshippedQty`).d('订单未发货数量'),
      },
      {
        name: 'uncreatedDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.uncreatedDeliveryQty`).d('未创建发货单数量'),
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrgName`).d('发货组织'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'receivingType',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivingType`).d('接收方'),
      },
      {
        name: 'deliveryApplyDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.deliveryApplyDate`).d('预约发货日期'),
      },
      {
        name: 'arrivalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
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
        label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            deliverySourceType: 'PO',
            deliveryApplyDateStart: data.deliveryApplyDateStart
              ? `${data.deliveryApplyDateStart} 00:00:00`
              : null,
            deliveryApplyDateEnd: data.deliveryApplyDateEnd
              ? `${data.deliveryApplyDateEnd} 23:59:59`
              : null,
            arrivalDateStart: data.arrivalDateStart ? `${data.arrivalDateStart} 00:00:00` : null,
            arrivalDateEnd: data.arrivalDateEnd ? `${data.arrivalDateEnd} 23:59:59` : null,
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
        transformResponse: (val) => val || 'STANDARD_ASN',
      },
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: deliveryOrderCreate.deliveryOrderStatus,
        label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('发货单状态'),
        transformResponse: (val) => val || 'NEW',
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
        name: 'itemObj',
        type: 'object',
        lovCode: common.itemMaindata,
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
        ignore: 'always',
      },
      {
        name: 'itemDesc',
        type: 'string',
        bind: 'itemObj.itemDesc',
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
          url: `${headerurl}/${deliveryOrderId}`,
          data: {
            ...data,
            deliveryOrderId: null,
          },
          method: 'GET',
          // transformResponse: (value) => {
          //   const newValue = JSON.parse(value);
          //   let content;
          //   if (newValue && !newValue.failed && newValue.content) {
          //     content = Object.assign({}, newValue.content[0]);
          //   }
          //   return {
          //     ...content,
          //   };
          // },
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
        name: 'deliveryApplyLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryApplyLineNum`).d('行号'),
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
        transformResponse: (value, object) => {
          const { supplierUnshippedQty } = object;
          return supplierUnshippedQty;
        },
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
      create: ({ data }) => {
        return {
          data: {
            ...data[0],
            tenantId: organizationId,
            logisticsSourceType: 'DELIVERY',
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/logisticss`,
          method: 'POST',
        };
      },
    },
  };
};

export { DeliveryOrderListDS, DeliveryOrderHeadDS, DeliveryOrderLineDS, DeliveryDetailLogisticsDS };
