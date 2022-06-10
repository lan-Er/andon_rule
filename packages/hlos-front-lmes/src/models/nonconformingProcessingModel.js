/*
 * @Module: 不合格品处理
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-01-19 10:04:48
 */

export default {
  namespace: 'nonconformingProcessing',
  state: {
    lotList: [],
    inspectDocList: [],
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
