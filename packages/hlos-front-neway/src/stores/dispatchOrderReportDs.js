import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const preCode = 'neway.dispatchOrderReport.model';
const organizationId = getCurrentOrganizationId();

const WorkerDs = () => ({
  selection: false,
  // autoCreate: true,
  autoQuery: false,
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
      name: 'workTime',
      type: 'string',
      label: intl.get(`${preCode}.workTime`).d('工时'),
      // required: true,
    },
  ],
  fields: [
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
  ],
  transport: {
    read: ({ data }) => ({
      url: `${HLOS_LMESS}/v1/${organizationId}/neway-tasks/submitted/operation`,
      data,
      method: 'GET',
    }),
  },
});

export { WorkerDs };
