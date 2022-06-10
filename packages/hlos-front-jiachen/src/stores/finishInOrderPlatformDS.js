import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const queryHeadDS = () => ({
  queryFields: [
    {
      name: 'areaObj',
      type: 'object',
      label: '事业部',
      lovCode: common.area,
      textField: 'meAreaName',
      ignore: 'always',
    },
    {
      name: 'meAreaId',
      type: 'string',
      bind: 'areaObj.meAreaId',
    },
    {
      name: 'moNum',
      type: 'string',
      label: '工单编码',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: common.item,
      textField: 'itemCode',
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
      ignore: 'always',
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
  ],
  fields: [
    {
      name: 'requestId',
      type: 'string',
      label: '完工入库单ID',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: '完工入库单号',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: '事业部',
    },
    {
      name: 'moNum',
      type: 'string',
      label: '工单编码',
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'description',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'requestStatus',
      type: 'string',
      label: '状态',
    },
    {
      name: 'requestStatusMeaning',
      type: 'string',
      label: '状态',
    },
    {
      name: 'applyQty',
      type: 'string',
      label: '制单数量',
    },
    {
      name: 'executedQty',
      type: 'string',
      label: '执行数量',
    },
    {
      name: 'resourceName',
      type: 'string',
      label: '创建人',
    },
    {
      name: 'creationDate',
      type: 'string',
      label: '创建时间',
    },
    {
      name: 'operator',
      type: 'string',
      label: '执行人',
    },
    {
      name: 'executedTime',
      type: 'string',
      label: '执行时间',
    },
    {
      name: 'attributeName',
      type: 'string',
      label: '提交人',
    },
    {
      name: 'attributeDatetime1',
      type: 'string',
      label: '提交时间',
    },
    {
      name: 'shutDownPeople',
      type: 'string',
      label: '关闭人',
    },
    {
      name: 'attributeDatetime2',
      type: 'string',
      label: '关闭时间',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/jcdq-complete/query-complete-header-message`,
        method: 'GET',
        data,
      };
    },
  },
});

const queryLineDS = () => ({
  fields: [
    {
      name: 'tagCode',
      type: 'string',
      label: '条码',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
    },
    {
      name: 'executedQty',
      type: 'string',
      label: '数量',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/jcdq-complete/query-complete-line-message`,
        method: 'GET',
        data,
      };
    },
  },
});

export { queryHeadDS, queryLineDS };
