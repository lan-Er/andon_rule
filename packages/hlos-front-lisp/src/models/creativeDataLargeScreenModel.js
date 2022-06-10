/*
 * @module-: 创效大屏
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-30 11:01:29
 * @LastEditTime: 2020-07-31 16:54:54
 * @copyright: Copyright (c) 2018,Hand
 */

export default {
  namespace: 'CreativeDataLargeScreenModel',
  state: { informationSummary: {}, supplierList: [] },
  reducers: {
    // 更新数据统计
    updateInformationSummary(state, { payload }) {
      let _state = JSON.parse(JSON.stringify(state));
      _state = {
        ..._state,
        informationSummary: payload.informationSummary,
        supplierList: payload.supplierList,
      };
      return {
        ..._state,
      };
    },
  },
};
