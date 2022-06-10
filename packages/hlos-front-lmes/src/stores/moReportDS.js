/**
 * @Description: MO报工--DS
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

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.moReport.model';
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
    bind: 'workerGroupObj.workerGroup',
  },
];

const QueryDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    ...commonFields,
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
  ],
});

const HeaderDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    ...commonFields,
    {
      name: 'inputNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('MO编码'),
      required: true,
    },
  ],
});

const MoDS = () => ({
  selection: false,
  autoCreate: true,
  fields: [
    {
      name: 'processOkQty',
      type: 'number',
      label: intl.get(`${preCode}.okQty`).d('合格数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value) || 0,
      required: true,
      min: 0,
      step: 0.000001,
    },
    {
      name: 'processNgQty',
      type: 'number',
      label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value) || 0,
      required: true,
      min: 0,
      step: 0.000001,
    },
    {
      name: 'scrappedQty',
      type: 'number',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value) || 0,
      required: true,
      min: 0,
      step: 0.000001,
    },
    {
      name: 'reworkQty',
      type: 'number',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value) || 0,
      required: true,
      min: 0,
      step: 0.000001,
    },
    {
      name: 'pendingQty',
      type: 'number',
      label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      defaultValue: 0,
      transformResponse: (value) => Number(value) || 0,
      required: true,
      min: 0,
      step: 0.000001,
    },
    {
      name: 'defaultQty',
      type: 'number',
      label: intl.get(`${preCode}.defaultQty`).d('默认数量'),
      min: 0,
      step: 0.000001,
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
      label: intl.get(`${preCode}.qcType`).d('标签类型'),
      lookupCode: 'LMES.TAG_TYPE',
      required: true,
      transformResponse: (value) => value || 'OK',
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/mos`,
      method: 'GET',
    }),
  },
});

export { QueryDS, MoDS, HeaderDS };
