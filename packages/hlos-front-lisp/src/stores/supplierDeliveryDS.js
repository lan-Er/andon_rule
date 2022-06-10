/*
 * @Description: 供应商交货 DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-27 13:02:28
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
        name: 'attribute1',
        type: 'string',
        label: '发货单号',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute3',
        type: 'string',
        label: '客户采购订单号',
      },
      {
        name: 'attribute4&5',
        type: 'string',
        label: '产品',
      },
      {
        name: 'attribute6&7',
        type: 'string',
        label: '客户物料',
      },
      {
        name: 'attribute9',
        type: 'string',
        label: '客户',
      },
      {
        name: 'attribute11&13',
        type: 'string',
        label: '订单数量',
      },
      {
        name: 'attribute12&13',
        type: 'string',
        label: '发货数量',
      },
      {
        name: 'attribute14',
        type: 'string',
        label: '发运日期',
      },
      {
        name: 'attribute15',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'attribute16',
        type: 'dateTime',
        label: '预计到货时间',
      },
      {
        name: 'attribute17',
        type: 'string',
        label: '销售员',
      },
      {
        name: 'attribute18',
        type: 'string',
        label: '客户采购员',
      },
      {
        name: 'attribute19',
        type: 'string',
        label: '采购员联系方式',
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
          dataType: 'SHIP_ORDER',
          attribute8: '',
          attribute20: '已发运',
          sortFlag: false,
          field: 'attribute13',
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
