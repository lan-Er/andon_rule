/*
 * @Author: zhang yang
 * @Description: 规则分配 - 详情页ds
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 14:44:38
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
  primaryKey: 'assignId',
  fields: [
    {
      name: 'ruleObj',
      type: 'object',
      label: intl.get(`${preCode}.ruleName`).d('规则名称'),
      lovCode: lmdsRuleAssign.rule,
      ignore: 'always',
      required: true,
    },
    {
      name: 'ruleId',
      type: 'string',
      bind: 'ruleObj.ruleId',
    },
    {
      name: 'ruleName',
      type: 'string',
      bind: 'ruleObj.ruleName',
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
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: common.resource,
      ignore: 'always',
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
      lovPara: { categorySetCode: 'ITEM' },
      ignore: 'always',
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
      lovCode: common.item,
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
      name: 'operation',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
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
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      const objs = data[0] || {};
      objs.ruleAssignValues = objs.ruleItemDS || [];
      delete objs.ruleItemDS;
      return {
        url,
        data: objs,
        params,
        method: 'POST',
      };
    },
  },
});
