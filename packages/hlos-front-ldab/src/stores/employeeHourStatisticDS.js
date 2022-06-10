/*
 * @Description:员工工时统计报表
 * @Author: hongming.zhang@hand-china.com
 * @Date: 2020-12-21 12:53:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-18 12:10:20
 */

import moment from 'moment';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const intlPrefix = 'ldab.employeeHourStatistic.model';
const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/work-times/work-time-report-main-page`;

// employeeHourStatisticDS
export const employeeHourStatisticDS = () => ({
  autoQuery: false,
  selection: false,
  pageSize: 5,
  transport: {
    read: ({ data }) => {
      const {
        startDate,
        endDate,
        organizationIdList,
        workerGroupCategoryIdList,
        workerGroupIdList,
        workerIdList,
      } = data;
      return {
        url,
        data: {
          startDate,
          endDate,
          organizationIdList,
          workerGroupCategoryIdList,
          workerGroupIdList,
          workerIdList,
        },
        method: 'GET',
      };
    },
  },
  queryFields: [
    {
      name: 'groupType',
      type: 'string',
      defaultValue: 'MONTH',
    },
    {
      name: 'startDate',
      type: 'date',
      // range: ['start', 'end'],
      validator: (value) => {
        if (value && value.end > moment(value.start).add(365, 'days')) {
          return intl
            .get(`${intlPrefix}.view.message.timeLimit`)
            .d('起始结束日期跨度不可超过365天');
        }
        return true;
      },
      transformRequest: (val) => (val ? moment(val.start) : null),
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      bind: 'startDate.end',
      transformRequest: (val) => (val ? moment(val) : null),
    },
    {
      name: 'statisticType',
      type: 'string',
      defaultValue: 'WORKER_GROUP',
      required: true,
    },
    {
      name: 'utilizationRate',
      type: 'string',
      defaultValue: 'useRatio',
    },
    {
      name: 'organizationIdList',
      type: 'object',
      lovCode: 'LMDS.ORGANIZATION',
      multiple: true,
      transformRequest: (val = []) => {
        return isEmpty(val) ? undefined : val.map((v) => v.organizationId).join(',');
      },
    },
    {
      name: 'workerGroupCategoryIdList',
      type: 'object',
      lovCode: 'LMDS.CATEGORIES',
      categorySetCode: 'WORKER_GROUP',
      multiple: true,
      transformRequest: (val = []) => {
        return isEmpty(val) ? undefined : val.map((v) => v.categoryId).join(',');
      },
    },
    {
      name: 'workerGroupIdList',
      type: 'object',
      lovCode: 'LMDS.WORKER_GROUP',
      multiple: true,
      transformRequest: (val = []) => {
        return isEmpty(val) ? undefined : val.map((v) => v.workerGroupId).join(',');
      },
    },
    {
      name: 'workerIdList',
      type: 'object',
      lovCode: 'LMDS.WORKER',
      multiple: true,
      transformRequest: (val = []) => {
        return isEmpty(val) ? undefined : val.map((v) => v.workerGroupId).join(',');
      },
    },
  ],
});
