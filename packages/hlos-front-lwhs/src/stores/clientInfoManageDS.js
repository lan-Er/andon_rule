/**
 * 客户信息管理
 * @since: 2020-07-01 14:49:10
 * @author: wei.zhou05@hand-china.com
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

const preCode = 'lwhs.cim.model';
const commonCode = 'lwhs.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWHS}/v1/${organizationId}/customer/queryCustomerInfo`;

const CimDS = {
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'POST',
        data: Object.assign(
          {},
          {
            tenantId: organizationId,
          },
          config.data
        ),
      };
    },
  },
  pageSize: 10,
  selection: 'single',
  autoQuery: true,
  queryFields: [
    {
      name: 'companyCode',
      type: 'string',
      label: intl.get(`${preCode}.companyCode`).d('公司编码'),
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${preCode}.companyName`).d('公司名称'),
    },
  ],
  fields: [
    {
      name: 'companyCode',
      type: 'string',
      label: intl.get(`${commonCode}.companyCode`).d('公司编码'),
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${commonCode}.companyName`).d('公司名称'),
    },
    {
      name: 'address',
      type: 'string',
      label: intl.get(`${commonCode}.address`).d('公司地址'),
    },
    {
      name: 'contactPerson',
      type: 'string',
      label: intl.get(`${commonCode}.contactPerson`).d('联系人'),
    },
    {
      name: 'phone',
      type: 'string',
      label: intl.get(`${commonCode}.phone`).d('联系电话'),
    },
    {
      name: 'enableFlag',
      type: 'number',
      label: intl.get(`${commonCode}.enableFlag`).d('是否启用'),
    },
  ],
};

export { CimDS };
