/*
 * @Description: 事件查询--EventListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-24 09:50:20
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';

import codeConfig from '@/common/codeConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import notification from 'utils/notification';

const { common, lmdsEvent } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.event.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/events`;

export default (props) => ({
  pageSize: 1000,
  selection: false,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: common.organization,
      label: intl.get(`${commonCode}.org`).d('组织'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organization',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'eventTime',
      label: intl.get(`${intlPrefix}.eventTime`).d('事件时间'),
    },
    {
      name: 'eventTypeObj',
      type: 'object',
      lovCode: common.eventType,
      label: intl.get(`${commonCode}.eventType`).d('事件类型'),
      ignore: 'always',
    },
    {
      name: 'eventTypeId',
      bind: 'eventTypeObj.eventTypeId',
    },
    {
      name: 'eventTypeName',
      bind: 'eventTypeObj.eventTypeName',
    },
    {
      name: 'eventId',
      label: intl.get(`${intlPrefix}.eventId`).d('事件ID'),
    },
    {
      name: 'parentEventId',
      label: intl.get(`${intlPrefix}.parentEventId`).d('父事件ID'),
    },
    {
      name: 'eventRequestId',
      label: intl.get(`${intlPrefix}.eventRequestId`).d('事件请求ID'),
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: 'always',
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      lovCode: common.workerGroup,
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      ignore: 'always',
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroupName',
      bind: 'workerGroupObj.workerGroupName',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      lovCode: common.prodLine,
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineName',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'workcellObj',
      type: 'object',
      lovCode: common.workcell,
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      ignore: 'always',
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      lovCode: common.equipment,
      label: intl.get(`${commonCode}.equipment`).d('设备'),
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentName',
      bind: 'equipmentObj.equipmentName',
    },
    {
      name: 'locationObj',
      type: 'object',
      lovCode: common.location,
      label: intl.get(`${commonCode}.location`).d('地理位置'),
      ignore: 'always',
    },
    {
      name: 'locationId',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationName',
      bind: 'locationObj.locationName',
    },
    {
      name: 'itemObj', // 需要自定义输出 因此使用字符串类型 下同
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      // bind: 'itemObj.description',
      validator: descValidator,
    },
    {
      name: 'warehouseObj',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
    },
    {
      name: 'wmAreaObj',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
    },
    {
      name: 'wmUnitCode',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'calendarDay',
      type: 'date',
      label: intl.get(`${commonCode}.calendarDay`).d('日历日期'),
    },
    {
      name: 'calendarShiftCode',
      type: 'string',
      label: intl.get(`${commonCode}.calendarShiftCode`).d('日历班次'),
    },
    {
      name: 'inverseEventId',
      label: intl.get(`${intlPrefix}.inverseEventId`).d('反向事件ID'),
    },
    {
      name: 'remark',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'syncStatus',
      lookupCode: lmdsEvent.syncStatus,
      label: intl.get(`${commonCode}.syncStatus`).d('同步状态'),
    },
    {
      name: 'syncGroup',
      label: intl.get(`${commonCode}.syncGroup`).d('同步批次'),
    },
    {
      name: 'eventByObj',
      type: 'object',
      lovCode: common.user,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.eventBy`).d('提交人'),
    },
    {
      name: 'eventBy',
      bind: 'eventByObj.id',
    },
    {
      name: 'eventByName',
      bind: 'eventByObj.realName',
    },
  ],
  transport: {
    read: ({ data }) => ({
      url,
      data,
      paramsSerializer: (params) => {
        const tmpParams = filterNullValueObject(params);
        const queryParams = new URLSearchParams();
        Object.keys(tmpParams).forEach((key) => {
          if (key === 'itemIds' || key === 'eventTypeIds') {
            params[key].forEach((id) => {
              queryParams.append(key, id);
            });
          } else {
            queryParams.append(key, tmpParams[key]);
          }
        });
        return queryParams.toString();
      },
      method: 'GET',
      // 仓库/货位/物料 需要自定义显示因此需要拼接字符串，考虑到DS的复用需要做一定判断
      transformResponse: (responseData) => {
        const { type } = props;
        const { content, failed, message, ...otherProps } = JSON.parse(responseData);
        if (failed) {
          notification.error(message);
          return;
        }
        return {
          ...otherProps,
          content: content.map((record) => {
            const {
              warehouse = '',
              warehouseName = '',
              wmArea = '',
              wmAreaName = '',
              itemCode = '',
              itemDescription = '',
            } = record;
            const listQuery = {
              warehouseObj: `${warehouse}`,
              wmAreaObj: `${wmArea}`,
              itemObj: itemCode,
            };
            const detailQuery = {
              warehouseObj: `${warehouseName}`,
              wmAreaObj: `${wmAreaName}`,
              itemObj: `${itemCode} ${itemDescription}`,
            };
            return {
              ...record,
              ...(type === 'list' ? listQuery : detailQuery),
            };
          }),
        };
      },
    }),
  },
});
