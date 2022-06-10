/*
 * @module-:中天班组看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-25 16:08:15
 * @LastEditTime: 2020-11-25 16:09:53
 * @copyright: Copyright (c) 2018,Hand
 */
import { getResponse } from 'utils/utils';
import { getTeamDashboardImg } from '../services/teamMorningMeetingBoard';

export default {
  namespace: 'teamMorningMeetingBoardModels',
  state: {},
  effects: {
    // 班组晨会看板配置提交图片
    *getTeamBoardImgList({ payload }, { call }) {
      return getResponse(yield call(getTeamDashboardImg, payload));
    },
  },
};
