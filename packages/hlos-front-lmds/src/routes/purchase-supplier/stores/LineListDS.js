/*
 * @Author: zhang yang
 * @Description: 供应商 I
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-28 14:50:09
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { isEmpty } from 'lodash';

const { lmdsSupplier } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.supplier.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/supplier-sites`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'supplierSiteType',
      type: 'string',
      label: intl.get(`${preCode}.supplierSiteType`).d('地点类型'),
      lookupCode: lmdsSupplier.supplierSiteType,
      required: true,
    },
    {
      name: 'supplierSiteNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierSiteNumber`).d('供应商地点'),
      required: true,
    },
    {
      name: 'supplierSiteName',
      type: 'intl',
      label: intl.get(`${preCode}.supplierSiteName`).d('地点名称'),
      required: true,
    },
    {
      name: 'supplierSiteAlias',
      type: 'intl',
      label: intl.get(`${preCode}.supplierSiteAlias`).d('地点简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.partySiteDesc`).d('地点描述'),
      validator: descValidator,
    },
    {
      name: 'supplierSiteStatus',
      type: 'string',
      label: intl.get(`${preCode}.supplierSiteStatus`).d('地点状态'),
      lookupCode: lmdsSupplier.supplierSiteStatus,
      required: true,
    },
    {
      name: 'countryRegion',
      type: 'string',
      label: intl.get(`${preCode}.countryRegion`).d('国家/地区'),
    },
    {
      name: 'provinceState',
      type: 'string',
      label: intl.get(`${preCode}.provinceState`).d('省份/州'),
    },
    {
      name: 'city',
      type: 'string',
      label: intl.get(`${preCode}.city`).d('城市'),
    },
    {
      name: 'address',
      type: 'string',
      label: intl.get(`${preCode}.address`).d('地址'),
    },
    {
      name: 'zipcode',
      type: 'string',
      label: intl.get(`${preCode}.zipcode`).d('邮政编码'),
    },
    {
      name: 'contact',
      type: 'string',
      label: intl.get(`${preCode}.contact`).d('联系人'),
    },
    {
      name: 'phoneNumber',
      type: 'string',
      label: intl.get(`${preCode}.phoneNumber`).d('电话'),
    },
    {
      name: 'email',
      type: 'string',
      label: intl.get(`${preCode}.email`).d('邮箱'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('endDate'))) {
            return 'endDate';
          }
        },
      },
      defaultValue: NOW_DATE,
      required: true,
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部编号'),
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
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data,
        method: 'DELETE',
      };
    },
  },
});
