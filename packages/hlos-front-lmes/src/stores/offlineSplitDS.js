/**
 * @Description: 线下拆板-DS
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 11:28:08
 * @LastEditors: leying.yan
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const commonCode = 'lmes.common.model';

const LoginDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'workerObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      lovCode: common.worker,
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
      name: 'fileUrl',
      bind: 'workerObj.fileUrl',
    },
    {
      name: 'inspectionDocNum',
      type: 'string',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
      required: true,
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
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
      lovCode: 'LMDS.WM_AREA',
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
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
  ],
});

const QueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'snCode',
      type: 'string',
      required: true,
      // defaultValue: 'TAG202102010010'
    },
    {
      name: 'bomObj',
      type: 'object',
      lovCode: 'LMDS.ITEM_BOM',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemId: record.get('itemId'),
          bomType: 'SPLIT',
        }),
      },
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'bomObj.bomId',
    },
    {
      name: 'bomVersion',
      type: 'string',
      bind: 'bomObj.bomVersion',
    },
    {
      name: 'addItemObj',
      type: 'object',
      noCache: true,
      lovCode: common.item,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'addItemId',
      type: 'string',
      bind: 'addItemObj.itemId',
    },
    {
      name: 'addItemCode',
      type: 'string',
      bind: 'addItemObj.itemCode',
    },
    {
      name: 'addItemDescription',
      type: 'string',
      bind: 'addItemObj.description',
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'addItemObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'addItemObj.uom',
    },
    {
      name: 'itemId',
      type: 'string',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'itemDescription',
      type: 'string',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
      ignore: 'always',
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
      lovCode: 'LMDS.WM_AREA',
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
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
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      // required: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
    },
  ],
});

export { LoginDS, QueryDS };
