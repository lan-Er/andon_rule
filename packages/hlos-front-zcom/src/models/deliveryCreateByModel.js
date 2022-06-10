/**
 * @Description: 发货申请Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 16:23:40
 */

import { getResponse } from 'utils/utils';
import { createDeliveryOrders } from '@/services/deliveryCreateByService';

export default {
  namespace: 'deliveryCreateByModel',
  state: {
    currentTab: 'source',
    listTab: 'self',
  },
  effects: {
    // 修改发货单
    *createDeliveryOrders({ payload }, { call }) {
      return getResponse(yield call(createDeliveryOrders, payload));
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
