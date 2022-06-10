import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

// @ts-ignore
const config: RoutersConfig = [
  {
    path: '/himp/commentImport/:code',
    component: '.../routes/CommonImport/CommonImport',
    authorized: true,
  },
  {
    path: '/lmes/component-technology-bom',
    component: () => import('../routes/ComponentTechnologyBOM/list'),
  },
  {
    path: '/lmes/mo-workspace', // Mo工作台
    components: [
      {
        path: '/lmes/mo-workspace/list',
        component: () => import('../routes/MoWorkspace/list'),
        models: [() => import('../models/moWorkspaceModel.js')],
      },
      {
        path: '/lmes/mo-workspace/create',
        component: () => import('../routes/MoWorkspace/detail'),
      },
      {
        path: '/lmes/mo-workspace/detail/:ownerOrganizationId/:moId',
        component: () => import('../routes/MoWorkspace/detail'),
      },
      {
        path: '/lmes/mo-workspace/print',
        component: () => import('../routes/MoWorkspace/myPrint'),
        models: [() => import('../models/moWorkspaceModel')],
      },
      // {
      //   path: '/lmes/mo-workspace/print/:templateCode',
      //   component: () => import('../routes/Print'),
      // },
    ],
  },
  {
    path: '/lmes/mo-component', // Mo组件
    component: () => import('../routes/MoComponent'),
  },
  {
    path: '/lmes/inspection-document', // 检验单平台
    component: () => import('../routes/InspectionDocument'),
  },
  {
    path: '/lmes/andon-journal', // 安灯履历
    component: () => import('../routes/AndonJournal'),
  },
  {
    path: '/lmes/mo-operation', // Mo工序
    components: [
      {
        path: '/lmes/mo-operation/list',
        component: () => import('../routes/MoOperation/list'),
      },
      // {
      //   path: '/lmes/mo-operation/create',
      //   component: () => import('../routes/MoOperation/detail',
      // },
      // {
      //   path: '/lmes/mo-operation/detail/:moOperationId',
      //   component: () => import('../routes/MoOperation/detail',
      // },
    ],
  },
  {
    path: '/lmes/mo-production-destock', // Mo生产退库
    component: () => import('../routes/MoProductionDestock'),
  },
  {
    path: '/lmes/andon-signboard', // 安灯看板
    component: () => import('../routes/AndonSignboard'),
  },
  {
    path: '/lmes/andon-statistic', // 安灯统计
    component: () => import('../routes/AndonStatistic'),
    models: [() => import('../models/andonStatisticModel.js')],
  },
  {
    path: '/lmes/tpm-task', // TPM任务
    component: () => import('../routes/TpmTask/list'),
  },
  {
    path: '/lmes/production-task', // 生产任务
    components: [
      {
        path: '/lmes/production-task/list',
        component: () => import('../routes/ProductionTask/list'),
        models: [() => import('../models/productionTaskModel.js')],
      },
      {
        path: '/lmes/production-task/create',
        component: () => import('../routes/ProductionTask/detail'),
      },
      {
        path: '/lmes/production-task/detail/:taskId',
        component: () => import('../routes/ProductionTask/detail'),
      },
    ],
  },
  {
    path: '/lmes/production-execution', // 生产执行明细
    component: () => import('../routes/ProductionExecution'),
  },
  {
    path: '/lmes/component-report', // 构件报工报表
    component: () => import('../routes/ComponentReport'),
  },
  {
    path: '/lmes/inspection-judgment', // 检验判定
    component: () => import('../routes/InspectionJudgment'),
    models: [() => import('../models/inspectionJudgementModel.js')],
  },
  {
    path: '/pub/lmes/inspection-judgment/execute', // 检验判定执行页面
    component: () => import('../routes/InspectionJudgment/execute'),
    authorized: true,
  },
  {
    path: '/pub/lmes/iqc-application-inspection', // IQC报检
    component: () => import('../routes/IqcApplicationInspection'),
    authorized: true,
  },
  {
    path: '/lmes/iqc-inspection', // IQC检验
    component: () => import('../routes/IqcInspection'),
  },
  {
    path: '/pub/lmes/pqc-inspection', // PQC报检
    component: () => import('../routes/PqcInspection'),
    authorized: true,
  },
  {
    path: '/pub/lmes/task-report', // 任务报工
    component: () => import('../routes/TaskReport'),
    models: [() => import('../models/taskReportModel.js')],
    authorized: true,
  },
  {
    path: '/pub/lmes/report-performance', // 任务报工/批量报工员工实绩
    component: () => import('../routes/Performance'),
    authorized: true,
  },
  {
    path: '/pub/lmes/mo-report', // MO报工
    component: () => import('../routes/MoReport'),
  },
  {
    path: '/pub/lmes/pqc-site-inspection', // PQC巡检
    component: () => import('../routes/PqcOnSiteInspection'),
    authorized: true,
  },
  {
    path: '/lmes/resource-plan', // 资源计划
    components: [
      {
        path: '/lmes/resource-plan/list',
        component: () => import('../routes/ResourcePlan/List'),
        models: [() => import('../models/resourcePlanModel')],
      },
      {
        path: '/lmes/resource-plan/config',
        component: () => import('../routes/ResourcePlan/Detail'),
      },
    ],
  },
  {
    path: '/lmes/equipment-inspection', // 设备点检
    authorized: true,
    components: [
      {
        path: '/lmes/equipment-inspection/list',
        component: () => import('../routes/EquipmentInspection'),
      },
      {
        path: '/lmes/equipment-inspection/create',
        component: () => import('../routes/EquipmentInspection/create'),
      },
    ],
  },
  {
    path: '/pub/lmes/equipment-inspection/execute', // 设备点检执行页面
    component: () => import('../routes/EquipmentInspection/execute'),
    authorized: true,
  },
  {
    path: '/lmes/equipment-monitor', // 设备监控
    component: () => import('../routes/EquipmentMonitor'),
    models: [() => import('../models/equipmentMonitorModel.js')],
  },
  {
    path: '/pub/lmes/team-management', // 班组管理
    component: () => import('../routes/TeamManagement'),
    authorized: true,
    title: '班组管理',
  },
  {
    path: '/pub/lmes/nonconforming-processing', // 不合格品处理
    component: () => import('../routes/NonconformingProcessing'),
    models: [() => import('../models/nonconformingProcessingModel.js')],
    authorized: true,
  },
  // {
  //   path: '/lmes/employee-performance', // 员工实绩
  //   component: () => import('../routes/EmployeePerformance'),
  //   authorized: true,
  //   title: '员工实绩',
  // },
  {
    path: '/lmes/employee-performance', // 员工实绩
    components: [
      {
        path: '/lmes/employee-performance/list',
        component: () => import('../routes/EmployeePerformance'),
      },
      {
        path: '/lmes/employee-performance/confirm',
        // component: () => import('../routes/EmployeePerformance/confirm'),
        component: () => import('../routes/EmployeePerformance/confirmPage'),
      },
    ],
  },
  {
    path: '/lmes/spareparts-onhand', // 备件现有量
    component: () => import('../routes/SparePartsOnhand'),
  },
  {
    path: '/lmes/spareparts-monitor', // 备件监控
    component: () => import('../routes/SparePartsMonitor'),
  },
  {
    path: '/lmes/cutter-dashboard', // 刀具监控
    component: () => import('../routes/CutterDashboard'),
  },
  {
    path: '/pub/lmes/andon-trigger', // 安灯触发
    component: () => import('../routes/AndonTrigger'),
    authorized: true,
  },
  {
    path: '/pub/lmes/andon-close', // 安灯响应与关闭
    component: () => import('../routes/AndonClose'),
    authorized: true,
  },
  {
    path: '/pub/lmes/andon-response', // 安灯响应
    component: () => import('../routes/AndonResponse'),
    authorized: true,
  },
  {
    path: '/pub/lmes/andon-shut', // 安灯关闭
    component: () => import('../routes/AndonShut'),
    authorized: true,
  },
  {
    path: '/lmes/mo-workspace-a', // Mo工作台A
    components: [
      {
        path: '/lmes/mo-workspace-a/list',
        component: () => import('../routes/MoWorkspaceA/list'),
      },
      {
        path: '/lmes/mo-workspace-a/create',
        component: () => import('../routes/MoWorkspaceA/detail'),
      },
      {
        path: '/lmes/mo-workspace-a/detail/:ownerOrganizationId/:moId',
        component: () => import('../routes/MoWorkspaceA/detail'),
      },
    ],
  },
  {
    path: '/pub/lmes/one-piece-flow-report', // 单件流报工
    component: () => import('../routes/OnePieceFlowReport'),
    models: [() => import('../models/onePieceFlowReportModel')],
    authorized: true,
  },
  {
    path: '/pub/lmes/nonproduction-tasks-report', // 非生产任务报工
    component: () => import('../routes/NonproductionTasksReport/index'),
    authorized: true,
    models: [() => import('../models/nonproductionTaskReportModel')],
  },
  {
    path: '/lmes/non-production-task', // 非生产任务
    components: [
      {
        path: '/lmes/non-production-task/list',
        component: () => import('../routes/NonProductionTask/list'),
        models: [() => import('../models/npTaskModel')],
      },
      {
        path: '/lmes/non-production-task/create',
        component: () => import('../routes/NonProductionTask/detail'),
      },
      {
        path: '/lmes/non-production-task/detail/:taskId',
        component: () => import('../routes/NonProductionTask/detail'),
      },
      {
        path: '/lmes/non-production-task/batch-create',
        component: () => import('../routes/NonProductionTask/create'),
      },
    ],
  },
  {
    path: '/lmes/rework-platform', // 返修平台
    components: [
      {
        path: '/lmes/rework-platform/list',
        component: () => import('../routes/ReworkPlatform/list'),
      },
      {
        path: '/lmes/rework-platform/create',
        component: () => import('../routes/ReworkPlatform/create'),
      },
    ],
  },
  {
    path: '/lmes/sales-mo-create', // 创建销售MO
    component: () => import('../routes/SalesMoCreate'),
  },
  {
    path: '/lmes/in-process-management', // 在制管理
    component: () => import('../routes/InProcessManagement'),
  },
  {
    path: '/lmes/process-outsource-platform', // 工序外协平台
    components: [
      {
        path: '/lmes/process-outsource-platform/list',
        component: () => import('../routes/ProcessOutsourcePlatform/list'),
      },
      {
        path: '/lmes/process-outsource-platform/create',
        component: () => import('../routes/ProcessOutsourcePlatform/detail'),
      },
    ],
  },
  {
    path: '/pub/lmes/po-precheck', // po预检
    component: () => import('../routes/PoPrecheck'),
    authorized: true,
  },
  {
    path: '/pub/lmes/batch-report', // 批量报工
    component: () => import('../routes/BatchReport'),
    models: [() => import('../models/batchReportModel.js')],
    authorized: true,
  },
  {
    path: '/pub/lmes/offline-split', // 线下拆板
    component: () => import('../routes/OfflineSplit'),
    authorized: true,
  },
  {
    path: '/lmes/oqc-inspection', // OQC检验
    component: () => import('../routes/OqcInspection'),
    authorized: true,
  },
  {
    path: '/pub/lmes/oqc-inspection/execute', // OQC检验
    component: () => import('../routes/OqcInspection/execute'),
    authorized: true,
  },
  {
    path: '/lmes/smd-in-making', // SMD在制
    component: () => import('../routes/SMDInMaking'),
  },
  {
    path: '/lmes/inspection-in-warehouse', // 在库检报检
    component: () => import('../routes/InspectionInWarehouse'),
  },
  {
    path: '/lmes/in-stock-inspection', // 在库检验
    component: () => import('../routes/InStockInspection'),
    models: [() => import('../models/inStockInspectionModel.js')],
    authorized: true,
  },
  {
    path: '/pub/lmes/in-stock-inspection/execute', // 在库检验
    component: () => import('../routes/InStockInspection/execute'),
    authorized: true,
  },
  {
    path: '/pub/lmes/mo-return-material', // MO退料
    component: () => import('../routes/MoReturnMaterial'),
    models: [() => import('../models/moReturnMaterialModel.js')],
    authorized: true,
  },
  {
    path: '/pub/lmes/in-out-furnace-report', // 进出炉报工
    component: () => import('../routes/InOutFurnaceReport'),
    authorized: true,
  },
  {
    path: '/lmes/split-task-logs', // 任务日志
    component: () => import('../routes/SplitTaskLogs'),
  },
  {
    path: '/lmes/product-tracing', // 产品追溯
    component: () => import('../routes/ProductTracing'),
  },
  {
    path: '/pub/lmes/production-scrap', // 生产报废
    component: () => import('../routes/ProductionScrap'),
    authorized: true,
  },
];

export default config;
