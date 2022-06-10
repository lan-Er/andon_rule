/**
 * @Description: 采购组管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-18 14:17:30
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
const preCode = 'lmds.scmGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/scm-groups`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'scmGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.scmGroup`).d('采购组'),
    },
    {
      name: 'scmGroupName',
      type: 'string',
      label: intl.get(`${preCode}.scmGroupName`).d('采购组名称'),
    },
  ],
  fields: [
    {
      name: 'scmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.scmOu`).d('采购中心'),
      lovCode: common.scmOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmOuObj.scmOuId',
    },
    {
      name: 'scmOuCode',
      type: 'string',
      bind: 'scmOuObj.scmOuCode',
    },
    {
      name: 'scmOuName',
      type: 'string',
      bind: 'scmOuObj.scmOuName',
    },
    {
      name: 'scmGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.scmGroup`).d('采购组'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'scmGroupName',
      type: 'intl',
      label: intl.get(`${preCode}.scmGroupName`).d('采购组名称'),
      required: true,
    },
    {
      name: 'scmGroupAlias',
      type: 'intl',
      label: intl.get(`${preCode}.scmGroupAlias`).d('采购组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.scmGroupDesc`).d('采购组描述'),
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
      const fieldName = convertFieldName(name, 'scmGroup', 'organization');
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
