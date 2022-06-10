/*
 * @Descripttion: 报价单审核
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-29 14:59:23
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-29 15:01:36
 */

import { getResponse } from 'utils/utils';
import { verifyQuotationOrder } from '@/services/quotationReview';

export default {
  namespace: 'quotationReview',
  state: {
    currentTab: 'create',
    ids: [],
  },
  effects: {
    // 报价单通过/退回
    *verifyQuotationOrder({ payload }, { call }) {
      return getResponse(yield call(verifyQuotationOrder, payload));
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
