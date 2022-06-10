/**
 * @Description: 新建租户隶属与供应商编码配置DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-01 21:09:35
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const commonCode = 'zmda.common.model';
const preCode = 'zmda.tenantAffiliationSupplier.model';
const { common, zmdaItem, zmdaCustomerItem } = codeConfig.code;

export default () => ({
  fields: [
    {
      name: 'parentTenantObj',
      type: 'object',
      label: intl.get(`${preCode}.parentTenant`).d('核企租户编码'),
      lovCode: common.tenant,
      textField: 'tenantNum',
      ignore: 'always',
      required: true,
    },
    {
      name: 'parentTenantId',
      type: 'string',
      bind: 'parentTenantObj.tenantId',
    },
    {
      name: 'parentTenantNum',
      type: 'string',
      bind: 'parentTenantObj.tenantNum',
    },
    {
      name: 'parentTenantName',
      type: 'string',
      bind: 'parentTenantObj.tenantName',
      label: intl.get(`${preCode}.parentTenantName`).d('核企租户名称'),
    },
    {
      name: 'tenantObj',
      type: 'object',
      label: intl.get(`${preCode}.supplierTenant`).d('供应商租户编码'),
      lovCode: common.tenant,
      textField: 'tenantNum',
      ignore: 'always',
      required: true,
    },
    {
      name: 'targetTenantId',
      type: 'string',
      bind: 'tenantObj.tenantId',
    },
    {
      name: 'targetTenantNum',
      type: 'string',
      bind: 'tenantObj.tenantNum',
    },
    {
      name: 'targetTenantName',
      type: 'string',
      bind: 'tenantObj.tenantName',
      label: intl.get(`${preCode}.supplierTenantName`).d('供应商租户名称'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${commonCode}.supplier`).d('核企侧供应商编码'),
      lovCode: zmdaItem.supplier,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: record.get('parentTenantId'),
        }),
      },
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
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplierObj.supplierName',
      label: intl.get(`${commonCode}.supplierName`).d('核企侧供应商名称'),
    },
    {
      name: 'description',
      type: 'string',
      bind: 'supplierObj.description',
      label: intl.get(`${commonCode}.description`).d('核企侧供应商描述'),
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonCode}.customer`).d('供应商侧客户编码'),
      lovCode: zmdaCustomerItem.customer,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: record.get('targetTenantId'),
        }),
      },
      textField: 'customerNumber',
      ignore: 'always',
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerNumber',
      type: 'string',
      bind: 'customerObj.customerNumber',
    },
    {
      name: 'customerName',
      type: 'string',
      bind: 'customerObj.customerName',
      label: intl.get(`${commonCode}.customerName`).d('供应商侧客户名称'),
    },
    {
      name: 'customerDescription',
      type: 'string',
      bind: 'customerObj.description',
      label: intl.get(`${commonCode}.customerDescription`).d('供应商侧客户描述'),
      labelWidth: 130,
    },
    {
      name: 'roleControlFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.roleControlFlag`).d('核企侧角色权限控制'),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'parentTenantObj') {
        record.set('supplierObj', null);
        record.set('customerObj', null);
      }
      if (name === 'tenantObj') {
        record.set('supplierObj', null);
        record.set('customerObj', null);
      }
    },
  },
});
