/*
 * @module-: 核企监控大屏-内容区域
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-27 15:12:15
 * @LastEditTime: 2020-07-29 13:44:09
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';

import style from './index.less';
import MyContentHeader from './MyContentHeader/index';
import MyContentBottom from './MyContentBottom/index';

export default class MyContent extends Component {
  render() {
    return (
      <div className={style['my-content-parents']}>
        <MyContentHeader />
        <MyContentBottom />
      </div>
    );
  }
}
