/*
 * @Description: v20 图纸平台 DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-08-04 10:29:10
 * @LastEditors: 赵敏捷
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LISP}/v1/datas/solution-pack`;
const functionType = 'SUPPLIER_CHAIN';
const dataType = 'DAWINGNO';

function dsConfig() {
  return {
    queryFields: [
      {
        name: 'type',
        type: 'object',
        ignore: 'always',
        noCache: true,
        lovCode: 'LISP.DRAWING_TYPE',
        label: '图纸类型',
        required: true,
      },
      {
        name: 'attribute1',
        type: 'string',
        bind: 'type.attribute1',
      },
      {
        name: 'drawing',
        type: 'object',
        ignore: 'always',
        noCache: true,
        lovCode: 'LISP.DRAWING',
        label: '图纸',
      },
      {
        name: 'attribute2',
        type: 'string',
        bind: 'drawing.attribute1',
      },
      {
        name: 'itemType',
        type: 'object',
        ignore: 'always',
        noCache: true,
        lovCode: 'LISP.DEMO.ITEM_TYPE',
        label: '物料类型',
      },
      {
        name: 'attribute5',
        type: 'string',
        bind: 'itemType.attribute1',
      },
      {
        name: 'item',
        type: 'object',
        ignore: 'always',
        noCache: true,
        lovCode: 'LISP.ITEM',
        label: '物料',
      },
      {
        name: 'attribute6',
        type: 'string',
        bind: 'item.attribute1',
      },
      {
        name: 'demoProcess',
        type: 'object',
        ignore: 'always',
        noCache: true,
        lovCode: 'LISP.DEMO_PROCESS',
        label: '工序',
      },
      {
        name: 'attribute8',
        type: 'string',
        bind: 'demoProcess.attribute1',
      },
      {
        name: 'demoSuppliers',
        type: 'object',
        ignore: 'always',
        noCache: true,
        lovCode: 'LISP.DEMO_SUPPLIERS',
        label: '供应商',
      },
      {
        name: 'attribute10',
        type: 'string',
        bind: 'demoSuppliers.attribute1',
      },
    ],
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        label: '图纸类型',
      },
      {
        name: 'attribute2&3',
        type: 'string',
        label: '图纸',
      },
      {
        name: 'attribute4',
        type: 'string',
        label: '图纸描述',
      },
      {
        name: 'attribute5',
        type: 'string',
        label: '物料类型',
      },
      {
        name: 'attribute6&7',
        type: 'string',
        label: '物料',
      },
      {
        name: 'attribute8&9',
        type: 'string',
        label: '工序',
      },
      {
        name: 'attribute10',
        type: 'string',
        label: '供应商',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: '图纸版本',
      },
      {
        name: 'attribute12',
        type: 'string',
        label: '图纸文件',
      },
      {
        name: 'attribute13',
        type: 'date',
        label: '失效日期',
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

export { dsConfig };
