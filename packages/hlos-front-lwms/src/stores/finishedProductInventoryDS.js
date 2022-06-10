/**
 * @Description: 产成品入库 - ds
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-09-21 14:21:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const commonCode = 'lwms.common.model';
const preCode = 'lwms.finishedProductInventory.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys/item-quantity`;

const HeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'inventoryWorkerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'inventoryWorker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'meOuCode',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'meOuName',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'remark',
    },
    {
      name: 'inventoryRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryRule`).d('入库规则'),
      lovCode: common.rule,
      ignore: 'always',
      lovPara: {
        ruleType: 'INVENTORY',
      },
    },
    {
      name: 'inventoryRuleId',
      bind: 'inventoryRuleObj.ruleId',
    },
    {
      name: 'productionWmRule',
      bind: 'inventoryRuleObj.ruleJson',
    },
    {
      name: 'inventoryRuleName',
      bind: 'inventoryRuleObj.ruleName',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('warehouseObj', null);
        record.set('wmAreaObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

const QueryDS = () => ({
  autoCreate: true,
  paging: false,
  page: -1,
  queryFields: [
    {
      name: 'organizationId',
    },
    {
      name: 'prodLineWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLineWarehouse`).d('线边仓'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          setCategoryProd: 'Y',
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
    },
    {
      name: 'warehouseId',
      bind: 'prodLineWarehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'prodLineWarehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      bind: 'prodLineWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'prodLineWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLineWmArea`).d('线边仓货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      bind: 'prodLineWmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'prodLineWmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'prodLineWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
      ignore: 'always',
    },
    {
      name: 'qcStatus',
      type: 'string',
      lookupCode: 'LWMS.TAG_QC_STATUS',
      multiple: true,
      label: intl.get(`${preCode}.status`).d('状态'),
      defaultValue: ['OK'],
      ignore: 'always',
    },
    {
      name: 'lotStatus',
      type: 'string',
      lookupCode: 'LWMS.LOT_QC_STATUS',
      multiple: true,
      label: intl.get(`${preCode}.status`).d('状态'),
      defaultValue: ['OK'],
      ignore: 'always',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { itemId } = data;
      return {
        url: generateUrlWithGetParam(url, {
          itemId,
        }),
        data: {
          ...data,
          itemId: undefined,
        },
        method: 'GET',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'prodLineWarehouseObj') {
        record.set('prodLineWmAreaObj', null);
      }
    },
  },
});

export { HeaderDS, QueryDS };
