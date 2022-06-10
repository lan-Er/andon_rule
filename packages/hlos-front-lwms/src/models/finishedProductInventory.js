/*
 * @Module: 产成品入库
 * @Author: yu.na <yu.na@hand-china.com>
 * @Date: 2020-09-21 19:39:48
 * @LastEditors: yu.na
 */

export default {
  namespace: 'finishedProductInventory',
  state: {
    modalList: [],
    totalNum: 0,
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
