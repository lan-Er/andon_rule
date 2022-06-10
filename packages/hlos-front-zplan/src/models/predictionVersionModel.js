/**
 * @Description: 预测版本Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-23 14:57:58
 */

import { getResponse } from 'utils/utils';
import {
  createDateGap,
  createVersion,
  updateVersion,
  deleteVersion,
  operateVersion,
  clearVersionLine,
  copyVersion,
  saveSource,
} from '@/services/predictionVersionService';

export default {
  namespace: 'predictionVersion',
  state: {},
  effects: {
    *createDateGap({ payload }, { call }) {
      return getResponse(yield call(createDateGap, payload));
    },
    *createVersion({ payload }, { call }) {
      return getResponse(yield call(createVersion, payload));
    },
    *updateVersion({ payload }, { call }) {
      return getResponse(yield call(updateVersion, payload));
    },
    *deleteVersion({ payload }, { call }) {
      return getResponse(yield call(deleteVersion, payload));
    },
    *operateVersion({ payload }, { call }) {
      return getResponse(yield call(operateVersion, payload));
    },
    *clearVersionLine({ payload }, { call }) {
      return getResponse(yield call(clearVersionLine, payload));
    },
    *copyVersion({ payload }, { call }) {
      return getResponse(yield call(copyVersion, payload));
    },
    *saveSource({ payload }, { call }) {
      return getResponse(yield call(saveSource, payload));
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
