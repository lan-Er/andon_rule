/**
 * @Description: 客户订单Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 14:07:21
 */

import { getResponse } from 'utils/utils';
import {
  saleSummarys,
  createSaleSummarys,
  createSaleSummaryLines,
  createSaleSummaryResults,
} from '@/services/saleSummaryService';

export default {
  namespace: 'saleSummaryModel',
  state: {},
  effects: {
    *saleSummarys({ payload }, { call }) {
      return getResponse(yield call(saleSummarys, payload));
    },
    *createSaleSummarys({ payload }, { call }) {
      return getResponse(yield call(createSaleSummarys, payload));
    },
    *createSaleSummaryLines({ payload }, { call }) {
      return getResponse(yield call(createSaleSummaryLines, payload));
    },
    *createSaleSummaryResults({ payload }, { call }) {
      return getResponse(yield call(createSaleSummaryResults, payload));
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
