/*
 * @module: 纽威项目路由配置
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-16 17:05:34
 * @LastEditTime: 2021-06-07 09:21:30
 * @copyright: Copyright (c) 2020,Hand
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/lmds/neway/routing', // 工艺路线
    authorized: true,
    components: [
      {
        path: '/lmds/neway/routing/list',
        component: () => import('../routes/technology-routing/list'),
      },
      {
        path: '/lmds/neway/routing/create',
        component: () => import('../routes/technology-routing/detail'),
      },
      {
        path: '/lmds/neway/routing/detail/:routingId',
        component: () => import('../routes/technology-routing/detail'),
      },
      {
        path: '/lmds/neway/routing/operation/:routingId/:routingOperationId',
        component: () => import('../routes/technology-routing/operation'),
      },
      {
        path: '/lmds/neway/routing/operation-create/:routingId',
        component: () => import('../routes/technology-routing/operation'),
      },
    ],
  },
  {
    path: '/lmds/neway/inspection-item', // 检验项目
    component: () => import('../routes/global-inspection-item/list'),
  },
  {
    path: '/lmds/neway/inspection-group', // 检验项目组
    components: [
      {
        path: '/lmds/neway/inspection-group/list',
        component: () => import('../routes/global-inspection-group/list'),
      },
      {
        path: '/lmds/neway/inspection-group/create',
        component: () => import('../routes/global-inspection-group/detail'),
      },
      {
        path: '/lmds/neway/inspection-group/detail/:inspectionGroupId',
        component: () => import('../routes/global-inspection-group/detail'),
      },
    ],
  },
  {
    path: '/neway/process-outsource-price', // 工序外协定价
    components: [
      {
        path: '/neway/process-outsource-price/list',
        component: () => import('../routes/process-outsource-price/list'),
        // authorized: true,
      },
    ],
  },
  {
    path: '/neway/dispatch-order-operation', // 派工单工序
    components: [
      {
        path: '/neway/dispatch-order-operation/list',
        component: () => import('../routes/dispatch-order-operation'),
      },
    ],
  },
  {
    path: '/neway/dispatch-order', // 派工单创建
    components: [
      {
        path: '/neway/dispatch-order/list',
        component: () => import('../routes/dispatch-order/index'),
      },
      {
        path: '/neway/dispatch-order/create',
        component: () => import('../routes/dispatch-order/detail'),
      },
      {
        path: '/neway/dispatch-order/detail/:moId',
        component: () => import('../routes/dispatch-order/detail'),
      },
    ],
  },
  // {
  //   path: '/pub/neway/dispatch-order-report', // 派工单报工
  //   components: [
  //     {
  //       path: '/pub/neway/dispatch-order-report/list',
  //       component: () => import('../routes/dispatch-order-report/index'),
  //     },
  //   ],
  // },
  {
    path: '/neway/mo-operation', // MO工序
    components: [
      {
        path: '/neway/mo-operation/list',
        component: () => import('../routes/mo-operation/index'),
      },
      {
        path: '/neway/mo-operation/detail/:moId',
        component: () => import('../routes/mo-operation/detail'),
        // authorized: true,
      },
    ],
  },
  // {
  //   path: '/pub/neway/non-key-operation-report', // 非关键序报工
  //   components: [
  //     {
  //       path: '/pub/neway/non-key-operation-report/list',
  //       component: () => import('../routes/non-key-operation-report/index'),
  //       authorized: true,
  //     },
  //   ],
  // },
  {
    path: '/neway/rework-task-platform', // 返修任务平台
    components: [
      {
        path: '/neway/rework-task-platform/list',
        component: () => import('../routes/rework-task-platform/index'),
      },
      {
        path: '/neway/rework-task-platform/create',
        component: () => import('../routes/rework-task-platform/Create'),
      },
      {
        path: '/neway/rework-task-platform/detail/:moId',
        component: () => import('../routes/rework-task-platform/detail'),
      },
    ],
  },
  {
    path: '/pub/neway/worktime-task-report', // 工时任务报工
    components: [
      {
        path: '/pub/neway/worktime-task-report/list',
        component: () => import('../routes/worktime-task-report/index'),
        authorized: true,
      },
    ],
  },
  {
    path: '/lmes/neway/mo-workspace', // Mo工作台
    authorized: true,
    components: [
      {
        path: '/lmes/neway/mo-workspace/list',
        component: () => import('../routes/MoWorkspace/list'),
        models: [() => import('../models/moWorkspaceModel.js')],
      },
      {
        path: '/lmes/neway/mo-workspace/create',
        component: () => import('../routes/MoWorkspace/detail'),
      },
      {
        path: '/lmes/neway/mo-workspace/detail/:ownerOrganizationId/:moId',
        component: () => import('../routes/MoWorkspace/detail'),
      },
      {
        path: '/lmes/neway/mo-workspace/print',
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
    path: '/neway/finished-storage', // 完工入库单
    components: [
      {
        path: '/neway/finished-storage/list',
        component: () => import('../routes/FinishedStorage/ListPage'),
        models: [() => import('../models/finishedStorageModel.js')],
      },
      {
        path: '/neway/finished-storage/create',
        component: () => import('../routes/FinishedStorage/DetailPage'),
      },
    ],
  },
  {
    path: '/lmes/neway/production-task', // 生产任务
    components: [
      {
        path: '/lmes/neway/production-task/list',
        component: () => import('../routes/ProductionTask/list'),
        models: [() => import('../models/productionTaskModel.js')],
      },
      {
        path: '/lmes/neway/production-task/create',
        component: () => import('../routes/ProductionTask/detail'),
      },
      {
        path: '/lmes/neway/production-task/detail/:taskId',
        component: () => import('../routes/ProductionTask/detail'),
      },
      {
        path: '/lmes/neway/production-task/split-task/:taskId',
        component: () => import('../routes/ProductionTask/SplitTask'),
      },
      {
        path: '/neway/dispatch-platform', // 派工平台
        component: () => import('../routes/DispatchPlatform'),
        authorized: true,
      },
    ],
  },
];

export default config;
