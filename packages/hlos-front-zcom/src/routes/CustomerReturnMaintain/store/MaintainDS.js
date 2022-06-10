/**
 * @Description: 送货单维护DS--MO
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-22 16:47:22
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.customerReturnMaintainMaintain.model';
const { common, customerReturnMaintain } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const returnMaintainListDS = () => {
  return {
    // autoQuery: true,
    queryFields: [
      {
        name: 'refundOuObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.meOu`).d('仓储中心'),
        lovCode: common.wmOu,
        ignore: 'always',
      },
      {
        name: 'refundWmOuId',
        type: 'string',
        bind: 'refundOuObj.wmOuId',
      },
      {
        name: 'refundWmOuCode',
        type: 'string',
        bind: 'refundOuObj.wmOuCode',
      },
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundNum`).d('退料单号'),
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovCode: common.customer,
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerNumber',
        type: 'string',
        bind: 'customerObj.customerNumber',
      },
      {
        name: 'itemRefundStatus',
        type: 'string',
        lookupCode: customerReturnMaintain.itemRefundStatus,
        label: intl.get(`${intlPrefix}.itemRefundStatus`).d('退料单状态'),
        multiple: true,
      },
      {
        name: 'itemRefundDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemRefundDateStart`).d('退料日期从'),
        max: 'itemRefundDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'itemRefundDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemRefundDateEnd`).d('退料日期至'),
        min: 'itemRefundDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'creationDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDateStart`).d('创建日期从'),
        max: 'creationDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDateEnd`).d('创建日期至'),
        min: 'creationDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundNum`).d('退料单号'),
      },
      {
        name: 'itemRefundStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundStatusMeaning`).d('退料单状态'),
      },
      {
        name: 'refundWmOuName',
        type: 'string',
        lookupCode: customerReturnMaintain.deliveryOrderType,
        label: intl.get(`${intlPrefix}.refundWmOuName`).d('仓储中心'),
      },
      {
        name: 'refundWarehouseName',
        type: 'string',
        label: intl.get(`${commonPrefix}.refundWarehouseCode`).d('退料仓库'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerName`).d('客户'),
      },
      {
        name: 'customerWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerWarehouseName`).d('收货仓库'),
      },
      {
        name: 'itemRefundAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundAddress`).d('收货地址'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'itemRefundDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundDate`).d('退料日期'),
      },
    ],
    transport: {
      // GET /v1/{organizationId}/item-refunds
      read: ({ data }) => {
        const { itemRefundStatus: statusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/item-refunds`, {
            statusList,
          }),
          data: {
            ...data,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
            itemRefundDateStart: data.itemRefundDateStart
              ? data.itemRefundDateStart.concat(' 00:00:00')
              : null,
            itemRefundDateEnd: data.itemRefundDateEnd
              ? data.itemRefundDateEnd.concat(' 23:59:59')
              : null,
            itemRefundStatus: null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const returnMaintainHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'refundOuObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.meOu`).d('仓储中心'),
        lovCode: common.wmOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'refundWmOuId',
        type: 'string',
        bind: 'refundOuObj.wmOuId',
      },
      {
        name: 'refundWmOuCode',
        type: 'string',
        bind: 'refundOuObj.wmOuCode',
      },
      {
        name: 'refundWmOuName',
        type: 'string',
        bind: 'refundOuObj.wmOuName',
      },
      {
        name: 'refundOrganizationId',
        type: 'string',
        bind: 'refundOuObj.organizationId',
      },
      {
        name: 'refundOrganizationCode',
        type: 'string',
        bind: 'refundOuObj.organizationCode',
      },
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${commonPrefix}.itemRefundNum`).d('退料单号'),
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovCode: common.customer,
        ignore: 'always',
        required: true,
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerNumber',
        type: 'string',
        bind: 'customerObj.customerNumber',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'itemRefundStatus',
        type: 'string',
        lookupCode: customerReturnMaintain.itemRefundStatus,
        label: intl.get(`${intlPrefix}.itemRefundStatus`).d('退料单状态'),
      },
      {
        name: 'itemRefundDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.planDeliveryDate`).d('退料日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        defaultValue: moment().format(DEFAULT_DATE_FORMAT),
        required: true,
      },
      {
        name: 'refundWarehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.warehouse`).d('退料仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        required: true,
      },
      {
        name: 'refundWarehouseId',
        type: 'string',
        bind: 'refundWarehouseObj.warehouseId',
      },
      {
        name: 'refundWarehouseCode',
        type: 'string',
        bind: 'refundWarehouseObj.warehouseCode',
      },
      {
        name: 'refundWarehouseName',
        type: 'string',
        bind: 'refundWarehouseObj.warehouseName',
      },
      {
        name: 'customerWarehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.warehouse`).d('收货仓库'),
        lovCode: common.customerWarehouse,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: organizationId,
            customerId: record.get('customerId'),
          }),
        },
      },
      {
        name: 'customerWarehouseId',
        type: 'string',
        bind: 'customerWarehouseObj.warehouseId',
      },
      {
        name: 'customerWarehouseCode',
        type: 'string',
        bind: 'customerWarehouseObj.warehouseCode',
      },
      {
        name: 'customerWmOuId',
        type: 'string',
        bind: 'customerWarehouseObj.wmOuId',
      },
      {
        name: 'customerWmOuCode',
        type: 'string',
        bind: 'customerWarehouseObj.wmOuCode',
      },
      {
        name: 'customerWarehouseName',
        type: 'string',
        bind: 'customerWarehouseObj.warehouseName',
      },
      {
        name: 'itemRefundAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('收货地址'),
        bind: 'customerWarehouseObj.warehouseAddress',
        required: true,
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
        required: true,
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { itemRefundId } = data;
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/item-refunds/${itemRefundId}`,
          data: {
            ...data,
          },
          method: 'GET',
        };
      },
    },
  };
};

const returnMaintainLineDS = () => {
  return {
    autoQuery: false,
    fields: [
      {
        name: 'refundLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundLineNum`).d('退料单行'),
      },
      {
        name: 'refundItemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.refundItemObj`).d('物料编码'),
        lovCode: customerReturnMaintain.item,
        ignore: 'always',
        required: true,
      },
      {
        name: 'refundItemId',
        type: 'string',
        bind: 'refundItemObj.itemId',
      },
      {
        name: 'refundItemCode',
        type: 'string',
        bind: 'refundItemObj.itemCode',
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'refundItemObj.uomId',
      },
      {
        name: 'uom',
        type: 'string',
        bind: 'refundItemObj.uom',
      },
      {
        name: 'refundItemDescription',
        type: 'string',
        bind: 'refundItemObj.description',
        label: intl.get(`${intlPrefix}.refundItemDescription`).d('客户物料描述'),
      },
      {
        name: 'refundQty',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.deliveryQty`).d('退料数量'),
        required: true,
      },
      {
        name: 'totalReceivedQty',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.totalReceivedQty`).d('客户已接收数量'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('行备注'),
      },
      {
        name: 'sequenceLotControl',
        type: 'string',
        bind: 'refundItemObj.sequenceLotControl',
        label: intl.get(`${intlPrefix}.sequenceLotControl`).d('批次'),
      },
      {
        name: 'tagFlag',
        type: 'number',
        bind: 'refundItemObj.tagFlag',
        label: intl.get(`${intlPrefix}.tagFlag`).d('序列号'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/item-refund-lines`,
          data: {
            ...data,
          },
          method: 'GET',
        };
      },
    },
  };
};

const batchDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    fields: [
      {
        name: 'refundLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('行号'),
      },
      {
        name: 'refundItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundItemCode`).d('物料编码'),
      },
      {
        name: 'refundItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundItemDescription`).d('物料描述'),
      },
      {
        name: 'batchQty',
        type: 'number',
        label: intl.get(`${intlPrefix}.batchQty`).d('数量'),
        required: true,
      },
      {
        name: 'batchNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.batchNum`).d('批次'),
        required: true,
      },
    ],
  };
};

const serialDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    fields: [
      {
        name: 'refundLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('行号'),
      },
      {
        name: 'refundItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundItemCode`).d('物料编码'),
      },
      {
        name: 'refundItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundItemDescription`).d('物料描述'),
      },
      {
        name: 'serialQty',
        type: 'number',
        label: intl.get(`${intlPrefix}.serialQty`).d('数量'),
        required: true,
      },
      {
        name: 'serialNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialNum`).d('序列号'),
        required: true,
      },
    ],
  };
};

const refundLogisticsDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'courierNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.courierNumber`).d('快递单号'),
      },
      {
        name: 'deliveryStaff',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryStaff`).d('配送人员'),
      },
      {
        name: 'addresseeContact',
        type: 'string',
        label: intl.get(`${intlPrefix}.addresseeContact`).d('收件人手机后四位'),
      },
      {
        name: 'logisticsCompany',
        type: 'string',
        label: intl.get(`${intlPrefix}.logisticsCompany`).d('物流公司'),
      },
      {
        name: 'deliveryContact',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryContact`).d('联系方式'),
      },
      {
        name: 'freight',
        type: 'string',
        label: intl.get(`${intlPrefix}.freight`).d('物流费用'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { itemRefundId } = data;
        return {
          data: {
            ...data,
            itemRefundId: undefined,
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/order-logisticss/getBySourceOrderId/${itemRefundId}`,
          method: 'GET',
        };
      },
    },
  };
};

const deliveryPrintDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      required: true,
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      required: true,
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编号'),
      required: true,
    },
    {
      name: 'itemDescription',
      type: 'string',
      required: true,
    },
    {
      name: 'itemRefundNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('退料单号'),
      required: true,
    },
    {
      name: 'refundLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.refundLineNum`).d('退料单行'),
      required: true,
    },
    {
      name: 'refundQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryQty`).d('数量'),
      required: true,
    },
    {
      name: 'uom',
      type: 'string',
      // required: true,
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      required: true,
    },
    {
      name: 'productionDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.productionDate`).d('生产日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      required: true,
    },
    {
      name: 'humidityLevelObj',
      type: 'object',
      lookupCode: customerReturnMaintain.humidityLevel,
      label: intl.get(`${intlPrefix}.humidityLevelObj`).d('湿敏等级'),
      required: true,
      ignore: 'always',
    },
    {
      name: 'humidityLevelMeaning',
      type: 'string',
      bind: 'humidityLevelObj.meaning',
    },
    {
      name: 'humidityLevel',
      type: 'string',
      bind: 'humidityLevelObj.value',
    },
    {
      name: 'maturityDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.maturityDate`).d('到期日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      required: true,
    },
    {
      name: 'lotNo',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNo`).d('Lot NO.'),
      required: true,
    },
    {
      name: 'DateCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.DateCode`).d('DateCode'),
      required: true,
    },
    {
      name: 'version',
      type: 'string',
      label: intl.get(`${intlPrefix}.version`).d('版本'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料'),
      required: true,
    },
    {
      name: 'boxQtyOne',
      type: 'number',
      label: intl.get(`${intlPrefix}.boxQty`).d('箱数'),
      required: true,
    },
    {
      name: 'perBoxAmountOne',
      type: 'number',
      label: intl.get(`${intlPrefix}.perBoxAmount`).d('每箱数量'),
      required: true,
    },
    {
      name: 'boxQtyTwo',
      type: 'number',
      label: intl.get(`${intlPrefix}.boxQty`).d('箱数'),
    },
    {
      name: 'perBoxAmountTwo',
      type: 'number',
      label: intl.get(`${intlPrefix}.perBoxAmount`).d('每箱数量'),
    },
    {
      name: 'boxQtyThree',
      type: 'number',
      label: intl.get(`${intlPrefix}.boxQty`).d('箱数'),
    },
    {
      name: 'perBoxAmountThree',
      type: 'number',
      label: intl.get(`${intlPrefix}.perBoxAmount`).d('每箱数量'),
    },
    {
      name: 'boxQtyFour',
      type: 'number',
      label: intl.get(`${intlPrefix}.boxQty`).d('箱数'),
    },
    {
      name: 'perBoxAmountFour',
      type: 'number',
      label: intl.get(`${intlPrefix}.perBoxAmount`).d('每箱数量'),
    },
  ],
});

export {
  returnMaintainListDS,
  returnMaintainHeadDS,
  returnMaintainLineDS,
  batchDS,
  serialDS,
  refundLogisticsDS,
  deliveryPrintDS,
};
