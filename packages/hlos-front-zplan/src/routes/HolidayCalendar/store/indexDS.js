/**
 * @Description: 节日日历DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-20 16:42:26
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'zplan.holidayCalendar.model';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-calendars`;

const holidayCalendarListDS = () => ({
  autoQuery: false,
  selection: false,
  queryFields: [
    {
      name: 'calendarCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.calendarCode`).d('日历编码'),
    },
    {
      name: 'calendarName',
      type: 'string',
      label: intl.get(`${intlPrefix}.calendarName`).d('日历名称'),
    },
  ],
  fields: [
    {
      name: 'calendarCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.calendarCode`).d('日历编码'),
    },
    {
      name: 'calendarName',
      type: 'string',
      label: intl.get(`${intlPrefix}.calendarName`).d('日历名称'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        data,
        url,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: {
          ...data[0],
          tenantId: organizationId,
        },
        url,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data,
        url,
        method: 'PUT',
      };
    },
  },
});

const detailQueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'calendarCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.calendarCode`).d('日历编码'),
    },
    {
      name: 'yearNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.year`).d('年度'),
      defaultValue: new Date().getFullYear(),
    },
    {
      name: 'monthNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.month`).d('月份'),
      defaultValue: new Date().getMonth() + 1,
    },
  ],
});

const festivalDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'festivalObj',
      type: 'object',
      lovCode: common.festival,
      label: intl.get(`${intlPrefix}.festival`).d('节日'),
      ignore: 'always',
      textField: 'festivalName',
      lovPara: {
        tenantId: organizationId,
        enabledFlag: 1,
      },
    },
    {
      name: 'festivalId',
      type: 'string',
      bind: 'festivalObj.festivalId',
    },
    {
      name: 'festivalCode',
      type: 'string',
      bind: 'festivalObj.festivalCode',
    },
    {
      name: 'festivalName',
      type: 'string',
      bind: 'festivalObj.festivalName',
    },
  ],
});

export { holidayCalendarListDS, detailQueryDS, festivalDS };
