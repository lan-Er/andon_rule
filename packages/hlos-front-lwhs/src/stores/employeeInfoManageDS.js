/**
 * 员工信息管理DS
 * @since: 2020-07-08 14:30:25
 * @author: wei.zhou05@hand-china.com
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

const preCode = 'lwhs.eim.model';
const commonCode = 'lwhs.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWHS}/v1/${organizationId}/customerEmployeeInfo/queryCustomerEmployeeInfo`;

const EimDS = {
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'POST',
      };
    },
  },
  pageSize: 10,
  selection: false,
  autoQuery: false,
  queryFields: [
    {
      name: 'employeeName',
      type: 'string',
      label: intl.get(`${preCode}.employeeName`).d('员工姓名'),
    },
  ],
  fields: [
    {
      name: 'employeeName',
      type: 'string',
      label: intl.get(`${commonCode}.employeeName`).d('员工姓名'),
    },
    {
      name: 'employeeCode',
      type: 'string',
      label: intl.get(`${commonCode}.employeeCode`).d('员工工号'),
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${commonCode}.companyName`).d('公司'),
    },
    {
      name: 'phone',
      type: 'string',
      label: intl.get(`${commonCode}.phone`).d('手机号'),
    },
    {
      name: 'email',
      type: 'string',
      label: intl.get(`${commonCode}.email`).d('邮箱'),
    },
    {
      name: 'enableFlag',
      type: 'number',
      label: intl.get(`${commonCode}.enableFlag`).d('是否启用'),
    },
  ],
};

export { EimDS };
