/*
 * @module-: 进度条组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-28 09:53:50
 * @LastEditTime: 2020-06-28 10:51:03
 * @copyright: Copyright (c) 2018,Hand
 */
import React from 'react';

import style from './index.less';

export default function MyProgress(props) {
  return (
    <div className={style['my-progress']}>
      <div className={style['my-progress-content']} style={{ height: '20px', width: '100%' }}>
        <div className={style['my-progress-content-left']} style={{ width: '86%' }}>
          <div style={{ width: `${props.value}%` }} />
          <div className={style['my-progress-bottom']} style={{ width: '100%' }} />
        </div>
        <div className={style['my-progress-content-right']}>&nbsp;&nbsp;{props.value}%</div>
      </div>
    </div>
  );
}
