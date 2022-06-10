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
// import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
// import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

// import { codeValidator } from 'hlos-front/lib/utils/utils';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common, saleResult } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-results`;
const itemRelsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-result-lines`;

const listDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'saleResultNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleResultNum`).d('预测单编号'),
    },
    {
      name: 'lifecycleUom',
      type: 'string',
      lookupCode: saleResult.lifecycleUom,
      label: intl.get(`${intlPrefix}.lifecycleUom`).d('预测周期维度'),
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期范围'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      bind: 'predictionStartDate.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测模板'),
    },
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      lovPara: {
        enabledFlag: 1,
      },
      ignore: 'always',
      textField: 'salesEntityCode',
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体'),
    },
    {
      name: 'salesEntityId',
      type: 'string',
      bind: 'salesEntityObj.salesEntityId',
    },
    {
      name: 'saleResultStatus',
      type: 'string',
      lookupCode: saleResult.saleResultStatus,
      label: intl.get(`${intlPrefix}.saleResultStatus`).d('预测单状态'),
    },
    {
      name: 'runStartDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.runStartDate`).d('创建日期范围'),
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'runEndDate',
      type: 'date',
      bind: 'runStartDate.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
  ],
  fields: [
    {
      name: 'saleResultNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleResultNum`).d('预测单号'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体'),
    },
    {
      name: 'lifecycleUom',
      type: 'string',
      required: true,
      lookupCode: saleResult.lifecycleUom,
      label: intl.get(`${intlPrefix}.lifecycleUom`).d('预测周期'),
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测开始日期'),
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.runStartDate`).d('预测结束日期'),
    },
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测模板'),
    },
    {
      name: 'saleResultStatus',
      type: 'string',
      lookupCode: saleResult.saleResultStatus,
      required: true,
      label: intl.get(`${intlPrefix}.saleResultStatus`).d('状态'),
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
        data: data[0],
        url,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data,
        method: 'DELETE',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    // update: ({ name, record}) => {
    //   if(name === 'lastRunDate' || name === 'runGap') {
    //     const { lastRunDate, runGap = 0 } = record.data;
    //     record.set('nextRunDate', moment(lastRunDate).add(runGap, 'hours').format('YYYY-MM-DD HH:mm:ss'));
    //   }
    // },
  },
});

const headDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'saleResultNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleResultNum`).d('预测单编号'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体'),
    },
    {
      name: 'lifecycleUom',
      type: 'string',
      required: true,
      lookupCode: saleResult.lifecycleUom,
      label: intl.get(`${intlPrefix}.lifecycleUom`).d('预测周期'),
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测开始日期'),
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.runStartDate`).d('预测结束日期'),
    },
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测模板编号'),
    },
    {
      name: 'saleResultStatus',
      type: 'string',
      lookupCode: saleResult.saleResultStatus,
      required: true,
      label: intl.get(`${intlPrefix}.saleResultStatus`).d('预测单状态'),
    },
    {
      name: 'runStartDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.runStartDate`).d('运行开始时间'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleResultId } = data;
      console.log('saleResultId', saleResultId);
      return {
        data,
        url: `${url}/${saleResultId}`,
        method: 'GET',
      };
    },
    update: ({ data }) => {
      return {
        data: data[0],
        url,
        method: 'PUT',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    // update: ({ name, record}) => {
    //   if(name === 'lastRunDate' || name === 'runGap') {
    //     const { lastRunDate, runGap = 0 } = record.data;
    //     record.set('nextRunDate', moment(lastRunDate).add(runGap, 'hours').format('YYYY-MM-DD HH:mm:ss'));
    //   }
    // },
  },
});

const lineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'saleResultLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleResultLineNum`).d('行号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'string',
      bind: 'itemObj.itemAttr',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'uomCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomCode`).d('单位'),
    },
    {
      name: 'saleDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.saleDate`).d('销售日期'),
    },
    {
      name: 'predictionBasicCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionBasicCount`).d('基本预测数量'),
    },
    {
      name: 'monthCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.monthCount`).d('月份调整'),
    },
    {
      name: 'weekCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.weekCount`).d('星期调整'),
    },
    {
      name: 'festivalCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.festivalCount`).d('节日调整'),
    },
    {
      name: 'activityCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.activityCount`).d('促销活动调整'),
    },
    {
      name: 'discountCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.discountCount`).d('折扣调整'),
    },
    {
      name: 'lifecycleCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.lifecycleCount`).d('生命周期调整'),
    },
    {
      name: 'manualDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.manualDesc`).d('调整说明'),
    },
    {
      name: 'manualCount',
      type: 'number',
      label: intl.get(`${intlPrefix}.manualCount`).d('人工调整'),
      step: 0.000001,
    },
    {
      name: 'totalPredictionCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalPredictionCount`).d('总计预测数量'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: itemRelsUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: itemRelsUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data: data[0],
        url: itemRelsUrl,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: itemRelsUrl,
        data,
        method: 'DELETE',
      };
    },
  },
  submitSuccess: ({ dataSet }) => {
    dataSet.query();
  },
});

export { listDS, headDS, lineDS };
