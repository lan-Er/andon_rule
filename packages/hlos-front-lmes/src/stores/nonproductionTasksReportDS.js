/**
 * @Description: 非生产任务报工
 * @Author: liYuan.liu<liu.liyuan@hand-china.com>
 * @Date: 2020-12-24
 * @LastEditors: liYuan.liu
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const preCode = 'lmes.taskReport.model';
const commonCode = 'lmes.common.model';

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
    required: true,
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
    valueField: 'workerGroupId',
    label: intl.get(`${commonCode}.workerGroup`).d('班组'),
    ignore: 'always',
    transformRequest(value) {
      return (value || {}).workerGroupName;
    },
    dynamicProps: {
      lovPara: ({ record }) => ({
        SUPERVISOR_ID: record.get('workerId'),
      }),
    },
  },
  {
    name: 'workerGroupName',
    bind: 'workerGroupObj.workerGroupName',
  },
  {
    name: 'workerGroupId',
    bind: 'workerGroupObj.workerGroupId',
  },
  {
    name: 'workerGroup',
    bind: 'workerGroupObj.workerGroup',
  },
];

const QueryDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    ...commonFields,
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${preCode}.taskNum`).d('task'),
    },
    {
      name: 'taskTypeId',
      type: 'string',
      lookupCode: 'LMDS.DOCUMENT_TYPE',
      valueField: 'documentTypeId',
      textField: 'documentTypeName',
      label: intl.get(`${preCode}.taskType`).d('任务类型'),
      lovPara: { documentClass: 'NP_TASK' },
    },
    {
      name: 'taskStatusList',
      type: 'string',
      lookupCode: 'LMES.TASK_STATUS',
      mutiple: true,
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      // required: true,
      defaultValue: ['RELEASED', 'RUNNING', 'DISPATCHED', 'QUEUING', 'PAUSE'],
    },
    {
      name: 'calendarDay',
      type: 'date',
      label: intl.get(`${preCode}.date`).d('日期'),
      required: true,
      defaultValue: moment().format('YYYY-MM-DD'),
    },
    {
      name: 'calendarShiftCode',
      type: 'string',
      lookupCode: 'LMDS.SHIFT_CODE',
      label: intl.get(`${preCode}.calendarShiftCode`).d('班次'),
      required: true,
      defaultValue: 'MORNING SHIFT',
    },
    {
      name: 'other',
      defaultValue: 'prodLine',
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'workerObj') {
        record.set('workerGroupObj', null);
      }
    },
  },
});

const TaskDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    {
      name: 'taskNum',
      label: intl.get(`${preCode}.taskNum`).d('任务单号'),
    },
    {
      name: 'taskStatusMeaning',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
    },
    {
      name: 'taskTypeId',
      label: intl.get(`${preCode}.taskTypeId`).d('任务类型'),
    },
    {
      name: 'calendarDay',
      type: 'date',
      label: intl.get(`${preCode}.calendarDay`).d('任务日期'),
      required: true,
      defaultValue: moment(new Date()).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'calendarShiftCode',
      label: intl.get(`${preCode}.calendarShiftCode`).d('任务班次'),
    },
    {
      name: 'workerGroupId',
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
    },
    {
      name: 'workerId',
      label: intl.get(`${commonCode}.worker`).d('操作工'),
    },
    {
      name: 'prodLineId',
      label: intl.get(`${commonCode}.prodLine`).d('产线'),
    },
    {
      name: 'equipmentId',
      label: intl.get(`${commonCode}.equipment`).d('设备'),
    },
    {
      name: 'workcellId',
      label: intl.get(`${commonCode}.workcell`).d('工位'),
    },
    {
      name: 'locationId',
      label: intl.get(`${commonCode}.location`).d('地点'),
    },
    {
      name: 'outsideLocation',
      label: intl.get(`${commonCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'planStartTime',
      type: 'date',
      label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      required: true,
      defaultValue: moment(new Date()).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'planEndTime',
      type: 'date',
      label: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
      required: true,
      defaultValue: moment(new Date()).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'standardWorkTime',
      label: intl.get(`${commonCode}.standardWorkTime`).d('标准工时'),
    },
    {
      name: 'Description',
      label: intl.get(`${commonCode}.description`).d('任务描述'),
    },
    {
      name: 'referenceDocument',
      label: intl.get(`${commonCode}.referenceDocument`).d('参考文件'),
    },
    {
      name: 'picturesIds',
      label: intl.get(`${commonCode}.picturesIds`).d('图片'),
    },
    {
      name: 'remark',
    },
  ],
});

export { QueryDS, TaskDS };
