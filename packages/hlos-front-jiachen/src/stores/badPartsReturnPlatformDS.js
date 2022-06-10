import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const { common } = codeConfig.code;

const queryHeadDS = () => ({
  // autoQuery: true,
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
      name: 'requestDepartmentId',
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
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
  ],
  fields: [
    {
      name: 'requestId',
      type: 'string',
      label: '坏件退换ID',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: '坏件退换单号',
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
      name: 'requestDepartmentName',
      type: 'string',
      label: '事业部',
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      label: '退回仓库',
    },
    {
      name: 'toWmAreaName',
      type: 'string',
      label: '退回货位',
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: '补领仓库',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      label: '补领货位',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/jcdq-return-exchange/query-header-button`,
        method: 'GET',
        data,
      };
    },
  },
});

const queryLineDS = () => ({
  fields: [
    {
      name: 'requestLineNum',
      type: 'number',
      label: '行号',
    },
    {
      name: 'moNum',
      type: 'string',
      label: '工单编码',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '成品编码',
    },
    {
      name: 'description',
      type: 'string',
      label: '成品描述',
    },
    {
      name: 'componentItemCode',
      type: 'string',
      label: '组件编码',
    },
    {
      name: 'componentDescription',
      type: 'string',
      label: '组件描述',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: '标签编码',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
    },
    {
      name: 'applyQty',
      type: 'number',
      label: '数量',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/jcdq-return-exchange/query-line`,
        method: 'GET',
        data,
      };
    },
  },
});

const addHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'requestId',
      type: 'string',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: '坏件退换单号',
      disabled: true,
    },
    {
      name: 'areaObj',
      type: 'object',
      label: '部门',
      lovCode: common.area,
      textField: 'meAreaName',
      required: true,
    },
    {
      name: 'meAreaId',
      type: 'string',
      bind: 'areaObj.meAreaId',
    },
    {
      name: 'meAreaCode',
      type: 'string',
      bind: 'areaObj.meAreaCode',
    },
    {
      name: 'meAreaName',
      type: 'string',
      bind: 'areaObj.meAreaName',
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      label: '退回仓库',
      lovCode: common.warehouse,
      textField: 'warehouseName',
      required: true,
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      bind: 'toWarehouseObj.warehouseCode',
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      bind: 'toWarehouseObj.warehouseName',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      label: '退回货位',
      lovCode: common.wmArea,
      cascadeMap: {
        warehouseId: 'toWarehouseId',
      },
      textField: 'wmAreaName',
    },
    {
      name: 'toWmAreaId',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaId',
    },
    {
      name: 'toWmAreaCode',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaCode',
    },
    {
      name: 'toWmAreaName',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: '补领仓库',
      lovCode: common.warehouse,
      textField: 'warehouseName',
      required: true,
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: '补领货位',
      lovCode: common.wmArea,
      cascadeMap: {
        warehouseId: 'warehouseId',
      },
      textField: 'wmAreaName',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
    },
  ],
  events: {
    update({ record, name, value, oldValue }) {
      const newId = value ? value.warehouseId : '';
      const oldId = oldValue ? oldValue.warehouseId : '';
      if (name === 'toWarehouseObj' && newId !== oldId) {
        record.set('toWmAreaObj', {});
      } else if (name === 'warehouseObj' && newId !== oldId) {
        record.set('wmAreaObj', {});
      }
    },
  },
});

const addLineDS = () => ({
  fields: [
    {
      name: 'requestLineId',
      type: 'string',
    },
    {
      name: 'requestLineNum',
      type: 'number',
      label: '行号',
    },
    {
      name: 'moObj',
      type: 'object',
      label: '工单编码',
      lovCode: common.mo,
      textField: 'moNum',
      required: true,
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'moObj.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      bind: 'moObj.moNum',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'moObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'moObj.itemCode',
      label: '成品编码',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'moObj.description',
      label: '成品描述',
    },
    {
      name: 'componentObj',
      type: 'object',
      label: '组件编码',
      lovCode: common.moComponent,
      textField: 'componentItemCode',
      required: true,
      cascadeMap: {
        moId: 'moId',
      },
      // multiple: true,
      // dynamicProps: {
      //   lovPara: ({record}) => ({
      //     moId: record.get('moId'),
      //   }),
      // },
    },
    {
      name: 'componentItemId',
      type: 'string',
      bind: 'componentObj.componentItemId',
    },
    {
      name: 'componentItemCode',
      type: 'string',
      bind: 'componentObj.componentItemCode',
    },
    {
      name: 'componentDescription',
      type: 'string',
      bind: 'componentObj.componentItemDescription',
      label: '组件描述',
    },
    {
      name: 'supplyType',
      type: 'string',
      bind: 'componentObj.supplyType',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: '标签编码',
      dynamicProps: {
        required: ({ record }) => {
          return record.get('supplyType') === 'PUSH';
        },
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
      dynamicProps: {
        required: ({ record }) => {
          return record.get('supplyType') === 'PUSH';
        },
      },
    },
    {
      name: 'applyQty',
      type: 'number',
      label: '数量',
      required: true,
      min: 0,
      validator: (value) => {
        if (value > 0) {
          return true;
        }
        return `数量必须大于0`;
      },
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/jcdq-return-exchange/query-line`,
        method: 'GET',
        data,
      };
    },
  },
  events: {
    update({ record, name, value, oldValue }) {
      const newId = value ? value.moId : '';
      const oldId = oldValue ? oldValue.moId : '';
      if (name === 'moObj' && newId !== oldId) {
        record.set('componentObj', {});
      }
    },
  },
});

export { queryHeadDS, queryLineDS, addHeadDS, addLineDS };
