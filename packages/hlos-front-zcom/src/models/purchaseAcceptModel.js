import { getResponse } from 'utils/utils';
import {
  closeDeliveryOrderLine,
  executeLines,
  createAndCloseDeliveryOrder,
} from '@/services/purchaseAcceptService';

export default {
  namespace: 'purchaseAccept',
  state: {},
  effects: {
    // 关闭
    *closeDeliveryOrderLine({ payload }, { call }) {
      return getResponse(yield call(closeDeliveryOrderLine, payload));
    },
    // 执行收货
    *executeLines({ payload }, { call }) {
      return getResponse(yield call(executeLines, payload));
    },
    // 执行并关闭
    *createAndCloseDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(createAndCloseDeliveryOrder, payload));
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
