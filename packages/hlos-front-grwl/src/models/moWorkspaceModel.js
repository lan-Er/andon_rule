/*
 * @Module: Mo工作台
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-01-12 12:16:48
 */
import { getResponse } from 'utils/utils';

import { queryMoPrintList } from '../services/moWorkspaceService';

export default {
  namespace: 'moWorkSpace',
  state: {
    dataSource: [],
    pagination: {},
    taskList: [],
  },
  effects: {
    // 更新数据
    *updateDataSource({ payload }, { put }) {
      const { list, pagination, taskList } = payload;
      yield put({
        type: 'updateState',
        payload: {
          dataSource: list,
          taskList,
          pagination,
        },
      });
    },
    // 获取打印数据
    *getMoPrintList({ payload }, { call }) {
      const res = getResponse(yield call(queryMoPrintList, payload));
      if (res) {
        return res;
      }
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
