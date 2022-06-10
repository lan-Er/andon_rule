/*
 * @Description: 设备履历DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-23 10:21:00
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import intl from 'utils/intl';

const organizationId = getCurrentOrganizationId();

const { common, lmdsEquipmentResume } = codeConfig.code;
const preCode = 'lmds.equipmentResume.model';
const commonCode = 'lmds.common.model';

const url = `${HLOS_LMDS}/v1/${organizationId}/equipments`;

export const EquipmentListDS = () => ({
  autoCreate: true,
  pageSize: 20,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: common.organization,
      label: intl.get(`${commonCode}.organizationObj`).d('组织'),
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      noCache: true,
      lovCode: common.equipment,
      label: intl.get(`${commonCode}.equipmentObj`).d('设备'),
      required: true,
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
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
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});

export const EquipmentLineDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'trackType',
      type: 'string',
      lookupCode: lmdsEquipmentResume.type,
      label: intl.get(`${preCode}.trackType`).d('类型'),
      multiple: true,
    },
    {
      name: 'workerObj',
      type: 'object',
      noCache: true,
      lovCode: common.worker,
      label: intl.get(`${commonCode}.workerObj`).d('操作工'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'time',
      type: 'date',
      range: ['trackTimeStart', 'trackTimeEnd'],
      label: '执行时间',
    },
  ],
});

export const EquipmentAddDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'trackType',
      type: 'string',
      lookupCode: lmdsEquipmentResume.type,
      required: true,
      label: intl.get(`${preCode}.trackType`).d('执行类型'),
    },
    {
      name: 'trackTime',
      type: 'datetime',
      required: true,
      label: intl.get(`${preCode}.trackTime`).d('执行时间'),
      defaultValue: moment().format(DEFAULT_DATETIME_FORMAT),
    },
    {
      name: 'workerObj',
      type: 'object',
      noCache: true,
      lovCode: common.worker,
      required: true,
      label: intl.get(`${commonCode}.workerObj`).d('操作工'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'linkResourceObj',
      type: 'object',
      noCache: true,
      lovCode: common.resource,
      label: intl.get(`${commonCode}.linkResourceObj`).d('关联资源'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'relatedResourceId',
      type: 'string',
      bind: 'linkResourceObj.resourceId',
    },
    {
      name: 'relatedResourceCode',
      type: 'string',
      bind: 'linkResourceObj.resourceCode',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      lovCode: common.prodLine,
      label: intl.get(`${commonCode}.prodLineObj`).d('生产线'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
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
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      lovCode: common.workcell,
      label: intl.get(`${commonCode}.workcellObj`).d('工位'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'locationObj',
      type: 'object',
      noCache: true,
      lovCode: common.location,
      label: intl.get(`${commonCode}.locationObj`).d('地点'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${commonCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'toProdLineObj',
      type: 'object',
      noCache: true,
      lovCode: common.prodLine,
      label: intl.get(`${commonCode}.toProdLineObj`).d('目标生产线'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'toProdLineId',
      type: 'string',
      bind: 'toProdLineObj.prodLineId',
    },
    {
      name: 'toProdLineCode',
      type: 'string',
      bind: 'toProdLineObj.prodLineCode',
    },
    {
      name: 'toWorkcellObj',
      type: 'object',
      noCache: true,
      lovCode: common.workcell,
      label: intl.get(`${commonCode}.toWorkcellObj`).d('目标工位'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'toWorkcellId',
      type: 'string',
      bind: 'toWorkcellObj.workcellId',
    },
    {
      name: 'toWorkcellCode',
      type: 'string',
      bind: 'toWorkcellObj.workcellCode',
    },
    {
      name: 'toLocationObj',
      type: 'object',
      noCache: true,
      lovCode: common.location,
      label: intl.get(`${commonCode}.toLocationObj`).d('目标地点'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'toLocationId',
      type: 'string',
      bind: 'toLocationObj.locationId',
    },
    {
      name: 'toLocationCode',
      type: 'string',
      bind: 'toLocationObj.locationCode',
    },
    {
      name: 'toOutsideLocation',
      type: 'string',
      label: intl.get(`${commonCode}.toOutsideLocation`).d('目标外部地点'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
});
