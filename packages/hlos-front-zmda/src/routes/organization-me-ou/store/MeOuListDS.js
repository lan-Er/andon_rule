/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 09:56:14
 * @LastEditTime: 2020-09-29 10:08:04
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-工厂DS
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.meOu';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/me-ou-views/queryForSupplier`;

export default () => ({
  selection: false,
  autoQuery: true,
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
      name: 'meOuCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOu`).d('工厂'),
    },
    {
      name: 'meOuName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOuName`).d('工厂名称'),
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
      name: 'meOuCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOu`).d('工厂'),
      order: 'asc',
    },
    {
      name: 'meOuName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOuName`).d('工厂名称'),
    },
    {
      name: 'meOuAlias',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOuAlias`).d('工厂简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOuDesc`).d('工厂描述'),
    },
    {
      name: 'enterprise',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.enterprise`).d('集团'),
    },
    {
      name: 'apsOu',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.apsOu`).d('计划中心'),
    },
    {
      name: 'scmOu',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.scmOu`).d('采购中心'),
    },
    {
      name: 'sopOu',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.sopOu`).d('销售中心'),
    },
    {
      name: 'issueWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.issueWm`).d('默认发料仓库'),
    },
    {
      name: 'issueWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.issueWmArea`).d('默认发料仓储区域'),
    },
    {
      name: 'completeWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.completeWm`).d('默认完工仓库'),
    },
    {
      name: 'completeWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.completeWmArea`).d('默认完工仓储区域'),
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.invWm`).d('默认入库仓库'),
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.invWmArea`).d('默认入库仓储区域'),
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
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
    },
  ],
});
