/*
 * @Description: 日历天维护-CalendarDayListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 14:29:18
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from 'utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const intlPrefix = 'lmds.calendar';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/calendar-days`;

export default (props) => {
  return {
    selection: false,
    fields: [
      {
        name: 'calendarDay',
        type: 'date',
        required: true,
        label: intl.get(`${intlPrefix}.model.calendarDay`).d('日期'),
        format: DEFAULT_DATE_FORMAT,
        transformRequest: val => val ? moment(val).format(DEFAULT_DATE_FORMAT) : null,
      },
      {
        name: 'startTime',
        type: 'time',
        required: true,
        label: intl.get(`${intlPrefix}.model.startTime`).d('开始时间'),
        format: DEFAULT_TIME_FORMAT,
        max: 'endTime',
        defaultValue: moment('00:00:00', DEFAULT_TIME_FORMAT),
        transformRequest: val => moment(val).format(DEFAULT_TIME_FORMAT),
        transformResponse: val => moment(val, DEFAULT_TIME_FORMAT),
      },
      {
        name: 'endTime',
        type: 'time',
        required: true,
        label: intl.get(`${intlPrefix}.model.endTime`).d('结束时间'),
        format: DEFAULT_TIME_FORMAT,
        min: 'startTime',
        defaultValue: moment('24:00:00', DEFAULT_TIME_FORMAT),
        transformRequest: val => moment(val).format(DEFAULT_TIME_FORMAT),
        transformResponse: val => moment(val, DEFAULT_TIME_FORMAT),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.remark`).d('备注'),
      },
      {
        name: 'overtimeFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.overtimeFlag`).d('加班标示'),
      },
      {
        name: 'holidayFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.holidayFlag`).d('假期标示'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        defaultValue: true,
        label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
      },
    ],
    transport: {
      read: () => ({
        url,
        method: 'get',
      }),
      create: ({ data }) => {
        const { calendarId } = props;
        return {
          url,
          data: { ...data[0], calendarId },
          method: 'post',
        };
      },
      update: ({ data }) => ({
        url,
        data: data[0],
        method: 'put',
      }),
      destroy: () => ({
        url,
        method: 'delete',
      }),
    },
    events: {
      submitSuccess: ({dataSet}) => dataSet.query(),
    },
  };
};
