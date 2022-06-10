/**
 * @Description: 工艺路线管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:30:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH, NOW_DATE } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsRouting, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.routing.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/routings`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'routing',
      type: 'string',
      label: intl.get(`${preCode}.routing`).d('工艺路线'),
    },
    {
      name: 'item',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'routingDescription',
      type: 'string',
      label: intl.get(`${preCode}.routingDesc`).d('工艺路线描述'),
    },
  ],
  fields: [
    {
      name: 'routingType',
      type: 'string',
      label: intl.get(`${preCode}.routingType`).d('工艺路线类型'),
      lookupCode: lmdsRouting.routingType,
      required: true,
    },
    {
      name: 'routingCode',
      type: 'string',
      label: intl.get(`${preCode}.routing`).d('工艺路线'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'routingVersion',
      type: 'string',
      label: intl.get(`${preCode}.routingVersion`).d('版本'),
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'ititemObjem.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      bind: 'item.itemDescription',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'alternate',
      type: 'string',
      label: intl.get(`${preCode}.alternate`).d('替代项'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      min: 'startDate',
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
