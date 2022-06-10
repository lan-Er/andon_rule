/*
 * @Description: 完工入库 DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-27 14:34:28
 * @LastEditors: 赵敏捷
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LISP}/v1/datas/solution-pack`;
const functionType = 'SUPPLIER_CHAIN_OVERALL';

function dsConfig() {
  return {
    pageSize: 10,
    autoQuery: true,
    fields: [
      {
        name: 'serialNumber',
        type: 'string',
        label: '序号',
      },
      {
        name: 'attribute28',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute25&33',
        type: 'string',
        label: '产品',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '客户',
      },
      {
        name: 'attribute5&6',
        type: 'string',
        label: '数量',
      },
      {
        name: 'attribute8&7',
        type: 'string',
        label: '金额',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: '需求日期',
      },
      {
        name: 'attribute12',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'attribute24',
        type: 'string',
        label: '销售员',
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
          attribute9: '运行中',
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

export { dsConfig, filterDSConfig };
