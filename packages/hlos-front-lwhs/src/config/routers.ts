import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/lwhs/client-info-manage',
    component: () => import('../routes/ClientInfoManage'),
    authorized: true,
  },
  {
    path: '/lwhs/employee-info-manage/:companyCode',
    component: () => import('../routes/EmployeeInfoManage'),
    authorized: true,
    title: '员工信息管理',
  },
  {
    path: '/lwhs/grouping-manage/image_text',
    component: () => import('../routes/GroupingManage'),
    authorized: true,
    title: '图文教程分组管理',
  },
  {
    path: '/lwhs/grouping-manage/video',
    component: () => import('../routes/GroupingManage'),
    authorized: true,
    title: '视频教程分组管理',
  },
  {
    path: '/lwhs/graphic-tutorial-list',
    components: [
      {
        path: '/lwhs/graphic-tutorial-list/list',
        component: () => import('../routes/GraphicTutorialManage/list'),
      },
      {
        path: '/lwhs/graphic-tutorial-list/detail/:id',
        component: () => import('../routes/GraphicTutorialManage/detail'),
      },
    ],
  },
];

export default config;
