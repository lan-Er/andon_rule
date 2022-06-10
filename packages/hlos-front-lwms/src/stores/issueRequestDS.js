/*
 * @Description: 领料单平台 DataSet
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-08 16:24:13
 * @LastEditors: Please set LastEditors
 */

import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS, HLOS_LMES, HLOS_LSCM } from 'hlos-front/lib/utils/config';

import moment from 'moment';

const preCode = 'lwms.issueRequestPlatform.model';
const commonCode = 'lmes.common.model';

const { lwmsIssueRequest, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lwms.issueRequestPlatform.model';
const commonPrefix = 'lwms.common.model';
const commonUrl = `${HLOS_LWMS}/v1/${organizationId}/request-headers/issue`;
const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/request-lines`;

// common fields of queryFields and fields
const getCommonFields = (isQueryFields) => [
  {
    name: 'organizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.organization,
    label: intl.get(`${commonPrefix}.organization`).d('组织'),
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
    name: 'issueRequestNumObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: lwmsIssueRequest.issueRequestNum,
    label: intl.get(`${intlPrefix}.issueRequestNum`).d('领料单号'),
    dynamicProps: {
      lovPara: ({ record }) => {
        if (record && record.get('organizationId')) {
          return {
            organizationId: record.get('organizationId'),
          };
        } else {
          return {
            organizationId: 'undefined',
          };
        }
      },
    },
  },
  {
    name: 'requestNum',
    label: intl.get(`${intlPrefix}.issueRequestNum`).d('领料单号'),
    type: 'string',
    bind: 'issueRequestNumObj.requestNum',
  },
  {
    name: 'requestId',
    type: 'string',
    bind: 'issueRequestNumObj.requestId',
  },
  {
    name: 'moNumObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.mo,
    label: intl.get(`${intlPrefix}.moNum`).d('MO'),
    dynamicProps: {
      lovPara: ({ record }) => {
        if (record && record.get('organizationId')) {
          return {
            organizationId: record.get('organizationId'),
          };
        } else {
          return {
            organizationId: 'undefined',
          };
        }
      },
    },
  },
  {
    name: 'moId',
    type: 'string',
    bind: 'moNumObj.moId',
  },
  {
    name: 'moNum',
    type: 'string',
    bind: 'moNumObj.moNum',
  },
  {
    name: 'requestStatusList',
    type: 'string',
    multiple: isQueryFields,
    defaultValue: isQueryFields ? ['NEW', 'RELEASED', 'PICKED', 'EXECUTED'] : [],
    lookupCode: lwmsIssueRequest.issueRequestStatus,
    label: intl.get(`${intlPrefix}.issueRequestStatus`).d('领料单状态'),
  },
  {
    name: 'assemblyItemObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.item,
    label: intl.get(`${intlPrefix}.assembly`).d('装配件'),
  },
  {
    name: 'assemblyItemId',
    type: 'string',
    bind: 'assemblyItemObj.itemId',
  },
  {
    name: 'assemblyItemCode',
    type: 'string',
    ignore: 'always',
    bind: 'assemblyItemObj.itemCode',
  },
  {
    name: 'prodLineObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.prodLine,
    label: intl.get(`${commonPrefix}.prodLine`).d('生产线'),
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'prodLineId',
    type: 'string',
    bind: 'prodLineObj.prodLineId',
  },
  {
    name: 'prodLineName',
    type: 'string',
    ignore: 'always',
    bind: 'prodLineObj.resourceName',
  },
  {
    name: 'requestDepartmentObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.department,
    label: intl.get(`${intlPrefix}.requestDepartment`).d('申领部门'),
  },
  {
    name: 'requestDepartmentId',
    type: 'string',
    bind: 'requestDepartmentObj.departmentId',
  },
  {
    name: 'requestDepartment',
    type: 'string',
    ignore: 'always',
    bind: 'requestDepartmentObj.departmentName',
  },
  {
    name: 'requestTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.documentType,
    textField: 'documentTypeName',
    label: intl.get(`${intlPrefix}.issueRequestType`).d('领料单类型'),
    lovPara: {
      documentClass: 'WM_REQUEST',
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
  {
    name: 'wmMoveTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.wmMoveType,
    label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
  },
  {
    name: 'wmMoveTypeId',
    type: 'string',
    bind: 'wmMoveTypeObj.moveTypeId',
  },
  {
    name: 'wmMoveTypeName',
    type: 'string',
    ignore: 'always',
    bind: 'wmMoveTypeObj.moveTypeName',
  },
  {
    name: 'creatorObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.worker,
    label: intl.get(`${intlPrefix}.creator`).d('制单员工'),
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
    name: 'externalNum',
    type: 'string',
    label: intl.get(`${commonPrefix}.externalNum`).d('外部单据号'),
  },
  {
    name: 'outerRequestNum',
    type: 'string',
    label: intl.get(`${commonPrefix}.outerRequestNum`).d('外部申请单号'),
  },
  {
    name: 'planDemandDateStart',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.startPlanDemandDate`).d('需求时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('planDemandDateEnd')) {
          return 'planDemandDateEnd';
        }
      },
    },
  },
  {
    name: 'planDemandDateEnd',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.endPlanDemandDate`).d('需求时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('planDemandDateStart')) {
          return 'planDemandDateStart';
        }
      },
    },
  },
];

// 领料单头表DS
const issueRequestPlatformDS = (props) => ({
  autoQuery: false,
  autoCreate: props && props.autoCreate,
  queryFields: getCommonFields(true),
  fields: [
    ...getCommonFields(),
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${commonPrefix}.organization`).d('组织'),
    },
    {
      name: 'assemblyItemDescription',
      type: 'string',
      bind: 'assemblyItemObj.itemName',
      label: intl.get(`${intlPrefix}.assemblyDescription`).d('装配件描述'),
    },
    {
      name: 'requestStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.issueRequestStatus`).d('领料单状态'),
    },
    {
      name: 'planDemandDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.planDemandDate`).d('需求时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.workcell,
      label: intl.get(`${commonPrefix}.workcell`).d('工位'),
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellName',
      type: 'string',
      ignore: 'always',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'locationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.location,
      label: intl.get(`${commonPrefix}.location`).d('地点'),
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationName',
      type: 'string',
      ignore: 'always',
      bind: 'locationObj.locationName',
    },
    {
      name: 'warehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.wMArea`).d('发出货位'),
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      ignore: 'always',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'wmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.wMArea`).d('发出货位'),
    },
    {
      name: 'requestGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestGroup`).d('领料单组'),
    },
    {
      name: 'requestWorkerObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.requestWorker`).d('申领员工'),
    },
    {
      name: 'requestWorkerId',
      type: 'string',
      bind: 'requestWorkerObj.workerId',
    },
    {
      name: 'requestWorker',
      type: 'string',
      ignore: 'always',
      bind: 'requestWorkerObj.workerName',
    },
    {
      name: 'requestReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestReason`).d('申领用途'),
    },
    {
      name: 'outerRequestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.outerNum`).d('申领单号'),
    },
    {
      name: 'costCenterName',
      type: 'string',
      label: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
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
      label: intl.get(`${intlPrefix}.approvalRule`).d('审批策略'),
    },
    {
      name: 'approvalWorkflow',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalWorkflow`).d('审批工作流'),
    },
    {
      name: 'printedFlag',
      type: 'boolean',
      label: intl.get(`${commonPrefix}.printedFlag`).d('打印标识'),
    },
    {
      name: 'printedDate',
      type: 'dateTime',
      label: intl.get(`${commonPrefix}.printedDate`).d('打印时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'executedWorkerObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.executedWorker`).d('执行员工'),
    },
    {
      name: 'executedWorkerId',
      type: 'string',
      bind: 'executedWorkerObj.workerId',
    },
    {
      name: 'executedWorker',
      type: 'string',
      ignore: 'always',
      bind: 'executedWorkerObj.workerName',
    },
    {
      name: 'executedTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.executedTime`).d('执行时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'sourceDocTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.documentType,
      textField: 'documentTypeName',
      label: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
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
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源单据行号'),
    },
    {
      name: 'docProcessRule',
      type: 'string',
      label: intl.get(`${intlPrefix}.docProcessRule`).d('单据处理规则'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
    {
      name: 'externalType',
      type: 'string',
      label: intl.get(`${commonPrefix}.externalType`).d('外部类型'),
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${commonPrefix}.externalID`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${commonPrefix}.externalNum`).d('外部单据号'),
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
    read: ({ data }) => ({
      url: generateUrlWithGetParam(commonUrl, {
        requestStatusList: data.requestStatus,
      }),
      data: {
        ...data,
        requestOperationType: 'ISSUE',
        requestStatus: null,
      },
      method: 'GET',
    }),
  },
});

