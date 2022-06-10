/*
 * @module-:班组晨会看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-24 11:33:53
 * @LastEditTime: 2020-11-24 14:26:29
 * @copyright: Copyright (c) 2018,Hand
 */
import React from 'react';

import FullScreenContainer from '../../common/kanbanViewport/fullScreenContainer';

import MyContent from './MyContent';

export default function TeamMorningMeetingBoard(props) {
  return (
    <FullScreenContainer>
      <MyContent myProps={props} />
    </FullScreenContainer>
  );
}
