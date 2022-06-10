/*
 * @Description: 日历班次维护--CalendarShiftListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-28 15:32:48
 * @LastEditors  : minjie.zhao
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from 'utils/constants';
import moment from 'moment';

const { lmdsCalendar } = codeConfig.code;
const intlPrefix = 'lmds.calendar';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/calendar-shifts`;

export default (props) => {
  return {
    fields: [
      {
        name: 'calendarDay',
        type: 'date',
        required: true,
        label: intl.get(`${intlPrefix}.model.calendarDay`).d('日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'weekNumber',
        type: 'string',
        readOnly: true,
        label: intl.get(`${intlPrefix}.model.weekNumber`).d('星期'),
      },
      {
        name: 'shiftCode',
        type: 'string',
        lookupCode: lmdsCalendar.shiftCode,
        label: intl.get(`${intlPrefix}.model.shiftCode`).d('班次'),
        required: true,
      },
      {
        name: 'shiftPhase',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.shiftPhase`).d('时段'),
      },
      {
        name: 'shiftStartTime',
        type: 'time',
        required: true,
        label: intl.get(`${intlPrefix}.model.shiftStartTime`).d('班次开始'),
        transformRequest: (val) => moment(val).format(DEFAULT_TIME_FORMAT),
        transformResponse: (val) => moment(val, DEFAULT_TIME_FORMAT),
        defaultValue: moment('00:00:00', DEFAULT_TIME_FORMAT),
      },
      {
        name: 'shiftEndTime',
        type: 'time',
        required: true,
        label: intl.get(`${intlPrefix}.model.shiftEndTime`).d('班次结束'),
        transformRequest: (val) => moment(val).format(DEFAULT_TIME_FORMAT),
        transformResponse: (val) => moment(val, DEFAULT_TIME_FORMAT),
        defaultValue: moment('24:00:00', DEFAULT_TIME_FORMAT),
      },
      {
        name: 'breakTime',
        type: 'number',
        label: intl.get(`${intlPrefix}.model.breakTime`).d('休息时间'),
        min: 0,
      },
      {
        name: 'activity',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.model.activity`).d('开动率'),
        validator: positiveNumberValidator,
        required: true,
      },
      {
        name: 'replenishCapacity',
        type: 'number',
        label: intl.get(`${intlPrefix}.model.replenishCapacity`).d('借用能力'),
        validator: (value) => {
          if (value === 0) {
            return '请输入不等于0的数字';
          }
        },
      },
      {
        name: 'availableTime',
        type: 'string',
        readOnly: true,
        label: intl.get(`${intlPrefix}.model.availableTime`).d('可用时间'),
      },
      {
        name: 'availableCapacity',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.availableCapacity`).d('可用产能'),
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
      read: () => {
        return {
          url,
          method: 'get',
          transformResponse: (data) => {
            if (data) {
              const formatData = JSON.parse(data);
              return {
                ...formatData,
                content: formatData.content.map((item) => ({
                  ...item,
                  weekNumber: moment(item.calendarDay).format('dddd'),
                  availableTime: Number(item.availableCapacity) / 3600,
                })),
              };
            }
          },
        };
      },
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
      delete: () => ({
        url,
        method: 'delete',
      }),
    },
    events: {
      submitSuccess: ({ dataSet }) => dataSet.query(),
      update: ({ record, name }) => {
        const fields = [
          'shiftStartTime',
          'shiftEndTime',
          'breakTime',
          'activity',
          'replenishCapacity',
        ];
        if (fields.includes(name)) {
          const {
            shiftStartTime,
            shiftEndTime,
            breakTime,
            activity,
            replenishCapacity,
          } = record.data;
          if (shiftStartTime && shiftEndTime && breakTime && activity && replenishCapacity) {
            const availableTime =
              ((shiftEndTime - shiftStartTime) / 3600000 - breakTime) * (activity / 100) +
              replenishCapacity;
            record.set('availableTime', availableTime);
          }
        } else if (name === 'calendarDay') {
          const { calendarDay } = record.data;
          if (calendarDay) {
            record.set('weekNumber', calendarDay.format('dddd'));
          }
        }
      },
    },
  };
};
