/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors: TJ
 */
const code = {
  common: {
    sopOu: 'LMDS.SOP_OU', // 销售中心
    organization: 'LMDS.ORGANIZATION', // 组织
    item: 'LMDS.ITEM', // 物料
    customer: 'LMDS.CUSTOMER', // 客户
    customerSite: 'LMDS.CUSTOMER_SITE', // 客户地点
    worker: 'LMDS.WORKER', // 操作工
    soNum: 'LSOP.SO', // 销售订单
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    currency: 'HPFM.CURRENCY', // 货币
    itemSop: 'LMDS.ITEM_SOP', // 销售物料
    uom: 'LMDS.UOM', // 单位
    categories: 'LMDS.CATEGORIES', // 通用类别
    document: 'LMDS.DOCUMENT', // 单据
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    rule: 'LMDS.RULE', // 规则
    apsOu: 'LMDS.APS_OU', // 计划中心
    meOu: 'LMDS.ME_OU', // 车间
    resource: 'LMDS.RESOURCE', // 资源
    soLine: 'LSOP.SO_LINE', // 销售订单行
  },
  lsopSalesOrder: {
    soStatus: 'LSOP.SO_STATUS', // 订单状态
    approvalRule: 'LMDS.APPROVAL_RULE', // 审批策略
    paymentMethod: 'LMDS.CUSTOMER_PAYMENT_METHOD', // 付款方式
    paymentDeadline: 'LMDS.CUSTOMER_PAYMENT_DEADLINE', // 付款期限
    soLineType: 'LSOP.SO_LINE_TYPE', // 行类型
    soLineStatus: 'LSOP.SO_LINE_STATUS', // 行状态
    shipMethod: 'LMDS.SHIPPING_METHOD', // 发运方式
    packingFormat: 'LMDS.PACKING_FORMAT', // 包装方式
  },
  lsopDemandOrder: {
    demandNum: 'LSOP.DEMAND', // 需求订单号
    demandStatus: 'LSOP.DEMAND_STATUS', // 需求状态
    demandRank: 'LSOP.DEMAND_RANK', // 需求等级
    salesChannel: 'LMDS.SALES_CHANNEL', //  销售渠道
    salesBrand: 'LMDS.SALES_BRAND', //  销售商标
    planType: 'LMDS.PLAN_TYPE', // 计划类型
    validateStatus: 'LSOP.DEMAND_VALIDATE_STATUS', // 校验状态
    shippingMethod: 'LMDS.SHIPPING_METHOD', // 发运方式
    packingFormat: 'LMDS.PACKING_FORMAT', // 包装方式
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
