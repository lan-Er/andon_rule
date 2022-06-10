/*
 * @module: 发货单
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-20 10:45:41
 * @LastEditTime: 2021-04-28 14:44:55
 * @copyright: Copyright (c) 2020,Hand
 */
import { getResponse } from 'utils/utils';
import {
  createShipOrder,
  submitShipOrderApi,
  deleteShipOrderApi,
  cancelexecuteShipOrderApi,
  executeShipOrderApi,
  changeHeadStatusApi,
  deleteShipOrderLineApi,
  changeLineStatusApi,
  getItemPrintList,
} from '../services/shipPlatformService';

export default {
  namespace: 'grwlShipPlatformModel',
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
    // 取消执行发货单
    *cancelexecuteShipOrder({ payload }, { call }) {
      return getResponse(yield call(cancelexecuteShipOrderApi, payload));
    },
    // 执行发货单
    *executeShipOrder({ payload }, { call }) {
      return getResponse(yield call(executeShipOrderApi, payload));
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
    *getItemPrintList({ payload }, { call }) {
      return getResponse(yield call(getItemPrintList, payload));
    },
  },
};
