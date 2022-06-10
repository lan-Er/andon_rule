/*
 * @Author: zhang yang
 * @Description: 计划组 - dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 16:38:27
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import {
  getTlsRecord,
  convertFieldName,
  positiveNumberValidator,
  codeValidator,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsApsGroup, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.apsGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/aps-groups`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'apsGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.apsGroup`).d('计划组'),
    },
    {
      name: 'apsGroupName',
      type: 'string',
      label: intl.get(`${preCode}.apsGroupName`).d('计划组名称'),
    },
  ],
  fields: [
    {
      name: 'apsOu',
      type: 'object',
      label: intl.get(`${preCode}.apsOu`).d('计划中心'),
      lovCode: common.apsOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOu.apsOuId',
    },
    {
      name: 'apsOuCode',
      type: 'string',
      bind: 'apsOu.apsOuCode',
    },
    {
      name: 'apsOuName',
      type: 'string',
      bind: 'apsOu.apsOuName',
    },
    {
      name: 'apsGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.apsGroup`).d('计划组'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'apsGroupName',
      type: 'intl',
      label: intl.get(`${preCode}.apsGroupName`).d('计划组名称'),
      required: true,
    },
    {
      name: 'apsGroupAlias',
      type: 'intl',
      label: intl.get(`${preCode}.apsGroupAlias`).d('计划组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.apsGroupDesc`).d('计划组描述'),
      validator: descValidator,
    },
    {
      name: 'planStartTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartTime`).d('计划滚动起始时间'),
    },
    {
      name: 'periodicType',
      type: 'string',
      label: intl.get(`${preCode}.periodicType`).d('滚动周期'),
      lookupCode: common.periodicType,
      ignore: 'never',
    },
    {
      name: 'planPhaseType',
      type: 'string',
      label: intl.get(`${preCode}.planPhaseType`).d('区间类型'),
      lookupCode: lmdsApsGroup.planPhaseType,
      required: true,
      ignore: 'never',
    },
    {
      name: 'planBase',
      type: 'string',
      label: intl.get(`${preCode}.planBase`).d('排程类型'),
      lookupCode: lmdsApsGroup.planBase,
      required: true,
      ignore: 'never',
    },
    {
      name: 'basicAlgorithm',
      type: 'string',
      label: intl.get(`${preCode}.basicAlgorithm`).d('基础算法'),
      lookupCode: lmdsApsGroup.basicAlgorithm,
      required: true,
      ignore: 'never',
    },
    {
      name: 'extendedAlgorithm',
      type: 'string',
      label: intl.get(`${preCode}.extendedAlgorithm`).d('扩展算法'),
      lookupCode: lmdsApsGroup.extendedAlgorithm,
      ignore: 'never',
    },
    {
      name: 'resourceRule',
      type: 'string',
      label: intl.get(`${preCode}.resourceRule`).d('资源分配规则'),
      lookupCode: lmdsApsGroup.resourceRule,
      ignore: 'never',
    },
    {
      name: 'processSequence',
      type: 'string',
      label: intl.get(`${preCode}.processSequence`).d('生产顺序'),
    },
    {
      name: 'planSequence',
      type: 'string',
      label: intl.get(`${preCode}.planSequence`).d('计划顺序'),
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderByCode`).d('显示顺序'),
    },
    {
      name: 'processCycleTime',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.processCycle`).d('默认生产周期'),
    },

    {
      name: 'delayTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.DelayTF`).d('实绩延迟周期(小时)'),
    },
    {
      name: 'fixTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.fixTF`).d('固定时间栏(天)'),
    },
    {
      name: 'frozenTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.frozenTF`).d('冻结时间栏(天)'),
    },
    {
      name: 'forwardPlanTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.forwardPlanTF`).d('顺排时间栏(天)'),
    },
    {
      name: 'releaseTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.releaseTF`).d('下达时间栏(天)'),
    },
    {
      name: 'orderTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.orderTF`).d('订单时间栏(天)'),
    },
    {
      name: 'releaseRule',
      type: 'object',
      label: intl.get(`${preCode}.releaseRule`).d('下达规则'),
      lovCode: common.rule,
      lovPara: { ruleCategory: 'RELEASE' },
    },
    {
      name: 'releaseRuleId',
      type: 'string',
      bind: 'releaseRule.ruleId',
    },
    {
      name: 'releaseRuleName',
      type: 'string',
      bind: 'releaseRule.ruleName',
    },
    {
      name: 'collaborativeRule',
      type: 'object',
      label: intl.get(`${preCode}.collaborativeRule`).d('计划协同规则'),
      lovCode: common.rule,
      ignore: 'always',
      lovPara: { ruleType: 'COLLABORATIVE' },
    },
    {
      name: 'collaborativeRuleId',
      type: 'string',
      bind: 'collaborativeRule.ruleId',
    },
    {
      name: 'collaborativeRuleName',
      type: 'string',
      bind: 'collaborativeRule.ruleName',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
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
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${commonCode}.externalOrg`).d('外部关联组织'),
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
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'apsGroup', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
  },
});
