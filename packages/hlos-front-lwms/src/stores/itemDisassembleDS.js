/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-14 22:11:40
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { queryItemControlTypeBatch } from '@/services/itemDisassembleService';
import codeConfig from '@/common/codeConfig';

const { common, lwmsOnhandQty } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const onhandQtyCode = 'lwms.onhandQty.model';
const commonCode = 'lwms.common.model';
const preCode = 'lwms.itemDisassemble.model';

const onhandQtyUrl = `${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys`;
const onhandQtyListDS = () => ({
  selection: 'single',
  pageSize: 10,
  fields: [
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'warehouse',
      type: 'string',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
    },
    {
      name: 'wmArea',
      type: 'string',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
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
      label: intl.get(`${onhandQtyCode}.featureCode`).d('特性值'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'quantity',
      type: 'string',
      label: intl.get(`${onhandQtyCode}.quantity`).d('现有量'),
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
      name: 'secondQuantity',
      type: 'string',
      label: intl.get(`${onhandQtyCode}.secondQuantity`).d('辅助单位数量'),
    },
    {
      name: 'tagCode',
      type: 'string',
    },
  ],
  transport: {
    read: () => {
      return {
        url: onhandQtyUrl,
        method: 'GET',
      };
    },
  },
});
const onhandQtyHeaderDS = () => ({
  selection: false,
  autoCreate: true,
  pageSize: 10,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
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
      name: 'lotObj',
      type: 'object',
      label: intl.get(`${commonCode}.lot`).d('批次'),
      lovCode: lwmsOnhandQty.lot,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemId: record.get('itemId'),
          organizationId: record.get('organizationId'),
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
  ],
  transport: {
    read: () => {
      return {
        url: onhandQtyUrl,
        method: 'GET',
      };
    },
  },
});
const itemDisassenbleSubHeaderDS = () => ({
  selection: false,
  autoCreate: true,
  pageSize: 10,
  children: {
    table: new DataSet({ ...itemDisassenbleResultDS() }),
    search: new DataSet({ ...itemDisassenbleTableSearchDS() }),
    // itemDisassenbleTableSearchDS
  },
  fields: [
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
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'disassembleQty',
      type: 'number',
      // 使用locale的lwms.issueRequestPlatform
      label: intl.get(`${preCode}.disassembleQty`).d('拆解数量'),
      required: true,
    },
    {
      label: intl.get(`${preCode}.moStatues`).d('参考MO'),
      name: 'moStatues',
      type: 'object',
      lovCode: 'LMES.MO',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          partySupplyType: 'CPCJ',
        }),
      },
    },
    {
      label: intl.get(`${preCode}.bomStatues`).d('参考BOM'),
      name: 'bomStatues',
      type: 'object',
      lovCode: 'LMDS.ITEM_BOM',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
  ],
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'moStatues') {
        if (record.data.moStatues) {
          dataSet.fields.get('bomStatues').set('disabled', true);
        } else {
          dataSet.fields.get('bomStatues').set('disabled', false);
        }
      }
      if (name === 'bomStatues') {
        if (record.data.bomStatues) {
          dataSet.fields.get('moStatues').set('disabled', true);
        } else {
          dataSet.fields.get('moStatues').set('disabled', false);
        }
      }
      if (name === 'disassembleQty') {
        dataSet.children.table.data.forEach((ele) => {
          if (ele.get('bomUsage') && record.get('disassembleQty')) {
            ele.set('referenceQuantity', ele.get('bomUsage') * record.get('disassembleQty'));
          } else {
            ele.set('referenceQuantity', 0);
          }
        });
      }
      if (name === 'organizationObj') {
        // if (record.data.organizationObj) {
        record.set('workerObj', {});
        record.set('moStatues', {});
        record.set('bomStatues', {});
        record.set('disassembleQty', null);
        dataSet.fields.get('moStatues').set('disabled', false);
        dataSet.fields.get('bomStatues').set('disabled', false);
        dataSet.children.table.reset();
        dataSet.children.search.reset();
        dataSet.children.search.current.set('organizationObj', record.data.organizationObj);
      }
    },
  },
});

