import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

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
    },
  ],
  fields: [
    {
      name: 'orgnizationName',
      type: 'string',
      label: '事业部',
    },
    {
      name: 'planStartDate',
      type: 'dateTime',
      label: '计划开工日期',
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'moId',
      type: 'string',
      label: '工单ID',
    },
    {
      name: 'moNum',
      type: 'string',
      label: '工单编码',
    },
    {
      name: 'itemId',
      type: 'string',
      label: '物料ID',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'description',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'makeQty',
      type: 'number',
      label: '需求数量',
    },
    {
      name: 'completedQty',
      type: 'number',
      label: '已完成数量',
    },
    {
      name: 'attributeDecimal1',
      type: 'number',
      label: '已生成入库单数量',
    },
    {
      name: 'inventoryQuantity',
      type: 'number',
      label: '本次入库数量',
      validator: (value, name, record) => {
        const maxNum = record.get('completedQty') - record.get('attributeDecimal1');
        if (value > 0 && value <= maxNum) {
          return true;
        }
        return `本次入库数量必须大于0且小于或等于${maxNum}。`;
      },
      dynamicProps: {
        defaultValue: ({ record }) => {
          return record.get('completedQty') - record.get('attributeDecimal1');
        },
        max: ({ record }) => {
          return record.get('completedQty') - record.get('attributeDecimal1');
        },
      },
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: '入库仓库',
      lovCode: common.warehouse,
      noCache: true,
      textField: 'warehouseName',
      dynamicProps: {
        defaultValue: ({ record }) => {
          return record.warehouseName;
        },
      },
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
      label: '入库货位',
      lovCode: common.wmarea,
      noCache: true,
      textField: 'wmAreaName',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        defaultValue: ({ record }) => {
          return record.wmAreaName;
        },
      },
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
    {
      name: 'remake',
      type: 'string',
      label: '备注',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/jcdq-complete/query-inventory-generate`,
        method: 'GET',
        data,
      };
    },
  },
});

export { queryHeadDS };
