/*
 * @Author: 徐雨 <yu.xu02@hand-china.com>
 * @Date: 2021-06-07 09:20:37
 * @LastEditTime: 2021-06-07 14:29:41
 */
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'neway.dispatchOrderReport.model';
const organizationId = getCurrentOrganizationId();
const { common, newayLov } = codeConfig.code;

const listTableDs = () => ({
  pageSize: 10,
  page: 0,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'ownerOrganizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'moNumObj',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('工单号'),
      lovCode: newayLov.moNum,
      ignore: 'always',
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'moNumObj.moId',
    },
    {
      name: 'taskLov',
      type: 'object',
      label: intl.get(`${preCode}.taskNum`).d('任务号'),
      lovCode: 'LMES.TASK',
      ignore: 'always',
    },
    {
      name: 'taskNum',
      type: 'string',
      bind: 'taskLov.taskNumber',
    },
    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: newayLov.operation,
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: 'LMES.TASK_STATUS',
    },
  ],
  transport: {
    read: ({ data = {} }) => {
      const { moId } = data;
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mos`,
        method: 'GET',
        data: { documentId: moId },
      };
    },
  },
});

const formDs = () => ({
  fields: [
    {
      name: 'workcellId',
      type: 'object',
      lovCode: common.workcell,
      label: '工作中心',
      required: true,
    },
    // {
    //   name: 'workcellObj',
    //   type: 'object',
    //   lovCode: common.workcell,
    //   label: '工作中心',
    //   required: true,
    //   ignore: 'always',
    // },
    // {
    //   name: 'workcellId',
    //   bind: 'workcellObj.workcellId',
    // },
    // {
    //   name: 'workcellCode',
    //   type: 'string',
    //   bind: 'workcellObj.workcellCode',
    //   ignore: 'always',
    // },
  ],
});

export { listTableDs, formDs };
