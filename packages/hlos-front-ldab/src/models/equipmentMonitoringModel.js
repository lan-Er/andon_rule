/*
 * @module: 设备监控看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-21 10:02:44
 * @LastEditTime: 2021-01-25 16:10:38
 * @copyright: Copyright (c) 2020,Hand
 */
import { getResponse } from 'utils/utils';

import { queryEquipmentList, queryEquipmentDetails } from '@/services/equipmentMonitoringBoard';

export default {
  namespace: 'equipmentMonitoringModel',
  state: {
    quryParams: { minutes: 180 },
    equipmentList: {},
    details: {},
    isQuery: false,
    footerLeftLoading: false,
  },
  effects: {
    *getEquipmentmonitoringList({ payload }, { call, put }) {
      yield put({
        type: 'updateFooterLeftLoading',
        payload: true,
      });
      const res = getResponse(yield call(queryEquipmentList, payload));
      if (res) {
        yield put({
          type: 'upDateEquipmentList',
          payload: res,
        });
        yield put({
          type: 'updateFooterLeftLoading',
          payload: false,
        });
      }
      return res;
    },
    *getEquipmentmonitoringDetail({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentDetails, payload));
    },
  },
  reducers: {
    updateQueryParams(state, { payload }) {
      return { ...state, quryParams: { ...state.quryParams, ...payload } };
    },
    upDateEquipmentList(state, { payload }) {
      return { ...state, equipmentList: { ...state.equipmentList, ...payload } };
    },
    getDetailsList(state, { payload }) {
      return { ...state, isQuery: payload };
    },
    updateFooterLeftLoading(state, { payload }) {
      return { ...state, footerLeftLoading: payload };
    },
  },
};
