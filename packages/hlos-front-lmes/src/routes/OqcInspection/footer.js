/*
 * @Description: 底部按钮
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-13 23:19:36
 */

import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from './index.less';

export default (props) => {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={props.onClose}>
          <Icons type="exit" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={props.onJudgeQuickly}>
          <Icons type="qualified" size="40" color="#4CAF50" />
          <div className={styles.line} />
          <p className={styles.text} style={{ color: '#4CAF50' }}>
            快速判定
          </p>
        </div>
      </div>
      <div>
        <div className={styles.quantities}>
          <span className={`${styles['input-qualified']} ${styles.text}`}>
            <NumberField
              value={
                props.rightAreaData && props.rightAreaData.judged
                  ? props.rightAreaData.qcOkQty
                  : props.qualifiedQuantity || 0
              }
              min={0}
              disabled={props.rightAreaData && props.rightAreaData.judged}
              onChange={(value) => props.onInspectionQuantity(value, 'qualified')}
            />
          </span>
          <span className={`${styles['input-unqualified']} ${styles.text}`}>
            <NumberField
              value={
                props.rightAreaData && props.rightAreaData.judged
                  ? props.rightAreaData.qcNgQty
                  : props.unqualifiedQuantity || 0
              }
              min={0}
              disabled={props.rightAreaData && props.rightAreaData.judged}
              onChange={(value) => props.onInspectionQuantity(value, 'unqualified')}
            />
          </span>
        </div>
        <div className={styles.icon} onClick={props.onQualified}>
          <Icons type="qualified" size="40" color="#4CAF50" />
          <div className={styles.line} />
          <p className={styles.text} style={{ color: '#4CAF50' }}>
            合格
          </p>
        </div>
        <div className={styles.icon} onClick={props.onUnqualified}>
          <Icons type="unqualified" size="40" color="#F3511F" />
          <div className={styles.line} />
          <p className={styles.text} style={{ color: '#F3511F' }}>
            不合格
          </p>
        </div>
      </div>
    </div>
  );
};
