/*
 * @module-: 分割线
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 09:45:02
 * @LastEditTime: 2020-11-06 10:32:59
 * @copyright: Copyright (c) 2018,Hand
 */
import React from 'react';
import style from '../index.module.less';

export default function MyBr({ title }) {
  return (
    <div className={style['my-br-list']}>
      <span className={style['my-br-list-title']}>{title}</span>
      <div className={style['my-br-list-bottom']}>
        <section>
          <div />
        </section>
        <section />
      </div>
    </div>
  );
}
