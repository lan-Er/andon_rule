/**
 * 完工入库单
 * @since：2021/6/2
 * @author：jxy <xiaoyan.jin@hand-china.com>
 * @copyright Copyright (c) 2021,Hand
 */

export default {
  namespace: 'finishedStorage',
  state: {
    pagination: {},
    taskList: [],
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
