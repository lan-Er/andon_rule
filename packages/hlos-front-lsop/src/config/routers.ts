import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/lsop/sales-order', // 销售订单
    components: [
      {
        path: '/lsop/sales-order/list',
        component: () => import('../routes/SalesOrder/list'),
        models: [() => import('../models/SalesOrderModel.js')],
      },
      {
        path: '/lsop/sales-order/create',
        component: () => import('../routes/SalesOrder/detail'),
      },
      {
        path: '/lsop/sales-order/detail/:soHeaderId',
        component: () => import('../routes/SalesOrder/detail'),
      },
    ],
  },
  {
    path: '/lsop/demand-order', // 需求工作台
    components: [
      {
        path: '/lsop/demand-order/list',
        component: () => import('../routes/DemandOrder/list'),
        models: [() => import('../models/demandOrderModel.js')],
      },
      {
        path: '/lsop/demand-order/create',
        component: () => import('../routes/DemandOrder/detail'),
        models: [() => import('../models/demandOrderModel.js')],
      },
      {
        path: '/lsop/demand-order/detail/:demandId',
        component: () => import('../routes/DemandOrder/detail'),
        models: [() => import('../models/demandOrderModel.js')],
      },
    ],
  },
];

export default config;
