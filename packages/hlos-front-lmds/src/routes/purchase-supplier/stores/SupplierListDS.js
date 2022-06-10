/*
 * @Author: zhang yang
 * @Description: 供应商  D
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-28 14:49:06
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { positiveNumberValidator, descValidator } from 'hlos-front/lib/utils/utils';

const { lmdsSupplier, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.supplier.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/suppliers`;

export default () => ({
  autoQuery: true,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierNumber`).d('供应商'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
    },
  ],
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
      name: 'currencyName',
      type: 'string',
      label: intl.get(`${preCode}.currency`).d('币种'),
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
      format: 'YYYY-MM-DD',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      format: 'YYYY-MM-DD',
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
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
