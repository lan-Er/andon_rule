/**
 * @Description: 客户订单Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 14:07:21
 */

import { getResponse } from 'utils/utils';
import {
  saleTemplates,
  cancelTemplates,
  createSaleTemplates,
  deletePredictionTask,
  submitTask,
} from '@/services/saleTemplateService';

export default {
  namespace: 'saleTemplateModel',
  state: {},
  effects: {
    *saleTemplates({ payload }, { call }) {
      return getResponse(yield call(saleTemplates, payload));
    },
    *cancelTemplates({ payload }, { call }) {
      return getResponse(yield call(cancelTemplates, payload));
    },
    *createSaleTemplates({ payload }, { call }) {
      return getResponse(yield call(createSaleTemplates, payload));
    },
    *deletePredictionTask({ payload }, { call }) {
      return getResponse(yield call(deletePredictionTask, payload));
    },
    *submitTask({ payload }, { call }) {
      return getResponse(yield call(submitTask, payload));
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
