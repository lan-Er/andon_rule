/*
 * @Module: 需求工作台
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-01-19 10:04:48
 */

export default {
  namespace: 'demandOrder',
  state: {
    demandList: [],
    paginations: {},
    queryStatus: 'init',
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
