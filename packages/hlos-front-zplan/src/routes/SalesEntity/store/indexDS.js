/**
 * @Description: 销售实体DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-21 16:15:19
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'zplan.salesEntity.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sales-entitys`;

const salesEntityListDS = () => ({
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
    {
      name: 'calendarCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.calendarCode`).d('节日日历编码'),
    },
  ],
  fields: [
    {
      name: 'salesEntityCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.salesEntityCode`).d('销售实体编码'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体名称'),
    },
    {
      name: 'calendarObj',
      type: 'object',
      lovCode: common.calendar,
      label: intl.get(`${intlPrefix}.calendarCode`).d('节日日历编码'),
      textField: 'calendarCode',
      ignore: 'always',
      required: true,
      lovPara: {
        tenantId: organizationId,
        enabledFlag: 1,
      },
    },
    {
      name: 'calendarId',
      type: 'string',
      bind: 'calendarObj.calendarId',
    },
    {
      name: 'calendarCode',
      type: 'string',
      bind: 'calendarObj.calendarCode',
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

export { salesEntityListDS };
