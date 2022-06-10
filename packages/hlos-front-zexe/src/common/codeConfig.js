/**
 * @Description: config - 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-27 17:04:33
 */

const code = {
  common: {
    organization: 'ZMDA.SUPPLIER_ORGANIZATION', // 组织
    supplierMeOu: 'ZMDA.SUPPLIER_ME_OU',
    item: 'LMDS.ITEM', // 物料
    apsOu: 'LMDS.APS_OU', // 计划中心
    apsGroup: 'LMDS.APS_GROUP', // 计划组
    apsResource: 'LMDS.APS_RESOURCE', // 计划资源
    prodLine: 'LMDS.PRODLINE', // 生产线
    equipment: 'LMDS.EQUIPMENT', // 设备
    soNum: 'LSOP.SO', // 销售订单
    demandNum: 'LSOP.DEMAND', // 需求订单号
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    party: 'LMDS.PARTY', // 实体
    document: 'LMDS.DOCUMENT', // 单据号
    singleMeOu: 'LMDS.SINGLE.ME_OU', // 工厂
    itemMe: 'LMDS.ITEM_ME', // 物料制造
    operation: 'LMDS.OPERATION', // 工序
    workcell: 'LMDS.WORKCELL', // 工位
    worker: 'LMDS.WORKER', // 操作工
    itemCategory: 'LMDS.CATEGORY', // 物料类别
    customer: 'LMDS.CUSTOMER', // 客户
    moStatus: 'LMES.MO_STATUS', // MO状态
    supplier: 'ZMDA.SUPPLIER', // 供应商
    department: 'LMDS.DEPARTMENT', // 部门
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据
    resource: 'LMDS.RESOURCE', // 资源
    meOu: 'LMDS.ME_OU', // 工厂
    andonClass: 'LMDS.ANDON_CLASS', // 安灯类别
    moNum: 'LMES.MO', // MO号
    uom: 'LMDS.UOM', // 单位
    externalOrderType: 'LMDS.EXTERNAL_ORDER_TYPE', // 外部单据类型
    productionVersion: 'LMDS.PRODUCTION_VERSION', // 生产版本
    bom: 'LMDS.ITEM_BOM', // BOM
    routing: 'LMDS.ITEM_ROUTING', // 工艺路线
    categories: 'LMDS.CATEGORIES', // 类别
    customerSite: 'LMDS.CUSTOMER_SITE', // 客户地点
    meArea: 'LMDS.ME_AREA', // 车间
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    wipStatus: 'LMES.WIP_STATUS', // WIP状态
    rule: 'LMDS.RULE', // 规则
    collector: 'LMDS.COLLECTOR', // 收集项
    location: 'LMDS.LOCATION', // 地点
    task: 'LMES.TASK', // 任务号
    moOperation: 'LMES.MO_OPERATION', // MO工序
    shift: 'LMDS.SHIFT_CODE', // 指定班次
    exception: 'LMDS.EXCEPTION', // 异常
    exceptionGroup: 'LMDS.EXCEPTION_GROUP', // 异常组
    itemControlType: 'LMDS.ITEM_CONTROL_TYPE', // 物料控制类型
    soLineStatus: 'LSOP.SO_LINE_STATUS', // 行状态
  },
  zexeOnhandQty: {
    lot: 'LWMS.LOT', // 批次
    itemType: 'ITEM_WM_TYPE', // 物料类型
    ownerType: 'LWMS.OWNER_TYPE', // 所有者类型
    featureType: 'LMDS.PRODUCT_FEATURE_TYPE', // 特征值类型
  },
  zexeWarehouseExecution: {
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据行号
    executeType: 'LWMS.WM_EXECUTE_TYPE', // 执行类型
  },
  zexeMoWorkspace: {
    moStatus: 'LMES.MO_STATUS', // MO状态
    planRule: 'LMES.MO_PLAN_RULE', // 计划规则
    capacityType: 'LMDS.CAPACITY_TYPE', // 能力类型
    referenceType: 'LMES.MO_REFERENCE_TYPE', // 参考类型
    executeStatus: 'LMES.MO_EXECUTE_STATUS', // 执行状态
    demandRank: 'LSOP.DEMAND_RANK', // 需求等级
    completeControlType: 'LMDS.COMPLETE_CONTROL_TYPE', // 完工限制类型
  },
  zexeProductOrderIOReport: {
    // zexe投入比报表
    supplierMo: 'ZCOM.SUPPLIER_MO', // purchaser使用的mo号
    supplierItem: 'ZMDA.SUPPLIER_ITEM', // purchaser使用物料编码、mo组件物料
    moType: 'ZMDA.DOCUMENT_TYPE', // mo类型
    mo: 'ZCOM.MO', // supplier使用的mo号
    item: 'ZMDA.ITEM', // 协同物料
    organization: 'ZMDA.ORGANIZATION', // 供应商
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
