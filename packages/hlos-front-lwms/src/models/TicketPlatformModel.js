/*
 * @Description: 送货单 - model
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-16 16:45:01
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-16 16:45:23
 * @Copyright: Copyright (c) 2018, Hand
 */

import { getResponse } from 'utils/utils';
import {
  createAndUpdateApi,
  changeLineStatueApi,
  changeHeadStatueApi,
} from '../services/TicketPlatformService';

export default {
  namespace: 'TicketPlatform',
  state: {
    ticketModelData: {
      showFlag: false,
      // inProgress: false,
      // deliveryReturnId: null,
      showLoading: false,
      showLineLoading: false,
      dataSource: [],
      lineDataSource: [],
      currentPage: 1,
      lineCurrentPage: 1,
      size: 100,
      lineSize: 100,
      totalElements: 0,
      lineTotalElements: 0,
      tableHeight: 80,
      lineTableHeight: 80,
      checkValues: [],
    },
  },
  effects: {
    // 创建/更新单据
    *createAndUpdate({ payload }, { call }) {
      return getResponse(yield call(createAndUpdateApi, payload));
    },
    // 关闭单据行
    *changeLineStatus({ payload }, { call }) {
      return getResponse(yield call(changeLineStatueApi, payload));
    },
    // 关闭单据头
    *changeHeadStatus({ payload }, { call }) {
      return getResponse(yield call(changeHeadStatueApi, payload));
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
