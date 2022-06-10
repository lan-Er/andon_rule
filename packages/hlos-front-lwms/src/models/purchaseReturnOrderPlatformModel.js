/**
 * @Description: 生产入库执行--Model
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

import { getResponse } from 'utils/utils';
import { printDeliveryReturn } from '../services/purchaseReturnOrderPlatformService';

export default {
  namespace: 'purchaseReturnOrderPlatform',
  state: {
    queryData: {},
    indexList: [],
    lineList: [],
    modalList: [],
    otherData: {},
    headerData: {},
  },
  effects: {
    // 创建发货单
    *printDeliveryReturn({ payload }, { call }) {
      return getResponse(yield call(printDeliveryReturn, payload));
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
