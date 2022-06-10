/**
 * @Description: 异常组管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 11:35:18
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsExceptionGroup } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.exceptionGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/exception-groups`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'exceptionGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroup`).d('异常组'),
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroupName`).d('异常组名称'),
    },
  ],
  fields: [
    {
      name: 'exceptionGroupType',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroupType`).d('异常组类型'),
      lookupCode: lmdsExceptionGroup.exceptionGrouptype,
      required: true,
    },
    {
      name: 'exceptionGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroup`).d('异常组'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroupName`).d('异常组名称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.exceptionGroupDesc`).d('异常组描述'),
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
