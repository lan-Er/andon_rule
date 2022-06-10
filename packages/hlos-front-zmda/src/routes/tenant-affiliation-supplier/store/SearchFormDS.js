/**
 * @Description: 查询条件DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-02 10:45:59
 */

import intl from 'utils/intl';

const commonCode = 'zmda.common.model';

export default () => ({
  fields: [
    {
      name: 'targetTenantNum',
      type: 'string',
      label: intl.get(`${commonCode}.tenantNum`).d('租户编码'),
    },
    {
      name: 'targetTenantName',
      type: 'string',
      label: intl.get(`${commonCode}.tenantName`).d('租户名称'),
    },
  ],
});
