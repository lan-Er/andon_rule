/*
 * @Description: 客户详情DS---CustomerDetailDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 13:38:45
 * @LastEditors  : zhang yang
 */

import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { CODE_MAX_LENGTH, NOW_DATE } from 'hlos-front/lib/utils/constants';

import CustomerDetailTableDS from './CustomerDetailTableDS';

const { lmdsCustomer, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.customer.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/customers`;

export default () => ({
  selection: false,
  autoQuery: false,
  primaryKey: 'customerId',
  children: {
    customerSiteList: new DataSet({
      ...CustomerDetailTableDS(),
    }),
  },
  fields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'customerName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.customerName`).d('客户名称'),
      required: true,
    },
    {
      name: 'customerAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.customerAlias`).d('客户简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.customer.description`).d('客户描述'),
      validator: descValidator,
    },
    {
      name: 'categoryObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.categories,
      label: intl.get(`${intlPrefix}.category`).d('分类'),
    },
    {
      name: 'category',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'customerCategoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'salesmanObj',
      type: 'object',
      lovCode: common.worker,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.salesman`).d('销售员'),
    },
    {
      name: 'salesmanId',
      type: 'string',
      bind: 'salesmanObj.workerId',
    },
    {
      name: 'salesman',
      type: 'string',
      bind: 'salesmanObj.workerName',
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
      required: true,
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
      label: intl.get(`${intlPrefix}.fobType`).d('Fob类型'),
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
      name: 'currencyObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.currency,
      label: intl.get(`${intlPrefix}.currency`).d('币种'),
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'taxRate',
      type: 'number',
      min: 0,
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
      type: 'email',
      label: intl.get(`${intlPrefix}.email`).d('邮箱'),
    },
    {
      name: 'startDate',
      type: 'date',
      defaultValue: NOW_DATE,
      label: intl.get(`${intlPrefix}.startDate`).d('开始日期'),
      transformRequest: (val) => moment(val).format(DEFAULT_DATE_FORMAT),
      required: true,
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${intlPrefix}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
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
      defaultValue: true,
      required: true,
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
  },
});
