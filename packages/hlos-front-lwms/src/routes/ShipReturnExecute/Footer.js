/**
 * @Description: 完工入库--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import PictureImg from 'hlos-front/lib/assets/icons/image.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';
import RemarkImg from 'hlos-front/lib/assets/icons/remark.svg';

import styles from './index.less';

export default ({ onExit, onSelectAll, onSubmit, onReset, onPicture, onRemark }) => {
  return (
    <div className={styles['lwms-ship-return-execute-footer']}>
      <div className={styles.icon} onClick={onExit}>
        <img src={ExitImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text}>退出</p>
      </div>
      <div>
        <div className={styles.icon} onClick={onRemark}>
          <img src={RemarkImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>备注</p>
        </div>
        <div className={styles.icon} onClick={onReset}>
          <img src={ResetImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>重置</p>
        </div>
        <div className={styles.icon} onClick={onPicture}>
          <img src={PictureImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>图片</p>
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
