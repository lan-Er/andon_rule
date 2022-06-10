/*
 * @Description: 采购订单Model
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-14 15:07:29
 */

export default {
  namespace: 'PurchaseOrderModel',
  state: {
    purchaseOrderModelData: {
      ToPoHeaderId: -1,
      poHeaderRecord: {},
      MoreQuery: false,
      showLoading: false,
      showLineLoading: false,
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
      checkRecords: [],
      checkLineRecords: [],
      queryStatus: 'refresh',
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
