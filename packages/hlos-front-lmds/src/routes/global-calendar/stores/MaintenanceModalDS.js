/*
 * @Description: 日历班次/天维护查询参数DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-26 09:55:23
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const intlPrefix = 'lmds.calendar';

export default (props) => {
  const { month, calendar: { calendarCode, calendarTypeMeaning, calendarLineTypeMeaning } } = props;
  return {
    autoCreate: true,
    selection: false,
    fields: [
      {
        name: 'calendarCode',
        defaultValue: calendarCode,
        label: intl.get(`${intlPrefix}.model.calendarCode`).d('日历编码'),
      },
      {
        name: 'startDate',
        type: 'time',
        required: true,
        label: intl.get(`${intlPrefix}.model.startTime`).d('开始时间'),
        dynamicProps: {
          max: ({ record }) => record.get('endDate') ? 'endDate' : undefined,
        },
        defaultValue: moment(`${month ? `${month.clone().add('month', 0).format('YYYY-MM')}-01` : new Date()}`),
      },
      {
        name: 'endDate',
        type: 'time',
        required: true,
        label: intl.get(`${intlPrefix}.model.endTime`).d('结束时间'),
        dynamicProps: {
          min: ({ record }) => record.get('startDate') ? 'startDate' : undefined,
        },
        defaultValue: moment(month ? month.clone().add('month', 1).add('days', -1).format(DEFAULT_DATE_FORMAT) : new Date()),
      },
      {
        name: 'calendarType',
        defaultValue: calendarTypeMeaning,
        label: intl.get(`${intlPrefix}.model.calendarType`).d('日历类型'),
      },
      {
        name: 'calendarLineType',
        defaultValue: calendarLineTypeMeaning,
        label: intl.get(`${intlPrefix}.model.calendarLineType`).d('日历行类型'),
      },
    ],
  };
};
