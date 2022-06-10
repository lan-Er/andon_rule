/*
 * @module: 德禄项目-子模块
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-04 20:03:53
 * @LastEditTime: 2021-06-24 16:39:09
 * @copyright: Copyright (c) 2020,Hand
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/hlos-raumplus-report/shortage-report', // 缺料报表
    component: () => import('../routers/ShortageReport'),
  },
  {
    path: '/hlos-raumplus-report/material-requirements-report', // 物料需求报表
    component: () => import('../routers/MaterialRequirementsReport'),
  },
  {
    path: '/raumplus/ship-platform', // 发货单平台
    components: [
      {
        path: '/raumplus/ship-platform/list',
        component: () => import('../routers/ShipPlatform/list'),
        models: ['ShipPlatformModel'],
      },
      {
        path: '/raumplus/ship-platform/create/normal',
        component: () => import('../routers/ShipPlatform/detail/normal'),
      },
    ],
  },
  {
    path: '/raumplus/other-warehousing', // 其他出入库平台
    components: [
      {
        path: '/raumplus/other-warehousing/list',
        component: () => import('../routers/OtherWarehousing/list'),
        models: [],
      },
      {
        path: '/raumplus/other-warehousing/detail',
        component: () => import('../routers/OtherWarehousing/detail'),
      },
      {
        path: '/raumplus/other-warehousing/print',
        component: () => import('../routers/OtherWarehousing/myPrint'),
      },
    ],
  },
  {
    path: '/raumplus/finished-goods-inventory', // 成品库存
    components: [
      {
        path: '/raumplus/finished-goods-inventory/index',
        component: () => import('../routers/FinishedGoodsInventory'),
        models: [],
      },
    ],
    authorized: true,
  },
  {
    path: '/raumplus/ticket-report', // 发货单报表
    components: [
      {
        path: '/raumplus/ticket-report/list',
        component: () => import('../routers/TicketReport'),
      },
      {
        path: '/raumplus/ticket-report/print',
        component: () => import('../routers/TicketReport/print'),
      },
    ],
  },
  {
    path: '/raumplus/issue-request-execute', // 领料执行
    title: '领料执行',
    models: ['issueRequestExecute'],
    components: [
      {
        path: '/raumplus/issue-request-execute/list', // 领料执行
        component: () => import('../routers/IssueRequestExecute/item'),
        models: ['issueRequestExecute'],
      },
      {
        path: '/raumplus/issue-request-execute/print/:templateCode',
        component: () => import('../routers/IssueRequestExecute/print'),
        models: ['issueRequestExecute'],
        // packages/hlos-front-raumplus/src/routers/IssueRequestExecute/print
      },
    ],
    authorized: true,
  },
  {
    path: '/pub/raumplus/issue-request-execute/pick', // 领料执行 - 捡料
    component: () => import('../routers/IssueRequestExecute/pick'),
    models: ['issueRequestExecute'],
    authorized: true,
  },
  {
    path: '/pub/raumplus/nonconforming-processing', // 不合格品处理
    component: () => import('../routers/NonconformingProcessing'),
    models: ['nonconformingProcessingModel'],
    authorized: true,
  },
  {
    path: '/raumplus/exception-handle-order', // 异常处理订单
    components: [
      {
        path: '/raumplus/exception-handle-order/list',
        component: () => import('../routers/ExceptionHandleOrder'),
      },
      {
        path: '/raumplus/exception-handle-order/detail',
        component: () => import('../routers/ExceptionHandleOrder/detail/detail'),
      },
      {
        path: '/raumplus/exception-handle-order/detail/:invAbnormalId',
        component: () => import('../routers/ExceptionHandleOrder/detail/detail'),
      },
    ],
    authorized: true,
    title: '异常处理订单',
  },
  {
    path: '/raumplus/incoming-inspection-report', // 入料检验数据分析记录表
    authorized: true,
    component: () => import('../routers/IncomingInspectionReport'),
    title: '入料检验数据分析记录表',
  },
  {
    path: '/raumplus/unqualified-data-report',
    authorized: true,
    component: () => import('../routers/UnqualifiedDataReport'),
    title: '不合格处理数据分析记录表',
  },
  {
    path: '/raumplus/warehouse-execution-details/list', // 仓库执行明细
    component: () => import('../routers/WarehouseExecutionDetails'),
    authorized: true,
    title: '仓库执行明细',
  },
  {
    path: '/raumplus/on-hand-qty/list', // 现有量查询
    component: () => import('../routers/OnhandQty'),
    authorized: true,
    title: '现有量查询',
  },
  {
    path: '/raumplus/production-picking-board/list', // 生产领料看板
    component: () => import('../routers/ProductionPickingBoard'),
  },
  {
    path: '/raumplus/inspection-judgment', // 检验判定
    component: () => import('../routers/InspectionJudgment'),
    models: [() => import('../models/inspectionJudgementModel.js')],
  },
  {
    path: '/pub/raumplus/inspection-judgment/execute', // 检验判定执行页面
    component: () => import('../routers/InspectionJudgment/execute'),
    authorized: true,
  },
  {
    path: '/raumplus/in-stock-inspection', // 在库检验
    component: () => import('../routers/InStockInspection'),
    models: [() => import('../models/inStockInspectionModel.js')],
  },
  {
    path: '/pub/raumplus/in-stock-inspection/execute', // 在库检验
    component: () => import('../routers/InStockInspection/execute'),
    authorized: true,
  },
  {
    path: '/raumplus/inventory-platform', // 盘点平台
    title: '盘点平台DL',
    components: [
      {
        path: '/raumplus/inventory-platform/list',
        component: () => import('../routers/InventoryPlatform/list'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/raumplus/inventory-platform/create',
        component: () => import('../routers/InventoryPlatform/detail/create-and-edit'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/raumplus/inventory-platform/edit/:countId',
        component: () => import('../routers/InventoryPlatform/detail/create-and-edit'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/raumplus/inventory-platform/detail/:countId',
        component: () => import('../routers/InventoryPlatform/detail/details'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/raumplus/inventory-platform/adjustment/:countId',
        component: () => import('../routers/InventoryPlatform/detail/adjustment'),
        models: ['inventoryPlatformModel'],
      },
    ],
    authorized: true,
  },
];

export default config;
