/*
 * @Module: 非生产任务
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2021-05-12 10:04:48
 */

export default {
  namespace: 'npTask',
  state: {
    taskList: [],
    paginations: {},
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
