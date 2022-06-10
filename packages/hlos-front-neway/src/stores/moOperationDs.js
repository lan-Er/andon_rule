import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

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
      name: 'ownerOrganizationId',
      type: 'string',
      bind: 'organizationLov.meOuId',
    },
    {
      name: 'moNumLov',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('工单编码'),
      lovCode: 'LMES.MO',
      ignore: 'always',
      multiple: true,
      cascadeMap: { organizationId: 'organizationLov.meOuId' },
    },
    {
      name: 'moIdList',
      type: 'string',
      bind: 'moNumLov.moId',
      multiple: ',',
    },
    {
      name: 'itemLov',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: 'LMDS.ITEM',
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemLov.itemId',
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
  ],
  fields: [
    {
      name: 'ownerOrganizationName',
      type: 'string',
      label: intl.get(`${commonCode}.organizationName`).d('工厂'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${commonCode}.moNum`).d('工单编码'),
    },
    {
      name: 'moTypeName',
      type: 'string',
      label: intl.get(`${commonCode}.moType`).d('工单类型'),
    },
    {
      name: 'moStatusMeaning',
      type: 'string',
      label: intl.get(`${commonCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('料号'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'demandDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
    {
      name: 'demandQty',
      type: 'string',
      label: intl.get(`${preCode}.demandQty`).d('需求数量'),
    },
    {
      name: 'planStartDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
    },
    {
      name: 'planEndDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
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
  },
});

const LineTableDs = () => ({
  autoQuery: false,
  selection: 'multiple',
  paging: false,
  fields: [
    {
      name: 'sequenceNum',
      type: 'string',
      label: intl.get(`${preCode}.sequenceNum`).d('序号'),
    },
    {
      name: 'operationCode',
      type: 'string',
      label: intl.get(`${preCode}.operationCode`).d('标准工序'),
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${preCode}.operationName`).d('工序名称'),
    },
    {
      name: 'operationAlias',
      type: 'string',
      label: intl.get(`${preCode}.operationAlias`).d('工序简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.operationDescription`).d('工序描述'),
    },
    {
      name: 'operationType',
      type: 'string',
      label: intl.get(`${preCode}.operationType`).d('工序类型'),
      lookupCode: 'LMDS.OPERATION_TYPE',
    },
    {
      name: 'keyOperationFlag',
      label: intl.get(`${commonCode}.keyOperation`).d('关键工序'),
      type: 'boolean',
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'firstOperationFlag',
      label: intl.get(`${commonCode}.firstOperation`).d('首工序'),
      type: 'boolean',
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'lastOperationFlag',
      label: intl.get(`${commonCode}.lastOperation`).d('末工序'),
      type: 'boolean',
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'preSequenceNum',
      type: 'string',
      label: intl.get(`${commonCode}.preOperation`).d('前工序'),
    },
    {
      name: 'processTime',
      type: 'string',
      label: intl.get(`${commonCode}.processTime`).d('加工时间'),
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: intl.get(`${commonCode}.standardWorkTime`).d('标准工时'),
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${commonCode}.referenceDocument`).d('参考文件'),
    },
    {
      name: 'processProgram',
      type: 'string',
      label: intl.get(`${commonCode}.processProgram`).d('程序编码'),
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${commonCode}.operationInstruction`).d('工序说明'),
    },
    {
      name: 'executeRuleLov',
      type: 'object',
      label: intl.get(`${commonCode}.executeRule`).d('执行规则'),
      lovCode: 'LMDS.RULE',
      lovPara: { ruleType: 'EXECUTE' },
      ignore: 'always',
    },
    {
      name: 'executeRuleId',
      bind: 'executeRuleLov.ruleId',
    },
    {
      name: 'executeRule',
      bind: 'executeRuleLov.ruleJson',
    },
    {
      name: 'executeRuleDescription',
      bind: 'executeRuleLov.ruleName',
    },
    {
      name: 'inspectionRuleLov',
      type: 'object',
      label: intl.get(`${commonCode}.inspectionRule`).d('检验规则'),
      lovCode: 'LMDS.RULE',
      lovPara: { ruleType: 'INSPECTION' },
      ignore: 'always',
    },
    {
      name: 'inspectionRuleId',
      bind: 'executeRuleLov.ruleId',
    },
    {
      name: 'inspectionRule',
      bind: 'executeRuleLov.ruleJson',
    },
    {
      name: 'inspectionRuleDescription',
      bind: 'executeRuleLov.ruleName',
    },
    {
      name: 'releasedTaskFlag',
      label: intl.get(`${commonCode}.releasedTask`).d('已发放任务'),
      type: 'boolean',
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'enabledFlag',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      type: 'boolean',
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'externalID',
      type: 'string',
      label: intl.get(`${commonCode}.externalID`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${commonCode}.externalNum`).d('外部编号'),
    },
    {
      name: 'attributeString3',
      type: 'string',
      label: intl.get(`${commonCode}.DNCProgramNum`).d('DNC程序编码'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/list-neway-mo-operation`,
        method: 'GET',
      };
    },
    submit: (data) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/update-mo-operation`,
        method: 'POST',
        body: data,
      };
    },
  },
});

const FormDs = () => ({
  selection: false,
  autoQuery: false,
  paging: false,
  fields: [
    {
      name: 'organizationLov',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('组织'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'ownerOrganizationId',
      type: 'string',
      bind: 'organizationLov.meOuId',
    },
    {
      name: 'ownerOrganizationName',
      type: 'string',
      bind: 'organizationLov.meOuName',
    },
    {
      name: 'moNumLov',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('工单编码'),
      lovCode: 'LMES.MO',
      required: true,
      ignore: 'always',
    },
    {
      name: 'moNum',
      type: 'string',
      bind: 'moNumLov.moNum',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
    {
      name: 'demandDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
    {
      name: 'demandQty',
      type: 'string',
      label: intl.get(`${preCode}.demandQty`).d('需求数量'),
    },
    {
      name: 'makeQty',
      type: 'string',
      label: intl.get(`${preCode}.produceQty`).d('制造数量'),
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
    {
      name: 'planStartDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
    },
    {
      name: 'planEndDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
    },
    {
      name: 'routingVersion',
      type: 'string',
      label: intl.get(`${preCode}.processVersion`).d('工艺版本'),
    },
    {
      name: 'moTypeName',
      type: 'string',
      label: intl.get(`${commonCode}.moType`).d('工单类型'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/list-neway-mo-operation`,
        data,
        method: 'GET',
      };
    },
  },
});

export { ListTableDs, LineTableDs, FormDs };
