import { getResponse } from 'utils/utils';
import {
  createVerificationOrder,
  updateVerificationOrder,
  deleteVerificationOrder,
  cancelVerificationOrder,
  submitVerificationOrder,
  resetAmount,
} from '@/services/statementInitiateService';

export default {
  namespace: 'statementInitiate',
  state: {},
  effects: {
    // 创建对账单
    *createVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(createVerificationOrder, payload));
    },
    // 修改对账单
    *updateVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(updateVerificationOrder, payload));
    },
    // 删除对账单
    *deleteVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(deleteVerificationOrder, payload));
    },
    // 取消对账单
    *cancelVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(cancelVerificationOrder, payload));
    },
    // 提交对账单
    *submitVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(submitVerificationOrder, payload));
    },
    // 重置调整金额
    *resetAmount({ payload }, { call }) {
      return getResponse(yield call(resetAmount, payload));
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
