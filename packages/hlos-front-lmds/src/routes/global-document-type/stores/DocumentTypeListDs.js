/*
 * @Author: zhang yang
 * @Description: 单据类型
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-19 16:41:47
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsdocumentType, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.documentType.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/document-types`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'documentTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.documentTypeCode`).d('类型'),
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${preCode}.documentTypeName`).d('单据类型名称'),
    },
  ],
  fields: [
    {
      name: 'documentClass',
      type: 'string',
      label: intl.get(`${preCode}.documentClass`).d('大类'),
      lookupCode: lmdsdocumentType.documentClass,
      required: true,
    },
    {
      name: 'documentTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.documentType`).d('类型'),
      required: true,
    },
    {
      name: 'documentTypeName',
      type: 'intl',
      label: intl.get(`${preCode}.documentTypeName`).d('单据类型名称'),
      required: true,
    },
    {
      name: 'documentTypeAlias',
      type: 'intl',
      label: intl.get(`${preCode}.documentTypeAlias`).d('单据类型简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.documentDesc`).d('单据类型描述'),
      validator: descValidator,
    },
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organization.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'documentCategory',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
    },
    {
      name: 'orderByCode',
      type: 'string',
      required: true,
      label: intl.get(`${preCode}.orderByCode`).d('排序'),
    },
    {
      name: 'docProcessRule',
      type: 'object',
      label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      lovCode: lmdsdocumentType.docProcessRule,
      lovPara: { ruleType: 'DOC_PROCESS' },
      ignore: 'always',
    },
    {
      name: 'docProcessRuleId',
      type: 'string',
      bind: 'docProcessRule.ruleId',
    },
    {
      name: 'docProcessRuleName',
      type: 'string',
      bind: 'docProcessRule.ruleName',
    },
    {
      name: 'approvalRule',
      type: 'string',
      label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
      lookupCode: lmdsdocumentType.approvalRule,
    },
    {
      name: 'approvalWorkFlowObj',
      type: 'object',
      label: intl.get(`${preCode}.approvalWorkFlow`).d('审批工作流'),
      lovCode: lmdsdocumentType.approvalWorkFlow,
      dynamicProps: {
        lovPara: () => ({
          tenantId: organizationId,
        }),
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'approvalWorkflow',
      type: 'string',
      bind: 'approvalWorkFlowObj.key',
    },
    {
      name: 'approvalWorkflowName',
      type: 'string',
      bind: 'approvalWorkFlowObj.name',
    },
    {
      name: 'numberRule',
      type: 'object',
      label: intl.get(`${preCode}.numberRule`).d('单据号规则'),
      lovCode: lmdsdocumentType.numberRule,
      ignore: 'always',
    },
    {
      name: 'numberRuleId',
      type: 'string',
      bind: 'numberRule.numberRuleId',
    },
    {
      name: 'numberRuleCode',
      type: 'string',
      bind: 'numberRule.numberRuleCode',
    },
    {
      name: 'numberRuleName',
      type: 'string',
      bind: 'numberRule.numberRuleName',
    },
    {
      name: 'printFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.printFlag`).d('是否打印'),
    },
    {
      name: 'printTemplate',
      type: 'string',
      label: intl.get(`${preCode}.printTemplate`).d('打印模板'),
    },
    {
      name: 'externalCode',
      type: 'string',
      label: intl.get(`${preCode}.externalCode`).d('外部单据编码'),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部单据ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: () => {
      return {
        url: commonUrl,
        method: 'GET',
      };
    },
    create: () => {
      return {
        url: commonUrl,
        method: 'POST',
      };
    },
    update: () => {
      return {
        url: commonUrl,
        method: 'PUT',
      };
    },
  },
});
