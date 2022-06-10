/*
 * @Module: 销售退货单平台
 * @Author: 那宇 <u.na@hand-china.com>
 * @Date: 2019-11-19 19:39:48
 */
import { unionBy } from 'lodash';
import { getResponse } from 'utils/utils';
import { querySalesOrder } from '../services/shipReturnService';

export default {
  namespace: 'shipReturn',
  state: {
    salesOrderList: [],
    taskList: [],
    lineList: [],
    paginations: {},
    linePaginations: {},
    currentHeadData: {},
  },
  effects: {
    // 查询销售订单
    *querySalesOrder({ payload }, { call, put }) {
      const { concatFlag, _salesOrderList, ...params } = payload;
      const res = getResponse(yield call(querySalesOrder, params));
      let list = res.content;
      if (concatFlag) {
        list = unionBy(_salesOrderList, res.content, 'soLineId');
      }
      yield put({
        type: 'updateState',
        payload: {
          salesOrderList: list,
        },
      });
    },
    // 重置销售订单数据
    *initialSalesOrder(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          salesOrderList: [],
        },
      });
    },
    // 更新销售订单数据
    *updateSalesOrder({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          salesOrderList: payload,
        },
      });
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
