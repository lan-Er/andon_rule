/*
 * @module: 生产入库单平台DS
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-03-01 14:31:06
 * @LastEditTime: 2021-05-18 14:31:06
 * @copyright: Copyright (c) 2021,Hand
 */
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { DataSet } from 'choerodon-ui/pro';

import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const commonCode = 'lwms.common.model';
const intlPrefix = 'lwms.productInventoryPlatform.model';
const { common } = codeConfig.code;
const headerQueryUrl = `${HLOS_LWMS}/v1/${organizationId}/request-headers`;
const lineQueryUrl = `${HLOS_LWMS}/v1/${organizationId}/request-lines`;

const getCommonFields = () => [
  {
    name: 'organizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${commonCode}.org`).d('组织'),
    lovCode: common.organization,
    required: true,
  },
  {
    name: 'organizationName',
    type: 'string',
    bind: 'organizationObj.organizationName',
    ignore: 'always',
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
    name: 'productRequestObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.requestNum`).d('入库单号'),
    lovCode: 'LWMS.PRODUCTION_REQUEST',
  },
  {
    name: 'requestId',
    type: 'string',
    bind: 'productRequestObj.requestId',
  },
  {
    name: 'requestNum',
    type: 'string',
    bind: 'productRequestObj.requestNum',
  },
  {
    name: 'moObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.moNum`).d('MO'),
    lovCode: 'LMES.MO',
    cascadeMap: { organizationId: 'organizationId' },
  },
  {
    name: 'moNum',
    type: 'string',
    bind: 'moObj.moNum',
    ignore: 'always',
  },
  {
    name: 'moId',
    type: 'string',
    bind: 'moObj.moId',
  },
  {
    name: 'moCode',
    type: 'string',
    bind: 'moObj.moCode',
  },
  {
    name: 'requestStatusList',
    type: 'string',
    multiple: true,
    defaultValue: ['NEW', 'RELEASED', 'EXECUTED'],
    lookupCode: 'LWMS.PRODUCTION_REQUEST_STATUS',
    label: intl.get(`${intlPrefix}.requestStatus`).d('入库单状态'),
  },
  {
    name: 'wareHouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.warehouseName`).d('完工仓库'),
    lovCode: 'LMDS.WAREHOUSE',
  },
  {
    name: 'warehouseName',
    type: 'string',
    bind: 'wareHouseObj.warehouseName',
    ignore: 'always',
  },
  {
    name: 'warehouseCode',
    type: 'string',
    bind: 'wareHouseObj.warehouseCode',
  },
  {
    name: 'warehouseId',
    type: 'string',
    bind: 'wareHouseObj.warehouseId',
  },
  {
    name: 'toWareHouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.toWarehouseName`).d('入库仓库'),
    lovCode: common.warehouse,
  },
  {
    name: 'toWarehouseCode',
    type: 'string',
    bind: 'toWareHouseObj.warehouseCode',
  },
  {
    name: 'toWarehouseId',
    type: 'string',
    bind: 'toWareHouseObj.warehouseId',
  },
  {
    name: 'toWarehouseName',
    type: 'string',
    bind: 'toWareHouseObj.warehouseName',
    ignore: 'always',
  },
  {
    name: 'assemblyItemObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.assemblyItem`).d('产成品'),
    lovCode: 'LMDS.ITEM_WM',
  },
  {
    name: 'itemId',
    type: 'string',
    bind: 'assemblyItemObj.itemId',
  },
  {
    name: 'assemblyItemCode',
    type: 'string',
    bind: 'assemblyItemObj.itemCode',
    ignore: 'always',
  },
  {
    name: 'assemblyItemName',
    type: 'string',
    bind: 'assemblyItemObj.description',
    ignore: 'always',
  },
  {
    name: 'documentTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.requestTypeName`).d('入库单类型'),
    lovCode: common.documentType,
    lovPara: {
      documentClass: 'WM_PRODUCTION',
    },
  },
  {
    name: 'requestTypeName',
    type: 'string',
    bind: 'documentTypeObj.documentTypeName',
    ignore: 'always',
  },
  {
    name: 'requestTypeId',
    type: 'string',
    bind: 'documentTypeObj.documentTypeId',
  },
  {
    name: 'requestTypeCode',
    type: 'string',
    bind: 'documentTypeObj.documentTypeCode',
  },
  {
    name: 'prodLineObj',
    type: 'object',
    noCache: true,
    lovCode: common.prodLine,
    label: intl.get(`${commonCode}.prodLine`).d('生产线'),
    cascadeMap: { organizationId: 'organizationId' },
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
    ignore: 'always',
  },
  {
    name: 'prodLineId',
    type: 'string',
    bind: 'prodLineObj.prodLineId',
  },
  {
    name: 'prodLineCode',
    type: 'string',
    bind: 'prodLineObj.prodLineCode',
    ignore: 'always',
  },
  {
    name: 'executedWorkerObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.executedWorker`).d('执行员工'),
    lovCode: common.worker,
    cascadeMap: { organizationId: 'organizationId' },
  },
  {
    name: 'executedWorkerId',
    type: 'string',
    bind: 'executedWorkerObj.workerId',
  },
  {
    name: 'executedWorkerCode',
    type: 'string',
    bind: 'executedWorkerObj.workerCode',
  },
  {
    name: 'executedWorkerName',
    type: 'string',
    bind: 'executedWorkerObj.workerName',
    ignore: 'always',
  },
  {
    name: 'executedTimeStart',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.startTime`).d('执行时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('executedTimeEnd')) {
          return 'executedTimeEnd';
        }
      },
    },
  },
  {
    name: 'executedTimeEnd',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.executedTimeEnd`).d('执行时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('executedTimeStart')) {
          return 'executedTimeStart';
        }
      },
    },
  },
  {
    name: 'createWorkerObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${commonCode}.createWorker`).d('制单员工'),
    lovCode: common.worker,
    cascadeMap: { organizationId: 'organizationId' },
  },
  {
    name: 'creatorId',
    type: 'string',
    bind: 'createWorkerObj.workerId',
  },
  {
    name: 'createWorkerCode',
    type: 'string',
    bind: 'createWorkerObj.workerCode',
  },
  {
    name: 'createWorkerName',
    type: 'string',
    bind: 'createWorkerObj.workerName',
    ignore: 'always',
  },
  {
    name: 'startCreationDate',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.startCreationDate`).d('制单时间>='),
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
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.endCreationDate`).d('制单时间<='),
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

