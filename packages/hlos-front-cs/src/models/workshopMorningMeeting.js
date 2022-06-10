/*
 * @module-:晨会看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-13 14:17:38
 * @LastEditTime: 2020-12-25 10:14:01
 * @copyright: Copyright (c) 2018,Hand
 */
import { getResponse } from 'utils/utils';
import { queryDashboard, upDateStatus } from '../services/workshopMorningMeetingBoard';

export default {
  namespace: 'workshopMorningMeeting',
  state: {},
  effects: {
    // 查询晨会看板数据
    *getWorkShopMorningBoard({ payload }, { call }) {
      return getResponse(yield call(queryDashboard, payload));
    },
    // 更新状态
    *updateWorkShopMorningStatus({ payload }, { call }) {
      return getResponse(yield call(upDateStatus, payload));
    },
  },
};
