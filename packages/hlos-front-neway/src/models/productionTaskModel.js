/*
 * @Module: 生产任务
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-01-19 10:04:48
 */

export default {
  namespace: 'productionTask',
  state: {
    taskList: [],
    lineList: [],
    paginations: {},
    linePaginations: {},
  },
  effects: {},
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
