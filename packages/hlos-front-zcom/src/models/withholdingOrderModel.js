import { getResponse } from 'utils/utils';
import {
  submitWithholdingOrder,
  deleteWithholdingOrder,
  cancelWithholdingOrder,
  verifyWithholdingOrder,
} from '@/services/withholdingOrderService';

export default {
  namespace: 'withholdingOrderModel',
  state: {},
  effects: {
    // 提交扣款单
    *submitWithholdingOrder({ payload }, { call }) {
      return getResponse(yield call(submitWithholdingOrder, payload));
    },
    // 删除扣款单
    *deleteWithholdingOrder({ payload }, { call }) {
      return getResponse(yield call(deleteWithholdingOrder, payload));
    },
    // 取消扣款单
    *cancelWithholdingOrder({ payload }, { call }) {
      return getResponse(yield call(cancelWithholdingOrder, payload));
    },
    // 审核扣款单
    *verifyWithholdingOrder({ payload }, { call }) {
      return getResponse(yield call(verifyWithholdingOrder, payload));
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
