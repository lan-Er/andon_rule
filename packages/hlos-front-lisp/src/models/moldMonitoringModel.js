/*
 * @module-: 模具监控
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-27 15:58:38
 * @LastEditTime: 2020-06-27 20:23:57
 * @copyright: Copyright (c) 2018,Hand
 */

export default {
  namespace: 'MoldMonitoringModel',
  state: { name: '' },
  reducers: {
    // 更新用户信息
    updateMold(state, { payload }) {
      let _state = JSON.parse(JSON.stringify(state));
      _state = { ..._state, name: payload.name, getModalDataList: payload.data };
      return {
        ..._state,
      };
    },
  },
};
