/**
 * @Description: 发货申请Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 16:23:40
 */

import { getResponse } from 'utils/utils';
import {
  updateDeliveryOrders,
  deleteDeliveryApply,
  cancelDeliveryApply,
  submitDeliveryApply,
  getPrintrules,
} from '@/services/deliveryOrderService';

export default {
  namespace: 'deliveryOrder',
  state: {
    currentTab: 'source',
    listTab: 'self',
  },
  effects: {
    // 修改发货单
    *updateDeliveryOrders({ payload }, { call }) {
      return getResponse(yield call(updateDeliveryOrders, payload));
    },
    // 删除发货单
    *deleteDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(deleteDeliveryApply, payload));
    },
    // 取消发货单
    *cancelDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(cancelDeliveryApply, payload));
    },
    // 提交发货单
    *submitDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(submitDeliveryApply, payload));
    },
    *getPrintrules({ payload }, { call }) {
      return getResponse(yield call(getPrintrules, payload));
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
