import { getResponse } from 'utils/utils';
import { receiveDeliveryOrder } from '@/services/deliveryReceiveService';

export default {
  namespace: 'deliveryReceive',
  state: {
    ids: [],
  },
  effects: {
    // 接收过账
    *receiveDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(receiveDeliveryOrder, payload));
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
