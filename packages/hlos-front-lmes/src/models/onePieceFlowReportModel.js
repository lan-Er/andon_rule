/*
 * @Module: 单件流报工
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-01-19 10:04:48
 */

export default {
  namespace: 'onePieceFlowReport',
  state: {
    lotList: [],
    tagList: [],
    quantityList: [],
    currentList: [],
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
