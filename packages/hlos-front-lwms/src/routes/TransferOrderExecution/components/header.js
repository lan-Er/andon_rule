/*
 * @Description: 转移单执行界面头部组件
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-05 09:37:39
 */
import React from 'react';

import logo from 'hlos-front/lib/assets/icons/logo.svg';
import { Clock } from './clock.js';
import style from '../index.less';

export default function Header() {
  return (
    <div className={style['pub-header']}>
      <img src={logo} alt="logo" />
      <Clock />
    </div>
  );
}
