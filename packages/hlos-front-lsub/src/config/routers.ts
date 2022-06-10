import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/lsub/product-doc-manage',
    component: () => import('../routes/ProductDocManage'),
    authorized: true,
  },
  {
    path: '/lsub/data-processing-wechat',
    component: () => import('../routes/DataProcessingWechat'),
    authorized: true,
  },
];

export default config;
