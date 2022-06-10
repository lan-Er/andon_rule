import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

const queryHeadDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'batchId',
      type: 'string',
      label: '批次号',
    },
  ],
  fields: [
    {
      name: 'batchId',
      type: 'string',
      label: '批次号',
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: '处理时间',
    },
    {
      name: 'status',
      type: 'string',
      label: '处理状态',
    },
    {
      name: 'process',
      type: 'string',
      label: '处理进度 (%)',
    },
    {
      name: 'result',
      type: 'string',
      label: '处理结果',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/split-task-logs`,
        method: 'GET',
        data,
      };
    },
  },
});

export { queryHeadDS };
