/*
 * @module-: 传送门
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-06 15:06:07
 * @LastEditTime: 2020-10-08 14:34:39
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';

export default class IndexPortals extends PureComponent {
  render() {
    return createPortal(
      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: '99',
        }}
        id="kanban"
      >
        {this.props.children}
      </div>,
      document.body
    );
  }
}
