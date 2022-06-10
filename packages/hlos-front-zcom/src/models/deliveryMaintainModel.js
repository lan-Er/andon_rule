import { getResponse } from 'utils/utils';
import {
  saveDeliveryOrder,
  releaseDeliveryOrder,
  batchReleaseDeliveryOrder,
  deleteDeliveryOrder,
  updateLogisticss,
} from '@/services/deliveryMaintainService';

export default {
  namespace: 'deliveryMaintain',
  state: {
    currentTab: 'create',
    ids: [],
  },
  effects: {
    // 保存
    *saveDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(saveDeliveryOrder, payload));
    },
    // 保存并提交
    *releaseDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(releaseDeliveryOrder, payload));
    },
    // 批量提交
    *batchReleaseDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(batchReleaseDeliveryOrder, payload));
    },
    // 批量删除
    *deleteDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(deleteDeliveryOrder, payload));
    },
    // 修改物流信息
    *updateLogisticss({ payload }, { call }) {
      return getResponse(yield call(updateLogisticss, payload));
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
