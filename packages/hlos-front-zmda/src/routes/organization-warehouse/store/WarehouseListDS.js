/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:34:41
 * @LastEditTime: 2020-09-29 10:45:27
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-仓库DS
 */

import intl from 'utils/intl';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, getCurrentLanguage } from 'utils/utils';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.warehouse.model';
const commonCode = 'zmda.common.model';
const { common } = codeConfig.code;
const currentLanguage = getCurrentLanguage();
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_ZMDA}/v1/${organizationId}/warehouse-views/queryForSupplier`;

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
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.wm`).d('仓库'),
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${preCode}.wmName`).d('仓库名称'),
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
      name: 'wmOuName',
      type: 'string',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${preCode}.wmCategory`).d('仓库类别'),
    },
    {
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.wm`).d('仓库'),
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${preCode}.wmName`).d('仓库名称'),
    },
    {
      name: 'warehouseAlias',
      type: 'string',
      label: intl.get(`${preCode}.wmAlias`).d('仓库简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.wmDesc`).d('仓库描述'),
    },
    {
      name: 'warehouseGroup',
      type: 'string',
      label: intl.get(`${preCode}.warehouseGroup`).d('仓库组'),
    },
    {
      name: 'onhandFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.onhandFlag`).d('启用现有量'),
    },
    {
      name: 'negativeFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.negativeFlag`).d('允许负库存'),
    },
    {
      name: 'wmAreaFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.wmAreaFlag`).d('启用货位'),
    },
    {
      name: 'wmUnitFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.wmUnitFlag`).d('启用货格'),
    },
    {
      name: 'tagFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.tagFlag`).d('启用条码'),
    },
    {
      name: 'lotFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.lotFlag`).d('启用批次'),
    },
    {
      name: 'planFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.planFlag`).d('计划考虑'),
    },
    {
      name: 'locationName',
      type: 'String',
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
