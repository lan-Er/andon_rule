import { getResponse } from 'utils/utils';
import {
  poDelete,
  poSubmit,
  poCancel,
  poLineCancel,
  getPrintrules,
} from '@/services/poMaintainService';

export default {
  namespace: 'poMaintain',
  state: {},
  effects: {
    // 删除采购订单
    *poDelete({ payload }, { call }) {
      return getResponse(yield call(poDelete, payload));
    },
    // 提交采购订单
    *poSubmit({ payload }, { call }) {
      return getResponse(yield call(poSubmit, payload));
    },
    // 取消采购订单
    *poCancel({ payload }, { call }) {
      return getResponse(yield call(poCancel, payload));
    },
    // 取消采购订单行
    *poLineCancel({ payload }, { call }) {
      return getResponse(yield call(poLineCancel, payload));
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
