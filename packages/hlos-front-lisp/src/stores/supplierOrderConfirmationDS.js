/*
 * @Description: 供应商订单确认 DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-26 09:57:28
 * @LastEditors: 赵敏捷
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LISP}/v1/datas/solution-pack`;
const functionType = 'SUPPLIER_CHAIN_OVERALL';

function SupplierOrderConfirmationDSConfig() {
  return {
    pageSize: 10,
    // autoQuery: true,
    fields: [
      {
        name: 'serialNumber',
        type: 'string',
        label: 'No.',
      },
      {
        name: 'attribute28',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute25', // PRODUCT
        type: 'string',
      },
      {
        name: 'attribute33', // PROD_DESCRIPTION
        type: 'string',
      },
      {
        name: 'attribute25&33',
        type: 'string',
        label: '产品',
      },
      {
        name: 'attribute43', // 是否关键客户 -> 客户字段前显示图片
        type: 'string',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '客户',
      },
      {
        name: 'attribute24',
        type: 'string',
        label: '销售员',
      },
      {
        name: 'attribute5', // QTY
        type: 'string',
      },
      {
        name: 'attribute6', // UOM
        type: 'string',
      },
      {
        name: 'attribute5&6',
        type: 'string',
        label: '数量',
      },
      {
        name: 'attribute8', // CURRENCY
        type: 'string',
      },
      {
        name: 'attribute7', // TOTAL_PRICE
        type: 'string',
      },
      {
        name: 'attribute8&7',
        type: 'string',
        label: '金额',
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
          dataType: 'ORDER',
          attribute3: '',
          attribute9: '新建',
          sortFlag: false,
          field: 'attribute12',
        },
      }),
    },
  };
}

function filterDSConfig() {
  return {
    fields: [
      {
        name: 'attribute28',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute2Obj',
        type: 'object',
        label: '客户',
        lovCode: 'LMDS.DEMO_CUSTOMER',
        ignore: 'always',
      },
      {
        name: 'attribute2',
        type: 'string',
        bind: 'attribute2Obj.attribute1',
      },
      {
        name: 'attribute25Obj',
        type: 'object',
        label: '产品',
        lovCode: 'LMDS.DEMO_PRODUCT',
        ignore: 'always',
      },
      {
        name: 'attribute25',
        type: 'string',
        bind: 'attribute25Obj.attribute3',
      },
    ],
  };
}

export { SupplierOrderConfirmationDSConfig, filterDSConfig };