const lineCommonFields = [
  {
    name: 'documentType',
    type: 'string',
  },
  {
    name: 'requestLineNum',
    type: 'string',
    label: intl.get(`${intlPrefix}.lineNum`).d('行号'),
    order: 'asc',
  },
  {
    name: 'itemObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.item,
    label: intl.get(`${intlPrefix}.item`).d('物料'),
    required: true,
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
    label: intl.get(`${intlPrefix}.itemDesc`).d('物料描述'),
    bind: 'itemObj.description',
    disabled: true,
  },
  {
    name: 'operation',
    type: 'string',
    label: intl.get(`${intlPrefix}.operation`).d('工序'),
  },
  {
    name: 'uomObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.uom,
    label: intl.get(`${intlPrefix}.uom`).d('单位'),
    required: true,
  },
  {
    name: 'uomId',
    type: 'string',
    bind: 'uomObj.uomId',
  },
  {
    name: 'uom',
    type: 'string',
    bind: 'uomObj.uomCode',
  },
  {
    name: 'uomName',
    type: 'string',
    bind: 'uomObj.uomName',
  },
  {
    name: 'applyQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
    min: 0,
    // max: 'componentQty',
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('documentType') === 'PLANNED_MO_ISSUE_REQUEST') {
          return 'claimedQty';
        } else {
          return 'componentQty';
        }
      },
    },
    // precision: 0.01,
    required: true,
    // dynamicProps: {
    //   max: ({record}) => {
    //     if(record.get('componentQty')) {

    //     }
    //   },
    // },
  },
  {
    name: 'claimedQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.claimedQty`).d('待申领数量'),
    // min: 0,
  },
  {
    name: 'demandQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
    // min: 0,
  },
  {
    name: 'availableQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
    ignore: 'always',
    // min: 0,
  },
  {
    name: 'onhandQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
    ignore: 'always',
    // min: 0,
  },
  {
    name: 'componentQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.componentQty`).d('待执行数量'),
    min: 0,
  },
  {
    name: 'issuedQty',
    type: 'number',
    min: 0,
  },
  {
    name: 'requestLineStatus',
    type: 'string',
    // lookupCode: lwmsIssueRequest.lineStatus,
    label: intl.get(`${intlPrefix}.lineStatus`).d('行状态'),
    defaultValue: 'NEW',
    disabled: true,
  },
  {
    name: 'requestLineStatusMeaning',
    type: 'string',
    label: intl.get(`${intlPrefix}.lineStatus`).d('行状态'),
  },
  {
    name: 'warehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
    dynamicProps: {
      lovPara: ({ dataSet }) => {
        if (dataSet && dataSet.parent && dataSet.parent.current.get('organizationId')) {
          return { organizationId: dataSet.parent.current.get('organizationId') };
        } else {
          return { organizationId: 'undefined' };
        }
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
    ignore: 'always',
    bind: 'warehouseObj.warehouseName',
  },
  {
    name: 'wmAreaObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.wmArea,
    label: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
    cascadeMap: { warehouseObj: 'warehouseObj' },
    dynamicProps: {
      lovPara: ({ record }) => {
        if (record.get('warehouseId')) {
          return { warehouseId: record.get('warehouseId') };
        } else {
          return { warehouseId: 'undefined' };
        }
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
    ignore: 'always',
    bind: 'wmAreaObj.wmAreaName',
  },
  {
    name: 'workcellObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.workcell,
    label: intl.get(`${intlPrefix}.workcell`).d('发出工位'),
    // required: true,
  },
  {
    name: 'workcellId',
    type: 'string',
    bind: 'workcellObj.workcellId',
  },
  {
    name: 'workcellCode',
    type: 'string',
    bind: 'workcellObj.workcellCode',
  },
  {
    name: 'workcellName',
    type: 'string',
    ignore: 'always',
    bind: 'workcellObj.workcellName',
  },
  {
    name: 'locationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.location,
    label: intl.get(`${intlPrefix}.location`).d('发出地点'),
    // required: true,
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
    ignore: 'always',
    bind: 'locationObj.locationName',
  },
  {
    name: 'toWarehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    label: intl.get(`${intlPrefix}.toWarehouse`).d('接收仓库'),
    dynamicProps: {
      lovPara: ({ dataSet }) => {
        if (dataSet && dataSet.parent && dataSet.parent.current.get('organizationId')) {
          return { organizationId: dataSet.parent.current.get('organizationId') };
        } else {
          return { organizationId: 'undefined' };
        }
      },
    },
    required: true,
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
    ignore: 'always',
    bind: 'toWarehouseObj.warehouseName',
  },
  {
    name: 'toWmAreaObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.wmArea,
    label: intl.get(`${intlPrefix}.toWMArea`).d('接收货位'),
    cascadeMap: { warehouseId: 'toWarehouseId' },
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
    ignore: 'always',
    bind: 'toWmAreaObj.wmAreaName',
  },
  {
    name: 'toAvailableQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.toAvailableQty`).d('接收仓库可用量'),
    ignore: 'always',
  },
  {
    name: 'toOnhandQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.toOnhandQty`).d('接收仓库现有量'),
    ignore: 'always',
  },
  {
    name: 'toWorkcellObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.workcell,
    label: intl.get(`${intlPrefix}.toWorkcell`).d('接收工位'),
    dynamicProps: {
      lovPara: ({ dataSet }) => {
        if (dataSet && dataSet.parent && dataSet.parent.current.get('organizationId')) {
          return { organizationId: dataSet.parent.current.get('organizationId') };
        } else {
          return { organizationId: 'undefined' };
        }
      },
    },
    // required: true,
  },
  {
    name: 'toWorkcellId',
    type: 'string',
    bind: 'toWorkcellObj.workcellId',
  },
  {
    name: 'toWorkcellCode',
    type: 'string',
    bind: 'toWorkcellObj.workcellCode',
  },
  {
    name: 'toWorkcellName',
    type: 'string',
    ignore: 'always',
    bind: 'toWorkcellObj.workcellName',
  },
  {
    name: 'packingQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.packingQty`).d('包装数'),
    ignore: 'always',
  },
  {
    name: 'minPackingQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.minPackingQty`).d('最小包装数'),
    ignore: 'always',
  },
  {
    name: 'containerQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.containerQty`).d('装箱数'),
    ignore: 'always',
  },
  {
    name: 'palletContainerQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.palletContainerQty`).d('托盘箱数'),
    ignore: 'always',
  },
  {
    name: 'toLocationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.location,
    label: intl.get(`${intlPrefix}.toLocation`).d('接收地点'),
    // required: true,
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
    ignore: 'always',
    bind: 'toLocationObj.locationName',
  },
  {
    name: 'wmMoveTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.wmMoveType,
    label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
    // required: true,
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
    ignore: 'always',
    bind: 'wmMoveTypeObj.moveTypeName',
  },
  {
    name: 'costCenterName',
    type: 'string',
    label: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
  },
  {
    name: 'projectNum',
    type: 'string',
    label: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
  },
  {
    name: 'itemControlType',
    type: 'string',
    lookupCode: common.itemControlType,
    label: intl.get(`${intlPrefix}.itemControlType`).d('物料控制类型'),
    disabled: true,
  },
  {
    name: 'applyPackQty',
    type: 'number',
    min: 0,
    label: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
    // required: true,
  },
  {
    name: 'applyWeight',
    type: 'number',
    min: 0,
    label: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
    // required: true,
  },
  {
    name: 'secondUomObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.uom,
  },
  {
    name: 'secondUomId',
    type: 'string',
    bind: 'secondUomObj.uomId',
  },
  {
    name: 'secondUom',
    type: 'string',
    bind: 'secondUomObj.uomCode',
    label: intl.get(`${intlPrefix}.secondUOM`).d('辅助单位'),
  },
  {
    name: 'secondUomName',
    type: 'string',
    bind: 'secondUomObj.uomName',
  },
  {
    name: 'secondApplyQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
    dynamicProps: {
      disabled: ({ record }) => !record.get('secondUomId'),
    },
  },
  {
    name: 'partyObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.party,
    label: intl.get(`${intlPrefix}.specifySupplier`).d('指定供应商'),
  },
  {
    name: 'partyId',
    type: 'string',
    bind: 'supplierObj.partyId',
  },
  {
    name: 'partyName',
    type: 'string',
    ignore: 'always',
    bind: 'supplierObj.partyName',
  },
  {
    name: 'sourceDocTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.documentType,
    textField: 'documentTypeName',
    label: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
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
    name: 'approveWorkflow',
    type: 'string',
    bind: 'sourceDocTypeObj.approveWorkflow',
  },
  {
    name: 'sourceDocTypeName',
    type: 'string',
    bind: 'sourceDocTypeObj.documentTypeName',
  },
  {
    name: 'sourceDocNumObj',
    type: 'object',
    label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
    lovCode: common.document,
    ignore: 'always',
    cascadeMap: { sourceDocTypeId: 'sourceDocTypeId' },
  },
  {
    name: 'sourceDocId',
    type: 'string',
    bind: 'sourceDocNumObj.documentId',
  },
  {
    name: 'sourceDocNum',
    label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
    type: 'string',
    bind: 'sourceDocNumObj.documentNum',
  },
  {
    name: 'sourceDocLineNumObj',
    type: 'object',
    label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源单据行号'),
    lovCode: common.documentLine,
    ignore: 'always',
    cascadeMap: { sourceDocNum: 'sourceDocNum' },
  },
  {
    name: 'sourceDocLineNum',
    label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源单据行号'),
    type: 'string',
    bind: 'sourceDocLineNumObj.documentLineNum',
  },
  {
    name: 'sourceDocLineId',
    type: 'string',
    bind: 'sourceDocLineNumObj.documentLineId',
  },
  {
    name: 'lineRemark',
    type: 'string',
    label: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
  },
  {
    name: 'externalId',
    type: 'string',
    label: intl.get(`${intlPrefix}.externalID`).d('外部ID'),
  },
  {
    name: 'externalNum',
    type: 'string',
    label: intl.get(`${intlPrefix}.externalNum`).d('外部单据号'),
  },
  {
    name: 'externalLineId',
    type: 'string',
    label: intl.get(`${intlPrefix}.externalID`).d('外部行ID'),
  },
  {
    name: 'externalLineNum',
    type: 'string',
    label: intl.get(`${intlPrefix}.externalNum`).d('外部单据行号'),
  },
  {
    name: 'pickedFlag',
    type: 'boolean',
    label: intl.get(`${intlPrefix}.pickedFlag`).d('拣料标识'),
    disabled: true,
  },
  {
    name: 'pickedQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.pickedQty`).d('拣料数量'),
    disabled: true,
  },
  {
    name: 'executedQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.executedQty`).d('发出数量'),
    disabled: true,
  },
  {
    name: 'confirmedQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.confirmedQty`).d('接收数量'),
    disabled: true,
  },
  {
    name: 'pickedWorkerObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.worker,
    label: intl.get(`${intlPrefix}.pickedWorker`).d('拣料员工'),
  },
  {
    name: 'pickedWorkerId',
    bind: 'pickedWorkerObj.workerId',
  },
  {
    name: 'pickedWorker',
    ignore: 'always',
    bind: 'pickedWorkerObj.workerName',
    disabled: true,
  },
  {
    name: 'pickRuleObj',
    type: 'object',
    label: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
    lovCode: common.rule,
    ignore: 'always',
  },
  {
    name: 'pickRuleId',
    type: 'string',
    bind: 'pickRuleObj.ruleId',
  },
  {
    name: 'pickRule',
    type: 'string',
    label: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
    bind: 'pickRuleObj.ruleName',
  },
  {
    name: 'reservationRuleObj',
    type: 'object',
    label: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
    lovCode: common.rule,
    ignore: 'always',
  },
  {
    name: 'reservationRuleId',
    type: 'string',
    bind: 'reservationRuleObj.ruleId',
  },
  {
    name: 'reservationRule',
    type: 'string',
    label: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
    bind: 'reservationRuleObj.ruleName',
  },
  {
    name: 'fifoRuleObj',
    type: 'object',
    ignore: 'always',
    label: intl.get(`${intlPrefix}.fifoRule`).d('FIFO规则'),
    lovCode: common.rule,
  },
  {
    name: 'fifoRuleId',
    bind: 'fifoRuleObj.ruleId',
  },
  {
    name: 'fifoRule',
    label: intl.get(`${intlPrefix}.fifoRule`).d('FIFO规则'),
    bind: 'fifoRuleObj.ruleCode',
  },
  {
    name: 'wmInspectRuleObj',
    type: 'object',
    label: intl.get(`${intlPrefix}.wmInspectRule`).d('仓库检验规则'),
    lovCode: common.rule,
    ignore: 'always',
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
    bind: 'wmInspectRuleObj.ruleName',
  },
  // {
  //   name: 'lotObj',
  //   type: 'object',
  //   label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
  //   lovCode: common.lot,
  //   ignore: 'always',
  //   // dynamicProps: {
  //   //   lovPara: ({ record }) => ({
  //   //     organizationId: record.get('itemId'),
  //   //   }),
  //   // },
  // },
  {
    name: 'lotNumber',
    type: 'string',
    label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    // bind: 'lotObj.lotNumber',
  },
  // {
  //   name: 'lotId',
  //   type: 'string',
  //   bind: 'lotObj.lotId',
  // },
  // {
  //   name: 'tagObj',
  //   type: 'object',
  //   label: intl.get(`${intlPrefix}.tag`).d('指定标签'),
  //   lovCode: common.tag,
  //   ignore: 'always',
  // },
  // {
  //   name: 'tagId',
  //   type: 'string',
  //   bind: 'tagObj.tagId',
  // },
  {
    name: 'tagCode',
    type: 'string',
    label: intl.get(`${intlPrefix}.tag`).d('指定标签'),
    // bind: 'tagObj.tagCode',
  },
];

// 领料行 DS
const issueRequestLineDS = () => ({
  pageSize: 100,
  fields: lineCommonFields,
  transport: {
    read: ({ params }) => {
      return {
        params: {
          ...params,
          requestOperationType: 'ISSUE',
          showOperationName: true,
        },
        url: lineUrl,
        method: 'GET',
        transformResponse: (data) => {
          if (data) {
            let formatData;
            try {
              formatData = JSON.parse(data);
            } catch (e) {
              // TODO: JSON解析失败说明数据接口返回数据不合理，譬如 403，DS已经做了报错处理，因此此处暂不作处理
              return;
            }
            if (formatData && formatData.failed !== true && Array.isArray(formatData.content)) {
              return formatData.content.map((item) => ({
                ...item,
                totalElements: formatData.totalElements,
                warehouseName: `${item.warehouseCode || ''} ${item.warehouseName || ''}`,
                toWarehouseName: `${item.toWarehouseCode || ''} ${item.toWarehouseName || ''}`,
                wmAreaName: `${item.wmAreaCode || ''} ${item.wmAreaName || ''}`,
                toWmAreaName: `${item.toWmAreaCode || ''} ${item.toWmAreaName || ''}`,
              }));
            } else {
              notification.error((formatData && formatData.message) || '');
            }
          }
        },
      };
    },
  },
});

const issueRequestDetailLineDS = () => ({
  fields: lineCommonFields,
  paging: false,
  transport: {
    read: ({ data }) => {
      return {
        url: `${lineUrl}/platform`,
        data: {
          ...data,
          showOperationName: true,
        },
        method: 'GET',
      };
    },
    destroy: () => ({
      url: `${lineUrl}/delete`,
      method: 'DELETE',
    }),
  },
  events: {
    update: ({ dataSet, value, name, record }) => {
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'sourceDocTypeObj') {
        record.set('sourceDocNumObj', null);
        record.set('sourceDocLineNumObj', null);
      }
      if (name === 'sourceDocNumObj') {
        record.set('sourceDocLineNumObj', null);
      }
      if (name === 'applyQty') {
        if (
          value < 0 ||
          (record.get('documentType') === 'PLANNED_MO_ISSUE_REQUEST' &&
            value > record.get('claimedQty'))
        ) {
          dataSet.unSelect(record);
        } else {
          dataSet.select(record);
        }
      }
    },
  },
});

// 领料单详情头DS
const issueRequestDetailDS = () => ({
  primaryKey: 'requestId',
  autoCreate: true,
  children: {
    requestLineList: new DataSet({ ...issueRequestDetailLineDS() }),
  },
  fields: [
    {
      name: 'requestTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.documentType,
      label: intl.get(`${intlPrefix}.issueRequestType`).d('领料单类型'),
      textField: 'documentTypeName',
      lovPara: {
        documentClass: 'WM_REQUEST',
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
      ignore: 'always',
      bind: 'requestTypeObj.documentTypeName',
    },
    {
      name: 'docProcessRuleId',
      type: 'string',
      ignore: 'always',
      bind: 'requestTypeObj.docProcessRuleId',
    },
    {
      name: 'docProcessRule',
      type: 'string',
      ignore: 'always',
      bind: 'requestTypeObj.docProcessRule',
    },
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.organization,
      label: intl.get(`${commonPrefix}.org`).d('组织'),
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
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.issueRequestNum`).d('领料单号'),
      disabled: true,
    },
    {
      name: 'assemblyItemObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.item,
      textField: 'item',
      label: intl.get(`${intlPrefix}.assembly`).d('装配件'),
    },
    {
      name: 'assemblyItemId',
      type: 'string',
      bind: 'assemblyItemObj.itemId',
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      bind: 'assemblyItemObj.itemCode',
    },
    {
      name: 'assemblyItemDescription',
      type: 'string',
      bind: 'assemblyItemObj.description',
      disabled: true,
    },
    {
      name: 'assemblyItem',
      type: 'string',
      bind: 'assemblyItemObj.item',
      disabled: true,
    },
    {
      name: 'wmMoveTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmMoveType,
      label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      // required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
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
      ignore: 'always',
      bind: 'wmMoveTypeObj.moveTypeName',
    },
    {
      name: 'requestStatus',
      type: 'string',
      lookupCode: lwmsIssueRequest.issueRequestStatus,
      label: intl.get(`${intlPrefix}.issueRequestStatus`).d('领料单状态'),
      disabled: true,
      defaultValue: 'NEW',
    },
    {
      name: 'planDemandDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.planDemandDate`).d('需求时间'),
      format: DEFAULT_DATETIME_FORMAT,
      // required: true,
    },
    {
      name: 'creatorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.creator`).d('制单员工'),
      // required: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
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
      name: 'moNumObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.mo,
      label: intl.get(`${intlPrefix}.mo`).d('MO'),
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId'), lovType: 'rqh' };
          } else {
            return { organizationId: 'undefined', lovType: 'rqh' };
          }
        },
      },
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'moNumObj.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      bind: 'moNumObj.moNum',
    },
    {
      name: 'moComponentId',
      type: 'string',
      bind: 'moNumObj.moComponentId',
      ignore: 'always',
    },
    // {
    //   name: 'sourceDocTypeId',
    //   type: 'string',
    //   bind: 'moNumObj.moTypeId',
    // },
    // {
    //   name: 'sourceDocTypeCode',
    //   type: 'string',
    //   bind: 'moNumObj.moTypeCode',
    // },
    // {
    //   name: 'sourceDocId',
    //   type: 'string',
    //   bind: 'moNumObj.moId',
    // },
    // {
    //   name: 'sourceDocNum',
    //   type: 'string',
    //   bind: 'moNumObj.moNum',
    // },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.prodLine,
      label: intl.get(`${commonPrefix}.prodLine`).d('生产线'),
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
    },
    {
      name: 'prodLineName',
      type: 'string',
      ignore: 'always',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.workcell,
      label: intl.get(`${commonPrefix}.workcell`).d('工位'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          prodLineId: record.get('prodLineId'),
        }),
      },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      ignore: 'always',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'locationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.location,
      label: intl.get(`${commonPrefix}.location`).d('地点'),
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
      ignore: 'always',
      bind: 'locationObj.locationName',
    },
    {
      name: 'toEnterpriseObj',
      type: 'object',
      lovCode: lwmsIssueRequest.enterprise,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.enterprise`).d('目标集团'),
      noCache: true,
    },
    {
      name: 'toEnterpriseId',
      type: 'string',
      bind: 'toEnterpriseObj.enterpriseId',
    },
    {
      name: 'toEnterpriseName',
      type: 'string',
      ignore: 'always',
      bind: 'toEnterpriseObj.enterpriseName',
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
      label: intl.get(`${intlPrefix}.toWarehouse`).d('接收仓库'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
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
      ignore: 'always',
      bind: 'toWarehouseObj.warehouseName',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.toWMArea`).d('接收货位'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('toWarehouseId')) {
            return { warehouseId: record.get('toWarehouseId') };
          } else {
            return { warehouseId: 'undefined' };
          }
        },
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
      ignore: 'always',
      bind: 'toWmAreaObj.wmAreaName',
    },
    {
      name: 'sourceDocTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.documentType,
      textField: 'documentTypeName',
      label: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
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
      ignore: 'always',
      bind: 'sourceDocTypeObj.documentTypeName',
    },
    {
      name: 'sourceDocNumObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
      lovCode: common.document,
      ignore: 'always',
      cascadeMap: { sourceDocTypeId: 'sourceDocTypeId' },
      noCache: true,
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
      label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源单据行号'),
      lovCode: common.documentLine,
      ignore: 'always',
      cascadeMap: { sourceDocNum: 'sourceDocNum' },
      noCache: true,
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      bind: 'sourceDocLineNumObj.documentLineNum',
    },
    {
      name: 'sourceDocLineId',
      type: 'string',
      bind: 'sourceDocLineNumObj.documentLineId',
    },
    {
      name: 'enterpriseObj',
      type: 'object',
      lovCode: lwmsIssueRequest.enterprise,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.fromEnterprise`).d('来源集团'),
      noCache: true,
    },
    {
      name: 'enterpriseId',
      type: 'string',
      bind: 'enterpriseObj.enterpriseId',
    },
    {
      name: 'enterpriseName',
      type: 'string',
      ignore: 'always',
      bind: 'enterpriseObj.enterpriseName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.fromWarehouse`).d('发出仓库'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
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
      ignore: 'always',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.fromWMArea`).d('发出货位'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('warehouseId')) {
            return {
              warehouseId: record.get('warehouseId'),
              organizationId: record.get('organizationId'),
            };
          } else {
            return { warehouseId: 'undefined', organizationId: 'undefined' };
          }
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
      ignore: 'always',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'requestDepartmentObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.department,
      label: intl.get(`${intlPrefix}.requestDepartment`).d('申领部门'),
    },
    {
      name: 'requestDepartmentId',
      type: 'string',
      bind: 'requestDepartmentObj.departmentId',
    },
    {
      name: 'requestDepartment',
      type: 'string',
      ignore: 'always',
      bind: 'requestDepartmentObj.departmentName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.applyDepartment`).d('申领部门'),
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'departmentCode',
      type: 'string',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'departmentObj.departmentName',
      ignore: 'always',
    },
    {
      name: 'requestReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestReason`).d('领用原因'),
    },
  ],
  transport: {
    read: () => ({
      url: commonUrl,
      method: 'get',
    }),
    submit: ({ dataSet, data }) => {
      const { requestLineList } = dataSet.children;
      const _lineList = requestLineList.selected.map((i) => i.toJSONData());
      return {
        url: commonUrl,
        data: {
          ...data[0],
          requestTypeId: '81764292739346432',
          requestTypeCode: 'NO_PRODUCTION_REQUEST',
          requestLineList: _lineList,
        },
        method: 'POST',
      };
    },
  },
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'prodLineObj') {
        record.set('workcellObj', null);
      }
      if (name === 'toOrganizationObj') {
        record.set('toWarehouseObj', null);
      }
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'organizationObj') {
        record.set('warehouseObj', null);
        record.set('moNumObj', null);
        record.set('toWarehouseObj', null);
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
      if (name === 'moNumObj') {
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
          record.set('planDemandDate', '');
          record.set('assemblyItemObj', null);
          record.set('prodLineObj', null);
          record.set('workcellObj', null);
        }
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'sourceDocTypeObj') {
        record.set('sourceDocNumObj', null);
        record.set('sourceDocLineNumObj', null);
      }
      if (name === 'sourceDocNumObj') {
        record.set('sourceDocLineNumObj', null);
      }
    },
  },
});

