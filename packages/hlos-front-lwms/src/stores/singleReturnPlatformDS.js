/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-11 14:32:36
 * @LastEditTime: 2020-10-22 16:27:28
 * @Description:退料单平台DS
 */
import { DataSet } from 'choerodon-ui/pro';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  generateUrlWithGetParam,
} from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lwms.singleReturnPlatform.model';
const commonPrefix = 'lwms.common.model';
const { common, lwmsSingleReturnPlatform } = codeConfig.code;
const headerQueryUrl = `${HLOS_LWMS}/v1/${organizationId}/request-headers/return-request-header`;
const lineQueryUrl = `${HLOS_LWMS}/v1/${organizationId}/request-lines/return-request-line`;

const getCommonFields = (isQueryFields) => [
  {
    name: 'organizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.org`).d('组织'),
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
    name: 'returnRequestObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.returnRequest`).d('退料单号'),
    lovCode: lwmsSingleReturnPlatform.returnRequestNum,
    cascadeMap: { organizationId: 'organizationId' },
  },
  {
    name: 'requestId',
    type: 'string',
    bind: 'returnRequestObj.requestId',
  },
  {
    name: 'requestNum',
    type: 'string',
    bind: 'returnRequestObj.requestNum',
  },
  {
    name: 'moObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.moNum`).d('来源单据'),
    lovCode: common.mo,
  },
  {
    name: 'moId',
    type: 'string',
    bind: 'moObj.moId',
  },
  {
    name: 'moNum',
    type: 'string',
    bind: 'moObj.moNum',
  },
  {
    name: 'documentTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.documentType`).d('退料单类型'),
    lovCode: common.documentType,
    lovPara: {
      documentClass: 'WM_RETURNED',
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
    name: 'requestStatusList',
    type: 'string',
    multiple: true,
    defaultValue: isQueryFields ? ['COMPLETED', 'NEW'] : [],
    lookupCode: lwmsSingleReturnPlatform.returnRequestStatus,
    label: intl.get(`${intlPrefix}.transferRequestStatus`).d('退料单状态'),
  },
  {
    name: 'fromWareHouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.fromWareHouseObj`).d('来源仓库'),
    lovCode: common.warehouse,
  },
  {
    name: 'warehouseName',
    type: 'string',
    bind: 'fromWareHouseObj.warehouseName',
    ignore: 'always',
  },
  {
    name: 'warehouseName',
    type: 'string',
    bind: 'fromWareHouseObj.warehouseName',
    ignore: 'always',
  },
  {
    name: 'warehouseCode',
    type: 'string',
    bind: 'fromWareHouseObj.warehouseCode',
  },
  {
    name: 'warehouseId',
    type: 'string',
    bind: 'fromWareHouseObj.warehouseId',
  },
  {
    name: 'fromWmAreaObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { warehouseId: 'warehouseId' },
    label: intl.get(`${intlPrefix}.fromWmAreaObj`).d('来源货位'),
    lovCode: common.wmArea,
  },
  {
    name: 'wmAreaName',
    type: 'string',
    bind: 'fromWmAreaObj.wmAreaName',
    ignore: 'always',
  },
  {
    name: 'wmAreaCode',
    type: 'string',
    bind: 'fromWmAreaObj.wmAreaCode',
  },
  {
    name: 'wmAreaId',
    type: 'string',
    bind: 'fromWmAreaObj.wmAreaId',
  },
  {
    name: 'locationName',
    type: 'string',
    label: intl.get(`${intlPrefix}.location`).d('来源地点'),
  },
  {
    name: 'toWareHouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.toWareHouseObj`).d('目标仓库'),
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
    name: 'toWmAreaObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    cascadeMap: { warehouseId: 'toWarehouseId' },
    label: intl.get(`${intlPrefix}.toWmAreaObj`).d('目标货位'),
    lovCode: common.wmArea,
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
    name: 'toWmAreaCode',
    type: 'string',
    bind: 'toWmAreaObj.wmAreaCode',
  },
  {
    name: 'workerObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.worker`).d('退料员工'),
    lovCode: common.worker,
  },
  {
    name: 'returnedWorkerId',
    type: 'string',
    bind: 'workerObj.workerId',
  },
  {
    name: 'returnedWorkerCode',
    type: 'string',
    bind: 'workerObj.workerCode',
  },
  {
    name: 'returnedWorkerName',
    type: 'string',
    bind: 'workerObj.workerName',
    ignore: 'always',
  },
  {
    name: 'requestReason',
    type: 'string',
    label: intl.get(`${intlPrefix}.returnedReason`).d('退料原因'),
  },
  {
    name: 'returnedTimeStart',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.startTime`).d('退料时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('returnedTimeEnd')) {
          return 'returnedTimeEnd';
        }
      },
    },
  },
  {
    name: 'returnedTimeEnd',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.endTime`).d('退料时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('returnedTimeStart')) {
          return 'returnedTimeStart';
        }
      },
    },
  },
  {
    name: 'printedFlag',
    type: 'string',
    label: intl.get(`${intlPrefix}.printedFlag`).d('打印标识'),
    lookupCode: common.flag,
  },
  {
    name: 'printedDateStart',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.printedDateStart`).d('打印时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('printedDateEnd')) {
          return 'printedDateEnd';
        }
      },
    },
  },
  {
    name: 'printedDateEnd',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.printedDateEnd`).d('打印时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('printedDateStart')) {
          return 'printedDateStart';
        }
      },
    },
  },
];

