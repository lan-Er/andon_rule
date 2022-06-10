import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  // Insert New Router
  {
    path: '/hlos-front-tongfu/hello',
    component: () => import('../pages/hello/HelloHlosFrontTongfuPage'),
    authorized: true,
    title: 'Hello HlosFrontTongfu',
  },
  {
    path: '/pub/lwms/tongfu/warehouse-spectaculars', // 仓库看板
    component: () => import('../routes/warehouse-spectaculars'),
    authorized: true,
  },
  {
    path: '/lmds/tongfu/wm-area', // 货位
    component: () => import('../routes/organization-wm-area/list'),
    authorized: true,
  },
  {
    path: '/lwms/tongfu/tag-print', // 成品打印
    components: [
      {
        path: '/lwms/tongfu/tag-print/list',
        component: () => import('../routes/TagPrint/list'),
      },
      {
        path: '/lwms/tongfu/tag-print/print/:templateCode',
        component: () => import('../routes/TagPrint/print'),
      },
    ],
  },
];

export default config;
