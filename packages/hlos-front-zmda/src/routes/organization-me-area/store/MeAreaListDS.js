/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:16:27
 * @LastEditTime: 2020-09-29 10:26:20
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-车间DS
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.meArea.model';
const commonCode = 'zmda.common.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_ZMDA}/v1/${organizationId}/me-area-views/queryForSupplier`;

export default () => ({
  autoQuery: true,
  selection: false,
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
      name: 'meAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.meArea`).d('车间'),
    },
    {
      name: 'meAreaName',
      type: 'string',
      label: intl.get(`${preCode}.meAreaName`).d('车间名称'),
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
      name: 'meAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.meArea`).d('车间'),
      order: 'asc',
    },
    {
      name: 'meAreaName',
      type: 'string',
      label: intl.get(`${preCode}.meAreaName`).d('车间名称'),
    },
    {
      name: 'meAreaAlias',
      type: 'string',
      label: intl.get(`${preCode}.meAreaAlias`).d('车间简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.meAreaDesc`).d('车间描述'),
    },
    {
      name: 'meOu',
      type: 'string',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
    },
    {
      name: 'issueWarehouse',
      type: 'string',
      label: intl.get(`${preCode}.issueWm`).d('默认发料仓库'),
    },
    {
      name: 'issueWmArea',
      type: 'string',
      label: intl.get(`${preCode}.issueWmArea`).d('默认发料仓储区域'),
    },
    {
      name: 'completeWarehouse',
      type: 'string',
      label: intl.get(`${preCode}.completeWm`).d('默认完工仓库'),
    },
    {
      name: 'completeWmArea',
      type: 'string',
      label: intl.get(`${preCode}.completeWmArea`).d('默认完工仓储区域'),
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      label: intl.get(`${preCode}.invWm`).d('默认入库仓库'),
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      label: intl.get(`${preCode}.invWmArea`).d('默认入库仓储区域'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${preCode}.location`).d('地理位置'),
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
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
  },
});
