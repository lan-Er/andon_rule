/**
 * @Description: 模具交期达成率报表--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-13 13:44:00
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.moldDeliveryCompletionRate.model';

const ListDS = (props) => ({
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('需求交期从'),
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
            (endTime - startTime) / 1000 / 60 / 60 / 24 > 180
          ) {
            return '只能查询180天内的月度报表';
          }
        }
        return true;
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('需求交期至'),
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
            (endTime - startTime) / 1000 / 60 / 60 / 24 > 180
          ) {
            return '只能查询180天内的月度报表';
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
      name: 'workName',
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
      label: intl.get(`${preCode}.qty`).d('模具数'),
    },
    {
      name: 'okQty',
      label: intl.get(`${preCode}.okQty`).d('完成数'),
    },
    {
      name: 'rate',
      label: intl.get(`${preCode}.rate`).d('交期达成率'),
    },
    {
      name: 'demandDate',
      type: 'date',
      label: intl.get(`${preCode}.demandDate`).d('需求交期'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/hg/mold-delivery-completion-rate`,
      method: 'GET',
    }),
  },
});

export { ListDS };
