/*
 * @Description: 日历创建/修改--CreateAndModifyCalendarDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-28 15:32:48
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const intlPrefix = 'lmds.calendar';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/calendars`;
const {
  code: { lmdsCalendar, common },
} = codeConfig;
const {
  common: { edit },
} = statusConfig.statusValue.lmds;

export default (props) => {
  const { type, month, calendarId } = props;
  return {
    autoCreate: true,
    fields: [
      {
        name: 'calendarCode',
        type: 'string',
        required: true,
        label: intl.get(`${intlPrefix}.model.calendarCode`).d('日历编码'),
        validator: codeValidator,
      },
      {
        name: 'calendarName',
        type: 'string',
        required: true,
        label: intl.get(`${intlPrefix}.model.calendarName`).d('日历名称'),
      },
      {
        name: 'description',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.description`).d('描述'),
        validator: descValidator,
      },
      {
        name: 'calendarType',
        type: 'string',
        required: true,
        lookupCode: lmdsCalendar.calendarType,
        label: intl.get(`${intlPrefix}.model.calendarType`).d('日历类型'),
      },
      {
        name: 'calendarLineType',
        type: 'string',
        required: true,
        lookupCode: lmdsCalendar.calendarLineType,
        label: intl.get(`${intlPrefix}.model.calendarLineType`).d('日历行类型'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        ignore: 'always',
        lovCode: common.meOu,
        label: intl.get(`${commonPrefix}.model.org`).d('组织'),
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'resourceObj',
        type: 'object',
        lovCode: common.resource,
        ignore: 'always',
        label: intl.get(`${intlPrefix}.model.resource`).d('资源'),
        textField: 'resourceCode',
      },
      {
        name: 'resourceId',
        type: 'string',
        bind: 'resourceObj.resourceId',
      },
      {
        name: 'resourceName',
        type: 'string',
        bind: 'resourceObj.resourceName',
        label: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
      },
      {
        name: 'resourceCode',
        ignore: 'always',
        bind: 'resourceObj.resourceCode',
      },
      {
        name: 'dayStartTime',
        type: 'time',
        label: intl.get(`${intlPrefix}.model.dayStartTime`).d('开始时间'),
        transformRequest: (val) => (val ? moment(val).format('HH:mm:ss') : null),
        transformResponse: (val) => (val ? moment(val, 'HH:mm:ss') : null),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${commonPrefix}.model.enabledFlag`).d('是否有效'),
        required: true,
      },
    ],
    transport: {
      read: ({ params }) => ({
        url,
        method: 'get',
        params: {
          ...params,
          calendarId,
          month: moment(month).format('YYYY-MM'),
        },
      }),
      submit: () => ({
        url,
        method: type === edit ? 'put' : 'post',
      }),
    },
  };
};
