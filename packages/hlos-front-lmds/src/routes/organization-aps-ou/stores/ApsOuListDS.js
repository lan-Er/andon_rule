/**
 * @Description: 计划中心管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-20 10:50:04
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  positiveNumberValidator,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.apsOu.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/aps-ous`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'apsOuCode',
      type: 'string',
      label: intl.get(`${preCode}.apsOu`).d('计划中心'),
    },
    {
      name: 'apsOuName',
      type: 'string',
      label: intl.get(`${preCode}.apsOuName`).d('计划中心名称'),
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
      name: 'apsOuCode',
      type: 'string',
      label: intl.get(`${preCode}.apsOu`).d('计划中心'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'apsOuName',
      type: 'intl',
      label: intl.get(`${preCode}.apsOuName`).d('计划中心名称'),
      required: true,
    },
    {
      name: 'apsOuAlias',
      type: 'intl',
      label: intl.get(`${preCode}.apsOuAlias`).d('计划中心简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.apsOuDesc`).d('计划中心描述'),
      validator: descValidator,
    },
    {
      name: 'planStartTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartTime`).d('计划滚动起始时间'),
    },
    {
      name: 'periodicType',
      type: 'string',
      label: intl.get(`${preCode}.periodicType`).d('滚动周期'),
      lookupCode: common.periodicType,
      ignore: 'never',
    },
    {
      name: 'demandTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.demandTF`).d('需求时间栏(天)'),
    },
    {
      name: 'fixTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.fixTF`).d('固定时间栏(天)'),
    },
    {
      name: 'frozenTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.frozenTF`).d('冻结时间栏(天)'),
    },
    {
      name: 'forwardPlanTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.forwardPlanTF`).d('顺排时间栏(天)'),
    },
    {
      name: 'releaseTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.releaseTF`).d('下达时间栏(天)'),
    },
    {
      name: 'orderTimeFence',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.orderTF`).d('订单时间栏(天)'),
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
      const fieldName = convertFieldName(name, 'apsOu', 'organization');
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