const commonFields = [
  {
    name: 'projectNum',
    type: 'string',
    label: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
  },
  {
    name: 'sourceDocType',
    type: 'string',
    label: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
  },
  {
    name: 'sourceDocNum',
    type: 'string',
    label: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
  },
  {
    name: 'sourceDocLineNum',
    type: 'string',
    label: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
  },
  {
    name: 'externalId',
    type: 'string',
    label: intl.get(`${commonCode}.externalId`).d('外部ID'),
  },
  {
    name: 'externalNum',
    type: 'string',
    label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
  },
  {
    name: 'wmAreaId',
    type: 'string',
  },
  {
    name: 'wmAreaCode',
    type: 'string',
  },
  {
    name: 'wmAreaName',
    type: 'string',
    label: intl.get(`${intlPrefix}.wmAreaName`).d('完工货位'),
  },
  {
    name: 'toWarehouseId',
    type: 'string',
  },
  {
    name: 'toWarehouseCode',
    type: 'string',
  },
  {
    name: 'toWarehouseName',
    type: 'string',
    label: intl.get(`${intlPrefix}.toWarehouseName`).d('入库仓库'),
  },
  {
    name: 'toWmAreaId',
    type: 'string',
  },
  {
    name: 'toWmAreaCode',
    type: 'string',
  },
  {
    name: 'toWmAreaName',
    type: 'string',
    label: intl.get(`${intlPrefix}.toWmAreaName`).d('入库货位'),
  },
  {
    name: 'warehouseId',
    type: 'string',
  },
  {
    name: 'warehouseCode',
    type: 'string',
  },
  {
    name: 'warehouseName',
    type: 'string',
    label: intl.get(`${intlPrefix}.warehouseName`).d('完工仓库'),
  },
];

