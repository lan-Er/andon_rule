/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-28 16:15:48
 * @LastEditTime: 2020-09-28 16:21:38
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-组织DS
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intelPrefix = 'zmda.organization';
const { common } = codeConfig.code;
const url = `${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/organization-views/queryForSupplier`;

export default () => ({
  pageSize: 10,
  autoQuery: true,
  selection: false,
  transport: {
    read: () => ({
      url,
      method: 'get',
    }),
  },
  queryFields: [
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${intelPrefix}.supplier`).d('供应商编码'),
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
      label: intl.get(`${intelPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'organizationCode',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.org`).d('组织'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.name`).d('名称'),
    },
  ],
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${intelPrefix}.supplierNumber`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intelPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'organizationCode',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.org`).d('组织'),
      order: 'asc',
    },
    {
      name: 'organizationLevel',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.orgLevel`).d('级别'),
    },
    {
      name: 'organizationName',
      type: 'intl',
      label: intl.get(`${intelPrefix}.model.orgName`).d('名称'),
    },
    {
      name: 'organizationAlias',
      type: 'intl',
      label: intl.get(`${intelPrefix}.model.orgAlias`).d('简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intelPrefix}.model.orgDesc`).d('描述'),
    },
    {
      name: 'organizationClassMeaning',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.orgClass`).d('分类'),
    },
    {
      name: 'organizationTypeMeaning',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.orgType`).d('类型'),
    },
    {
      name: 'parentOrganizationName',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.parentOrg`).d('父组织'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.location`).d('地理位置'),
    },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.externalOrg`).d('外部组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intelPrefix}.model.enabledFlag`).d('是否有效'),
    },
  ],
});
