/*
 * @Module: Mo工作台
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-01-12 12:16:48
 */

export default {
  namespace: 'moWorkSpace',
  state: {
    dataSource: [],
    pagination: {},
  },
  effects: {
    // 更新数据
    *updateDataSource({ payload }, { put }) {
      const { list, pagination } = payload;
      yield put({
        type: 'updateState',
        payload: {
          dataSource: list,
          pagination,
        },
      });
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
