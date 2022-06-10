import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.treeBom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-boms/tree-list`;

export default () => ({
  autoQuery: true,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.organization`).d('组织'),
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
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.itemMe,
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
      ignore: 'always',
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      lovCode: common.categories,
      lovPara: {
        categoryClass: 'ITEM_WM',
      },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
      ignore: 'always',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.organization`).d('组织'),
    },
    {
      name: 'itemCode',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'categoryName',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
    },
    {
      name: 'bomCode',
      label: intl.get(`${common}.bom`).d('BOM'),
    },
    {
      name: 'bomDescription',
      label: intl.get(`${common}.bomDesc`).d('BOM描述'),
    },
    {
      name: 'bomVersion',
      type: 'string',
      label: intl.get(`${preCode}.bomVersion`).d('版本'),
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('主要标识'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});
