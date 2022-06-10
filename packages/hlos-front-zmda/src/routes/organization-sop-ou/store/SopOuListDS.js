/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:47:45
 * @LastEditTime: 2020-09-29 10:53:35
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-销售中心DS
 */

import intl from 'utils/intl';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonCode = 'zmda.common.model';
const preCode = 'zmda.sopOu.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/sop-ou-views/queryForSupplier`;

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
      name: 'sopOuCode',
      type: 'string',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
    },
    {
      name: 'sopOuName',
      type: 'string',
      label: intl.get(`${preCode}.sopOuName`).d('销售中心名称'),
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
      name: 'enterpriseName',
      type: 'string',
      label: intl.get(`${preCode}.enterprise`).d('集团'),
    },
    {
      name: 'sopOuCode',
      type: 'string',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
    },
    {
      name: 'sopOuName',
      type: 'string',
      label: intl.get(`${preCode}.sopOuName`).d('销售中心名称'),
    },
    {
      name: 'sopOuAlias',
      type: 'intl',
      label: intl.get(`${preCode}.sopOuAlias`).d('销售中心简称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.sopOuDesc`).d('销售中心描述'),
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
