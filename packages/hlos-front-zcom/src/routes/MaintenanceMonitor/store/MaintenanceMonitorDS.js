/*
 * @Descripttion:VMI申请单审核
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 09:46:34
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-10 16:40:51
 */
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.vmiApplyReviewReview.model';
const { maintenanceMonitor } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const listDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'moNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.moNum`).d('MO号'),
      },
      {
        name: 'repairsItemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.repairsItemObj`).d('物料编码'),
        lovCode: maintenanceMonitor.item,
        ignore: 'always',
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'repairsItemObj.itemId',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'repairsItemObj.itemCode',
      },
      {
        name: 'repairsOrderStatus',
        type: 'string',
        lookupCode: maintenanceMonitor.orderStatus,
        label: intl.get(`${intlPrefix}.createdByName`).d('维修状态'),
      },
      {
        name: 'moStatus',
        type: 'string',
        lookupCode: maintenanceMonitor.moStatus,
        label: intl.get(`${intlPrefix}.moStatus`).d('MO状态'),
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
        name: 'moNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.moNum`).d('MO号'),
      },
      {
        name: 'repairsOrderStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsOrderStatus`).d('维修状态'),
      },
      {
        name: 'moStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.moStatus`).d('MO状态'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.itemCode`).d('物料'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
      },
      {
        name: 'demandQty',
        type: 'string',
        label: intl.get(`${commonPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${commonPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'moTypeName',
        type: 'string',
        label: intl.get(`${intlPrefix}.moTypeName`).d('MO类型'),
      },
      {
        name: 'repairsOrderTypeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsOrderType`).d('维修类型'),
      },
      {
        name: 'totalAmount',
        type: 'string',
        label: intl.get(`${commonPrefix}.totalAmount`).d('维修总报价'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
      },
      {
        name: 'repairsOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsOrderLineNum`).d('MO维修行号'),
      },
      {
        name: 'repairsOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsOrderNum`).d('维修用料单号'),
      },
      {
        name: 'repairsItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.repairsItemCode`).d('用料编码'),
      },
      {
        name: 'repairsItemDescription', // 待确认
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsItemDescription`).d('用料描述'),
      },
      {
        name: 'itemSpecification',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemSpecification`).d('用料规格'),
      },
      {
        name: 'repairsQty',
        type: 'string',
        label: intl.get(`${commonPrefix}.repairsQty`).d('数量'),
      },
      {
        name: 'repairsUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsUomName`).d('单位'),
      },
      {
        name: 'repairsDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsDate`).d('维修时间'),
      },
      {
        name: 'rmaDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.rmaDate`).d('RMA时间'),
      },
      {
        name: 'customerFactory',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerFactory`).d('客户厂区'),
      },
      {
        name: 'productType',
        type: 'string',
        label: intl.get(`${intlPrefix}.productType`).d('产品型号'),
      },
      {
        name: 'boardCardType',
        type: 'string',
        label: intl.get(`${intlPrefix}.boardCardType`).d('板卡类型'),
      },
      {
        name: 'barCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.barCode`).d('条码号'),
      },
      {
        name: 'customerBadPhenomenon',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerBadPhenomenon`).d('客端不良现象'),
      },
      {
        name: 'supplierBadPhenomenon',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierBadPhenomenon`).d('供应商不良现象'),
      },
      {
        name: 'badReason',
        type: 'string',
        label: intl.get(`${intlPrefix}.badReason`).d('不良原因'),
      },
      {
        name: 'badPosition',
        type: 'string',
        label: intl.get(`${commonPrefix}.badPosition`).d('不良位置'),
      },
      {
        name: 'repairsMethod',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsMethod`).d('维修方法'),
      },
      {
        name: 'repairsByName',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsByName`).d('维修人员'),
      },
      {
        name: 'dutyDecide',
        type: 'string',
        label: intl.get(`${commonPrefix}.dutyDecide`).d('责任判定'),
      },
      {
        name: 'position',
        type: 'string',
        label: intl.get(`${intlPrefix}.position`).d('站位'),
      },
      {
        name: 'repairsTime',
        type: 'string',
        label: intl.get(`${intlPrefix}.repairsTime`).d('返修次数'),
      },
      {
        name: 'bgaCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.bgaCode`).d('BGA代码'),
      },
      {
        name: 'icCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.icCode`).d('IC代码'),
      },
      {
        name: 'amount',
        type: 'string',
        label: intl.get(`${intlPrefix}.amount`).d('维修工时费'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { statusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/repairs-orders`, {
            statusList,
          }),
          data: {
            ...data,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
            statusList: null,
          },
          method: 'GET',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/repairs-orders`,
          data,
          method: 'DELETE',
        };
      },
      submit: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/repairs-orders/submit`,
          data,
          method: 'POST',
        };
      },
    },
  };
};

export { listDS };
