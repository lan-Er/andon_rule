/*
 * @Descripttion: 批量报工DS
 * @Author: yu.na@hand-china.com
 * @Date: 2021-02-23 14:32:22
 */
import { HLOS_LMDS, HLOS_LMESS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const preCode = 'lmes.batchReport.model';
const { common, lmesTaskReport } = codeConfig.code;

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/andons/triggered-pc`;

export const LoginDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'orgId',
      },
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.worker`).d('操作工'),
        ignore: 'always',
        required: true,
        noCache: true,
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
        name: 'prodlineObj',
        type: 'object',
        lovCode: common.prodLine,
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('orgId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        bind: 'prodlineObj.prodLineId',
      },
      {
        name: 'prodLineCode',
        bind: 'prodlineObj.prodLineCode',
      },
      {
        name: 'resourceName',
        bind: 'prodlineObj.resourceName',
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${preCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        ignore: 'always',
        noCache: true,
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
        label: intl.get(`${preCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        ignore: 'always',
        noCache: true,
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
        name: 'workergroupObj',
        type: 'object',
        lovCode: common.workerGroup,
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('orgId'),
          }),
        },
      },
      {
        name: 'workerGroupId',
        bind: 'workergroupObj.workerGroupId',
      },
      {
        name: 'workerGroup',
        bind: 'workergroupObj.workerGroupCode',
      },
      {
        name: 'taskNum',
        type: 'string',
        label: intl.get(`${preCode}.taskNum`).d('task'),
      },
      {
        name: 'reportType',
        type: 'string',
        lookupCode: 'LMES.TASK_REPORT_TYPE',
        label: intl.get(`${preCode}.reportType`).d('报工类型'),
        required: true,
        defaultValue: 'MO',
      },
      {
        name: 'date',
        type: 'date',
        label: intl.get(`${preCode}.date`).d('日期'),
        required: true,
        defaultValue: moment(new Date()).format(DEFAULT_DATE_FORMAT),
      },
      {
        name: 'calendarShiftCode',
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
    ],
  };
};

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
      lovCode: lmesTaskReport.taskItem,
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

export const OtherQueryDS = () => ({
  queryFields: [
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('MO号'),
    },
    {
      name: 'moTypeObj',
      type: 'object',
      label: '工单类型',
      lovCode: 'LMDS.DOCUMENT_TYPE',
      lovPara: {
        documentClass: 'MO',
      },
      ignore: 'always',
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'moTypeObj.documentTypeId',
    },
    {
      name: 'itemList',
      type: 'object',
      label: '物料',
      lovCode: common.item,
      multiple: ',',
      noCache: true,
      ignore: 'always',
    },
    {
      name: 'itemIdList',
      bind: 'itemList.itemId',
      type: 'string',
      transformRequest: (val) => (val ? val.join(',') : undefined),
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('MO状态'),
      lookupCode: 'LMES.MO_STATUS',
      multiple: true,
      defaultValue: ['RELEASED'],
    },
    {
      name: 'demandDateStart',
      type: 'string',
      label: '需求日期从',
      defaultValue: new Date(),
    },
    {
      name: 'demandDateEnd',
      type: 'string',
      label: '需求日期至',
      defaultValue: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'releasedDateStart',
      type: 'string',
      label: '下达日期从',
    },
    {
      name: 'releasedDateEnd',
      type: 'string',
      label: '下达日期至',
    },
  ],
  fields: [
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('MO号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料编码',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '物料',
    },
    {
      name: 'moStatusMeaning',
      type: 'string',
      label: 'MO状态',
    },
    {
      name: 'demandQty',
      type: 'string',
      label: '需求数量',
    },
    {
      name: 'demandDate',
      type: 'string',
      label: '需求日期',
    },
    {
      name: 'releasedDate',
      type: 'string',
      label: '下达日期',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { moStatus } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/grwl-mos/batch-report-mos`,
          { moStatusList: moStatus }
        ),
        method: 'GET',
        data: { ...data, moStatus: undefined },
      };
    },
  },
});
