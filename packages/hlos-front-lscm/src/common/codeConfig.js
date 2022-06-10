/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors  : zhang yang
 */
const code = {
  common: {
    yesOrNo: 'HZERO.WHETHER.FLAG', // 是否
    org: 'LMDS.ORGANIZATION', // 组织
    item: 'LMDS.ITEM', // 物料
    supplier: 'LMDS.SUPPLIER', // 供应商
    scmOu: 'LMDS.SCM_OU', // 采购中心
    currency: 'HPFM.CURRENCY', // 货币
    worker: 'LMDS.WORKER', // 操作工
    categories: 'LMDS.CATEGORIES', // 通用类别
  },
  lmdsOrganization: {
    xxxStauts: 'LMDS.xxxx.STATUS', // xxxxx
  },
  lscmPos: {
    poNum: 'LSCM.PO', // 采购订单号
    poStatus: 'LSCM.PO_STATUS', // 订单状态
    poType: 'LMDS.PO_TYPE', // 单据类型
    sourceDocType: 'LMDS.DOCUMENT_TYPE', // 来源单据类型
    sourceDoc: 'LMDS.DOCUMENT', // 来源单据
    supplierSite: 'LMDS.SUPPLIER_SITE', // 供应商地点
    paymentMethod: 'LMDS.SUPPLIER_PAYMENT_METHOD', // 付款方式
    paymentDeadline: 'LMDS.SUPPLIER_PAYMENT_DEADLINE', // 付款期限
    approvalRule: 'LMDS.APPROVAL_RULE', // 审批策略
    item: 'LMDS.ITEM_SCM', // 物料scm
    uom: 'LMDS.UOM', // uom
    poLineStatus: 'LSCM.PO_LINE_STATUS', // 行状态
    receiveToleranceType: 'LMDS.RECEIVE_TOLERANCE_TYPE', // 允差类型
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    receiveRule: 'LMDS.RECEIVE_RULE', // 收获类型
    mo: 'LMES.MO', // MO,
    moOperation: 'LMES.MO_OPERATION', // 工序
    sourceDocLineNum: 'LMDS.DOCUMENT_LINE', // 来源单据行号
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
