/**
 * @Description: 线下拆板
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 09:41:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
import changeImg from 'hlos-front/lib/assets/icons/change.svg';
import submitImg from 'hlos-front/lib/assets/icons/submit.svg';
import styles from './index.less';

export default ({ onWorkerChange, onExit, onSubmit }) => {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={onExit}>
          <img src={exitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
        <div className={styles.icon} onClick={onWorkerChange}>
          <img src={changeImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>切换</p>
        </div>
        <div className={styles.icon} onClick={onSubmit}>
          <img src={submitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>提交</p>
        </div>
      </div>
    </div>
  );
};
