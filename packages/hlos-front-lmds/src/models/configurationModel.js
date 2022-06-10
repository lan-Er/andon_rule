/*
 * @Description: 个性化配置 - model
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-09 17:41:38
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-09 17:42:37
 * @Copyright: Copyright (c) 2018, Hand
 */

import { getResponse } from 'utils/utils';
import { saveTemplate, queryAssignLine, saveAssignDetail } from '../services/configurationService';

export default {
  namespace: 'configuration',
  state: {},
  effects: {
    // 保存模版
    *saveTemplate({ payload }, { call }) {
      return getResponse(yield call(saveTemplate, payload));
    },
    // 查询分配详情行
    *saveAssignLine({ payload }, { call }) {
      return getResponse(yield call(queryAssignLine, payload));
    },
    // 保存分配详情
    *saveAssignDetail({ payload }, { call }) {
      return getResponse(yield call(saveAssignDetail, payload));
    },
  },
};
