/*
 * @Description: 日历总览页面--CopyCalendarModalDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-20 16:32:48
 * @LastEditors: 赵敏捷
 */

import moment from 'moment';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const { lmdsCalendar } = codeConfig.code;
const intlPrefix = 'lmds.calendar';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/calendars`;

export default (props) => {
  return {
    autoQuery: true,
    fields: [
      {
        name: 'calendarType',
        type: 'string',
        lookupCode: lmdsCalendar.calendarType,
        label: intl.get(`${intlPrefix}.model.calendarType`).d('日历类型'),
      },
      {
        name: 'calendarCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.calendarCode`).d('日历编码'),
      },
      {
        name: 'startDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.model.startDate`).d('开始时间'),
        required: true,
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('endDate')) {
              return 'endDate';
            }
          },
        },
      },
      {
        name: 'endDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.model.endDate`).d('结束时间'),
        required: true,
        dynamicProps: {
          min: ({ record }) => {
            if (record.get('startDate')) {
              return 'startDate';
            }
          },
        },
      },
    ],
    transport: {
      read: ({ params }) => ({
        url,
        method: 'get',
        params: {
          ...params,
          month: moment(props.month).format('YYYY-MM'),
          calendarId: props.calendarId,
        },
      }),
    },
  };
};
