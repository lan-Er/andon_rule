/**
 * @Description: 促销日历DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-23 10:33:33
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'zplan.promotionCalendar.model';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sales-entitys`;

const promotionCalendarListDS = () => ({
  autoQuery: false,
  selection: false,
  queryFields: [
    {
      name: 'salesEntityCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityCode`).d('销售实体编码'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体名称'),
    },
  ],
  fields: [
    {
      name: 'salesEntityCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityCode`).d('销售实体编码'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体名称'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url,
        method: 'GET',
      };
    },
  },
});

const detailQueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'salesEntityCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityCode`).d('销售实体编码'),
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

const activityDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'activityObj',
      type: 'object',
      lovCode: common.activity,
      label: intl.get(`${intlPrefix}.activity`).d('促销活动'),
      ignore: 'always',
      textField: 'activityName',
      lovPara: {
        tenantId: organizationId,
        enabledFlag: 1,
      },
    },
    {
      name: 'activityId',
      type: 'string',
      bind: 'activityObj.activityId',
    },
    {
      name: 'activityCode',
      type: 'string',
      bind: 'activityObj.activityCode',
    },
    {
      name: 'activityName',
      type: 'string',
      bind: 'activityObj.activityName',
    },
  ],
});

export { promotionCalendarListDS, detailQueryDS, activityDS };
