/*
 * @Module: 盘点平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-27 19:29:48
 * @LastEditors: 赵敏捷
 */

import { getResponse } from 'utils/utils';
import { queryDefaultOrg, fetchLineNumber } from '../services/inventoryPlatformService';

const _updateState = function* _({ payload }, { put }) {
  yield put({
    type: 'updateState',
    payload,
  });
};

export default {
  namespace: 'inventoryPlatform',
  state: {
    defaultOrg: undefined,
    currentOrg: undefined,
    batchCreateInfo: [],
    queryPara: {},
  },
  effects: {
    // 更新默认组织
    *updateDefaultOrg(_, { call, put }) {
      const defaultOrg = getResponse(yield call(queryDefaultOrg));
      yield put({
        type: 'updateState',
        payload: {
          defaultOrg,
        },
      });
    },
    // 更新默认组织
    *updateQueryPara({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          queryPara: payload,
        },
      });
    },
    // 更新当前选择组织信息
    updateCurrentOrg: _updateState,
    // 更新批量新增行信息
    updateBatchCreate: _updateState,
    updateDefaultAdjustAccount: _updateState,
    *fetchLineNumber({ payload }, { call }) {
      return getResponse(yield call(fetchLineNumber, payload));
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
