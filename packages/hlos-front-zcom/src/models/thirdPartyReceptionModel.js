/**
 * @Description: 发货申请Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 16:23:40
 */

import { getResponse } from 'utils/utils';
import {
  executeLines,
  createAndCloseDeliveryOrder,
  closeDeliveryOrder,
} from '@/services/thirdPartyReceptionService';

export default {
  namespace: 'thirdPartyReceptionModel',
  state: {
    currentTab: 'source',
    listTab: 'self',
  },
  effects: {
    // 创建执行单明细
    *executeLines({ payload }, { call }) {
      return getResponse(yield call(executeLines, payload));
    },
    // 创建执行单明细并关闭发货单行
    *createAndCloseDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(createAndCloseDeliveryOrder, payload));
    },
    // 关闭发货单行
    *closeDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(closeDeliveryOrder, payload));
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
