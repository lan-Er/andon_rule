/*
 * @module-:发货任务看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 13:53:01
 * @LastEditTime: 2020-11-09 14:32:50
 * @copyright: Copyright (c) 2018,Hand
 */
import { getResponse } from 'utils/utils';

import {
  queryTaskBoard,
  queryPending,
  queryReadyToGo,
  querySent,
  queryPieList,
} from '../services/shipmentTaskServices';

export default {
  namespace: 'shipmentTaskModel',
  state: {},
  effects: {
    // 获取发货任务看板数据
    *getTaskBoard({ payload }, { call }) {
      return getResponse(yield call(queryTaskBoard, payload));
    },
    // 获取中间左侧数据
    *getPending({ payload }, { call }) {
      return getResponse(yield call(queryPending, payload));
    },
    // 获取低部左侧数据
    *getReadyToGo({ payload }, { call }) {
      return getResponse(yield call(queryReadyToGo, payload));
    },
    // 获取低部右侧数据
    *getSent({ payload }, { call }) {
      return getResponse(yield call(querySent, payload));
    },
    // 获取中间右侧饼图数据
    *getPieList({ payload }, { call }) {
      return getResponse(yield call(queryPieList, payload));
    },
  },
};
