/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:28:17
 * @LastEditTime: 2020-09-29 10:30:27
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-仓储中心DS
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId, getCurrentLanguage } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.wmOu.model';
const commonCode = 'zmda.common.model';
const { common } = codeConfig.code;
const currentLanguage = getCurrentLanguage();
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_ZMDA}/v1/${organizationId}/wm-ou-views/queryForSupplier`;

export default () => ({
  autoQuery: true,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商编码'),
      lovCode: common.supplier,
      textField: 'supplierNumber',
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplierObj.supplierNumber',
      ignore: 'always',
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
    },
    {
      name: 'wmOuCode',
      type: 'string',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
    },
    {
      name: 'wmOuName',
      type: 'string',
      label: intl.get(`${preCode}.wmOuName`).d('仓储中心名称'),
    },
  ],
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierNumber`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
    },
    {
      name: 'wmOuCode',
      type: 'string',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
    },
    {
      name: 'wmOuName',
      type: 'string',
      label: intl.get(`${preCode}.wmOuName`).d('仓储中心名称'),
    },
    {
      name: 'wmOuAlias',
      type: 'string',
      label: intl.get(`${preCode}.wmOuAlias`).d('仓储中心简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.wmOuDesc`).d('仓储中心描述'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
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
    },
  ],
  transport: {
    read: ({ params }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'GET',
        params: {
          languageCode: currentLanguage,
          page: params.page,
          size: params.size,
        },
      };
      return axiosConfig;
    },
  },
});
