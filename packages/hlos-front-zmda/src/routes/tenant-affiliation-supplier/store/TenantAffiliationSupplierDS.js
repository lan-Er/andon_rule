/**
 * @Description: 租户隶属关系与供应商编码配置DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-26 11:41:08
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonCode = 'zmda.common.model';
const preCode = 'zmda.tenantAffiliationSupplier.model';
const { common, zmdaItem } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/tenant-rels`;
// const treeUrl = `${HLOS_ZMDA}/v1/${organizationId}/tenant-rels/queryTreeList`;

export default () => ({
  autoQuery: true,
  selection: 'multiple',
  pageSize: 10,
  queryFields: [
    // {
    //   name: 'tenantObj',
    //   type: 'object',
    //   label: intl.get(`${preCode}.tenant`).d('租户编码'),
    //   lovCode: common.tenant,
    //   textField: 'tenantNum',
    //   ignore: 'always',
    // },
    // {
    //   name: 'tenantId',
    //   type: 'string',
    //   bind: 'tenantObj.tenantId',
    // },
    // {
    //   name: 'tenantNum',
    //   type: 'string',
    //   bind: 'tenantObj.tenantNum',
    //   ignore: 'always',
    // },
    {
      name: 'tenantNum',
      type: 'string',
      label: intl.get(`${commonCode}.tenantNum`).d('租户编码'),
    },
    {
      name: 'tenantName',
      type: 'string',
      label: intl.get(`${commonCode}.tenantName`).d('租户名称'),
    },
  ],
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
      type: 'Number',
      bind: 'tenantObj.tenantId',
    },
    {
      name: 'tenantNum',
      type: 'string',
      bind: 'tenantObj.tenantNum',
    },
    {
      name: 'tenantName',
      type: 'string',
      bind: 'tenantObj.tenantName',
      label: intl.get(`${preCode}.supplierTenantName`).d('供应商租户名称'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${commonCode}.supplier`).d('供应商编码'),
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
      label: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
    },
    {
      name: 'description',
      type: 'string',
      bind: 'supplierObj.description',
      label: intl.get(`${commonCode}.description`).d('供应商描述'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: [data[0]],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: [data[0]],
        method: 'POST',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'parentTenantObj') {
        record.set('supplierObj', null);
      }
      if (name === 'tenantObj') {
        record.set('supplierObj', null);
      }
    },
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
