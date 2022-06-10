/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-11-17 11:52:13
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-19 09:59:17
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  // Insert New Router
  {
    path: '/hlos-front-zexe/hello',
    component: () => import('../routes/hello/HelloHlosFrontZexePage'),
    authorized: true,
    title: 'Hello HlosFrontZexe',
  },
  {
    path: '/zexe/hand-query/list',
    title: '现有量查询',
    authorized: true,
    component: () => import('../routes/HandQuery/list'),
  },
  {
    path: '/zexe/warehouse-executions/list',
    title: '仓库执行明细',
    authorized: true,
    component: () => import('../routes/WarehouseExecutions/list'),
  },
  {
    path: '/zexe/product-task-progress-report', // 生产任务进度报表
    component: () => import('../routes/ProductTaskProgressReport/list'),
    title: '生产任务进度报表',
    authorized: true,
  },
  {
    path: '/zexe/product-order-progress-report', // 生产订单进度报表
    components: [
      {
        path: '/zexe/product-order-progress-report/list',
        component: () => import('../routes/ProductOrderProgressReport/list'),
      },
      {
        path: '/zexe/product-order-progress-report/detail/:moId',
        component: () => import('../routes/ProductOrderProgressReport/detail'),
      },
    ],
    title: '生产订单进度报表',
    authorized: true,
  },
  {
    path: '/zexe/mo-workspace', // Mo工作台
    title: 'MO工作台',
    authorized: true,
    components: [
      {
        path: '/zexe/mo-workspace/list',
        component: () => import('../routes/MoWorkspace/list'),
        models: [() => import('../models/moWorkspaceModel.js')],
      },
      {
        path: '/zexe/mo-workspace/detail/:ownerOrganizationId/:moId',
        component: () => import('../routes/MoWorkspace/detail'),
      },
    ],
  },
  {
    path: '/zexe/purchaser-product-order-input-output-report', // 核企侧生产订单投入产出报表
    title: '（核企）生产订单投入比报表',
    authorized: true,
    component: () => import('../routes/PurchaserProductOrderInputOutputReport/list'),
  },
  {
    path: '/zexe/supplier-product-order-input-output-report', // 供应商生产订单投入产出报表
    title: '生产订单投入比报表',
    authorized: true,
    component: () => import('../routes/SupplierProductOrderInputOutputReport/list'),
  },
];

export default config;
