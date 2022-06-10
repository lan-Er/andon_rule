/*
 * @module: 新增/修改Ds
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-29 14:36:06
 * @LastEditTime: 2021-02-23 09:42:03
 * @copyright: Copyright (c) 2020,Hand
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

import tableLineDs from './indexLineDs';

const { lmdsUnitPrice, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.unitPrice';
const url = `${HLOS_LMDS}/v1/${organizationId}/work-prices`;
const talbeListDs = new DataSet({ ...tableLineDs() });
export default () => ({
  autoQuery: false,
  selection: false,
  children: {
    workPriceVersionList: talbeListDs,
  },
  autoCreate: false,
  fields: [
    {
      name: 'workPriceType',
      type: 'string',
      label: intl.get(`${preCode}.workPriceType`).d('单价类型'),
      lookupCode: lmdsUnitPrice.workPriceType,
      required: true,
    },
    {
      name: 'assignRuleObj',
      type: 'object',
      lovCode: common.rule,
      label: intl.get(`${preCode}.assignRule`).d('分配规则'),
      ignore: 'always',
    },
    {
      name: 'assignRule',
      type: 'string',
      bind: 'assignRuleObj.ruleCode',
    },
    {
      name: 'ruleId',
      type: 'string',
      bind: 'assignRuleObj.ruleId',
    },
    {
      name: 'ruleName',
      type: 'string',
      bind: 'assignRuleObj.ruleName',
    },
    {
      name: 'description',
      type: 'string',
      label: '描述',
    },
    {
      name: 'productionObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${preCode}.productionObj`).d('产品'),
      lovPara: {
        itemType: 'FA',
      },
      ignore: 'always',
      // textField: 'itemCode',
    },
    {
      name: 'productId',
      type: 'string',
      bind: 'productionObj.itemId',
    },
    {
      name: 'productCode',
      type: 'string',
      bind: 'productionObj.itemCode',
    },
    {
      name: 'productName',
      type: 'string',
      bind: 'productionObj.item',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${preCode}.itemObj`).d('物料'),
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
      name: 'categoryObj',
      lovCode: common.categories,
      label: intl.get(`${preCode}.categoryObj`).d('物料类别'),
      lovPara: {
        categorySetCode: 'ITEM_ME',
      },
      ignore: 'always',
      type: 'object',
    },
    {
      name: 'itemCategoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'itemCategory',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'itemCategoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operationObj`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'operation',
      type: 'string',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationName',
      type: 'string',
      bind: 'operationObj.operationName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.organizationObj`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: intl.get(`${preCode}.departmentObj`).d('部门'),
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'department',
      type: 'string',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'departmentObj.departmentName',
    },
    {
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${preCode}.partyObj`).d('商业实体'),
      lovCode: common.party,
      ignore: 'always',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'partyObj.partyNumber',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${preCode}.project`).d('项目号'),
    },
    {
      name: 'wbsNum',
      type: 'string',
      label: intl.get(`${preCode}.wbsNum`).d('WBS号'),
    },
    {
      name: 'auditWorkflowId',
      type: 'string',
      label: intl.get(`${preCode}.auditWorkflowId`).d('审批流程'),
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部编号'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      defaultValue: true,
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
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
        method: 'POST',
      };
    },
  },
});
