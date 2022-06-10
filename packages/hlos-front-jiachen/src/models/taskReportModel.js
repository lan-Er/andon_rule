/*
 * @Module: 任务报工
 * @Author: 那宇 <u.na@hand-china.com>
 * @Date: 2019-11-19 19:39:48
 */

export default {
  namespace: 'taskReport',
  state: {
    lotList: [],
    feedingList: [],
  },
  effects: {
    // 重置销售订单数据
    *initialLotArr(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          lotList: [],
        },
      });
    },
    // 更新销售订单数据
    *updateLotArr({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          lotList: payload,
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
