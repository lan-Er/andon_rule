/*
 * @module: 全屏适配
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-18 15:01:45
 * @LastEditTime: 2021-01-18 15:10:39
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import FullScreenContainer from '@/common/kanbanViewport/fullScreenContainer';

import style from './index.module.less';

export default function MyModal(props) {
  return (
    <FullScreenContainer>
      <div className={style['equipment-monitoring-board']}>{props.children}</div>
    </FullScreenContainer>
  );
}
