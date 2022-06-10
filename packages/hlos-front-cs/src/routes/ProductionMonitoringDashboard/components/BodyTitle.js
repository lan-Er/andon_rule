/*
 * @Description: 生产监控看板-头组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import styles from '../index.module.less';

export default function BodyTitle({ title, right }) {
  return (
    <div className={styles['body-title']}>
      <div className={styles['left-top']} />
      <div className={styles['right-top']} />
      <div className={styles['right-bottom']} />
      <div className={styles['left-bottom']} />
      <span className={styles.content}>{title}</span>
      {right ? <span className={styles.myRight}>{right}</span> : null}
    </div>
  );
}
