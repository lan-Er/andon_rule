/*
 * @Module: 日历
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-28 15:32:48
 * @LastEditors: 赵敏捷
 */

import { getResponse } from 'utils/utils';
import {
  copyCalendar,
  deleteCalendar,
  queryCalendar,
  queryCalendarDetail,
  queryCalendarYearDetail,
  initializeShift,
  copyCalendarDate,
} from '../services/calendarService';

export default {
  namespace: 'calendar',
  state: {},
  effects: {
    // 查询列表
    *queryCalendar({ payload }, { call }) {
      return getResponse(yield call(queryCalendar, payload));
    },

    // 查询明细
    *queryCalendarDetail({ payload }, { call }) {
      return getResponse(yield call(queryCalendarDetail, payload));
    },

    // 查询年视图明细
    *queryCalendarYearDetail({ payload }, { call }) {
      return getResponse(yield call(queryCalendarYearDetail, payload));
    },

    // 日历复制
    *copyCalendar({ payload }, { call }) {
      return getResponse(yield call(copyCalendar, payload));
    },

    // 删除
    *deleteCalendar({ payload }, { call }) {
      return getResponse(yield call(deleteCalendar, payload));
    },

    // 日历班次初始化
    *initializeShift({ payload }, { call }) {
      return getResponse(yield call(initializeShift, payload));
    },

    // 日历日期复制
    *copyCalendarDate({ payload }, { call }) {
      return getResponse(yield call(copyCalendarDate, payload));
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
