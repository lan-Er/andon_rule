/*
 * @Description: 集团管理信息--EnterpriseListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: Please set LastEditors
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

const intlPrefix = 'lmds.enterprise';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/enterprises`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  queryFields: [
    {
      name: 'enterpriseCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.enterprise`).d('集团'),
    },
    {
      name: 'enterpriseName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.enterpriseName`).d('集团名称'),
    },
  ],
  fields: [
    {
      name: 'enterpriseCode',
      type: 'string',
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      label: intl.get(`${intlPrefix}.model.enterprise`).d('集团'),
      required: true,
      order: 'asc',
    },
    {
      name: 'enterpriseName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.enterpriseName`).d('集团名称'),
      required: true,
    },
    {
      name: 'enterpriseAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.enterpriseAlias`).d('简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.enterpriseDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
      lovCode: common.location,
      lovPara: { tenantId: organizationId },
      ignore: 'always',
    },
    { name: 'locationName', type: 'string', bind: 'locationObj.locationName' },
    { name: 'locationId', type: 'string', bind: 'locationObj.locationId' },
    { name: 'locationCode', type: 'string', bind: 'locationObj.locationCode' },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.externalOrg`).d('外部关联组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('hzero.common.model.enabledFlag').d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'enterprise', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
    create: () => {
      return {
        url,
        method: 'post',
      };
    },
    update: () => {
      return {
        url,
        method: 'put',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
