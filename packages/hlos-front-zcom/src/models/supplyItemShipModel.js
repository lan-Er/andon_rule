import { getResponse } from 'utils/utils';
import {
  createOutDeliveryOrder,
  cancelDeliveryOrder,
  deleteDeliveryOrder,
  submitDeliveryOrder,
  updateDeliveryOrders,
  createDeliveryOrders,
} from '@/services/supplyItemShipService';

export default {
  namespace: 'supplyItemShip',
  state: {},
  effects: {
    // 创建发货单
    *createOutDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(createOutDeliveryOrder, payload));
    },
    // 创建发货单 -- 根据预约单明细创建
    *createDeliveryOrders({ payload }, { call }) {
      return getResponse(yield call(createDeliveryOrders, payload));
    },
    // 取消发货单
    *cancelDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(cancelDeliveryOrder, payload));
    },
    // 删除发货单
    *deleteDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(deleteDeliveryOrder, payload));
    },
    // 提交发货单
    *submitDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(submitDeliveryOrder, payload));
    },
    // 修改发货单
    *updateDeliveryOrders({ payload }, { call }) {
      return getResponse(yield call(updateDeliveryOrders, payload));
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
