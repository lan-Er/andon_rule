/*
 * @Description: 内容区域
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-19 15:05:08
 */

import React from 'react';
import ResumeLine from './resume-line';
import styles from './index.less';

export default function ContentArea({ lineList, showDetailModal }) {
  return (
    <div className={styles['equipment-content-area']}>
      {lineList.length
        ? lineList.map((rec, index) => (
          <ResumeLine
            item={rec}
            index={index}
            length={lineList.length}
            showDetailModal={showDetailModal}
          />
          ))
        : null}
    </div>
  );
}
