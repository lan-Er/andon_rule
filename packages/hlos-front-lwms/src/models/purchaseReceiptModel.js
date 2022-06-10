/*
 * @Module: 采购接收 Model
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-06 18:22:01
 * @LastEditors: 赵敏捷
 */

import { getResponse } from 'utils/utils';
import uuidv4 from 'uuid/v4';
import { queryLineList, submitLines } from '../services/purchaseReceiptServices';

const _updateState = function* _({ payload }, { put }) {
  yield put({
    type: 'updateState',
    payload,
  });
};

export default {
  namespace: 'purchaseReceipt',
  state: {
    // 记录行
    recList: [],
    // 选中记录行 uuid
    selectedKeys: [],
    // 弹窗数据 DS 存储
    dataSetDataArr: [], // <Array>{ key: string, form: DataSet, table: DataSet }
    // 物料控制类型为数量记录计数存储
    quantityRecCount: [], // <Array> { key: string, receivedQty: number }
  },
  effects: {
    *fetchLines({ payload }, { put, call }) {
      const res = getResponse(yield call(queryLineList, payload));
      const recList = res?.content.map((i) => ({ ...i, key: uuidv4() })) || [];
      const quantityRecCount = recList.map((i) => ({
        key: i.key,
        value: (i.demandQty || 0) - (i.receivedQty || 0),
      }));
      yield put({
        type: 'updateState',
        payload: {
          recList,
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          quantityRecCount,
        },
      });
      return res;
    },
    *updateQuantityRecCount({ payload }, { put }) {
      yield put({
        type: '_updateQuantityRecCount',
        payload,
      });
    },
    *submitLines({ payload }, { call }) {
      return getResponse(yield call(submitLines, payload));
    },
    *initialState(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          // 记录行
          recList: [],
          // 选中记录行 uuid
          selectedKeys: [],
          // 弹窗数据 DS 存储
          dataSetDataArr: [], // <Array>{ key: string, form: DataSet, table: DataSet }
          // 物料控制类型为数量记录计数存储
          quantityRecCount: [], // <Array> { key: string, receivedQty: number }
        },
      });
    },
    updateSelectedList: _updateState,
    updateDataSetDataArr: _updateState,
    updateRecList: _updateState,
  },
  reducers: {
    _updateQuantityRecCount(state, { payload }) {
      const { key, value } = payload;
      const { quantityRecCount } = state;
      const tmpCount = quantityRecCount.slice();
      const index = tmpCount.findIndex((i) => i.key === key);
      tmpCount.splice(index, 1, { key, value });
      return {
        ...state,
        quantityRecCount: tmpCount,
      };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
