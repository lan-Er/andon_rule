/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-25 10:00:09
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-02-01 11:49:44
 */
import { getResponse } from 'utils/utils';
import {
  saveDeliveryOrder,
  releaseDeliveryOrder,
  batchReleaseDeliveryOrder,
  deleteDeliveryOrder,
  updateLogisticss,
  moDeliveryPrint,
  revocable,
} from '@/services/moDeliveryMaintainService';

export default {
  namespace: 'moDeliveryMaintain',
  state: {
    currentTab: 'create',
    ids: [],
  },
  effects: {
    // 保存
    *saveDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(saveDeliveryOrder, payload));
    },
    // 保存并提交
    *releaseDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(releaseDeliveryOrder, payload));
    },
    // 批量提交
    *batchReleaseDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(batchReleaseDeliveryOrder, payload));
    },
    // 批量删除
    *deleteDeliveryOrder({ payload }, { call }) {
      return getResponse(yield call(deleteDeliveryOrder, payload));
    },
    // 修改物流信息
    *updateLogisticss({ payload }, { call }) {
      return getResponse(yield call(updateLogisticss, payload));
    },
    // 送货单查询打印信息
    *moDeliveryPrint({ payload }, { call }) {
      return getResponse(yield call(moDeliveryPrint, payload));
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
