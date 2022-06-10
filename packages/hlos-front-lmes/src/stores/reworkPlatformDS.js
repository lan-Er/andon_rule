/*
 * @Description: 返修任务平台-DS
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-11 10:01:51
 * @LastEditors: Please set LastEditors
 */

import moment from 'moment';
import { isEmpty } from 'lodash';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';
import DataSet from 'choerodon-ui/pro/lib/data-set';

const organizationId = getCurrentOrganizationId();

const { common, lmesReworkPlatform } = codeConfig.code;

const preCode = 'lmes.reworkPlatform.model';
const commonCode = 'lmes.common.model';

const commonFields = [
  {
    name: 'organizationName',
    label: intl.get(`${commonCode}.org`).d('组织'),
  },
  {
    name: 'taskNum',
    label: intl.get(`${preCode}.taskNum`).d('任务号'),
  },
  {
    name: 'productCode',
    label: intl.get(`${commonCode}.item`).d('物料'),
  },
  {
    name: 'productDescription',
    label: intl.get(`${commonCode}.description`).d('描述'),
  },
  {
    name: 'operation',
    label: intl.get(`${preCode}.operation`).d('工序'),
  },
  {
    name: 'uomName',
    label: intl.get(`${preCode}.uom`).d('单位'),
  },
  {
    name: 'reworkQty',
    label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
  },
  {
    name: 'taskQty',
    label: intl.get(`${preCode}.taskQty`).d('任务数量'),
  },
  {
    name: 'reworkRule',
    label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
  },
  {
    name: 'firstOperationFlag',
    label: intl.get(`${preCode}.firstOperation`).d('首工序'),
  },
  {
    name: 'lastOperationFlag',
    label: intl.get(`${preCode}.lastOperation `).d('末工序'),
  },
  {
    name: 'relatedTask',
    label: intl.get(`${preCode}.relatedTask`).d('关联任务'),
  },
  {
    name: 'taskStatusMeaning',
    label: intl.get(`${preCode}.taskStatus`).d('状态'),
  },
  {
    name: 'prodLineName',
    label: intl.get(`${preCode}.prodLine`).d('生产线'),
  },
  {
    name: 'equipmentName',
    label: intl.get(`${preCode}.equipment`).d('设备'),
  },
  {
    name: 'workcellName',
    label: intl.get(`${preCode}.workcell`).d('工位'),
  },
  {
    name: 'workerGroupName',
    label: intl.get(`${preCode}.workerGroup`).d('班组'),
  },
  {
    name: 'workerName',
    label: intl.get(`${preCode}.worker`).d('操作工'),
  },

  {
    name: 'actualStartTime',
    label: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
  },
  {
    name: 'actualEndTime',
    label: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
  },
];
const ListDS = () => {
  return {
    selection: 'multiple',
    primaryKey: 'taskId',
    children: {
      lineList: new DataSet(LineDS()),
    },
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        noCache: true,
        // required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        noCache: true,
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
      },
      {
        name: 'socDocumentObj',
        type: 'object',
        label: intl.get(`${preCode}.socDocumentNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            documentClass: 'MO',
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'sourceDocId',
        bind: 'socDocumentObj.documentId',
      },
      {
        name: 'sourceDocNum',
        bind: 'socDocumentObj.documentNum',
      },
      {
        name: 'documentObj',
        type: 'object',
        label: intl.get(`${preCode}.taskNum`).d('任务号'),
        lovCode: common.document,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            documentClass: 'TASK',
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'taskId',
        type: 'string',
        bind: 'documentObj.documentId',
      },
      {
        name: 'taskNum',
        type: 'string',
        bind: 'documentObj.documentNum',
      },
      {
        name: 'operationObj',
        type: 'object',
        label: intl.get(`${commonCode}.operation`).d('工序'),
        lovCode: common.operation,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'operationId',
        bind: 'operationObj.operationId',
      },
      {
        name: 'operationName',
        bind: 'operationObj.operationName',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        lovCode: common.prodLine,
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            prodLineId: record.get('prodLineId'),
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
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            prodLineId: record.get('prodLineId'),
          }),
        },
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
        name: 'actualEndTimeLeft',
        type: 'dateTime',
        label: intl.get(`${preCode}.actualEndTime`).d('实际结束<='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'actualEndTimeRight',
        type: 'dateTime',
        label: intl.get(`${preCode}.actualEndTime`).d('实际结束>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'reworkUnprocessedFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.reworkUnHandle`).d('返修未处理'),
      },
    ],
    fields: [
      ...commonFields,
      {
        name: 'reworkOperation',
        label: intl.get(`${preCode}.reworkOperation`).d('返修工序'),
      },
      {
        name: 'taskDescription',
        label: intl.get(`${preCode}.taskDesc`).d('任务描述'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${preCode}.documentNum`).d('来源单据号'),
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
        name: 'sourceTaskNum',
        label: intl.get(`${preCode}.sourceTaskNum`).d('来源任务'),
      },
      {
        name: 'taskTypeName',
        label: intl.get(`${preCode}.taskType`).d('任务类型'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/tasks/query-rework-task`,
          method: 'GET',
        };
      },
    },
  };
};
const LineDS = () => {
  return {
    primaryKey: 'taskId',
    selection: false,
    fields: [
      ...commonFields,
      {
        name: 'executableQty',
        label: intl.get(`${preCode}.executableQty`).d('可执行数量'),
      },
      {
        name: 'processOkQty',
        label: intl.get(`${preCode}.processOkQty`).d('合格'),
      },
      {
        name: 'processNgQty',
        label: intl.get(`${preCode}.processNgQty`).d('不合格'),
      },
      {
        name: 'scrappedQty',
        label: intl.get(`${preCode}.scrappedQty`).d('报废'),
      },
      {
        name: 'pendingQty',
        label: intl.get(`${preCode}.pendingQty`).d('待定'),
      },
      {
        name: 'wipQty',
        label: intl.get(`${preCode}.wipQty`).d('在制'),
      },
      {
        name: 'executeRule',
        label: intl.get(`${preCode}.executeRule`).d('执行规则'),
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
        name: 'resourceName',
        label: intl.get(`${preCode}.resource`).d('资源'),
      },
      {
        name: 'locationName',
        label: intl.get(`${preCode}.location`).d('地点'),
      },
      {
        name: 'calendarDay',
        label: intl.get(`${preCode}.calendarDay`).d('指定日期'),
      },
      {
        name: 'calendarShiftCode',
        label: intl.get(`${preCode}.calendarShiftCode`).d('指定班次'),
      },
      {
        name: 'planStartTime',
        label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      },
      {
        name: 'planEndTime',
        label: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
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
        label: intl.get(`${preCode}.transactionTime`).d('累计产出时间'),
      },
      {
        name: 'priority',
        label: intl.get(`${preCode}.priority`).d('优先级'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { taskId } = data;
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/tasks/query-rework-task`,
          data: {
            sourceTaskId: taskId,
          },
          method: 'GET',
        };
      },
    },
  };
};

const OperationDS = () => ({
  autoCreate: true,
  children: {
    createReworkTaskLineDTOList: new DataSet(OperationLineDS()),
  },
  fields: [
    {
      name: 'reworkQty',
      type: 'number',
      label: intl.get(`${preCode}.reworkQty`).d('本次返修数量'),
      required: true,
    },
    {
      name: 'sourceItemId',
    },
    {
      name: 'sourceTaskId',
    },
  ],
  // transport: {
  //   submit: ({data}) => {
  //     return {
  //       url: `${HLOS_LMES}/v1/${organizationId}/tasks/create-rework-task`,
  //       data: data[0],
  //       method: 'POST',
  //     };
  //   },
  // },
});
const OperationLineDS = () => ({
  selection: 'multiple',
  primaryKey: 'operationId',
  fields: [
    {
      name: 'sequenceNum',
      type: 'string',
      label: intl.get(`${preCode}.sequenceNum`).d('序号'),
      required: true,
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${commonCode}.standardOperation`).d('标准工序'),
      lovCode: common.operation,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'operationId',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationCode',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operationName`).d('工序名称'),
      bind: 'operationObj.operationName',
    },
    {
      name: 'operationAlias',
      type: 'string',
      label: intl.get(`${preCode}.operationAlias`).d('工序简称'),
      bind: 'operationObj.operationAlias',
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.operationDesc`).d('工序描述'),
      bind: 'operationObj.description',
    },
    {
      name: 'operationType',
      type: 'string',
      label: intl.get(`${preCode}.operationType`).d('工序类型'),
      lookupCode: lmesReworkPlatform.operationType,
      bind: 'operationObj.operationType',
      required: true,
    },
    {
      name: 'keyOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyOperationFlag`).d('关键工序'),
      bind: 'operationObj.keyOperationFlag',
    },
    {
      name: 'firstOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.firstOperationFlag`).d('首工序'),
      bind: 'operationObj.firstOperationFlag',
    },
    {
      name: 'lastOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.lastOperationFlag`).d('末工序'),
      bind: 'operationObj.lastOperationFlag',
    },
    {
      name: 'executeRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: common.rule,
      textField: 'ruleJson',
      ignore: 'always',
      // 限定规则类型为EXECUTE
      lovPara: {
        ruleType: 'EXECUTE',
      },
    },
    {
      name: 'executeRuleId',
      type: 'string',
      bind: 'executeRuleObj.ruleId',
    },
    {
      name: 'executeRule',
      type: 'string',
      bind: 'executeRuleObj.ruleJson',
    },
    {
      name: 'executeRuleName',
      type: 'string',
      bind: 'executeRuleObj.ruleName',
    },
    {
      name: 'inspectionRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      lovCode: common.rule,
      textField: 'ruleJson',
      ignore: 'always',
      // 限定规则类型为INSPECTION
      lovPara: {
        ruleType: 'INSPECTION',
      },
    },
    {
      name: 'inspectionRuleId',
      type: 'string',
      bind: 'inspectionRuleObj.ruleId',
    },
    {
      name: 'inspectionRule',
      type: 'string',
      bind: 'inspectionRuleObj.ruleJson',
    },
    {
      name: 'inspectionRuleName',
      type: 'string',
      bind: 'inspectionRuleObj.ruleName',
    },
    {
      name: 'preSequenceNum',
      type: 'string',
      label: intl.get(`${preCode}.preSequenceNum`).d('前工序'),
    },
    {
      name: 'downstreamOperation',
      type: 'string',
      label: intl.get(`${preCode}.downstreamOperation`).d('下游工序'),
    },
    {
      name: 'operationGroup',
      type: 'string',
      label: intl.get(`${preCode}.operationGroup`).d('工序组'),
    },
    {
      name: 'reworkOperation',
      type: 'string',
      label: intl.get(`${preCode}.reworkOperation`).d('返工工序'),
    },
    {
      name: 'processTime',
      type: 'number',
      label: intl.get(`${preCode}.processTime`).d('加工时间'),
      validator: positiveNumberValidator,
      bind: 'operationObj.processTime',
    },
    {
      name: 'standardWorkTime',
      type: 'number',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      validator: positiveNumberValidator,
      bind: 'operationObj.standardWorkTime',
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${preCode}.standardWorkTime`).d('参考文件'),
      bind: 'operationObj.referenceDocument',
    },
    {
      name: 'processProgram',
      type: 'string',
      label: intl.get(`${preCode}.processProgram`).d('加工程序'),
      bind: 'operationObj.processProgram',
    },
    {
      name: 'collectorObj',
      type: 'object',
      label: intl.get(`${preCode}.collector`).d('数据收集'),
      lovCode: common.collector,
      ignore: 'always',
    },
    {
      name: 'collectorId',
      type: 'string',
      bind: 'collectorObj.collectorId',
    },
    {
      name: 'collectorName',
      type: 'string',
      bind: 'collectorObj.collectorName',
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${preCode}.instruction`).d('工艺路线说明'),
      bind: 'operationObj.instruction',
    },
    {
      name: 'dispatchRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      lovCode: common.rule,
      textField: 'ruleJson',
      ignore: 'always',
      // 限定规则类型为DISPATCH
      lovPara: {
        ruleType: 'DISPATCH',
      },
    },
    {
      name: 'dispatchRuleId',
      type: 'string',
      bind: 'dispatchRuleObj.ruleId',
    },
    {
      name: 'dispatchRule',
      type: 'string',
      bind: 'dispatchRuleObj.ruleJson',
    },
    {
      name: 'dispatchRuleName',
      type: 'string',
      bind: 'dispatchRuleObj.ruleName',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('装箱打包规则'),
      lovCode: common.rule,
      textField: 'ruleJson',
      ignore: 'always',
      // 限定规则类型为PACKING
      lovPara: {
        ruleType: 'PACKING',
      },
    },
    {
      name: 'packingRuleId',
      type: 'string',
      bind: 'packingRuleObj.ruleId',
    },
    {
      name: 'packingRule',
      type: 'string',
      bind: 'packingRuleObj.ruleJson',
    },
    {
      name: 'packingRuleName',
      type: 'string',
      bind: 'packingRuleObj.ruleName',
    },
    {
      name: 'reworkRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      lovCode: common.rule,
      textField: 'ruleJson',
      ignore: 'always',
      // 限定规则类型为REWORK
      lovPara: {
        ruleType: 'REWORK',
      },
    },
    {
      name: 'reworkRuleId',
      type: 'string',
      bind: 'reworkRuleObj.ruleId',
    },
    {
      name: 'reworkRule',
      type: 'string',
      bind: 'reworkRuleObj.ruleJson',
    },
    {
      name: 'reworkRuleName',
      type: 'string',
      bind: 'reworkRuleObj.ruleName',
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部序号'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/mo-operations`,
        method: 'GET',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      const operationObj = record.get('operationObj');
      if (name === 'operationObj' && !isEmpty(operationObj)) {
        const {
          collectorId,
          collectorName,
          executeRuleId,
          executeRuleName,
          inspectionRuleId,
          inspectionRuleName,
          dispatchRuleId,
          dispatchRuleName,
          packingRuleId,
          packingRuleName,
          reworkRuleId,
          reworkRuleName,
          operationType,
          keyOperationFlag,
        } = operationObj;
        record.set('collectorObj', {
          collectorId,
          collectorName,
        });
        record.set('executeRuleObj', {
          ruleId: executeRuleId,
          ruleName: executeRuleName,
        });
        record.set('inspectionRuleObj', {
          ruleId: inspectionRuleId,
          ruleName: inspectionRuleName,
        });
        record.set('dispatchRuleObj', {
          ruleId: dispatchRuleId,
          ruleName: dispatchRuleName,
        });
        record.set('packingRuleObj', {
          ruleId: packingRuleId,
          ruleName: packingRuleName,
        });
        record.set('reworkRuleObj', {
          ruleId: reworkRuleId,
          ruleName: reworkRuleName,
        });
        record.set('routingOperationType', operationType);
        record.set('keyOperationFlag', !!keyOperationFlag);
      }
    },
  },
});

export { ListDS, OperationDS };
