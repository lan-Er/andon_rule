/*
 * @Author: zhang yang
 * @Description: file content
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-28 14:49:48
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { positiveNumberValidator, descValidator } from 'hlos-front/lib/utils/utils';
import ChildrenDS from './LineListDS';

const { lmdsSupplier, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.supplier.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/suppliers`;

export default () => ({
  primaryKey: 'supplierId',
  children: {
    supplierSiteList: new DataSet({ ...ChildrenDS() }),
  },
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierNumber`).d('供应商'),
      required: true,
    },
    {
      name: 'supplierName',
      type: 'intl',
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
      required: true,
    },
    {
      name: 'supplierAlias',
      type: 'intl',
      label: intl.get(`${preCode}.supplierAlias`).d('供应商简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.supplierDesc`).d('供应商描述'),
      validator: descValidator,
    },
    {
      name: 'supplierCategory',
      type: 'object',
      label: intl.get(`${preCode}.supplierCategory`).d('分类'),
      lovPara: { categorySetCode: 'SUPPLIER' },
      lovCode: common.categories,
    },
    {
      name: 'supplierCategoryId',
      type: 'string',
      bind: 'supplierCategory.categoryId',
    },
    {
      name: 'supplierCategoryName',
      type: 'string',
      bind: 'supplierCategory.categoryName',
    },
    {
      name: 'buyer',
      type: 'object',
      label: intl.get(`${preCode}.buyer`).d('采购员'),
      lovCode: common.worker,
      lovPara: { workerType: 'BUYER' },
      ignore: 'always',
    },
    {
      name: 'buyerId',
      type: 'string',
      bind: 'buyer.workerId',
    },
    {
      name: 'buyerName',
      type: 'string',
      bind: 'buyer.workerName',
    },
    {
      name: 'supplierGroup',
      type: 'string',
      label: intl.get(`${preCode}.supplierGroup`).d('供应商组'),
    },
    {
      name: 'societyNumber',
      type: 'string',
      label: intl.get(`${preCode}.societyNumber`).d('社会编号'),
    },
    {
      name: 'supplierRank',
      type: 'string',
      label: intl.get(`${preCode}.supplierRank`).d('供应商等级'),
      lookupCode: lmdsSupplier.supplierRank,
    },
    {
      name: 'supplierStatus',
      type: 'string',
      label: intl.get(`${preCode}.supplierStatus`).d('供应商状态'),
      lookupCode: lmdsSupplier.supplierStatus,
      required: true,
    },
    {
      name: 'consignFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.consignFlag`).d('寄售标识'),
      defaultValue: false,
    },
    {
      name: 'vmiFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.vmiFlag`).d('VMI标识'),
      defaultValue: false,
    },
    {
      name: 'paymentDeadline',
      type: 'string',
      label: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
      lookupCode: lmdsSupplier.paymentDeadline,
    },
    {
      name: 'paymentMethod',
      type: 'string',
      label: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
      lookupCode: lmdsSupplier.paymentMethod,
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'currencyObj.currencyName',
    },
    {
      name: 'taxRate',
      type: 'number',
      label: intl.get(`${preCode}.taxRate`).d('税率'),
      validator: positiveNumberValidator,
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
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
});
