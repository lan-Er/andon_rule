/**
 * @Description: 对账单创建 - ds
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-23  16:58:00
 * @LastEditors: yu.na
 */

import moment from 'moment';
import { getCurrentUser } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const { loginName } = getCurrentUser();
const url = `${HLOS_LISP}/v1/datas/supplier-chain`;

export const ListDS = () => {
  return {
    autoQuery: true,
    selection: 'multiple',
    queryFields: [
      {
        name: 'attribute2',
        type: 'object',
        lovCode: 'LISP.STATEMENT_SHIP_ORDER',
        label: '发货单号',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute29',
        type: 'object',
        lovCode: 'LISP.STATEMENT_SUPPLIER',
        label: '供应商',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'deliveryDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: '发货日期',
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deliveryDateEnd',
        type: 'date',
        bind: 'deliveryDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'confirmDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: '确认日期',
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'confirmDateEnd',
        type: 'date',
        bind: 'confirmDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'attribute2',
        label: '发货单号',
      },
      {
        name: 'attribute2-3',
        label: '物料-名称',
        transformResponse: (val, object) =>
          `${object.attribute21}-${object.attribute22}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute29',
        label: '供应商',
      },
      {
        name: 'attribute3',
        label: '客户',
      },
      {
        name: 'attribute27',
        label: '发货数量',
      },
      {
        name: 'attribute28',
        label: '接收数量',
      },
      {
        name: 'attribute30',
        label: '单价',
      },
      {
        name: 'attribute31',
        label: '总价',
      },
      {
        name: 'attribute18',
        type: 'date',
        label: '发货日期',
      },
      {
        name: 'attribute20',
        type: 'date',
        label: '确认日期',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'SHIP_ORDER',
            user: loginName,
            attribute5: '已接收',
          },
          method: 'GET',
        };
      },
    },
  };
};
