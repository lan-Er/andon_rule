/*
 * @Description: 质量追溯DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-27 13:02:28
 * @LastEditors: 赵敏捷
 */

function dsConfig() {
  return {
    pageSize: 10,
    autoQuery: true,
    fields: [],
  };
}

function filterDSConfig() {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'soNum',
        label: '销售订单号',
        type: 'object',
        lovCode: 'LISP.SO_NUMBER',
        required: true,
      },
      {
        name: 'prod',
        label: '产品',
        type: 'object',
        lovCode: 'LISP.QC_ITEM',
      },
      {
        name: 'tag',
        label: '条码',
        type: 'object',
        lovCode: 'LISP.QC_FTAG',
      },
    ],
  };
}

export { dsConfig, filterDSConfig };
