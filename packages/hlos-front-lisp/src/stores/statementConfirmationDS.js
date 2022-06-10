/**
 * @Description: 对账单确认 - ds
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
        lovCode: 'LISP.STATEMENT_NUMBER',
        label: '对账单号',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute2',
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
        lovCode: 'LISP.CUSTOMER',
        label: '客户',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'formDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: '制单日期',
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'formDateEnd',
        type: 'date',
        bind: 'formDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'attribute9',
        type: 'string',
        lookupCode: 'STATEMENT_FLAG',
        label: '对账标识',
      },
      {
        name: 'attribute10',
        type: 'string',
        lookupCode: 'STATEMENT_FLAG',
        label: '对账标识',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: '开票',
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '对账单号',
      },
      {
        name: 'attribute2',
        label: '供应商',
      },
      {
        name: 'attribute3',
        label: '客户',
      },
      {
        name: 'attribute4',
        label: '含税价格',
      },
      {
        name: 'attribute5',
        label: '税率',
      },
      {
        name: 'attribute6',
        label: '币种',
      },
      {
        name: 'attribute7',
        type: 'date',
        label: '制单日期',
      },
      {
        name: 'attribute8',
        type: 'date',
        label: '对账日期',
      },
      {
        name: 'attribute9',
        label: '核企对账标识',
      },
      {
        name: 'attribute10',
        label: '供应商对账标识',
      },
      {
        name: 'attribute11',
        label: '是否开票',
      },
      {
        name: 'attribute12',
        label: '发票上传',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'STATEMENT_ORDER',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
