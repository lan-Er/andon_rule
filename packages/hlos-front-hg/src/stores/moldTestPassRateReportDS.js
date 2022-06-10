/**
 * @Description: 试模合格率报表--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-13 13:44:00
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.moldTestPassRateReport.model';

const ListDS = (props) => ({
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'judgedDateStart',
      type: 'date',
      label: intl.get(`${preCode}.judgedDateStart`).d('试模日期从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('judgedDateEnd')) {
            return 'judgedDateEnd';
          }
        },
      },
      validator: (value, name, record) => {
        if (record.get('judgedDateEnd')) {
          const startMonth = new Date(value).getMonth();
          const endMonth = new Date(record.get('judgedDateEnd')).getMonth();
          const startYear = new Date(value).getFullYear();
          const endYear = new Date(record.get('judgedDateEnd')).getFullYear();
          if (props.chartType === 'week' && (startYear !== endYear || endMonth - startMonth > 1)) {
            return '只能查询两个月的周度报表';
          } else if (props.chartType === 'month' && startYear !== endYear) {
            return '只能查询本年的月度报表';
          }
        }
        return true;
      },
    },
    {
      name: 'judgedDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.judgedDateEnd`).d('试模日期至'),
      required: true,
      min: 'judgedDateStart',
      validator: (value, name, record) => {
        if (record.get('judgedDateStart')) {
          const endMonth = new Date(value).getMonth();
          const startMonth = new Date(record.get('judgedDateStart')).getMonth();
          const endYear = new Date(value).getFullYear();
          const startYear = new Date(record.get('judgedDateStart')).getFullYear();
          if (props.chartType === 'week' && (startYear !== endYear || endMonth - startMonth > 1)) {
            return '只能查询两个月的周度报表';
          } else if (props.chartType === 'month' && startYear !== endYear) {
            return '只能查询本年的月度报表';
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
      name: 'worker',
      label: intl.get(`${preCode}.worker`).d('报工人'),
    },
    {
      name: 'equipment',
      label: intl.get(`${preCode}.equipment`).d('报工班组'),
    },
    {
      name: 'sampleQty',
      label: intl.get(`${preCode}.sampleQty`).d('试模数'),
    },
    {
      name: 'qcOkQty',
      label: intl.get(`${preCode}.qcOkQty`).d('合格数'),
    },
    {
      name: 'rate',
      label: intl.get(`${preCode}.rate`).d('合格率'),
    },
    {
      name: 'judgedDate',
      type: 'date',
      label: intl.get(`${preCode}.judgedDate`).d('试模日期'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg/model-pass-rate`,
      method: 'GET',
    }),
  },
});

export { ListDS };
