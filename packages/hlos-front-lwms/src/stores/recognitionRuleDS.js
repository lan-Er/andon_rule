/*
 * @Description: 识别规则-DS
 * @Author: leying.yan@hand-china.com
 * @Date: 2021-01-14
 * @LastEditors: leying.yan
 */
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();

const { common, lwmsRecognitionRule } = codeConfig.code;

const preCode = 'lmes.recognitionRule.model';
const commonCode = 'lmes.common.model';

// 首页头DS
const HeadDS = () => {
  return {
    selection: false,
    queryFields: [
      {
        name: 'identifyRuleCode',
        label: intl.get(`${preCode}.identifyRuleCode`).d('规则编码'),
        type: 'string',
      },
      {
        name: 'identifyRuleName',
        label: intl.get(`${preCode}.identifyRuleName`).d('规则名称'),
        type: 'string',
      },
    ],
    fields: [
      {
        name: 'identifyRuleId',
      },
      {
        name: 'identifyRuleClass',
        required: true,
        label: intl.get(`${preCode}.identifyRuleClass`).d('识别大类'),
        lookupCode: lwmsRecognitionRule.identifyRuleClass,
      },
      {
        name: 'identifyRuleType',
        required: true,
        label: intl.get(`${preCode}.identifyRuleType`).d('识别类型'),
        lookupCode: lwmsRecognitionRule.identifyRuleType,
      },
      {
        name: 'identifyRuleCode',
        required: true,
        label: intl.get(`${preCode}.identifyRuleCode`).d('规则编码'),
      },
      {
        name: 'identifyRuleName',
        type: 'intl',
        required: true,
        label: intl.get(`${preCode}.identifyRuleName`).d('规则名称'),
      },
      {
        name: 'identifyRuleAlias',
        type: 'intl',
        label: intl.get(`${preCode}.identifyRuleAlias`).d('规则简称'),
      },
      {
        name: 'description',
        type: 'intl',
        label: intl.get(`${preCode}.description`).d('规则描述'),
      },
      {
        name: 'ruleSeparator',
        label: intl.get(`${preCode}.ruleSeparator`).d('分隔符'),
      },
      {
        name: 'identifyMethod',
        lookupCode: lwmsRecognitionRule.identifyMethod,
        label: intl.get(`${preCode}.identifyMethod`).d('识别方式'),
      },
      {
        name: 'identifyApi',
        label: intl.get(`${preCode}.identifyApi`).d('指定API'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
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
        name: 'organizationName',
        type: 'string',
        label: intl.get(`${preCode}.organization`).d('组织'),
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
        lovCode: common.party,
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObj.partyId',
      },
      {
        name: 'partyName',
        type: 'string',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
        bind: 'partyObj.partyName',
      },
      // {
      //   name: 'partyName',
      //   label: intl.get(`${preCode}.party`).d('商业伙伴'),
      // },
      {
        name: 'onceIdentifyNumber',
        label: intl.get(`${preCode}.onceIdentifyNumber`).d('单次识别数'),
      },
      {
        name: 'priority',
        label: intl.get(`${preCode}.priority`).d('优先级'),
      },
      {
        name: 'enabledFlag',
        label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
        defaultValue: true,
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/identify-rules`,
          method: 'GET',
        };
      },
      submit: ({ data, params }) => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/identify-rules/create-identify-rule`,
          data: {
            ...data[0],
          },
          params,
          method: 'POST',
        };
      },
    },
  };
};
// 首页行DS
const LineDS = () => {
  return {
    selection: false,
    fields: [
      {
        name: 'lineId',
      },
      {
        name: 'lineNum',
        label: intl.get(`${preCode}.lineNum`).d('行号'),
      },
      {
        name: 'identifyContentType',
        label: intl.get(`${preCode}.identifyContentType`).d('内容类型'),
        lookupCode: lwmsRecognitionRule.identifyContentType,
      },
      {
        name: 'prefixCode',
        label: intl.get(`${preCode}.prefixCode`).d('前缀'),
      },
      {
        name: 'postfixCode',
        label: intl.get(`${preCode}.postfixCode`).d('后缀'),
      },
      {
        name: 'lengthFrom',
        label: intl.get(`${preCode}.lengthFrom`).d('长度从'),
      },
      {
        name: 'lengthTo',
        label: intl.get(`${preCode}.lengthTo`).d('长度至'),
      },
      {
        name: 'maskCode',
        label: intl.get(`${preCode}.maskCode`).d('掩码'),
      },
      {
        name: 'subSeparator',
        label: intl.get(`${preCode}.subSeparator`).d('子分隔符'),
      },
      {
        name: 'enabledFlag',
        label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
        defaultValue: 1,
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/identify-rule-lines`,
          method: 'GET',
        };
      },
    },
  };
};
// 新增/编辑页行DS
const OperationLineDS = () => ({
  autoQuery: false,
  selection: 'multiple',
  pageSize: 100,
  fields: [
    {
      name: 'identifyRuleId',
    },
    {
      name: 'lineId',
    },
    {
      name: 'lineNum',
      required: true,
      type: 'number',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
      order: 'asc',
    },
    {
      name: 'identifyContentType',
      required: true,
      label: intl.get(`${preCode}.identifyContentType`).d('内容类型'),
      lookupCode: lwmsRecognitionRule.identifyContentType,
    },
    {
      name: 'prefixCode',
      label: intl.get(`${preCode}.prefixCode`).d('前缀'),
      type: 'string',
      transformRequest: (val) => val || '',
    },
    {
      name: 'postfixCode',
      label: intl.get(`${preCode}.postfixCode`).d('后缀'),
      type: 'string',
      transformRequest: (val) => val || '',
    },
    {
      name: 'lengthFrom',
      label: intl.get(`${preCode}.lengthFrom`).d('长度从'),
      type: 'number',
      transformRequest: (val) => val || '',
    },
    {
      name: 'lengthTo',
      label: intl.get(`${preCode}.lengthTo`).d('长度至'),
      type: 'number',
      transformRequest: (val) => val || '',
    },
    {
      name: 'maskCode',
      label: intl.get(`${preCode}.maskCode`).d('掩码'),
      type: 'string',
      transformRequest: (val) => val || '',
    },
    {
      name: 'subSeparator',
      label: intl.get(`${preCode}.subSeparator`).d('子分隔符'),
      type: 'string',
      transformRequest: (val) => val || '',
    },
    {
      name: 'enabledFlag',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      type: 'boolean',
      trueValue: 1,
      falseValue: 0,
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/identify-rule-lines`,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/identify-rule-lines/remove-identify-ruleLine`,
        data: [...data],
        params,
        method: 'POST',
      };
    },
  },
});
// 新增/编辑页头DS
const OperationHeadDS = () => {
  return {
    autoCreate: true,
    // children: {
    //   identifyRuleLines: [],
    // },
    fields: [
      {
        name: 'identifyRuleId',
      },
      {
        name: 'identifyRuleClass',
        required: true,
        label: intl.get(`${preCode}.identifyRuleClass`).d('识别大类'),
        lookupCode: lwmsRecognitionRule.identifyRuleClass,
      },
      {
        name: 'identifyRuleType',
        required: true,
        label: intl.get(`${preCode}.identifyRuleType`).d('识别类型'),
        lookupCode: lwmsRecognitionRule.identifyRuleType,
      },
      {
        name: 'identifyRuleCode',
        required: true,
        label: intl.get(`${preCode}.identifyRuleCode`).d('规则编码'),
      },
      {
        name: 'identifyRuleName',
        type: 'intl',
        required: true,
        label: intl.get(`${preCode}.identifyRuleName`).d('规则名称'),
      },
      {
        name: 'identifyRuleAlias',
        type: 'intl',
        label: intl.get(`${preCode}.identifyRuleAlias`).d('规则简称'),
      },
      {
        name: 'description',
        type: 'intl',
        label: intl.get(`${preCode}.description`).d('规则描述'),
      },
      {
        name: 'ruleSeparator',
        label: intl.get(`${preCode}.ruleSeparator`).d('分隔符'),
      },
      {
        name: 'identifyMethod',
        lookupCode: lwmsRecognitionRule.identifyMethod,
        label: intl.get(`${preCode}.identifyMethod`).d('识别方式'),
      },
      {
        name: 'identifyApi',
        label: intl.get(`${preCode}.identifyApi`).d('指定API'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
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
        name: 'organizationName',
        type: 'string',
        label: intl.get(`${preCode}.organization`).d('组织'),
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
        lovCode: common.party,
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObj.partyId',
      },
      {
        name: 'partyName',
        type: 'string',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
        bind: 'partyObj.partyName',
      },
      // {
      //   name: 'partyName',
      //   label: intl.get(`${preCode}.party`).d('商业伙伴'),
      // },
      {
        name: 'onceIdentifyNumber',
        label: intl.get(`${preCode}.onceIdentifyNumber`).d('单次识别数'),
      },
      {
        name: 'priority',
        label: intl.get(`${preCode}.priority`).d('优先级'),
      },
      {
        name: 'enabledFlag',
        label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
        trueValue: 1,
        falseValue: 0,
      },
    ],
    transport: {
      read: ({ data }) => {
        console.log(data);
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/identify-rules/${data.id}`,
          data: {
            page: undefined,
            size: undefined,
          },
          method: 'GET',
        };
      },
      submit: ({ data, params }) => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/identify-rules/create-identify-rule`, // data[0].identifyRuleId ? `${HLOS_LMDS}/v1/${organizationId}/identify-rules/update-identify-rule` : `${HLOS_LMDS}/v1/${organizationId}/identify-rules/create-identify-rule`,
          data: {
            ...data[0],
            identifyRuleLines: data[0].identifyRuleLines,
          },
          params,
          method: 'POST',
        };
      },
    },
  };
};

export { HeadDS, LineDS, OperationHeadDS, OperationLineDS };
