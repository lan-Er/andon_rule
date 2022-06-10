/*
 * @Description:我的任务
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-01-12
 * @LastEditors:
 * @LastEditTime:
 */

import moment from 'moment';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';

const { common } = codeConfig.code;

const preCode = 'ldab.myTask.model';
const commonCode = 'ldab.common.model';
const organzationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organzationId}/tasks`;

const QueryDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    { name: 'orgId' },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: 'always',
      required: false,
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
      required: false,
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
  ],
});

const TaskDS = () => ({
  selection: false,
  // autoCreate: true,
  autoQuery: false,
  pageSize: 100,
  transport: {
    read: (config) => ({
      url: `${commonUrl}/my-task-report`,
      method: 'POST',
      ...config,
    }),
  },
  fields: [
    {
      name: 'item',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
    {
      name: 'taskType',
      type: 'string',
      defaultValue: 'TASK',
    },
    {
      name: 'itemId',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'itemDescription',
    },
    {
      name: 'placeOfProduction',
      label: intl.get(`${preCode}.placeOfProduction`).d('生产地点'),
    },
    {
      name: 'prodLineName',
    },
    {
      name: 'workcellName',
    },
    {
      name: 'equipmentName',
    },
    {
      name: 'locationName',
    },
    {
      name: 'outsideLocation',
    },
    {
      name: 'productionSchedule',
      label: intl.get(`${preCode}.`).d('生产进度'),
    },
    {
      name: 'taskTypeName',
      label: intl.get(`${preCode}.taskTypeName`).d('任务类型'),
    },
    {
      name: 'number',
      label: intl.get(`${preCode}.number`).d('单据号'),
    },
    {
      name: 'executionNum',
      label: intl.get(`${preCode}.executionNum`).d('执行数量'),
    },
    {
      name: 'executableQty', // 可执行数量
    },
    {
      name: 'taskNum',
      label: intl.get(`${preCode}.taskNum`).d('任务号'),
    },
    {
      name: 'documentNum',
      label: intl.get(`${preCode}.documentNum`).d('MO号'),
    },
    {
      name: 'operation',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'taskQty',
      label: intl.get(`${preCode}.taskQty`).d('任务数量'),
    },
    {
      name: 'processOkQty',
      label: intl.get(`${preCode}.processOkQty`).d('合格数量'),
    },
    {
      name: 'processNgQty',
      label: intl.get(`${preCode}.processNgQty`).d('不合格数量'),
    },
    {
      name: 'scrappedQty',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
    },
    {
      name: 'reworkQty',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
    },
    {
      name: 'wipQty',
      label: intl.get(`${preCode}.wipQty`).d('在制数量'),
    },
    {
      name: 'percentOfPass',
      label: intl.get(`${preCode}.percentOfPass`).d('合格率'),
    },
    {
      name: 'actualStartTime',
      label: intl.get(`${preCode}.actualStartTime `).d('实际开始时间'),
      order: 'asc',
    },
    {
      name: 'actualEndTime',
      label: intl.get(`${preCode}.actualStartTime `).d('完成时间'),
    },
    {
      name: 'processedTime',
      label: intl.get(`${preCode}.`).d('实际工时'),
    },
    {
      name: 'standardWorkTime',
      label: intl.get(`${preCode}.`).d('标准工时'),
    },
    {
      name: 'planTime',
      label: intl.get(`${preCode}.planEndTime`).d('计划时间'),
    },
    {
      name: 'planStartTime',
      label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      order: 'asc',
    },
    {
      name: 'planEndTime',
      label: intl.get(`${preCode}.planEndTime `).d('计划结束时间'),
    },
    {
      name: 'workcellName',
      label: intl.get(`${preCode}.Worker`).d('操作工'),
    },
  ],
});

const TimeDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    {
      name: 'time',
      type: 'date',
      range: ['start', 'end'],
      defaultValue: { start: NOW_DATE, end: NOW_DATE },
      validator: (value) => {
        if (value && value.end > moment(value.start).add(365, 'days')) {
          return `起始结束日期跨度不可超过365天`;
        }
        return true;
      },
      required: true,
    },
  ],
});

export { QueryDS, TaskDS, TimeDS };
