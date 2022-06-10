/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-07 14:14:36
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-03-03 10:16:40
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/ldtt/task-group',
    components: [
      {
        path: '/ldtt/task-group/list',
        component: () => import('../routes/TaskGroup'),
      },
      {
        path: '/ldtt/task-group/task-item',
        component: () => import('../routes/TaskItem'),
      },
      {
        path: '/ldtt/task-group/task-logs',
        component: () => import('../routes/TaskLogs'),
      },
    ],
  },
  {
    path: '/ldtt/transfer-tenant',
    components: [
      {
        path: '/ldtt/transfer-tenant/list',
        component: () => import('../routes/TransferTenant'),
      },
      {
        path: '/ldtt/transfer-tenant/service/list',
        component: () => import('../routes/TransferService'),
      },
    ],
  },
  {
    path: '/ldtt/transfer-platform',
    components: [
      {
        path: '/ldtt/transfer-platform/list',
        component: () => import('../routes/TransferPlatform'),
      },
      {
        path: '/ldtt/transfer-platform/detail/list',
        component: () => import('../routes/TransferDetail'),
      },
    ],
  },
  {
    path: '/ldtt/es-syncitem',
    components: [
      {
        path: '/ldtt/es-syncitem/list',
        component: () => import('../routes/EsSyncItem'),
      },
      {
        path: '/ldtt/es-syncitem/logs',
        component: () => import('../routes/EsSyncLogs'),
      },
    ],
    authorized: true,
    title: 'ES同步项',
  },
  {
    path: '/ldtt/service-archive',
    components: [
      {
        path: '/ldtt/service-archive/list',
        component: () => import('../routes/ServiceArchive'),
      },
      {
        path: '/ldtt/service-archive/detail',
        component: () => import('../routes/ServiceArchive/detail'),
      },
      {
        path: '/ldtt/service-archive/logs',
        component: () => import('../routes/ServiceArchive/logs'),
      },
    ],
    authorized: true,
    title: '服务归档',
  },
  {
    path: '/ldtt/etl-relation',
    components: [
      {
        path: '/ldtt/etl-relation/list',
        component: () => import('../routes/EtlRelation'),
      },
      {
        path: '/ldtt/etl-relation/detail/:id',
        component: () => import('../routes/EtlRelation/detail'),
      },
    ],
    authorized: true,
    title: 'ETL关系配置',
  },
];

export default config;
