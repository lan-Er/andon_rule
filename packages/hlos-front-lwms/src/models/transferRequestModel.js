/*
 * @Module: 转移单
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-03-09 19:39:48
 * @LastEditors: Please set LastEditors
 */

import { getResponse } from 'utils/utils';
import {
  createAndUpdateTR,
  cancelTR,
  submitTR,
  closeTR,
  deleteTR,
  executeByRequestTR,
  deleteTRLine,
  cancelTRLine,
  closeTRLine,
} from '../services/transferRequestService';

export default {
  namespace: 'transferRequest',
  state: {
    headList: [],
    lineList: [],
    pagination: {},
    linePagination: {},
    headRequestId: null,
  },
  effects: {
    // 创建/更新单据
    *createAndUpdateTR({ payload }, { call }) {
      return getResponse(yield call(createAndUpdateTR, payload));
    },
    // 取消单据
    *cancelTR({ payload }, { call }) {
      return getResponse(yield call(cancelTR, payload));
    },
    // 提交单据
    *submitTR({ payload }, { call }) {
      return getResponse(yield call(submitTR, payload));
    },
    // 关闭单据
    *closeTR({ payload }, { call }) {
      return getResponse(yield call(closeTR, payload));
    },
    // 删除单据
    *deleteTR({ payload }, { call }) {
      return getResponse(yield call(deleteTR, payload));
    },
    // 执行单据
    *executeByRequestTR({ payload }, { call }) {
      return getResponse(yield call(executeByRequestTR, payload));
    },
    // 删除单据行
    // 删除单据
    *deleteTRLine({ payload }, { call }) {
      return getResponse(yield call(deleteTRLine, payload));
    },
    // 取消单据行
    *cancelTRLine({ payload }, { call }) {
      return getResponse(yield call(cancelTRLine, payload));
    },
    // 关闭单据行
    *closeTRLine({ payload }, { call }) {
      return getResponse(yield call(closeTRLine, payload));
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
