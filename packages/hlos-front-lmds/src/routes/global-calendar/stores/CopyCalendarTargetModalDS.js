/*
 * @Description: 日历--CopyCalendarTargetModalDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-20 16:32:48
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';

const intlPrefix = 'lmds.calendar';

export default () => {
  return {
    autoQuery: true,
    fields: [
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
  };
};
