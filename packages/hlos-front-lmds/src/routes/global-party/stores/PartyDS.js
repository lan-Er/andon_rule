/*
 * @Description: 商业实体管理信息--PartyDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-27 15:57:22
 * @LastEditors  : zhang yang
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
const url = `${HLOS_LMDS}/v1/${organizationId}/parties`;

export default () => ({
  selection: false,
  queryFields: [
    {
      name: 'partyNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyNumber`).d('商业实体'),
    },
    {
      name: 'partyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyName`).d('商业实体名称'),
    },
  ],
  fields: [
    {
      name: 'partyType',
      type: 'string',
      lookupCode: lmdsParty.partyType,
      label: intl.get(`${intlPrefix}.partyType`).d('商业实体类型'),
    },
    {
      name: 'partyNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyNumber`).d('商业实体'),
    },
    {
      name: 'partyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyName`).d('商业实体名称'),
    },
    {
      name: 'partyAlias',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyAlias`).d('商业实体简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyDescription`).d('商业实体描述'),
      validator: descValidator,
    },
    {
      name: 'societyNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.societyNumber`).d('社会编号'),
    },
    {
      name: 'partyStatus',
      type: 'string',
      lookupCode: lmdsParty.partyStatus,
      label: intl.get(`${intlPrefix}.partyStatus`).d('商业实体状态'),
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
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});
