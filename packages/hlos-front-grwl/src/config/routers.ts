/*
 * @module: 广日1+N
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-22 16:08:07
 * @LastEditTime: 2021-07-06 18:45:21
 * @copyright: Copyright (c) 2020,Hand
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/grwl/create-sales-invoice-platform',
    component: () => import('../routers/CreateSalesInvoicePlatform'),
    models: [() => import('../models/createSalesInvoiceModel')],
  },
  {
    path: '/grwl/ship-platform', // 发货单平台
    components: [
      {
        path: '/grwl/ship-platform/list',
        component: () => import('../routers/ShipPlatform/list'),
        models: [() => import('../models/grwlShipPlatformModel')],
      },
      {
        path: '/grwl/ship-platform/print',
        component: () => import('../routers/ShipPlatform/prePrint'),
      },
      {
        path: '/grwl/ship-platform/create/sales',
        component: () => import('../routers/ShipPlatform/detail'),
      },
      {
        path: '/grwl/ship-platform/create/normal',
        component: () => import('../routers/ShipPlatform/detail/normal'),
      },
    ],
  },
  {
    path: '/grwl/pull-plans', // 拉货计划
    components: [
      {
        path: '/grwl/pull-plans/list',
        component: () => import('../routers/PullPlan'),
      },
      {
        path: '/grwl/pull-plans/details',
        component: () => import('../routers/PullPlan/details'),
      },
    ],
  },
  {
    path: '/grwl/drawing-application', // 图纸申请
    component: () => import('../routers/DrawingApplication'),
  },
  {
    path: '/grwl/order-quantity-check', // 订单数量检查
    components: [
      {
        path: '/grwl/order-quantity-check/list',
        component: () => import('../routers/OrderQuantityCheck/index'),
        models: [() => import('../models/orderQuantityCheckModel')],
      },
      {
        path: '/grwl/order-quantity-check/examination',
        component: () => import('../routers/OrderQuantityCheck/examination'),
        models: [() => import('../models/orderQuantityCheckModel')],
      },
    ],
  },
  {
    path: '/grwl/mo-workspace', // Mo工作台
    components: [
      {
        path: '/grwl/mo-workspace/list',
        component: () => import('../routers/MoWorkspace/list'),
        models: [() => import('../models/moWorkspaceModel')],
      },
      {
        path: '/grwl/mo-workspace/create',
        component: () => import('../routers/MoWorkspace/detail'),
      },
      {
        path: '/grwl/mo-workspace/detail/:ownerOrganizationId/:moId',
        component: () => import('../routers/MoWorkspace/detail'),
      },
      {
        path: '/grwl/mo-workspace/print',
        component: () => import('../routers/MoWorkspace/myPrint'),
        models: [() => import('../models/moWorkspaceModel')],
      },
      // {
      //   path: '/lmes/mo-workspace/print/:templateCode',
      //   component: () => import('../routes/Print'),
      // },
    ],
  },
  {
    path: '/grwl/customer-purchase-details', // 客户采购明细
    component: () => import('../routers/CustomerPurchaseDetails'),
  },
  {
    path: '/grwl/tablePro',
    component: () => import('../routers/TablePro'),
    authorized: true,
  },
  {
    path: '/pub/grwl/batch-report', // 批量报工
    component: () => import('../routers/BatchReport'),
    authorized: true,
  },
];

export default config;
