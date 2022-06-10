/**
 * @Description: 完工入库--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';

import styles from './index.less';

export default ({ onExit, onSelectAll, onSubmit, onReset }) => {
  return (
    <div className={styles['lwms-delivery-return-receive-footer']}>
      <div className={styles.icon} onClick={onExit}>
        <img src={ExitImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text}>退出</p>
      </div>
      <div>
        <div className={styles.icon} onClick={onReset}>
          <img src={ResetImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>重置</p>
        </div>
        <div className={styles.icon} onClick={onSelectAll}>
          <img src={CheckImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>全选</p>
        </div>
        <div className={styles.icon} onClick={onSubmit}>
          <img src={SubmitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>提交</p>
        </div>
      </div>
    </div>
  );
};
