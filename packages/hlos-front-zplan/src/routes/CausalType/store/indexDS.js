/*
 * @Descripttion: 销售预测模型-因子类别DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
// import codeConfig from '@/common/codeConfig';
// import { codeValidator } from 'hlos-front/lib/utils/utils';

const intlPrefix = 'zplan.causalType.model';
// const { common, orgInfo } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const causalTypeUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-causal-types`;
const activityUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-activitys`;
const festivalUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-festivals`;
const discountUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-discounts`;
const lifecycleUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-lifecycles`;
const siphonicEffectsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-siphonic-effects`;

// 类别因子
const causalTypeListDS = () => ({
  // autoQuery: true,
  queryFields: [
    {
      name: 'causalTypeCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.causalTypeCode`).d('因子类别编码'),
    },
    {
      name: 'causalTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.causalTypeName`).d('因子类别名称'),
    },
  ],
  fields: [
    {
      name: 'causalTypeCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.causalTypeCode`).d('因子类别编码'),
    },
    {
      name: 'causalTypeName',
      required: true,
      type: 'string',
      label: intl.get(`${intlPrefix}.causalTypeName`).d('因子类别名称'),
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.supplierShortName`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: causalTypeUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: causalTypeUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url: causalTypeUrl,
        method: 'PUT',
      };
    },
  },
});

// 节日
const festivalListDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'festivalCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.festivalCode`).d('节日代码'),
    },
    {
      name: 'festivalName',
      type: 'string',
      label: intl.get(`${intlPrefix}.festivalName`).d('节日名称'),
    },
  ],
  fields: [
    {
      name: 'festivalCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.festivalCode`).d('节日代码'),
    },
    {
      name: 'festivalName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.festivalName`).d('节日名称'),
    },
    {
      name: 'festivalId',
      type: 'string',
      label: intl.get(`${intlPrefix}.festivalId`).d('虹吸效应'),
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.supplierShortName`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: festivalUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: festivalUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url: festivalUrl,
        method: 'PUT',
      };
    },
  },
});

// 虹吸效应
const siphonicEffectListDS = () => ({
  selection: false,
  fields: [
    {
      name: 'nearDay',
      type: 'string',
      label: intl.get(`${intlPrefix}.nearDay`).d('临近天数'),
    },
    {
      name: 'siphonicEffectValue',
      type: 'string',
      label: intl.get(`${intlPrefix}.siphonicEffectValue`).d('虹吸效应系数'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: siphonicEffectsUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: siphonicEffectsUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url: siphonicEffectsUrl,
        method: 'PUT',
      };
    },
  },
});

// 促销活动
const activityListDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'activityCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.activityCode`).d('活动代码'),
    },
    {
      name: 'activityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.activityName`).d('活动名称'),
    },
  ],
  fields: [
    {
      name: 'activityCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.activityCode`).d('活动代码'),
    },
    {
      name: 'activityName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.activityName`).d('活动名称'),
    },
    {
      name: 'activityId',
      type: 'string',
      label: intl.get(`${intlPrefix}.activityId`).d('虹吸效应'),
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.supplierShortName`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: activityUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: activityUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url: activityUrl,
        method: 'PUT',
      };
    },
  },
});

// 折扣比例定义
const discountListDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'discountCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.discountCode`).d('折扣比例代码'),
    },
    {
      name: 'discountName',
      type: 'string',
      label: intl.get(`${intlPrefix}.discountName`).d('折扣比例名称'),
    },
  ],
  fields: [
    {
      name: 'discountCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.discountCode`).d('折扣比例代码'),
    },
    {
      name: 'discountName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.discountName`).d('折扣比例名称'),
    },
    {
      name: 'minRate',
      required: true,
      type: 'number',
      label: intl.get(`${intlPrefix}.minRate`).d('实际售价/标准售价下限（包含）'),
      step: 0.000001,
    },
    {
      name: 'maxRate',
      required: true,
      type: 'number',
      label: intl.get(`${intlPrefix}.maxRate`).d('实际售价/标准售价上限（不包含）'),
      step: 0.000001,
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.supplierShortName`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: discountUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: discountUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url: discountUrl,
        method: 'PUT',
      };
    },
  },
});

// 生命周期定义
const lifecycleListDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'lifecycleCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.lifecycleCode`).d('生命周期代码'),
    },
    {
      name: 'lifecycleName',
      type: 'string',
      label: intl.get(`${intlPrefix}.lifecycleName`).d('生命周期名称'),
    },
  ],
  fields: [
    {
      name: 'lifecycleCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.lifecycleCode`).d('生命周期代码'),
    },
    {
      name: 'lifecycleName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.lifecycleName`).d('生命周期名称'),
    },
    {
      name: 'minRate',
      required: true,
      type: 'number',
      label: intl.get(`${intlPrefix}.minRate`).d('上市天数/总生命周期天数下限（包含）'),
      step: 0.000001,
    },
    {
      name: 'maxRate',
      required: true,
      type: 'number',
      label: intl.get(`${intlPrefix}.maxRate`).d('上市天数/总生命周期天数上限（不包含）'),
      step: 0.000001,
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.supplierShortName`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: lifecycleUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: lifecycleUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url: lifecycleUrl,
        method: 'PUT',
      };
    },
  },
});

export {
  causalTypeListDS,
  festivalListDS,
  siphonicEffectListDS,
  activityListDS,
  discountListDS,
  lifecycleListDS,
};
