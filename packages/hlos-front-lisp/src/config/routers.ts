import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/lisp/solution-package',
    component: () => import('../routes/SolutionPackage'),
  },
  {
    path: '/lisp/permission-assignment',
    component: () => import('../routes/PermissionAssignment'),
  },
  {
    path: '/lisp/spareparts-onhand',
    component: () => import('../routes/SparePartsOnhand'),
  },
  {
    path: '/lisp/spareparts-monitor',
    component: () => import('../routes/SparePartsMonitor'),
  },
  {
    path: '/lisp/drawing-platform',
    components: [
      {
        path: '/lisp/drawing-platform/list', // 图纸平台
        component: () => import('../routes/DrawingPlatform'),
      },
      {
        path: '/lisp/drawing-platform/history/:code/:version', // 图纸平台历史详情
        component: () => import('../routes/DrawingPlatform/History'),
      },
      {
        path: '/lisp/drawing-platform/detail/:id', // 图纸编辑
        component: () => import('../routes/DrawingPlatform/Detail'),
        title: '图纸编辑',
      },
    ],
  },
  {
    title: '新图纸平台',
    authorized: true,
    path: '/lisp/new-drawing-platform', // 新图纸平台
    component: () => import('../routes/NewDrawingPlatform'),
  },
  {
    path: '/lisp/drawing-query', // 图纸查询
    component: () => import('../routes/DrawingQuery/List'),
  },
  {
    path: '/lisp/die-resume',
    component: () => import('../routes/DieResume'),
  },
  {
    path: '/lisp/equipment-resume',
    component: () => import('../routes/EquipmentResume'),
  },
  {
    path: '/lisp/equipment-monitor',
    component: () => import('../routes/EquipmentMonitor'),
    authorized: true,
  },
  {
    title: '供应商订单确认',
    path: '/lisp/supplier-order-confirmation',
    component: () => import('../routes/SupplierOrderConfirmation'),
  },
  {
    title: '供应商交期回复',
    path: '/lisp/supplier-delivery-response',
    component: () => import('../routes/SupplierDeliveryResponse'),
  },
  {
    title: '供应商交货',
    path: '/lisp/supplier-delivery',
    component: () => import('../routes/SupplierDelivery'),
  },
  {
    title: '质量追溯',
    authorized: true,
    path: '/lisp/quality-traceability',
    component: () => import('../routes/QualityTraceability'),
  },
  {
    title: '供应商完工入库',
    path: '/lisp/finished-storage',
    component: () => import('../routes/FinishedStorage'),
    authorized: true,
  },
  {
    title: '供应总览',
    path: '/lisp/supply-overview',
    component: () => import('../routes/SupplyOverview'),
    authorized: true,
  },
  {
    title: '供应总览新',
    path: '/lisp/supply-overview-new',
    component: () => import('../routes/SupplyOverviewNew'),
    authorized: true,
  },
  // CustomerOverview
  {
    title: '客户协同总览',
    path: '/lisp/customer-overview',
    component: () => import('../routes/CustomerOverview'),
    authorized: true,
  },
  // {
  //   title: '客户协同总览2',
  //   path: '/lisp/customer-overview/1',
  //   component: () => import('../routes/CustomerOverview/index2.js'),
  //   authorized: true,
  // },
  {
    title: '供应商库存明细',
    // path: '/lisp/supplier-inventory-details/:name',
    path: '/lisp/supplier-inventory-details',
    component: () => import('../routes/SupplierInventoryDetails'),
    authorized: true,
  },
  {
    title: '库存明细',
    path: '/lisp/inventory-details',
    component: () => import('../routes/InventoryDetails'),
    authorized: true,
  },
  {
    title: '核企异常订单',
    path: '/lisp/enterprise-abnormal-order/:type',
    component: () => import('../routes/EnterpriseAbnormalOrder'),
    authorized: true,
  },
  {
    title: '供应商异常订单',
    path: '/lisp/supply-abnormal-order/:type',
    component: () => import('../routes/SupplyAbnormalOrder'),
    authorized: true,
  },
  {
    path: '/lisp/supplier-sales-order-details', // 订单详情-供应商
    component: () => import('../routes/SupplierSalesOrderDetails'),
    models: [() => import('../models/salesOrderDetailsModel')],
  },
  {
    path: '/lisp/core-sales-order-details', // 订单详情-核企
    component: () => import('../routes/CoreSalesOrderDetails'),
    models: [() => import('../models/salesOrderDetailsModel')],
  },
  {
    path: '/lisp/order-progress-query',
    component: () => import('../routes/OrderProgressQuery'),
  },
  {
    title: '生产入库',
    path: '/lisp/production-warehousing',
    component: () => import('../routes/ProductionWarehousing'),
  },
  {
    title: '质检结果录入',
    path: '/lisp/quality-result-entry',
    component: () => import('../routes/QualityResultEntry'),
  },
  {
    path: '/lisp/core-sales-order-perform', // 订单执行-核企
    component: () => import('../routes/CoreSalesOrderPerform'),
    models: [() => import('../models/salesOrderPerformModel')],
  },
  {
    path: '/lisp/supplier-sales-order-perform', // 订单执行-供应商
    component: () => import('../routes/SupplierSalesOrderPerform'),
    models: [() => import('../models/salesOrderPerformModel')],
  },
  {
    title: '模具监控',
    path: '/lisp/mold-monitoring',
    component: () => import('../routes/MoldMonitoring'),
    models: [() => import('../models/moldMonitoringModel')],
    authorized: true,
  },
  {
    title: '完工录入',
    path: '/lisp/completion-entry',
    component: () => import('../routes/CompletionEntry'),
  },
  {
    title: 'MO工作台',
    path: '/lisp/mo-table',
    component: () => import('../routes/MoTable'),
    authorized: true,
  },
  {
    title: '核企侧库存查询',
    path: '/lisp/inventory-query',
    component: () => import('../routes/InventoryQuery'),
    authorized: true,
  },
  {
    path: '/lisp/delivery-replay',
    component: () => import('../routes/DeliveryReply'),
  },
  {
    path: '/lisp/statement-create', // 对账单创建
    component: () => import('../routes/StatementCreate'),
  },
  {
    path: '/lisp/statement-confirmation', // 核企对账单确认
    component: () => import('../routes/StatementConfirmation'),
  },
  {
    path: '/lisp/supply-statement-confirmation', // 供应商对账单确认
    component: () => import('../routes/StatementConfirmation'),
  },
  {
    path: '/lisp/purchase-requirement-release', // 采购需求发布-客户侧
    component: () => import('../routes/PurchaseRequirementRelease'),
    models: [() => import('../models/purchaseRequirementModel')],
    authorized: true,
  },
  {
    path: '/lisp/purchase-requirement-confirmation', // 采购需求确认-供应商
    component: () => import('../routes/PurchaseRequirementConfirmation'),
    models: [() => import('../models/purchaseRequirementModel')],
  },
  {
    path: '/lisp/nuclear-enterprise-monitoring-big-screen', // 核企监控大屏
    component: () => import('../routes/NuclearEnterpriseMonitoringBigScreen'),
    models: [() => import('../models/creativeDataLargeScreenModel')],
    title: '核企监控大屏',
    authorized: true,
  },
  {
    path: '/lisp/ship-order',
    component: () => import('../routes/ShipOrder'),
    authorized: true,
    title: '发货单',
    models: [() => import('../models/shipOrderModel')],
  },
  {
    path: '/lisp/delivery-result',
    component: () => import('../routes/DeliveryResult'),
  },
  {
    path: '/lisp/purchase-receipt-confirmation', // 采购接受确认
    component: () => import('../routes/PurchaseReceiptConfirmation'),
    models: [() => import('../models/purchaseReceiptConfirmationModel')],
  },
  {
    path: '/lisp/production-planning',
    component: () => import('../routes/ProductionPlanning'),
    authorized: true,
  },
  {
    path: '/lisp/resource-plan', // 资源计划
    component: () => import('../routes/ResourcePlan'),
    models: [() => import('../models/lispResourcePlanModel')],
  },
  {
    path: '/lisp/quality-inspection-result-enquiry',
    component: () => import('../routes/QualityInspectionResultEnquiry'),
  },
  {
    path: '/lisp/packing-list', // 装箱清单
    component: () => import('../routes/PackingList'),
    authorized: true,
  },
  {
    title: '需求感知补货分析',
    authorized: true,
    path: '/lisp/demand-sensing', // 需求感知补货分析
    component: () => import('../routes/DemandSensing'),
  },
  {
    title: '设备总览监控平台',
    authorized: true,
    path: '/pub/lisp/equipment-overview-monitoring-platform',
    component: () => import('../routes/EquipmentOverviewMonitoringPlatform'),
  },
  {
    title: '设备能耗统计平台',
    path: '/pub/lisp/energy-consumption-statistics', // 设备能耗统计平台
    component: () => import('../routes/EnergyConsumptionStatistics'),
  },
  {
    path: '/lisp/requirement-replenishment', // 需求补货感知平台
    components: [
      {
        path: '/lisp/requirement-replenishment/header',
        component: () => import('../routes/RequirementReplenishment'),
        title: '需求补货平台分析',
      },
      {
        path: '/lisp/requirement-replenishment/line', // 补货订单生成
        component: () => import('../routes/RequirementReplenishmentLine'),
      },
    ],
  },
  {
    title: '刀具监控',
    authorized: true,
    path: '/lisp/cutter-dashboard',
    component: () => import('../routes/CutterDashboard'),
  },
];

export default config;
