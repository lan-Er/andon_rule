import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';
import { DataSet } from 'choerodon-ui/pro';

import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const preCode = 'neway.moOperation';
const commonCode = 'neway.common.model';
const { common } = codeConfig.code;

const ListTableDs = () => ({
  selection: false,
  autoQuery: false,
  queryFields: [
    {
      name: 'organizationLov',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationLov.meOuId',
    },
    {
      name: 'moNumLov',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('工单号'),
      lovCode: 'LMES.MO',
      ignore: 'always',
      // multiple: true,
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'documentId',
      type: 'string',
      bind: 'moNumLov.moId',
    },
    {
      name: 'taskLov',
      type: 'object',
      label: intl.get(`${preCode}.taskNum`).d('任务号'),
      lovCode: 'LMES.TASK',
      ignore: 'always',
    },
    {
      name: 'taskNum',
      type: 'string',
      bind: 'taskLov.taskNumber',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.organizationName`).d('工厂'),
    },
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
    },
    {
      name: 'productCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${commonCode}.itemDescription`).d('物料描述'),
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'uom',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'reworkQty',
      type: 'string',
      label: intl.get(`${preCode}.reworkQty`).d('可返修数量'),
    },
    {
      name: 'taskQty',
      type: 'string',
      label: intl.get(`${preCode}.planEndDate`).d('任务数量'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.taskDescription`).d('任务描述'),
    },
    {
      name: 'documentNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceTaskNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceTask`).d('来源任务'),
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: 'LMES.TASK_STATUS',
    },
    {
      name: 'firstOperationFlag',
      type: 'string',
      label: intl.get(`${preCode}.firstOperationFlag`).d('首工序标识'),
    },
    {
      name: 'lastOperationFlag',
      type: 'string',
      label: intl.get(`${preCode}.lastOperationFlag`).d('末工序标识'),
    },
    {
      name: 'workCenterName',
      type: 'string',
      label: intl.get(`${preCode}.workCenter`).d('工作中心'),
    },
    {
      name: 'workGroupName',
      type: 'string',
      label: intl.get(`${preCode}.workerGroup`).d('班组'),
    },
    {
      name: 'workName',
      type: 'string',
      label: intl.get(`${preCode}.worker`).d('操作工'),
    },
    {
      name: 'actualStartTime',
      type: 'string',
      label: intl.get(`${preCode}.actuallyStartTime`).d('实际开始时间'),
    },
    {
      name: 'actualEndTime',
      type: 'string',
      label: intl.get(`${preCode}.actuallyEndTime`).d('实际结束时间'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-rework/tasks`,
        data,
        method: 'GET',
      };
    },
  },
});

const ReworkOrderDs = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.organizationName`).d('工厂'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('生产订单号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}}.item`).d('物料'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${commonCode}.itemDescription`).d('物料描述'),
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${commonCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
    {
      name: 'moTypeName',
      type: 'string',
      label: intl.get(`${commonCode}.moType`).d('工单类型'),
    },
    {
      name: 'demandQty',
      label: intl.get(`${commonCode}.demandQty`).d('需求数量'),
      type: 'string',
    },
    {
      name: 'uom',
      label: intl.get(`${commonCode}.uom`).d('单位'),
      type: 'string',
    },
    {
      name: 'remark',
      label: intl.get(`${commonCode}.taskDescription`).d('任务描述'),
      type: 'string',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'actualCompletedQty',
      type: 'string',
      label: intl.get(`${commonCode}.completedQty`).d('已完成数量'),
    },
    {
      name: 'completedQty',
      type: 'string',
      label: intl.get(`${commonCode}.qualifiedQty`).d('合格数量'),
    },
    {
      name: 'scrappedQty',
      type: 'string',
      label: intl.get(`${commonCode}.scrappedQty`).d('报废数量'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-rework/mos`,
        method: 'GET',
      };
    },
  },
});

const CreateFormDs = () => ({
  selection: false,
  autoQuery: false,
  autoCreate: false,
  children: {
    moOperationList: new DataSet({ ...CreateTableDs() }),
  },
  fields: [
    {
      name: 'reworkQty',
      type: 'string',
      label: intl.get(`${commonCode}.reworkQty`).d('本次返修数量'),
      required: true,
    },
    {
      name: 'actualReworkQty',
      type: 'string',
      label: intl.get(`${commonCode}.reworkableQty`).d('可返修数量'),
    },
    {
      name: 'routingLov',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('返修工艺路线'),
      lovCode: 'LMDS.ROUTING',
      ignore: 'always',
      lovPara: {
        routingType: 'REWORK',
      },
    },
    {
      name: 'routingId',
      type: 'string',
      bind: 'routingLov.routingId',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/list-neway-mo`,
        data,
        method: 'GET',
      };
    },
    submit: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-rework/create`,
        data: data[0],
        method: 'POST',
      };
    },
  },
});

const CreateTableDs = () => ({
  selection: 'multiple',
  autoQuery: false,
  paging: false,
  fields: [
    {
      name: 'sequenceNum',
      type: 'number',
      label: intl.get(`${commonCode}.reworkQty`).d('序号'),
      required: true,
    },
    {
      name: 'operationLov',
      type: 'object',
      label: intl.get(`${commonCode}.reworkableQty`).d('标准工序'),
      lovCode: 'LMDS.OPERATION',
      required: true,
      ignore: 'always',
      textField: 'operationCode',
    },
    {
      name: 'operationCode',
      bind: 'operationLov.operationCode',
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('工序名称'),
      bind: 'operationLov.operationName',
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.description`).d('工序描述'),
      bind: 'operationLov.description',
    },
    {
      name: 'operationTypeMeaning',
      type: 'string',
      label: intl.get(`${commonCode}.operationType`).d('工序类型'),
      bind: 'operationLov.operationTypeMeaning',
    },
    {
      name: 'keyOperationFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.keyOperationFlag`).d('关键工序标识'),
      bind: 'operationLov.keyOperationFlag',
      trueValue: 1,
      falseValue: 0,
      disabled: true,
    },
    {
      name: 'firstOperationFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.firstOperationFlag`).d('首工序标识'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 0,
    },
    {
      name: 'lastOperationFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.lastOperationFlag`).d('末工序标识'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 0,
    },
    {
      name: 'preSequenceNum',
      type: 'string',
      label: intl.get(`${commonCode}.preSequenceNum`).d('前工序'),
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: intl.get(`${commonCode}.reworkableQty`).d('标准工时(min)'),
      required: true,
      bind: 'operationLov.standardWorkTime',
    },
    {
      name: 'processTime',
      type: 'string',
      label: intl.get(`${commonCode}.processTime`).d('实际工时(min)'),
      required: true,
      bind: 'operationLov.processTime',
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${commonCode}.referenceDocument`).d('参考文件'),
      bind: 'operationLov.referenceDocument',
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${commonCode}.instruction`).d('工序说明'),
      bind: 'operationLov.instruction',
    },
    {
      name: 'executeRuleLov',
      type: 'object',
      label: intl.get(`${commonCode}.executeRule`).d('执行规则'),
      lovCode: 'LMDS.RULE',
      ignore: 'always',
      lovPara: { ruleType: 'EXECUTE' },
    },
    {
      name: 'executeRuleId',
      type: 'string',
      bind: 'executeRuleLov.executeRuleId',
    },
    {
      name: 'inspectionRuleLov',
      type: 'object',
      label: intl.get(`${commonCode}.inspectionRule`).d('检验规则'),
      lovCode: 'LMDS.RULE',
      ignore: 'always',
      lovPara: { ruleType: 'INSPECTION' },
    },
    {
      name: 'inspectionRuleId',
      type: 'string',
      bind: 'inspectionRuleLov.inspectionRuleId',
    },
    {
      name: 'attributeString3',
      type: 'string',
      label: intl.get(`${commonCode}.DNCProgramCode`).d('DNC程序编码'),
      bind: 'operationLov.attributeString3',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
  events: {
    update: ({ name, valueObj, record }) => {
      if (name === 'operationLov' && valueObj) {
        record.set('executeRuleId', valueObj.executeRuleId);
        record.set('inspectionRuleId', valueObj.inspectionRuleId);
      } else if (name === 'operationLov' && !valueObj) {
        record.set('executeRuleId', null);
        record.set('inspectionRuleId', null);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/list-neway-mo`,
        data,
        method: 'GET',
      };
    },
  },
});

const DetailFormDs = () => ({
  selection: false,
  autoQuery: false,
  children: {
    operationList: new DataSet({ ...OperationListDs() }),
    taskList: new DataSet({ ...TaskListDs() }),
  },
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('工单号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}}.item`).d('物料'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${commonCode}.itemDescription`).d('物料描述'),
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${commonCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
    {
      name: 'moTypeName',
      type: 'string',
      label: intl.get(`${commonCode}.moType`).d('工单类型'),
    },
    {
      name: 'demandQty',
      label: intl.get(`${commonCode}.demandQty`).d('需求数量'),
      type: 'string',
    },
    {
      name: 'uom',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.taskDescription`).d('任务描述'),
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'documentNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'actualCompletedQty',
      type: 'string',
      label: intl.get(`${commonCode}.completedQty`).d('已完成数量'),
    },
    {
      name: 'completedQty',
      type: 'string',
      label: intl.get(`${commonCode}.qualifiedQty`).d('合格数量'),
    },
    {
      name: 'scrappedQty',
      type: 'string',
      label: intl.get(`${commonCode}.scrappedQty`).d('报废数量'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-rework/mos`,
        data,
        method: 'GET',
      };
    },
  },
});

const OperationListDs = () => ({
  selection: false,
  autoQuery: false,
  fields: [
    {
      name: 'sequenceNum',
      type: 'number',
      label: intl.get(`${commonCode}.reworkQty`).d('序号'),
      required: true,
    },
    {
      name: 'operationCode',
      type: 'string',
      label: intl.get(`${commonCode}.reworkableQty`).d('标准工序'),
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('工序名称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.operationDescription`).d('工序描述'),
    },
    {
      name: 'operationType',
      type: 'string',
      label: intl.get(`${commonCode}.operationType`).d('工序类型'),
      lookupCode: 'LMDS.OPERATION_TYPE',
    },
    {
      name: 'keyOperationFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.keyOperationFlag`).d('关键工序标识'),
    },
    {
      name: 'firstOperationFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.firstOperationFlag`).d('首工序标识'),
    },
    {
      name: 'lastOperationFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.lastOperationFlag`).d('末工序标识'),
    },
    {
      name: 'preSequenceNum',
      type: 'string',
      label: intl.get(`${commonCode}.preSequenceNum`).d('前工序'),
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: intl.get(`${commonCode}.reworkableQty`).d('标准工时(min)'),
    },
    {
      name: 'processTime',
      type: 'string',
      label: intl.get(`${commonCode}.processTime`).d('实际工时(min)'),
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${commonCode}.referenceDocument`).d('参考文件'),
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${commonCode}.instruction`).d('工序说明'),
    },
    {
      name: 'executeRuleDescription',
      type: 'string',
      label: intl.get(`${commonCode}.executeRule`).d('执行规则'),
    },
    {
      name: 'inspectionRuleDescription',
      type: 'string',
      label: intl.get(`${commonCode}.inspectionRule`).d('检验规则'),
    },
    {
      name: 'attributeString3',
      type: 'string',
      label: intl.get(`${commonCode}.DNCProgramCode`).d('DNC程序编码'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { moId } = data;
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/list-neway-mo-operation`,
        data: { moId },
        method: 'GET',
      };
    },
  },
});

const TaskListDs = () => ({
  selection: false,
  autoQuery: false,
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.organizationName`).d('工厂'),
    },
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
    },
    {
      name: 'productCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${commonCode}.itemDescription`).d('物料描述'),
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'uom',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'reworkQty',
      type: 'string',
      label: intl.get(`${preCode}.reworkQty`).d('可返修数量'),
    },
    {
      name: 'taskQty',
      type: 'string',
      label: intl.get(`${preCode}.planEndDate`).d('任务数量'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.taskDescription`).d('任务描述'),
    },
    {
      name: 'documentNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceTaskNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceTask`).d('来源任务'),
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: 'LMES.TASK_STATUS',
    },
    {
      name: 'firstOperationFlag',
      type: 'string',
      label: intl.get(`${preCode}.firstOperationFlag`).d('首工序标识'),
    },
    {
      name: 'lastOperationFlag',
      type: 'string',
      label: intl.get(`${preCode}.lastOperationFlag`).d('末工序标识'),
    },
    {
      name: 'workCenterName',
      type: 'string',
      label: intl.get(`${preCode}.workCenter`).d('工作中心'),
    },
    {
      name: 'workGroupName',
      type: 'string',
      label: intl.get(`${preCode}.workerGroup`).d('班组'),
    },
    {
      name: 'workName',
      type: 'string',
      label: intl.get(`${preCode}.worker`).d('操作工'),
    },
    {
      name: 'actualStartTime',
      type: 'string',
      label: intl.get(`${preCode}.actuallyStartTime`).d('实际开始时间'),
    },
    {
      name: 'actualEndTime',
      type: 'string',
      label: intl.get(`${preCode}.actuallyEndTime`).d('实际结束时间'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { moId } = data;
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-rework/tasks`,
        data: { documentId: moId },
        method: 'GET',
      };
    },
  },
});

export {
  ListTableDs,
  ReworkOrderDs,
  CreateFormDs,
  CreateTableDs,
  DetailFormDs,
  OperationListDs,
  TaskListDs,
};
