/*
 * @Description: 底部按钮
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-06-29 17:46:33
 */

import React from 'react';
import { NumberField } from 'choerodon-ui/pro';

import Icons from 'components/Icons';

import styles from './index.less';

export default (props) => {
  const { headerData, type } = props;
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={props.onPaper}>
          <Icons type="image-paper" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>图纸</p>
        </div>
        <div className={styles.icon} onClick={props.onReferences}>
          <Icons type="gongyiwenjian1" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>参考文件</p>
        </div>
      </div>
      <div>
        <div className={styles.quantities}>
          {((headerData.samplingType === 'SAMPLE' || headerData.samplingType === 'NONE') &&
            headerData.itemControlType === 'QUANTITY') ||
          type === 'SQC' ||
          type === 'ROUTING' ? (
            <>
              <span className={`${styles['input-qualified']} ${styles.text}`}>
                <NumberField
                  value={props.qualifiedQuantity || 0}
                  onChange={(value) => props.onInspectionQuantity(value, 'qualified')}
                />
              </span>
              <span className={`${styles['input-unqualified']} ${styles.text}`}>
                <NumberField
                  value={props.unqualifiedQuantity || 0}
                  onChange={(value) => props.onInspectionQuantity(value, 'unqualified')}
                />
              </span>
            </>
          ) : (
            <>
              <span className={`${styles.qualified} ${styles.text}`}>
                {props.qualifiedQuantity}
              </span>
              <span className={`${styles.unqualified} ${styles.text}`}>
                {props.unqualifiedQuantity}
              </span>
            </>
          )}
        </div>
        <div className={styles.icon} onClick={props.onQualified}>
          {/* <img src={QualifiedImg} alt="" /> */}
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
        <div className={styles.icon} onClick={props.onGiveIn}>
          <Icons type="give-in" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>让步接受</p>
        </div>
        {/* <div className={styles.icon} onClick={props.onBadReason}>
          <Icons type="message" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>不良原因</p>
        </div> */}
        <div className={styles.icon} onClick={props.onRemarkClick}>
          <Icons type="remark" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>备注</p>
        </div>
        <div className={styles.icon} onClick={() => props.onClose(false)}>
          <Icons type="exit" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
      </div>
    </div>
  );
};
