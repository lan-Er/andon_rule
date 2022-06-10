/*
 * @Description: 客户管理信息--CustomerListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 13:38:45
 * @LastEditors  : zhang yang
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsCustomer, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.customer.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/customers`;

export default () => ({
  selection: false,
  queryFields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户名称'),
    },
  ],
  fields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户'),
      unique: true,
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户名称'),
    },
    {
      name: 'customerAlias',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerAlias`).d('客户简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${intlPrefix}.description`).d('客户描述'),
      validator: descValidator,
    },
    {
      name: 'category',
      type: 'string',
      label: intl.get(`${intlPrefix}.category`).d('分类'),
    },
    {
      name: 'salesman',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesman`).d('销售员'),
    },
    {
      name: 'customerGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerGroup`).d('客户组'),
    },
    {
      name: 'societyNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.societyNumber`).d('社会编号'),
    },
    {
      name: 'customerRank',
      type: 'string',
      lookupCode: lmdsCustomer.customerRank,
      label: intl.get(`${intlPrefix}.customerRank`).d('客户等级'),
    },
    {
      name: 'customerStatus',
      type: 'string',
      lookupCode: lmdsCustomer.customerStatus,
      label: intl.get(`${intlPrefix}.customerStatus`).d('客户状态'),
    },
    {
      name: 'consignFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.consignFlag`).d('寄售标识'),
    },
    {
      name: 'fobType',
      type: 'string',
      lookupCode: common.fobType,
      label: intl.get(`${intlPrefix}.fobType`).d('FOB类型'),
    },
    {
      name: 'paymentDeadline',
      type: 'string',
      lookupCode: lmdsCustomer.paymentDeadline,
      label: intl.get(`${intlPrefix}.paymentDeadline`).d('付款期限'),
    },
    {
      name: 'paymentMethod',
      type: 'string',
      lookupCode: lmdsCustomer.paymentMethod,
      label: intl.get(`${intlPrefix}.paymentMethod`).d('付款方式'),
    },
    {
      name: 'currency',
      type: 'string',
      label: intl.get(`${intlPrefix}.currency`).d('币种'),
    },
    {
      name: 'taxRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
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
