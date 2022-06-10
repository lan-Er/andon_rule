/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-11-17 11:52:13
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2020-12-23 10:02:06
 */

export default {
  namespace: 'requirementConfirm',
  state: {
    currentTab: 'unResponse',
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
