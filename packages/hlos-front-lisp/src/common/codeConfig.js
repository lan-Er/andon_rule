/*
 * @Description: 前端全局变量配置
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-29 11:26:41
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-29 11:31:57
 * @Copyright: Copyright (c) 2018, Hand
 */

const code = {
  common: {
    item: 'LISP.ITEM', // 物料
    scmOu: 'LISP.DEMO_SCM_OU', // 采购中心
    buyer: 'LISP.DEMO_BUYER', // 采购员
    poNum: 'LISP.PO_NUMBER', // 采购订单号
    suppliers: 'LISP.DEMO_SUPPLIERS', // 供应商
    sopOu: 'LISP.DEMO_SOP_OU', // 销售中心
    customer: 'LISP.CUSTOMER', // 客户
    saler: 'LISP.SALER', // 销售员
  },
};

const uploadAcceptTypeIndex = {
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.csv': '.csv',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.bmp': 'image/bmp',
};

export default {
  // 快码配置
  code,
  // 允许上传文件格式配置
  uploadAcceptTypeIndex,
};
