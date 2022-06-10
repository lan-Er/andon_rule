/*
 * @Module: 安灯统计Model
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-02 09:53:54
 * @LastEditors: 赵敏捷
 */

import { getResponse } from 'utils/utils';
import {
  queryAndonTriggerClassification,
  queryAndonStatistic,
  queryProcessOrResponseTimeTop,
  queryTriggerTimesRank,
  queryWorkCellTriggerTimesRank,
} from '../services/andonStatisticService';

export default {
  namespace: 'andonStatistic',
  state: {
    filterChange: false,
  },
  effects: {
    *toggleFilterChange(_, { put }) {
      yield put({ type: '_toggleFilterChange' });
    },
    // 查询安灯触发分类
    *queryAndonTriggerClassification({ payload }, { call }) {
      return getResponse(yield call(queryAndonTriggerClassification, payload));
    },
    // 查询安灯统计
    *queryAndonStatistic({ payload }, { call }) {
      return getResponse(yield call(queryAndonStatistic, payload));
    },
    // 查询处理时间/响应时间TOP
    *queryProcessOrResponseTimeTop({ payload }, { call }) {
      return getResponse(yield call(queryProcessOrResponseTimeTop, payload));
    },
    // 查询触发次数排行
    *queryTriggerTimesRank({ payload }, { call }) {
      return getResponse(yield call(queryTriggerTimesRank, payload));
    },
    // 查询工位触发次数排行
    *queryWorkCellTriggerTimesRank({ payload }, { call }) {
      return getResponse(yield call(queryWorkCellTriggerTimesRank, payload));
    },
  },
  reducers: {
    _toggleFilterChange(state) {
      return {
        ...state,
        filterChange: !state.filterChange,
      };
    },
  },
};
