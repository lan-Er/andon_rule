/*
 * @Description: 在库检验
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-19 17:55:27
 */

export default {
  namespace: 'InStockInspectionModel',
  state: {
    stockInspection: {
      list: [],
      timeToggle: '',
      loading: false,
      totalCount: 0,
      currentPage: 0,
      showMore: false,
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