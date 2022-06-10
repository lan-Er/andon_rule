/**
 * @Description: 客户订单Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 14:07:21
 */

import { getResponse } from 'utils/utils';
import {
  poVerify,
  headSave,
  lineSave,
  updateAllLine,
  getPrintrules,
} from '@/services/customerOrderService';

export default {
  namespace: 'customerOrder',
  state: {},
  effects: {
    // 确认/拒绝
    *poVerify({ payload }, { call }) {
      return getResponse(yield call(poVerify, payload));
    },
    // 头保存
    *headSave({ payload }, { call }) {
      return getResponse(yield call(headSave, payload));
    },
    // 行保存
    *lineSave({ payload }, { call }) {
      return getResponse(yield call(lineSave, payload));
    },
    // 批量维护
    *updateAllLine({ payload }, { call }) {
      return getResponse(yield call(updateAllLine, payload));
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
