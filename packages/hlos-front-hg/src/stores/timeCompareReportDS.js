/**
 * @Description: 工时对比报表--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-06 09:52:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.timeCompareReport.model';

const ListDS = () => ({
  pageSize: 10,
  selection: 'multiple',
  queryFields: [
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: 'LMDS.EQUIPMENT',
      required: true,
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentName',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'startTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.startTime`).d('开始时间'),
      required: true,
      validator: (value, name, record) => {
        if (record.get('endTime') && value < moment(record.get('endTime')).add(-7, 'days')) {
          return '开始时间与结束时间间隔不能超过7天';
        }
        return true;
      },
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('endTime')) {
            return 'endTime';
          }
        },
      },
    },
    {
      name: 'endTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.endTime`).d('结束时间'),
      required: true,
      min: 'startTime',
      validator: (value, name, record) => {
        if (record.get('startTime') && value > moment(record.get('startTime')).add(7, 'days')) {
          return '开始时间与结束时间间隔不能超过7天';
        }
        return true;
      },
    },
  ],
  fields: [
    {
      name: 'equipmentCode',
      label: intl.get(`${preCode}.equipmentCode`).d('设备编码'),
    },
    {
      name: 'equipmentName',
      label: intl.get(`${preCode}.equipmentName`).d('设备名称'),
    },
    {
      name: 'startTime',
      label: intl.get(`${preCode}.startTime`).d('开始时间'),
    },
    {
      name: 'endTime',
      label: intl.get(`${preCode}.endTime`).d('结束时间'),
    },
    {
      name: 'workTime',
      label: intl.get(`${preCode}.workHour`).d('设备工时'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/work-times`,
      method: 'GET',
    }),
    submit: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/work-times`,
      method: 'PUT',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const TaskDS = () => ({
  pageSize: 10,
  selection: 'multiple',
  fields: [
    {
      name: 'taskNum',
      label: intl.get(`${preCode}.taskNum`).d('任务编码'),
    },
    {
      name: 'operation',
      label: intl.get(`${preCode}.operation`).d('工序名称'),
    },
    {
      name: 'workerName',
      label: intl.get(`${preCode}.worker`).d('报工人'),
    },
    {
      name: 'actualStartTime',
      label: intl.get(`${preCode}.actualStartTime`).d('开工时间'),
    },
    {
      name: 'actualEndTime',
      label: intl.get(`${preCode}.actualEndTime`).d('完工时间'),
    },
    {
      name: 'taskHour',
      label: intl.get(`${preCode}.taskHour`).d('系统工时'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/hg-task-report`,
      method: 'GET',
    }),
    submit: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/batch-update`,
      method: 'PUT',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

export { ListDS, TaskDS };
