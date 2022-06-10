import { getResponse } from 'utils/utils';
import { queryTabsQtyAPI } from '../services/salesOrderPerformService';

export default {
  namespace: 'SalesOrderPerformModel',
  state: {},
  effects: {
    // 查询标签数量
    *queryTabsQty({ payload }, { call }) {
      return getResponse(yield call(queryTabsQtyAPI, payload));
    },
  },
};
