/**
 * @Description: 集团DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-07 14:41:42
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

const intlPrefix = 'zmda.group';

const GroupDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'groupNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.groupNum`).d('集团编码'),
    },
    {
      name: 'groupName',
      type: 'string',
      label: intl.get(`${intlPrefix}.groupName`).d('集团名称'),
      required: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/groups`,
        data,
        method: 'GET',
      };
    },
  },
});

export { GroupDS };
