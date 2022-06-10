/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-07-25 10:23:45
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-25 10:36:08
 */

import { getResponse } from 'utils/utils';
import { orderConfirmApi } from '../services/shipOrderService';

export default {
  namespace: 'shipOrderModel',
  state: {},
  effects: {
    // 发货单确认
    *confirmApi({ payload }, { call }) {
      return getResponse(yield call(orderConfirmApi, payload));
    },
  },
};
