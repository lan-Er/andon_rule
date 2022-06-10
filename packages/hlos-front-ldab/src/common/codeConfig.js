/*
 * @Description: 端全局变量配置
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-05-27 14:50:11
 * @LastEditors: Please set LastEditors
 */
const code = {
  common: {
    organization: 'LMDS.ORGANIZATION', // 组织
    singleMeOu: 'LMDS.SINGLE.ME_OU', // 工厂
    itemMe: 'LMDS.ITEM_ME', // 物料制造
    document: 'LMDS.DOCUMENT', // 单据
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    operation: 'LMDS.OPERATION', // 工序
    prodLine: 'LMDS.PRODLINE', // 生产线
    workcell: 'LMDS.WORKCELL', // 工位
    equipment: 'LMDS.EQUIPMENT', // 设备
    worker: 'LMDS.WORKER', // 操作工
    itemType: 'LMDS.ITEM_TYPE', // 物料类型
    itemCategory: 'LMDS.CATEGORY', // 物料类别
    customer: 'LMDS.CUSTOMER', // 客户
    moStatus: 'LMES.MO_STATUS', // MO状态
    warehouse: 'LMDS.WAREHOUSE',
    meArea: 'LMDS.ME_AREA', // 车间
    taskStatus: 'LMES.TASK_STATUS', // 任务状态
    categories: 'LMDS.CATEGORIES',
  },
  ldabDashboardConfig: {
    dashboardClass: 'LMDS.DASHBOARD_CLASS',
    dashboardType: 'LMDS.DASHBOARD_TYPE',
    dashboardDisplayTerminalType: 'LMDS.DASHBOARD_DISPLAY_TERMINAL_TYPE',
    dashboardCardType: 'LMDS.DASHBOARD_CARD_TYPE',
    dashboardCardDataType: 'LMDS.DASHBOARD_CARD_DATA_TYPE',
    dashboardCardRefreshType: 'LMDS.DASHBOARD_CARD_REFRESH_TYPE',
  },
  interfaceConfig: {
    project: 'LDAB.PROJECT', // 项目
  },
  // PQC IQC FQC 统计报表Code
  PqcIqcFqcConfig: {
    IQCStatisticaldimension: 'LMDS.IQC_FORM_DIMENSION', // IQC统计维度
    PQCStatisticaldimension: 'LMDS.PQC_FORM_DIMENSION', // PQC统计维度
    FQCStatisticaldimension: 'LMDS.FQC_FORM_DIMENSION', // FQC统计维度
    templateType: 'LMDS.INSPECTION_TEMPLATE_TYPE', // 检验类型
    purchaseItem: 'LMDS.ITEM_SCM', // 采购物料
    itemMe: 'LMDS.ITEM_ME', // 采购物料
    supplier: 'LMDS.SUPPLIER', // 供应商
    operation: 'LMDS.OPERATION', // 工序
    category: 'LMDS.CATEGORY', // 物料类别
    queryDate: 'LMDS.QUERY_DATE',
  },
  // 收发存报表Code
  ReceiveAndStoreReportConfig: {
    warehouseJournal: 'LMDS.WAREHOUSE', // 仓库范围
    item: 'LMDS.ITEM_SCM', // 物料
    itemWm: 'LMDS.ITEM_WM', // 物料
    itemType: 'LMDS.ITEM_TYPE', // 物料类型
  },
  ldabOeeReport: {
    shift: 'LMDS.SHIFT_CODE',
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
