/**
 * @Description: 计划切换时间管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 17:48:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common, lmdsApsSwithTime } = codeConfig.code;
const {
  lovPara: { itemAps },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.apsSwitchTime.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/aps-switch-times`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'fromCategoryName',
      type: 'string',
      label: intl.get(`${preCode}.fromCategory`).d('类别从'),
    },
    {
      name: 'toCategoryName',
      type: 'string',
      label: intl.get(`${preCode}.toCategory`).d('类别至'),
    },
    {
      name: 'fromItemCode',
      type: 'string',
      label: intl.get(`${preCode}.fromItem`).d('物料从'),
    },
    {
      name: 'toItemCode',
      type: 'string',
      label: intl.get(`${preCode}.toItem`).d('物料至'),
    },
  ],
  fields: [
    {
      name: 'apsOuObj',
      type: 'object',
      label: intl.get(`${commonCode}.apsOu`).d('计划中心'),
      lovCode: common.apsOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'apsOuName',
      type: 'string',
      bind: 'apsOuObj.apsOuName',
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOuObj.apsOuId',
    },
    {
      name: 'switchType',
      type: 'string',
      label: intl.get(`${preCode}.switchType`).d('关系类型'),
      lookupCode: lmdsApsSwithTime.switchType,
      required: true,
    },
    {
      name: 'fromCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.fromCategory`).d('类别从'),
      lovCode: common.categories,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          categorySetCode: itemAps,
          organizationId: record.get('apsOuId'),
        }),
      },
    },
    {
      name: 'fromCategoryId',
      type: 'string',
      bind: 'fromCategoryObj.categoryId',
    },
    {
      name: 'fromCategoryName',
      type: 'string',
      bind: 'fromCategoryObj.categoryName',
    },
    {
      name: 'fromItemObj',
      type: 'object',
      label: intl.get(`${preCode}.fromItem`).d('物料从'),
      lovCode: common.itemAps,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('apsOuId'),
        }),
      },
    },
    {
      name: 'fromItemId',
      type: 'string',
      bind: 'fromItemObj.itemId',
    },
    {
      name: 'fromItemCode',
      type: 'string',
      bind: 'fromItemObj.itemCode',
    },
    {
      name: 'fromItemDescription',
      type: 'string',
      label: intl.get(`${preCode}.fromItemDescription`).d('物料从描述'),
      bind: 'fromItemObj.description',
    },
    {
      name: 'toCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.toCategory`).d('类别至'),
      lovCode: common.categories,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          categorySetCode: itemAps,
          organizationId: record.get('apsOuId'),
        }),
      },
    },
    {
      name: 'toCategoryId',
      type: 'string',
      bind: 'toCategoryObj.categoryId',
    },
    {
      name: 'toCategoryName',
      type: 'string',
      bind: 'toCategoryObj.categoryName',
    },
    {
      name: 'toItemObj',
      type: 'object',
      label: intl.get(`${preCode}.toItem`).d('物料至'),
      lovCode: common.itemAps,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('apsOuId'),
        }),
      },
    },
    {
      name: 'toItemId',
      type: 'string',
      bind: 'toItemObj.itemId',
    },
    {
      name: 'toItemCode',
      type: 'string',
      bind: 'toItemObj.itemCode',
    },
    {
      name: 'toItemDescription',
      type: 'string',
      label: intl.get(`${preCode}.toItemDescription`).d('物料至描述'),
      bind: 'toItemObj.description',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: common.apsResource,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('apsOuId'),
        }),
      },
      required: true,
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.apsResourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'switchTime',
      type: 'number',
      label: intl.get(`${preCode}.switchTime`).d('切换时间(小时)'),
      validator: positiveNumberValidator,
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'apsOuObj') {
        record.set('resourceObj', null);
        record.set('fromItemObj', null);
        record.set('toItemObj', null);
        record.set('fromCategoryObj', null);
        record.set('toCategoryObj', null);
      }
      if (!isEmpty(record.get('fromCategoryObj'))) {
        record.fields.get('fromItemObj').set('required', false);
      } else if (!isEmpty(record.get('fromItemObj'))) {
        record.fields.get('fromCategoryObj').set('required', false);
      } else {
        record.fields.get('fromCategoryObj').set('required', true);
        record.fields.get('fromItemObj').set('required', true);
      }
      if (!isEmpty(record.get('toCategoryObj'))) {
        record.fields.get('toItemObj').set('required', false);
      } else if (!isEmpty(record.get('toItemObj'))) {
        record.fields.get('toCategoryObj').set('required', false);
      } else {
        record.fields.get('toCategoryObj').set('required', true);
        record.fields.get('toItemObj').set('required', true);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
