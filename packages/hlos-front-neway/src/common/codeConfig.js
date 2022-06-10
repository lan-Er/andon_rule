const code = {
  common: {
    yesOrNo: 'LMDS.FLAG', // 是否有效
    flag: 'HPFM.FLAG', // 是否
    enterprise: 'LMDS.ENTERPRISE', // 集团
    location: 'LMDS.LOCATION', // 地理位置
    scmOu: 'LMDS.SCM_OU', // 采购中心
    wmOu: 'LMDS.WM_OU', // 仓储中心
    sopOu: 'LMDS.SOP_OU', // 销售中心
    moMeOu: 'LMDS.ME_OU', // 工厂
    meOu: 'LMDS.SINGLE.ME_OU', // 工厂
    meArea: 'LMDS.ME_AREA', // 车间
    moNum: 'LMES.MO', // MO号
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位/仓储区域
    organization: 'LMDS.ORGANIZATION', // 组织
    exception: 'LMDS.EXCEPTION', // 异常
    department: 'LMDS.DEPARTMENT', // 部门
    supervisor: 'LMDS.SUPERVISOR', // 主管
    position: 'LMDS.POSITION', // 岗位
    currency: 'HPFM.CURRENCY', // 货币
    resource: 'LMDS.RESOURCE', // 资源
    calendar: 'LMDS.CALENDAR', // 工作日历
    party: 'LMDS.PARTY', // 实体
    ownerType: 'LMDS.OWNER_TYPE', // 所有者类型
    role: 'HITF.USER_ROLE', // 角色
    user: 'HIAM.USER.ORG', // 用户
    itemMe: 'LMDS.ITEM_ME', // 物料
    item: 'LMDS.ITEM', // 物料
    itemAps: 'LMDS.ITEM_APS', // 计划物料
    itemBom: 'LMDS.ITEM_BOM', // 物料BOM
    equipment: 'LMDS.EQUIPMENT', // 设备
    rule: 'LMDS.RULE', // 规则
    apsOu: 'LMDS.APS_OU', // 计划中心
    apsGroup: 'LMDS.APS_GROUP', // 计划组
    worker: 'LMDS.WORKER', // 工人
    wmUnit: 'LMDS.WM_UNIT', // 货格
    prodLine: 'LMDS.PRODLINE', // 产线
    workcell: 'LMDS.WORKCELL', // 工位
    bom: 'LMDS.BOM', // BOM
    operation: 'LMDS.OPERATION', // 工序
    category: 'LMDS.CATEGORY', // 物料类别
    categories: 'LMDS.CATEGORIES', // 通用类别
    itemCategory: 'ITEM_ME', // 物料类别
    resourceBom: 'LMDS.RESOURCE_BOM', // 资源BOM
    inspectionGroup: 'LMDS.INSPECTION_GROUP', // 检验组
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    andonClass: 'LMDS.ANDON_CLASS', // 安灯分类
    capacityType: 'LMDS.APS_CAPACITY_TYPE', // 计划能力类型
    periodicType: 'LMDS.APS_PERIODIC_TYPE', // 滚动周期
    apsResource: 'LMDS.APS_RESOURCE', // 计划资源
    apsResourceRule: 'LMDS.APS_RESOURCE_RULE', // 资源分配规则
    bomComponent: 'LMDS.BOM_COMPONENT', // BOM组件
    collector: 'LMDS.COLLECTOR', // 数据收集
    container: 'LMDS.CONTAINER', // 容器
    containerType: 'LMDS.CONTAINER_TYPE', // 容器类型
    eventType: 'LMDS.EVENT_TYPE', // 事件类型
    exceptionGroup: 'LMDS.EXCEPTION_GROUP', // 异常组
    fobType: 'LMDS.FOB_TYPE', // FOB类型
    itemRouting: 'LMDS.ITEM_ROUTING', // 产品工艺路线
    operationStepType: 'LMDS.OPERATION_STEP_TYPE', // 步骤类型
    operationType: 'LMDS.OPERATION_TYPE', // 工序类型
    packingFormat: 'LMDS.PACKING_FORMAT', // 包装方式
    psiDisplayArea: 'LMDS.PSI_DISPLAY_AREA', // 显示区域
    psiElementStartTime: 'LMDS.PSI_ELEMENT_START_TIME', // 要素开始时间
    resourceGroup: 'LMDS.RESOURCE_GROUP', // 资源组
    sopPlanRule: 'LMDS.SOP_PLAN_RULE', // 销售计划规则
    supplier: 'LMDS.SUPPLIER', // 供应商
    supplyType: 'LMDS.SUPPLY_TYPE', // 供应类型
    transactionType: 'LMDS.TRANSACTION_TYPE', // 事务类型
    transportType: 'LMDS.TRANSPORT_TYPE', // 运输方式
    uom: 'LMDS.UOM', // 单位
    workPriceVersionStatus: 'LMDS.WORK_PRICE_VERSION_STATUS', // 版本状态
    processDefintion: 'HWFP.PROCESS_DEFINITION', // 审核流程
    tenant: 'HPFM.TENANT', // 租户
    client: 'LMDS.CLIENT', // 客户端
    document: 'LMDS.DOCUMENT', // 单据
    documentLine: 'LMDS.DOCUMENT_LINE', // 单据
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    workCenter: 'LMDS.PRODLINE', // 工作中心 生产线
    scmGp: 'LMDS.SCM_GROUP', // 采购组
    soNum: 'LSOP.SO', // 销售订单
    demandNum: 'LSOP.DEMAND', // 需求订单号
    shift: 'LMDS.SHIFT_CODE', // 指定班次
    externalOrderType: 'LMDS.EXTERNAL_ORDER_TYPE', // 外部单据类型
    productionVersion: 'LMDS.PRODUCTION_VERSION', // 生产版本
    routing: 'LMDS.ITEM_ROUTING', // 工艺路线
    customer: 'LMDS.CUSTOMER', // 客户
    customerSite: 'LMDS.CUSTOMER_SITE', // 客户地点
    tag: 'LWMS.TAG', // 标签
    taskAll: 'LMES.TASK', // 任务号 来源任务
  },
  lmdsBusinessDocument: {
    documentNum: 'LMDS.DOCUMENT',
    documentType: 'LMDS.DOCUMENT_TYPE',
    documentStatus: 'LMDS.DOCUMENT_STATUS',
  },
  lmdsWmOu: {
    wmOuParentOrg: 'LMDS.WM_OU_PARENT_ORG', // 仓储中心父级组织
  },
  lmdsPSI: {
    elementType: 'LMDS.PSI_ELEMENT_TYPE', // 要素类型
    elementGroup: 'LMDS.PSI_ELEMENT_GROUP', // 要素分组
  },
  lmdsBomAllocation: {
    resource: 'LMDS.RESOURCE', // 资源
  },
  lmdsResourceCapaticy: {
    prodVersion: 'LMDS.PRODUCTION_VERSION', // 生产版本
  },
  lmdsMould: {
    dieType: 'LMDS.DIE_TYPE', // 模具类型
    dieStatus: 'LMDS.DIE_STATUS', // 模具状态
    workCell: 'LMDS.WORKCELL', // 工位
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
  },
  lmdsUserSetting: {
    sopOu: 'LMDS.SOP_OU', // 销售中心
  },
  lmdsContainerType: {
    containerClass: 'LMDS.CONTAINER_CLASS', // 容器大类
    containerTypeCategory: 'LMDS. CONTAINER_TYPE_CATEGORY', // 类别
  },
  lmdsWmUnit: {
    wmUnitType: 'LMDS.WM_UNIT_TYPE', // 货格类型
  },
  lmdsUom: {
    uomType: 'LMDS.UOM_CLASS', // 单位类别
  },
  lmdsCustomer: {
    customerRank: 'LMDS.CUSTOMER_RANK', // 客户等级
    customerStatus: 'LMDS.CUSTOMER_STATUS', // 客户状态
    paymentDeadline: 'LMDS.CUSTOMER_PAYMENT_DEADLINE', // 付款期限
    paymentMethod: 'LMDS.CUSTOMER_PAYMENT_METHOD', // 付款方式
    customerSiteType: 'LMDS.CUSTOMER_SITE_TYPE', // 地点类型
    customerSiteStatus: 'LMDS.CUSTOMER_SITE_STATUS', // 地点状态
  },
  lmdsParty: {
    partyType: 'LMDS.PARTY_TYPE', // 商业实体类型
    partySiteType: 'LMDS.PARTY_SITE_TYPE', // 地点类型
    partyStatus: 'LMDS.PARTY_STATUS', // 商业实体状态
    partySiteStatus: 'LMDS.PARTY_SITE_STATUS', // 地点状态
  },
  lmdsInspectionItem: {
    inspectionClass: 'LMDS.INSPECTION_ITEM_CLASS', // 检验大类
    inspectionType: 'LMDS.INSPECTION_ITEM_TYPE', // 检验类型
    resultType: 'LMDS.INSPECTION_RESULT_TYPE', // 结果类型
  },
  lmdsEvent: {
    syncStatus: 'LMDS.SYNC_STATUS', // 同步状态
    objectType: 'LMDS.EVENT_OBJECT_TYPE', // 对象类型
    recordType: 'LMDS.EVENT_RECORD_TYPE', // 记录类型
  },
  lmdsEventType: {
    eventClass: 'LMDS.EVENT_CLASS', // 事件大类
  },
  lmdsTransactionType: {
    transactionClass: 'LMDS.TRANSACTION_CLASS', // 事务大类
  },
  lmdsException: {
    exceptionClass: 'LMDS.EXCEPTION_CLASS', // 异常大类
    exceptionType: 'LMDS.EXCEPTION_TYPE', // 异常类型
  },
  lmdsExceptionAssign: {
    exceptionAssignType: 'LMDS.EXCEPTION_ASSIGN_TYPE', // 异常分配类型
    exceptionResource: 'LMDS.EXCEPTION_ASSIGN_SOURCE', // 异常来源
    exceptionGroup: 'LMDS.EXCEPTION_GROUP', // 异常组
  },
  lmdsExceptionGroup: {
    exceptionGrouptype: 'LMDS.EXCEPTION_GROUP_TYPE', // 异常组类型
  },
  lmdsWorkerGroup: {
    workCalendar: 'LMDS.WKG_CALENDAR', // 工作日历
    workerGroupType: 'LMDS.WORKER_GROUP_TYPE', // 班组类型
  },
  lmdsWorker: {
    workerType: 'LMDS.WORKER_TYPE', // 操作工类型
    workerSex: 'LMDS.WORKER_SEX', // 操作工性别
    workerLevel: 'LMDS.WORKER_LEVEL', // 员工等级
    workerCertificateType: 'LMDS.WORKER_CERTIFICATE_TYPE', // 证件类型
  },
  lmdsWorkcell: {
    workcellType: 'LMDS.WORKCELL_TYPE', // 工作单元类型
    workcellCategory: 'LMDS.WORKCELL_CATEGORY', // 工作单元类别
    workcellCalendar: 'LMDS.WORKCELL_CALENDAR', // 工作日历
    activityType: 'LMDS.ACTIVE_TYPE', // 作业类型
  },
  lmdsEquipment: {
    owner: 'LMDS.EQUIPMENT_OWNER', // 所有者
    equipmentCalendar: 'LMDS.EQUIPMENT_CALENDAR', // 工作日历
    equipmentType: 'LMDS.EQUIPMENT_TYPE', // 设备类型
    equipmentStatus: 'LMDS.EQUIPMENT_STATUS', // 设备状态
  },
  lmdsProdLine: {
    organization: 'LOV_FND_ORGANIZATION', // 组织
    prodLineType: 'LMDS.PROD_LINE_TYPE', // 生产线类型
    prodLineCalendar: 'LMDS.PRODLINE_CALENDAR', // 工作日历
  },
  lmdsResource: {
    resourceClass: 'LMDS.RESOURCE_GLASS', // 资源分类
    resourceType: 'LMDS.RESOURCE_TYPE', // 资源类型
    resourceStatus: 'LMDS.RESOURCE_STATUS', // 资源状态
  },
  lmdsResourceGroup: {
    resourceGroupType: 'LMDS.RESOURCE_GROUP_TYPE', // 资源组类型
    organization: 'LMDS.RESOURCE_GROUP_ORG', // 资源组组织
    resourceGroupCategory: 'LMDS.RESOURCE_GROUP_CATEGORY', // 资源类别
  },
  lmdsResourceRelation: {
    relationType: 'LMDS.RESOURCE_RELATION_TYPE', // 关系类型
  },
  lmdsCalendar: {
    shiftCode: 'LMDS.CALENDAR_SHIFT_CODE', // 班次
    calendarType: 'LMDS.CALENDAR_TYPE', // 日历类型
    calendarLineType: 'LMDS.CALENDAR_LINE_TYPE', // 日历行类型
  },
  lmdsPrivilege: {
    privilegeAction: 'LMDS.PRIVILEGE_ACTION', // 权限操作
    sourceType: 'LMDS.PRIVILEGE_SOURCE_TYPE', // 来源类型
    privilegeType: 'LMDS.PRIVILEGE_TYPE', // 权限类型
  },
  lmdsBom: {
    bomtype: 'LMDS.BOM_TYPE', // bom类型
    supplyType: 'LMDS.SUPPLY_TYPE', // 供应类型
    subPolicy: 'LMDS.BOM_SUBSTITUTE_POLICY', // 替代策略
  },
  lmdsRule: {
    ruleType: 'LMDS.RULE_TYPE', // 规则类型
    ruleClass: 'LMDS.RULE_CLASS', // 规则大类
    ruleKeyType: 'LMDS.RULE_KEY_TYPE', // 规则项类型
  },
  lmdsAndon: {
    andonBin: 'LMDS.ANDON_BIN', // 安灯灯箱
    andonClass: 'LMDS.ANDON_CLASS', // 安灯分类
    dataType: 'LMDS.ANDON_DATA_COLLECT_TYPE', // 数据采集类型
    andonRule: 'LMDS.ANDON_RULE', // 安灯响应规则
    responseRank: 'LMDS.ANDON_RESPONSE_RANK', // 响应等级
    defaultStatus: 'LMDS.ANDON_STATUS', // 默认状态
    relatedType: 'LMDS.ANDON_REL_TYPE', // 关联类型
  },
  lmdsAndonRank: {
    adonRankType: 'LMDS.ANDON_RANK_TYPE', // 安灯等级类型
  },
  lmdsAndonRule: {
    andonRuleType: 'LMDS.ANDON_RULE_TYPE', // 安灯规则类型
    andonRank: 'LMDS.ANDON_RANK', // 安灯等级
  },
  lmdsAndonBin: {
    andonBinType: 'LMDS.ANDON_BIN_TYPE', // 安灯灯箱类型
  },
  lmdsOrgAndRelation: {
    orgRelationType: 'LMDS.ORGANIZATION_RELATION_TYPE', // 组织关系类型
  },
  lmdsRuleAssign: {
    rule: 'LMDS.RULE', // 规则
    category: 'LMDS.ITEM_CATEGORY', // 物料类别
  },
  lmdsItem: {
    itemType: 'LMDS.ITEM_TYPE', // 物料类型
    hazardClass: 'LMDS.HAZARD_CLASS', // 危险品标识
    itemScmType: 'LMDS.ITEM_SCM_TYPE', // 物料采购类型
    scmCategory: 'LMDS.ITEM_SCM_CATEGORY', // 物料采购类别
    scmPlanRule: 'LMDS.SCM_PLAN_RULE', // 供应链计划规则
    itemMeType: 'LMDS.ITEM_ME_TYPE', // 物料制造类型
    supplyType: 'LMDS.SUPPLY_TYPE', // 供应类型
    lotControlType: 'LMDS.LOT_CONTROL_TYPE', // 批次控制类型
    issueControlType: 'LMDS.ISSUE_CONTROL_TYPE', // 投料限制类型
    completeControlType: 'LMDS.COMPLETE_CONTROL_TYPE', // 完工限制类型
    itemApsType: 'LMDS.ITEM_APS_TYPE', // 物料计划类型
    planCode: 'LMDS.PLAN_ITEM', // 计划物料编码
    resourceRule: 'LMDS.RESOURCE_RULE', // 资源分配规则
    safetyStockMethod: 'LMDS.SAFETY_STOCK_METHOD', // 安全库存法
    itemWmType: 'LMDS.ITEM_WM_TYPE', // 物料仓储类型
    wmCategory: 'LMDS.ITEM_WM_CATEGORY', // 物料仓储类别
    abcType: 'LMDS.ABC_TYPE', // ABC类型
    lotControl: 'LMDS.LOT_CONTROL', // 序列/批次控制
    expireControlType: 'LMDS.EXPIRE_CONTROL_TYPE', // 有效期控制类型
    itemSopType: 'LMDS.ITEM_SOP_TYPE', // 物料销售类型
    sopCategory: 'LMDS.ITEM_SOP_CATEGORY', // 物料销售类别
    sopPlanRule: 'LMDS.SOP_PLAN_RULE', // 销售计划规则
    priceList: 'LMDS.PRICE_LIST', // 价目表
    receiveRule: 'LMDS.RECEIVE_RULE', // 接收入库规则
    makeBuy: 'LMDS.ITEM_MAKE_BUY', // 自制外购属性
    receiveToleranceType: 'LMDS.RECEIVE_TOLERANCE_TYPE', // 收货允差类型
    supplierItem: 'LMDS.SUPPLIER_ITEM', // 供应商物料
    customerItem: 'LMDS.CUSTOMER_ITEM', // 客户物料
    customer: 'LMDS.CUSTOMER', // 客户
  },
  lmdsInspectionGroup: {
    inspectionGroupType: 'LMDS.INSPECTION_GROUP_TYPE', // 检验组类型
    inspectionGroupCategory: 'LMDS.INSPECTION_GROUP_CATEGORY', // 检验组类别
    inspectionItem: 'LMDS.INSPECTION_ITEM', // 检验组
  },
  lmdsdocumentType: {
    documentClass: 'LMDS.DOCUMENT_CLASS', // 单据类型
    numberRule: 'LMDS.DOCUMENT_NUMBER_RULE', // 单据规则
    docProcessRule: 'LMDS.RULE', // 单据处理规则
    approvalRule: 'LMDS.APPROVAL_RULE', // 审批策略
    approvalWorkFlow: 'HWFP.PROCESS_DEFINITION', // 审批工作流
  },
  lmdsmoveType: {
    wmType: 'LMDS.WM_TYPE', // 移动类别
    wmMoveClass: 'LMDS.WM_MOVE_CLASS', // 移动类型
    eventType: 'LMDS.EVENT_TYPE', // 事件类型
    transactionType: 'LMDS.TRANSACTION_TYPE', // 事务类型
    department: 'HPFM.UNIT.DEPARTMENT ', // 部门
    warehouse: 'LMDS.WAREHOUSE', // 工厂
    wmArea: 'LMDS.WM_AREA', // 工作区间
    workcell: 'LMDS.WORKCELL', // 工位
  },
  lmdsApsGroup: {
    planPhaseType: 'LMDS.APS_PLAN_PHASE_TYPE', // 区间类型
    planBase: 'LMDS.APS_PLAN_BASE', // 排程类型
    basicAlgorithm: 'LMDS.APS_BASIC_ALGORITHM', // 基础算法
    extendedAlgorithm: 'LMDS.APS_EXTENDED_ALGORITHM', // 扩展算法
    resourceRule: 'LMDS.APS_RESOURCE_RULE', // 资源分配规则
  },
  lmdssopGroup: {
    sopOu: 'LMDS.SOP_OU', // 销售中心
  },
  lmdsSupplier: {
    supplierRank: 'LMDS.SUPPLIER_RANK', // 供应商等级
    supplierCategory: 'LMDS.SUPPLIER_CATEGORY', // 供应商类别
    supplierStatus: 'LMDS.SUPPLIER_STATUS', // 供应商状态
    paymentDeadline: 'LMDS.SUPPLIER_PAYMENT_DEADLINE', // 付款期限
    paymentMethod: 'LMDS.SUPPLIER_PAYMENT_METHOD', // 付款方式
    supplierSiteType: 'LMDS.SUPPLIER_SITE_TYPE', // 地点类别
    supplierSiteStatus: 'LMDS.SUPPLIER_SITE_STATUS', // 地点状态
  },
  lmdsAndonException: {
    andonClass: 'LMDS.ANDON_CLASS', // 安灯分类
    andon: 'LMDS.ANDON', // 安灯
    exceptionGroup: 'LMDS.EXCEPTION_GROUP', // 异常组
  },
  lmdsCollector: {
    collectorType: 'LMDS.COLLECTOR_TYPE', // 收集项类型
    collectorRule: 'LMDS.COLLECTOR_RULE', // 收集方法
    contextType: 'LMDS.COLLECTOR_CONTEXT_TYPE', // 明细类别
  },
  lmdsCutter: {
    relationType: 'LMDS.CUTTER_TYPE', // 刀具类型
    cutterBody: 'LMDS.CUTTER_URL', // 刀体
    category: 'LMDS.CUTTER_CATEGORY', // 刀具类别
    cutterStatus: 'LMDS.CUTTER_STATUS', // 刀具状态
    BOM: 'LMDS.CUTTER_BOM', // 刀具BOM
    prodLine: 'LMDS.PRODLINE', // 生产线
    equipment: 'LMDS.EQUIPMENT', // 设备
    workcell: 'LMDS.WORKCELL', // 工位
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    wmUnit: 'LMDS.WM_UNIT', // 货格
  },
  lmdsQualification: {
    qualificationType: 'LMDS.QUALIFICATION_TYPE', // 资质类型
    qualificationLevel: 'LMDS.QUALIFICATION_LEVEL', // 资质等级
    sourceType: 'LMDS.QUALIFICATION_LINE_SOURCE', // 来源类型
    performanceLevel: 'LMDS.QUALIFICATION_PERFORMANCE', // 熟练等级
    sourceTypeAssign: 'LMDS.QUALIFICATION_ASSIGN_SOURCE', // 分配来源类型
  },
  lmdsTools: {
    toolType: 'LMDS.TOOL_TYPE ', // 工装类型
    category: 'LMDS.TOOL_CATEGORY', // 工装类别
    toolStatus: 'LMDS.TOOL_STATUS', // 工装状态
    BOM: 'LMDS.TOOL_BOM', // 工装BOM
    prodLine: 'LMDS.PRODLINE', // 生产线
    equipment: 'LMDS.EQUIPMENT', // 设备
    workcell: 'LMDS.WORKCELL', // 工位
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    wmUnit: 'LMDS.WM_UNIT', // 货格
  },
  lmdsItemRouting: {
    routing: 'LMDS.ROUTING', // 工艺路线
  },
  lmdsGauge: {
    gaugeType: 'LMDS.GAUGE_TYPE', // 量具类型
    gaugeCategory: 'LMDS.GAUGE_CATEGORY', // 量具类别
    gaugeStatus: 'LMDS.GAUGE_STATUS', // 量具状态
    bom: 'LMDS.GAUGE_BOM', // 量具Bom
  },
  lmdsOperation: {
    operationCategory: 'LMDS.OPERATION_CATEGORY', // 工序类别
    operationType: 'LMDS.OPERATION_TYPE', // 工序类型
    item: 'LMDS.ITEM', // 物料编码
    collector: 'LMDS.COLLECTOR', // 数据收集
    executeRule: 'LMDS.EXECUTE_RULE', // 执行规则
    inspectionRule: 'LMDS.INSPECTION_RULE', // 检验规则
    dispatchRule: 'LMDS.DISPATCH_RULE', // 派工规则
    packingRule: 'LMDS.PACKING_RULE', // 打包规则
    reworkRule: 'LMDS.REWORK_RULE', // 返工规则
    resourceGroup: 'LMDS.RESOURCE_GROUP', // 资源组
    resource: 'LMDS.RESOURCE', // 资源
    operationStepType: 'LMDS.OPERATION_STEP_TYPE', // 步骤类型
    bomLine: 'LMDS.BOM_COMPONENT', // BOM行号
    bom: 'LMDS.BOM', // BOM
    componentItem: 'LMDS.ITEM', // 组件物料
  },
  lmdsSpareParts: {
    sparePartType: 'LMDS.SPARE_PARTS_TYPE', // 备品备件类型
    planRule: 'LMDS.SPARE_PRAT_PLAN_RULE', // 计划规则
    sparePartCategory: 'LMDS.SPARE_PARTS_CATEGORY', // 备品备件类别
    lotControlType: 'LMDS.SPARE_PARTS_LOT_CONTROL_TYPE', // 批次控制类型
  },
  lmdsLocation: {
    locationType: 'LMDS.LOCATION_TYPE', // 地理位置类型
  },
  lmdsRouting: {
    routingType: 'LMDS.ROUTING_TYPE', // 工艺路线类型
    collector: 'LMDS.COLLECTOR', // 数据收集
    resourceGroup: 'LMDS.RESOURCE_GROUP', // 资源组
    stepType: 'LMDS.OPERATION_STEP_TYPE', // 步骤类型
  },
  lmdsPeriod: {
    periodType: 'LMDS.PERIOD_TYPE', // 时段类型
  },
  lmdsApsSwithTime: {
    switchType: 'LMDS.APS_SWITCH_TIME_TYPE', // 关系类型
    // category: 'LMDS.ITEM_APS_CATEGORY', // 计划类别
  },
  lmdsApsResource: {
    apsGroup: 'LMDS.APS_GROUP', // 计划组
    apsResourceType: 'LMDS.APS_RESOURCE_TYPE', // 计划资源类型
    category: 'LMDS.APS_RESOURCE_CATEGORY', // 计划资源类别
  },
  lmdsAPSResourceRelation: {
    apsOu: 'LMDS.APS_OU', // 计划中心
    relationType: 'LMDS.APS_RESOURCE_REL_TYPE', // 关系类型
    resource: 'LMDS.APS_RESOURCE', // 资源
    // category: 'LMDS.ITEM_APS_CATEGORY', // 类别
    item: 'LMDS.ITEM_APS', // 物料
  },
  lmdsResourceBom: {
    resourceBomType: 'LMDS.RESOURCE_BOM_TYPE', // BOM类型
    resource: 'LMDS.RESOURCE', // 资源
    supplier: 'LMDS.SUPPLIER', // 供应商
  },
  lmdsContainer: {
    containerType: 'LMDS.CONTAINER_TYPE', // 容器类型
    container: 'LMDS.CONTAINER', // 容器
    category: 'LMDS.CONTAINER_CATEGORY', // 类别
    containerStatus: 'LMDS.CONTAINER_STATUS', // 容器状态
    bom: 'LMDS.RESOURCE_BOM', // BOM
    prodLine: 'LMDS.PRODLINE', // 生产线
    equipment: 'LMDS.EQUIPMENT', // 设备
    workcell: 'LMDS.WORKCELL', // 工位
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    wmUnit: 'LMDS.WM_UNIT', // 货格
  },
  lmdsCustomerItem: {
    sopItem: 'LMDS.ITEM_SOP', // 销售物料
    customer: 'LMDS.CUSTOMER', // 客户
    salesChannel: 'LMDS.SALES_CHANNEL', // 销售渠道
    salesBrand: 'LMDS.SALES_BRAND', // 销售品牌
    sopPlanRule: 'LMDS.SOP_PLAN_RULE', // 销售计划规则
  },
  lmdsItemAsl: {
    item: 'LMDS.ITEM_SCM', // 物料
    supplier: 'LMDS.SUPPLIER', // 供应商
    supplierSite: 'LMDS.SUPPLIER_SITE', // 供应商地点
    uom: 'LMDS.UOM', // 单位
    supplyType: 'LMDS.ASL_SUPPLY_TYPE', // 供应类型
    supplySource: 'LMDS.ASL_SUPPLY_SOURCE', // 供应来源
    calendar: 'LMDS.CALENDAR', // 供货日历
    receiveRule: 'LMDS.RECEIVE_RULE', // 接收规则
  },
  lmdsPsiElementAssign: {
    assignType: 'LMDS.PSI_ASSIGN_TYPE', // 分配类型
    source: 'LMDS.PSI_ASSIGN_SOURCE', // 来源
    psiElement: 'LMDS.PSI_ELEMENT', // psi要素
    displayArea: 'LMDS.PSI_DISPLAY_AREA', // 显示区域
  },
  inspectionTemplate: {
    templateType: 'LMDS.INSPECTION_TEMPLATE_TYPE', // 模板类型
    inspectorGroup: 'LMDS.WORKER_GROUP', // 检验员组
    inspectionGroupType: 'LMDS.INSPECTION_GROUP', // 检验组
    routingOperation: 'LMDS.ROUTING_OPERATION', // 工艺路线工序
    inspectionResource: 'LMDS.INSPECTION_RESOURCE', // 检测工具
    samplingType: 'LMDS.INSPECTION_SAMPLING_TYPE', // 抽样类型
    samplingStandard: 'LMDS.INSPECTION_SAMPLING_STANDARD', // 抽样标准
    frequencyType: 'LMDS.INSPECTION_FREQUENCY_TYPE', // 频率类型
  },
  resourceTpm: {
    resourceTpmType: 'LMDS.RESOURCE_TPM_TYPE', // TPM类型
    tpmFrequency: 'LMDS.RESOURCE_TPM_FREQUENCY', // TPM频率
    documentType: 'LMDS.DOCUMENT_TYPE', // TPM 类型
  },
  lmdsTransaction: {
    document: 'LMDS.DOCUMENT', // 单据
  },
  lmdsResourceTracking: {
    trackType: 'LMDS.TRACK_TYPE', // 跟踪类型
    resourceClass: 'LMDS.RESOURCE_CLASS', // 资源分类
  },
  lmdsFeeder: {
    feederType: 'LMDS.FEEDER_TYPE', // 飞达类型
    feederStatus: 'LMDS.FEEDER_STATUS', // 飞达状态
    ownType: 'LMDS.OWNER_TYPE', // 所有者类型
    feederTrolley: 'LMDS.FEEDER_TROLLEY', // 飞达料车
  },
  lmdsFeederTrolley: {
    trolleyType: 'LMDS.TROLLEY_TYPE', // 料车类型
    trolleyStatus: 'LMDS.TROLLEY_STATUS', // 料车状态
  },
  lmdsSmd: {
    mountSide: 'LMDS.SMT_PCB_MOUNT_SIDE', // 贴片面
    mountMethod: 'LMDS.SMT_MOUNT_METHOD', // 贴片方式
    prepareMethod: 'LMDS.SMT_PREPARE_METHOD', // 备料方式
    mounterPosition: 'LMDS.SMT_MOUNTER_POSITION', // 设备方位
  },
  lmdsUnitPrice: {
    workPriceType: 'LMDS.WORK_PRICE_TYPE', // 单价类型
  },
  lmdsItemKittingSet: {
    reviewType: 'LMDS.KITTING_REVIEW_TYPE', // 检查类型
    reviewRule: 'LMDS.KITTING_REVIEW_RULE', // 齐套规则
    lineType: 'LMDS.KITTING_LINE_TYPE', // 类型
    supplyType: 'LMDS.KITTING_SUPPLY_TYPE', // 供应类型
    kittingType: 'LMDS.KITTING_TYPE', // 齐套类型
  },
  newayLov: {
    moNum: 'LMES.NP_MO', // 工单号
    documentType: 'LMDS.DOCUMENT_TYPE', // 单据类型
    operation: 'LMES.NP_OPERATION', // 工序
    costCenter: 'LMDS.COST_CENTER_CODE', // 成本中心
    sourceDocNum: 'LMES.MO', // 来源生产订单号
    requestNum: 'LWMS.PRODUCTION_REQUEST', // 入库单号
  },
  newayValue: {
    moStatus: 'LMES.MO_STATUS',
    requestStatus: 'LWMS.PRODUCTION_REQUEST_STATUS', // 入库单状态
  },
  lmesMoWorkspace: {
    moStatus: 'LMES.MO_STATUS', // MO状态
    planRule: 'LMES.MO_PLAN_RULE', // 计划规则
    capacityType: 'LMDS.CAPACITY_TYPE', // 能力类型
    referenceType: 'LMES.MO_REFERENCE_TYPE', // 参考类型
    executeStatus: 'LMES.MO_EXECUTE_STATUS', // 执行状态
    demandRank: 'LSOP.DEMAND_RANK', // 需求等级
    completeControlType: 'LMDS.COMPLETE_CONTROL_TYPE', // 完工限制类型
  },
  lmesTask: {
    taskStatus: 'LMES.TASK_STATUS', // 任务状态
    itemType: 'LMES.TASK_ITEM_TYPE', // 类型
    steptype: 'LMES.TASK_STEP_TYPE', // 步骤类型
    taskRank: 'LMES.TASK_RANK', // 任务等级
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
