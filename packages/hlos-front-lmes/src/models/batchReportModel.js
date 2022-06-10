/*
 * @Module: 任务报工
 * @Author: 那宇 <u.na@hand-china.com>
 * @Date: 2019-11-19 19:39:48
 */

export default {
  namespace: 'batchReport',
  state: {
    feedingList: [],
  },
  effects: {},
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
