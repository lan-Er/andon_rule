/**
 * @Description: config - 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-27 17:04:33
 */

const code = {
  common: {
    fobType: 'LMDS.FOB_TYPE', // FOB类型
    categories: 'LMDS.CATEGORIES', // 通用类别
    user: 'HIAM.USER.ORG', // 用户
    organization: 'ZMDA.ORGANIZATION', // 组织
    meOu: 'ZMDA.ME_OU', // 工厂
    sopOu: 'ZMDA.SOP_OU', // 销售中心
    uom: 'LMDS.UOM', // 单位
    calendar: 'LMDS.CALENDAR', // 工作日历
    sopPlanRule: 'LMDS.SOP_PLAN_RULE', // 销售计划规则
    rule: 'LMDS.RULE', // 规则
    currency: 'HPFM.CURRENCY', // 货币
    transportType: 'LMDS.TRANSPORT_TYPE', // 运输方式
    warehouse: 'ZMDA.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位/仓储区域
    packingFormat: 'LMDS.PACKING_FORMAT', // 包装方式
    supplier: 'ZMDA.SUPPLIER', // 供应商
    tenant: 'HPFM.TENANT', // 租户
    wmOu: 'ZMDA.WM_OU', // 仓储中心
    tenantRoles: 'HIAM.CURRENT_TENANT_ROLES', // 当前租户角色
    iamRole: 'ZMDA.IAM_ROLE', // 角色
    isOrNo: 'HPFM.FLAG', // 是否
    taxRate: 'HPFM.TAX', // 税率
    customer: 'ZMDA.CUSTOMER', // 客户
  },
  zmdaWorkcell: {
    workcellType: 'LMDS.WORKCELL_TYPE', // 工作单元类型
  },
  zmdaEquipment: {
    equipmentType: 'LMDS.EQUIPMENT_TYPE', // 设备类型
    equipmentStatus: 'LMDS.EQUIPMENT_STATUS', // 设备状态
  },
  zmdaProdLine: {
    organization: 'LOV_FND_ORGANIZATION', // 组织
    prodLineType: 'LMDS.PROD_LINE_TYPE', // 生产线类型
    prodLineCalendar: 'LMDS.PRODLINE_CALENDAR', // 工作日历
  },
  zmdaCustomer: {
    customerRank: 'LMDS.CUSTOMER_RANK', // 客户等级
    customerStatus: 'LMDS.CUSTOMER_STATUS', // 客户状态
    paymentDeadline: 'LMDS.CUSTOMER_PAYMENT_DEADLINE', // 付款期限
    paymentMethod: 'LMDS.CUSTOMER_PAYMENT_METHOD', // 付款方式
    customerSiteType: 'LMDS.CUSTOMER_SITE_TYPE', // 地点类型
    customerSiteStatus: 'LMDS.CUSTOMER_SITE_STATUS', // 地点状态
  },
  zmdaSupplier: {
    supplierRank: 'LMDS.SUPPLIER_RANK', // 供应商等级
    supplierStatus: 'LMDS.SUPPLIER_STATUS', // 供应商状态
    paymentDeadline: 'LMDS.SUPPLIER_PAYMENT_DEADLINE', // 付款期限
    paymentMethod: 'LMDS.SUPPLIER_PAYMENT_METHOD', // 付款方式
  },
  zmdaItem: {
    itemType: 'LMDS.ITEM_TYPE', // 物料类型
    supplier: 'ZMDA.SUPPLIER', // 供应商
    mappingStatus: 'ZMDA.MAPPING.STATUS', // 映射状态
    item: 'ZMDA.SUPPLIER_ITEM', // 物料
    enterprise: 'ZMDA.ENTERPRISE', // 集团
  },
  zmdaCustomerItem: {
    sopOu: 'LMDS.SOP_OU', // 销售中心
    sopItem: 'LMDS.ITEM_SOP', // 销售物料
    customer: 'ZMDA.CUSTOMER', // 客户
    customerItem: 'ZMDA.CUSTOMER_ITEM', // 物料
    uom: 'LMDS.UOM', // 单位
    organization: 'LMDS.ORGANIZATION', // 组织
    salesChannel: 'LMDS.SALES_CHANNEL', // 销售渠道
    salesBrand: 'LMDS.SALES_BRAND', // 销售品牌
    calendar: 'LMDS.CALENDAR', // 工作日历
    user: 'HIAM.USER.ORG', // 用户
    sopPlanRule: 'LMDS.SOP_PLAN_RULE', // 销售计划规则
    rule: 'LMDS.RULE', // 规则
    currency: 'HPFM.CURRENCY', // 货币
    fobType: 'LMDS.FOB_TYPE', // FOB类型
    transportType: 'LMDS.TRANSPORT_TYPE', // 运输方式
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位/仓储区域
    packingFormat: 'LMDS.PACKING_FORMAT', // 包装方式
  },
  orgInfo: {
    company: 'ZMDA.COMPANY', // 组织信息 -公司
    bussinessUnit: 'ZMDA.BUSINESS_UNIT', // 组织信息-业务实体
    inventoryOrg: 'ZMDA.INVENTORY_ORG', // 组织信息-库存组织
    inventoryHouse: 'ZMDA.INVENTORY_HOUSE', // 组织信息-库房
  },
  zmdaCompany: {
    companyType: 'ZMDA.COMPANY_TYPE', // 公司类型
    taxpayerType: 'ZMDA.TAXPAYER_TYPE', // 纳税人类型
  },
  zmdaUom: {
    uomClass: 'ZMDA.UOM_CLASS', // 单位类别
  },
  zmdaItemMaindata: {
    uom: 'ZMDA.UOM', // 单位
    category: 'ZMDA.CATEGORY', // 物料类别
    attribute: 'ZMDA.ATTRIBUTE', // 物料属性
    attributeValue: 'ZMDA.ATTRIBUTE_VALUE', // 物料属性值
  },
  zmdaConfigCenter: {
    quotationOrderStatus: 'ZCOM.QUOTATION_ORDER_STATUS', // 报价单状态
    poStatus: 'ZCOM.PO_STATUS', // 采购订单状态
    deliveryApplyStatus: 'ZCOM.DELIVERY_APPLY_STATUS', // 预约单状态
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 发货单状态
    withholdingOrderStatus: 'ZCOM.WITHHOLDING_ORDER_STATUS', // 扣款单状态
    verificationOrderStatus: 'ZCOM.VERIFICATION_ORDER_STATUS', // 对账单状态
    messageTemplate: 'HMSG.MESSAGE_TEMPLATE', // 消息模板
    receiver: 'HMSG.RECEIVER', // 接收组
    userOrg: 'HIAM.USER.ORG', // 租户级获取用户列表
    notificationOrderType: 'ZCOM.NOTIFICATION_ORDER_TYPE', // 通知单据类型
    notificationType: 'ZCOM.NOTIFICATION_TYPE', // 通知规则类型
    templateType: 'ZCOM.PRINT_RULE_TYPE', // 打印模板类型
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
