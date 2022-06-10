/*
 * @Module: po预检
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-04 10:04:48
 */

export default {
  namespace: 'poPrecheck',
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
