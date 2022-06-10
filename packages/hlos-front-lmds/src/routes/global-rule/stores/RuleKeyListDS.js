/**
 * @Description: 规则项管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:51
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsRule } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.rule.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/rule-keys`;

export default () => ({
  autoQuery: false,
  selection: false,
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data,
        method: 'DELETE',
      };
    },
  },
  fields: [
    {
      name: 'ruleKeyCode',
      type: 'string',
      label: intl.get(`${preCode}.ruleKey`).d('规则项'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'ruleKeyName',
      type: 'intl',
      label: intl.get(`${preCode}.ruleKeyName`).d('规则项名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.ruleKeyDesc`).d('规则项描述'),
      validator: descValidator,
    },
    {
      name: 'ruleKeyType',
      type: 'string',
      label: intl.get(`${preCode}.ruleKeyType`).d('规则项类型'),
      lookupCode: lmdsRule.ruleKeyType,
      required: true,
    },
    {
      name: 'ruleKeyValue',
      type: 'string',
      label: intl.get(`${preCode}.ruleKeyValue`).d('默认值'),
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
});
