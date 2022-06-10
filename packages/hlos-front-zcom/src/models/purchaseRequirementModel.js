import { getResponse } from 'utils/utils';
import { createSoAPI, releaseAPI, confirmAPI } from '../services/purchaseRequirementService';

export default {
  namespace: 'purchaseRequirementModel',
  state: {},
  effects: {
    // 新建采购订单
    *createSo({ payload }, { call }) {
      return getResponse(yield call(createSoAPI, payload));
    },
    // 发布
    *release({ payload }, { call }) {
      return getResponse(yield call(releaseAPI, payload));
    },
    // 确认
    *confirm({ payload }, { call }) {
      return getResponse(yield call(confirmAPI, payload));
    },
  },
};
