/**
 * @Description: 非生产任务报工
 * @Author: liYuan.liu<liu.liyuan@hand-china.com>
 * @Date: 2020-12-23
 * @LastEditors: liYuan.liu
 */

import { getResponse } from 'utils/utils';
import { queryNonproductionTask } from '../services/NonproductionTaskService';

export default {
  namespace: 'nonproductionTaskReportModel',
  state: {},
  effects: {
    // 查询
    *queryNonproductionTask({ payload }, { call }) {
      return getResponse(yield call(queryNonproductionTask, payload));
    },
  },
};
