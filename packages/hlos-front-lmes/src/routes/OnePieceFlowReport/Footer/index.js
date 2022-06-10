/**
 * @Description: 单件流报工--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';

import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
import paperImg from 'hlos-front/lib/assets/icons/image-paper.svg';
import insertImg from 'hlos-front/lib/assets/icons/insert.svg';
// import detailImg from 'hlos-front/lib/assets/icons/detail-btn.svg';
import changeImg from 'hlos-front/lib/assets/icons/change.svg';
import submitImg from 'hlos-front/lib/assets/icons/submit.svg';
import inspectImg from 'hlos-front/lib/assets/icons/inspect.svg';
import routingDocImg from 'hlos-front/lib/assets/icons/routing-document.svg';

import styles from './index.less';

export default ({ onWorkerChange, onExit, onDraw, onDoc, onSubmit, onUnload, onInspect }) => {
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
      </div>
      <div>
        <div className={styles.icon} onClick={onUnload}>
          <img src={insertImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text} style={{ color: '#BF360C' }}>
            强制下线
          </p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={onInspect}>
          <img src={inspectImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>报检</p>
        </div>
        <div className={styles.icon} onClick={onDraw}>
          <img src={paperImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>图纸</p>
        </div>
        <div className={styles.icon} onClick={onDoc}>
          <img src={routingDocImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>工艺文件</p>
        </div>
        {/* <div className={styles.icon}>
          <img src={detailImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>站内明细</p>
        </div> */}
        <div className={styles.icon} onClick={onSubmit}>
          <img src={submitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>提交</p>
        </div>
      </div>
    </div>
  );
};
