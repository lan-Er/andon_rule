import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  // 销售预测模型-时间序列预测模型
  {
    path: '/zplan/time-prediction-model',
    authorized: true,
    title: '时间序列预测模型',
    components: [
      {
        path: '/zplan/time-prediction-model/list',
        component: () => import('../routes/TimePredictionModel/list'),
      },
    ],
  },
  // 销售预测模型-因果序列预测模型
  {
    path: '/zplan/causal-prediction-model',
    authorized: true,
    title: '因果预测模型',
    components: [
      {
        path: '/zplan/causal-prediction-model/list',
        component: () => import('../routes/CausalPredictionModel/list'),
      },
    ],
  },
  // 销售预测模型-因子类别
  {
    path: '/zplan/causal-type',
    authorized: true,
    title: '因子类别',
    components: [
      {
        path: '/zplan/causal-type/list',
        component: () => import('../routes/CausalType/list'),
      },
      {
        path: '/zplan/causal-type/festival',
        component: () => import('../routes/CausalType/festival'),
      },
      {
        path: '/zplan/causal-type/fromotion',
        component: () => import('../routes/CausalType/activity'),
      },
      {
        path: '/zplan/causal-type/discount',
        component: () => import('../routes/CausalType/discount'),
      },
      {
        path: '/zplan/causal-type/lifecycle',
        component: () => import('../routes/CausalType/lifecycle'),
      },
    ],
  },
  // 销售数据处理-历史销售记录
  {
    path: '/zplan/history-data-process',
    authorized: true,
    title: '历史销售记录',
    components: [
      {
        path: '/zplan/history-data-process/list',
        component: () => import('../routes/HistoryDataProcess/list'),
      },
    ],
  },
  // 销售数据处理-历史销售数据
  {
    path: '/zplan/sales-record',
    authorized: true,
    title: '销售记录处理',
    components: [
      {
        path: '/zplan/sales-record/list',
        component: () => import('../routes/SalesRecord/list'),
      },
    ],
  },
  // 销售数据处理-销售折扣计划
  {
    path: '/zplan/sales-discount-data',
    authorized: true,
    title: '销售折扣计划',
    components: [
      {
        path: '/zplan/sales-discount-data/list',
        component: () => import('../routes/SalesDiscountData/list'),
      },
    ],
  },
  // 销售预测计算-销售预测模板列表
  {
    path: '/zplan/sale-template',
    authorized: true,
    title: '销售预测模板',
    components: [
      {
        path: '/zplan/sale-template/list',
        models: [() => import('../models/saleTemplateModel.js')],
        component: () => import('../routes/SaleTemplate/list'),
      },
      {
        path: '/zplan/sale-template/:type/:saleTemplateId?',
        models: [() => import('../models/saleTemplateModel.js')],
        component: () => import('../routes/SaleTemplate/detail'),
      },
    ],
  },
  // 销售预测任务-销售预测详情
  {
    path: '/zplan/sale-prediction-task',
    // 本地开发的权限
    authorized: true,
    title: '预测任务列表',
    components: [
      {
        path: '/zplan/sale-prediction-task/list',
        // 配置 models 这个用于获取方法 状态管理仓库 使用dispatch 调用后端接口
        models: [() => import('../models/saleTemplateModel.js')],
        component: () => import('../routes/SalePredictionTask/list'),
      },
      {
        path: '/zplan/sale-prediction-task/:type/:saleTemplateId?',
        models: [() => import('../models/saleTemplateModel.js')],
        component: () => import('../routes/SalePredictionTask/detail'),
      },
    ],
  },
  // 销售预测计算-销售预测结果列表
  {
    path: '/zplan/sale-result',
    authorized: true,
    title: '销售预测结果',
    components: [
      {
        path: '/zplan/sale-result/list',
        models: [() => import('../models/saleResultModel.js')],
        component: () => import('../routes/SaleResult/list'),
      },
      {
        path: '/zplan/sale-result/detail/:saleResultId',
        models: [() => import('../models/saleResultModel.js')],
        component: () => import('../routes/SaleResult/detail'),
      },
    ],
  },
  // 节日日历
  {
    path: '/zplan/holiday-calendar',
    authorized: true,
    title: '节日日历',
    components: [
      {
        path: '/zplan/holiday-calendar/list',
        component: () => import('../routes/HolidayCalendar/list'),
      },
      {
        path: '/zplan/holiday-calendar/detail/:calendarCode/:calendarId',
        component: () => import('../routes/HolidayCalendar/detail'),
      },
    ],
  },
  // 销售实体
  {
    path: '/zplan/sales-entity',
    authorized: true,
    title: '销售实体',
    components: [
      {
        path: '/zplan/sales-entity/list',
        component: () => import('../routes/SalesEntity/list'),
      },
    ],
  },
  // 促销日历
  {
    path: '/zplan/promotion-calendar',
    authorized: true,
    title: '促销日历',
    components: [
      {
        path: '/zplan/promotion-calendar/list',
        component: () => import('../routes/PromotionCalendar/list'),
      },
      {
        path: '/zplan/promotion-calendar/detail/:salesEntityId',
        component: () => import('../routes/PromotionCalendar/detail'),
      },
    ],
  },
  // 销售预测计算-预测汇总
  {
    path: '/zplan/plan-sale-summary',
    authorized: true,
    title: '预测汇总',
    components: [
      {
        path: '/zplan/plan-sale-summary/list',
        models: [() => import('../models/saleSummaryModel.js')],
        component: () => import('../routes/PlanSaleSummary/list'),
      },
      {
        path: '/zplan/plan-sale-summary/:type/:saleSummaryId?',
        models: [() => import('../models/saleSummaryModel.js')],
        component: () => import('../routes/PlanSaleSummary/detail'),
      },
    ],
  },
  // 销售预测计算-预测版本
  {
    path: '/zplan/prediction-version',
    authorized: true,
    title: '预测版本',
    components: [
      {
        path: '/zplan/prediction-version/list',
        models: [() => import('../models/predictionVersionModel.js')],
        component: () => import('../routes/PredictionVersion/list'),
      },
      {
        path: '/zplan/prediction-version/:type/:saleVersionId?',
        models: [() => import('../models/predictionVersionModel.js')],
        component: () => import('../routes/PredictionVersion/detail'),
      },
    ],
  },
];

export default config;
