/*
 * @module-:中天晨会看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-16 16:23:57
 * @LastEditTime: 2020-11-25 16:08:33
 * @copyright: Copyright (c) 2018,Hand
 */
import { getResponse } from 'utils/utils';
import { saveDashboardImg } from '../services/workshopMorningMeetConfig';

export default {
  namespace: 'workshopMorningConfigModel',
  state: {},
  effects: {
    // 晨会看板配置提交图片
    *saveWorkShopMorningBoardImgList({ payload }, { call }) {
      return getResponse(yield call(saveDashboardImg, payload));
    },
  },
};
