/*
 * @module-: 中天项目目录
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-11 11:18:29
 * @LastEditTime: 2021-01-20 10:22:46
 * @copyright: Copyright (c) 2018,Hand
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/cs/workshop-morning-meeting-board/item',
    component: () => import('../routes/WorkshopMorningMeetingBoard/indexModel'),
    authorized: true,
    title: '车间晨会看板',
    models: [() => import('../models/workshopMorningMeeting')],
  },
  {
    path: '/cs/workshop-morning-meeting-board/config',
    component: () => import('../routes/MorningMeetingBoardConfiguration'),
    models: [() => import('../models/workshopMorningConfigModel')],
    authorized: true,
    title: '车间晨会看板配置',
  },
  {
    path: '/cs/production-monitoring-dashboard',
    component: () => import('../routes/ProductionMonitoringDashboard/indexModeal'),
    // component: 'ProductionMonitoringDashboard',
    models: [() => import('../models/productionMonitoringDashboardModel')],
    authorized: true,
    title: '中天生产监控看板',
  },
  {
    path: '/cs/team-morning-meeting-board',
    component: () => import('../routes/TeamMorningMeetingBoard'),
    models: [() => import('../models/teamMorningMeetingBoardModels')],
    title: '中天班组晨会看板',
  },
  {
    path: '/cs/team-board-config',
    component: () => import('../routes/TeamBoardConfig'),
    models: [
      () => import('../models/workshopMorningConfigModel'),
      () => import('../models/teamMorningMeetingBoardModels'),
    ],
    title: '看板配置',
  },
];

export default config;
