/**
 * @Description: 任务报工--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-06 10:28:08
 * @LastEditors: yu.na
 */

import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmesTaskReport, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
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
    label: intl.get(`${commonCode}.workerGroup`).d('班组'),
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('orgId'),
      }),
    },
  },
  {
    name: 'workerGroupId',
    bind: 'workerGroupObj.workerGroupId',
  },
  {
    name: 'workerGroup',
    bind: 'workerGroupObj.workerGroupCode',
  },
  {
    name: 'workerGroupName',
    bind: 'workerGroupObj.workerGroupName',
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
      name: 'shift',
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
    {
      name: 'reworkFlag',
      type: 'boolean',
    },
  ],
});

const HeaderDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    ...commonFields,
    {
      name: 'moId',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.moOperation,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          moId: record.get('moId'),
        }),
        disabled: ({ record }) => {
          if (!record.get('inputNum') || !record.get('moId')) {
            return true;
          }
          return false;
        },
      },
    },
    {
      name: 'operationId',
      bind: 'operationObj.operationId',
    },
    {
      name: 'moOperationId',
      bind: 'operationObj.moOperationId',
    },
    {
      name: 'operationName',
      bind: 'operationObj.operationName',
    },
    {
      name: 'inputNum',
      type: 'string',
      required: true,
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'inputNum') {
        record.set('operationObj', null);
      }
      if (name === 'moId') {
        record.set('operationObj', null);
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
      name: 'itemCode',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDescription',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'operation',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'instruction',
      label: intl.get(`${preCode}.instruction`).d('工序说明'),
    },
    {
      name: 'firstOperationFlag',
      label: intl.get(`${preCode}.firstOperationFlag`).d('首工序'),
    },
    {
      name: 'lastOperationFlag',
      label: intl.get(`${preCode}.lastOperationFlag`).d('末工序'),
    },
    {
      name: 'taskQty',
      label: intl.get(`${preCode}.demandQty`).d('需求数量'),
    },
    {
      name: 'executableQty',
      type: 'number',
      label: intl.get(`${preCode}.executableQty`).d('可执行数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value),
    },
    {
      name: 'processOkQty',
      type: 'number',
      label: intl.get(`${preCode}.okQty`).d('合格数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value),
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'processNgQty',
      type: 'number',
      label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value),
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'scrappedQty',
      type: 'number',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value),
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'reworkQty',
      type: 'number',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value),
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'pendingQty',
      type: 'number',
      label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value),
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'defaultQty',
      type: 'number',
      label: intl.get(`${preCode}.defaultQty`).d('默认数量'),
      min: 0,
      // step: 1,
    },
    {
      name: 'lotInput',
    },
    {
      name: 'tagInput',
    },
    {
      name: 'remark',
    },
    {
      name: 'qcType',
      type: 'string',
      lookupCode: lmesTaskReport.qcType,
      // defaultValue: 'OK',
      required: true,
      // transformResponse: () => 'OK',
    },
    {
      name: 'processOkQty1',
      type: 'number',
      label: intl.get(`${preCode}.okQty`).d('合格数量'),
      transformResponse: (value) => value || 0,
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'processNgQty1',
      type: 'number',
      label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'scrappedQty1',
      type: 'number',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'reworkQty1',
      type: 'number',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'pendingQty1',
      type: 'number',
      label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
      required: true,
      min: 0,
      // step: 1,
    },
    {
      name: 'inspectType',
      type: 'string',
      lookupCode: lmesTaskReport.inspectType,
      label: intl.get(`${preCode}.inspectType`).d('报检类型'),
      required: true,
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/task-items`,
      method: 'GET',
    }),
  },
});

const TaskReturnDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.warehouse`).d('操作工'),
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

const ByProductionDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'taskId',
    },
    {
      name: 'orgId',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: lmesTaskReport.taskItem,
      label: intl.get(`${commonCode}.item`).d('物料'),
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemLineType: 'BYPRODUCT',
          taskId: record.get('taskId'),
        }),
      },
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.warehouse`).d('操作工'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('orgId'),
        }),
      },
      required: true,
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'remark',
      label: intl.get(`${commonCode}.model.remark`).d('原因'),
      type: 'string',
      lookupCode: 'LMES.BYPRODUCT_REASON',
      required: true,
    },
    {
      name: 'qcType',
      type: 'string',
      lookupCode: lmesTaskReport.qcType,
      defaultValue: 'OK',
      required: true,
      transformResponse: () => 'OK',
    },
    {
      name: 'quantity',
      type: 'number',
      min: 0,
    },
    {
      name: 'lotNumber',
      type: 'string',
    },
    {
      name: 'tagCode',
      type: 'string',
    },
    {
      name: 'processOkQty',
      type: 'number',
      label: intl.get(`${preCode}.okQty`).d('合格数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
    },
    {
      name: 'processNgQty',
      type: 'number',
      label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
    },
    {
      name: 'scrappedQty',
      type: 'number',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
    },
    {
      name: 'reworkQty',
      type: 'number',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
    },
    {
      name: 'pendingQty',
      type: 'number',
      label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      defaultValue: 0,
      transformResponse: (value) => value || 0,
    },
  ],
});

export { QueryDS, TaskDS, HeaderDS, TaskReturnDS, ByProductionDS };
