/*
 * @module: 头部导航
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-20 15:15:54
 * @LastEditTime: 2021-01-20 17:15:38
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';

import style from './index.module.less';

export default function TopBanner(props) {
  return (
    <div
      className={style['my-top-banner']}
      style={{
        borderLeftColor: props.leftColor,
        background: props.bgColor,
        width: props.myWidth,
        borderLeftWidth: props.leftWidth,
        justifyContent: props.myJustify,
      }}
    >
      {props.children}
    </div>
  );
}
