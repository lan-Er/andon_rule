/*
 * @Description: 装箱查询
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-12 10:28:04
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const queryUrl = `${HLOS_LISP}/v1/datas/supplier-chain`;
const { loginName } = getCurrentUser();

export const packingListDS = () => ({
  primaryKey: 'packingListDSId',
  name: 'packingListDS',
  autoQuery: false,
  pageSize: 10,
  selection: false,

  queryFields: [
    {
      name: 'attribute2',
      label: 'po号',
      type: 'object',
      lovCode: 'LISP.PO_NUMBER',
      transformRequest: (value) => {
        return value && value.attribute2;
      },
    },
    {
      name: 'attribute4',
      label: '箱头',
      type: 'string',
    },
    {
      name: 'attribute7',
      label: '清单版本',
      type: 'string',
    },
    {
      name: 'attribute8',
      label: '箱头版本',
      type: 'string',
    },
    {
      name: 'attribute11',
      label: '物料',
      type: 'object',
      lovCode: 'LISP.ITEM',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute13',
      label: '自制/外购',
      type: 'object',
      lookupCode: 'LMDS.ITEM_MAKE_BUY',
      transformRequest: (value) => {
        return value && value.meaning;
      },
    },
    {
      name: 'attribute16Start',
      label: '完工时间从',
      max: 'attribute16End',
      format: 'YYYY-MM-DD',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'attribute16End',
      label: '完工时间至',
      min: 'attribute16Start',
      format: 'YYYY-MM-DD',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
  ],
  fields: [
    {
      name: 'attribute1',
      label: 'No.',
    },
    {
      name: 'attribute2&3',
      label: '客户PO号-PO行号',
    },
    {
      name: 'attribute4&5',
      label: '箱头-箱名',
    },
    {
      name: 'attribute6',
      label: '分箱',
      type: 'string',
    },
    {
      name: 'attribute7',
      label: '清单版本',
    },
    {
      name: 'attribute8',
      label: '箱头版本',
    },
    {
      name: 'attribute9',
      label: '客户',
    },
    {
      name: 'attribute10',
      label: '密箱',
    },
    {
      name: 'attribute11&12',
      label: '物料-描述',
    },
    {
      name: 'attribute13',
      label: '自制/外购',
    },
    {
      name: 'attribute14&15',
      label: '库存可用量-单位',
    },
    // {
    //   name: 'attribute15',
    //   label: '单位',
    // },
    {
      name: 'attribute16',
      label: '需求日期',
      type: 'date',
    },
    {
      name: 'attribute17',
      label: '备注',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: queryUrl,
        data: {
          ...data,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'PACKING_LIST',
        },
        method: 'GET',
      };
    },
  },
});
