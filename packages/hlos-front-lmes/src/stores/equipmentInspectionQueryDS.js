/*
 * @Description: 设备点检
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-17 14:43:37
 */

import moment from 'moment';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const { common, lmesEquipmentInspection } = codeConfig.code;
const queryEquipmentInspectionUrl = `${HLOS_LMES}/v1/${organizationId}/tasks/query`;

export const equipmentInspectionQueryDS = () => ({
  autoCreate: true,
  pageSize: 20,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: lmesEquipmentInspection.organization,
      label: '组织',
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
      ignore: 'always',
    },
    {
      name: 'taskObj',
      type: 'object',
      noCache: true,
      lovCode: common.tpmTask,
      label: '点检单号',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          taskTypeCode: 'EQUIPMENT_PERIOD_CHECK_TASK',
          taskClass: 'TPM_TASK',
          taskStatus: 'RELEASED',
        }),
      },
      ignore: 'always',
    },
    {
      name: 'taskId',
      type: 'string',
      bind: 'taskObj.taskId',
    },
    {
      name: 'taskNum',
      type: 'string',
      bind: 'taskObj.taskNumber',
      ignore: 'always',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      noCache: true,
      lovCode: common.equipment,
      label: '设备',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipmentObj.equipmentCode',
      ignore: 'always',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      lovCode: common.prodLine,
      label: '生产线',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
      ignore: 'always',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'creationDateMin',
      type: 'time',
      max: 'creationDateMax',
      label: '创建时间>=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'creationDateMax',
      type: 'time',
      min: 'creationDateMin',
      label: '创建时间<=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'checkTimeMin',
      type: 'time',
      max: 'checkTimeMax',
      label: '点检时间>=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'checkTimeMax',
      type: 'time',
      min: 'checkTimeMin',
      label: '点检时间<=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'taskStatus',
      type: 'string',
      lookupCode: lmesEquipmentInspection.status,
      label: '点检单状态',
      defaultValue: 'RELEASED',
      required: true,
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: queryEquipmentInspectionUrl,
        method: 'get',
        params,
      };
    },
  },
});
