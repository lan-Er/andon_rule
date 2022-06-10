import { getResponse } from 'utils/utils';
import { verifyVerificationOrder } from '@/services/statementVerifyService';

export default {
  namespace: 'statementVerify',
  state: {},
  effects: {
    // 对账单审核
    *verifyVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(verifyVerificationOrder, payload));
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
