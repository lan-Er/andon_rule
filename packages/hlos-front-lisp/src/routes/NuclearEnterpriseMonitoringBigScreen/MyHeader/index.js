/*
 * @module-: 核企监控大屏-头部
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-25 18:04:33
 * @LastEditTime: 2020-07-29 09:59:41
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';

import style from './index.less';
import HeaderIage from '../assets/images/header-background.svg';

export default class MyHeader extends Component {
  render() {
    return (
      <div className={style['nuclear-supply-header']}>
        <img src={HeaderIage} alt="头部图片" className={style['nuclear-supply-header-img']} />
        <div className={style['nuclear-supply-header-title']}>工业互联网产业链融合创效数据大屏</div>
      </div>
    );
  }
}
