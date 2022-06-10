import moment from 'moment';

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const url = `${HLOS_LISP}/v1/datas/supplier-chain`;
const functionType = 'SUPPLIER_CHAIN';
const dataType = 'QUA_INSPECTION_RESULT';

export default function tableDsConfig() {
  return {
    pageSize: 10,
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'checkNumberObj',
        type: 'object',
        label: '检验批号',
        lovCode: 'QUA_INSPECTION_RESULTS',
        ignore: 'always',
      },
      {
        name: 'attribute1',
        type: 'string',
        bind: 'checkNumberObj.attribute1',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '检验状态',
        lookupCode: 'INSPECTION_STATUS',
      },
      {
        name: 'attribute3',
        type: 'string',
        label: '检验类型',
        lookupCode: 'INSPECTION_TYPE',
      },
      {
        name: 'purchaseNumberObj',
        type: 'object',
        label: '采购订单号',
        lovCode: 'LISP.PO_NUMBER',
        ignore: 'always',
      },
      {
        name: 'attribute4',
        type: 'string',
        bind: 'purchaseNumberObj.attribute2',
      },
      // {
      //   name: 'saleNumberObj',
      //   type: 'object',
      //   label: '销售单号',
      //   lovCode: 'LISP.SO_NUMBER',
      //   ignore: 'always',
      // },
      // {
      //   name: 'attribute5',
      //   type: 'string',
      //   bind: 'saleNumberObj.attribute2',
      // },
      {
        name: 'moNumberObj',
        type: 'object',
        label: 'MO编码',
        lovCode: 'LISP.MO_NUMBER',
        ignore: 'always',
      },
      {
        name: 'attribute6',
        type: 'string',
        bind: 'moNumberObj.attribute2',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: '供应商',
        lovCode: 'LISP.STATEMENT_SUPPLIER',
        ignore: 'always',
      },
      {
        name: 'attribute7',
        type: 'string',
        bind: 'supplierObj.attribute1',
      },
      {
        name: 'demandCompanyObj',
        type: 'object',
        label: '需求企业',
        lovCode: 'LISP.CUSTOMER',
        ignore: 'always',
      },
      {
        name: 'attribute8',
        type: 'string',
        bind: 'demandCompanyObj.attribute1',
      },
      {
        name: 'attribute15',
        type: 'string',
        label: '检验结果',
        lookupCode: 'LMES.QC_RESULT',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: '物料',
        lovCode: 'LISP.ITEM',
        ignore: 'always',
      },
      {
        name: 'attribute11',
        type: 'string',
        bind: 'itemObj.attribute1',
      },
      {
        name: 'checkTimeStart',
        type: 'date',
        label: '检验日期从',
        max: 'checkTimeEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'checkTimeEnd',
        type: 'date',
        label: '检验日期至',
        min: 'checkTimeStart',
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
        label: '检验批号',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '检验状态',
      },
      {
        name: 'attribute3',
        type: 'string',
        label: '检验类型',
      },
      {
        name: 'attribute4',
        type: 'string',
        label: '采购订单号',
      },
      {
        name: 'attribute5',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute6',
        type: 'string',
        label: 'MO号',
      },
      {
        name: 'attribute7',
        type: 'string',
        label: '供应商',
      },
      {
        name: 'attribute8',
        type: 'string',
        label: '需求企业',
      },
      {
        name: 'attribute9',
        type: 'string',
        label: '供应商物料',
      },
      {
        name: 'attribute10',
        type: 'string',
        label: '客户物料',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: '物料名称',
      },
      {
        name: 'attribute12',
        type: 'string',
        label: '检验项1',
      },
      {
        name: 'attribute13',
        type: 'string',
        label: '检验项2',
      },
      {
        name: 'attribute14',
        type: 'string',
        label: '检验项3',
      },
      {
        name: 'attribute15',
        type: 'string',
        label: '检验结果',
      },
      {
        name: 'attribute16',
        type: 'date',
        label: '检验日期',
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