// 汇总DS
const summaryDetailDS = () => ({
  fields: [
    {
      name: 'itemCode',
      type: 'string',
      label: '物料编码',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'uomName',
      type: 'string',
      label: '单位',
    },
    {
      name: 'secondUomName',
      type: 'string',
      label: '辅助单位',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '生产批次',
    },
    {
      name: 'applyQty',
      type: 'string',
      label: '申请数量',
    },
    {
      name: 'executedQty',
      type: 'string',
      label: '发出数量',
    },
    {
      name: 'toLocationName',
      type: 'string',
      label: '目标地点',
    },
  ],
});

// 多工单新建领料单表格DS
const mulTableDS = () => ({
  paging: false,
  queryFields: [
    {
      label: '计划开始时间从',
      name: 'planStartDateLeft',
      type: 'dateTime',
      max: 'planStartDateRight',
    },
    {
      label: '计划开始时间至',
      name: 'planStartDateRight',
      type: 'dateTime',
      min: 'planStartDateLeft',
    },
    {
      label: '发出仓库',
      name: 'fromWarehouse',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WAREHOUSE',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'supplyWarehouseId',
      bind: 'fromWarehouse.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'fromWarehouse.warehouseCode',
    },
    {
      label: '组织',
      name: 'organizationObj',
      type: 'object',
      ignore: 'always',
      required: true,
      lovCode: 'LMDS.SINGLE.ME_OU',
    },
    {
      name: 'ownerOrganizationId',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.meOuName',
    },
    {
      label: '生产线',
      name: 'prodLineObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.PRODLINE',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      label: '车间',
      name: 'meAreaObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.ME_AREA',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'meAreaId',
      bind: 'meAreaObj.meAreaId',
    },
    {
      label: '设备',
      name: 'equipmentObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.EQUIPMENT',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
          prodLineId: record.get('prodLineId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      label: '项目号',
      name: 'projectNum',
      type: 'string',
    },
    {
      label: '物料',
      name: 'itemObj',
      type: 'object',
      multiple: true,
      ignore: 'always',
      lovCode: 'LMDS.ITEM',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'componentItemIds',
      bind: 'itemObj.itemId',
    },
    {
      label: '物料类型',
      name: 'itemType',
      type: 'string',
      lookupCode: 'LMDS.ITEM_TYPE',
    },
    {
      label: '物料类别',
      name: 'itemCategory',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'ITEM_WM' },
    },
    {
      name: 'itemCategoryId',
      bind: 'itemCategory.categoryId',
    },
    {
      label: 'MO号',
      name: 'moNumObj',
      type: 'object',
      ignore: 'always',
      multiple: true,
      lovCode: 'LMES.MO',
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('ownerOrganizationId')) {
            return { organizationId: record.get('ownerOrganizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'moIds',
      bind: 'moNumObj.moId',
    },
    {
      name: 'moNum',
      bind: 'moNumObj.moNum',
      ignore: 'always',
    },
    {
      label: 'MO状态',
      name: 'moStatues',
      required: true,
      type: 'string',
      multiple: true,
      defaultValue: ['RELEASED'],
      lookupCode: 'LMES.MO_STATUS',
    },
    {
      label: '目标仓库',
      name: 'targetWarehouseObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WAREHOUSE',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('ownerOrganizationId')),
      },
    },
    {
      name: 'toWarehouseId',
      bind: 'targetWarehouseObj.warehouseId',
    },
    {
      label: '按物料合并',
      name: 'merge',
      type: 'boolean',
    },
  ],
  fields: [
    {
      name: 'itemDisabledFlag',
      // type: 'boolean',
    },
    {
      label: '行号',
      name: 'requestLineNum',
      type: 'number',
      order: 'asc',
    },
    {
      label: '物料',
      name: 'itemObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.ITEM',
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          const { organizationObj } = dataSet.queryDataSet.current.data;
          return {
            organizationId: organizationObj.meOuId,
          };
        },
        disabled: ({ record }) => {
          return record.get('itemDisabledFlag');
        },
        required: ({ record }) => {
          return !record.get('itemDisabledFlag');
        },
      },
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
    },
    {
      label: '物料描述',
      type: 'string',
      name: 'itemDescription',
      bind: 'itemObj.description',
    },
    {
      label: '单位',
      name: 'uomObj',
      type: 'object',
      required: true,
      ignore: 'always',
      lovCode: 'LMDS.UOM',
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
    },
    {
      name: 'demandQty',
      type: 'number',
      label: '需求数量',
    },
    {
      name: 'applyQty',
      type: 'number',
      label: '申请数量',
      required: true,
    },
    {
      name: 'availableQty',
      type: 'number',
      label: '可用量',
    },
    {
      name: 'onhandQty',
      type: 'number',
      label: '现有量',
    },
    {
      label: '发出仓库',
      name: 'fromWarehouseObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WAREHOUSE',
      dynamicProps: ({ dataSet }) => {
        const { organizationObj } = dataSet.queryDataSet.current.data;
        return {
          lovPara: {
            organizationId: organizationObj.meOuId,
          },
        };
      },
    },
    {
      name: 'warehouseId',
      bind: 'fromWarehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'fromWarehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      bind: 'fromWarehouseObj.warehouseName',
    },
    {
      label: '发出货位',
      name: 'fromWareAreaObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WM_AREA',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaId',
      bind: 'fromWareAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'fromWareAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'fromWareAreaObj.wmAreaName',
    },
    {
      label: '目标仓库',
      name: 'toWarehouseObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WAREHOUSE',
      dynamicProps: ({ dataSet }) => {
        const { organizationObj } = dataSet.queryDataSet.current.data;
        return {
          lovPara: {
            organizationId: organizationObj.meOuId,
          },
        };
      },
    },
    {
      name: 'toWarehouseId',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseCode',
      bind: 'toWarehouseObj.warehouseCode',
    },
    {
      name: 'toWarehouseName',
      bind: 'toWarehouseObj.warehouseName',
    },
    {
      label: '目标货位',
      name: 'toWareAreaObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WM_AREA',
      cascadeMap: { warehouseId: 'toWarehouseId' },
    },
    {
      name: 'toWmAreaId',
      bind: 'toWareAreaObj.wmAreaId',
    },
    {
      name: 'toWmAreaCode',
      bind: 'toWareAreaObj.wmAreaCode',
    },
    {
      name: 'toWmAreaName',
      bind: 'toWareAreaObj.wmAreaName',
    },
    {
      name: 'itemControlType',
      type: 'string',
      label: '物料控制类型',
      lookupCode: 'LMDS.ITEM_CONTROL_TYPE',
    },
    {
      name: 'applyPackQty',
      type: 'string',
      label: '申请包装数量',
    },
    {
      name: 'applyWeight',
      type: 'string',
      label: '申请重量',
    },
    {
      name: 'secondUomObj',
      label: '辅助单位',
      type: 'object',
      // required: true,
      ignore: 'always',
      lovCode: 'LMDS.UOM',
    },
    {
      name: 'secondUomId',
      bind: 'secondUomObj.uomId',
    },
    {
      name: 'secondUom',
      bind: 'secondUomObj.uomCode',
    },
    {
      name: 'secondUomName',
      bind: 'secondUomObj.uomName',
    },
    {
      name: 'secondApplyQty',
      type: 'string',
      label: '辅助单位数量',
      cascadeMap: { secondUomId: 'secondUomId' },
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '指定批次',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: '指定标签',
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: '行备注',
    },
    {
      name: 'pickRuleObj',
      type: 'object',
      label: '拣货规则',
      ignore: 'always',
      lovCode: 'LMDS.RULE',
      lovPara: { ruleType: 'PICK' },
    },
    {
      name: 'pickRule',
      bind: 'pickRuleObj.ruleJson',
    },
    {
      name: 'pickRuleId',
      bind: 'pickRuleObj.ruleId',
    },
    {
      name: 'reservationRuleObj',
      type: 'object',
      ignore: 'always',
      label: '预留规则',
      lovCode: 'LMDS.RULE',
      lovPara: { ruleType: 'PRESERVE' },
    },
    {
      name: 'reservationRule',
      bind: 'reservationRuleObj.ruleJson',
    },
    {
      name: 'reservationRuleId',
      bind: 'reservationRuleObj.ruleId',
    },
    {
      name: 'fifoRuleObj',
      type: 'object',
      ignore: 'always',
      label: 'FIFO规则',
      lovCode: 'LMDS.RULE',
      lovPara: { ruleType: 'FIFO' },
    },
    {
      name: 'fifoRule',
      bind: 'fifoRuleObj.ruleJson',
    },
    {
      name: 'fifoRuleId',
      bind: 'fifoRuleObj.ruleId',
    },
    {
      name: '_status',
      defaultValue: 'create',
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'fromWarehouseObj') {
        record.set('fromWareAreaObj', null);
      }
      if (name === 'toWarehouseObj') {
        record.set('toWareAreaObj', null);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/mo-components/multi-mo-pick`,
        data: { ...data },
        method: 'POST',
      };
    },
  },
});

// 多工单新建领料单高级搜索DS
const seniorSearchDS = () => ({
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: 'LMDS.SINGLE.ME_OU',
      ignore: 'always',
      required: true,
    },
    {
      name: 'ownerOrganizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
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
      ignore: 'always',
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('MO状态'),
      lookupCode: 'LMES.MO_STATUS',
      multiple: true,
      defaultValue: ['RELEASED'],
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'moTypeObj.documentTypeId',
    },
    {
      name: 'moTypeCode',
      type: 'string',
      bind: 'moTypeObj.documentTypeCode',
      ignore: 'always',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'meAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('车间'),
      lovCode: 'LMDS.ME_AREA',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
      },
    },
    {
      name: 'meAreaId',
      type: 'string',
      bind: 'meAreaObj.meAreaId',
    },
    {
      name: 'meAreaName',
      type: 'string',
      bind: 'meAreaObj.meAreaName',
    },
    {
      name: 'meAreaCode',
      type: 'string',
      bind: 'meAreaObj.meAreaCode',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
      },
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'customerName',
      label: intl.get(`${preCode}.customer`).d('客户'),
    },
    {
      name: 'soObj',
      type: 'object',
      label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
      lovCode: common.soNum,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
      },
    },
    {
      name: 'soId',
      type: 'string',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'soNum',
      type: 'string',
      bind: 'soObj.soHeaderNumber',
    },
    {
      name: 'demandObj',
      type: 'object',
      label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
      lovCode: common.demandNum,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('ownerOrganizationId'),
        }),
      },
    },
    {
      name: 'demandId',
      type: 'string',
      bind: 'demandObj.demandId',
    },
    {
      name: 'demandNum',
      type: 'string',
      bind: 'demandObj.demandNumber',
    },
    {
      name: 'projectNum',
      label: intl.get(`${preCode}.projectNum`).d('项目号'),
    },
    {
      name: 'planStartDateLeft',
      type: 'dateTime',
      label: intl.get(`${preCode}.startPlanDate`).d('计划开始时间>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('planStartDateRight')) {
            return 'planStartDateRight';
          }
        },
      },
    },
    {
      name: 'planStartDateRight',
      type: 'dateTime',
      label: intl.get(`${preCode}.endPlanDate`).d('计划开始时间<='),
      min: 'planStartDateLeft',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'topMoNumObj',
      type: 'object',
      label: intl.get(`${preCode}.topMo`).d('顶层MO'),
      lovCode: 'LMDS.DOCUMENT',
      lovPara: { documentClass: 'MO' },
    },
    {
      name: 'topMoNum',
      bind: 'topMoNumObj.documentNum',
    },
    {
      name: 'parentMoNumsObj',
      type: 'object',
      lovCode: 'LMDS.DOCUMENT',
      label: intl.get(`${preCode}.parentMos`).d('父MO'),
      lovPara: { documentClass: 'MO' },
    },
    {
      name: 'parentMoNums',
      bind: 'parentMoNumsObj.documentNum',
    },
  ],
  fields: [
    {
      label: 'MO号',
      name: 'moNum',
      type: 'string',
    },
    {
      name: 'moId',
      type: 'string',
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('MO状态'),
      lookupCode: 'LMES.MO_STATUS',
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
      name: 'makeQty',
      label: '制造数量',
    },
    {
      name: 'planSate',
      label: '计划时间',
    },
    {
      name: 'productPosition',
      label: '生产地点',
    },
    {
      name: 'customerName',
      label: intl.get(`${preCode}.customer`).d('客户'),
    },
    {
      name: 'projectNum',
      label: intl.get(`${preCode}.projectNum`).d('项目号'),
    },
    {
      name: 'soObj',
      type: 'object',
      label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
      lovCode: common.soNum,
      ignore: 'always',
    },
    {
      name: 'soId',
      type: 'string',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'soNum',
      type: 'string',
      bind: 'soObj.soHeaderNumber',
    },
    {
      name: 'demandObj',
      type: 'object',
      label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
      lovCode: common.demandNum,
      ignore: 'always',
    },
    {
      name: 'demandId',
      type: 'string',
      bind: 'demandObj.demandId',
    },
    {
      name: 'demandNum',
      type: 'string',
      bind: 'demandObj.demandNumber',
    },
    {
      name: 'topMoNum',
      type: 'string',
      label: intl.get(`${preCode}.topMo`).d('顶层MO'),
    },
    {
      name: 'parentMoNums',
      type: 'string',
      label: intl.get(`${preCode}.parentMos`).d('父MO'),
    },
    {
      name: 'remark',
      label: '备注',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { moStatus: moStatusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_LMES}/v1/${organizationId}/mos`, {
          moStatusList,
        }),
        data: {
          ...data,
          moStatus: undefined,
        },
        method: 'GET',
      };
    },
  },
});

