/**
 * 其他出入库平台DS
 */
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

const { common, raumplusOtherWarehousing } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const preCode = 'raumplus.otherWarehousing';

// 其他出入库查询头
const queryHeadDS = () => ({
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
      name: 'transactionWayCode',
      type: 'string',
      label: intl.get(`${preCode}.model.transactionWay`).d('出入库方式'),
      lookupCode: raumplusOtherWarehousing.transactionWayName,
    },
    {
      name: 'requestOperationType',
      type: 'string',
      label: intl.get(`${preCode}.model.requestOperationType`).d('业务类型'),
      lookupCode: raumplusOtherWarehousing.requestOperationType,
    },
    {
      name: 'partyNameObj',
      type: 'object',
      label: intl.get(`${preCode}.model.partyName`).d('商务实体'),
      lovCode: raumplusOtherWarehousing.partyName,
      textField: 'partyName',
      ignore: 'always',
    },
    {
      name: 'partyNumber',
      bind: 'partyNameObj.partyNumber',
    },
    {
      name: 'invTransactionNumObj',
      type: 'object',
      label: intl.get(`${preCode}.model.invTransactionNum`).d('出入库单编号'),
      lovCode: raumplusOtherWarehousing.invTransactionNum,
      ignore: 'always',
    },
    {
      name: 'invTransactionNum',
      bind: 'invTransactionNumObj.invTransactionNum',
    },
    {
      name: 'workerNameObj',
      type: 'object',
      label: intl.get(`${preCode}.model.workerName`).d('申请人'),
      lovCode: raumplusOtherWarehousing.workerName,
      textField: 'workerName',
      ignore: 'always',
    },
    {
      name: 'workerNumber',
      bind: 'workerNameObj.workerCode',
    },
    {
      name: 'departmentNameObj',
      type: 'object',
      label: intl.get(`${preCode}.model.department`).d('部门'),
      lovCode: common.department,
      textField: 'departmentName',
      ignore: 'always',
    },
    {
      name: 'departmentCode',
      bind: 'departmentNameObj.departmentCode',
    },
    // {
    //   name: 'departmentId',
    //   bind: 'departmentNameObj.departmentId',
    // },
    {
      name: 'sourceDocNumObj',
      type: 'object',
      label: intl.get(`${preCode}.model.sourceDocNum`).d('来源单据号'),
      lovCode: raumplusOtherWarehousing.sourceDocNum,
      ignore: 'always',
    },
    {
      name: 'sourceDocNum',
      bind: 'sourceDocNumObj.sourceDocNum',
    },
    {
      name: 'status',
      type: 'string',
      label: intl.get(`${preCode}.model.statusDes`).d('状态'),
      lookupCode: raumplusOtherWarehousing.statusDes,
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.model.organization`).d('组织'),
    },
    {
      name: 'transactionWayCode',
      type: 'string',
      label: intl.get(`${preCode}.model.transactionWay`).d('出入库方式'),
      lookupCode: raumplusOtherWarehousing.transactionWayName,
    },
    {
      name: 'requestOperationType',
      type: 'string',
      label: intl.get(`${preCode}.model.requestOperationType`).d('业务类型'),
      lookupCode: raumplusOtherWarehousing.requestOperationType,
    },
    {
      name: 'partyName',
      type: 'string',
      label: intl.get(`${preCode}.model.partyName`).d('商务实体'),
    },
    {
      name: 'invTransactionNum',
      type: 'string',
      label: intl.get(`${preCode}.model.invTransactionNum`).d('出入库单编号'),
    },
    {
      name: 'workerName',
      type: 'string',
      label: intl.get(`${preCode}.model.workerName`).d('申请人'),
    },
    {
      name: 'departmentName',
      type: 'string',
      label: intl.get(`${preCode}.model.departmentName`).d('部门'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.model.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'statusDes',
      type: 'string',
      label: intl.get(`${preCode}.model.statusDes`).d('状态'),
      lookupCode: common.statusDes,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('备注'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('文件'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`,
        method: 'GET',
        data: {
          ...data,
          fileUrlFlag: 1,
        },
      };
    },
    submit: ({ data }) => {
      console.log('执行submit');
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`,
        method: 'PUT',
        data: data[0],
      };
    },
  },
});

// 其他出入库查询行
const queryLineDS = () => ({
  fields: [
    {
      name: 'transactionLineNum',
      type: 'string',
      label: intl.get(`${preCode}.model.shipLineNum`).d('行号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.model.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.model.itemDesc`).d('物料说明'),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${preCode}.model.specification`).d('规格'),
    },
    {
      name: 'applyQty',
      type: 'string',
      label: intl.get(`${preCode}.model.applyQty`).d('数量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${preCode}.model.uom`).d('单位'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.model.tagCode`).d('条码'),
    },
    {
      name: 'batchCode',
      type: 'string',
      label: intl.get(`${preCode}.model.batchCode`).d('批号'),
    },
    {
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.model.warehouseCode`).d('来源仓库'),
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.model.wmAreaCode`).d('来源货位'),
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.model.toWarehouseCode`).d('目标仓库'),
    },
    {
      name: 'toWmAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.model.toWmAreaCode`).d('目标货位'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.model.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'statusDes',
      type: 'string',
      label: intl.get(`${preCode}.model.statusDes`).d('行状态'),
    },
    {
      name: 'pickedQty',
      type: 'string',
      label: intl.get(`${preCode}.model.pickedQty`).d('已处理数量'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${preCode}.model.lineRemark`).d('备注'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('文件'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-lines/transaction-line`,
        method: 'GET',
      };
    },
    submit: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-lines`,
        method: 'PUT',
        data: data[0],
      };
    },
  },
});

// 其他出入库明细头
const detailHeadDS = () => ({
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.model.organization`).d('组织'),
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
      name: 'transactionWayCode',
      type: 'string',
      label: intl.get(`${preCode}.model.transactionWay`).d('出入库方式'),
      lookupCode: raumplusOtherWarehousing.transactionWayName,
      required: true,
    },
    {
      name: 'requestOperationType',
      type: 'string',
      label: intl.get(`${preCode}.model.requestOperationType`).d('业务类型'),
      lookupCode: raumplusOtherWarehousing.requestOperationType,
      required: true,
    },
    {
      name: 'partyNameObj',
      type: 'object',
      label: intl.get(`${preCode}.model.partyName`).d('商务实体'),
      lovCode: raumplusOtherWarehousing.partyName,
      ignore: 'always',
    },
    {
      name: 'partyName',
      bind: 'partyNameObj.partyName',
    },
    {
      name: 'partyNumber',
      bind: 'partyNameObj.partyNumber',
    },
    {
      name: 'invTransactionNum',
      type: 'string',
      label: intl.get(`${preCode}.model.invTransactionNum`).d('出入库单编号'),
    },
    {
      name: 'workerNameObj',
      type: 'object',
      label: intl.get(`${preCode}.model.workerName`).d('申请人'),
      lovCode: raumplusOtherWarehousing.workerName,
      ignore: 'always',
    },
    {
      name: 'workerName',
      bind: 'workerNameObj.workerName',
    },
    {
      name: 'workerNumber',
      bind: 'workerNameObj.workerCode',
    },
    {
      name: 'departmentNameObj',
      type: 'object',
      label: intl.get(`${preCode}.model.department`).d('部门'),
      lovCode: common.department,
      textField: 'departmentName',
      required: true,
      ignore: 'always',
    },
    {
      name: 'departmentCode',
      bind: 'departmentNameObj.departmentCode',
    },
    {
      name: 'departmentId',
      bind: 'departmentNameObj.departmentId',
    },
    {
      name: 'departmentName',
      bind: 'departmentNameObj.departmentName',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.model.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'warehouseCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.warehouseCode`).d('来源仓库'),
      lovCode: raumplusOtherWarehousing.warehouseCode,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseCodeObj.warehouseCode',
    },
    {
      name: 'warehouseId',
      bind: 'warehouseCodeObj.warehouseId',
    },
    {
      name: 'wmAreaCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmAreaCode`).d('来源货位'),
      lovCode: raumplusOtherWarehousing.wmAreaCode,
      cascadeMap: { warehouseId: 'warehouseCodeObj.warehouseId' },
      ignore: 'always',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaCodeObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaCodeObj.wmAreaId',
    },
    {
      name: 'toWarehouseCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.toWarehouseCode`).d('目标仓库'),
      lovCode: raumplusOtherWarehousing.toWarehouseCode,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'toWarehouseCode',
      bind: 'toWarehouseCodeObj.warehouseCode',
    },
    {
      name: 'warehouseId',
      bind: 'toWarehouseCodeObj.warehouseId',
    },
    {
      name: 'toWmAreaCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.toWmAreaCode`).d('目标货位'),
      lovCode: raumplusOtherWarehousing.toWmAreaCode,
      textField: 'wmAreaName',
      cascadeMap: { warehouseId: 'toWarehouseCodeObj.warehouseId' },
      ignore: 'always',
    },
    {
      name: 'toWmAreaCode',
      bind: 'toWmAreaCodeObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      bind: 'toWmAreaCodeObj.wmAreaId',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('备注'),
    },
    {
      name: 'status',
      type: 'string',
      label: intl.get(`${preCode}.model.statusDes`).d('状态'),
      lookupCode: raumplusOtherWarehousing.statusDes,
      defaultValue: 'NEW',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { invTransactionId } = data;
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers/${invTransactionId}`,
        // url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`,
        method: 'GET',
        data: {
          ...data,
          fileUrlFlag: 1,
          invTransactionId,
        },
      };
    },
    create: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`,
        method: 'POST',
        data: data[0],
      };
    },
    update: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`,
        method: 'PUT',
        data: data[0],
      };
    },
  },
});

