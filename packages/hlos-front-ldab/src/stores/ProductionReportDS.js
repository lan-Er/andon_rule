import moment from 'moment';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/report/production-item`;

// 顶部查询DS
export const QueryDS = () => ({
  fields: [
    {
      name: 'time',
      type: 'date',
      defaultValue: moment().add(-1, 'days').format('YYYY-MM-DD'),
    },
    {
      // 组织
      name: 'organizationObj',
      type: 'object',
      lovCode: common.singleMeOu,
      required: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
  ],
});

// 底部表格DS
export const TableDS = () => ({
  selection: false,
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
  fields: [
    {
      label: '物料',
      name: 'itemCode',
      type: 'string',
    },
    {
      label: '物料描述',
      name: 'itemDescription',
      type: 'string',
    },
    {
      label: '物料类型',
      name: 'itemType',
      type: 'string',
    },
    {
      label: '物料类别',
      name: 'itemCategoryName',
      type: 'string',
    },
    {
      label: '单位',
      name: 'uomName',
      type: 'string',
    },
    {
      label: '合格数量',
      name: 'executeQty',
      type: 'string',
    },
    {
      label: '不合格数量',
      name: 'executeNgQty',
      type: 'string',
    },
    {
      label: '报废数量',
      name: 'scrappedQty',
      type: 'string',
    },
    {
      label: '返修数量',
      name: 'reworkQty',
      type: 'string',
    },
    {
      label: '待定数量',
      name: 'pendingQty',
      type: 'string',
    },
    {
      label: '合格率',
      name: 'okPercent',
      type: 'number',
    },
  ],
});
