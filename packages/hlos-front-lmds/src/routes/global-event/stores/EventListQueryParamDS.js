/*
 * @Description: 事件查询查询参数信息--EventListQueryParamDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-24 09:50:20
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import moment from 'moment';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'lmds.event.model';
const commonCode = 'lmds.common.model';

export default () => ({
  autoQuery: false,
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: common.organization,
      label: intl.get(`${commonCode}.org`).d('组织'),
      ignore: "always",
      required: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'minTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.minTime`).d('发生时间>='),
      defaultValue: moment().startOf('day'),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('maxTime')) {
            return 'maxTime';
          }
        },
      },
      required: true,
    },
    {
      name: 'maxTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.maxTime`).d('发生时间<='),
      defaultValue: moment().endOf('day'),
      dynamicProps: {
        min: ({ record }) => {
          if (record.get('minTime')) {
            return 'minTime';
          }
        },
      },
      required: true,
    },
    {
      name: 'eventTypeObj',
      type: 'object',
      lovCode: common.eventType,
      label: intl.get(`${commonCode}.eventType`).d('事件类型'),
      ignore: "always",
      multiple: true,
    },
    {
      name: 'eventTypeIds',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${commonCode}.item`).d('物料'),
      ignore: "always",
      multiple: true,
    },
    {
      name: 'itemIds',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      ignore: "always",
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      ignore: "always",
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmUnitCode',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      lovCode: common.prodLine,
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      ignore: "always",
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'workcellObj',
      type: 'object',
      lovCode: common.workcell,
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      ignore: "always",
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: "always",
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      lovCode: common.workerGroup,
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      ignore: "always",
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      lovCode: common.equipment,
      label: intl.get(`${commonCode}.equipment`).d('设备'),
      ignore: "always",
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'eventId',
      label: intl.get(`${intlPrefix}.eventId`).d('事件ID'),
    },
    {
      name: 'eventRequestId',
      label: intl.get(`${intlPrefix}.eventRequestId`).d('事件请求ID'),
    },
    {
      name: 'parentEventId',
      label: intl.get(`${intlPrefix}.parentEventId`).d('父事件ID'),
    },
  ],
  events: {
    update: ({ record, name, value }) => {
      if (name === 'itemObj') {
        if (value) {
          record.set('itemIds', value.map(i => i.itemId));
        } else {
          record.set('itemIds', null);
        }
      } else if (name === 'eventTypeObj') {
        if (value) {
          record.set('eventTypeIds', value.map(i => i.eventTypeId));
        } else {
          record.set('eventTypeIds', null);
        }
      }
    },
  },
});
