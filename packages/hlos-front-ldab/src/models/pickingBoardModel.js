/*
 * @module-:发货任务看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 13:53:01
 * @LastEditTime: 2020-11-09 14:32:50
 * @copyright: Copyright (c) 2018,Hand
 */
import { getResponse } from 'utils/utils';

import { userSetting } from 'hlos-front/lib/services/api';

import {
  queryBoardAmount,
  queryBoardReleased,
  queryBoardNoProduct,
  queryBoardPicked,
  queryBoardExecuted,
} from '../services/pickingBoardService';

export default {
  namespace: 'pickingBoardModel',
  state: {},
  effects: {
    // 获取任务看板数据
    *getTaskBoard({ payload }, { call }) {
      return getResponse(yield call(queryBoardAmount, payload));
    },
    // 获取中间左侧数据
    *getPending({ payload }, { call }) {
      return getResponse(yield call(queryBoardReleased, payload));
    },
    // 获取低部左侧数据
    *getReadyToGo({ payload }, { call }) {
      return getResponse(yield call(queryBoardPicked, payload));
    },
    // 获取低部右侧数据
    *getSent({ payload }, { call }) {
      return getResponse(yield call(queryBoardNoProduct, payload));
    },
    // 获取中间右侧数据
    *getPieList({ payload }, { call }) {
      return getResponse(yield call(queryBoardExecuted, payload));
    },
    // 获取用户默认设置
    *getUserSetting({ payload }, { call }) {
      return getResponse(yield call(userSetting, payload));
    },
  },
};
