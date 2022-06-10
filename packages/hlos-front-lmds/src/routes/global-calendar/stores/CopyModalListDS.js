/*
 * @Description: 日历拷贝--CopyModalListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-20 20:11:49
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const intlPrefix = 'lmds.calendar';
const { lmdsCalendar } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/calendars/other-list`;

export default (prop) => {
  return {
    autoQuery: true,
    fields: [
      {
        name: 'calendarCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.calendarCode`).d('日历编码'),
      },
      {
        name: 'calendarName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.calendarName`).d('日历名称'),
      },
      {
        name: 'calendarType',
        type: 'string',
        lookupCode: lmdsCalendar.calendarType,
        label: intl.get(`${intlPrefix}.model.calendarType`).d('日历类型'),
      },
    ],
    transport: {
      read: ({ params }) => {
        const { calendarType, calendarLineType, calendarId } = prop;
        return {
          url,
          method: 'get',
          params: {
            ...params,
            calendarType,
            calendarLineType,
            calendarId,
          },
        };
      },
    },
  };
};
