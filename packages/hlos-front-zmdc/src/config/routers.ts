import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  // Insert New Router
  {
    path: '/hlos-front-zmdc/hello',
    component: () => import('../pages/hello/HelloHlosFrontZcnfPage'),
    authorized: true,
    title: 'Hello HlosFrontZcnf',
  },
  {
    path: '/zmdc/platform-product',
    components: [
      {
        path: '/zmdc/platform-product/list',
        models: [() => import('../models/platformProductModel.js')],
        component: () => import('../routes/PlatformProduct/list'),
      },
      {
        path: '/zmdc/platform-product/:type/:productVersionId?',
        models: [() => import('../models/platformProductModel.js')],
        component: () => import('../routes/PlatformProduct/detail'),
      },
    ],
    authorized: true,
    title: '平台产品列表',
  },
  {
    path: '/zmdc/platform-version',
    component: () => import('../routes/PlatformVersion/list'),
    authorized: true,
    title: '平台版本定义',
  },
];

export default config;
