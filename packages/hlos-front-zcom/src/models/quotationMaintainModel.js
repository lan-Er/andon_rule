/**
 * @Description: 报价单维护Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-26 16:54:20
 */

import { getResponse } from 'utils/utils';
import {
  quotationOrderSave,
  quotationOrderSubmit,
  quotationOrderRecall,
  quotationOrderDelete,
} from '@/services/quotationMaintainService';

export default {
  namespace: 'quotationMaintain',
  state: {
    currentTab: 'ALL',
  },
  effects: {
    // 保存
    *quotationOrderSave({ payload }, { call }) {
      return getResponse(yield call(quotationOrderSave, payload));
    },
    // 提交
    *quotationOrderSubmit({ payload }, { call }) {
      return getResponse(yield call(quotationOrderSubmit, payload));
    },
    // 撤回
    *quotationOrderRecall({ payload }, { call }) {
      return getResponse(yield call(quotationOrderRecall, payload));
    },
    // 删除
    *quotationOrderDelete({ payload }, { call }) {
      return getResponse(yield call(quotationOrderDelete, payload));
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
