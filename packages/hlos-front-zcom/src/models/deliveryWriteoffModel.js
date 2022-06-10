import { getResponse } from 'utils/utils';
import { cancelDeliveryOrder } from '@/services/deliveryWriteoffService';

export default {
  namespace: 'deliveryWriteoff',
  state: {
    ids: [],
  },
  effects: {
    // 冲销
    *cancelDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(cancelDeliveryOrder, payload));
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
