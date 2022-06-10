/*
 * @Author: 梁春艳 <chunyan.liang@hand-china.com>
 * @Date: 2019-12-03 10:20:18
 * @LastEditTime: 2020-06-26 23:57:02
 * @LastEditors: mingbo.zhang@hand-china.com
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const urlPrefix = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/item-routings`;
const preCode = 'lmds.itemRouting.model';
const commonCode = 'lmds.common.model';
const { common, lmdsItemRouting } = codeConfig.code;
const {
  lovPara: { itemMe },
} = statusConfig.statusValue.lmds;

export default () => ({
  pageSize: 10,
  autoQuery: true,
  selection: false,
  transport: {
    read: (config) => {
      const url = `${urlPrefix}`;
      return {
        ...config,
        url,
        method: 'get',
      };
    },
    update: ({ data }) => {
      return {
        url: `${urlPrefix}`,
        data: data[0],
        method: 'PUT',
      };
    },
    create: ({ data }) => {
      return {
        url: `${urlPrefix}`,
        data: data[0],
        method: 'POST',
      };
    },
  },
  queryFields: [
    { name: 'itemCode', type: 'string', label: intl.get(`${commonCode}.item`).d('物料') },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    // {
    //   name: 'itemCategory',
    //   type: 'string',
    //   label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
    // },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      lovCode: common.categories,
      lovPara: { categorySet: 'ITEM_ME' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'itemCategory',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      required: true,
      lovCode: common.meOu,
      ignore: 'always',
    },
    { name: 'organizationId', type: 'string', bind: 'organizationObj.meOuId' },
    { name: 'organization', type: 'string', bind: 'organizationObj.organizationName' },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      ignore: 'always',
      lovCode: common.itemMe,
      dynamicProps: ({ record }) => {
        if (record.get('organizationId')) {
          return {
            lovCode: common.itemMe,
            lovPara: {
              meOuId: `${record.get('organizationObj').meOuId}`,
            },
          };
        }
      },
      required: true,
    },
    { name: 'itemId', type: 'string', bind: 'itemObj.itemId' },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.itemDescription',
    },
    { name: 'item', type: 'string', bind: 'itemObj.itemCode' },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemMe },
      ignore: 'always',
      required: true,
    },
    { name: 'categoryId', type: 'string', bind: 'itemCategoryObj.categoryId' },
    { name: 'itemCategory', type: 'string', bind: 'itemCategoryObj.categoryName' },
    {
      name: 'routingObj',
      type: 'object',
      label: intl.get(`${preCode}.routing`).d('工艺路线'),
      required: true,
      lovCode: lmdsItemRouting.routing,
      ignore: 'always',
    },
    { name: 'routingId', type: 'string', bind: 'routingObj.routingId' },
    { name: 'routing', type: 'string', bind: 'routingObj.routingCode' },
    {
      name: 'routingDescription',
      type: 'string',
      label: intl.get(`${preCode}.routingDescription`).d('工艺路线描述'),
      bind: 'routingObj.description',
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('主要标识'),
      defaultValue: true,
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
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ record }) => {
      if (!isEmpty(record.get('itemObj'))) {
        record.fields.get('itemCategoryObj').set('required', false);
      }
      if (!isEmpty(record.get('itemCategoryObj'))) {
        record.fields.get('itemObj').set('required', false);
      }
    },
  },
});
