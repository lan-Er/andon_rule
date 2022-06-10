/*
 * @Description: 生产入库
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-07-24 13:53:51
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-08-03 17:38:26
 */
import moment from 'moment';

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const url = `${HLOS_LISP}/v1/datas/supplier-chain`;
const functionType = 'SUPPLIER_CHAIN';
const dataType = 'STORAGE_RECORD';

export default function tableDsConfig() {
  return {
    pageSize: 10,
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'moObj',
        type: 'object',
        label: 'MO号',
        lovCode: 'LISP.MO_NUMBER',
        ignore: 'always',
      },
      {
        name: 'attribute4',
        type: 'string',
        bind: 'moObj.attribute2',
      },
      {
        name: 'saleNumberObj',
        type: 'object',
        label: '销售订单号',
        lovCode: 'LISP.SO_NUMBER',
        ignore: 'always',
      },
      {
        name: 'attribute3',
        type: 'string',
        bind: 'saleNumberObj.attribute2',
      },
      // {
      //   name: 'purchaseNumberObj',
      //   type: 'object',
      //   label: '采购单号',
      //   lovCode: 'LISP.PO_NUMBER',
      //   ignore: 'always',
      // },
      // {
      //   name: 'attribute2',
      //   type: 'string',
      //   bind: 'purchaseNumberObj.attribute2',
      // },
      {
        name: 'customerItemObj',
        type: 'object',
        label: '物料',
        lovCode: 'LISP.ITEM',
        ignore: 'always',
      },
      {
        name: 'attribute6',
        type: 'string',
        bind: 'customerItemObj.attribute1',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: '客户',
        lovCode: 'LISP.CUSTOMER',
        ignore: 'always',
      },
      {
        name: 'attribute1',
        type: 'string',
        bind: 'customerObj.attribute1',
      },
      {
        name: 'warehousingTimeStart',
        type: 'date',
        label: '入库日期从',
        max: 'warehousingTimeEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'warehousingTimeEnd',
        type: 'date',
        label: '入库日期至',
        min: 'warehousingTimeStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'serialNumber',
        label: 'No.',
        type: 'string',
      },
      {
        name: 'attribute1',
        type: 'string',
        label: '客户',
      },
      // {
      //   name: 'attribute2',
      //   type: 'string',
      //   label: '采购订单号',
      // },
      {
        name: 'attribute3',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute4',
        type: 'string',
        label: 'MO编号',
      },
      {
        name: 'attribute5',
        type: 'string',
        label: '产品',
      },
      {
        name: 'attribute6',
        type: 'string',
        label: '物料',
      },
      {
        name: 'attribute7',
        type: 'string',
        label: '产品名称',
      },
      {
        name: 'attribute8',
        type: 'string',
        label: '入库数量',
      },
      {
        name: 'attribute9',
        type: 'string',
        label: '单位',
      },
      {
        name: 'attribute10',
        type: 'date',
        label: '日期',
      },
      {
        name: 'attribute11',
        type: 'string',
      },
    ],
    transport: {
      read: ({ data, params }) => ({
        url,
        data,
        method: 'GET',
        params: {
          ...params,
          functionType,
          dataType,
        },
      }),
    },
  };
}
