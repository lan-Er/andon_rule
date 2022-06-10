/*
 * @Author: zhang yang
 * @Description: 时段 详情 DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:04:10
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import ContextLineDS from './ContextLineDS';

const { lmdsPeriod, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.period.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/periods`;

export default () => ({
  primaryKey: 'periodId',
  selection: false,
  children: {
    periodLineList: new DataSet({ ...ContextLineDS() }),
  },
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'periodType',
      type: 'string',
      label: intl.get(`${preCode}.periodType`).d('时段类型'),
      lookupCode: lmdsPeriod.periodType,
      required: true,
    },
    {
      name: 'periodCode',
      type: 'string',
      label: intl.get(`${preCode}.periodCode`).d('时段'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'periodName',
      type: 'intl',
      label: intl.get(`${preCode}.periodName`).d('时段名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.periodDesc`).d('时段描述'),
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
});
