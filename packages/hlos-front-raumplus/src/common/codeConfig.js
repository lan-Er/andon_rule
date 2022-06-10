/*
 * @module: 德禄值集视图编码
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-05 14:15:48
 * @LastEditTime: 2021-06-24 16:37:10
 * @copyright: Copyright (c) 2020,Hand
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
    wmUnit: 'LMDS.WM_UNIT', // 货格
    flag: 'LMDS.FLAG',
    scmOu: 'LMDS.SCM_OU', // 采购中心
    customer: 'LMDS.CUSTOMER', // 客户
    operation: 'LMDS.OPERATION', // 工序
    lot: 'LWMS.LOT', // 批次
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
    po: 'LSCM.PO', // 采购订单
  },
  lookupCodeList: {
    dashboardClass: 'LMDS.DASHBOARD_CLASS',
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
    customerGroup: 'LMDS.CUSTOMER_GROUP', // 品牌
    attribute2: 'LMDS.SHIPPING_LOGISTICS', // 发货物流
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
  lwmsOnhandQty: {
    lot: 'LWMS.LOT', // 批次
    itemType: 'ITEM_WM_TYPE', // 物料类型
    ownerType: 'LWMS.OWNER_TYPE', // 所有者类型
    featureType: 'LMDS.PRODUCT_FEATURE_TYPE', // 特征值类型
  },
  raumplusOtherWarehousing: {
    transactionWayName: 'LWMS.INV_TRANSACTION_TYPE', // 出入库方式
    requestOperationType: 'LWMS.INV_BUSINESS_TYPE', // 业务类型
    partyName: 'LMDS.PARTY', // 商务实体
    invTransactionNum: 'LWMS.TRANSACTION', // 出入库单编号
    workerName: 'LMDS.WORKER', // 申请人
    departmentName: 'HPFM.UNIT.DEPARTMENT', // 部门
    sourceDocNum: 'LWMS.SOURCE_DOC', // 来源单据号
    statusDes: 'LWMS.INV_TRANSACTION_STATUS', // 状态
    warehouseCode: 'LMDS.WAREHOUSE', // 来源仓库
    wmAreaCode: 'LMDS.WM_AREA', // 来源货位
    toWarehouseCode: 'LMDS.WAREHOUSE', // 目标仓库
    toWmAreaCode: 'LMDS.WM_AREA', // 目标货位
  },
  raumplusFinishedGoodsInventory: {
    documentnum: 'LMDS.SO', // 子订单号
  },
  lmesNonConformingProcessing: {
    inspectionNum: 'LMES.INSPECTION_DOC_NUMBER', // 检验单号
    inspectionType: 'LMDS.INSPECTION_TEMPLATE_TYPE', // 检验类型
    document: 'LMDS.DOCUMENT', // 关联单据
    exception: 'LMDS.EXCEPTION', // 异常
    delayWay: 'LMES.ABNORMAL_DEAL_WAY', // 处理方式
  },
  lwmsTicketReport: {
    documentnum: 'LMDS.SO', // 子订单号
  },
  lwmsWarehouseExecution: {
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据行号
    executeType: 'LWMS.WM_EXECUTE_TYPE', // 执行类型
  },
  raumplusProductionPickingBoard: {
    kanbanType: 'LWMS.KANBAN_TYPE', // 单据维度
    dlScheme: 'DL_SCHEME_NAME', // 方案类型
  },
  lmesInspectionJudge: {
    inspectionDocNum: 'LMES.INSPECTION_DOC_NUMBER', // 检验单号
    qcFlag: 'LMES.QC_FLAG', // 是否报检
  },
};

export default {
  // 快码配置
  code,
};
