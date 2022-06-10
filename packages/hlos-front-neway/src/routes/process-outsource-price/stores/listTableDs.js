import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDSS } from 'hlos-front/lib/utils/config';

import codeConfig from '@/common/codeConfig';

const preCode = 'neway.processOutsourcePrice.model';
const commonCode = 'lmds.common.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMDSS}/v1/${organizationId}/neway-work-prices`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.purchaseOrg`).d('采购组织'),
      lovCode: common.scmOu,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.scmOuId',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'supplier',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'supplier.partyId',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'SCMGroup',
      type: 'object',
      label: intl.get(`${preCode}..purchaseGroup`).d('采购组'),
      lovCode: common.scmGp,
      ignore: 'always',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'SCMGroup.scmGroupId',
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.purchaseOrg`).d('采购组织'),
      lovCode: common.scmOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.scmOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.scmOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.scmOuName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      required: true,
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
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
      bind: 'itemObj.description',
    },
    {
      name: 'supplier',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      // lovCode: 'LMDS.SUPPLIER',
      lovCode: common.supplier,
      required: true,
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'supplier.partyId',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'supplier.partyNumber',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'supplier.partyName',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      // lovCode: 'LMDS.OPERATION',
      lovCode: common.operation,
      required: true,
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
      name: 'SCMGroup',
      type: 'object',
      label: intl.get(`${preCode}..purchaseGroup`).d('采购组'),
      // lovCode: 'LMDS.SCM_GROUP',
      lovCode: common.scmGp,
      ignore: 'always',
      required: true,
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'SCMGroup.scmGroupId',
    },
    {
      name: 'department',
      type: 'string',
      bind: 'SCMGroup.groupCode',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'SCMGroup.groupName',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'attributeDecimal1',
      type: 'number',
      label: intl.get(`${preCode}.price`).d('价格'),
      required: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: `${HLOS_LMDSS}/v1/${organizationId}/neway-work-prices/batch-save-work-price`,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: `${HLOS_LMDSS}/v1/${organizationId}/neway-work-prices/batch-save-work-price`,
        data,
        method: 'POST',
      };
    },
  },
});
