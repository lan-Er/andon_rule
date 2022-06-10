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
    categories: 'LMDS.CATEGORIES', // 类别
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
  },
  lwmsWarehouseSpectaculars: {
    reviewType: 'LMDS.KITTING_REVIEW_TYPE', // 检查类型
    reviewRule: 'LMDS.KITTING_REVIEW_RULE', // 齐套规则
    lineType: 'LMDS.KITTING_LINE_TYPE', // 类型
    supplyType: 'LMDS.KITTING_SUPPLY_TYPE', // 供应类型
    kittingType: 'LMDS.KITTING_TYPE', // 齐套类型
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
