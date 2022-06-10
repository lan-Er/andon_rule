import { getResponse } from 'utils/utils';
import {
  vmiApplySave,
  vmiApplysSubmit,
  vmiApplysDelete,
  vmiApplyLinesDelete,
  vmiApplyReceive,
} from '@/services/vmiMaterialsApplyService';

export default {
  namespace: 'vmiMaterialsApply',
  state: {},
  effects: {
    // 保存申请单
    *vmiApplySave({ payload }, { call }) {
      return getResponse(yield call(vmiApplySave, payload));
    },
    // 批量提交申请单
    *vmiApplysSubmit({ payload }, { call }) {
      return getResponse(yield call(vmiApplysSubmit, payload));
    },
    // 批量删除申请单
    *vmiApplysDelete({ payload }, { call }) {
      return getResponse(yield call(vmiApplysDelete, payload));
    },
    // 删除申请单行
    *vmiApplyLinesDelete({ payload }, { call }) {
      return getResponse(yield call(vmiApplyLinesDelete, payload));
    },
    // 物料接收
    *vmiApplyReceive({ payload }, { call }) {
      return getResponse(yield call(vmiApplyReceive, payload));
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
