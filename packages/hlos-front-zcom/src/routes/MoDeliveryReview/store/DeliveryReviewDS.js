/**
 * @Description: 送货单审核DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-30 14:31:00
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryReview.model';
const { common, deliveryReview } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const deliveryReviewListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'suppplierName',
        type: 'string',
        bind: 'supplierObj.suppplierName',
      },
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.moNum`).d('MO号'),
        lovCode: deliveryReview.supplyMo,
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
      // {
      //   name: 'deliveryOrderStatus',
      //   type: 'string',
      //   lookupCode: moDelivery.deliveryOrderStatus,
      //   label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('送货单状态'),
      //   multiple: true,
      //   defaultValue: ['RELEASED'],
      // },
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
        lookupCode: deliveryReview.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
      {
        name: 'expectedArrivalDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.expectedArrivalDateStart`).d('预计到货日期从'),
        max: 'expectedArrivalDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'expectedArrivalDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.expectedArrivalDateEnd`).d('预计到货日期至'),
        min: 'expectedArrivalDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'buyer',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
    ],
    fields: [
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: deliveryReview.deliveryOrderStatus,
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
        lookupCode: deliveryReview.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierName`).d('供应商名称'),
      },
      {
        name: 'buyer',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货地址'),
      },
      {
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('累计送货数量'),
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
      {
        name: 'expectedArrivalDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.expectedArrivalDate`).d('预计到货时间'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { deliveryOrderStatus: deliveryOrderStatusList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/queryMoDeliveryByCustomer`,
            {
              deliveryOrderStatusList,
            }
          ),
          data: {
            ...data,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
            expectedArrivalDateStart: data.expectedArrivalDateStart
              ? data.expectedArrivalDateStart.concat(' 00:00:00')
              : null,
            expectedArrivalDateEnd: data.expectedArrivalDateEnd
              ? data.expectedArrivalDateEnd.concat(' 23:59:59')
              : null,
            deliveryOrderStatus: null,
            sourceOrderType: 'MO',
          },
          method: 'GET',
        };
      },
    },
  };
};

const deliveryReviewDetailHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      },
      {
        name: 'deliveryOrderTypeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
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
        name: 'deliveryShipper',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryShipper`).d('送货方'),
      },
      {
        name: 'warehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.warehouseName`).d('发货地点'),
      },
      {
        name: 'planDeliveryDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.planDeliveryDate`).d('发货日期'),
      },
      {
        name: 'expectedArrivalDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.expectedArrivalDate`).d('预计到货时间'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
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
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/detailMoDeliveryForCustomer/${deliveryOrderId}`,
          method: 'GET',
        };
      },
    },
  };
};

const deliveryReviewDetailLineDS = () => {
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
      // {
      //   name: 'itemCode',
      //   type: 'string',
      //   label: intl.get(`${intlPrefix}.itemCode`).d('供应商料号'),
      // },
      // {
      //   name: 'supplierItemDescription',
      //   type: 'string',
      //   label: intl.get(`${intlPrefix}.supplierItemDescription`).d('供应商料号描述'),
      // },
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
        name: 'deliveryQty',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.deliveryQty`).d('本次发货数量'),
      },
      {
        name: 'totalReceivedQty',
        type: 'number',
        label: intl.get(`${intlPrefix}.totalReceivedQty`).d('已接收数量'),
      },
      {
        name: 'receiveDate',
        type: 'dateTime',
        label: intl.get(`${intlPrefix}.receiveDate`).d('接收日期'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'customerLotNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerLotNumber`).d('批次'),
      },
      {
        name: 'serialNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialNumber`).d('序列号'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('订单号'),
      },
      // {
      //   name: 'sourceDocLineNum',
      //   type: 'string',
      //   label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('行号'),
      // },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('承诺日期'),
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
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-order-lines/getMoDeliveryLine`,
          method: 'GET',
        };
      },
    },
  };
};

const deliveryReviewDetailLogisticsDS = () => {
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

const deliveryReviewOpinionDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
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
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/detailMoDeliveryForCustomer/${deliveryOrderId}`,
          method: 'GET',
        };
      },
    },
  };
};

export {
  deliveryReviewListDS,
  deliveryReviewDetailHeadDS,
  deliveryReviewDetailLineDS,
  deliveryReviewDetailLogisticsDS,
  deliveryReviewOpinionDS,
};
