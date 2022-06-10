/*
 * @Descripttion: 配置中心
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-22 11:36:40
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2020-12-23 09:59:31
 */
import { getResponse } from 'utils/utils';
import { orderConfigDetails } from '../services/configurationCenter';

export default {
  namespace: 'configurationCenterModel',
  state: {},
  effects: {
    // 保存核企侧订单明细规则配置
    *orderConfigDetails({ payload }, { call }) {
      return getResponse(yield call(orderConfigDetails, payload));
    },
  },
};
