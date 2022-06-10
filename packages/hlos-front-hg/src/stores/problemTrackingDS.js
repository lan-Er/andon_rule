/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-17 10:41:36
 * @LastEditTime: 2020-09-07 16:51:39
 * @Description:问题追踪DS
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import moment from 'moment';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.problemTracking.model';

const url = `${HLOS_LMDS}/v1/${organizationId}/issues`;
const commonFields = [
  {
    name: 'organizationId',
    type: 'string',
    required: true,
  },
  {
    name: 'issueNum',
    type: 'string',
    label: intl.get(`${preCode}.issueNum`).d('问题编号'),
  },
  {
    name: 'issueType',
    type: 'string',
    label: intl.get(`${preCode}.issueType`).d('类型'),
    lookupCode: 'LMDS.ISSUE_TYPE',
    required: true,
  },
  {
    name: 'issueTopic',
    type: 'string',
    label: intl.get(`${preCode}.issueNum`).d('问题主题'),
    required: true,
  },
  // {
  //   name: 'issuePriority',
  //   type: 'string',
  //   label: intl.get(`${preCode}.issuePriority`).d('优先级'),
  //   required: true,
  // },
  {
    name: 'issueRank',
    type: 'string',
    label: intl.get(`${preCode}.issueRank`).d('重要等级'),
    lookupCode: 'LMDS.ISSUE_RANK',
    required: true,
  },
  {
    name: 'issueStatus',
    type: 'string',
    lookupCode: 'LMDS.ISSUE_STATUS',
    label: intl.get(`${preCode}.issueStatus`).d('状态'),
    defaultValue: 'NEW',
  },
  {
    name: 'issueStatusMeaning',
    type: 'string',
  },
  {
    name: 'docObj',
    type: 'object',
    lovCode: 'LMDS.DOCUMENT',
    ignore: 'always',
    label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
    // textField: 'documentNum',
  },
  {
    name: 'sourceDocNum',
    type: 'string',
    bind: 'docObj.documentNum',
  },
  {
    name: 'sourceDocId',
    type: 'string',
    bind: 'docObj.documentId',
  },
  {
    name: 'resourceObj',
    type: 'object',
    lovCode: 'LMDS.RESOURCE',
    label: intl.get(`${preCode}.resourceCode`).d('关联资源'),
    ignore: 'always',
  },
  {
    name: 'resourceCode',
    type: 'string',
    bind: 'resourceObj.resourceCode',
  },
  {
    name: 'resourceId',
    type: 'string',
    bind: 'resourceObj.resourceId',
  },
  {
    name: 'resourceName',
    type: 'string',
    bind: 'resourceObj.resourceName',
  },
  {
    name: 'picture',
    type: 'string',
    label: intl.get(`${preCode}.picture`).d('图片'),
  },
  {
    name: 'workerObj',
    type: 'object',
    lovCode: 'LMDS.WORKER',
    label: intl.get(`${preCode}.workerObj`).d('提出人'),
    required: true,
    textField: 'workerCode',
    ignore: 'always',
  },
  {
    name: 'submittedWorkerId',
    type: 'string',
    bind: 'workerObj.workerId',
  },
  {
    name: 'submittedWorker',
    type: 'string',
    bind: 'workerObj.workerName',
  },
  {
    name: 'description',
    type: 'string',
    maxLength: 500,
  },
  {
    name: 'reasonAnalysis',
    type: 'string',
    maxLength: 500,
  },
  // {
  //   name: 'phoneNumber',
  //   type: 'string',
  //   pattern: /1[3-9]\d{9}/,
  //   label: intl.get(`${preCode}.phoneNumber`).d('联系电话'),
  // },
  {
    name: 'submittedTime',
    type: 'date',
    label: intl.get(`${preCode}.submittedTime`).d('提交时间'),
    defaultValue: NOW_DATE,
    format: 'YYYY-MM-DD HH:mm:SS',
  },
];

