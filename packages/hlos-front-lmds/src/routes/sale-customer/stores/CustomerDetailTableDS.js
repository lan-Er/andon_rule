/*
 * @Description: 客户详情表格 DS---CustomerDetailTableDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 13:38:45
 * @LastEditors  : zhang yang
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { CODE_MAX_LENGTH, NOW_DATE } from 'hlos-front/lib/utils/constants';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';

const { lmdsCustomer } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.customer.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/customer-sites`;

export default () => ({
  selection: false,
  autoQuery: false,
  fields: [
    {
      name: 'customerSiteType',
      type: 'string',
      required: true,
      lookupCode: lmdsCustomer.customerSiteType,
      label: intl.get(`${intlPrefix}.customerSiteType`).d('地点类型'),
    },
    {
      name: 'customerSiteNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerSiteNumber`).d('客户地点编码'),
      required: true,
      unique: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'customerSiteName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.customerSiteName`).d('地点名称'),
      required: true,
    },
    {
      name: 'customerSiteAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.customerSiteAlias`).d('地点简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.site.description`).d('地点描述'),
      validator: descValidator,
    },
    {
      name: 'customerSiteStatus',
      type: 'string',
      required: true,
      lookupCode: lmdsCustomer.customerSiteStatus,
      label: intl.get(`${intlPrefix}.salesman`).d('地点状态'),
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
      label: intl.get(`${intlPrefix}.startDate`).d('开始日期'),
      defaultValue: NOW_DATE,
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
      min: 'startDate',
      label: intl.get(`${intlPrefix}.endDate`).d('结束日期'),
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
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});
