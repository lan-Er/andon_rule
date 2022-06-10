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
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common, saleTemplate } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates`;
const itemRelsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-item-rels`;
const entityRelsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-entity-rels`;

const listDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('模板编号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('模板说明'),
    },
    {
      name: 'saleTemplateStatusList',
      type: 'string',
      lookupCode: saleTemplate.saleTemplateStatus,
      multiple: true,
      label: intl.get(`${intlPrefix}.saleTemplateStatusList`).d('模板状态'),
    },
  ],
  fields: [
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('模板编号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('模板说明'),
    },
    {
      name: 'lifecycleUom',
      type: 'string',
      required: true,
      lookupCode: saleTemplate.lifecycleUom,
      label: intl.get(`${intlPrefix}.lifecycleUom`).d('预测周期维度'),
    },
    {
      name: 'lifecycleLength',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.lifecycleLength`).d('预测周期长度'),
      validator: positiveNumberValidator,
    },
    {
      name: 'runGap',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.runGap`).d('运行间隔（小时）'),
      min: 1,
      validator: positiveNumberValidator,
    },
    {
      name: 'runStartDate',
      type: 'string',
      max: 'runEndDate',
      required: true,
      label: intl.get(`${intlPrefix}.runStartDate`).d('开始运行时间'),
      // transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      // format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'runEndDate',
      type: 'string',
      min: 'runStartDate',
      required: true,
      label: intl.get(`${intlPrefix}.runEndDate`).d('结束运行时间'),
      // transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      // format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'lastRunDate',
      type: 'string',
      // max: 'nextRunDate',
      label: intl.get(`${intlPrefix}.lastRunDate`).d('上次运行时间'),
      // format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'nextRunDate',
      type: 'string',
      min: 'lastRunDate',
      label: intl.get(`${intlPrefix}.nextRunDate`).d('下次运行时间'),
      // format: 'YYYY-MM-DD HH:mm:ss',
      // transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      name: 'saleTemplateId',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateId`).d('日志'),
    },
    {
      name: 'saleTemplateStatus',
      type: 'string',
      lookupCode: saleTemplate.saleTemplateStatus,
      required: true,
      label: intl.get(`${intlPrefix}.saleTemplateStatus`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleTemplateStatusList } = data;
      return {
        data: {
          ...data,
          saleTemplateStatusList: undefined,
        },
        url: generateUrlWithGetParam(url, {
          saleTemplateStatusList,
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
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('模板编号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('模板说明'),
    },
    {
      name: 'lifecycleUom',
      type: 'string',
      required: true,
      lookupCode: saleTemplate.lifecycleUom,
      label: intl.get(`${intlPrefix}.lifecycleUom`).d('预测周期维度'),
    },
    {
      name: 'lifecycleLength',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.lifecycleLength`).d('预测周期长度'),
      validator: positiveNumberValidator,
    },
    {
      name: 'runGap',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.runGap`).d('运行间隔（小时）'),
      min: 1,
      validator: positiveNumberValidator,
    },
    {
      name: 'runStartDate',
      type: 'dateTime',
      max: 'runEndDate',
      required: true,
      label: intl.get(`${intlPrefix}.runStartDate`).d('开始运行时间'),
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      min: moment().format('YYYY-MM-DD 00:00:00'),
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'runEndDate',
      type: 'dateTime',
      min: 'runStartDate',
      required: true,
      label: intl.get(`${intlPrefix}.runEndDate`).d('结束运行时间'),
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'lastRunDate',
      type: 'dateTime',
      // max: 'nextRunDate',
      label: intl.get(`${intlPrefix}.lastRunDate`).d('上次运行时间'),
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'nextRunDate',
      type: 'dateTime',
      min: 'lastRunDate',
      label: intl.get(`${intlPrefix}.nextRunDate`).d('下次运行时间'),
      format: 'YYYY-MM-DD HH:mm:ss',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      name: 'saleTemplateId',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateId`).d('日志'),
    },
    {
      name: 'saleTemplateStatus',
      type: 'string',
      lookupCode: saleTemplate.saleTemplateStatus,
      required: true,
      label: intl.get(`${intlPrefix}.saleTemplateStatus`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleTemplateId } = data;
      return {
        data,
        url: `${url}/${saleTemplateId}`,
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
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const saleItemRelDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'saleItemRelNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleItemRelNum`).d('序号'),
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDesc',
      type: 'string',
      bind: 'itemObj.itemDesc',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'string',
      bind: 'itemObj.itemAttr',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
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
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const entityItemRelDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'saleEntityRelNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleEntityRelNum`).d('序号'),
    },
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      ignore: 'always',
      required: true,
      lovPara: {
        enabledFlag: 1,
      },
      textField: 'salesEntityCode',
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体'),
    },
    {
      name: 'salesEntityId',
      type: 'string',
      bind: 'salesEntityObj.salesEntityId',
    },
    {
      name: 'salesEntityCode',
      type: 'string',
      bind: 'salesEntityObj.salesEntityCode',
    },
    {
      name: 'salesEntityName',
      type: 'string',
      bind: 'salesEntityObj.salesEntityName',
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体说明'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: entityRelsUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: entityRelsUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data: data[0],
        url: entityRelsUrl,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: entityRelsUrl,
        data,
        method: 'DELETE',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

export { listDS, headDS, saleItemRelDS, entityItemRelDS };
