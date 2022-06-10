/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
// import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-discounts`;

const listDS = () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      ignore: 'always',
      lovPara: {
        enabledFlag: 1,
      },
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体'),
    },
    {
      name: 'salesEntityId',
      type: 'string',
      bind: 'salesEntityObj.salesEntityId',
    },
    {
      name: 'categoryObj',
      type: 'object',
      lovCode: common.category,
      label: intl.get(`${intlPrefix}.categoryObj`).d('物料类别'),
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'startDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.startDate`).d('有效日期'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'endDate',
      type: 'date',
      bind: 'startDate.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
  ],
  fields: [
    {
      name: 'saleDiscountNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleDiscountNum`).d('数据编码'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体'),
    },
    {
      name: 'categorySetName',
      type: 'string',
      label: intl.get(`${intlPrefix}.categorySetName`).d('物料类别集'),
    },
    {
      name: 'categoryCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.categoryCode`).d('物料类别'),
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.categoryName`).d('物料类别名称'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'standardPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.standardPrice`).d('标准售价'),
    },
    {
      name: 'predictionPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionPrice`).d('预估售价'),
    },
    {
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.currencyCode`).d('币种'),
    },
    {
      name: 'discountRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.discountRate`).d('预估折扣比例'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.startDate`).d('有效日期从'),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.endDate`).d('有效日期到'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url,
        method: 'PUT',
      };
    },
  },
});

export { listDS };
