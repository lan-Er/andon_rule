/**
 * @Description: 交期结果 - ds
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
        name: 'attribute1',
        type: 'object',
        lovCode: 'LISP.SCM_OU',
        label: '采购中心',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute2',
        type: 'object',
        lovCode: 'LISP.PO_NUMBER',
        label: '采购订单号',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute6',
        type: 'object',
        lovCode: 'LISP.STATEMENT_SUPPLIER',
        label: '供应商',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute3',
        type: 'object',
        lovCode: 'LISP.PO_TYPE',
        label: '订单类型',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute5',
        type: 'object',
        lovCode: 'LISP.BUYER',
        label: '采购员',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute15',
        type: 'object',
        lovCode: 'LISP.ITEM',
        label: '物料',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'demandDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: '需求日期',
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        bind: 'demandDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'promisedDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: '承诺日期',
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'promisedDateEnd',
        type: 'date',
        bind: 'promisedDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '采购中心',
      },
      {
        name: 'attribute2',
        label: '采购订单号',
        transformResponse: (val, object) =>
          `${val}-${object.attribute14}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute14',
        label: '采购订单行号',
      },
      {
        name: 'attribute15',
        label: '物料',
        // transformResponse: (val, object) =>
        //   `${object.attribute15}-${object.attribute16}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute6',
        label: '供应商',
        // transformResponse: (val, object) =>
        //   `${object.attribute6}-${object.attribute7}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute19',
        type: 'date',
        label: '需求日期',
      },
      {
        name: 'attribute5',
        label: '采购员',
      },
      {
        name: 'attribute9',
        label: '收货组织',
      },
      {
        name: 'attribute18-17',
        label: '需求数量',
        transformResponse: (val, object) =>
          `${object.attribute18} ${object.attribute17}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute20-10',
        label: '单价',
        transformResponse: (val, object) =>
          `${object.attribute18} ${object.attribute17}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute21-10',
        label: '总价',
        transformResponse: (val, object) =>
          `${object.attribute21} ${object.attribute10}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute11',
        label: '税率',
      },
      {
        name: 'attribute13',
        label: '付款方式',
      },
      {
        name: 'attribute4',
        label: '订单状态',
      },
      {
        name: 'attribute3',
        label: '订单类型',
      },
      {
        name: 'attribute8',
        label: '供应商联系人',
      },
      {
        name: 'attribute22',
        label: '接收仓库',
      },
      {
        name: 'attribute23',
        label: '图纸',
      },
      {
        name: 'attribute24',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'progress',
        label: '生产进度',
      },
      {
        name: 'a',
        type: 'number',
        transformResponse: () => Math.floor(Math.random() * 4 + 1),
      },
      {
        name: 'b',
        type: 'number',
        transformResponse: () => Math.floor(Math.random() * 3 + 1),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'PURCHASE_ORDER',
            user: loginName,
            order: 1,
            attribute4Status: data.attribute4Status || 2,
          },
          method: 'GET',
        };
      },
    },
  };
};
