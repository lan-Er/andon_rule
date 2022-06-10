/**
 * 分组管理DS
 * @since: 2020-07-08 16:17:36
 * @author: wei.zhou05@hand-china.com
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

const commonCode = 'lwhs.common.model';
const organizationId = getCurrentOrganizationId();

const GmDS = {
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_LWHS}/v1/${organizationId}/category/queryCategory?categoryType=${config.data.categoryType}`,
        method: 'POST',
      };
    },
  },
  pageSize: 10,
  selection: false,
  autoQuery: false,
  fields: [
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${commonCode}.categoryName`).d('分组名称'),
    },
  ],
};

export { GmDS };
