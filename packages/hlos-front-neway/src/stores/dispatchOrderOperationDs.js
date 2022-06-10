import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

import codeConfig from '@/common/codeConfig';

const preCode = 'neway.dispatchOrderOperation.model';
const commonCode = 'lmds.common.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMESS}/v1/${organizationId}/neway-non-product-worker-times`;

const listTableDs = () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'documentTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.moType`).d('工单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'NP_MO' },
      ignore: 'always',
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'documentTypeObj.documentTypeId',
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
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'documentTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.moType`).d('工单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'NP_MO' },
      required: true,
      ignore: 'always',
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'documentTypeObj.documentTypeId',
    },
    {
      name: 'moTypeCode',
      type: 'string',
      bind: 'documentTypeObj.documentTypeCode',
    },
    {
      name: 'moTypeName',
      type: 'string',
      bind: 'documentTypeObj.documentTypeName',
    },
    {
      name: 'costCenterObj',
      type: 'object',
      label: intl.get(`${preCode}.costCenter`).d('成本中心'),
      lovCode: 'LMDS.COST_CENTER_CODE',
      required: true,
      ignore: 'always',
    },
    {
      name: 'costCenterId',
      type: 'string',
      bind: 'costCenterObj.costCenterId',
    },
    {
      name: 'costCenterCode',
      type: 'string',
      bind: 'costCenterObj.costCenterCode',
    },
    {
      name: 'costCenterName',
      type: 'string',
      bind: 'costCenterObj.costCenterName',
    },
    {
      name: 'machineCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.machineCategory`).d('机床类别'),
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'MACHINE' },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'machineCategoryObj.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'machineCategoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'machineCategoryObj.categoryName',
    },
    {
      name: 'caliber',
      type: 'string',
      label: intl.get(`${preCode}.caliber`).d('口径'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      textField: 'item',
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
      name: 'itemName',
      type: 'string',
      bind: 'itemObj.item',
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
      required: true,
    },
    {
      name: 'standardWorkTime',
      type: 'number',
      label: intl.get(`${preCode}.standardWorkTime`).d('工时(分钟)'),
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
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
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
  },
});

export { listTableDs };
