import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  // Insert New Router
  {
    path: '/jc/other-out-in-inventory-platform', // 其他出入库平台
    component: () => import('../routes/OtherOutInInventoryPlatform'),
  },
  {
    path: '/jc/production-plans', // 生产计划
    component: () => import('../routes/ProductionPlans'),
  },
  {
    path: '/jc/label-printing', // 标签打印
    component: () => import('../routes/LabelPrinting'),
    title: '标签打印',
    authorized: true,
  },
  {
    path: '/pub/jc/label-binding', // 标签绑定
    component: () => import('../routes/LabelBinding'),
    title: '标签打印',
    authorized: true,
  },
  {
    path: '/pub/jc/one-piece-flow-report', // 单件流报工
    component: () => import('../routes/OnePieceFlowReport'),
    title: '单件流报工',
    authorized: true,
  },
  {
    path: '/jc/finish-in-order-platform', // 完工入库单平台
    component: () => import('../routes/FinishInOrderPlatform'),
    title: '完工入库单平台',
    authorized: true,
  },
  {
    path: '/jc/finish-in-order-create', // 完工入库单生成
    component: () => import('../routes/FinishInOrderCreate'),
    title: '完工入库单生成',
    authorized: true,
  },
  {
    path: '/pub/jc/task-report', // 任务报工
    component: () => import('../routes/TaskReport'),
    models: [() => import('../models/taskReportModel.js')],
    authorized: true,
  },
  {
    path: '/jc/bad-parts-return-platform', // 坏件退换平台
    title: '坏件退换平台',
    authorized: true,
    components: [
      {
        path: '/jc/bad-parts-return-platform/list', // 列表页面
        component: () => import('../routes/BadPartsReturnPlatform'),
      },
      {
        path: '/jc/bad-parts-return-platform/add', // 新建页面
        component: () => import('../routes/BadPartsReturnPlatform/add'),
      },
      {
        path: '/jc/bad-parts-return-platform/edit/:requestId', // 修改页面
        component: () => import('../routes/BadPartsReturnPlatform/edit'),
      },
    ],
  },
];

export default config;
