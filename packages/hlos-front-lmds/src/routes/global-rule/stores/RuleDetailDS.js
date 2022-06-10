/**
 * @Description: 规则详情页面--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:51
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import ChildrenDS from './RuleKeyListDS';

const { lmdsRule } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.rule.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/rules`;

export default () => ({
  primaryKey: 'ruleId',
  selection: false,
  children: {
    ruleKeyList: new DataSet({ ...ChildrenDS() }),
  },
  fields: [
    {
      name: 'ruleClass',
      type: 'string',
      label: intl.get(`${preCode}.ruleClass`).d('规则大类'),
      lookupCode: lmdsRule.ruleClass,
      required: true,
    },
    {
      name: 'ruleType',
      type: 'string',
      label: intl.get(`${preCode}.ruleType`).d('规则类型'),
      lookupCode: lmdsRule.ruleType,
      required: true,
    },
    {
      name: 'ruleCode',
      type: 'string',
      label: intl.get(`${preCode}.rule`).d('规则'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'ruleName',
      type: 'intl',
      label: intl.get(`${preCode}.ruleName`).d('规则名称'),
      required: true,
    },
    {
      name: 'ruleAlias',
      type: 'intl',
      label: intl.get(`${preCode}.ruleAlias`).d('规则简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.ruleDesc`).d('规则描述'),
      validator: descValidator,
    },
    {
      name: 'ruleCategory',
      type: 'string',
      label: intl.get(`${preCode}.ruleCategory`).d('分类'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
  // events: {
  //   submitSuccess: ({dataSet}) => {
  //     dataSet.query();
  //   },
  // },
});
