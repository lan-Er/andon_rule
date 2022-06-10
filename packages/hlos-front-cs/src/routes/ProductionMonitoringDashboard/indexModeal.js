/*
 * @module-: 展示页面
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-06 15:14:46
 * @LastEditTime: 2020-11-17 18:08:54
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { Component } from 'react';

import Index from './index';
// import IndexPortals from './indexPortals';
import FullScreenContainer from '../../common/kanbanViewport/fullScreenContainer';

export default class IndexModeal extends Component {
  render() {
    return (
      <FullScreenContainer>
        <Index />
      </FullScreenContainer>
    );
  }
}
