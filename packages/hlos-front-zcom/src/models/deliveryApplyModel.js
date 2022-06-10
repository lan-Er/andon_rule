/**
 * @Description: 发货申请Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 16:23:40
 */

import { getResponse } from 'utils/utils';
import {
  saveDeliveryApply,
  updateDeliveryApply,
  releaseDeliveryApply,
  verifyDeliveryApply,
  createByDeliveryApply,
  cancelDeliveryApply,
  copyLine,
  deleteLine,
  createDyelotNumber,
  getPrintrules,
} from '@/services/deliveryApplyService';

export default {
  namespace: 'deliveryApply',
  state: {
    currentTab: 'self',
  },
  effects: {
    // 保存
    *saveDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(saveDeliveryApply, payload));
    },
    // 更新
    *updateDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(updateDeliveryApply, payload));
    },
    // 保存并提交
    *releaseDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(releaseDeliveryApply, payload));
    },
    // 审核
    *verifyDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(verifyDeliveryApply, payload));
    },
    // 基于发货申请单创建发货单
    *createByDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(createByDeliveryApply, payload));
    },
    // 取消
    *cancelDeliveryApply({ payload }, { call }) {
      return getResponse(yield call(cancelDeliveryApply, payload));
    },
    // 拆行
    *copyLine({ payload }, { call }) {
      return getResponse(yield call(copyLine, payload));
    },
    // 删除行
    *deleteLine({ payload }, { call }) {
      return getResponse(yield call(deleteLine, payload));
    },
    // 生成缸号
    *createDyelotNumber({ payload }, { call }) {
      return getResponse(yield call(createDyelotNumber, payload));
    },
    *getPrintrules({ payload }, { call }) {
      return getResponse(yield call(getPrintrules, payload));
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
