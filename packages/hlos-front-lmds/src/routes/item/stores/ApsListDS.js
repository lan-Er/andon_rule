/**
 * @Description: 物料计划页面管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 15:33:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsItem, common } = codeConfig.code;
const {
  lovPara: { itemAps },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-apss`;

export default () => ({
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.apsCategory`).d('计划类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM_APS' },
      ignore: 'always',
    },
    {
      name: 'apsCategoryId',
      type: 'string',
      bind: 'itemCategoryObj.categoryId',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: '是否有效',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        selection: 'single',
        data: [
          { text: '有效', value: '1' },
          { text: '无效', value: '0' },
        ],
      }),
      defaultValue: '1',
    },
  ],
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'apsOuId',
      type: 'string',
    },
    {
      name: 'apsOuCode',
      type: 'string',
    },
    {
      name: 'apsOuName',
      type: 'string',
      label: intl.get(`${commonCode}.apsOu`).d('计划中心'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      validator: descValidator,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'itemApsType',
      type: 'string',
      label: intl.get(`${preCode}.itemApsType`).d('物料计划类型'),
      lookupCode: lmdsItem.itemApsType,
    },
    {
      name: 'apsCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.apsCategory`).d('物料计划类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemAps },
      ignore: 'always',
    },
    {
      name: 'apsCategoryId',
      type: 'string',
      bind: 'apsCategoryObj.categoryId',
    },
    {
      name: 'apsCategoryCode',
      type: 'string',
      bind: 'apsCategoryObj.categoryCode',
    },
    {
      name: 'apsCategoryName',
      type: 'string',
      bind: 'apsCategoryObj.categoryName',
    },
    {
      name: 'planObj',
      type: 'object',
      label: intl.get(`${preCode}.planCode`).d('计划物料编码'),
      lovCode: lmdsItem.planCode,
      ignore: 'always',
    },
    {
      name: 'planId',
      type: 'string',
      bind: 'planObj.itemId',
    },
    {
      name: 'planCode',
      type: 'string',
      bind: 'planObj.itemCode',
    },
    {
      name: 'plannerObj',
      type: 'object',
      label: intl.get(`${preCode}.planner`).d('计划员'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'plannerId',
      type: 'string',
      bind: 'plannerObj.workerId',
    },
    {
      name: 'planner',
      type: 'string',
      bind: 'plannerObj.workerCode',
    },
    {
      name: 'plannerName',
      type: 'string',
      bind: 'plannerObj.workerName',
    },
    {
      name: 'resourceRule',
      type: 'string',
      label: intl.get(`${preCode}.resourceRule`).d('资源分配规则'),
      lookupCode: lmdsItem.resourceRule,
    },
    {
      name: 'apsResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.apsResource`).d('默认计划资源'),
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'apsResourceId',
      type: 'string',
      bind: 'apsResourceObj.resourceId',
    },
    {
      name: 'apsResourceCode',
      type: 'string',
      bind: 'apsResourceObj.resourceCode',
    },
    {
      name: 'apsResourceName',
      type: 'string',
      bind: 'apsResourceObj.resourceName',
    },
    {
      name: 'releaseRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.releaseRule`).d('下达策略'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为RELEASE
      lovPara: {
        ruleType: 'RELEASE',
      },
    },
    {
      name: 'releaseRuleId',
      type: 'string',
      bind: 'releaseRuleObj.ruleId',
    },
    {
      name: 'releaseRuleName',
      type: 'string',
      bind: 'releaseRuleObj.ruleName',
    },
    {
      name: 'mtoFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.mtoFlag`).d('按单生产'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'planFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.planFlag`).d('参与计划'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'keyComponentFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyComponentFlag`).d('关键组件'),
    },
    {
      name: 'preProcessLeadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.preProcessLeadTime`).d('前处理提前期'),
      // 小时
    },
    {
      name: 'processLeadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.processLeadTime`).d('处理提前期'),
      // 小时
    },
    {
      name: 'postProcessLeadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.postProcessLeadTime`).d('后处理提前期'),
      // 小时
    },
    {
      name: 'safetyLeadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.safetyLeadTime`).d('安全生产周期'),
      // 小时
    },
    {
      name: 'exceedLeadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.exceedLeadTime`).d('最大提前生产周期'),
      // 天
    },
    {
      name: 'demandTimeFence',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.demandTF`).d('需求时间栏'),
      // 天
    },
    {
      name: 'orderTimeFence',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.orderTF`).d('订单时间栏'),
      // 天
    },
    {
      name: 'releaseTimeFence',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.releaseTF`).d('下达时间栏'),
      // 天
    },
    {
      name: 'demandMergeTimeFence',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.demandMergeTF`).d('需求合并时间栏'),
      // 天
    },
    {
      name: 'supplyMergeTimeFence',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.supplyMergeTF`).d('供应合并时间栏'),
      // 天
    },
    {
      name: 'safetyStockMethod',
      type: 'string',
      label: intl.get(`${preCode}.safetyStockMethod`).d('安全库存法'),
      lookupCode: lmdsItem.safetyStockMethod,
    },
    {
      name: 'safetyStockPeriod',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.safetyStockPeriod`).d('安全库存周期'),
      // 天
    },
    {
      name: 'safetyStockValue',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.safetyStockValue`).d('安全库存值'),
    },
    {
      name: 'maxStockQty',
      type: 'number',
      label: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
      // 最大库存量不可小于最小库存量
      validator: (value, name, record) => {
        if (value <= record.get('minStockQty')) {
          return intl.get(`lmds.item.validation.biggerStock`).d('最大库存必须大于最小库存');
        }
      },
    },
    {
      name: 'minStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
    },
    {
      name: 'capacityTimeFence',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.capacityTF`).d('能力限制时间栏'),
      // 天
    },
    {
      name: 'capacityValue',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.capacityValue`).d('能力限制值'),
    },
    {
      name: 'assemblyShrinkage',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.assemblyShrinkage`).d('生产损耗率'),
    },
    {
      name: 'economicLotSize',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.economicLotSize`).d('经济批量'),
    },
    {
      name: 'economicSplitParameter',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.economicSplitParameter`).d('批量舍入比例'),
    },
    {
      name: 'minOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minOrderQty`).d('最小订单数量'),
    },
    {
      name: 'fixedLotMultiple',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.fixedLotMultiple`).d('圆整批量'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
  },
});
