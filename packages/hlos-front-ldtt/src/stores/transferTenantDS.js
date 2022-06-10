/**
 * @Description: 任务组DS
 * @Author: yuchuan.zeng@hand-china.com
 * @Date: 2020-09-02 17:48:07
 */

import intl from 'utils/intl';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'ldtf.transfer.tenant.model';
const commonCode = 'ldtf.common.model';
const { ldttTransferTenant } = codeConfig.code;
const url = `${HLOS_LDTF}/v1/transfer-tenants`;

const TransferTenantDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'tenantObj',
        type: 'object',
        label: intl.get(`${preCode}.tenant`).d('租户'),
        lovCode: ldttTransferTenant.tenant,
        ignore: 'always',
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenantObj.tenantId',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenantObj.tenantNum',
        ignore: 'always',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenantObj.tenantName',
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'tenantName',
        type: 'string',
        label: intl.get(`${commonCode}.tenantName`).d('租户名称'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        type: 'number',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否启用'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url,
          method: 'GET',
        };
      },
    },
  };
};

const TenantCreateFormDS = () => {
  return {
    fields: [
      {
        name: 'tenantObj',
        type: 'object',
        label: intl.get(`${commonCode}.tenant`).d('租户'),
        lovCode: ldttTransferTenant.tenant,
        ignore: 'always',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenantObj.tenantId',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenantObj.tenantNum',
        ignore: 'always',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenantObj.tenantName',
        ignore: 'always',
      },
      {
        name: 'remark',
        label: '备注',
        labelWidth: 150,
      },
      {
        name: 'enabledFlag',
        label: '是否启用',
        labelWidth: 150,
        required: true,
      },
    ],
  };
};

export { TransferTenantDS, TenantCreateFormDS };
