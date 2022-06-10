import React, { Fragment } from 'react';
import styles from './index.less';

const HistoryModal = ({ headerInfo, list, onItemClick }) => {
  return (
    <Fragment>
      <div className={styles['history-header']}>
        <div>
          <span className={styles['history-header-label']}>{headerInfo?.orderLabel}</span>
          <span>{headerInfo?.traceNum}</span>
        </div>
        {headerInfo?.itemCode && (
          <div>
            <span className={styles['history-header-label']}>物料</span>
            <span>{headerInfo?.itemCode}</span>
          </div>
        )}
      </div>
      <div className={styles['history-list']}>
        {list.map((i) => {
          return (
            <div
              className={`${styles['history-list-item']} ${
                i.active && styles['history-list-item-active']
              }`}
              onClick={() => onItemClick(i, list)}
            >
              <div>{i.traceTime}</div>
              <div>{i.workerName}</div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
export default HistoryModal;
