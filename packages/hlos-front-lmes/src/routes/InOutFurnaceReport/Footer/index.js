/**
 * @Description: 进出炉报工--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';

import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
// import insertImg from 'hlos-front/lib/assets/icons/insert.svg';
import changeImg from 'hlos-front/lib/assets/icons/change.svg';
import submitImg from 'hlos-front/lib/assets/icons/submit.svg';

import styles from './index.less';

export default ({ workerDisabled, onWorkerChange, onExit, onSubmit }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.icon} onClick={onExit}>
        <img src={exitImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text}>退出</p>
      </div>
      <div className={styles.icon} onClick={() => onWorkerChange(workerDisabled)}>
        <img src={changeImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text}>切换</p>
      </div>
      {/* <div className={styles.icon} onClick={onUnload}>
        <img src={insertImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text} style={{ color: '#BF360C' }}>
          强制下线
        </p>
      </div> */}
      <div className={styles.icon} onClick={onSubmit}>
        <img src={submitImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text}>提交</p>
      </div>
    </div>
  );
};
