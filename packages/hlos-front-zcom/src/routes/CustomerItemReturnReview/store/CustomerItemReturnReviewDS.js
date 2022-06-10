/**
 * @Description: 客供料退料单审核DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-03 13:27:03
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.customerItemReturnReview.model';
const { common, customerItemReturnReview } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const returnReviewListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'refundWmOuObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.refundWmOu`).d('供应商仓储中心'),
        lovCode: customerItemReturnReview.refundWmOu,
        ignore: 'always',
      },
      {
        name: 'refundWmOuId',
        type: 'string',
        bind: 'refundWmOuObj.wmOuId',
      },
      {
        name: 'refundWmOuName',
        type: 'string',
        bind: 'refundWmOuObj.wmOuName',
      },
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundNum`).d('退料单号'),
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
        name: 'statusList',
        type: 'string',
        lookupCode: customerItemReturnReview.itemRefundStatus,
        label: intl.get(`${intlPrefix}.itemRefundStatus`).d('退料单状态'),
        multiple: true,
        defaultValue: ['RELEASED', 'CONFIRMEND', 'REFUSED', 'RETURNED', 'RECEIVED'],
        dynamicProps: {
          lookupAxiosConfig: () => ({
            transformResponse(data) {
              let newData = [];
              if (data && data.length) {
                data.forEach((item) => {
                  if (item.value !== 'NEW') {
                    newData.push(item);
                  }
                });
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
      },
      {
        name: 'creationDateStart',
        type: 'date',
        label: intl.get(`${commonPrefix}.creationDateStart`).d('创建日期从'),
        max: 'creationDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        label: intl.get(`${commonPrefix}.creationDateEnd`).d('创建日期至'),
        min: 'creationDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
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
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
      {
        name: 'supplierTenantId',
        type: 'string',
        bind: 'supplierObj.supplierTenantId',
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
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'refundWmOuName',
        type: 'string',
        label: intl.get(`${commonPrefix}.refundWmOuName`).d('仓储中心'),
      },
      {
        name: 'refundWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundWarehouseName`).d('退料仓库'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonPrefix}.remark`).d('备注'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户'),
      },
      {
        name: 'customerWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerWarehouseName`).d('收货仓库'),
      },
      {
        name: 'itemRefundDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundDate`).d('退料日期'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${commonPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { statusList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/item-refunds/list-for-verify`,
            {
              statusList,
            }
          ),
          data: {
            ...data,
            itemRefundDateStart: data.itemRefundDateStart
              ? data.itemRefundDateStart.concat(' 00:00:00')
              : null,
            itemRefundDateEnd: data.itemRefundDateEnd
              ? data.itemRefundDateEnd.concat(' 23:59:59')
              : null,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
            statusList: null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const returnReviewHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'refundWmOuName',
        type: 'string',
        label: intl.get(`${commonPrefix}.refundWmOuName`).d('仓储中心'),
      },
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundNum`).d('退料单号'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'itemRefundStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundStatusMeaning`).d('退料单状态'),
      },
      {
        name: 'itemRefundDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundDate`).d('退料日期'),
      },
      {
        name: 'refundWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundWarehouseName`).d('退料仓库'),
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
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonPrefix}.remark`).d('备注'),
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
          data: {
            ...data,
            itemRefundId: undefined,
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/item-refunds/${itemRefundId}`,
          method: 'GET',
        };
      },
    },
  };
};

const returnReviewLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'refundLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundLineNum`).d('退料单行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerItemDescription`).d('物料描述'),
      },
      {
        name: 'refundQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundQty`).d('退料数量'),
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
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${commonPrefix}.lineRemark`).d('行备注'),
      },
      {
        name: 'sequenceLotControl',
        type: 'string',
        label: intl.get(`${intlPrefix}.sequenceLotControl`).d('批次'),
      },
      {
        name: 'tagFlag',
        type: 'string',
        label: intl.get(`${intlPrefix}.tagFlag`).d('序列号'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_ZCOM}/v1/${organizationId}/item-refund-lines`,
          method: 'GET',
        };
      },
    },
  };
};

const refundBatchListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    paging: false,
    fields: [
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundNum`).d('退料单号'),
      },
      {
        name: 'refundLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundLineNum`).d('退料单行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('物料描述'),
      },
      {
        name: 'batchQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.batchQty`).d('数量'),
      },
      {
        name: 'batchNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.batchNum`).d('批次编码'),
      },
    ],
  };
};

const refundSerialListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    paging: false,
    fields: [
      {
        name: 'itemRefundNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemRefundNum`).d('退料单号'),
      },
      {
        name: 'refundLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.refundLineNum`).d('退料单行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('物料描述'),
      },
      {
        name: 'serialQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialQty`).d('数量'),
      },
      {
        name: 'serialNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialNum`).d('序列号编码'),
      },
    ],
  };
};

const returnReviewLogisticsDS = () => {
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

export {
  returnReviewListDS,
  returnReviewHeadDS,
  returnReviewLineDS,
  refundBatchListDS,
  refundSerialListDS,
  returnReviewLogisticsDS,
};
