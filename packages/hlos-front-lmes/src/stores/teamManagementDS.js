/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-21 10:48:03
 * @LastEditTime: 2021-07-22 15:44:50
 * @Description:
 */

import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
// import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesTeamManagement } = codeConfig.code;

// GET /v1/{tenantId}/tasks/employee-work-detail 获取员工详情
// GET /v1/{tenantId}/tasks/query-worker-group 获取班组详情
// GET /v1/{tenantId}/tasks/work-group-performance 绩效查看
// GET /v1/{tenantId}/tasks/work-group-oneself-list 员工生产详情
// GET /v1/{tenantId}/tasks/employee-work-detail

const organizationId = getCurrentOrganizationId();
const workerGroupUrl = `${HLOS_LMES}/v1/${organizationId}/tasks/query-worker-group`;
// const getWorkStatus = `${HLOS_LMES}/v1/${organizationId}/work-times/work-status`;
const groupPerformanceUrl = `${HLOS_LMES}/v1/${organizationId}/tasks/work-group-performance`;
const workGroupOneselfListUrl = `${HLOS_LMES}/v1/${organizationId}/tasks/work-group-oneself-list`;
const employeeWorkDetailUrl = `${HLOS_LMES}/v1/${organizationId}/tasks/employee-work-detail`;

const commonFields = [
  {
    name: 'supervisorObj',
    type: 'object',
    lovCode: lmesTeamManagement.foreman,
    ignore: 'always',
    required: true,
    // dynamicProps: {
    //   lovPara: () => ({
    //     chiefPosition: 'Y',
    //   }),
    // },
  },
  {
    name: 'supervisorName',
    type: 'string',
    bind: 'supervisorObj.workerName',
    // ignore: 'always',
  },
  {
    name: 'supervisorCode',
    type: 'string',
    bind: 'supervisorObj.workerCode',
  },
  {
    name: 'supervisorId',
    type: 'string',
    bind: 'supervisorObj.workerId',
  },
  {
    name: 'fileUrl',
    type: 'string',
    bind: 'supervisorObj.fileUrl',
    // ignore: 'always',
  },
  {
    name: 'organizationId',
    type: 'string',
    bind: 'supervisorObj.organizationId',
  },
  {
    name: 'organizationCode',
    type: 'string',
    bind: 'supervisorObj.organizationCode',
  },
  {
    name: 'organizationName',
    type: 'string',
    bind: 'supervisorObj.organizationName',
  },
  {
    name: 'workerGroupObj',
    type: 'object',
    lovCode: lmesTeamManagement.workerGroup,
    ignore: 'always',
    required: true,
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
    cascadeMap: { supervisorId: 'supervisorId' },
  },
  {
    name: 'workerGroupName',
    type: 'string',
    bind: 'workerGroupObj.workerGroupName',
    // ignore: 'always',
  },
  {
    name: 'workerGroupId',
    type: 'string',
    bind: 'workerGroupObj.workerGroupId',
  },
  {
    name: 'workerGroupCode',
    type: 'string',
    bind: 'workerGroupObj.workerGroupCode',
  },
  {
    name: 'calendarShift',
    type: 'string',
    lookupCode: lmesTeamManagement.shiftCode,
    required: true,
    defaultValue: 'MORNING SHIFT',
  },
  {
    name: 'date',
    type: 'date',
    defaultValue: moment().format(DEFAULT_DATE_FORMAT),
    required: true,
  },
  {
    name: 'workTimeClass',
    type: 'string',
    defaultValue: 'WORKER_TIME',
    lookupCode: lmesTeamManagement.workTimeClass,
  },
  {
    name: 'workerTimeType',
    type: 'string',
    lookupCode: lmesTeamManagement.workTimeType,
    required: true,
    defaultValue: 'REGULAR_WORKTIME',
  },
  {
    name: 'workerObj',
    type: 'object',
    cascadeMap: { workerGroupInId: 'workerGroupId' },
    lovCode: common.worker,
    ignore: 'always',
  },
  {
    name: 'workerId',
    type: 'string',
    bind: 'workerObj.workerId',
  },
  {
    name: 'workerName',
    type: 'string',
    bind: 'workerObj.workerName',
    ignore: 'always',
  },
  {
    name: 'workerCode',
    type: 'string',
    bind: 'workerObj.workerCode',
  },
];

const commonHeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
      // ignore: 'always',
    },
    {
      name: 'organizationCode',
      type: 'string',
      // ignore: 'always',
    },
    {
      name: 'supervisorObj',
      type: 'object',
      lovCode: lmesTeamManagement.foreman,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          // chiefPosition: 'Y',
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'supervisorName',
      type: 'string',
      bind: 'supervisorObj.workerName',
      // ignore: 'always',
    },
    {
      name: 'supervisorCode',
      type: 'string',
      bind: 'supervisorObj.workerCode',
    },
    {
      name: 'supervisorId',
      type: 'string',
      bind: 'supervisorObj.workerId',
    },
    {
      name: 'fileUrl',
      type: 'string',
      bind: 'supervisorObj.fileUrl',
      // ignore: 'always',
    },
    // {
    //   name: 'organizationId',
    //   type: 'string',
    //   bind: 'supervisorObj.organizationId',
    // },
    // {
    //   name: 'organizationCode',
    //   type: 'string',
    //   bind: 'supervisorObj.organizationCode',
    // },
    // {
    //   name: 'organizationName',
    //   type: 'string',
    //   bind: 'supervisorObj.organizationName',
    // },
    {
      name: 'workerGroupObj',
      type: 'object',
      lovCode: lmesTeamManagement.workerGroup,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      cascadeMap: { supervisorId: 'supervisorId' },
    },
    {
      name: 'workerGroupName',
      type: 'string',
      bind: 'workerGroupObj.workerGroupName',
      // ignore: 'always',
    },
    {
      name: 'workerGroupId',
      type: 'string',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroupCode',
      type: 'string',
      bind: 'workerGroupObj.workerGroupCode',
    },
    {
      name: 'manageRuleId',
      type: 'string',
      bind: 'workerGroupObj.manageRuleId',
    },
    {
      name: 'calendarShift',
      type: 'string',
      lookupCode: lmesTeamManagement.shiftCode,
      required: true,
      defaultValue: 'MORNING SHIFT',
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: moment().format(DEFAULT_DATE_FORMAT),
      required: true,
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'supervisorObj') {
        record.set('workerGroupObj', null);
      }
    },
  },
});

const workTypeDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerTimeType',
      type: 'string',
      lookupCode: lmesTeamManagement.workTimeType,
      required: true,
      defaultValue: 'REGULAR_WORKTIME',
    },
  ],
});

const teamManagementDS = () => ({
  selection: 'multiple',
  autoQuery: false,
  autoCreate: true,
  fields: [
    {
      name: 'workStatus',
      type: 'string',
    },
    {
      name: 'workerName',
      type: 'string',
    },
    {
      name: 'workerNumber',
      type: 'string',
    },
    {
      name: 'picture',
      type: 'string',
    },
    {
      name: 'startTime',
      type: 'date',
    },
    {
      name: 'endTime',
      type: 'date',
    },
    {
      name: 'effectiveTime',
      type: 'string',
    },
    {
      name: 'taskNum',
      type: 'string',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'itemId',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
  ],
  transport: {
    read: () => ({
      url: workerGroupUrl,
      method: 'GET',
      params: {
        page: -1,
      },
    }),
  },
});

const shiftSummaryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'performanceSummary',
      type: 'string',
    },
    // {
    //   name: 'personnel',
    //   type: 'string',
    // },
    {
      name: 'absentWorkerQty',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'planWorkerQty',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'actualWorkerQty',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'workerSummary',
      type: 'string',
    },
    {
      name: 'runningEquipmentQty',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'brokenEquipmentQty',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'repairingEquipmentQty',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'resourceSummary',
      type: 'string',
    },
    {
      name: 'exceptionSummary',
      type: 'string',
    },
  ],
});

const performanceCheckDS = () => ({
  autoQuery: false,
  queryFields: [
    ...commonFields,
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
  ],
  fields: [{}],
  transport: {
    read: () => ({
      url: groupPerformanceUrl,
      method: 'GET',
    }),
  },
});

const performanceCheckModalDS = () => ({
  autoQuery: false,
  autoCreate: true,
  fields: [
    {
      name: 'workerName',
      type: 'string',
    },
    {
      name: 'workerId',
      type: 'string',
    },
    {
      name: 'workerCode',
      type: 'string',
    },
    {
      name: 'workerNumber',
      type: 'string',
    },
    {
      name: 'taskNumber',
      type: 'string',
    },
    {
      name: 'taskId',
      type: 'string',
    },
    {
      name: 'timeSpan',
      type: 'string',
    },
    {
      name: 'itemId',
      type: 'string',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'uom',
      type: 'string',
    },
    {
      name: 'uomId',
      type: 'string',
    },
    {
      name: 'executeQty',
      type: 'number',
    },
    {
      name: 'executeQty',
      type: 'number',
    },
    {
      name: 'executeNgQty',
      type: 'number',
    },
    {
      name: 'scrappedQty',
      type: 'number',
    },
    {
      name: 'reworkQty',
      type: 'number',
    },
  ],
  transport: {
    read: () => ({
      url: workGroupOneselfListUrl,
      method: 'GET',
      params: {
        page: -1,
      },
    }),
  },
});

const teamManagementModalDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'taskNumber',
      type: 'string',
    },
    {
      name: 'taskId',
      type: 'string',
    },
    {
      name: 'taskStatus',
      type: 'string',
    },
    {
      name: 'taskStatusMeaning',
      type: 'string',
    },
    {
      name: 'actualStartTime',
      type: 'date',
    },
    {
      name: 'actualEndTime',
      type: 'date',
    },
    {
      name: 'processedTime',
      type: 'number',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'itemId',
      type: 'string',
    },
    {
      name: 'itemDescription',
      type: 'string',
    },
    {
      name: 'taskQty',
      type: 'number',
    },
    {
      name: 'uom',
      type: 'string',
    },
    {
      name: 'uomId',
      type: 'string',
    },
  ],
  transport: {
    read: () => ({
      url: employeeWorkDetailUrl,
      method: 'GET',
      params: {
        page: -1,
        taskStatus: 'RUNNING,PAUSE,PENDING',
      },
    }),
  },
});

export {
  commonHeaderDS,
  teamManagementDS,
  shiftSummaryDS,
  performanceCheckDS,
  performanceCheckModalDS,
  teamManagementModalDS,
  workTypeDS,
};
