/**
 * @Description: 仓库现有量管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-17 11:47:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsOnhandQty } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.onhandQty.model';
const commonCode = 'lwms.common.model';

const url = `${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys`;

const onhandQtyListDS = {
  selection: false,
  pageSize: 100,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
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
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
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
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'featureCode',
      type: 'string',
      label: intl.get(`${preCode}.itemFeatureCode`).d('物料特性值'),
    },
    {
      name: 'lotObj',
      type: 'object',
      label: intl.get(`${commonCode}.lot`).d('批次'),
      lovCode: lwmsOnhandQty.lot,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          itemId: record.get('itemId'),
        }),
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lotObj.lotNumber',
    },
    {
      name: 'lotId',
      type: 'string',
      bind: 'lotObj.lotId',
    },
    {
      name: 'ownerObj',
      type: 'object',
      label: intl.get(`${preCode}.owner`).d('所有者'),
      lovCode: common.party,
      ignore: 'always',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'ownerObj.partyId',
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'ownerObj.partyName',
      ignore: 'always',
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${preCode}.projectNumber`).d('项目号'),
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'minQuantity',
      type: 'number',
      label: intl.get(`${preCode}.minQuantity`).d('数量>'),
      defaultValue: 0,
    },
    {
      name: 'maxQuantity',
      type: 'number',
      label: intl.get(`${preCode}.maxQuantity`).d('数量<='),
    },
    {
      name: 'availableFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('可用量'),
      defaultValue: 0,
      trueValue: 1,
      falseValue: 0,
    },
  ],
  fields: [
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    // {
    //   name: 'warehouse',
    //   type: 'string',
    //   label: intl.get(`${commonCode}.warehouse`).d('仓库'),
    // },
    {
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${commonCode}.warehouseCode`).d('仓库编码'),
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${commonCode}.warehouseName`).d('仓库名称'),
    },
    // {
    //   name: 'wmArea',
    //   type: 'string',
    //   label: intl.get(`${commonCode}.wmArea`).d('货位'),
    // },
    {
      name: 'wmAreaCode',
      type: 'string',
      label: intl.get(`${commonCode}.wmAreaCode`).d('货位编码'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
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
      name: 'featureCode',
      type: 'string',
      label: intl.get(`${preCode}.featureCode`).d('特性值'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.itemWmType`).d('物料仓储类型'),
      lookupCode: lwmsOnhandQty.itemType,
    },
    {
      name: 'quantity',
      type: 'string',
      label: intl.get(`${preCode}.quantity`).d('现有量'),
    },
    {
      name: 'availableQty',
      type: 'string',
      label: intl.get(`${preCode}.enabledQty`).d('可用量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${commonCode}.uom`).d('单位'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${commonCode}.lot`).d('批次'),
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'itemCategoryName',
      type: 'string',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
    },
    {
      name: 'warehouseCategoryName',
      type: 'string',
      label: intl.get(`${preCode}.warehouseCategory`).d('仓库类别'),
    },
    {
      name: 'ownerTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.ownerType`).d('所有者类型'),
      lookupCode: lwmsOnhandQty.ownerType,
      required: true,
    },
    {
      name: 'owner',
      type: 'string',
      label: intl.get(`${preCode}.owner`).d('所有者'),
    },
    {
      name: 'secondUomName',
      type: 'string',
      label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
    },
    {
      name: 'secondQuantity',
      type: 'string',
      label: intl.get(`${preCode}.secondQuantity`).d('辅助单位数量'),
    },
    {
      name: 'featureTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.featureType`).d('特征值类型'),
      lookupCode: lwmsOnhandQty.featureType,
    },
    {
      name: 'featureValue',
      type: 'string',
      label: intl.get(`${preCode}.featureValue`).d('特征值'),
    },
    {
      name: 'sourceNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceNumber`).d('关联单据'),
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${preCode}.projectNumber`).d('项目号'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
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
};

export {
  onhandQtyListDS, // 现有量查询列表展示
};
