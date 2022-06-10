/**
 * @Description: 生产任务管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:54:36
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesTask, lmesMoComponent, lmesMoWorkspace } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.productionTask.model';
const tpmCode = 'lmes.tpmTask.model';
const commonCode = 'lmes.common.model';

const commonItemFields = [
  {
    name: 'taskQty',
    type: 'number',
    label: intl.get(`${preCode}.taskQty`).d('任务数量'),
    min: 0,
    required: true,
  },
  {
    name: 'maxQty',
    type: 'number',
    label: intl.get(`${preCode}.maxQty`).d('最大数量'),
    min: 'taskQty',
  },
  {
    name: 'executableQty',
    type: 'number',
    label: intl.get(`${preCode}.executableQty`).d('可执行数量'),
    min: 0,
    transformRequest: (val, obj) => {
      return val || obj.data.suggestQty || obj.data.taskQty;
    },
  },
  {
    name: 'suggestQty',
    type: 'number',
    label: intl.get(`${preCode}.suggestQty`).d('建议数量'),
    min: 0,
  },
  {
    name: 'processOkQty',
    label: intl.get(`${preCode}.processOkQty`).d('合格数量'),
  },
  {
    name: 'processNgQty',
    label: intl.get(`${preCode}.processNgQty`).d('不合格数量'),
  },
  {
    name: 'scrappedQty',
    label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
  },
  {
    name: 'rawNgQty',
    label: intl.get(`${preCode}.rawNgQty`).d('来料不合格'),
  },
  {
    name: 'reworkQty',
    label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
  },
  {
    name: 'pendingQty',
    label: intl.get(`${preCode}.pendingQty`).d('待处理数量'),
  },
  {
    name: 'wipQty',
    label: intl.get(`${preCode}.wipQty`).d('在制品数量'),
  },
  {
    name: 'itemUsage',
    label: intl.get(`${preCode}.usage`).d('单位用量'),
  },
  {
    name: 'bomUsage',
    label: intl.get(`${preCode}.bomUsage`).d('BOM用量'),
  },
];
const commonStepFields = [
  {
    name: 'taskStepNum',
    type: 'number',
    label: intl.get(`${preCode}.lineNum`).d('行号'),
    min: 0,
    step: 1,
    required: true,
  },
  {
    name: 'taskStepCode',
    type: 'string',
    label: intl.get(`${preCode}.step`).d('步骤'),
    required: true,
  },
  {
    name: 'taskStepName',
    type: 'string',
    label: intl.get(`${preCode}.stepName`).d('步骤名称'),
    required: true,
  },
  {
    name: 'taskStepAlias',
    type: 'string',
    label: intl.get(`${preCode}.stepAlias`).d('步骤简称'),
  },
  {
    name: 'description',
    type: 'string',
    label: intl.get(`${commonCode}.description`).d('描述'),
  },
  {
    name: 'taskStepType',
    type: 'string',
    label: intl.get(`${preCode}.stepType`).d('步骤类型'),
    lookupCode: lmesTask.steptype,
    required: true,
  },
  {
    name: 'taskStepTypeMeaning',
    label: intl.get(`${preCode}.stepType`).d('步骤类型'),
  },
  {
    name: 'keyStepFlag',
    type: 'boolean',
    label: intl.get(`${preCode}.keyStepFlag`).d('关键步骤'),
  },
  {
    name: 'processRuleObj',
    type: 'object',
    label: intl.get(`${preCode}.processRule`).d('处理规则'),
    lovCode: common.rule,
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'processRuleId',
    bind: 'processRuleObj.ruleId',
  },
  {
    name: 'processRule',
    label: intl.get(`${preCode}.processRule`).d('处理规则'),
    bind: 'processRuleObj.ruleName',
  },
  {
    name: 'collectorObj',
    type: 'object',
    label: intl.get(`${preCode}.collector`).d('数据收集'),
    lovCode: common.collector,
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'collectorId',
    bind: 'collectorObj.collectorId',
  },
  {
    name: 'collector',
    label: intl.get(`${preCode}.collector`).d('数据收集'),
    bind: 'collectorObj.collectorName',
  },
  {
    name: 'sourceTypeObj',
    type: 'object',
    label: intl.get(`${tpmCode}.sourceType`).d('来源类型'),
    lovCode: common.documentType,
    textField: 'documentTypeName',
    ignore: 'always',
    required: true,
    noCache: true,
  },
  {
    name: 'sourceTypeId',
    bind: 'sourceTypeObj.documentTypeId',
  },
  {
    name: 'sourceType',
    bind: 'sourceTypeObj.documentTypeCode',
  },
  {
    name: 'sourceTypeName',
    label: intl.get(`${tpmCode}.sourceType`).d('来源类型'),
    bind: 'sourceTypeObj.documentTypeName',
  },
  {
    name: 'sourceNumObj',
    type: 'object',
    label: intl.get(`${tpmCode}.sourceNum`).d('来源编号'),
    lovCode: common.document,
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        sourceDocTypeId: record.get('sourceTypeId'),
      }),
    },
    noCache: true,
  },
  {
    name: 'sourceId',
    bind: 'sourceNumObj.documentId',
  },
  {
    name: 'sourceNum',
    label: intl.get(`${preCode}.sourceNum`).d('来源编号'),
    bind: 'sourceNumObj.documentNum',
  },
  {
    name: 'externalId',
    type: 'string',
    label: intl.get(`${preCode}.externalId`).d('外部ID'),
  },
  {
    name: 'externalNum',
    type: 'string',
    label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
  },
  {
    name: 'stepRemark',
    type: 'string',
    label: intl.get(`${commonCode}.stepRemark`).d('备注'),
  },
  {
    name: 'enabledFlag',
    type: 'boolean',
    label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
    defaultValue: true,
  },
];

const ProductionTaskQueryDS = () => {
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
        // required: true,
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
        name: 'taskObj',
        type: 'object',
        label: intl.get(`${tpmCode}.taskNum`).d('任务号'),
        lovCode: common.taskAll,
        ignore: 'always',
      },
      {
        name: 'taskId',
        type: 'string',
        bind: 'taskObj.taskId',
      },
      {
        name: 'taskNum',
        type: 'string',
        bind: 'taskObj.taskNumber',
      },
      {
        name: 'productObj',
        type: 'object',
        label: intl.get(`${preCode}.product`).d('产品'),
        lovCode: common.item,
        ignore: 'always',
      },
      {
        name: 'productId',
        type: 'string',
        bind: 'productObj.itemId',
      },
      {
        name: 'productCode',
        type: 'string',
        bind: 'productObj.itemCode',
        ignore: 'always',
      },
      {
        name: 'taskStatus',
        type: 'string',
        label: intl.get(`${tpmCode}.taskStatus`).d('任务状态'),
        lookupCode: lmesTask.taskStatus,
        multiple: true,
        defaultValue: [
          'NEW',
          'RELEASED',
          'DISPATCHED',
          'QUEUING',
          'RUNNING',
          'PAUSE',
          'PENDING',
          'COMPLETED',
        ],
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        ignore: 'always',
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
        name: 'produceLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
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
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workcellId',
        type: 'string',
        bind: 'workcellObj.workcellId',
      },
      {
        name: 'workcellName',
        type: 'string',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },
      {
        name: 'taskTypeObj',
        type: 'object',
        label: intl.get(`${tpmCode}.taskType`).d('任务类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'TASK' },
        textField: 'documentTypeName',
        ignore: 'always',
      },
      {
        name: 'taskTypeId',
        type: 'string',
        bind: 'taskTypeObj.documentTypeId',
      },
      {
        name: 'taskTypeName',
        type: 'string',
        bind: 'taskTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${commonCode}.worker`).d('操作工'),
        lovCode: common.worker,
        ignore: 'always',
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'workerGroupObj',
        type: 'object',
        label: intl.get(`${commonCode}.workGroup`).d('班组'),
        lovCode: common.workerGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workerGroupId',
        type: 'string',
        bind: 'workerGroupObj.workerGroupId',
      },
      {
        name: 'workerGroupName',
        type: 'string',
        bind: 'workerGroupObj.workerGroupName',
        ignore: 'always',
      },
      {
        name: 'sourceTaskObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceTask`).d('来源任务'),
        lovCode: common.taskAll,
        ignore: 'always',
      },
      {
        name: 'sourceTaskId',
        type: 'string',
        bind: 'sourceTaskObj.taskId',
      },
      {
        name: 'sourceTaskNum',
        type: 'string',
        bind: 'sourceTaskObj.taskNumber',
      },
      {
        name: 'taskGroup',
        type: 'string',
        label: intl.get(`${tpmCode}.taskGroup`).d('任务组'),
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${tpmCode}.sourceDocType`).d('来源单据类型'),
        lovCode: common.documentType,
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'documentTypeName',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeName',
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${tpmCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sourceDocTypeId: record.get('sourceDocTypeId'),
          }),
        },
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'documentLineNum',
        type: 'number',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        min: 0,
      },
      {
        name: 'operation',
        type: 'string',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'startDateStart',
        type: 'dateTime',
        label: intl.get(`${tpmCode}.planStartDateLeft`).d('计划开始>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('startDateEnd')) {
              return 'startDateEnd';
            }
          },
        },
      },
      {
        name: 'startDateEnd',
        type: 'dateTime',
        label: intl.get(`${tpmCode}.planStartDateRight`).d('计划开始<='),
        min: 'startDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'endDateStart',
        type: 'dateTime',
        label: intl.get(`${tpmCode}.planEndDateLeft`).d('计划结束>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('endDateEnd')) {
              return 'endDateEnd';
            }
          },
        },
      },
      {
        name: 'endDateEnd',
        type: 'dateTime',
        label: intl.get(`${tpmCode}.planEndDateRight`).d('计划结束<='),
        min: 'endDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'actualStartTimeLeft',
        type: 'dateTime',
        label: intl.get(`${tpmCode}.realStartTimeStart`).d('实际开始时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('actualStartTimeRight')) {
              return 'actualStartTimeRight';
            }
          },
        },
      },
      {
        name: 'actualStartTimeRight',
        type: 'dateTime',
        label: intl.get(`${tpmCode}.realStartTimeEnd`).d('实际开始时间<='),
        min: 'actualStartTimeLeft',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'organizationObj') {
          record.set('prodLineObj', null);
          record.set('equipmentObj', null);
          record.set('workcellObj', null);
          record.set('workerGroupObj', null);
        }
      },
    },
  };
};

const ItemLineListDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      ...commonItemFields,
      {
        name: 'itemLineTypeMeaning',
        label: intl.get(`${preCode}.itemLineType`).d('类型'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'uomName',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'warehouse',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        transformResponse: (val, object) =>
          val || `${object.warehouseCode || ''}\n${object.warehouseName || ''}`,
      },
      {
        name: 'wmArea',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
        transformResponse: (val, object) =>
          val || `${object.wmAreaCode || ''}\n${object.warehouseName || ''}`,
      },
      {
        name: 'supplyTypeMeaning',
        label: intl.get(`${commonCode}.supplyType`).d('供应类型'),
      },
      {
        name: 'itemControlTypeMeaning',
        label: intl.get(`${commonCode}.itemControltype`).d('物料控制类型'),
      },
      {
        name: 'executeControlTypeMeaning',
        label: intl.get(`${commonCode}.executeControlType`).d('限制类型'),
      },
      {
        name: 'executeControlValue',
        label: intl.get(`${commonCode}.executeControlValue`).d('限制值'),
      },
      {
        name: 'linePriority',
        label: intl.get(`${tpmCode}.priority`).d('优先级'),
      },
      {
        name: 'lineRemark',
        label: intl.get(`${preCode}.lineRemark`).d('行备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/task-items`,
          data: {
            ...data,
            allFlag: true,
          },
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
    },
  };
};

const StepLineListDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: commonStepFields,
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/task-steps/list`,
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
    },
  };
};

const ProductionTaskListDS = () => {
  return {
    selection: 'multiple',
    pageSize: 100,
    primaryKey: 'taskId',
    // children: {
    //   taskItems: new DataSet(itemLineListDS()),
    //   taskSteps: new DataSet(stepLineListDS()),
    // },
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
        transformResponse: (val, object) =>
          val || `${object.organizationCode || ''}\n${object.organizationName || ''}`,
      },
      {
        name: 'taskNum',
        label: intl.get(`${tpmCode}.taskNum`).d('任务号'),
      },
      {
        name: 'product',
        label: intl.get(`${preCode}.product`).d('产品'),
        transformResponse: (val, object) =>
          val || `${object.productCode || ''}\n${object.itemDescription || ''}`,
      },
      {
        name: 'operation',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${tpmCode}.documentNum`).d('来源单据号'),
      },
      {
        name: 'documentLineNum',
        label: intl.get(`${preCode}.documentLineNum`).d('来源单据行号'),
      },
      {
        name: 'documentTypeName',
        label: intl.get(`${preCode}.documentType`).d('来源单据类型'),
      },
      {
        name: 'taskTypeName',
        label: intl.get(`${tpmCode}.taskType`).d('任务类型'),
      },
      {
        name: 'taskStatusMeaning',
        label: intl.get(`${tpmCode}.taskStatus`).d('任务状态'),
      },
      {
        name: 'sourceTaskNum',
        label: intl.get(`${preCode}.sourceTask`).d('来源任务'),
      },
      {
        name: 'relatedTask',
        label: intl.get(`${preCode}.relatedTask`).d('关联任务'),
      },
      {
        name: 'taskGroup',
        label: intl.get(`${tpmCode}.taskGroup`).d('任务组'),
      },
      {
        name: 'description',
        label: intl.get(`${commonCode}.description`).d('描述'),
      },
      {
        name: 'referenceDocument',
        label: intl.get(`${tpmCode}.referenceDoc`).d('参考文件'),
      },
      {
        name: 'processProgram',
        label: intl.get(`${preCode}.processProgram`).d('加工程序'),
      },
      {
        name: 'collector',
        label: intl.get(`${preCode}.collector`).d('数据收集'),
      },
      {
        name: 'instruction',
        label: intl.get(`${preCode}.instruction`).d('工序说明'),
      },
      {
        name: 'preOperation',
        label: intl.get(`${preCode}.preOperation`).d('前序工序'),
      },
      {
        name: 'reworkOperation',
        label: intl.get(`${preCode}.reworkOperation`).d('返修工序'),
      },
      {
        name: 'downstreamOperation',
        label: intl.get(`${preCode}.downstreamOperation`).d('下游工序'),
      },
      {
        name: 'firstOperationFlag',
        label: intl.get(`${preCode}.firstOperation`).d('首工序'),
      },
      {
        name: 'lastOperationFlag',
        label: intl.get(`${preCode}.lastOperation`).d('末工序'),
      },
      {
        name: 'exceptionName',
        label: intl.get(`${preCode}.exception`).d('返修原因'),
      },
      {
        name: 'reworkProcessedFlag',
        label: intl.get(`${preCode}.reworkProcessedFlag`).d('返修处理'),
      },
      {
        name: 'firstReworkFlag',
        label: intl.get(`${preCode}.firstReworkFlag`).d('返修首工序'),
      },
      {
        name: 'lastReworkFlag',
        label: intl.get(`${preCode}.lastReworkFlag`).d('返修末工序'),
      },
      {
        name: 'outsideFlag',
        label: intl.get(`${preCode}.outsideFlag`).d('外协任务'),
      },
      {
        name: 'taskRank',
        label: intl.get(`${preCode}.taskRank`).d('优先等级'),
      },
      {
        name: 'taskSpectralColor',
        label: intl.get(`${preCode}.taskSpectralColor`).d('特殊任务'),
      },
      {
        name: 'printedFlag',
        label: intl.get(`${tpmCode}.printedFlag`).d('打印标识'),
      },
      {
        name: 'printedDate',
        label: intl.get(`${tpmCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'docProcessRule',
        label: intl.get(`${tpmCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'externalId',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'externalLineId',
        label: intl.get(`${commonCode}.externalLineId`).d('外部行ID'),
      },
      {
        name: 'externalLineNum',
        label: intl.get(`${commonCode}.externalLineNum`).d('外部单据行号'),
      },
      {
        name: 'produceLineName',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      },
      {
        name: 'equipmentName',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
      },
      {
        name: 'workcellName',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
      },
      {
        name: 'workerGroupName',
        label: intl.get(`${commonCode}.workGroup`).d('班组'),
      },
      {
        name: 'workerName',
        label: intl.get(`${commonCode}.worker`).d('操作工'),
      },
      {
        name: 'resourceName',
        label: intl.get(`${commonCode}.resource`).d('资源'),
      },
      {
        name: 'locationName',
        label: intl.get(`${commonCode}.location`).d('地点'),
      },
      {
        name: 'calendarDay',
        label: intl.get(`${tpmCode}.calendarDay`).d('指定日期'),
      },
      {
        name: 'calendarShiftCode',
        label: intl.get(`${tpmCode}.calendarShift`).d('指定班次'),
      },
      {
        name: 'planStartTime',
        label: intl.get(`${tpmCode}.planStartDate`).d('计划开始时间'),
      },
      {
        name: 'planEndTime',
        label: intl.get(`${tpmCode}.planEndDate`).d('计划结束时间'),
      },
      {
        name: 'actualStartTime',
        label: intl.get(`${tpmCode}.actualStartDate`).d('实际开始时间'),
      },
      {
        name: 'actualEndTime',
        label: intl.get(`${tpmCode}.actualEndDate`).d('实际结束时间'),
      },
      {
        name: 'standardWorkTime',
        label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      },
      {
        name: 'planProcessTime',
        label: intl.get(`${preCode}.planProcessTime`).d('计划加工时间'),
      },
      {
        name: 'processedTime',
        label: intl.get(`${preCode}.processedTime`).d('实际加工时间'),
      },
      {
        name: 'transactionTime',
        label: intl.get(`${preCode}.transationTime`).d('累计产出时间'),
      },
      {
        name: 'executeRule',
        label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      },
      {
        name: 'inspectionRule',
        label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      },
      {
        name: 'dispatchRule',
        label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      },
      {
        name: 'packingRule',
        label: intl.get(`${preCode}.packingRule`).d('包装规则'),
      },
      {
        name: 'reworkRule',
        label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      },
      {
        name: 'priority',
        label: intl.get(`${tpmCode}.priority`).d('优先级'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { taskStatus: statusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LMES}/v1/${organizationId}/tasks/query-product`, {
            statusList,
          }),
          data: {
            ...data,
            taskStatus: undefined,
          },
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
    },
  };
};

const itemLineDetailDS = () => ({
  selection: false,
  fields: [
    ...commonItemFields,
    {
      name: 'itemLineType',
      type: 'string',
      label: intl.get(`${preCode}.itemLineType`).d('类型'),
      lookupCode: lmesTask.itemType,
      required: true,
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      required: true,
      noCache: true,
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
      name: 'itemDescription',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.description',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.uom`).d('主单位'),
      lovCode: 'LMDS.UOM',
      ignore: 'always',
      required: true,
      noCache: true,
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
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ dataSet }) => ({
          organizationId: dataSet?.parent?.current?.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
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
      noCache: true,
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
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'supplyType',
      type: 'string',
      label: intl.get(`${commonCode}.supplyType`).d('供应类型'),
      lookupCode: lmesMoComponent.supplyType,
      required: true,
    },
    {
      name: 'itemControlType',
      type: 'string',
      label: intl.get(`${commonCode}.itemControltype`).d('物料控制类型'),
      lookupCode: common.itemControlType,
      required: true,
    },
    {
      name: 'executeControlType',
      type: 'string',
      label: intl.get(`${commonCode}.executeControlType`).d('限制类型'),
      lookupCode: lmesMoWorkspace.completeControlType,
      required: true,
    },
    {
      name: 'executeControlValue',
      label: intl.get(`${commonCode}.executeControlValue`).d('限制值'),
    },
    {
      name: 'linePriority',
      label: intl.get(`${tpmCode}.priority`).d('优先级'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/task-items/list`,
        method: 'GET',
      };
    },
  },
});

const stepLineDetailDS = () => ({
  selection: false,
  fields: commonStepFields,
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/task-steps/list`,
        method: 'GET',
      };
    },
  },
});

const ProductionTaskDetailDS = () => ({
  selection: false,
  pageSize: 10,
  primaryKey: 'taskId',
  children: {
    taskItems: new DataSet(itemLineDetailDS()),
    taskSteps: new DataSet(stepLineDetailDS()),
  },
  fields: [
    {
      name: 'orgObj',
      type: 'object',
      label: intl.get(`${preCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      bind: 'orgObj.meOuId',
    },
    {
      name: 'organizationCode',
      bind: 'orgObj.meOuCode',
    },
    {
      name: 'organizationName',
      bind: 'orgObj.organizationName',
    },
    {
      name: 'taskTypeObj',
      type: 'object',
      label: intl.get(`${tpmCode}.taskType`).d('任务类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'TASK' },
      textField: 'documentTypeName',
      ignore: 'always',
      required: true,
    },
    {
      name: 'taskTypeId',
      bind: 'taskTypeObj.documentTypeId',
    },
    {
      name: 'taskTypeCode',
      bind: 'taskTypeObj.documentTypeCode',
    },
    {
      name: 'taskTypeName',
      bind: 'taskTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${tpmCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'operationId',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operation',
      bind: 'operationObj.operationName',
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.description`).d('描述'),
    },
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${tpmCode}.taskNum`).d('任务号'),
      // 如果“单据处理规则”中task_num为manual则为必输，其他情况下不可输入
    },
    {
      name: 'sourceDocTypeObj',
      type: 'object',
      label: intl.get(`${tpmCode}.sourceDocType`).d('来源单据类型'),
      lovCode: common.documentType,
      textField: 'documentTypeName',
      ignore: 'always',
    },
    {
      name: 'documentTypeId',
      bind: 'sourceDocTypeObj.documentTypeId',
    },
    {
      name: 'documentTypeCode',
      bind: 'sourceDocTypeObj.documentTypeCode',
    },
    {
      name: 'documentTypeName',
      bind: 'sourceDocTypeObj.documentTypeName',
    },
    {
      name: 'sourceDocObj',
      type: 'object',
      label: intl.get(`${tpmCode}.sourceDocNum`).d('来源单据号'),
      lovCode: common.document,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          sourceDocTypeId: record.get('documentTypeId'),
        }),
      },
    },
    {
      name: 'documentId',
      bind: 'sourceDocObj.documentId',
    },
    {
      name: 'documentNum',
      bind: 'sourceDocObj.documentNum',
    },
    {
      name: 'sourceDocLineObj',
      type: 'object',
      label: intl.get(`${preCode}.documentLineNum`).d('来源单据行号'),
      lovCode: common.documentLine,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          sourceDocNum: record.get('documentNum'),
        }),
      },
    },
    {
      name: 'documentLineId',
      bind: 'sourceDocLineObj.documentLineId',
    },
    {
      name: 'documentLineNum',
      bind: 'sourceDocLineObj.documentLineNum',
    },
    {
      name: 'downstreamOperationObj',
      type: 'object',
      label: intl.get(`${tpmCode}.downstreamOperation`).d('下游工序'),
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'downstreamOperationId',
      bind: 'downstreamOperationObj.operationId',
    },
    {
      name: 'downstreamOperation',
      bind: 'downstreamOperationObj.operationName',
    },
    {
      name: 'reworkOperationObj',
      type: 'object',
      label: intl.get(`${preCode}.reworkOperation`).d('返修工序'),
      lovCode: common.operation,
      ignore: 'always',
      // 若上方有值则默认获取工序值
    },
    {
      name: 'reworkOperationId',
      bind: 'reworkOperationObj.operationId',
    },
    {
      name: 'reworkOperation',
      bind: 'reworkOperationObj.operationName',
    },
    {
      name: 'firstOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.firstOperationFlag`).d('首工序标识'),
    },
    {
      name: 'lastOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.lastOperationFlag`).d('末工序标识'),
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${tpmCode}.taskStatus`).d('任务状态'),
      lookupCode: lmesTask.taskStatus,
      defaultValue: 'NEW',
    },
    {
      name: 'sourceTaskObj',
      type: 'object',
      label: intl.get(`${preCode}.sourceTask`).d('来源任务'),
      lovCode: common.task,
      ignore: 'always',
    },
    {
      name: 'sourceTaskId',
      bind: 'sourceTaskObj.taskId',
    },
    {
      name: 'sourceTaskNum',
      bind: 'sourceTaskObj.taskNumber',
    },
    {
      name: 'relatedTaskObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedTask`).d('关联任务'),
      lovCode: common.task,
      ignore: 'always',
    },
    {
      name: 'relatedTaskId',
      bind: 'relatedTaskObj.taskId',
    },
    {
      name: 'relatedTask',
      bind: 'relatedTaskObj.taskNumber',
    },
    {
      name: 'taskGroup',
      type: 'string',
      label: intl.get(`${tpmCode}.taskGroup`).d('任务组'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'produceLineName',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工作单元'),
      lovCode: common.workcell,
      ignore: 'always',
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${commonCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          workcellId: record.get('workcellId'),
        }),
      },
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentName',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${commonCode}.workGroup`).d('班组'),
      lovCode: common.workerGroup,
      ignore: 'always',
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroupName',
      bind: 'workerGroupObj.workerGroupName',
      ignore: 'always',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${commonCode}.resource`).d('资源'),
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'resourceId',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceName',
      bind: 'resourceObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'calendarDay',
      type: 'date',
      label: intl.get(`${tpmCode}.calendarDay`).d('指定日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'calendarShiftCode',
      type: 'string',
      label: intl.get(`${tpmCode}.calendarShift`).d('指定班次'),
      lookupCode: common.shift,
    },
    {
      name: 'standardWorkTime',
      type: 'number',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      min: 0,
    },
    {
      name: 'planStartTime',
      type: 'dateTime',
      label: intl.get(`${tpmCode}.planStartDate`).d('计划开始时间'),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('planEndTime')) {
            return 'planEndTime';
          }
        },
      },
    },
    {
      name: 'planEndTime',
      type: 'dateTime',
      label: intl.get(`${tpmCode}.planEndDate`).d('计划结束时间'),
      min: 'planStartTime',
    },
    {
      name: 'planProcessTime',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${tpmCode}.planProcessTime`).d('计划处理时间'),
    },
    {
      name: 'executeRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为EXECUTE
      lovPara: {
        ruleType: 'EXECUTE',
      },
    },
    {
      name: 'executeRuleId',
      bind: 'executeRuleObj.ruleId',
    },
    {
      name: 'executeRuleName',
      bind: 'executeRuleObj.ruleName',
    },
    {
      name: 'executeRule',
      bind: 'executeRuleObj.ruleJson',
    },
    {
      name: 'inspectionRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为INSPECTION
      lovPara: {
        ruleType: 'INSPECTION',
      },
    },
    {
      name: 'inspectionRuleId',
      bind: 'inspectionRuleObj.ruleId',
    },
    {
      name: 'inspectionRuleName',
      bind: 'inspectionRuleObj.ruleName',
    },
    {
      name: 'inspectionRule',
      bind: 'inspectionRuleObj.ruleJson',
    },
    {
      name: 'dispatchRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为DISPATCH
      lovPara: {
        ruleType: 'DISPATCH',
      },
    },
    {
      name: 'dispatchRuleId',
      bind: 'dispatchRuleObj.ruleId',
    },
    {
      name: 'dispatchRule',
      bind: 'dispatchRuleObj.ruleJson',
    },
    {
      name: 'dispatchRuleName',
      bind: 'dispatchRuleObj.ruleName',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('包装规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为PACKING
      lovPara: {
        ruleType: 'PACKING',
      },
    },
    {
      name: 'packingRuleId',
      bind: 'packingRuleObj.ruleId',
    },
    {
      name: 'packingRule',
      bind: 'packingRuleObj.ruleJson',
    },
    {
      name: 'packingRuleName',
      bind: 'packingRuleObj.ruleName',
    },
    {
      name: 'reworkRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为REWORK
      lovPara: {
        ruleType: 'REWORK',
      },
    },
    {
      name: 'reworkRuleId',
      bind: 'reworkRuleObj.ruleId',
    },
    {
      name: 'reworkRule',
      bind: 'reworkRuleObj.ruleJson',
    },
    {
      name: 'reworkRuleName',
      bind: 'reworkRuleObj.ruleName',
    },
    {
      name: 'priority',
      type: 'number',
      label: intl.get(`${tpmCode}.taskPriority`).d('任务优先级'),
      min: 0,
      step: 1,
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${commonCode}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部编码'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
    {
      name: 'docProcessRule',
      label: intl.get(`${tpmCode}.docProcessRule`).d('单据处理规则'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/tasks`,
        data: {
          ...data,
          showOperationName: true,
        },
        method: 'GET',
      };
    },
    create: ({ data }) => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/create-task`,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => {
      const list = [];
      data.forEach((i) => {
        const { taskItems, taskSteps, ...params } = i;
        list.push({
          ...params,
          taskItemList: taskItems,
          taskItemStepList: taskSteps,
        });
      });
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/tasks/update-task`,
        data: list,
        method: 'POST',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'sourceDocTypeObj') {
        record.set('sourceDocObj', null);
        record.set('sourceDocLineObj', null);
      }
      if (name === 'sourceDocObj') {
        record.set('sourceDocLineObj', null);
      }
      if (name === 'operationObj') {
        record.set('reworkOperationObj', record.get('operationObj'));
      }
      if (name === 'workcellObj') {
        record.set('equipmentObj', null);
      }
    },
  },
});

const ModalDS = () => ({
  fields: [
    {
      name: 'taskRank',
      type: 'string',
      label: intl.get(`${preCode}.taskRank`).d('任务等级'),
      lookupCode: lmesTask.taskRank,
      required: true,
    },
  ],
});

export {
  ProductionTaskListDS,
  ProductionTaskQueryDS,
  ModalDS,
  ItemLineListDS,
  StepLineListDS,
  ProductionTaskDetailDS,
};