const productInventoryPlatformDS = () => ({
  // autoQuery: true,
  selection: 'multiple',
  pageSize: 10,
  queryFields: getCommonFields(),
  fields: [
    ...commonFields,
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'organizationCode',
      type: 'string',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestNum`).d('入库单号'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.moNum`).d('生产订单'),
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.assemblyItem`).d('产成品'),
    },
    {
      name: 'assemblyItemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.assemblyItemDesc`).d('产成品描述'),
    },
    {
      name: 'requestTypeId',
      type: 'string',
    },
    {
      name: 'requestTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestTypeName`).d('入库单类型'),
    },
    {
      name: 'requestStatus',
      type: 'string',
    },
    {
      name: 'requestStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestStatus`).d('入库单状态'),
    },
    {
      name: 'requestGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestGroup`).d('入库单组'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${commonCode}.workcellN`).d('工位'),
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
    },
    {
      name: 'creator',
      type: 'string',
      label: intl.get(`${commonCode}.createWorker`).d('制单员工'),
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: intl.get(`${commonCode}.creationDate`).d('制单时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'printedFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.printedFlag`).d('打印标识'),
    },
    {
      name: 'printedDate',
      type: 'date',
      label: intl.get(`${commonCode}.printedDate`).d('打印时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'approvalRuleMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalRule`).d('审批策略'),
    },
    {
      name: 'approvalWorkflow',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalWorkflow`).d('审批工作流'),
    },
    {
      name: 'docProcessRule',
      type: 'string',
      label: intl.get(`${commonCode}.docProcessRule`).d('单据处理规则'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'externalType',
      type: 'string',
      label: intl.get(`${commonCode}.externalType`).d('外部类型'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: headerQueryUrl,
        method: 'GET',
        paramsSerializer: (params) => {
          const tmpParams = filterNullValueObject(params);
          const queryParams = new URLSearchParams();
          Object.keys(tmpParams).forEach((key) => {
            queryParams.append(key, tmpParams[key]);
          });
          queryParams.append('requestOperationType', 'PRODUCTION');
          queryParams.append('sortFlag', 'DESC');
          return queryParams.toString();
        },
      };
    },
  },
});

const productInventoryPlatformLineDS = () => ({
  pageSize: 100,
  selection: false,
  fields: [
    ...commonFields,
    {
      name: 'requestLineNum',
      type: 'string',
      label: intl.get(`${commonCode}.lineNum`).d('行号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${commonCode}.uom`).d('单位'),
    },
    {
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${commonCode}.applyQty`).d('申请数量'),
    },
    {
      name: 'requestLineStatus',
      type: 'string',
    },
    {
      name: 'requestLineStatusMeaning',
      type: 'string',
      label: intl.get(`${commonCode}.shipLineStatus`).d('行状态'),
    },
    {
      name: 'executedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.executedQty`).d('入库数量'),
    },
    {
      name: 'itemControlTypeMeaning',
      type: 'string',
      label: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'applyPackQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.applyPackQty`).d('包装数量'),
    },
    {
      name: 'applyWeight',
      type: 'string',
      label: intl.get(`${intlPrefix}.applyWeight`).d('重量'),
    },
    {
      name: 'secondUomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.secondUomName`).d('辅助单位'),
    },
    {
      name: 'secondApplyQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${commonCode}.lineRemark`).d('行备注'),
    },
    {
      name: 'externalLineId',
      type: 'string',
      label: intl.get(`${commonCode}.externalLineId`).d('外部行ID'),
    },
    {
      name: 'externalLineNum',
      type: 'string',
      label: intl.get(`${commonCode}.externalLineNum`).d('外部单据行号'),
    },
  ],
  transport: {
    read: ({ params }) => ({
      url: lineQueryUrl,
      method: 'GET',
      params: {
        ...params,
      },
    }),
  },
});

const confirmReceiveDS = () => ({
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
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
      name: 'toWareHouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.toWarehouseName`).d('入库仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      bind: 'toWareHouseObj.warehouseCode',
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWareHouseObj.warehouseId',
    },
    {
      name: 'toWmAreaFlag',
      type: 'boolean',
      bind: 'toWareHouseObj.wmAreaFlag',
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      bind: 'toWareHouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      cascadeMap: { warehouseId: 'toWarehouseId' },
      label: intl.get(`${intlPrefix}.toWmAreaName`).d('入库货位'),
      lovCode: common.wmArea,
    },
    {
      name: 'toWmAreaCode',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaCode',
    },
    {
      name: 'toWmAreaId',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaId',
    },
    {
      name: 'toWmAreaName',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'remark',
      label: intl.get(`${commonCode}.remark`).d('备注'),
      type: 'string',
    },
  ],
});

const newDetailHeadDS = () => ({
  primaryKey: 'requestId',
  children: {
    lineDS: new DataSet(productInventoryPlatformLineDS()),
  },
  transport: {
    read: () => ({
      url: headerQueryUrl,
      method: 'GET',
    }),
  },
});

export {
  productInventoryPlatformDS,
  productInventoryPlatformLineDS,
  confirmReceiveDS,
  newDetailHeadDS,
};
