/*
 * @Description: routes
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-06-07 17:25:50
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  // Insert New Router
  {
    path: '/hlos-front-senyu/hello',
    component: () => import('../pages/hello/HelloHlosFrontSenyuPage'),
    authorized: true,
    title: 'Hello HlosFrontSenyu',
  },
  {
    path: '/senyu/tag-print', // 标签打印
    components: [
      {
        path: '/senyu/tag-print/list',
        component: () => import('../routes/TagPrint/list'),
      },
      {
        path: '/senyu/tag-print/print/:templateCode',
        component: () => import('../routes/TagPrint/print'),
      },
    ],
  },
  {
    path: '/pub/senyu/batch-report', // 批量报工
    component: () => import('../routes/BatchReport'),
    authorized: true,
  },
  {
    path: '/senyu/delivery-execution', // 发货执行
    components: [
      {
        path: '/senyu/delivery-execution/list',
        models: [() => import('../models/senyuDeliveryExecutionModel')],
        component: () => import('../routes/DeliveryExecution/list'),
      },
      {
        authorized: true,
        path: '/pub/senyu/delivery-execution-detail/:shipOrderId', // 发货执行详情
        models: [() => import('../models/senyuDeliveryExecutionModel')],
        component: () => import('../routes/DeliveryExecution/detail'),
      },
    ],
  },
];

export default config;
