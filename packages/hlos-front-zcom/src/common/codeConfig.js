/**
 * @Description: config - 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-27 17:04:33
 */

const code = {
  common: {
    supplier: 'ZMDA.SUPPLIER', // 供应商
    item: 'ZMDA.SUPPLIER_ITEM', // 物料
    customer: 'ZMDA.CUSTOMER', // 客户
    poType: 'ZCOM.PO_TYPE', // 订单类型
    organization: 'ZMDA.ORGANIZATION', // 组织
    currency: 'HPFM.CURRENCY', // 货币
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 送货单类型
    warehouse: 'ZMDA.WAREHOUSE', // 仓库
    customerOrganization: 'ZMDA.CUSTOMER_ORGANIZATION',
    meOu: 'ZMDA.ME_OU', // 工厂
    customerWarehouse: 'ZMDA.CUSTOMER_WAREHOUSE', // 客户仓库
    wmOu: 'ZMDA.WM_OU', // 仓储中心
    taxRate: 'HPFM.TAX', // 税率
    businessUnit: 'ZMDA.BUSINESS_UNIT', // 业务实体
    inventoryOrg: 'ZMDA.INVENTORY_ORG', // 库存组织
    itemMaindata: 'ZMDA.ITEM', // 物料
    sourceExecuteType: 'ZCOM.SOURCE_EXECUTE_TYPE', // 收货来源
    executeOrderType: 'ZCOM.EXECUTE_ORDER_TYPE', // 收货类型
    company: 'ZMDA.COMPANY', // 组织信息 -公司
    inventoryHouse: 'ZMDA.INVENTORY_HOUSE', // 组织信息-库房
    inventorySeat: 'ZMDA.INVENTORY_SEAT', // 组织信息-库位
    uom: 'ZMDA.UOM', // 单位
    flag: 'HPFM.FLAG', // 是否标识
  },
  requirementRelease: {
    poStatus: 'ZCOM.PO_STATUS', // 订单状态
    poType: 'ZCOM.PO_TYPE', // 订单类型
  },
  configurationCenter: {
    poStatus: 'ZCOM.PO_STATUS', // 订单状态
    poType: 'ZCOM.PO_TYPE', // 订单类型
    allocationRule: 'ZCOM.ALLOCATION_RULE', // 订单类型
  },
  requirementConfirm: {
    customer: 'ZMDA.CUSTOMER', // 客户
    poType: 'ZCOM.PO_TYPE', // 订单类型
    poStatus: 'ZCOM.PO_STATUS', // 订单状态
    sopOu: 'ZMDA.SOP_OU', // 销售中心
    saler: 'LMDS.SALER', // 销售员
  },
  deliveryMaintain: {
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 送货单类型
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 送货单状态
    po: 'ZCOM.PO', // 订单号
    supplierPo: 'ZCOM.SUPPLIER_PO', // 供应商-采购订单号
  },
  deliveryReview: {
    po: 'ZCOM.PO', // 订单号
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 送货单类型
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 送货单状态
    supplyMo: 'ZCOM.SUPPLIER_MO',
  },
  deliveryReceive: {
    po: 'ZCOM.PO', // 订单号
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 送货单类型
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 送货单状态
    executeWarehouse: 'ZMDA.WAREHOUSE', // 收货库房
    executeWmArea: 'ZMDA.WMAREA', // 收货货位
  },
  deliveryWriteoff: {
    po: 'ZCOM.PO', // 订单号
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 送货单类型
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 送货单状态
    executeWarehouse: 'ZMDA.WAREHOUSE', // 收货库房
    executeWmArea: 'ZMDA.WMAREA', // 收货货位
  },
  statement: {
    po: 'ZCOM.PO', // 采购订单号
    deliveryOrder: 'ZCOM.DELIVERY_ORDER', // 送货单号
    supplierPo: 'ZCOM.SUPPLIER_PO', // 供应商-采购订单号
    supplierDeliveryOrder: 'ZCOM.SUPPLIER_DELIVERY_ORDER ', // 供应商-送货单号
    verificationOrderType: 'ZCOM.VERIFICATION_ORDER_TYPE', // 对账单类型
    verificationOrderStatus: 'ZCOM.VERIFICATION_ORDER_STATUS', // 对账单状态
    allocationRule: 'ZCOM.ALLOCATION_RULE', // 分摊规则
  },
  moDelivery: {
    mo: 'ZCOM.MO', // MO号
    moStatus: 'LMES.MO_STATUS', // MO状态
    documentType: 'LMDS.DOCUMENT_TYPE_LIMIT_CLASS', // 单据类型 限制多种单据大类
    executeStatus: 'LMES.MO_EXECUTE_STATUS', // 执行状态
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 送货单类型
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 送货单状态
    humidityLevel: 'ZCOM.HUMIDITY_LEVEL', // 湿敏等级
  },
  customerItemReceive: {
    storageStatus: 'ZCOM.CERT_STORAGE_STATUS', // 接收状态
    supplierPo: 'ZCOM.SUPPLIER_PO', // 供应商-采购订单号
    supplierItemCert: 'ZCOM.SUPPLIER_ITEM_CERT', // 物料凭证
    customerItem: 'ZMDA.CUSTOMER_ITEM', // 供应商查核企物料
    item: 'LMDS.ITEM', // 物料
  },
  moComponent: {
    organization: 'LMDS.ORGANIZATION', // 组织
    moNum: 'LMES.MO', // MO号
    item: 'LMDS.ITEM', // 物料
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    department: 'LMDS.DEPARTMENT', // 部门
    supplyType: 'LMDS.SUPPLY_TYPE', // 供应类型
    substitutePolicy: 'LMDS.BOM_SUBSTITUTE_POLICY', // 替代策略
    supplier: 'LMDS.SUPPLIER', // 供应商
    moStatus: 'LMES.MO_STATUS', // MO状态
    moFixedStatus: 'ZCOM.MO_FIXED_STATUS', // 类型
  },
  customerReturnMaintain: {
    itemRefundNum: 'ZCOM.ITEM_REFUND_NUM', // 退料单号
    itemRefundStatus: 'ZCOM.ITEM_REFUND_STATUS', // 退料单状态
    item: 'ZMDA.ITEM', // 物料
    humidityLevel: 'ZCOM.HUMIDITY_LEVEL', // 湿敏等级
  },
  customerItemReturnReview: {
    refundWmOu: 'ZMDA.SUPPLIER_WM_OU', // 供应商工厂
    itemRefundStatus: 'ZCOM.ITEM_REFUND_STATUS', // 退料单状态
  },
  vmiApplyReview: {
    vmiApplyStatus: 'ZCOM.VMI_APPLY_STATUS', // VMI申请单状态
    supplierWarehouse: 'ZMDA.SUPPLIER_WAREHOUSE', // 供应商仓库
  },
  vmiMaterialsApply: {
    vmiApplyStatus: 'ZCOM.VMI_APPLY_STATUS', // 申请状态
    item: 'ZMDA.ITEM', // 物料
  },
  moConfigurationCenter: {
    moType: 'ZMDA.DOCUMENT_TYPE',
    pricingRule: 'ZCOM.PRICING_CODE',
  },
  moStatementReview: {
    verificationOrderType: 'ZCOM.VERIFICATION_ORDER_TYPE',
    verificationOrderStatus: 'ZCOM.VERIFICATION_ORDER_STATUS',
  },
  moStatement: {
    documentType: 'ZMDA.DOCUMENT_TYPE',
    item: 'LOV_ASN_ITEM_CODE_VIEW',
    verificationOrderType: 'ZCOM.VERIFICATION_ORDER_TYPE', // 对账单类型

    po: 'ZCOM.PO', // 采购订单号
    deliveryOrder: 'ZCOM.DELIVERY_ORDER', // 送货单号
    supplierPo: 'ZCOM.SUPPLIER_PO', // 供应商-采购订单号
    supplierDeliveryOrder: 'ZCOM.SUPPLIER_DELIVERY_ORDER ', // 供应商-送货单号
    // verificationOrderType: 'ZCOM.VERIFICATION_ORDER_TYPE', // 对账单类型
    verificationOrderStatus: 'ZCOM.VERIFICATION_ORDER_STATUS', // 对账单状态
    allocationRule: 'ZCOM.ALLOCATION_RULE', // 分摊规则
  },
  maintenanceMonitor: {
    orderStatus: 'ZCOM.REPAIRS_ORDER_STATUS', // 维修状态
    orderType: 'ZCOM.REPAIRS_ORDER_TYPE', // 维修类型
    moStatus: 'LMES.MO_STATUS', // MO状态
    item: 'ZMDA.ITEM', // 物料
  },
  quotationMaintain: {
    item: 'ZMDA.ITEM', // 物料
    quotationOrderStatus: 'ZCOM.QUOTATION_ORDER_STATUS', // 报价单状态
    quotationSourceType: 'ZCOM.QUOTATION_SOURCE_TYPE', // 来源类型
    quotationOrderType: 'ZCOM.QUOTATION_ORDER_TYPE', // 报价单类型
  },
  quotationReview: {
    quotationSourceType: 'ZCOM.QUOTATION_SOURCE_TYPE',
  },
  poMaintain: {
    poType: 'ZCOM.PO_TYPE', // 采购订单类型
    poStatus: 'ZCOM.PO_STATUS', // 采购订单状态
    poSourceType: 'ZCOM.PO_SOURCE_TYPE', // 采购订单来源类型
    toleranceType: 'ZCOM.TOLERANCE_TYPE', // 采购订单允差类型
    outsrcType: 'ZCOM.OUTSRC_TYPE', // 外协类型
  },
  deliveryApply: {
    receiver: 'ZMDA.RECEIVER', // 接收方
    deliveryApplyStatus: 'ZCOM.DELIVERY_APPLY_STATUS', // 预约单状态
    deliveryApplyType: 'ZCOM.DELIVERY_APPLY_TYPE', // 预约单类型
  },
  deliveryOrderCreate: {
    recv: 'ZMDA.RECEIVER', // 接收方
    deliveryOrderType: 'ZCOM.DELIVERY_ORDER_TYPE', // 发货单类型
    deliveryOrderStatus: 'ZCOM.DELIVERY_ORDER_STATUS', // 发货单状态
    externalDeliveryStatus: 'ZCOM.EXTERNAL_DELIVERY_STATUS', // 发货单下发状态
    // externalDeliveryStatus: 'ZCOM.EXTERNAL_DELIVERY_STATUS', // 发货单入库下发状态
  },
  withholdingOrderCreate: {
    withholdingOrderType: 'ZCOM.WITHHOLDING_ORDER_TYPE', // 扣款单类型
    withholdingOrderStatus: 'ZCOM.WITHHOLDING_ORDER_STATUS', // 扣款单状态
    poLine: 'ZCOM.PO_LINE', // Po行
  },
  statements: {
    verificationOrderStatus: 'ZCOM.VERIFICATION_ORDER_STATUS', // 对账单状态
    verificationSourceType: 'ZCOM.VERIFICATION_SOURCE_TYPE', // 对账来源类型
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
