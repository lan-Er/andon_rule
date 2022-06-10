/*
 * @Author: zhang yang
 * @Description: 规则分配主表ds
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 14:43:17
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsRuleAssign, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.ruleAssign.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/rule-assigns`;

export default () => ({
  autoQuery: false,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'ruleName',
      type: 'string',
      label: intl.get(`${preCode}.rule`).d('规则'),
    },
    {
      name: 'itemName',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
  ],
  fields: [
    {
      name: 'rule',
      type: 'object',
      label: intl.get(`${preCode}.rule`).d('规则'),
      lovCode: lmdsRuleAssign.rule,
      ignore: 'always',
      required: true,
    },
    {
      name: 'ruleId',
      type: 'string',
      bind: 'rule.ruleId',
    },
    {
      name: 'ruleName',
      type: 'string',
      bind: 'rule.ruleName',
    },
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
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
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: common.resource,
      ignore: 'always',
      required: true,
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resource.resourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resource.resourceName',
    },
    {
      name: 'itemCategory',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      lovCode: common.categories,
      ignore: 'always',
      required: true,
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'itemCategory.categoryId',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'itemCategory.categoryName',
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.itemMe,
      ignore: 'always',
      required: true,
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
      name: 'operation',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
      required: true,
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operation.operationId',
    },
    {
      name: 'operationName',
      type: 'string',
      bind: 'operation.operationName',
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
