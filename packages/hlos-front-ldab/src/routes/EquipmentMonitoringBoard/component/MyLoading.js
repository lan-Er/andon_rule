/*
 * @module: 加载动画
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-25 10:03:28
 * @LastEditTime: 2021-01-25 15:42:24
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import { Spin } from 'choerodon-ui';

import style from './index.module.less';

export default function MyLoading() {
  return (
    <div className={style['my-right-loading']}>
      <Spin tip="Loading..." />
    </div>
  );
}
