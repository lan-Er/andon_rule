/*
 * @Description: 底部按钮
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-04 18:02:01
 */

import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from './index.less';

export default ({
  itemControlType,
  docQualifiedQty,
  docUnqualifiedQty,
  onClose,
  onInspectionQuantity,
  onQualified,
  onUnqualified,
}) => {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={() => onClose(false)}>
          <Icons type="exit" size="40" color="#4a4a4a" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
      </div>
      <div>
        <div className={styles.quantities}>
          {itemControlType === 'QUANTITY' ? (
            <>
              <span className={`${styles['input-qualified']} ${styles.text}`}>
                <NumberField
                  value={docQualifiedQty}
                  min={0}
                  onChange={(value) => onInspectionQuantity(value, 'qualified')}
                />
              </span>
              <span className={`${styles['input-unqualified']} ${styles.text}`}>
                <NumberField
                  value={docUnqualifiedQty}
                  min={0}
                  onChange={(value) => onInspectionQuantity(value, 'unqualified')}
                />
              </span>
            </>
          ) : (
            <>
              <span className={`${styles.qualified} ${styles.text}`}>{docQualifiedQty}</span>
              <span className={`${styles.unqualified} ${styles.text}`}>{docUnqualifiedQty}</span>
            </>
          )}
        </div>
        <div className={styles.icon} onClick={onQualified}>
          <Icons type="qualified" size="40" color="#4CAF50" />
          <div className={styles.line} />
          <p className={styles.text} style={{ color: '#4CAF50' }}>
            合格
          </p>
        </div>
        <div className={styles.icon} onClick={onUnqualified}>
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
