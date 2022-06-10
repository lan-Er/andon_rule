/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-28 15:15:37
 * @LastEditTime: 2020-09-28 16:02:32
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-集团DS
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.enterprise';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/enterprise-views/queryForSupplier`;

export default () => ({
  autoQuery: true,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.supplier`).d('供应商编码'),
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
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'enterpriseCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.enterprise`).d('集团'),
    },
    {
      name: 'enterpriseName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.enterpriseName`).d('集团名称'),
    },
  ],
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'enterpriseCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.enterprise`).d('集团'),
      order: 'asc',
    },
    {
      name: 'enterpriseName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.enterpriseName`).d('集团名称'),
    },
    {
      name: 'enterpriseAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.enterpriseAlias`).d('简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.enterpriseDesc`).d('描述'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
    },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.externalOrg`).d('外部关联组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('hzero.common.model.enabledFlag').d('是否有效'),
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
