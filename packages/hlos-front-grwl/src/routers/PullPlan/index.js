/*
 * @module: 广日物流N端-拉货计划
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 14:36:21
 * @LastEditTime: 2021-04-28 10:07:39
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import { Provider } from 'mobx-react';

import store from './store/mobxStore';
import PullPlanTable from './list/index';

export default function PullPlan() {
  return (
    <Provider store={store}>
      <PullPlanTable />
    </Provider>
  );
}