const commonFields = [
  {
    name: 'warehouse',
    type: 'string',
    label: intl.get(`${intlPrefix}.warehouse`).d('来源仓库'),
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
    name: 'wmArea',
    type: 'string',
    label: intl.get(`${intlPrefix}.wmArea`).d('来源货位'),
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
    name: 'toWarehouse',
    type: 'string',
    label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
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
    name: 'toWmArea',
    type: 'string',
    label: intl.get(`${intlPrefix}.toWarehouse`).d('目标货位'),
  },
  {
    name: 'toWmAreaId',
    type: 'string',
  },
  {
    name: 'toWmAreaCode',
    type: 'string',
  },
];

const lineCommonFields = [
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
  // {
  //   name: 'operation',
  //   type: 'string',
  //   label: intl.get(`${intlPrefix}.operation`).d('工序'),
  // },
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
    name: 'uomCode',
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
    precision: 0.000001,
    step: 0.000001,
    required: true,
  },
  {
    name: 'claimedQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.claimedQty`).d('待申领数量'),
    min: 0,
  },
  {
    name: 'demandQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
    min: 0,
  },
  {
    name: 'availableQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
    min: 0,
  },
  {
    name: 'onhandQty',
    type: 'number',
    label: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
    min: 0,
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
    // required: true,
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
    cascadeMap: { warehouseId: 'warehouseId' },
    // required: true,
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
  },
  {
    name: 'toWarehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
    dynamicProps: {
      lovPara: ({ dataSet }) => {
        if (dataSet && dataSet.parent && dataSet.parent.current.get('organizationId')) {
          return { organizationId: dataSet.parent.current.get('organizationId') };
        } else {
          return { organizationId: 'undefined' };
        }
      },
      disabled: ({ dataSet }) =>
        dataSet && dataSet.parent && dataSet.parent.current.get('toWarehouseId'),
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
    label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
    cascadeMap: { warehouseId: 'toWarehouseId' },
    dynamicProps: {
      lovPara: ({ record }) => {
        if (record.get('warehouseId')) {
          return { warehouseId: record.get('toWarehouseId') };
        } else {
          return { warehouseId: 'undefined' };
        }
      },
      disabled: ({ dataSet }) =>
        dataSet && dataSet.parent && dataSet.parent.current.get('toWmAreaId'),
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
    name: 'itemControlType',
    type: 'string',
    lookupCode: common.itemControlType,
    label: intl.get(`${intlPrefix}.itemControlType`).d('物料控制类型'),
    disabled: true,
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
  {
    name: 'lotNumber',
    type: 'string',
    label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    // bind: 'lotObj.lotNumber',
  },
  {
    name: 'tagCode',
    type: 'string',
    label: intl.get(`${intlPrefix}.tag`).d('指定标签'),
    // bind: 'tagObj.tagCode',
  },
];
// 退料单列表头ds
const singleReturnPlatformDS = () => ({
  autoQuery: false,
  selection: 'multiple',
  pageSize: 100,
  queryFields: getCommonFields(true),
  fields: [
    ...commonFields,
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${intlPrefix}.org`).d('组织'),
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
      label: intl.get(`${intlPrefix}.requestNum`).d('退料单号'),
    },
    {
      name: 'requestTypeId',
      type: 'string',
    },
    {
      name: 'requestTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestTypeName`).d('退料单类型'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.moNum`).d('来源单据'),
    },
    {
      name: 'requestStatus',
      type: 'string',
      lookupCode: lwmsSingleReturnPlatform.returnRequestStatus,
      label: intl.get(`${intlPrefix}.requestStatus`).d('退料单状态'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.locationName`).d('来源地点'),
    },
    {
      name: 'locationId',
      type: 'string',
    },
    {
      name: 'returnedWorkerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.returnedWorker`).d('退料员工'),
    },
    {
      name: 'requestReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.returnedReason`).d('退料原因'),
    },
    {
      name: 'returnedTime',
      type: 'date',
      label: intl.get(`${intlPrefix}.returnedTime`).d('退料时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'printedFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.returnedTime`).d('打印标识'),
    },
    {
      name: 'printedDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.printedDate`).d('打印时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: generateUrlWithGetParam(headerQueryUrl, {
          requestStatusList: data.requestStatusList,
        }),
        params: {
          page: data.page || 0,
          size: data.size || 100,
        },
        data: {
          ...data,
          requestStatusList: null,
        },
        method: 'GET',
        paramsSerializer: (params) => {
          const tmpParams = filterNullValueObject(params);
          const queryParams = new URLSearchParams();
          Object.keys(tmpParams).forEach((key) => {
            queryParams.append(key, tmpParams[key]);
          });
          queryParams.append('requestOperationType', 'RETURN');
          return queryParams.toString();
        },
      };
    },
  },
});
// 退料单列表行ds
const singleReturnLineDS = () => ({
  pageSize: 100,
  selection: false,
  fields: [
    ...commonFields,
    {
      name: 'requestLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestLineNum`).d('No.'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${intlPrefix}.operation`).d('工序'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
    },
    {
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.applyQty`).d('退料数量'),
    },
    {
      name: 'requestLineStatus',
      type: 'string',
      lookupCode: common.requestLineStatus,
      label: intl.get(`${intlPrefix}.requestLineStatus`).d('行状态'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.workcellName`).d('来源工位'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.locationName`).d('来源地点'),
    },
    {
      name: 'toWorkcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.toWorkcell`).d('目标工位'),
    },
    {
      name: 'toLocation',
      type: 'string',
      label: intl.get(`${intlPrefix}.toLocation`).d('目标地点'),
    },
    {
      name: 'wmMoveTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tagCode`).d('指定标签'),
    },
    {
      name: 'costCenter',
      type: 'string',
      label: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
    },
    {
      name: 'itemControlTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemControlTypeMeaning`).d('物料控制类型'),
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
      name: 'partyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyName`).d('指定供应商'),
    },
    {
      name: 'sourceDocTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
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
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalNum`).d('外部单据号'),
    },
    {
      name: 'externalLineId',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalLineId`).d('外部行ID'),
    },
    {
      name: 'externalLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalLineNum`).d('外部行ID'),
    },
    {
      name: 'pickedFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.pickedFlag`).d('拣料标识'),
    },
    {
      name: 'externalLineId',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalLineId`).d('外部行ID'),
    },
    {
      name: 'pickedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.pickedQty`).d('拣料数量'),
    },
    {
      name: 'executedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.executedQty`).d('退料数量'),
    },
    {
      name: 'confirmedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.confirmedQty`).d('接收数量'),
    },
    {
      name: 'pickedWorkerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.pickedWorkerName`).d('退料员工'),
    },
    {
      name: 'pickRule',
      type: 'string',
      label: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
    },
    {
      name: 'reservationRule',
      type: 'string',
      label: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tagCode`).d('指定标签'),
    },
    {
      name: 'returnedWorkerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.returnedWorker`).d('退料员工'),
    },
    {
      name: 'returnedTime',
      type: 'date',
      label: intl.get(`${intlPrefix}.returnedTime`).d('退料时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
  ],
  transport: {
    read: ({ data }) => ({
      url: lineQueryUrl,
      method: 'GET',
      params: {
        page: data.page || 0,
        size: data.size || 100,
      },
    }),
  },
});
// 退料单详情头DS
const singleReturnDetailDS = () => ({
  primaryKey: 'requestId',
  autoCreate: true,
  children: {
    requestLineList: new DataSet({ ...singleReturnDetailLineDS() }),
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
      name: 'issueRequestObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: lwmsSingleReturnPlatform.issueRequest,
      label: intl.get(`${intlPrefix}.issueRequestType`).d('领料单'),
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          requestStatusList: 'Y',
        }),
      },
    },
    {
      name: 'issueRequestId',
      type: 'string',
      bind: 'issueRequestObj.requestId',
    },
    {
      name: 'issueRequestNum',
      type: 'string',
      bind: 'issueRequestObj.requestNum',
    },
    {
      name: 'assemblyItemId',
      type: 'string',
      bind: 'issueRequestObj.assemblyItemId',
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      bind: 'issueRequestObj.assemblyItemCode',
    },
    {
      name: 'assemblyItemName',
      type: 'string',
      label: intl.get(`${intlPrefix}.assemblyItemName`).d('装配件'),
      bind: 'issueRequestObj.assemblyItemName',
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'issueRequestObj.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.moNum`).d('工单'),
      bind: 'issueRequestObj.moNum',
    },
    {
      name: 'wmRequestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.wmRequestNum`).d('退料单号'),
      // required: true,
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
      name: 'docProcessRuleId',
      type: 'string',
      ignore: 'always',
      // bind: 'requestTypeObj.docProcessRuleId',
    },
    {
      name: 'docProcessRule',
      type: 'string',
      ignore: 'always',
      // bind: 'requestTypeObj.docProcessRule',
    },
    {
      name: 'planDemandDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.planDemandDate`).d('需求时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'creatorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.creator`).d('操作工'),
      cascadeMap: { organizationId: 'organizationId' },
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
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
      cascadeMap: { organizationId: 'organizationId' },
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
      cascadeMap: { warehouseId: 'warehouseId' },
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
      name: 'toWarehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
      cascadeMap: { organizationId: 'organizationId' },
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
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
  ],
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'organizationObj') {
        record.set('warehouseObj', null);
        record.set('toWarehouseObj', null);
        record.set('creatorObj', null);
        record.set('issueRequestObj', null);
        record.set('wmRequestNum', null);
        record.set('wmMoveTypeObj', null);
        record.set('remark', null);
        record.set('planDemandDate', null);
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'issueRequestObj') {
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
    },
  },
});
const singleReturnDetailLineDS = () => ({
  fields: lineCommonFields,
  paging: false,
  events: {
    update: ({ dataSet, value, name, record }) => {
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'applyQty') {
        if (value > 0) {
          dataSet.select(record);
        } else {
          dataSet.unSelect(record);
        }
      }
    },
  },
});
// 生产订单退料单详情头DS
const requestReturnDetailDS = () => ({
  primaryKey: 'requestId',
  autoCreate: true,
  children: {
    requestLineList: new DataSet({ ...requestReturnDetailLineDS() }),
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
    {
      name: 'sourceDocTypeId',
      type: 'string',
      bind: 'moNumObj.moTypeId',
    },
    {
      name: 'sourceDocTypeCode',
      type: 'string',
      bind: 'moNumObj.moTypeCode',
    },
    {
      name: 'assemblyItemId',
      type: 'string',
      bind: 'moNumObj.assemblyItemId',
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      bind: 'moNumObj.assemblyItemCode',
    },
    {
      name: 'assemblyItemName',
      type: 'string',
      label: intl.get(`${intlPrefix}.assemblyItemName`).d('装配件'),
      bind: 'moNumObj.assemblyItemName',
    },
    {
      name: 'wmRequestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.wmRequestNum`).d('退料单号'),
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
      name: 'docProcessRuleId',
      type: 'string',
      ignore: 'always',
    },
    {
      name: 'docProcessRule',
      type: 'string',
      ignore: 'always',
    },
    {
      name: 'creatorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.creator`).d('操作工'),
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'creatorId',
      type: 'string',
      bind: 'creatorObj.workerId',
    },
    {
      name: 'creator',
      type: 'string',
      bind: 'creatorObj.workerName',
    },
    {
      name: 'requestReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.returnedReason`).d('退料原因'),
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.warehouse`).d('退料仓库'),
      cascadeMap: { organizationId: 'organizationId' },
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
      label: intl.get(`${intlPrefix}.wmArea`).d('退料货位'),
      cascadeMap: { warehouseId: 'warehouseId' },
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
      name: 'toWarehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
      cascadeMap: { organizationId: 'organizationId' },
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
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
  ],
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'organizationObj') {
        record.set('moNumObj', null);
        record.set('wmRequestNum', null);
        record.set('wmMoveTypeObj', null);
        record.set('creatorObj', null);
        record.set('requestReason', null);
        record.set('warehouseObj', null);
        record.set('toWarehouseObj', null);
        record.set('issueRequestObj', null);
        record.set('remark', null);
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'moNumObj') {
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
    },
  },
});
const requestReturnDetailLineDS = () => ({
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
      label: intl.get(`${intlPrefix}.returnQty`).d('退料数量'),
      min: 0,
      // max: 'returnableQty',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'returnableQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.returnableQty`).d('可退料数量'),
      ignore: 'always',
    },
    {
      name: 'appliedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.appliedQty`).d('已领料数量'),
    },
    {
      name: 'meIssuedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.meIssuedQty`).d('已消耗数量'),
      ignore: 'always',
    },
    {
      name: 'lineRequestReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.retuenReason`).d('退货原因'),
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.warehouse`).d('退货仓库'),
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
      label: intl.get(`${intlPrefix}.wmArea`).d('退货货位'),
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
      name: 'availableQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
      ignore: 'always',
    },
    {
      name: 'onhandQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
      ignore: 'always',
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
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
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'applyPackQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyPackQty`).d('退料包装数量'),
    },
    {
      name: 'applyWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyWeight`).d('退料重量'),
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
      bind: 'wmInspectRuleObj.ruleId',
    },
    {
      name: 'wmInspectRule',
      label: intl.get(`${intlPrefix}.wmInspectRule`).d('仓库检验规则'),
      bind: 'wmInspectRuleObj.ruleCode',
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineRemark`).d('备注'),
    },
  ],
  paging: false,
  events: {
    update: ({ dataSet, value, name, record }) => {
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'applyQty') {
        if (value > 0) {
          dataSet.select(record);
        } else {
          dataSet.unSelect(record);
        }
      }
    },
  },
});
// 委外领料退料单详情头DS
const outSourceReturnDetailDS = () => ({
  primaryKey: 'requestId',
  autoCreate: true,
  children: {
    requestLineList: new DataSet({ ...outSourceReturnDetailLineDS() }),
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
      name: 'issueRequestObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: lwmsSingleReturnPlatform.issueRequest,
      label: intl.get(`${intlPrefix}.issueRequestType`).d('领料单'),
      required: true,
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
      name: 'issueRequestId',
      type: 'string',
      bind: 'issueRequestObj.requestId',
    },
    {
      name: 'issueRequestNum',
      type: 'string',
      bind: 'issueRequestObj.requestNum',
    },
    {
      name: 'sourceDocTypeId',
      type: 'string',
      bind: 'issueRequestObj.requestTypeId',
    },
    {
      name: 'sourceDocTypeCode',
      type: 'string',
      bind: 'issueRequestObj.requestTypeCode',
    },
    {
      name: 'outSourceOrder',
      type: 'string',
      label: intl.get(`${intlPrefix}.outSourceOrder`).d('委外订单'),
      bind: 'issueRequestObj.sourceDocNum',
    },
    {
      name: 'assemblyItemId',
      type: 'string',
      bind: 'issueRequestObj.assemblyItemId',
    },
    {
      name: 'assemblyItemCode',
      type: 'string',
      bind: 'issueRequestObj.assemblyItemCode',
    },
    {
      name: 'assemblyItemName',
      type: 'string',
      label: intl.get(`${intlPrefix}.assemblyItemName`).d('装配件'),
      bind: 'issueRequestObj.assemblyItemName',
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'issueRequestObj.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.moNum`).d('工单'),
      bind: 'issueRequestObj.moNum',
    },
    {
      name: 'wmRequestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.wmRequestNum`).d('退料单号'),
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
      label: intl.get(`${intlPrefix}.creator`).d('操作工'),
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'creatorId',
      type: 'string',
      bind: 'creatorObj.workerId',
    },
    {
      name: 'creator',
      type: 'string',
      bind: 'creatorObj.workerName',
    },
    {
      name: 'planDemandDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.planDemandDate`).d('预计到达时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
      cascadeMap: { organizationId: 'organizationId' },
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
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'docProcessRuleId',
      type: 'string',
      ignore: 'always',
    },
    {
      name: 'docProcessRule',
      type: 'string',
      ignore: 'always',
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
        record.set('issueRequestObj', null);
        record.set('wmRequestNum', null);
        record.set('wmMoveTypeObj', null);
        record.set('creatorObj', null);
        record.set('planDemandDate', null);
        record.set('toWarehouseObj', null);
        record.set('remark', null);
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'issueRequestObj') {
        if (dataSet && dataSet.children) {
          dataSet.children.requestLineList.records.clear();
        }
      }
    },
  },
});
const outSourceReturnDetailLineDS = () => ({
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
      name: 'itemControlType',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemControlType`).d('物料控制类型'),
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
      // max: 'returnableQty',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'claimedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.claimedQty`).d('待申领数量'),
      min: 0,
    },
    {
      name: 'demandQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      min: 0,
    },
    {
      name: 'applyPackQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
    },
    {
      name: 'applyWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
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
      label: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
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
      name: 'wmInspectRuleObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.wmInspectRule`).d('检验规则'),
      lovCode: common.rule,
      ignore: 'always',
    },
    {
      name: 'wmInspectRuleId',
      bind: 'wmInspectRuleObj.ruleId',
    },
    {
      name: 'wmInspectRule',
      label: intl.get(`${intlPrefix}.wmInspectRule`).d('检验规则'),
      bind: 'wmInspectRuleObj.ruleCode',
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
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineRemark`).d('备注'),
    },
  ],
  paging: false,
  events: {
    update: ({ dataSet, value, name, record }) => {
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'applyQty') {
        if (value > 0) {
          dataSet.select(record);
        } else {
          dataSet.unSelect(record);
        }
      }
    },
  },
});
export {
  singleReturnPlatformDS,
  singleReturnLineDS,
  singleReturnDetailDS,
  requestReturnDetailDS,
  requestReturnDetailLineDS,
  outSourceReturnDetailDS,
  outSourceReturnDetailLineDS,
};