// 其他出入库明细行
const detailLineDS = () => ({
  pageSize: 20,
  fields: [
    {
      name: 'transactionLineNum',
      type: 'string',
      label: intl.get(`${preCode}.model.shipLineNum`).d('行号'),
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
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.model.itemDesc`).d('物料说明'),
      bind: 'itemCodeObj.description',
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${preCode}.model.specification`).d('规格'),
      bind: 'itemCodeObj.specification',
    },
    {
      name: 'itemControlType',
      bind: 'itemCodeObj.itemControlType',
    },
    {
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${preCode}.model.applyQty`).d('数量'),
      required: true,
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.uom`).d('单位'),
      lovCode: common.uom,
      ignore: 'always',
    },
    {
      name: 'uomId',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      bind: 'uomObj.uomName',
      ignore: 'always',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.model.tagCode`).d('条码'),
    },
    {
      name: 'batchCode',
      type: 'string',
      label: intl.get(`${preCode}.model.batchCode`).d('批号'),
    },
    {
      name: 'warehouseCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.warehouseCode`).d('来源仓库'),
      lovCode: raumplusOtherWarehousing.warehouseCode,
      ignore: 'always',
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('transactionWayCode') === 'OUT') {
            return record.get('wmCategoryCode') !== '42';
          }
          return false;
        },
      },
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseCodeObj.warehouseCode',
    },
    {
      name: 'warehouseId',
      bind: 'warehouseCodeObj.warehouseId',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseCodeObj.warehouseName',
    },
    {
      name: 'wmAreaCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmAreaCode`).d('来源货位'),
      lovCode: raumplusOtherWarehousing.wmAreaCode,
      cascadeMap: { warehouseId: 'warehouseCodeObj.warehouseId' },
      ignore: 'always',
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('transactionWayCode') === 'OUT') {
            return record.get('wmCategoryCode') !== '42';
          }
          return false;
        },
      },
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaCodeObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaCodeObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaCodeObj.wmAreaName',
    },
    {
      name: 'toWarehouseCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.toWarehouseCode`).d('目标仓库'),
      lovCode: raumplusOtherWarehousing.toWarehouseCode,
      ignore: 'always',
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('transactionWayCode') === 'IN') {
            return record.get('wmCategoryCode') !== '42';
          }
          return false;
        },
      },
    },
    {
      name: 'toWarehouseCode',
      bind: 'toWarehouseCodeObj.warehouseCode',
    },
    {
      name: 'toWarehouseId',
      bind: 'toWarehouseCodeObj.warehouseId',
    },
    {
      name: 'toWarehouseName',
      bind: 'toWarehouseCodeObj.warehouseName',
    },
    {
      name: 'toWmAreaCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.model.toWmAreaCode`).d('目标货位'),
      lovCode: raumplusOtherWarehousing.toWmAreaCode,
      textField: 'wmAreaName',
      cascadeMap: { warehouseId: 'toWarehouseCodeObj.warehouseId' },
      ignore: 'always',
    },
    {
      name: 'toWmAreaCode',
      bind: 'toWmAreaCodeObj.wmAreaCode',
    },
    {
      name: 'toWmAreaId',
      bind: 'toWmAreaCodeObj.wmAreaId',
    },
    {
      name: 'toWmAreaName',
      bind: 'toWmAreaCodeObj.wmAreaName',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.model.sourceDocNum`).d('来源单据号'),
      dynamicProps: {
        required: ({ record }) => {
          return record.get('wmCategoryCode') === '42';
        },
      },
    },
    {
      name: 'status',
      type: 'string',
      label: intl.get(`${preCode}.model.statusDes`).d('行状态'),
      lookupCode: raumplusOtherWarehousing.statusDes,
      defaultValue: 'NEW',
    },
    {
      name: 'transactionLineStatus',
      type: 'string',
      defaultValue: 'NEW',
    },
    {
      name: 'pickedQty',
      type: 'string',
      label: intl.get(`${preCode}.model.pickedQty`).d('已处理数量'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('备注'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('文件'),
    },
  ],
  transport: {
    destroy: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-lines/batch-remove`,
        method: 'DELETE',
        data,
      };
    },
    update: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-lines/batchUpdate`,
        method: 'PUT',
        data,
      };
    },
  },
});

export { queryHeadDS, queryLineDS, detailHeadDS, detailLineDS };
