/*
 * @module-: 生产监控看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-06 15:58:29
 * @LastEditTime: 2020-11-13 20:04:01
 * @copyright: Copyright (c) 2018,Hand
 */
import { getResponse } from 'utils/utils';
import {
  queryMosOverView,
  queryQualityControl,
  queryOutputStatistics,
  queryTotalProductionCompleted,
  queryAndonsMonitoring,
  queryAndonJournalsTriggered,
  queryProductionMonitoring,
} from '../services/productionMonitoringDashboard';

export default {
  namespace: 'productionMonitoringDashboardModel',
  state: {},
  effects: {
    // 质量监控查询
    *getQualityControl({ payload }, { call }) {
      return getResponse(yield call(queryQualityControl, payload));
    },
    // 产量统计部分
    *getOutputStatistics({ payload }, { call }) {
      return getResponse(yield call(queryOutputStatistics, payload));
    },
    // 当月生产完成总量部分
    *getTotalProductionCompleted({ payload }, { call }) {
      return getResponse(yield call(queryTotalProductionCompleted, payload));
    },
    // 生产概况部分
    *getMosOverView({ payload }, { call }) {
      return getResponse(yield call(queryMosOverView, payload));
    },
    // 安灯异常
    *getAndonsMonitoring({ payload }, { call }) {
      return getResponse(yield call(queryAndonsMonitoring, payload));
    },
    // 安灯异常
    *getAndonJournalsTriggered({ payload }, { call }) {
      return getResponse(yield call(queryAndonJournalsTriggered, payload));
    },
    // 生产总览
    *getProductionMonitoring({ payload }, { call }) {
      return getResponse(yield call(queryProductionMonitoring, payload));
    },
  },
  // reducers: {
  //   updateState(state, action) {
  //     return {
  //       ...state,
  //       ...action.payload,
  //     };
  //   },
};
