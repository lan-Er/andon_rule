import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/kmjx/by-product',
    component: () => import('../routers/ByProduct'),
  },
  {
    path: '/kmjx/execute-line-report',
    component: () => import('../routers/ExecuteLineReport'),
  },
  {
    path: '/pub/kmjx/task-report', // 任务报工
    component: () => import('../routers/TaskReport'),
    models: [() => import('../models/taskReportModel.js')],
    authorized: true,
  },
];

export default config;
