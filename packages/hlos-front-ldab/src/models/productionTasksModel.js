/*
 * @module-: 生产看板配置
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-28 16:59:49
 * @LastEditTime: 2020-10-30 14:44:44
 * @copyright: Copyright (c) 2018,Hand
 */
export default {
  namespace: 'productionTasksModel',
  state: { resetStatus: false },
  reducers: {
    // 添加检验单信息
    inspectionOrderInformation(state, { payload }) {
      const returnState = {
        ...state,
        lines: { ...state.lines, [payload.lines.id]: payload.lines },
      };
      return {
        ...returnState,
      };
    },
    // 添加生产概况
    addProductionOverview(state, { payload }) {
      const returnState = {
        ...state,
        productionOverview: {
          ...state.productionOverview,
          [payload.productionOverview.id]: payload.productionOverview,
        },
      };
      return {
        ...returnState,
      };
    },
    // 安灯信息
    addProductionMonitorAndon(state, { payload }) {
      const returnState = {
        ...state,
        rightScrollList: {
          ...state.rightScrollList,
          [payload.addProductionMonitorAndon.id]: payload.addProductionMonitorAndon,
        },
      };
      return {
        ...returnState,
      };
    },
    // 重置
    handleReset(state, { payload }) {
      const returnState = {
        ...state,
        resetStatus: payload.status,
      };
      return {
        ...returnState,
      };
    },
  },
};
