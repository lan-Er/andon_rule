import { getResponse } from 'utils/utils';
import {
  saveVerificationOrder,
  batchReleaseVerificationOrder,
  deleteVerificationOrder,
  getSettingDetail,
} from '@/services/statementMaintainService';

export default {
  namespace: 'statementMaintain',
  state: {
    currentTab: 'create',
    ids: [],
  },
  effects: {
    // 保存或提交
    *saveVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(saveVerificationOrder, payload));
    },
    // 批量提交
    *batchReleaseVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(batchReleaseVerificationOrder, payload));
    },
    // 批量删除
    *deleteVerificationOrder({ payload }, { call }) {
      return getResponse(yield call(deleteVerificationOrder, payload));
    },
    // 获取配置明细
    *getSettingDetail({ payload }, { call }) {
      return getResponse(yield call(getSettingDetail, payload));
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
