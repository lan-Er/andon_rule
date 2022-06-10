/*
 * @Description: 采购接收确认 - model
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-25 17:19:51
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-25 17:21:34
 * @Copyright: Copyright (c) 2018, Hand
 */
import { getResponse } from 'utils/utils';
import { submitAPI, queryTabsQtyAPI } from '../services/purchaseReceiptConfirmationService';

export default {
  namespace: 'purchaseReceiptConfirmationModel',
  state: {},
  effects: {
    // 提交
    *submit({ payload }, { call }) {
      return getResponse(yield call(submitAPI, payload));
    },
    // 查询标签数量
    *queryTabsQty({ payload }, { call }) {
      return getResponse(yield call(queryTabsQtyAPI, payload));
    },
  },
};
