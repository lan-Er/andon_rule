/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:58:48
 * @LastEditTime: 2020-09-29 11:00:24
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-销售组DS
 */

import intl from 'utils/intl';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonCode = 'zmda.common.model';
const preCode = 'zmda.sopGroup.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/sop-group-views/queryForSupplier`;

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
      name: 'sopGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.sopGroup`).d('销售组'),
    },
    {
      name: 'sopGroupName',
      type: 'string',
      label: intl.get(`${preCode}.sopGroupName`).d('销售组名称'),
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
      name: 'sopOuName',
      type: 'string',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
    },
    {
      name: 'sopGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.sopGroup`).d('销售组'),
    },
    {
      name: 'sopGroupName',
      type: 'string',
      label: intl.get(`${preCode}.sopGroupName`).d('销售组名称'),
    },
    {
      name: 'sopGroupAlias',
      type: 'string',
      label: intl.get(`${preCode}.sopGroupAlias`).d('销售组简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.sopGroupDesc`).d('销售组描述'),
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
});