// 委外订单领料单详情头DS
const outSourceDetailDS = () => ({
  primaryKey: 'requestId',
  autoCreate: true,
  children: {
    requestLeftLineList: new DataSet({ ...outSourceDetailLeftLineDS() }),
    requestLineList: new DataSet({ ...outSourceDetailLineDS() }),
  },
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.organization,
      label: intl.get(`${commonPrefix}.org`).d('组织'),
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
      name: 'poObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.po`).d('PO'),
      lovCode: lwmsIssueRequest.po,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: () => ({
          poTypeCode: 'OUTSOURCE_PO',
        }),
      },
    },
    {
      name: 'poId',
      bind: 'poObj.poId',
    },
    {
      name: 'poNum',
      bind: 'poObj.poNum',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.issueRequestNum`).d('领料单号'),
    },
    {
      name: 'creatorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.worker`).d('操作工'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
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
      name: 'wmMoveTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmMoveType,
      label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
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
      ignore: 'always',
      bind: 'wmMoveTypeObj.moveTypeName',
    },
    {
      name: 'planDemandDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.planDemandDate`).d('需求时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.fromWarehouse`).d('发出仓库'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
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
      ignore: 'always',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.fromWMArea`).d('发出货位'),
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('warehouseId')) {
            return {
              warehouseId: record.get('warehouseId'),
              organizationId: record.get('organizationId'),
            };
          } else {
            return { warehouseId: 'undefined', organizationId: 'undefined' };
          }
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
      ignore: 'always',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
  ],
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'organizationObj') {
        record.set('warehouseObj', null);
        if (dataSet && dataSet.children) {
          // dataSet.children.requestLeftLineList.records.clear();
          // dataSet.children.requestLineList.records.clear();
        }
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

const outSourceDetailLeftLineDS = () => ({
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'poLineId',
    },
    {
      name: 'poLineNum',
      label: intl.get(`${intlPrefix}.poLineNum`).d('行号'),
    },
    {
      name: 'itemCode',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料'),
    },
    {
      name: 'itemDescription',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料描述'),
    },
    {
      name: 'uomName',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'demandQty',
      label: intl.get(`${intlPrefix}.demandQty`).d('数量'),
    },
    {
      name: 'bomObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.bomObj`).d('物料BOM'),
      lovCode: lwmsIssueRequest.itemBom,
      textField: 'description',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record?.get('organizationId'),
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
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-lines`,
        data: {
          ...data,
        },
        method: 'GET',
      };
    },
  },
});

const outSourceDetailLineDS = () => ({
  fields: [
    {
      name: 'documentType',
      type: 'string',
    },
    {
      name: 'requestLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineNum`).d('行号'),
      order: 'asc',
    },
    {
      name: 'itemObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.item,
      label: intl.get(`${intlPrefix}.item`).d('物料'),
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
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料描述'),
      bind: 'itemObj.description',
      disabled: true,
    },
    {
      name: 'uomObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.uom,
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
      required: true,
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'uomObj.uomName',
    },
    {
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      min: 0,
      required: true,
    },
    {
      name: 'appliedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.claimedQty`).d('待申领数量'),
      // min: 0,
    },
    {
      name: 'demandQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      // min: 0,
    },
    {
      name: 'availableQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
      ignore: 'always',
      // min: 0,
    },
    {
      name: 'onhandQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
      ignore: 'always',
      // min: 0,
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          if (dataSet && dataSet.parent && dataSet.parent.current.get('organizationId')) {
            return { organizationId: dataSet.parent.current.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
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
      ignore: 'always',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
      cascadeMap: { warehouseObj: 'warehouseObj' },
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('warehouseId')) {
            return { warehouseId: record.get('warehouseId') };
          } else {
            return { warehouseId: 'undefined' };
          }
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
      ignore: 'always',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'wmMoveTypeObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmMoveType,
      label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      // required: true,
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
      ignore: 'always',
      bind: 'wmMoveTypeObj.moveTypeName',
    },
    {
      name: 'applyPackQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
      // required: true,
    },
    {
      name: 'applyWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
      // required: true,
    },
    {
      name: 'secondUomObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.uom,
    },
    {
      name: 'secondUomId',
      type: 'string',
      bind: 'secondUomObj.uomId',
    },
    {
      name: 'secondUom',
      type: 'string',
      bind: 'secondUomObj.uomCode',
      label: intl.get(`${intlPrefix}.secondUOM`).d('辅助单位'),
    },
    {
      name: 'secondUomName',
      type: 'string',
      bind: 'secondUomObj.uomName',
    },
    {
      name: 'secondApplyQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
      dynamicProps: {
        disabled: ({ record }) => !record.get('secondUomId'),
      },
    },
    {
      name: 'packingQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.packingQty`).d('包装数'),
      ignore: 'always',
    },
    {
      name: 'minPackingQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.minPackingQty`).d('最小包装数'),
      ignore: 'always',
    },
    {
      name: 'containerQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.containerQty`).d('装箱数'),
      ignore: 'always',
    },
    {
      name: 'palletContainerQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.palletContainerQty`).d('托盘箱数'),
      ignore: 'always',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tag`).d('指定标签'),
    },
  ],
  paging: false,
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

export {
  issueRequestPlatformDS,
  issueRequestLineDS,
  issueRequestDetailDS,
  summaryDetailDS,
  mulTableDS,
  seniorSearchDS,
  outSourceDetailDS,
  outSourceDetailLeftLineDS,
  outSourceDetailLineDS,
};
