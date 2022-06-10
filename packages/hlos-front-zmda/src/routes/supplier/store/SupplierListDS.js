/**
 * @Description: 制造协同-供应商主数据DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-09 11:27:53
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator, descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.supplier.model';
const commonCode = 'zmda.common.model';
const { zmdaSupplier, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/suppliers`;

export default () => ({
  autoQuery: true,
  selection: false,
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
    },
    {
      name: 'supplierName',
      type: 'intl',
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
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
      name: 'buyerCode',
      type: 'string',
      label: intl.get(`${preCode}.buyerCode`).d('采购员'),
    },
    {
      name: 'buyer',
      type: 'object',
      label: intl.get(`${preCode}.buyer`).d('采购员联系电话'),
      lovCode: common.user,
    },
    {
      name: 'buyerId',
      type: 'string',
      bind: 'buyer.id',
    },
    {
      name: 'buyerName',
      type: 'string',
      bind: 'buyer.realName',
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
      lookupCode: zmdaSupplier.supplierRank,
    },
    {
      name: 'supplierStatus',
      type: 'string',
      label: intl.get(`${preCode}.supplierStatus`).d('供应商状态'),
      lookupCode: zmdaSupplier.supplierStatus,
    },
    {
      name: 'consignFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.consignFlag`).d('寄售标识'),
    },
    {
      name: 'vmiFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.vmiFlag`).d('VMI标识'),
    },
    {
      name: 'paymentDeadline',
      type: 'string',
      label: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
      lookupCode: zmdaSupplier.paymentDeadline,
    },
    {
      name: 'paymentMethod',
      type: 'string',
      label: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
      lookupCode: zmdaSupplier.paymentMethod,
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
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
  },
});
