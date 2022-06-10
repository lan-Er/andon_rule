/**
 * @Description -  仓储中心管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-07 16:20:30
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, getCurrentLanguage } from 'utils/utils';
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

const { common, lmdsWmOu } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const currentLanguage = getCurrentLanguage();
const preCode = 'lmds.wmOu.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/wm-ous`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'wmOuCode',
      type: 'string',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
    },
    {
      name: 'wmOuName',
      type: 'string',
      label: intl.get(`${preCode}.wmOuName`).d('仓储中心名称'),
    },
  ],
  fields: [
    {
      name: 'wmOuCode',
      type: 'string',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'wmOuName',
      type: 'intl',
      label: intl.get(`${preCode}.wmOuName`).d('仓储中心名称'),
      required: true,
    },
    {
      name: 'wmOuAlias',
      type: 'intl',
      label: intl.get(`${preCode}.wmOuAlias`).d('仓储中心简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.wmOuDesc`).d('仓储中心描述'),
      validator: descValidator,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: lmdsWmOu.wmOuParentOrg,
      ignore: 'always',
      required: true,
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
      bind: 'organizationObj.organizationName',
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
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'wmOu', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: ({ params }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'GET',
        params: {
          languageCode: currentLanguage,
          page: params.page,
          size: params.size,
        },
      };
      return axiosConfig;
    },
    create: ({ data }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'POST',
        params: {
          languageCode: currentLanguage,
        },
        data,
      };
      return axiosConfig;
    },
    update: ({ data }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'PUT',
        params: {
          languageCode: currentLanguage,
        },
        data,
      };
      return axiosConfig;
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
