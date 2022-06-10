/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-26 16:11:42
 */
/**
 * @Description: 发货单 model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-27 13:40:59
 */

import { getResponse } from 'utils/utils';
import {
  createShipOrder,
  submitShipOrderApi,
  deleteShipOrderApi,
  executeShipOrderApi,
  changeHeadStatusApi,
  deleteShipOrderLineApi,
  changeLineStatusApi,
  relationShipOrderAPI,
} from '../services/shipPlatformService';

export default {
  namespace: 'ShipPlatform',
  state: {},
  effects: {
    // 创建发货单
    *createShipOrder({ payload }, { call }) {
      return getResponse(yield call(createShipOrder, payload));
    },
    // 提交发货单
    *submitShipOrder({ payload }, { call }) {
      return getResponse(yield call(submitShipOrderApi, payload));
    },
    // 删除发货单
    *deleteShipOrder({ payload }, { call }) {
      return getResponse(yield call(deleteShipOrderApi, payload));
    },
    // 执行发货单
    *executeShipOrder({ payload }, { call }) {
      return getResponse(yield call(executeShipOrderApi, payload));
    },
    // 关联
    *relationShipOrder({ payload }, { call }) {
      return getResponse(yield call(relationShipOrderAPI, payload));
    },
    // 改变头状态
    *changeHeadStatus({ payload }, { call }) {
      return getResponse(yield call(changeHeadStatusApi, payload));
    },
    // 删除发货单行
    *deleteShipOrderLine({ payload }, { call }) {
      return getResponse(yield call(deleteShipOrderLineApi, payload));
    },
    // 改变行状态
    *changeLineStatus({ payload }, { call }) {
      return getResponse(yield call(changeLineStatusApi, payload));
    },
  },
};
