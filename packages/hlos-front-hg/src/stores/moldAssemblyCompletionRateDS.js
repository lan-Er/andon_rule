/**
 * @Description: 模具组立完成率报表--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-13 13:44:00
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.moldAssemblyCompletionRate.model';

const ListDS = (props) => ({
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('计划组立日期从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('endDate')) {
            return 'endDate';
          }
        },
      },
      validator: (value, name, record) => {
        if (record.get('startDate')) {
          const startTime = new Date(value).getTime();
          const endTime = new Date(record.get('endDate')).getTime();
          if (props.chartType === 'week' && (endTime - startTime) / 1000 / 60 / 60 / 24 > 60) {
            return '只能查询60天内的周度报表';
          } else if (
            props.chartType === 'month' &&
            (endTime - startTime) / 1000 / 60 / 60 / 24 > 210
          ) {
            return '只能查询210天内的月度报表';
          }
        }
        return true;
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('计划组立日期至'),
      required: true,
      min: 'startDate',
      validator: (value, name, record) => {
        if (record.get('startDate')) {
          const endTime = new Date(value).getTime();
          const startTime = new Date(record.get('startDate')).getTime();
          if (props.chartType === 'week' && (endTime - startTime) / 1000 / 60 / 60 / 24 > 60) {
            return '只能查询60天内的周度报表';
          } else if (
            props.chartType === 'month' &&
            (endTime - startTime) / 1000 / 60 / 60 / 24 > 210
          ) {
            return '只能查询210天内的月度报表';
          }
        }
        return true;
      },
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: 'LMDS.WORKER',
      label: intl.get(`${preCode}.worker`).d('报工人'),
      ignore: 'always',
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('报工班组'),
      lovCode: 'LMDS.EQUIPMENT',
      lovPara: { EQUIPMENT_TYPE: 'VIRTUAL' },
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
  ],
  fields: [
    {
      name: 'workName',
      label: intl.get(`${preCode}.worker`).d('报工人'),
    },
    {
      name: 'equipmentName',
      label: intl.get(`${preCode}.equipment`).d('报工班组'),
    },
    {
      name: 'qty',
      label: intl.get(`${preCode}.qty`).d('计划组立数'),
    },
    {
      name: 'okQty',
      label: intl.get(`${preCode}.okQty`).d('实际完工数'),
    },
    {
      name: 'rate',
      label: intl.get(`${preCode}.rate`).d('完成率'),
    },
    {
      name: 'planEndTime',
      type: 'date',
      label: intl.get(`${preCode}.planEndTime`).d('计划组立日期'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/hg/mold-assembly-completion-rate`,
      method: 'GET',
    }),
  },
});

export { ListDS };
