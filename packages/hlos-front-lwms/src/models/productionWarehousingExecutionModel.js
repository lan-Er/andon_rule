/**
 * @Description: 生产入库执行--Model
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

// import { getResponse } from 'utils/utils';

export default {
  namespace: 'productionWarehousingExecution',
  state: {
    queryData: {},
    indexList: [],
    lineList: [],
    modalList: [],
    otherData: {},
    headerData: {},
  },
  effects: {
    // *fetchLines({ payload }, { call }) {
    //   return getResponse(yield call(queryList, payload));
    // },
    // *fetchDetail({ payload }, { call }) {
    //   return getResponse(yield call(queryDetail, payload));
    // },
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
