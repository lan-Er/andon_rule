/**
 * 成品库存DS
 */
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';

const { common, raumplusFinishedGoodsInventory } = codeConfig.code;
const preCode = 'raumplus.finishedGoods';

const tableQuery = () => ({
  selection: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.model.organization`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'warehouseCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.warehouseCode`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseCodeObj.warehouseCode',
    },
    {
      name: 'wmAreaCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmAreaCode`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaCodeObj.wmAreaCode',
    },
    {
      name: 'documentNumObj',
      type: 'object',
      label: intl.get(`${preCode}.model.documentNum`).d('子订单号'),
      lovCode: raumplusFinishedGoodsInventory.documentnum,
      ignore: 'always',
    },
    {
      name: 'documentNum',
      bind: 'documentNumObj.soHeaderNumber',
    },
    {
      name: 'itemCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      bind: 'itemCodeObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemCodeObj.itemCode',
    },
    {
      name: 'attributeString1',
      type: 'string',
      label: intl.get(`${preCode}.model.attributeString1`).d('套号'),
    },
  ],
  fields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.model.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.model.itemDescription`).d('物料说明'),
    },
    {
      name: 'documentNum',
      type: 'string',
      label: intl.get(`${preCode}.model.documentNum`).d('子订单号'),
    },
    {
      name: 'uom',
      type: 'string',
      label: intl.get(`${preCode}.model.uom`).d('单位'),
    },
    {
      name: 'number',
      type: 'string',
      label: intl.get(`${preCode}.model.number`).d('包件数量'),
    },
    {
      name: 'wareHouseCode',
      type: 'string',
      label: intl.get(`${preCode}.model.warehouseCode`).d('仓库'),
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.model.wmAreaCode`).d('货位'),
    },
    {
      name: 'featureType',
      type: 'string',
      label: intl.get(`${preCode}.model.featureType`).d('包件类型'),
    },
    {
      name: 'attributeString1',
      type: 'string',
      label: intl.get(`${preCode}.model.attributeString1`).d('套号'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/product-present/query-product`,
        method: 'GET',
        data,
      };
    },
  },
});

const tableDetailed = () => ({
  // selection: false,
  selection: 'multiple',
  fields: [
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.model.tagCode`).d('包件条码'),
    },
    {
      name: 'outerTagCode',
      type: 'string',
      label: intl.get(`${preCode}.model.outerTagCode`).d('托盘号'),
    },
    {
      name: 'featureType',
      type: 'string',
      label: intl.get(`${preCode}.model.featureType`).d('包件类型'),
    },
    {
      name: 'attributeString1',
      type: 'string',
      label: intl.get(`${preCode}.model.attributeString1`).d('套号'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/product-present/query-product-detail`,
        method: 'GET',
        data,
      };
    },
  },
});

export { tableQuery, tableDetailed };
