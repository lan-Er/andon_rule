/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors: Please set LastEditors
 */
const code = {
  common: {
    organization: 'LMDS.ORGANIZATION', // 组织
    item: 'LMDS.ITEM', // 物料
    apsOu: 'LMDS.APS_OU', // 计划中心
    apsGroup: 'LMDS.APS_GROUP', // 计划组
    apsResource: 'LMDS.APS_RESOURCE', // 计划资源
    apsResourceRule: 'LMDS.APS_RESOURCE_RULE', // 资源分配规则
    prodLine: 'LMDS.PRODLINE', // 生产线
    equipment: 'LMDS.EQUIPMENT', // 设备
    soNum: 'LSOP.SO', // 销售订单
    demandNum: 'LSOP.DEMAND', // 需求订单号
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    department: 'LMDS.DEPARTMENT', // 部门
    document: 'LMDS.DOCUMENT', // 来源单据号
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据
    resource: 'LMDS.RESOURCE', // 资源
    party: 'LMDS.PARTY', // 商业实体
    worker: 'LMDS.WORKER', // 操作工
    workcell: 'LMDS.WORKCELL', // 工位
    meOu: 'LMDS.ME_OU', // 工厂
    andonClass: 'LMDS.ANDON_CLASS', // 安灯类别
    moNum: 'LMES.MO', // MO号
    uom: 'LMDS.UOM', // 单位
    externalOrderType: 'LMDS.EXTERNAL_ORDER_TYPE', // 外部单据类型
    productionVersion: 'LMDS.PRODUCTION_VERSION', // 生产版本
    bom: 'LMDS.ITEM_BOM', // BOM
    routing: 'LMDS.ITEM_ROUTING', // 工艺路线
    categories: 'LMDS.CATEGORIES', // 类别
    customer: 'LMDS.CUSTOMER', // 客户
    customerSite: 'LMDS.CUSTOMER_SITE', // 客户地点
    meArea: 'LMDS.ME_AREA', // 车间
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    wipStatus: 'LMES.WIP_STATUS', // WIP状态
    rule: 'LMDS.RULE', // 规则
    collector: 'LMDS.COLLECTOR', // 收集项
    location: 'LMDS.LOCATION', // 地点
    task: 'LMES.TASK', // 任务号
    moOperation: 'LMES.MO_OPERATION', // MO工序
    operation: 'LMDS.OPERATION', // 工序
    shift: 'LMDS.SHIFT_CODE', // 指定班次
    exception: 'LMDS.EXCEPTION', // 异常
    exceptionGroup: 'LMDS.EXCEPTION_GROUP', // 异常组
    itemControlType: 'LMDS.ITEM_CONTROL_TYPE', // 物料控制类型
    soLineStatus: 'LSOP.SO_LINE_STATUS', // 行状态
    inspectionNum: 'LMES.INSPECTION_DOC_NUMBER',
    currency: 'HPFM.CURRENCY', // 货币
    itemMe: 'LMDS.ITEM_ME', // 制造物料
    flag: 'HPFM.FLAG', // 是否
    tag: 'LWMS.TAG', // 标签
    supplier: 'LMDS.SUPPLIER', // 供应商
    lot: 'LWMS.LOT', // 批次
    taskAll: 'LMES.TASK', // 任务
    npTask: 'LMES.NP_TASK', // 非生产任务
    moComponent: 'LMES.MO_COMPONENT', // mo组件
    shipOrder: 'LWMS.SHIP_ORDER', // 发货单
    tpmTask: 'LMES.TPM_TASK',
  },
  lmesMoComponent: {
    moNum: 'LMES.MO', // MO号
    supplyType: 'LMDS.SUPPLY_TYPE', // 供应类型
    substitutePolicy: 'LMDS.BOM_SUBSTITUTE_POLICY', // 替代策略
    supplier: 'LMDS.SUPPLIER', // 供应商
    uom: 'LMDS.UOM', // 单位
    issueControlType: 'LMDS.ISSUE_CONTROL_TYPE', // 投料限制类型
  },
  lmesMoProductionDestock: {
    organization: 'LMDS.SINGLE.ME_OU', // 组织
    moNum: 'LMES.MO', // MO号
  },
  lmesMoWorkspace: {
    moStatus: 'LMES.MO_STATUS', // MO状态
    planRule: 'LMES.MO_PLAN_RULE', // 计划规则
    capacityType: 'LMDS.CAPACITY_TYPE', // 能力类型
    referenceType: 'LMES.MO_REFERENCE_TYPE', // 参考类型
    executeStatus: 'LMES.MO_EXECUTE_STATUS', // 执行状态
    demandRank: 'LSOP.DEMAND_RANK', // 需求等级
    completeControlType: 'LMDS.COMPLETE_CONTROL_TYPE', // 完工限制类型
    itemQuery: 'LMDS.ITEM_QUERY',
    ruleCode: 'HMDE.CODE_RULE_LIST', // 编码规则
  },
  lmesInspectionDoc: {
    inspectionDocNum: 'LMES.INSPECTION_DOC_NUMBER', // 检验单号
    inspectionTemplateType: 'LMDS.INSPECTION_TEMPLATE_TYPE', // 检验类型
    qcStatus: 'LMES.QC_STATUS', // 检验单状态
    qcResult: 'LMES.QC_RESULT', // 判定结果
    samplingType: 'LMDS.INSPECTION_SAMPLING_TYPE', // 抽样类型
    ticketStatus: 'LWMS.DELIVERY_TICKET_LINE_STATUS',
  },
  lmesAndonJournal: {
    andon: 'LMDS.ANDON', // 安灯
    andonBin: 'LMDS.ANDON_BIN', // 安灯 Bin
    andonStatus: 'LMDS.ANDON_STATUS', // 安灯状态
    dataCollectType: 'LMDS.ANDON_DATA_COLLECT_TYPE', // 安灯数据收集类型
    msgStatus: 'LMDS.SEND_MSG_STATUS', // 消息状态
  },
  lmesAndonSignboard: {
    signboardPeriod: 'LMES.ANDON_KANBAN_PERIOD', // 展示周期
    refreshInterval: 'LMES.ANDON_KANBAN_REFRESH_INTERVAL', // 刷新时间
  },
  lmesTask: {
    taskStatus: 'LMES.TASK_STATUS', // 任务状态
    tpmResult: 'LMES.TPM_RESULT', // TPM结果
    shift: 'LMDS.SHIFT_CODE', // 指定班次
    itemType: 'LMES.TASK_ITEM_TYPE', // 类型
    steptype: 'LMES.TASK_STEP_TYPE', // 步骤类型
    taskRank: 'LMES.TASK_RANK', // 任务等级
  },
  lmesProductionExecution: {
    executeType: 'LMES.EXECUTE_TYPE', // 执行类型
  },
  lmesComponentReport: {
    componentType: 'LMDS.ITEM_TYPE_HNGJ',
  },
  lmesAndonStatistic: {
    factory: 'LMDS.SINGLE.ME_OU',
  },
  lmesInspectionJudge: {
    inspectionDocNum: 'LMES.INSPECTION_DOC_NUMBER', // 检验单号
    qcFlag: 'LMES.QC_FLAG', // 是否报检
  },
  lmesIqcInspection: {
    source: 'LWMS.DELIVERY_TICKET',
    sourceLine: 'LWMS.DELIVERY_TICKET_LINE',
    priority: 'LMES.QC_PRIORITY', // 优先级
  },
  lmesPqcInspection: {
    inspect: 'LMDS.INSPECTION_TEMPLATE_TYPE',
    sourceTask: 'LMES.TASK',
    sourceMo: 'LMES.MO',
    sourceLine: 'LWMS.DELIVERY_TICKET_LINE',
    from: 'LMES.INSPECTION_DIMENSION',
    resource: 'LMDS.RESOURCE',
  },
  lmesPqcSiteInspection: {
    inspectionGroup: 'LMDS.INSPECTION_TEMPLATE',
    qcResult: 'LMES.QC_RESULT',
    documentType: 'LMES.QC_SOURCE_DOC_CLASS',
    documentTask: 'LMES.TASK',
  },
  lmesEquipmentInspection: {
    organization: 'LMDS.SINGLE.ME_OU', // 组织
    status: 'LMES.PERIOD_CHECK_TASK_STATUS', // 点检单状态
    inspectionGroup: 'LMDS.INSPECTION_GROUP', // 点检组
  },
  lmesEquipmentMonitor: {
    factory: 'LMDS.SINGLE.ME_OU', // 工厂
  },
  lmesResourcePlan: {
    fromResourceClass: 'LMES.FROM_RESOURCE_CLASS', // 来源分类
    toResourceClass: 'LMES.TO_RESOURCE_CLASS', // 目标分类
  },
  lmesNonConformingProcessing: {
    documentType: 'LMDS.DOCUMENT_TYPE_LIMIT_CLASS', // 单据类型 限制多种单据大类
    inspectionNum: 'LMES.INSPECTION_DOC_NUMBER', // 检验单号
    inspectionType: 'LMDS.INSPECTION_TEMPLATE_TYPE', // 检验类型
    document: 'LMDS.DOCUMENT', // 关联单据
  },
  lmesTeamManagement: {
    supervisor: 'LMDS.SUPERVISOR', // 班组长
    foreman: 'LMDS.JOB_FOREMAN', // 班组长
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    shiftCode: 'LMDS.SHIFT_CODE', // 班次
    workTimeClass: 'LMES.WORK_TIME_CLASS', // 工作时间大类
    workTimeType: 'LMES.WORK_TIME_TYPE', // 工作类型
  },
  lmesSpareParts: {
    spareParts: 'LMDS.SPARE_PARTS',
    sparePartsType: 'LMDS.SPARE_PARTS_TYPE',
  },
  lmesSparePartsMonitor: {
    period: 'LMDS.DISPLAY_PERIOD', // 展示周期
  },
  lmesCutterDashboard: {
    cutterType: 'LMDS.CUTTER_TYPE',
  },
  lmesTaskReport: {
    taskItem: 'LMES.TASK_ITEM',
    qcType: 'LMES.TAG_TYPE',
    inspectType: 'LMES.INSPECT_TYPE',
  },
  lmesReworkPlatform: {
    operationType: 'LMDS.OPERATION_TYPE', // 工序类型
  },
  lmesOutSource: {
    operOutsource: 'LMES.OPER_OUTSOURCE', // 外协单号
    outsourceStatus: 'LMES.OUTSOURCE_STATUS', // 外协状态
    taskStatus: 'LMES.TASK_STATUS', // 任务状态
    partySite: 'LMDS.PARTY_SITE', // 外协地点
  },
  lmesPoPrecheck: {
    party: 'LMDS.SUPPLIER',
    po: 'LSCM.PO',
    poLine: 'LSCM.PO_LINE',
    inspectionTemplate: 'LMDS.INSPECTION_TEMPLATE',
  },
  lmesInspectionInWarehouse: {
    queryDimension: 'LMDS.QUERY_DIMENSION', // 查询维度
    lotStatus: 'LWMS.LOT_QC_STATUS', // 批次状态
    samplingType: 'LMDS.INSPECTION_SAMPLING_TYPE', // 抽样类型
    inspectionTemplateType: 'LMDS.INSPECTION_TEMPLATE_TYPE', // 质检模板
  },
  lmesOnePieceFlowReport: {
    tagTemplate: 'HRPT.REPORT_INFO_ORG',
  },
  lmesProductTracing: {
    traceCondition1: 'LMDS.TRACE_CONDITION_1', // 追溯条件
    traceCondition0: 'LMDS.TRACE_CONDITION_0', // 追溯条件
  },
  lmesProductionScrap: {
    reportType: 'LMES.TASK_REPORT_TYPE', // 报工模式
    scrappedType: 'LMES.SCRAPPED_TYPE', // 报废模式
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
