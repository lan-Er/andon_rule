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
const intlPrefix = 'zcom.moDeliveryMaintain.model';
const { common, moDelivery } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const deliveryCreateListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.moNum`).d('MO号'),
        lovCode: moDelivery.mo,
        ignore: 'always',
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moObj.moId',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moObj.moNum',
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
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.moType`).d('MO类型'),
        lovCode: moDelivery.documentType,
        lovPara: { documentClass: 'MO' },
        ignore: 'always',
      },
      {
        name: 'moTypeId',
        type: 'string',
        bind: 'moTypeObj.documentTypeId',
      },
      {
        name: 'moTypeCode',
        type: 'string',
        bind: 'moTypeObj.documentTypeCode',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${intlPrefix}.moStatus`).d('MO状态'),
        lookupCode: moDelivery.moStatus,
        multiple: false,
      },
      {
        name: 'customerItemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.customerItem`).d('物料编码'),
        lovCode: common.item,
        ignore: 'always',
      },
      {
        name: 'customerItemId',
        type: 'string',
        bind: 'customerItemObj.itemId',
      },
      {
        name: 'customerItemCode',
        type: 'string',
        bind: 'customerItemObj.itemCode',
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        bind: 'customerItemObj.itemDescription',
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
      {
        name: 'demandDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.demandDateStart`).d('完工日期从'),
        max: 'demandDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.demandDateEnd`).d('完工日期至'),
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'meOuName',
        type: 'string',
        label: intl.get(`${intlPrefix}.meOu`).d('组织'),
      },
      {
        name: 'moNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.moNum`).d('MO号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('物料描述'),
      },
      {
        name: 'executeStatus',
        type: 'string',
        lookupCode: moDelivery.executeStatus,
        label: intl.get(`${intlPrefix}.executeStatus`).d('执行状态'),
      },
      {
        name: 'makeQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.makeQty`).d('制造数量'),
      },
      {
        name: 'inventoryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.inventoryQty`).d('完工入库数量'),
      },
      {
        name: 'inventoryWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.inventoryWarehouseName`).d('入库仓库'),
      },
      {
        name: 'shippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('未发货数量'),
      },
      {
        name: 'allDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.allDeliveryQty`).d('累计发货数量'),
      },
      {
        name: 'receivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('净接收数量'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户名称'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandDate`).d('完工日期'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-execute-views/selectMoExecuteForDelivery`,
          data: {
            ...data,
            demandDateStart: data.demandDateStart ? data.demandDateStart.concat(' 00:00:00') : null,
            demandDateEnd: data.demandDateEnd ? data.demandDateEnd.concat(' 23:59:59') : null,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const deliveryMaintainListDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
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
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.moNum`).d('MO号'),
        lovCode: moDelivery.mo,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'moObj.moId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'moObj.moNum',
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
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: moDelivery.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
    ],
    fields: [
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: moDelivery.deliveryOrderStatus,
        label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('送货单状态'),
      },
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单订单号'),
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: moDelivery.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户名称'),
      },
      {
        name: 'receiveWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveWarehouse`).d('收货仓库'),
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货地址'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'planDeliveryDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.planDeliveryDate`).d('发货日期'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/listMoDelivery`,
          data: {
            ...data,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
            sourceOrderType: 'MO',
          },
          method: 'GET',
        };
      },
    },
  };
};

const deliveryDetailHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: moDelivery.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
        required: true,
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'customerWarehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.customerWarehouse`).d('收货仓库'),
        lovCode: common.customerWarehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: organizationId,
            customerId: record.get('customerId'),
          }),
        },
        required: true,
      },
      {
        name: 'receiveWarehouseId',
        type: 'string',
        bind: 'customerWarehouseObj.warehouseId',
      },
      {
        name: 'receiveWarehouseCode',
        type: 'string',
        bind: 'customerWarehouseObj.warehouseCode',
      },
      {
        name: 'receiveWarehouseName',
        type: 'string',
        bind: 'customerWarehouseObj.warehouseName',
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'customerWarehouseObj.wmOuId',
      },
      {
        name: 'receiveOrgCode',
        type: 'string',
        bind: 'customerWarehouseObj.wmOuCode',
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货地点'),
        bind: 'customerWarehouseObj.warehouseAddress',
        required: true,
      },
      {
        name: 'deliveryShipper',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryShipper`).d('送货方'),
        required: true,
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.warehouse`).d('发货仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        required: true,
      },
      {
        name: 'warehouseId',
        type: 'string',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: 'string',
        bind: 'warehouseObj.warehouseCode',
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'warehouseObj.warehouseName',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'warehouseObj.organizationCode',
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'warehouseObj.organizationId',
      },
      {
        name: 'planDeliveryDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.planDeliveryDate`).d('发货日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'expectedArrivalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.expectedArrivalDate`).d('预计到货时间'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList, deliveryOrderId } = data;
        return {
          url: deliveryOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/detailMoDelivery/${deliveryOrderId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/mo-execute-views/selectMoExecuteForDelivery`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
            deliveryOrderId: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (deliveryOrderId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = Object.assign({}, newValue.content[0], {
                deliveryOrderType: 'RECEIVED_RECORD',
              });
            }
            return { ...content };
          },
        };
      },
    },
  };
};

const deliveryDetailLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'deliveryOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('行号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('物料名称'),
      },
      {
        name: 'promiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseQty`).d('数量'),
      },
      {
        name: 'shippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('未发货数量'),
      },
      {
        name: 'totalReceivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.totalReceivedQty`).d('客户已接收数量'),
      },
      {
        name: 'deliveryQty',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.deliveryQty`).d('本次发货数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'customerLotNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
      },
      {
        name: 'serialNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialNumber`).d('序列号'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('MO号'),
      },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.promiseDate`).d('承诺日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
      },
      {
        name: 'fileUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.fileUrl`).d('行附件'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList, deliveryOrderId } = data;
        return {
          url: deliveryOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-order-lines/getMoDeliveryLine`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/mo-execute-views/selectMoExecuteForDelivery`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (deliveryOrderId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((item) => ({
                ...item,
                sourceDocId: item.moId,
                sourceDocNum: item.moNum,
                sourceDocLineId: item.moExecuteId,
              }));
            }
            return { ...value, content };
          },
        };
      },
    },
  };
};

const deliveryDetailLogisticsDS = () => {
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
        const { deliveryOrderId } = data;
        return {
          data: {
            ...data,
            deliveryOrderId: undefined,
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/order-logisticss/getBySourceOrderId/${deliveryOrderId}`,
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
      name: 'deliveryOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      required: true,
    },
    {
      name: 'deliveryOrderLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('送货单行'),
      required: true,
    },
    {
      name: 'deliveryQty',
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
      lookupCode: moDelivery.humidityLevel,
      label: intl.get(`${intlPrefix}.humidityLevel`).d('湿敏等级'),
      required: true,
    },
    {
      name: 'humidityLevel',
      type: 'string',
      bind: 'humidityLevelObj.value',
    },
    {
      name: 'humidityLevelMeaning',
      type: 'string',
      bind: 'humidityLevelObj.meaning',
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
  deliveryCreateListDS,
  deliveryMaintainListDS,
  deliveryDetailHeadDS,
  deliveryDetailLineDS,
  deliveryDetailLogisticsDS,
  deliveryPrintDS,
};
