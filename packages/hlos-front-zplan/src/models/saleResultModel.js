/**
 * @Description: 客户订单Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 14:07:21
 */

import { getResponse } from 'utils/utils';
import { saleResults, cancelResults } from '@/services/saleResultService';

export default {
  namespace: 'saleResultModel',
  state: {},
  effects: {
    *saleResults({ payload }, { call }) {
      return getResponse(yield call(saleResults, payload));
    },
    *cancelResults({ payload }, { call }) {
      return getResponse(yield call(cancelResults, payload));
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
