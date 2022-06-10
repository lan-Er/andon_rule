/**
 * @Description: 采购中心管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-18 13:40:55
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.scmOu.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/scm-ous`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'scmOuCode',
      type: 'string',
      label: intl.get(`${preCode}.scmOu`).d('采购中心'),
    },
    {
      name: 'scmOuName',
      type: 'string',
      label: intl.get(`${preCode}.scmOuName`).d('采购中心名称'),
    },
  ],
  fields: [
    {
      name: 'enterpriseObj',
      type: 'object',
      label: intl.get(`${preCode}.enterprise`).d('集团'),
      lovCode: common.enterprise,
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
      name: 'scmOuCode',
      type: 'string',
      label: intl.get(`${preCode}.scmOu`).d('采购中心'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'scmOuName',
      type: 'intl',
      label: intl.get(`${preCode}.scmOuName`).d('采购中心名称'),
      required: true,
    },
    {
      name: 'scmOuAlias',
      type: 'intl',
      label: intl.get(`${preCode}.scmOuAlias`).d('采购中心简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.scmOuDesc`).d('采购中心描述'),
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
      const fieldName = convertFieldName(name, 'scmOu', 'organization');
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
