/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-25 10:00:09
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-02-04 18:48:35
 */
import { getResponse } from 'utils/utils';
import {
  saveItemRefunds,
  deleteItemRefunds,
  deleteLineItemRefunds,
  updateLogisticss,
  itemRefundPrint,
  revocable,
} from '@/services/customerReturnService';

export default {
  namespace: 'customerRefund',
  state: {
    currentTab: 'create',
    ids: [],
  },
  effects: {
    // 保存
    *saveItemRefunds({ payload }, { call }) {
      return getResponse(yield call(saveItemRefunds, payload));
    },
    // 批量删除头
    *deleteItemRefunds({ payload }, { call }) {
      return getResponse(yield call(deleteItemRefunds, payload));
    },
    // 批量删除行
    *deleteLineItemRefunds({ payload }, { call }) {
      return getResponse(yield call(deleteLineItemRefunds, payload));
    },
    // 退料单打印
    *itemRefundPrint({ payload }, { call }) {
      return getResponse(yield call(itemRefundPrint, payload));
    },
    // 物料信息更新
    *updateLogisticss({ payload }, { call }) {
      return getResponse(yield call(updateLogisticss, payload));
    },
    // 撤回
    *revocable({ payload }, { call }) {
      return getResponse(yield call(revocable, payload));
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
