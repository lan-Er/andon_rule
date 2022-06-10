/*
 * @Author: zhang yang
 * @Description: 销售中心--dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-18 10:11:57
 */

import { getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  convertFieldName,
  getTlsRecord,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/sop-ous`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.sopOu.model';

export default () => ({
  selection: false,
  autoQuery: true,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'sopOu', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
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
      name: 'enterpriseObj',
      type: 'object',
      lovCode: common.enterprise,
      label: intl.get(`${preCode}.enterprise`).d('集团'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'enterpriseId',
      type: 'string',
      bind: 'enterpriseObj.enterpriseId',
    },
    {
      name: 'enterpriseCode',
      type: 'string',
      bind: 'enterpriseObj.enterpriseCode',
    },
    {
      name: 'enterpriseName',
      type: 'string',
      bind: 'enterpriseObj.enterpriseName',
    },
    {
      name: 'sopOuCode',
      type: 'string',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'sopOuName',
      type: 'intl',
      label: intl.get(`${preCode}.sopOuName`).d('销售中心名称'),
      required: true,
    },
    {
      name: 'sopOuAlias',
      type: 'intl',
      label: intl.get(`${preCode}.sopOuAlias`).d('销售中心简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.sopOuDesc`).d('销售中心描述'),
      validator: descValidator,
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
      defaultValue: true,
    },
  ],
  queryFields: [
    { name: 'sopOuCode', type: 'string', label: intl.get(`${preCode}.sopOu`).d('销售中心') },
    {
      name: 'sopOuName',
      type: 'string',
      label: intl.get(`${preCode}.sopOuName`).d('销售中心名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
