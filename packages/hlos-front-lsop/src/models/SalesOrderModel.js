/*
 * @Description: 销售订单 - model
 * @Author: tw
 * @Date: 2021-05-19 16:45:01
 */

// import { getResponse } from 'utils/utils';

export default {
  namespace: 'SalesOrderModel',
  state: {
    salesOrderModelData: {
      showFlag: false,
      showLoading: false,
      showLineLoading: false,
      soHeaderId: -1,
      dataSource: [],
      lineDataSource: [],
      currentPage: 1,
      lineCurrentPage: 1,
      size: 100,
      lineSize: 100,
      totalElements: 0,
      lineTotalElements: 0,
      tableHeight: 80,
      lineTableHeight: 80,
      checkValues: [],
    },
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
