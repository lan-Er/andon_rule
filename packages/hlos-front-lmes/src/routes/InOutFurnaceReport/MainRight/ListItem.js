import React from 'react';
import styles from './index.less';

export default ({ data }) => {
  return (
    <div className={styles['list-item']}>
      <div className={styles['list-item-top']}>
        <div>
          <p className={styles['sn-num']}>{data.tagCode}</p>
          <div className={`${styles.status} ${styles[data.wipStatus]}`}>
            {data.wipStatusMeaning}
          </div>
        </div>
        <p>{data.moveInTime}</p>
      </div>
      <div className={styles['list-item-bottom']}>
        <div>
          <p>{data.moNum}</p>
          <p>
            {data.itemCode} {data.itemDescription}
          </p>
        </div>
        <p className={styles.task}>{data.taskNum}</p>
      </div>
    </div>
  );
};
