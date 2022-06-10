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
  queryBoardInspector,
  queryBoardIqcChecked,
  queryBoardPqcChecked,
  queryBoardPqcPending,
  queryBoardIqcPending,
} from '../services/qualityInspectionTaskService';

export default {
  namespace: 'qualityInspectionTask',
  state: {},
  effects: {
    // 获取任务看板数据
    *getTaskBoard({ payload }, { call }) {
      return getResponse(yield call(queryBoardAmount, payload));
    },
    // 检验单检验人统计
    *queryBoardInspector({ payload }, { call }) {
      return getResponse(yield call(queryBoardInspector, payload));
    },
    // 检验单IQC已检情况
    *queryBoardIqcChecked({ payload }, { call }) {
      return getResponse(yield call(queryBoardIqcChecked, payload));
    },
    // 检验单IQC待检情况
    *queryBoardIqcPending({ payload }, { call }) {
      return getResponse(yield call(queryBoardIqcPending, payload));
    },
    // 检验单PQC已检情况
    *queryBoardPqcChecked({ payload }, { call }) {
      return getResponse(yield call(queryBoardPqcChecked, payload));
    },
    // 检验单PQC待检情况
    *queryBoardPqcPending({ payload }, { call }) {
      return getResponse(yield call(queryBoardPqcPending, payload));
    },
    // 获取用户默认设置
    *getUserSetting({ payload }, { call }) {
      return getResponse(yield call(userSetting, payload));
    },
  },
};
