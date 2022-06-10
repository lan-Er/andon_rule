//批量报工DS
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const preCode = 'senyu.batchReport.model';
const { common, senyuTaskReport } = codeConfig.code;
const commonCode = 'senyu.common.model';

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/andons/triggered-pc`;

const commonFields = [
  {
    name: 'orgId',
  },
  {
    name: 'workerObj',
    type: 'object',
    lovCode: common.worker,
    label: intl.get(`${commonCode}.worker`).d('操作工'),
    ignore: 'always',
    required: true,
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('orgId'),
      }),
    },
  },
  {
    name: 'workerId',
    bind: 'workerObj.workerId',
  },
  {
    name: 'worker',
    bind: 'workerObj.workerCode',
  },
  {
    name: 'workerName',
    bind: 'workerObj.workerName',
  },
  {
    name: 'fileUrl',
    bind: 'workerObj.fileUrl',
  },
  {
    name: 'prodLineObj',
    type: 'object',
    lovCode: common.prodLine,
    label: intl.get(`${commonCode}.prodLine`).d('生产线'),
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('orgId'),
      }),
    },
  },
  {
    name: 'prodLineId',
    bind: 'prodLineObj.prodLineId',
  },
  {
    name: 'prodLineCode',
    bind: 'prodLineObj.prodLineCode',
  },
  {
    name: 'resourceName',
    bind: 'prodLineObj.resourceName',
  },
  {
    name: 'workcellObj',
    type: 'object',
    label: intl.get(`${commonCode}.workcell`).d('工位'),
    lovCode: common.workcell,
    ignore: 'always',
    required: true,
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('orgId'),
      }),
    },
  },
  {
    name: 'workcellId',
    bind: 'workcellObj.workcellId',
  },
  {
    name: 'workcellCode',
    bind: 'workcellObj.workcellCode',
  },
  {
    name: 'workcellName',
    bind: 'workcellObj.workcellName',
  },
  {
    name: 'equipmentObj',
    type: 'object',
    label: intl.get(`${commonCode}.equipment`).d('设备'),
    lovCode: common.equipment,
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('orgId'),
      }),
    },
  },
  {
    name: 'equipmentId',
    bind: 'equipmentObj.equipmentId',
  },
  {
    name: 'equipmentCode',
    bind: 'equipmentObj.equipmentCode',
  },
  {
    name: 'equipmentName',
    bind: 'equipmentObj.equipmentName',
  },
  {
    name: 'workerGroupObj',
    type: 'object',
    lovCode: common.workerGroup,
    label: intl.get(`${commonCode}.workerGroup`).d('班组'),
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('orgId'),
      }),
    },
  },
  {
    name: 'workerGroupId',
    bind: 'workerGroupObj.workerGroupId',
  },
  {
    name: 'workerGroup',
    bind: 'workerGroupObj.workerGroupCode',
  },
  {
    name: 'workerGroupName',
    bind: 'workerGroupObj.workerGroupName',
  },
];

export const LoginDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    ...commonFields,
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${preCode}.taskNum`).d('task'),
    },
    // {
    //   name: 'reportType',
    //   type: 'string',
    //   lookupCode: 'LMES.TASK_REPORT_TYPE',
    //   label: intl.get(`${preCode}.reportType`).d('报工类型'),
    //   required: true,
    //   defaultValue: 'MO',
    // },
    {
      name: 'date',
      type: 'date',
      label: intl.get(`${preCode}.date`).d('日期'),
      required: true,
      defaultValue: moment(new Date()).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'shift',
      type: 'string',
      lookupCode: 'LMDS.SHIFT_CODE',
      label: intl.get(`${preCode}.shift`).d('班次'),
      required: true,
      defaultValue: 'MORNING SHIFT',
    },
    {
      name: 'other',
      defaultValue: 'workcell',
    },
    {
      name: 'reworkFlag',
      type: 'boolean',
    },
  ],
});

export const QueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'moObj',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('MO号'),
      lovCode: common.moNum,
      ignore: 'always',
      noCache: true,
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          PLBG: 1,
        }),
      },
    },
    {
      name: 'moId',
      bind: 'moObj.moId',
    },
    {
      name: 'moNum',
      bind: 'moObj.moNum',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'operationId',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationName',
      bind: 'operationObj.operationName',
    },
    {
      name: 'taskObj',
      type: 'object',
      label: intl.get(`${preCode}.taskNum`).d('任务号'),
      lovCode: senyuTaskReport.taskItem,
      ignore: 'always',
      noCache: true,
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'taskId',
      bind: 'taskObj.taskId',
    },
    {
      name: 'taskNum',
      bind: 'taskObj.taskNum',
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});

export const TagQueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagCode',
      type: 'string',
    },
  ],
});