const ListDS = () => ({
  pageSize: 10,
  selection: 'multiple',
  autoQuery: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.organization`).d('组织'),
      lovCode: 'LMDS.ORGANIZATION',
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'issueNum',
      type: 'string',
      label: intl.get(`${preCode}.issueNum`).d('问题编号'),
    },
    {
      name: 'issueTopic',
      type: 'string',
      label: intl.get(`${preCode}.issueTopic`).d('问题主题'),
    },
    {
      name: 'issueType',
      type: 'string',
      label: intl.get(`${preCode}.issueType`).d('问题类型'),
      lookupCode: 'LMDS.ISSUE_TYPE',
    },
    {
      name: 'issueStatus',
      type: 'string',
      label: intl.get(`${preCode}.issueStatus`).d('问题状态'),
      lookupCode: 'LMDS.ISSUE_STATUS',
    },
    // {
    //   name: 'priorityStart',
    //   type: 'string',
    //   label: intl.get(`${preCode}.issuePriorityStart`).d('优先级＞＝'),
    // },
    // {
    //   name: 'priorityEnd',
    //   type: 'string',
    //   label: intl.get(`${preCode}.issuePriorityEnd`).d('优先级＜'),
    // },
    {
      name: 'issueRank',
      type: 'string',
      label: intl.get(`${preCode}.issueRank`).d('重要等级'),
      lookupCode: 'LMDS.ISSUE_RANK',
    },
    {
      name: 'sourceDocNumObj',
      type: 'object',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      lovCode: 'LMDS.DOCUMENT',
      ignore: 'always',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceDocNumObj.documentNum',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocNumObj.documentId',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('关联资源'),
      lovCode: 'LMDS.RESOURCE',
      ignore: 'always',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resourceObj.resourceCode',
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'submittedWorkerObj',
      type: 'object',
      label: intl.get(`${preCode}.submittedWorker`).d('提出人'),
      lovCode: 'LMDS.WORKER',
      ignore: 'always',
    },
    {
      name: 'submittedWorkerId',
      type: 'string',
      bind: 'submittedWorkerObj.workerId',
    },
    {
      name: 'submittedWorker',
      type: 'string',
      bind: 'submittedWorkerObj.workerName',
    },
    {
      name: 'submittedTime',
      type: 'date',
      label: intl.get(`${preCode}.submittedTime`).d('提出日期'),
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      ignore: 'always',
    },
    {
      name: 'submittedTimeStart',
      type: 'date',
      bind: 'submittedTime',
      transformRequest: (val) => (val ? moment(val).startOf('day') : ''),
    },
    {
      name: 'submittedTimeEnd',
      type: 'date',
      bind: 'submittedTime',
      transformRequest: (val) => (val ? moment(val).endOf('day') : ''),
    },
  ],
  fields: commonFields,
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
    create: ({ data, params }) => {
      return {
        url,
        data: {
          ...data[0],
          tenantId: organizationId,
        },
        params,
        method: 'POST',
      };
    },
    update: ({ data, params }) => {
      return {
        url,
        data: {
          ...data[0],
        },
        params,
        method: 'put',
      };
    },
    destroy: () => {
      return {
        url,
        method: 'DELETE',
      };
    },
  },
  events: {},
});

const DetailDS = () => ({
  fields: [
    ...commonFields,
    {
      name: 'closedWorkerObj',
      type: 'object',
      ignore: 'always',
    },
    {
      name: 'closedBy',
      type: 'string',
      bind: 'closedWorkerObj.workerId',
    },
    {
      name: 'closedWorker',
      type: 'string',
      bind: 'closedWorkerObj.workerName',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${url}/${data.issueId}`,
        method: 'get',
      };
    },
    update: ({ data, params }) => {
      return {
        url,
        data: {
          ...data[0],
        },
        params,
        method: 'put',
      };
    },
  },
});

export { ListDS, DetailDS };
