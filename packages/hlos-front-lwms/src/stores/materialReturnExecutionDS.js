/**
 * @Description: 退料执行--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:47:41
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const preCode = 'lwms.materialReturnExecuteion.model';
const commonCode = 'lwms.common.model';

const QueryDS = () => {
  return {
    selection: false,
    autoCreate: true,
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
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.executeWarehouse`).d('执行仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        clearButton: false,
        required: true,
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
        ignore: 'always',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.executeWmArea`).d('执行货位'),
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
        ignore: 'always',
      },
      {
        name: 'documentTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.documentType`).d('单据类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'WM_RETURNED' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'wmReturnTypeId',
        type: 'string',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'wmReturnTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'documentTypeName',
        type: 'string',
        bind: 'documentTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'toWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        required: true,
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
        name: 'toWarehouseCode',
        type: 'string',
        bind: 'toWarehouseObj.warehouseCode',
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
        label: intl.get(`${preCode}.toWmArea`).d('目标货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('toWarehouseId'),
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
        ignore: 'always',
      },
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${preCode}.document`).d('单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            documentClass: 'MO',
          }),
        },
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moObj.documentId',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moObj.documentNum',
      },
      {
        name: 'returnReason',
        type: 'string',
        label: intl.get(`${preCode}.returnReason`).d('退料原因'),
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        ignore: 'always',
        lovCode: common.item,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            itemControl: 'QUANTITY',
          }),
        },
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
        ignore: 'always',
      },
      {
        name: 'inputNum',
        ignore: 'always',
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'organizationObj') {
          record.set('moObj', null);
          record.set('itemObj', null);
          record.set('warehouseObj', null);
          record.set('toWarehouseObj', null);
        }
        if (name === 'warehouseObj') {
          record.set('wmAreaObj', null);
        }
        if (name === 'toWarehouseObj') {
          record.set('toWmAreaObj', null);
        }
      },
    },
  };
};
const queryDS = new DataSet(QueryDS());

export { queryDS };
