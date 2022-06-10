/*
 * @Description: （看板|报表）路由文件
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-11-09 18:32:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-26 17:05:56
 */

import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/ldab/dashboard-config', // 看板配置
    components: [
      {
        path: '/ldab/dashboard-config/list',
        component: 'DashboardConfig/list',
      },
      {
        path: '/ldab/dashboard-config/create',
        component: 'DashboardConfig/detail',
      },
      {
        path: '/ldab/dashboard-config/detail/:dashboardId',
        component: 'DashboardConfig/detail',
      },
      {
        path: '/ldab/production-monitoring-dashboard',
        component: 'ProductionMonitoringDashboard/indexModeal',
        // component: 'ProductionMonitoringDashboard',
        models: [() => import('../models/productionMonitoringDashboardModel')],
        authorized: true,
        title: '生产监控看板',
      },
    ],
  },
  {
    path: '/ldab/interface-config', // 平台接口配置
    components: [
      {
        path: '/ldab/interface-config/list',
        component: 'InterfaceConfig/list',
      },
      {
        path: '/ldab/interface-config/create',
        component: 'InterfaceConfig/detail',
      },
      {
        path: '/ldab/interface-config/detail/:interfaceId',
        component: 'InterfaceConfig/detail',
      },
    ],
  },
  {
    path: '/ldab/interface-log', // 平台接口日志
    component: 'InterfaceLog',
  },
  {
    path: '/ldab/production-tasks',
    component: 'ProductionTasks',
    authorized: true,
    title: '生产看板配置',
    models: [() => import('../models/productionTasksModel')],
  },
  {
    path: '/ldab/production-report',
    component: () => import('../routes/ProductionReport'),
    authorized: true,
    title: '生产报表',
  },
  {
    path: '/ldab/receive-and-store-report',
    component: () => import('../routes/ReceiveAndStoreReport'),
    authorized: true,
    title: '收发存统计报表',
  },
  {
    path: '/ldab/rate-of-finished-products',
    component: () => import('../routes/RateOfFinishedProducts'),
    authorized: true,
    title: '成品合格率',
  },
  {
    path: '/ldab/iqc-statistical-report',
    component: () => import('../routes/IqcStatisticalReport'),
    authorized: true,
    title: 'IQC合格率统计报表',
  },
  {
    path: '/ldab/pqc-statistical-report',
    component: () => import('../routes/PqcStatisticalReport'),
    authorized: true,
    title: 'PQC合格率统计报表',
  },
  {
    path: '/ldab/production-task-progress-report', // 生产任务进度报表
    component: () => import('../routes/ProductTaskProgressReport'),
  },
  {
    path: '/ldab/production-order-progress-report', // 生产订单进度报表
    components: [
      {
        path: '/ldab/production-order-progress-report/list',
        component: () => import('../routes/ProductOrderProgressReport/list'),
      },
      {
        path: '/ldab/production-order-progress-report/detail/:moId',
        component: () => import('../routes/ProductOrderProgressReport/detail'),
      },
    ],
  },
  {
    path: '/pub/ldab/shipment-task', // 发货任务看板
    component: () => import('../routes/ShipmentTaskKanban'),
    models: [() => import('../models/shipmentTaskModel')],
    authorized: true,
    title: '发货任务看板',
  },
  {
    path: '/pub/ldab/picking-board', // 领料看板
    component: () => import('../routes/PickingBoard'),
    models: [() => import('../models/pickingBoardModel')],
    authorized: true,
  },
  {
    path: '/pub/ldab/iqc-quality-inspection-task', // IQC质检任务看板
    component: () => import('../routes/IqcQualityInspectionTask'),
    models: [() => import('../models/qualityInspectionTask')],
    authorized: true,
  },
  {
    path: '/pub/ldab/pqc-quality-inspection-task', // PQC质检任务看板
    component: () => import('../routes/PqcQualityInspectionTask'),
    models: [() => import('../models/qualityInspectionTask')],
    authorized: true,
  },
  {
    path: '/ldab/storage-age-analysis', // 库龄分析报表
    component: () => import('../routes/StorageAgeAnalysis'),
  },
  {
    path: '/ldab/card-board/production-monitoring', // 生产监控看板--卡片配置
    component: () => import('../routes/MyDashboardCard/ProductionMonitoring'),
    models: [() => import('../models/cardWorkplace')],
    authorized: true,
    title: '卡片加载',
  },
  {
    path: '/ldab/employee-hour-statistics', // 员工工时统计报表
    component: () => import('../routes/EmployeeHourStatistic'),
  },
  {
    path: '/ldab/my-tasks-report',
    component: () => import('../routes/MyTask/index'),
  },
  {
    path: '/ldab/equipment-monitoring-board', // 设备监控看板
    component: () => import('../routes/EquipmentMonitoringBoard/index'),
    models: [() => import('../models/equipmentMonitoringModel')],
  },
  {
    path: '/ldab/oee-report/list', // 设备稼动率报表
    component: () => import('../routes/OeeReport'),
  },
  {
    path: '/ldab/completion-rate-report/list', // 加工完成率报表
    component: () => import('../routes/CompletionRateReport'),
  },
];

export default config;
