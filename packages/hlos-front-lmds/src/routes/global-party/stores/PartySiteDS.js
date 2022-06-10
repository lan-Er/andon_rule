/*
 * @Description: 商业实体地点--PartySiteDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-27 15:57:22
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsParty } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.party.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/party-sites`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'partySiteType',
      type: 'string',
      lookupCode: lmdsParty.partySiteType,
      label: intl.get(`${intlPrefix}.partySiteType`).d('地点类型'),
    },
    {
      name: 'partySiteNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.partySiteNumber`).d('商业实体地点'),
    },
    {
      name: 'partySiteName',
      type: 'string',
      label: intl.get(`${intlPrefix}.partySiteName`).d('地点名称'),
    },
    {
      name: 'partySiteAlias',
      type: 'string',
      label: intl.get(`${intlPrefix}.partySiteAlias`).d('地点简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${intlPrefix}.partySiteDescription`).d('地点描述'),
      validator: descValidator,
    },
    {
      name: 'partySiteStatus',
      type: 'string',
      lookupCode: lmdsParty.partySiteStatus,
      label: intl.get(`${intlPrefix}.partySiteStatus`).d('地点状态'),
    },
    {
      name: 'countryRegion',
      type: 'string',
      label: intl.get(`${intlPrefix}.countryRegion`).d('国家/地区'),
    },
    {
      name: 'provinceState',
      type: 'string',
      label: intl.get(`${intlPrefix}.provinceState`).d('省份/州'),
    },
    {
      name: 'city',
      type: 'string',
      label: intl.get(`${intlPrefix}.city`).d('城市'),
    },
    {
      name: 'address',
      type: 'string',
      label: intl.get(`${intlPrefix}.address`).d('地址'),
    },
    {
      name: 'zipcode',
      type: 'string',
      label: intl.get(`${intlPrefix}.zipCode`).d('邮政编码'),
    },
    {
      name: 'contact',
      type: 'string',
      label: intl.get(`${intlPrefix}.contact`).d('联系人'),
    },
    {
      name: 'phoneNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.phoneNumber`).d('电话'),
    },
    {
      name: 'email',
      type: 'string',
      label: intl.get(`${intlPrefix}.email`).d('邮箱'),
    },
    {
      name: 'startDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.startDate`).d('开始日期'),
    },
    {
      name: 'endDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.endDate`).d('结束日期'),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${intlPrefix}.externalId`).d('外部ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalNum`).d('外部编号'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});
