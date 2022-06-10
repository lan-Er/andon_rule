/**
 * @Description: 权限model
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-16 15:34:35
 * @LastEditors: yu.na
 */

import { getResponse } from 'utils/utils';
import {
  sync,
} from '../services/privilegeService';

export default {
  namespace: 'privilege',
  state: {},
  effects: {
    // 同步权限
    *sync({ payload }, { call }) {
      const res = getResponse(yield call(sync, payload));
      return res;
    },

  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
