import { getResponse } from 'utils/utils';
import { queryTabsQtyAPI } from '../services/salesOrderDetailsService';

export default {
  namespace: 'SalesOrderDetailsModel',
  state: {},
  effects: {
    // 查询标签数量
    *queryTabsQty({ payload }, { call }) {
      return getResponse(yield call(queryTabsQtyAPI, payload));
    },
  },
};
