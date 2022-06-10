/**
 * @Description: 非生产任务报工
 * @Author: liYuan.liu<liu.liyuan@hand-china.com>
 * @Date: 2020-12-24
 * @LastEditors: liYuan.liu
 */

import React from 'react';

import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import QueryImg from 'hlos-front/lib/assets/icons/query.svg';
import RemarkImg from 'hlos-front/lib/assets/icons/remark.svg';
import StartImg from 'hlos-front/lib/assets/icons/start.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';
import PauseImg from 'hlos-front/lib/assets/icons/pause.svg';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';
import styles from './style.less';

export default (props) => {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={props.onClose}>
          <img src={ExitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
        <div className={styles['icon-more']} onClick={() => props.onQuery(props.loginCheckArr)}>
          <img src={QueryImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>查询</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={props.onCheckAll}>
          <img src={CheckImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>{!props.selectFleg ? '全选' : '取消全选'}</p>
        </div>
        <div className={styles.icon} onClick={props.onRemarkClick}>
          <img src={RemarkImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>备注</p>
        </div>
        <div className={styles.icon} onClick={props.onStart}>
          <img src={StartImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>开始</p>
        </div>
        <div className={styles['icon-more']} onClick={props.onPause}>
          <img src={PauseImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>暂停</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={props.onSubmit}>
          <img src={SubmitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>完成</p>
        </div>
      </div>
    </div>
  );
};
