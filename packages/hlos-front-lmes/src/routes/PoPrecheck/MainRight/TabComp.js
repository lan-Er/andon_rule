/**
 * @Description: po预检
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-05 13:54:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import styles from './index.less';
import InspectComp from './InspectComp';
import ExceptionComp from './ExceptionComp';

export default ({
  ds,
  onChangeTab,
  currentTab,
  exceptionList,
  inspectionList,
  onNumberChange,
  onAbnormalChange,
  onPicturesChange,
}) => {
  return (
    <>
      <div className={styles['tabs-wrapper']}>
        <div className={styles.tabs}>
          <div
            className={currentTab === 'inspection' ? `${styles.active}` : null}
            onClick={() => onChangeTab('inspection')}
          >
            检验项（{inspectionList.length}）
          </div>
          <div
            className={currentTab === 'exception' ? `${styles.active}` : null}
            onClick={() => onChangeTab('exception')}
          >
            不良原因（{exceptionList.length}）
          </div>
        </div>
      </div>
      <div className={styles.list}>
        {currentTab === 'inspection' ? (
          <InspectComp ds={ds} inspectionList={inspectionList} onNumberChange={onNumberChange} />
        ) : (
          <ExceptionComp
            exceptionList={exceptionList}
            onAbnormalChange={onAbnormalChange}
            onPicturesChange={onPicturesChange}
          />
        )}
      </div>
    </>
  );
};
