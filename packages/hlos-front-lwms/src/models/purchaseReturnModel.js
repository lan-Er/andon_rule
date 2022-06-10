/*
 * @Description: 采购退货单
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-08 14:55:22
 */

export default {
  namespace: 'PurchaseReturnModel',
  state: {
    purchaseModelData: {
      showFlag: false,
      inProgress: false,
      deliveryReturnId: null,
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
