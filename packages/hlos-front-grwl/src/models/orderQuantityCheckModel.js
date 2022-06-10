/*
 * @module: 订单数据检查
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-17 10:25:23
 * @LastEditTime: 2021-05-17 17:19:58
 * @copyright: Copyright (c) 2020,Hand
 */
import { getResponse } from 'utils/utils';
import { examinationServices, itemPrint } from '../services/orderQuantityCheckServices';

export default {
  namespace: 'orderQuantityCheckModel',
  state: {},
  effects: {
    // 检查操作
    *handleExamination({ payload }, { call }) {
      return getResponse(yield call(examinationServices, payload));
    },
    *handleItemPrint({ payload }, { call }) {
      return getResponse(yield call(itemPrint, payload));
    },
  },
};
