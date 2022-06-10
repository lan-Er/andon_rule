/*
 * @Author: zhang yang
 * @Description: 工序 - List
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-04 19:56:37
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsOperation, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.operation.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operations`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'operationCode',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${preCode}.operationName`).d('工序名称'),
    },
  ],
  fields: [
    {
      name: 'operationCode',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'operationName',
      type: 'intl',
      label: intl.get(`${preCode}.operationName`).d('工序名称'),
      required: true,
    },
    {
      name: 'operationAlias',
      type: 'intl',
      label: intl.get(`${preCode}.operationAlias`).d('工序简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.operationDesc`).d('工序描述'),
      validator: descValidator,
    },
    {
      name: 'operationCategory',
      type: 'object',
      label: intl.get(`${preCode}.operationCategory`).d('工序类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'OPERATION' },
      ignore: 'always',
    },
    {
      name: 'operationCategoryId',
      type: 'string',
      bind: 'operationCategory.categoryId',
    },
    {
      name: 'operationCategoryName',
      type: 'string',
      bind: 'operationCategory.categoryName',
    },
    {
      name: 'operationType',
      type: 'string',
      label: intl.get(`${preCode}.operationType`).d('工序类型'),
      lookupCode: lmdsOperation.operationType,
      required: true,
    },
    {
      name: 'keyOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyOperationFlag`).d('关键工序'),
      defaultValue: true,
    },
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organization.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料编码'),
      lovCode: lmdsOperation.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'item.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      bind: 'item.description',
    },
    {
      name: 'processTime',
      type: 'number',
      label: intl.get(`${preCode}.processTime`).d('加工时间'),
      min: 0,
    },
    {
      name: 'standardWorkTime',
      type: 'number',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      min: 0,
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
    },
    {
      name: 'processProgram',
      type: 'string',
      label: intl.get(`${preCode}.processProgram`).d('加工程序'),
    },
    {
      name: 'collector',
      type: 'object',
      label: intl.get(`${preCode}.collector`).d('数据收集'),
      lovCode: lmdsOperation.collector,
      ignore: 'always',
    },
    {
      name: 'collectorId',
      type: 'string',
      bind: 'collector.collectorId',
    },
    {
      name: 'collectorName',
      type: 'string',
      bind: 'collector.collectorName',
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${preCode}.instruction`).d('工序说明'),
    },
    {
      name: 'downstreamOperation',
      type: 'string',
      label: intl.get(`${preCode}.downstreamOperation`).d('下游工序'),
    },
    {
      name: 'executeRule',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: common.rule,
      lovPara: { ruleType: 'EXECUTE' },
      ignore: 'always',
    },
    {
      name: 'executeRuleId',
      type: 'string',
      bind: 'executeRule.ruleId',
    },
    {
      name: 'executeRuleName',
      type: 'string',
      bind: 'executeRule.ruleName',
    },
    {
      name: 'inspectionRule',
      type: 'object',
      label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      lovCode: common.rule,
      lovPara: { ruleType: 'INSPECTION' },
      ignore: 'always',
    },
    {
      name: 'inspectionRuleId',
      type: 'string',
      bind: 'inspectionRule.ruleId',
    },
    {
      name: 'inspectionRuleName',
      type: 'string',
      bind: 'inspectionRule.ruleName',
    },
    {
      name: 'dispatchRule',
      type: 'object',
      label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      lovCode: common.rule,
      lovPara: { ruleType: 'DISPATCH' },
      ignore: 'always',
    },
    {
      name: 'dispatchRuleId',
      type: 'string',
      bind: 'dispatchRule.ruleId',
    },
    {
      name: 'dispatchRuleName',
      type: 'string',
      bind: 'dispatchRule.ruleName',
    },
    {
      name: 'packingRule',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('打包规则'),
      lovCode: common.rule,
      lovPara: { ruleType: 'PACKING' },
      ignore: 'always',
    },
    {
      name: 'packingRuleId',
      type: 'string',
      bind: 'packingRule.ruleId',
    },
    {
      name: 'packingRuleName',
      type: 'string',
      bind: 'packingRule.ruleName',
    },
    {
      name: 'reworkRule',
      type: 'object',
      label: intl.get(`${preCode}.reworkRule`).d('返工规则'),
      lovCode: common.rule,
      lovPara: { ruleType: 'REWORK' },
      ignore: 'always',
    },
    {
      name: 'reworkRuleId',
      type: 'string',
      bind: 'reworkRule.ruleId',
    },
    {
      name: 'reworkRuleName',
      type: 'string',
      bind: 'reworkRule.ruleName',
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
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
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
    create: () => {
      return {
        url,
        method: 'post',
      };
    },
    update: () => {
      return {
        url,
        method: 'put',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
