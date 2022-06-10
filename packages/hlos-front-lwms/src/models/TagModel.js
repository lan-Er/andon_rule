/*
 * @Description: TagModel
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-25 15:25:47
 */

export default {
  namespace: 'TagModel',
  state: {
    tagDataObj: {
      hidden: true,
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
