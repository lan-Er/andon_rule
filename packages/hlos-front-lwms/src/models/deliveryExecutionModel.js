/*
 * @Module: 发货执行 Model
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-14 16:24:01
 * @LastEditors: 赵敏捷
 */

import { getResponse } from 'utils/utils';
import { queryList, queryDetail } from '../services/deliveryExecutionService';

export default {
  namespace: 'deliveryExecution',
  state: {
    /**
     * 发货数据集合
     * Array<{
     *  // 发货行原数据 key - shipLineId
     *  key: string,
     *  // 发货行原数据
     *  orginalData: object,
     *  // 弹窗勾选数据
     *  selectedData: Array<{
     *    [key: string]: stirng
     *  }>
     * }>
     */
    submitData: [],
    // 物料控制类型为 QUANTITY 的数据集
    partialSubmitData: [],
    selectedIds: [],
  },
  effects: {
    *fetchLines({ payload }, { call }) {
      return getResponse(yield call(queryList, payload));
    },
    *fetchDetail({ payload }, { call }) {
      return getResponse(yield call(queryDetail, payload));
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
