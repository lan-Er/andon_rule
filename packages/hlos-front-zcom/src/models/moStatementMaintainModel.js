/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-02 15:02:27
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-04 14:35:06
 */
import { getResponse } from 'utils/utils';
import {
  saveVerificationOrder,
  deleteVerificationOrder,
  submitVerificationOrder,
  saveCreatePo,
} from '@/services/moStatementMaintainService';

export default {
  namespace: 'moStatementMaintain',
  state: {
    currentTab: 'create',
    ids: [],
  },
  effects: {
    // 保存
    *saveVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(saveVerificationOrder, payload));
    },
    // 保存并创建PO
    *saveCreatePo({ payload }, { call }) {
      return getResponse(yield call(saveCreatePo, payload));
    },
    // 提交
    *submitVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(submitVerificationOrder, payload));
    },
    // 批量删除
    *deleteVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(deleteVerificationOrder, payload));
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
