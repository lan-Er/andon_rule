/*
 * @Author: zhang yang
 * @Description: file content
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 17:06:15
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.ruleAssign.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/rule-assign-values`;

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
  },
  fields: [
    {
      name: 'ruleKeyId',
      type: 'string',
    },
    {
      name: 'ruleId',
      type: 'string',
    },
    {
      name: 'keyCode',
      type: 'string',
      label: intl.get(`${preCode}.keyCode`).d('规则项'),
    },
    {
      name: 'ruleKeyName',
      type: 'intl',
      label: intl.get(`${preCode}.keyName`).d('规则项名称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.keyDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'keyTypeMeaning',
      type: 'string',
      ignore: 'always',
      label: intl.get(`${preCode}.keyType`).d('规则项类型'),
    },
    {
      name: 'keyValue',
      type: 'string',
      label: intl.get(`${preCode}.keyValue`).d('项值'),
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
