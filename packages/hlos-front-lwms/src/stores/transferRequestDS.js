/*
 * @Description: 转移单平台 DataSet
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-06 13:59:38
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { codeValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { DataSet } from 'choerodon-ui/pro';
// import { toJS } from 'mobx';

const { lwmsTransferRequest, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lwms.transferRequestPlatform.model';
const commonIntlPrefix = 'lwms.common.model';
const listUrl = `${HLOS_LWMS}/v1/${organizationId}/request-headers/transfer`;

const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/request-lines/platform`;

// common fields of queryFields and fields
const getCommonFields = (isQueryFields) => [
  {
    name: 'organizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${commonIntlPrefix}.org`).d('组织'),
    lovCode: common.organization,
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
    ignore: 'always',
    bind: 'organizationObj.organizationName',
  },
  {
    name: 'transferRequestNumObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: lwmsTransferRequest.transferRequestNum,
    label: intl.get(`${intlPrefix}.transferRequestNum`).d('转移单号'),
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'requestNum',
    type: 'string',
    ignore: 'always',
    bind: 'transferRequestNumObj.requestNum',
  },
  {
    name: 'requestId',
    type: 'string',
    bind: 'transferRequestNumObj.requestId',
  },
  {
    name: 'warehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
  },
  {
    name: 'warehouseId',
    type: 'string',
    bind: 'warehouseObj.warehouseId',
  },
  {
    name: 'warehouseName',
    type: 'string',
    ignore: 'always',
    bind: 'warehouseObj.warehouseName',
  },
  {
    name: 'requestStatusList',
    type: 'string',
    multiple: true,
    defaultValue: isQueryFields ? ['NEW', 'RELEASED', 'PICKED', 'EXECUTED'] : [],
    lookupCode: lwmsTransferRequest.transferRequestStatus,
    label: intl.get(`${intlPrefix}.transferRequestStatus`).d('转移单状态'),
  },
  {
    name: 'toOrganizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.organization,
    label: intl.get(`${intlPrefix}.toOrganization`).d('目标组织'),
  },
  {
    name: 'toOrganizationId',
    type: 'string',
    bind: 'toOrganizationObj.organizationId',
  },
  {
    name: 'toOrganizationCode',
    type: 'string',
    bind: 'toOrganizationObj.organizationCode',
  },
  {
    name: 'toOrganizationName',
    type: 'string',
    ignore: 'always',
    bind: 'toOrganizationObj.organizationName',
  },
  {
    name: 'toWarehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    label: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
    cascadeMap: { organizationId: 'toOrganizationId' },
  },
  {
    name: 'toWarehouseId',
    type: 'string',
    bind: 'toWarehouseObj.warehouseId',
  },
  {
    name: 'toWarehouseName',
    type: 'string',
    ignore: 'always',
    bind: 'toWarehouseObj.warehouseName',
  },
  {
    name: 'itemObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.item,
    label: intl.get(`${commonIntlPrefix}.item`).d('物料'),
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
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
    name: 'requestTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.documentType,
    label: intl.get(`${intlPrefix}.transferRequestType`).d('转移单类型'),
    lovPara: {
      documentClass: 'WM_TRANSFER',
    },
  },
  {
    name: 'requestTypeId',
    type: 'string',
    bind: 'requestTypeObj.documentTypeId',
  },
  {
    name: 'requestTypeCode',
    type: 'string',
    ignore: 'always',
    bind: 'requestTypeObj.documentTypeCode',
  },
  {
    name: 'requestTypeName',
    type: 'string',
    ignore: 'always',
    bind: 'requestTypeObj.documentTypeName',
  },
  {
    name: 'wmMoveTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.wmMoveType,
    label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
    lovPara: {
      wmMoveClass: 'TRANSFER',
    },
  },
  {
    name: 'wmMoveTypeName',
    type: 'string',
    ignore: 'always',
    bind: 'wmMoveTypeObj.moveTypeName',
  },
  {
    name: 'wmMoveTypeId',
    type: 'string',
    bind: 'wmMoveTypeObj.moveTypeId',
  },
  {
    name: 'creatorObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.worker,
    label: intl.get(`${intlPrefix}.creator`).d('制单员工'),
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'creatorId',
    type: 'string',
    bind: 'creatorObj.workerId',
  },
  {
    name: 'creator',
    type: 'string',
    ignore: 'always',
    bind: 'creatorObj.workerName',
  },
  {
    name: 'startCreationDate',
    type: 'date',
    label: intl.get(`${intlPrefix}.greaterThanCreationDate`).d('制单时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('endCreationDate')) {
          return 'endCreationDate';
        }
      },
    },
  },
  {
    name: 'endCreationDate',
    type: 'date',
    label: intl.get(`${intlPrefix}.lessThanCreationDate`).d('制单时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('startCreationDate')) {
          return 'startCreationDate';
        }
      },
    },
  },
];

// 转移单头表DS
const transferRequestPlatformDS = () => ({
  autoQuery: false,
  queryFields: getCommonFields(true),
  fields: [
    ...getCommonFields(),
    // 以下几个为按需求的拼接字段，仅作展示
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.org`).d('组织'),
    },
    {
      name: 'toOrganization',
      type: 'string',
      label: intl.get(`${intlPrefix}.toOrganization`).d('目标组织'),
    },
    {
      name: 'warehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
    },
    {
      name: 'toWarehouse',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
    },
    {
      name: 'wmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
    },
    {
      name: 'toWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
    },
    {
      name: 'requestStatus',
      type: 'string',
      lookupCode: lwmsTransferRequest.transferRequestStatus,
      label: intl.get(`${intlPrefix}.transferRequestStatus`).d('转移单状态'),
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.model.wmArea`).d('发出货位'),
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
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.toWmArea`).d('目标货位'),
    },
    {
      name: 'toWmAreaId',
      type: 'string',
      bind: 'toWmArea.wmAreaId',
    },
    {
      name: 'toWmAreaName',
      type: 'string',
      bind: 'toWmArea.wmAreaName',
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.creationDate`).d('制单时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'approvalRule',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.approvalRule`).d('审批策略'),
    },
    {
      name: 'approvalWorkflow',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.approvalWorkflow`).d('审批工作流'),
    },
    {
      name: 'requestGroup',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.approvalWorkflow`).d('转移单组'),
    },
    {
      name: 'printedFlag',
      type: 'boolean',
      label: intl.get(`${commonIntlPrefix}.printedFlag`).d('打印标识'),
    },
    {
      name: 'printedDate',
      type: 'dateTime',
      label: intl.get(`${commonIntlPrefix}.printedDate`).d('打印时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'executedWorker',
      type: 'string',
      label: intl.get(`${intlPrefix}.executedWorker`).d('执行员工'),
    },
    {
      name: 'executedTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.executedTime`).d('执行时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'docProcessRule',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.docProcessRule`).d('单据处理规则'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.remark`).d('备注'),
    },
    {
      name: 'externalRequestType',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.externalRequestType`).d('外部类型'),
    },
    {
      name: 'externalId',
      type: 'number',
      step: 1,
      label: intl.get(`${commonIntlPrefix}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalNum`).d('外部单据号'),
    },
  ],
  events: {
    update({ record, name }) {
      if (name === 'toOrganizationObj') {
        record.set('toWarehouseObj', null);
      }
    },
  },
  transport: {
    read: (config) => {
      return {
        ...config,
        url: listUrl,
        method: 'GET',
        paramsSerializer: (params) => {
          const tmpParams = filterNullValueObject(params);
          const queryParams = new URLSearchParams();
          Object.keys(tmpParams).forEach((key) => {
            queryParams.append(key, tmpParams[key]);
          });
          queryParams.append('requestOperationType', 'TRANSFER');
          return queryParams.toString();
        },
      };
    },
  },
});

// 转移单行 DS
const transferRequestLineDS = () => ({
  pageSize: 100,
  fields: [
    {
      name: 'requestLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineNum`).d('行号'),
    },
    {
      name: 'itemObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.item,
      required: true,
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          const { parent: parentDs } = dataSet;
          const orgId = parentDs && parentDs.current && parentDs.current.get('organizationId');
          return orgId ? { organizationId: orgId } : {};
        },
      },
      label: intl.get(`${commonIntlPrefix}.item`).d('物料'),
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
      name: 'itemDescription',
      type: 'string',
      bind: 'itemObj.description',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemUomId',
      type: 'string',
      bind: 'itemObj.uomId',
      ignore: 'always',
    },
    {
      name: 'itemUomCode',
      type: 'string',
      bind: 'itemObj.uom',
      ignore: 'always',
    },
    {
      name: 'itemUomName',
      type: 'string',
      bind: 'itemObj.uomName',
      ignore: 'always',
    },
    {
      name: 'uomObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      required: true,
      lovCode: common.uom,
      // textField: 'uomName',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uomCode',
      type: 'string',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'uomObj.uomName',
    },
    {
      name: 'applyQty',
      type: 'number',
      required: true,
      min: 1,
      label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
    },
    {
      name: 'availableQty',
      type: 'number',
      defaultValue: 0,
      label: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
    },
    {
      name: 'onhandQty',
      type: 'number',
      defaultValue: 0,
      label: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
    },
    {
      name: 'requestLineStatus',
      type: 'string',
      lookupCode: common.requestLineStatus,
      label: intl.get(`${intlPrefix}.lineStatus`).d('行状态'),
    },
    {
      name: 'wmMoveTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmMoveType,
      label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      lovPara: {
        wmMoveClass: 'TRANSFER',
      },
    },
    {
      name: 'wmMoveTypeId',
      type: 'string',
      bind: 'wmMoveTypeObj.moveTypeId',
    },
    {
      name: 'wmMoveTypeCode',
      type: 'string',
      bind: 'wmMoveTypeObj.moveTypeCode',
    },
    {
      name: 'wmMoveTypeName',
      type: 'string',
      bind: 'wmMoveTypeObj.moveTypeName',
    },
    {
      name: 'warehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      required: true,
      dynamicProps: {
        lovPara: ({ dataSet: { parent } }) => {
          if (parent) {
            return {
              organizationId: parent.current && parent.current.get('organizationId'),
            };
          }
        },
      },
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
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
      name: 'wmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'warehouseId' },
      label: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
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
      name: 'locationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.location,
      label: intl.get(`${intlPrefix}.location`).d('发出地点'),
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
    },
    {
      name: 'toWarehouse',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      noCache: true,
      required: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          const { parent } = dataSet;
          const { current } = parent || {};
          if (current) {
            const orgId = current.get('toOrganizationId');
            return {
              organizationId: orgId,
            };
          }
        },
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
    },
    {
      name: 'toWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'toWarehouseId' },
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'toLocationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.location,
      label: intl.get(`${intlPrefix}.toLocation`).d('目标地点'),
    },
    {
      name: 'toLocationId',
      type: 'string',
      bind: 'toLocationObj.locationId',
    },
    {
      name: 'toLocationCode',
      type: 'string',
      bind: 'toLocationObj.locationCode',
    },
    {
      name: 'toLocationName',
      type: 'string',
      bind: 'toLocationObj.locationName',
    },
    {
      name: 'viaWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.viaWarehouse`).d('中转仓库'),
    },
    {
      name: 'viaWarehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.viaWarehouse`).d('中转仓库'),
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          const { parent: parentDs } = dataSet;
          const orgId = parentDs && parentDs.current && parentDs.current.get('organizationId');
          return orgId ? { organizationId: orgId } : {};
        },
      },
    },
    {
      name: 'viaWarehouseId',
      type: 'string',
      bind: 'viaWarehouseObj.warehouseId',
    },
    {
      name: 'viaWarehouseCode',
      type: 'string',
      bind: 'viaWarehouseObj.warehouseCode',
    },
    {
      name: 'viaWarehouseName',
      type: 'string',
      bind: 'viaWarehouseObj.warehouseName',
    },
    {
      name: 'viaWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.viaWMArea`).d('中转货位'),
    },
    {
      name: 'viaWmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'viaWarehouseId' },
      label: intl.get(`${intlPrefix}.viaWMArea`).d('中转货位'),
    },
    {
      name: 'viaWmAreaId',
      type: 'string',
      bind: 'viaWmAreaObj.wmAreaId',
    },
    {
      name: 'viaWmAreaCode',
      type: 'string',
      bind: 'viaWmAreaObj.wmAreaCode',
    },
    {
      name: 'viaWmAreaName',
      type: 'string',
      bind: 'viaWmAreaObj.wmAreaName',
    },
    {
      name: 'viaLocationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.location,
      label: intl.get(`${intlPrefix}.viaLocation`).d('中转地点'),
    },
    {
      name: 'viaLocationId',
      type: 'string',
      bind: 'viaLocationObj.locationId',
    },
    {
      name: 'viaLocationCode',
      type: 'string',
      bind: 'viaLocationObj.locationCode',
    },
    {
      name: 'viaLocationName',
      type: 'string',
      bind: 'viaLocationObj.locationName',
    },
    {
      name: 'itemControlTypeMeaning',
      type: 'string',
      // lookupCode: common.itemControlType,
      label: intl.get(`${commonIntlPrefix}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'applyPackQty',
      type: 'number',
      min: 1,
      step: 1,
      label: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
    },
    {
      name: 'applyWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
    },
    {
      name: 'secondUomObj',
      type: 'object',
      noCache: true,
      lovCode: common.uom,
      ignore: 'always',
      cascadeMap: { uomId: 'uomId' },
      label: intl.get(`${commonIntlPrefix}.secondUOM`).d('辅助单位'),
    },
    {
      name: 'secondUomId',
      type: 'string',
      bind: 'secondUomObj.uomId',
    },
    {
      name: 'secondUomCode',
      type: 'string',
      bind: 'secondUomObj.uomCode',
    },
    {
      name: 'secondUom',
      type: 'string',
      bind: 'secondUomObj.uomName',
    },
    {
      name: 'secondApplyQty',
      type: 'string',
      cascadeMap: { _: 'secondUom' },
      label: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
      dynamicProps: {
        disabled: ({ record }) => {
          if (record.get('secondUomId')) {
            return false;
          }
          return true;
        },
        required: ({ record }) => {
          if (record.get('secondUomId')) {
            return true;
          }
          return false;
        },
      },
    },
    {
      name: 'sourceDocTypeObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.documentType,
      label: intl.get(`${commonIntlPrefix}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceDocTypeId',
      type: 'string',
      bind: 'sourceDocTypeObj.documentTypeId',
    },
    {
      name: 'sourceDocTypeCode',
      type: 'string',
      bind: 'sourceDocTypeObj.documentTypeCode',
    },
    {
      name: 'sourceDocTypeName',
      type: 'string',
      bind: 'sourceDocTypeObj.documentTypeName',
    },
    {
      name: 'sourceDocNumObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.document,
      cascadeMap: { sourceDocTypeId: 'sourceDocTypeId' },
      label: intl.get(`${commonIntlPrefix}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocNumObj.documentId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceDocNumObj.documentNum',
    },
    {
      name: 'sourceDocLineNumObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.documentLine,
      cascadeMap: { sourceDocNum: 'sourceDocNum' },
      label: intl.get(`${commonIntlPrefix}.sourceDocLineNum`).d('来源单据行号'),
    },
    {
      name: 'sourceDocLineId',
      type: 'string',
      bind: 'sourceDocLineNumObj.documentLineId',
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      bind: 'sourceDocLineNumObj.documentLineNum',
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.lineRemark`).d('行备注'),
    },
    {
      name: 'externalId',
      type: 'string',
      step: 1,
      label: intl.get(`${commonIntlPrefix}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.externalNum`).d('外部单据号'),
      validator: (value) => {
        // const reg = /^[1-9]+[0-9]*$/;
        const reg = /^[a-zA-Z0-9]+$/;
        if (value && !value.match(reg)) {
          return '只可输入字母、正整数!';
        }
      },
    },
    {
      name: 'externalLineId',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${commonIntlPrefix}.externalLineID`).d('外部行ID'),
    },
    {
      name: 'externalLineNum',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.externalLineNum`).d('外部单据行号'),
    },
    {
      name: 'pickedFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.pickedFlag`).d('拣料标识'),
    },
    {
      name: 'pickedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.pickedQty`).d('拣料数量'),
    },
    {
      name: 'executedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.executedQty`).d('发出数量'),
    },
    {
      name: 'confirmedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.confirmedQty`).d('接收数量'),
    },
    {
      name: 'pickedWorkerObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.pickedWorker`).d('拣料员工'),
    },
    {
      name: 'pickedWorkerId',
      type: 'string',
      bind: 'pickedWorkerObj.workerId',
    },
    {
      name: 'pickedWorkerCode',
      type: 'string',
      bind: 'pickedWorkerObj.workerCode',
    },
    {
      name: 'pickedWorker',
      type: 'string',
      bind: 'pickedWorkerObj.workerName',
    },
    {
      name: 'pickRuleObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.rule,
      textField: 'ruleName',
      label: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
      lovPara: {
        ruleType: 'PICK',
      },
    },
    {
      name: 'pickRuleId',
      type: 'string',
      bind: 'pickRuleObj.ruleId',
    },
    {
      name: 'pickRule',
      type: 'string',
      bind: 'pickRuleObj.ruleJson',
    },
    {
      name: 'pickRuleCode',
      type: 'string',
      bind: 'pickRuleObj.ruleCode',
    },
    {
      name: 'pickRuleName',
      type: 'string',
      bind: 'pickRuleObj.ruleName',
    },
    {
      name: 'reservationRuleObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.rule,
      textField: 'ruleName',
      label: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
      lovPara: {
        ruleType: 'RESERVATION',
      },
    },
    {
      name: 'reservationRuleId',
      type: 'string',
      bind: 'reservationRuleObj.ruleId',
    },
    {
      name: 'reservationRule',
      type: 'string',
      bind: 'reservationRuleObj.ruleJson',
    },
    {
      name: 'reservationRuleCode',
      type: 'string',
      bind: 'reservationRuleObj.ruleCode',
    },
    {
      name: 'reservationRuleName',
      type: 'string',
      bind: 'reservationRuleObj.ruleName',
    },
    {
      name: 'fifoRuleObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.rule,
      textField: 'ruleName',
      label: intl.get(`${intlPrefix}.fifoRule`).d('FIFO规则'),
      lovPara: {
        ruleType: 'FIFO',
      },
    },
    {
      name: 'fifoRuleId',
      type: 'string',
      bind: 'fifoRuleObj.ruleId',
    },
    {
      name: 'fifoRule',
      type: 'string',
      bind: 'fifoRuleObj.ruleJson',
    },
    {
      name: 'fifoRuleCode',
      type: 'string',
      bind: 'fifoRuleObj.ruleCode',
    },
    {
      name: 'fifoRuleName',
      type: 'string',
      bind: 'fifoRuleObj.ruleName',
    },
    {
      name: 'wmInspectRuleObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.rule,
      textField: 'ruleName',
      label: intl.get(`${commonIntlPrefix}.wmInspectRule`).d('仓库质检规则'),
      lovPara: {
        ruleType: 'WM_INSPECT',
      },
    },
    {
      name: 'wmInspectRuleId',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleId',
    },
    {
      name: 'wmInspectRuleCode',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleCode',
    },
    {
      name: 'wmInspectRule',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleJson',
    },
    {
      name: 'wmInspectRuleName',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleName',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tag`).d('指定标签'),
    },
  ],
  transport: {
    read: ({ params }) => ({
      url: lineUrl,
      method: 'GET',
      params: {
        ...params,
        requestOperationType: 'TRANSFER',
      },
    }),
  },
  events: {
    update({ record, name, value, dataSet }) {
      // 物料变更清空该行其他字段
      if (name === 'itemObj') {
        const initData = {};
        let withoutChangeFields = [];
        // // 过滤首次选择
        // if (oldValue) {
        withoutChangeFields = ['requestLineNum', 'requestLineStatus', 'itemObj'];
        // }
        // 物料带出单位，拣料规则，拣料规则，FIFO规则
        const {
          uom,
          uomName,
          uomId,
          secondUom,
          secondUomId,
          secondUomName,
          pickRuleName,
          pickRuleId,
          reservationRuleName,
          reservationRuleId,
          fifoRuleName,
          fifoRuleId,
        } = value || {};
        withoutChangeFields.forEach((f) => {
          initData[f] = record.get(f);
        });
        if (uomId) {
          initData.uomObj = { uomName, uomId, uomCode: uom };
        }
        if (secondUomId) {
          initData.secondUomObj = {
            uomId: secondUomId,
            uomCode: secondUom,
            uomName: secondUomName,
          };
        }
        if (pickRuleId) {
          initData.pickRuleObj = { ruleId: pickRuleId, ruleName: pickRuleName };
        }
        if (reservationRuleId) {
          initData.reservationRuleObj = {
            ruleId: reservationRuleId,
            ruleName: reservationRuleName,
          };
        }
        if (fifoRuleId) {
          initData.fifoRuleObj = { ruleId: fifoRuleId, ruleName: fifoRuleName };
        }
        if (record.dirty) {
          // eslint-disable-next-line no-param-reassign
          record.data = {
            // ...toJS(record.pristineData),
            itemObj: value,
            ...initData,
          };
          // eslint-disable-next-line no-param-reassign
          record.memo = undefined;
        }
        const { parent: parentDs } = dataSet;
        const warehouseObj = parentDs && parentDs.current && parentDs.current.get('warehouseObj');
        if (warehouseObj && warehouseObj.warehouseId) {
          record.set('warehouseObj', {
            warehouseId: warehouseObj && warehouseObj.warehouseId,
            warehouseCode: warehouseObj && warehouseObj.warehouseCode,
            warehouseName: warehouseObj && warehouseObj.warehouseName,
          });
        }
        const wmAreaObj = parentDs && parentDs.current && parentDs.current.get('wmAreaObj');
        if (wmAreaObj && wmAreaObj.wmAreaId) {
          record.set('wmAreaObj', {
            wmAreaId: wmAreaObj && wmAreaObj.wmAreaId,
            wmAreaCode: wmAreaObj && wmAreaObj.wmAreaCode,
            wmAreaName: wmAreaObj && wmAreaObj.wmAreaName,
          });
        }
        const toWarehouseObj =
          parentDs && parentDs.current && parentDs.current.get('toWarehouseObj');
        if (toWarehouseObj && toWarehouseObj.warehouseId) {
          record.set('toWarehouseObj', {
            warehouseId: toWarehouseObj && toWarehouseObj.warehouseId,
            warehouseCode: toWarehouseObj && toWarehouseObj.warehouseCode,
            warehouseName: toWarehouseObj && toWarehouseObj.warehouseName,
          });
        }
        const toWmAreaObj = parentDs && parentDs.current && parentDs.current.get('toWmAreaObj');
        if (toWmAreaObj && toWmAreaObj.wmAreaId) {
          record.set('toWmAreaObj', {
            wmAreaId: toWmAreaObj && toWmAreaObj.wmAreaId,
            wmAreaCode: toWmAreaObj && toWmAreaObj.wmAreaCode,
            wmAreaName: toWmAreaObj && toWmAreaObj.wmAreaName,
          });
        }
      } else if (name === 'wmMoveTypeObj') {
        const {
          warehouseName,
          warehouseId,
          wmAreaName,
          wmAreaId,
          locationName,
          locationId,
          toWarehouseName,
          toWarehouseId,
          toWmAreaName,
          toWmAreaId,
          toLocationName,
          toLocationId,
          viaWarehouseName,
          viaWarehouseId,
          viaWmAreaName,
          viaWmAreaId,
          viaLocationName,
          viaLocationId,
        } = value || {};
        record.set('warehouseObj', warehouseId ? { warehouseName, warehouseId } : null);
        record.set('wmAreaObj', wmAreaId ? { wmAreaName, wmAreaId } : null);
        record.set('locationObj', locationId ? { locationName, locationId } : null);
        record.set('toWarehouseObj', toWarehouseId ? { toWarehouseName, toWarehouseId } : null);
        record.set('toWmAreaObj', toWmAreaId ? { toWmAreaName, toWmAreaId } : null);
        record.set('toLocationObj', toLocationId ? { toLocationName, toLocationId } : null);
        record.set('viaWarehouseObj', viaWarehouseId ? { viaWarehouseName, viaWarehouseId } : null);
        record.set('viaWmAreaObj', viaWmAreaId ? { viaWmAreaName, viaWmAreaId } : null);
        record.set('viaLocationObj', viaLocationId ? { viaLocationName, viaLocationId } : null);
      } else if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      } else if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      } else if (name === 'sourceDocTypeObj') {
        record.set('sourceDocNum', null);
        record.set('sourceDocLineNum', null);
      } else if (name === 'sourceDocNum') {
        record.set('sourceDocLineNum', null);
      } else if (name === 'secondUomObj') {
        record.set('secondApplyQty', null);
      } else if (name === 'viaWarehouseObj') {
        record.set('viaWmAreaObj', null);
      }
    },
  },
});

// 创建转移单
const createTransferRequestPlatformDS = () => ({
  children: {
    requestLineList: new DataSet(transferRequestLineDS()),
  },
  autoCreate: true,
  primaryKey: 'transferRequestNum',
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${commonIntlPrefix}.org`).d('组织'),
      lovCode: common.organization,
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
      ignore: 'always',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'requestTypeObj',
      type: 'object',
      noCache: true,
      required: true,
      ignore: 'always',
      lovCode: common.documentType,
      label: intl.get(`${intlPrefix}.transferRequestType`).d('转移单类型'),
      lovPara: {
        documentClass: 'WM_TRANSFER',
      },
    },
    {
      name: 'requestTypeId',
      type: 'string',
      bind: 'requestTypeObj.documentTypeId',
    },
    {
      name: 'requestTypeCode',
      type: 'string',
      bind: 'requestTypeObj.documentTypeCode',
    },
    {
      name: 'requestTypeName',
      type: 'string',
      bind: 'requestTypeObj.documentTypeName',
    },
    // {
    //   name: 'docProcessRule',
    //   type: 'string',
    //   bind: 'requestTypeObj.docProcessRule',
    // },
    {
      name: 'wmMoveTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmMoveType,
      cascadeMap: { organizationId: 'organizationId' },
      label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      lovPara: {
        wmMoveClass: 'TRANSFER',
      },
    },
    {
      name: 'wmMoveTypeId',
      type: 'string',
      bind: 'wmMoveTypeObj.moveTypeId',
    },
    {
      name: 'wmMoveTypeCode',
      type: 'string',
      bind: 'wmMoveTypeObj.moveTypeCode',
    },
    {
      name: 'wmMoveTypeName',
      type: 'string',
      bind: 'wmMoveTypeObj.moveTypeName',
    },
    {
      name: 'requestStatus',
      type: 'string',
      lookupCode: lwmsTransferRequest.transferRequestStatus,
      label: intl.get(`${intlPrefix}.transferRequestStatus`).d('转移单状态'),
    },
    {
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.transferRequestNum`).d('转移单号'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      cascadeMap: { organizationId: 'organizationId' },
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
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
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'warehouseId' },
      label: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
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
      name: 'creatorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.creator`).d('制单员工'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'creatorId',
      type: 'string',
      bind: 'creatorObj.workerId',
    },
    {
      name: 'creatorCode',
      type: 'string',
      bind: 'creatorObj.workerCode',
    },
    {
      name: 'creator',
      type: 'string',
      bind: 'creatorObj.workerName',
    },
    {
      name: 'toOrganizationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.organization,
      label: intl.get(`${intlPrefix}.toOrganization`).d('目标组织'),
    },
    {
      name: 'toOrganizationId',
      type: 'string',
      bind: 'toOrganizationObj.organizationId',
    },
    {
      name: 'toOrganizationCode',
      type: 'string',
      bind: 'toOrganizationObj.organizationCode',
    },
    {
      name: 'toOrganizationName',
      type: 'string',
      bind: 'toOrganizationObj.organizationName',
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      // required: true,
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      cascadeMap: { organizationId: 'toOrganizationId' },
      label: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
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
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'toWarehouseId' },
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'creationDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.creationDate`).d('制单时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.remark`).d('备注'),
    },
    {
      name: 'executedTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.executedTime`).d('执行时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'executedWorker',
      type: 'string',
      label: intl.get(`${intlPrefix}.executedWorker`).d('执行员工'),
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalNum`).d('外部单据号'),
      validator: (value) => {
        // const reg = /^[1-9]+[0-9]*$/;
        const reg = /^[a-zA-Z0-9]+$/;
        if (value && !value.match(reg)) {
          return '只可输入字母、正整数!';
        }
      },
    },
    {
      name: 'printedDate',
      type: 'dateTime',
      label: intl.get(`${commonIntlPrefix}.printedDate`).d('打印时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'printedFlag',
      type: 'boolean',
      label: intl.get(`${commonIntlPrefix}.printedFlag`).d('打印标识'),
    },
    {
      name: 'docProcessRule',
      type: 'object',
      label: intl.get(`${commonIntlPrefix}.docProcessRule`).d('单据处理规则'),
    },
  ],
  transport: {
    read: () => ({
      url: listUrl,
      method: 'GET',
    }),
  },
});

export { transferRequestPlatformDS, transferRequestLineDS, createTransferRequestPlatformDS };
