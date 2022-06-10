/*
 * @module-:晨会看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-17 17:22:21
 * @LastEditTime: 2020-11-17 18:12:10
 * @copyright: Copyright (c) 2018,Hand
 */
import React from 'react';

import Index from './index';
import FullScreenContainer from '../../common/kanbanViewport/fullScreenContainer';

export default function IndexModel(props) {
  return (
    <FullScreenContainer>
      <Index props={props} />
    </FullScreenContainer>
  );
}
