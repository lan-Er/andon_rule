/*
 * @Module: 采购接收入库/到货入库
 * @Author: yu.na <yu.na@hand-china.com>
 * @Date: 2020-09-21 19:39:48
 * @LastEditors: yu.na
 */

import { getResponse } from 'utils/utils';
import { queryDocReservation } from '@/services/purchaseReceiveInventoryService';

export default {
  namespace: 'purchaseReceiveInventory',
  state: {
    modalList: [],
    totalNum: 0,
    totalElements: 0,
    ticketList: [],
  },
  effects: {
    // 查询标签弹窗列表
    *updateDocReservation({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDocReservation, payload));
      let num = 0;
      if (res && res.content && Array.isArray(res.content)) {
        res.content.forEach((i) => {
          const _i = i;
          num += _i.reservationQty;
          if (payload.lotFlag) {
            _i.inventoryQty = 0;
          } else {
            _i.inventoryQty = _i.reservationQty;
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            modalList: res.content,
            totalNum: num,
            totalElements: res.totalElements,
          },
        });
      }
      return res.content;
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
