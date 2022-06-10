/*
 * @module-: 中间内容
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-27 15:28:22
 * @LastEditTime: 2020-07-29 18:05:03
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';

import style from './index.less';
import MyContentLeft from './MyContentLeft/index';
import MyContentCenter from './MyContentCenter/index';
import MyContentRight from './MyContentRight/index';

export default class MyContentHeader extends Component {
  render() {
    return (
      <div className={style['my-content-right-layout-content']}>
        <div className={style['my-layout-left-position']}>
          <MyContentLeft />
        </div>
        <div className={style['my-layout-center-position']}>
          <MyContentCenter />
        </div>
        <div className={style['my-layout-right-position']}>
          <MyContentRight />
        </div>
      </div>
    );
  }
}
