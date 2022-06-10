import React from 'react';
import styles from './index.module.less';

export default ({ item = {}, type }) => {
  const {
    andonName,
    triggeredDuration,
    responsedDuration,
    andonRelType,
    resourceName,
    itemDescription,
    workcellName,
    triggeredTime,
    responsedTime,
  } = item;
  return (
    <div className={[styles.itemWrap, styles[type], styles.itemBorder].join(' ')}>
      <div className={styles.title}>
        <div>{andonName}</div>
        <div>{`${(type === 'pending' ? triggeredDuration : responsedDuration) || '0.00'}min`}</div>
      </div>
      <div className={styles.detail}>
        <div className={styles.detailMsg}>
          {(andonRelType === 'RESOURCE' ? resourceName : itemDescription) || ''}
        </div>
        <div className={styles.others}>
          {`${workcellName || ''} · ${(type === 'pending' ? triggeredTime : responsedTime) || ''}`}
        </div>
      </div>
    </div>
  );
};
