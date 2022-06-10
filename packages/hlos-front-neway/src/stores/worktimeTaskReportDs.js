import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const preCode = 'neway.dispatchOrderReport.model';
const organizationId = getCurrentOrganizationId();

const HeaderDs = () => ({
  selection: false,
  // autoCreate: true,
  autoQuery: false,
  paging: false,
  queryFields: [
    {
      name: 'workerLov',
      type: 'object',
      label: intl.get(`${preCode}.worker`).d('员工'),
      lovCode: 'LMDS.WORKER',
      required: true,
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerLov.workerId',
    },
    {
      name: 'taskLov',
      type: 'object',
      lovCode: 'LMES.TASK',
      label: intl.get(`${preCode}.task`).d('任务'),
      required: true,
      ignore: 'always',
      cascadeMap: { workerId: 'workerId' },
    },
    {
      name: 'taskNum',
      type: 'string',
      bind: 'taskLov.taskNumber',
    },
    {
      name: 'taskId',
      type: 'string',
      bind: 'taskLov.taskId',
    },
    {
      name: 'quantity',
      type: 'string',
      label: intl.get(`${preCode}.qty`).d('数量'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { keyOperationFlag, ...other } = data;
      const url = keyOperationFlag
        ? 'neway-tasks/submitted/operation' // 派工单
        : 'neway-tasks/non-critical/operation'; // 非关键序
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/${url}`,
        method: 'GET',
        data: other,
      };
    },
  },
});

export { HeaderDs };
