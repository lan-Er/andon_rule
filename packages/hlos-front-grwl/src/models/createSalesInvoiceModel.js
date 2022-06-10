/*
 * @module: 创建销售发货单
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-22 10:54:10
 * @LastEditTime: 2021-04-22 10:59:07
 * @copyright: Copyright (c) 2020,Hand
 */
import { getResponse } from 'utils/utils';
import { createShipOrder } from '../services/createSalesInvoiceService';

export default {
  namespace: 'createSalesInvoiceModel',
  state: {},
  effects: {
    // 创建发货单
    *createShipOrder({ payload }, { call }) {
      return getResponse(yield call(createShipOrder, payload));
    },
  },
};
