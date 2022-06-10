/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common, saleRecord } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-records`;

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
      name: 'saleRecordStatusList',
      type: 'string',
      multiple: true,
      lookupCode: saleRecord.saleRecordStatus,
      label: intl.get(`${intlPrefix}.saleRecordStatus`).d('状态'),
    },
    {
      name: 'saleDateLeft',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.saleDateLeft`).d('销售日期'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'saleDateRight',
      type: 'date',
      bind: 'saleDateLeft.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
    {
      name: 'saleRecordNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleRecordNum`).d('数据编码'),
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
      name: 'saleRecordNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleRecordNum`).d('数据编码'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体'),
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
      name: 'saleDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.saleDate`).d('销售日期'),
    },
    {
      name: 'saleCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleCount`).d('销量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
    },
    {
      name: 'standardPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.standardPrice`).d('标准销售价'),
    },
    {
      name: 'actualPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.actualPrice`).d('实付均价'),
    },
    {
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.currencyCode`).d('币种'),
    },
    {
      name: 'saleRecordStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleRecordStatusMeaning`).d('状态'),
    },
    {
      name: 'errorMessage',
      type: 'string',
      label: intl.get(`${intlPrefix}.errorMessage`).d('错误日志'),
    },
    {
      name: 'executeTime',
      type: 'string',
      label: intl.get(`${intlPrefix}.executeTime`).d('处理时间'),
    },
    {
      name: 'discountRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.discountRate`).d('折扣比例'),
    },
    {
      name: 'saleMonth',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleMonth`).d('月份代码'),
    },
    {
      name: 'dayOfWeek',
      type: 'string',
      label: intl.get(`${intlPrefix}.dayOfWeek`).d('星期代码'),
    },
    {
      name: 'festivalCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.festivalCode`).d('节日代码'),
    },
    {
      name: 'festivalStartDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.festivalStartDate`).d('节日起始日期'),
    },
    {
      name: 'festivalEndDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.festivalEndDate`).d('节日结束日期'),
    },
    {
      name: 'nearFestivalDay',
      type: 'string',
      label: intl.get(`${intlPrefix}.nearFestivalDay`).d('节日临近天数'),
    },
    {
      name: 'activityCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.activityCode`).d('促销活动代码'),
    },
    {
      name: 'activityStartDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.activityStartDate`).d('活动起始日期'),
    },
    {
      name: 'activityEndDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.activityEndDate`).d('活动结束日期'),
    },
    {
      name: 'nearActivityDay',
      type: 'string',
      label: intl.get(`${intlPrefix}.nearActivityDay`).d('活动临近天数'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleRecordStatusList } = data;
      return {
        data: {
          ...data,
          saleRecordStatusList: undefined,
        },
        url: generateUrlWithGetParam(url, {
          saleRecordStatusList,
        }),
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
