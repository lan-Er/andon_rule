/*
 * @Description: 执行页面头部组件
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-21 16:24:26
 */
import React from 'react';

import { Clock } from './clock.js';
import logo from '../assets/logo.svg';

// 头部组件
export default function Head() {
  return (
    <div className="header">
      <img src={logo} alt="logo" />
      <Clock />
    </div>
  );
}
