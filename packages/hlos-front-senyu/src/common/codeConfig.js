/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors: Please set LastEditors
 */
const code = {
  common: {
    yesOrNo: 'HZERO.WHETHER.FLAG', // 是否
    organization: 'LMDS.ORGANIZATION', // 组织
    item: 'LMDS.ITEM', // 物料
    wmOu: 'LMDS.WM_OU', // 仓储中心
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    party: 'LMDS.PARTY', // 实体
    location: 'LMDS.LOCATION', // 地理位置
    resource: 'LMDS.RESOURCE', // 资源
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    document: 'LMDS.DOCUMENT', // 单据号
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据号
    inspectionDocNum: 'LMES.INSPECTION_DOC_NUMBER', // 检验单号
    equipment: 'LMDS.EQUIPMENT', // 设备
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    worker: 'LMDS.WORKER', // 员工
    uom: 'LMDS.UOM', // 单位
    rule: 'LMDS.RULE', // 规则
    prodLine: 'LMDS.PRODLINE', // 生产线
    department: 'LMDS.DEPARTMENT', // 部门
    workcell: 'LMDS.WORKCELL', // 工位 / 工作单元
    supplier: 'LMDS.SUPPLIER', // 供应商
    supplierSite: 'LMDS.SUPPLIER_SITE', // 供应商地点
    mo: 'LMES.MO', // 工单
    itemControlType: 'LMDS.ITEM_CONTROL_TYPE', // 物料控制类型
    requestLineStatus: 'LWMS.TRANSFER_REQUEST_LINE_STATUS', // 行状态
    wmMoveType: 'LMDS.WM_MOVE_TYPE', // 移动类型
    category: 'LMDS.CATEGORY', // 类别
    categories: 'LMDS.CATEGORIES', // 类别
    wmUnit: 'LMDS.WM_UNIT', // 货格
    flag: 'LMDS.FLAG',
    scmOu: 'LMDS.SCM_OU', // 采购中心
    customer: 'LMDS.CUSTOMER', // 客户
    operation: 'LMDS.OPERATION', // 工序
    lot: 'LWMS.LOT', // 批次
    sypLot: 'NBSY.MO_LOT', // 森语标签打印批次
    tag: 'LWMS.TAG', // 标签
    singleMeOu: 'LMDS.SINGLE.ME_OU', // 工厂
    task: 'LMES.TASK', // 任务
    itemWm: 'LMDS.ITEM_WM', // 物料
    meOu: 'LMDS.ME_OU',
    soNum: 'LSOP.SO', // 销售订单
    demandNum: 'LSOP.DEMAND', // 需求订单号
    shipOrder: 'LWMS.SHIP_ORDER', // 发货单号
    sopOu: 'LMDS.SOP_OU', // 销售中心
    currency: 'HPFM.CURRENCY', // 货币
    soLine: 'LSOP.SO_LINE', // 销售订单行
    customerSite: 'LMDS.CUSTOMER_SITE', // 客户地点
    tagthing: 'LWMS.TAG_THINGS', // 实物标签
  },
  lwmsReservation: {
    reservationStatus: 'LWMS.RESERVATION_STATUS', // 保留状态
    reservationType: 'LWMS.RESERVATION_TYPE', // 保留类型
    document: 'LMDS.DOCUMENT', // 单据
  },
  lwmsShipPlatform: {
    shipOrder: 'LWMS.SHIP_ORDER', // 发运单号
    customer: 'LMDS.CUSTOMER', // 客户
    shipOrderStatus: 'LWMS.SHIP_ORDER_STATUS', // 发运单状态
    poNum: 'LSOP.SO', // 销售订单
    demandNum: 'LSOP.DEMAND', // 需求订单号
    customerSite: 'LMDS.CUSTOMER_SITE', // 客户地点
    sopOu: 'LMDS.SOP_OU', // 销售中心
    poLineNum: 'LSOP.SO_LINE', // 销售中心行号
    shippingMethod: 'LMDS.SHIPPING_METHOD', // 发运方式
    packingFormat: 'LMDS.PACKING_FORMAT', // 包装方式
  },
  lwmsOnhandQty: {
    lot: 'LWMS.LOT', // 批次
    itemType: 'ITEM_WM_TYPE', // 物料类型
    ownerType: 'LWMS.OWNER_TYPE', // 所有者类型
    featureType: 'LMDS.PRODUCT_FEATURE_TYPE', // 特征值类型
  },
  lwmsWarehouseExecution: {
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据行号
    executeType: 'LWMS.WM_EXECUTE_TYPE', // 执行类型
  },
  lwmsLotNumberQty: {
    lot: 'LWMS.LOT', // 批次
    supplier: 'LMDS.SUPPLIER', // 供应商
    lotStatus: 'LWMS.LOT_QC_STATUS', // 批次状态
  },
  lwmsTag: {
    document: 'LMDS.DOCUMENT', // 单据
    tagStatus: 'LWMS.TAG_STATUS', // 标签状态
    qcStatus: 'LWMS.TAG_QC_STATUS', // 质量状态
    tagType: 'LWMS.TAG_TYPE', // 标签类型
    tag: 'LWMS.TAG', // 标签
  },
  lwmsTransferRequest: {
    transferRequestNum: 'LWMS.TRANSFER_REQUEST', // 转移单号
    transferRequestStatus: 'LWMS.TRANSFER_REQUEST_STATUS', // 转移单状态
  },
  lwmsIssueRequest: {
    issueRequestNum: 'LWMS.ISSUE_REQUEST', // 领料单号
    issueRequestStatus: 'LWMS.ISSUE_REQUEST_STATUS', // 领料单状态
    enterprise: 'LMDS.ENTERPRISE', // 目标集团
    lineStatus: 'LWMS.REQUEST_LINE_STATUS', // 行状态
  },
  lwmsCostcenterCreate: {
    costCenter: 'LMDS.COST_CENTER_CODE', // 成本中心
  },
  lwmsTicket: {
    ticketNum: 'LWMS.DELIVERY_TICKET', // 送货单号
    party: 'LMDS.SUPPLIER', // 供应商
    ticketStatus: 'LWMS.DELIVERY_TICKET_STATUS', // 送货单状态
    poNum: 'LSCM.PO', // 采购订单号
    poLineNum: 'LSCM.PO_LINE_DT', // 采购订单行号
    buyer: 'LMDS.WORKER', // 采购员
    ticketType: 'LMDS.DOCUMENT_TYPE', // 送货单类型
    receiveToleranceType: 'LMDS.RECEIVE_TOLERANCE_TYPE', // 允差类型
    receiveRule: 'LWMS.DT_RECIEVE_RULE', // 收货类型
  },
  lwmsDeliveryExecution: {
    shippingMethod: 'LMDS.SHIPPING_METHOD', // 发运方式
  },
  lwmsInventoryPlatform: {
    countType: 'LWMS.COUNT_TYPE', // 盘点类型
    countMethod: 'LWMS.COUNT_METHOD', // 盘点方法
    countStatus: 'LWMS.COUNT_STATUS', // 盘点状态
    itemType: 'LMDS.ITEM_TYPE', // 物料类型
    adjustAccount: 'LMDS.COST_CENTER_CODE', // 调整账户
    restrictedType: 'LMDS.RESTRICTED_TYPE', // 差异限定
    ownerType: 'LMDS.OWNER_TYPE', // 所有者类型
    featureType: 'LMDS.PRODUCT_FEATURE_TYPE', // 特征类型
    costCenter: 'LMDS.COST_CENTER_CODE',
    approval: 'LMDS.APPROVAL_RULE', // 审批策略
    flow: 'HWFP.PROCESS_DEFINITION', // 审批流
  },
  lwmsMiscellaneousAdjustment: {
    adjustReason: 'WMS.ADJUST_REASON', // 调整原因
    lot: 'LWMS.LOT', // 批次
    tag: 'LWMS.TAG', // 标签
    itemWm: 'LMDS.ITEM_WM', // 物料
  },
  lwmsSingleReturnPlatform: {
    returnRequestNum: 'LWMS.RETURN_REQUEST', // 退料单号
    returnRequestStatus: 'LWMS.RETURN_REQUEST_STATUS', // 退料单状态
  },
  lwmsWipCompletion: {
    documentClass: 'LMES.INSPECTION_DIMENSION', // 单据大类
  },
  lwmsShipReturnPlatform: {
    shipReturn: 'LWMS.SHIP_RETURN',
    shipReturnStatus: 'LWMS.SHIP_RETURN_STATUS',
    returnReason: 'LMDS.EXCEPTION', // 退货原因
    rule: 'LMWS.RETURN_RULE',
  },
  lwmsRecognitionRule: {
    identifyRuleClass: 'LMDS.IDENTIFY_RULE_CLASS', // 识别大类
    identifyRuleType: 'LMDS.IDENTIFY_RULE_TYPE', // 识别类型
    identifyMethod: 'LMDS.IDENTIFY_METHOD', // 识别方式
    identifyContentType: 'LMDS.IDENTIFY_CONTENT_TYPE', // 内容类型
  },
  senyuTagPrint: {
    linkDocument: 'LMES.MO', // 关联单据
  },
  senyuTaskReport: {
    taskItem: 'LMES.TASK_ITEM',
    qcType: 'LMES.TAG_TYPE',
    inspectType: 'LMES.INSPECT_TYPE',
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
