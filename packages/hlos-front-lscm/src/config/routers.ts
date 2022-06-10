import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/lscm/po-qty-list', // 采购订单
    components: [
      {
        path: '/lscm/po-qty-list/list',
        component: () => import('../routes/PurchaseOrders/list'),
        models: [() => import('../models/purchaseOrderModel')],
      },
      {
        path: '/lscm/po-qty-list/detail/:poHeaderId',
        component: () => import('../routes/PurchaseOrders/detail'),
        models: [() => import('../models/purchaseOrderModel')],
      },
    ],
  },
];

export default config;
