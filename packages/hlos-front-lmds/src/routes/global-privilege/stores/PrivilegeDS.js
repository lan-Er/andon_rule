/**
 * @Description: 权限管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-21 14:34:15
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsPrivilege } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.privilege.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/privileges`;

export default () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'privilegeCode',
      type: 'string',
      label: intl.get(`${preCode}.privilege`).d('权限'),
    },
    {
      name: 'privilegeName',
      type: 'string',
      label: intl.get(`${preCode}.privilegeName`).d('权限名称'),
    },
  ],
  fields: [
    {
      name: 'privilegeType',
      type: 'string',
      label: intl.get(`${preCode}.privilegeType`).d('权限类型'),
      lookupCode: lmdsPrivilege.privilegeType,
      required: true,
    },
    {
      name: 'privilegeCode',
      type: 'string',
      label: intl.get(`${preCode}.privilege`).d('权限'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'privilegeName',
      type: 'intl',
      label: intl.get(`${preCode}.privilegeName`).d('权限名称'),
      unique: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.privilegeDesc`).d('权限描述'),
      validator: descValidator,
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
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
