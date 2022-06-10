/*
 * @Author: zhang yang
 * @Description: 异常-ds
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-18 13:50:25
 */

import { getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsException } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/exceptions`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.exception.model';

export default () => ({
  selection: false,
  autoQuery: true,
  transport: {
    read: () => ({
      url,
      method: 'get',
    }),
    create: () => ({
      url,
      method: 'post',
    }),
    submit: () => ({
      url,
      method: 'put',
    }),
  },
  fields: [
    {
      name: 'exceptionClass',
      type: 'string',
      label: intl.get(`${preCode}.exceptionClass`).d('异常大类'),
      lookupCode: lmdsException.exceptionClass,
      required: true,
    },
    {
      name: 'exceptionType',
      type: 'string',
      label: intl.get(`${preCode}.exceptionType`).d('异常类型'),
      lookupCode: lmdsException.exceptionType,
      required: true,
    },
    {
      name: 'exceptionCode',
      type: 'string',
      label: intl.get(`${preCode}.exception`).d('异常'),
      required: true,
    },
    {
      name: 'exceptionName',
      type: 'intl',
      label: intl.get(`${preCode}.exceptionName`).d('异常名称'),
      required: true,
    },
    {
      name: 'exceptionAlias',
      type: 'intl',
      label: intl.get(`${preCode}.exceptionAlias`).d('异常简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.exceptionDesc`).d('异常描述'),
      validator: descValidator,
    },
    {
      name: 'exceptionCategory',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  queryFields: [
    { name: 'exceptionCode', type: 'string', label: intl.get(`${preCode}.exception`).d('异常') },
    {
      name: 'exceptionName',
      type: 'string',
      label: intl.get(`${preCode}.exceptionName`).d('异常名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