const itemDisassenbleResultDS = () => ({
  // 目标物料目前仓库
  pageSize: 10,
  fields: [
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
      name: 'toItemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          // itemControl: record.get('activeKey') || 'QUANTITY',
        }),
      },
      ignore: 'always',
      required: true,
      noCache: true,
    },
    {
      name: 'toItemId',
      type: 'string',
      bind: 'toItemObj.itemId',
    },
    {
      name: 'toItemCode',
      type: 'string',
      bind: 'toItemObj.itemCode',
    },
    {
      name: 'toUomId',
      type: 'string',
      bind: 'toItemObj.uomId',
    },
    {
      name: 'toUom',
      type: 'string',
      bind: 'toItemObj.uom',
    },
    {
      name: 'toUomName',
      type: 'string',
      bind: 'toItemObj.uomName',
    },
    {
      name: 'toSecondUom',
      type: 'string',
      bind: 'toItemObj.secondUom',
    },
    {
      name: 'toSecondUomId',
      type: 'string',
      bind: 'toItemObj.secondUomId',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'toItemObj.description',
    },

    {
      name: 'toWarehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('目标仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      bind: 'toWarehouseObj.warehouseName',
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      bind: 'toWarehouseObj.warehouseCode',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('目标货位'),
      lovCode: common.wmArea,
      cascadeMap: {
        warehouseId: 'toWarehouseId',
      },
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('toWarehouseId'),
          organizationId: record.get('organizationId'),
        }),
      },
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
      name: 'toWmUnitObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('目标货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('toWarehouseId'),
          wmAreaId: record.get('toWmAreaId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'detailRecords',
      ignore: 'always',
    },
    {
      name: 'toWmUnitId',
      type: 'string',
      bind: 'toWmUnitObj.wmUnitId',
    },
    {
      name: 'toWmUnitCode',
      type: 'string',
      bind: 'toWmUnitObj.wmUnitCode',
    },
    {
      name: 'referenceQuantity',
      label: intl.get(`${preCode}.referenceQuantity`).d('参考数量'),
      type: 'number',
    },
    {
      name: 'quantity',
      label: intl.get(`${preCode}.quantity`).d('数量'),
      type: 'number',
      min: 0,
    },
    {
      name: 'bomUsage',
      label: intl.get(`${preCode}.bomUsage`).d('单位用量'),
      type: 'number',
      min: 0,
    },
    {
      name: 'toItemControlType',
      label: intl.get(`${preCode}.toItemControlType`).d('物料控制类型'),
      type: 'string',
    },
    {
      name: 'toItemControlTypeMeaning',
      label: '物料控制类型',
      type: 'string',
    },
  ],
  events: {
    create: async ({ record, dataSet }) => {
      if (Boolean(record.data.toItemObj) && Boolean(record.data.toWarehouseObj)) {
        const resp = await queryItemControlTypeBatch([
          {
            organizationId: record.data.organizationObj.organizationId,
            warehouseId: record.data.toWarehouseObj.warehouseId,
            itemId: record.data.toItemObj.itemId,
            tenantId: organizationId,
            groupId: '2021', // 传入的值不做参考
          },
        ]);
        record.set('toItemControlType', resp[0].itemControlType);
        if (resp[0].toItemControlType === 'QUANTITY') {
          dataSet.fields.get('quantity').set('required', true);
        } else {
          dataSet.fields.get('quantity').set('required', false);
        }
      }
    },
    update: async ({ name, record, dataSet }) => {
      if (name === 'toItemObj') {
        record.set('toItemControlType', '');
        record.set('quantity', null);
        record.set('detailRecords', {});
        if (Boolean(record.data.toItemObj) && Boolean(record.data.toWarehouseObj)) {
          const resp = await queryItemControlTypeBatch([
            {
              organizationId: record.data.organizationObj.organizationId,
              warehouseId: record.data.toWarehouseObj.warehouseId,
              itemId: record.data.toItemObj.itemId,
              tenantId: organizationId,
              groupId: '2021', // 传入的值不做参考
            },
          ]);
          record.set('toItemControlType', resp[0].itemControlType);
          record.set('toItemControlTypeMeaning', resp[0].itemControlTypeMeaning);
          if (resp[0].toItemControlType === 'QUANTITY') {
            dataSet.fields.get('quantity').set('required', true);
          } else {
            dataSet.fields.get('quantity').set('required', false);
          }
        }
      }
      if (name === 'toWarehouseObj') {
        record.set('quantity', null);
        record.set('toItemControlType', '');
        record.set('toWmAreaObj', {});
        record.set('detailRecords', {});
        if (Boolean(record.data.toItemObj) && Boolean(record.data.toWarehouseObj)) {
          const resp = await queryItemControlTypeBatch([
            {
              organizationId: record.data.organizationObj.organizationId,
              warehouseId: record.data.toWarehouseObj.warehouseId,
              itemId: record.data.toItemObj.itemId,
              tenantId: organizationId,
              groupId: '2021', // 传入的值不做参考
            },
          ]);
          record.set('toItemControlType', resp[0].itemControlType);
          record.set('toItemControlTypeMeaning', resp[0].itemControlTypeMeaning);
          if (resp[0].toItemControlType === 'QUANTITY') {
            dataSet.fields.get('quantity').set('required', true);
          } else {
            dataSet.fields.get('quantity').set('required', false);
          }
        }
      }
      if (name === 'detailRecords') {
        const arr = Array.from(record.get('detailRecords'));
        let sum = 0;
        if (arr.length > 0) {
          const quantityArr = arr.map((i) => i.data.quantity);
          for (let i = 0; i < quantityArr.length; i++) {
            sum += quantityArr[i];
          }
        }
        record.set('quantity', sum);
      }
    },
  },
});
const itemDisassenbleTableSearchDS = () => ({
  autoCreate: true,
  pageSize: 10,
  fields: [
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
      name: 'toWarehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('目标仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      bind: 'toWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('目标货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: {
        warehouseId: 'toWarehouseId',
      },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('toWarehouseId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
  ],
  events: {
    update: async ({ name, record }) => {
      if (name === 'toWmAreaObj') {
        record.set('toWarehouseObj', {});
      }
    },
  },
});
const itemTagSearchDS = () => ({
  autoCreate: true,
  pageSize: 10,
  fields: [
    {
      name: 'quantity',
      label: intl.get(`${preCode}.defaultTagQuantity`).d('默认标签数量'),
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'tagCode',
      label: intl.get(`${preCode}.printTagCode`).d('输入标签'),
      type: 'string',
      required: true,
    },
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.lotNumber`).d('批次'),
      type: 'string',
    },
  ],
});
const itemTagTableDS = () => ({
  pageSize: 10,
  selection: false,
  fields: [
    {
      name: 'tagCode',
      label: intl.get(`${preCode}.tagCode`).d('标签'),
      type: 'string',
      required: true,
    },
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.lotNumber`).d('批次'),
      type: 'string',
    },
    {
      name: 'quantity',
      label: intl.get(`${preCode}.quantity`).d('数量'),
      type: 'number',
      required: true,
      min: 0,
    },
  ],
});
const itemLotSearchDS = () => ({
  autoCreate: true,
  pageSize: 10,
  fields: [
    {
      name: 'quantity',
      label: intl.get(`${preCode}.defaultLotQuantity`).d('默认批次数量'),
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.printLotNumber`).d('输入批次'),
      type: 'string',
      required: true,
    },
  ],
});
const itemLotTableDS = () => ({
  pageSize: 10,
  selection: false,
  fields: [
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.lotNumber`).d('批次'),
      type: 'string',
    },
    {
      name: 'quantity',
      label: intl.get(`${preCode}.quantity`).d('数量'),
      type: 'number',
      required: true,
      min: 0,
    },
  ],
});

export {
  onhandQtyListDS,
  onhandQtyHeaderDS,
  itemDisassenbleSubHeaderDS,
  itemDisassenbleResultDS,
  itemDisassenbleTableSearchDS,
  itemTagSearchDS,
  itemTagTableDS,
  itemLotSearchDS,
  itemLotTableDS,
};
