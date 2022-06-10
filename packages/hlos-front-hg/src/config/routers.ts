/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-10 16:57:23
 * @LastEditTime: 2020-09-09 17:00:11
 * @Description:
 */
import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/hg/item', // 恒光-物料
    components: [
      {
        path: '/hg/item/list',
        component: () => import('../routes/HgItem/list'),
      },
      {
        path: '/hg/item/create',
        component: () => import('../routes/HgItem/detail'),
      },
      {
        path: '/hg/item/detail/:itemId',
        component: () => import('../routes/HgItem/detail'),
      },
    ],
  },
  {
    path: '/hg/time-compare-report', // 工时比较报表
    component: () => import('../routes/TimeCompareReport'),
  },
  {
    path: '/hg/equipment-utilization-report', // 设备稼动率报表
    component: () => import('../routes/EquipmentUtilizationReport'),
  },
  {
    path: '/hg/completion-rate-report', // 加工完成率报表
    components: [
      {
        path: '/hg/completion-rate-report/list',
        component: () => import('../routes/CompletionRateReport'),
      },
      {
        path: '/hg/completion-rate-report/chart/:chartType',
        component: () => import('../routes/CompletionRateReport/chart'),
      },
    ],
  },
  {
    path: '/hg/mold-test-pass-rate-report', // 试模合格率报表
    components: [
      {
        path: '/hg/mold-test-pass-rate-report/list',
        component: () => import('../routes/MoldTestPassRateReport'),
      },
      {
        path: '/hg/mold-test-pass-rate-report/chart/:chartType',
        component: () => import('../routes/MoldTestPassRateReport/chart'),
      },
    ],
  },
  {
    path: '/hg/mold-assembly-completion-rate-report', // 模具组立完成率报表
    components: [
      {
        path: '/hg/mold-assembly-completion-rate-report/list',
        component: () => import('../routes/MoldAssemblyCompletionRate'),
      },
      {
        path: '/hg/mold-assembly-completion-rate-report/chart/:chartType',
        component: () => import('../routes/MoldAssemblyCompletionRate/chart'),
      },
    ],
  },
  {
    path: '/hg/mold-delivery-completion-rate-report', // 模具交期达成率报表
    components: [
      {
        path: '/hg/mold-delivery-completion-rate-report/list',
        component: () => import('../routes/MoldDeliveryCompletionRate'),
      },
      {
        path: '/hg/mold-delivery-completion-rate-report/chart/:chartType',
        component: () => import('../routes/MoldDeliveryCompletionRate/chart'),
      },
    ],
  },
  {
    path: '/hg/monthly-bad-statistics-analysis', // 月度不良统计分析报表
    components: [
      {
        path: '/hg/monthly-bad-statistics-analysis/list',
        component: () => import('../routes/MonthlyBadStatisticsAnalysis'),
      },
      {
        path: '/hg/monthly-bad-statistics-analysis/chart',
        component: () => import('../routes/MonthlyBadStatisticsAnalysis/chart'),
      },
    ],
  },
  {
    path: '/hg/defective-rate-of-inspection', // 检验不良率分析报表
    components: [
      {
        path: '/hg/defective-rate-of-inspection/list',
        component: () => import('../routes/DefectiveRateOfInspection'),
      },
      {
        path: '/hg/defective-rate-of-inspection/chart',
        component: () => import('../routes/DefectiveRateOfInspection/chart'),
      },
    ],
  },
  {
    path: '/hg/inspection-document', // 检验单平台
    component: () => import('../routes/InspectionDocument'),
  },
  {
    path: '/hg/equipment-hour-statistics-report', // 设备工时统计报表
    component: () => import('../routes/EquipmentHourStatisticsReport'),
  },
  {
    path: '/hg/problem-tracking', // 问题追踪
    component: () => import('../routes/ProblemTracking'),
    authorized: true,
    title: '问题追踪',
  },
  {
    path: '/hg/hg-inspection-judgment', // 恒光检验判定
    component: () => import('../routes/HgInspectionJudgment'),
    authorized: true,
  },
  {
    path: '/pub/hg/hg-inspection-judgment/execute', // 恒光检验判定执行界面
    component: () => import('../routes/HgInspectionJudgment/execute.js'),
    authorized: true,
  },
  {
    path: '/hg/hg-model-inspection', // 恒光试模检
    component: () => import('../routes/HgModelInspection'),
    authorized: true,
  },
  {
    path: '/pub/hg/hg-model-inspection/execute', // 恒光试模检
    component: () => import('../routes/HgModelInspection/execute.js'),
    authorized: true,
  },
];

export default config;
