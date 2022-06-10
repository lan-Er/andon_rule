/**
 * @Description: 进出炉报工--SelectArea
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { TextField, Lov, NumberField } from 'choerodon-ui/pro';
import downIcon from 'hlos-front/lib/assets/icons/down-white.svg';
import orgIcon from 'hlos-front/lib/assets/icons/org.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import lockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import unLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
import styles from './index.less';

export default ({
  ds,
  tagRef,
  snDisabled,
  currentActive,
  onShowActiveSelect,
  showActiveSelect,
  activeSelectList,
  onActiveSelect,
  operationLock,
  registQty,
  onOperactionChange,
  onLock,
  onSnChange,
  onMoChange,
  onRegistQtyChange,
}) => {
  return (
    <div className={styles['select-area']}>
      <div
        className={`${styles['select-area-left']} ${currentActive.value === 'BIND' && styles.bind}`}
      >
        <div className={styles['select-btn']} onClick={onShowActiveSelect}>
          <span>{currentActive.meaning || currentActive.value}</span>
          <img src={downIcon} alt="" />
          {showActiveSelect && (
            <div className={styles['select-list']}>
              {activeSelectList.map((i) => {
                return (
                  <p
                    key={i.value}
                    className={`${i.value === currentActive.value && styles.active}`}
                    onClick={(e) => onActiveSelect(e, i)}
                  >
                    {i.meaning}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        {currentActive.value === 'IN' ||
        currentActive.value === 'OUT' ||
        currentActive.value === 'REGISTER' ? (
          <TextField
            ref={tagRef}
            dataSet={ds}
            name="snCode"
            disabled={snDisabled}
            placeholder="请扫描或输入SN号"
            suffix={<img src={scanIcon} alt="" />}
            onKeyDown={(e) => onSnChange(e)}
          />
        ) : (
          <div className={styles['query-lov']}>
            <Lov dataSet={ds} name="moObj" placeholder="请扫描或输入MO号" onChange={onMoChange} />
            <img src={scanIcon} alt="" />
          </div>
        )}
      </div>
      <div className={styles['select-area-right']}>
        {currentActive.value === 'REGISTER' && (
          <NumberField value={registQty} placeholder="请输入" onChange={onRegistQtyChange} />
        )}
        {currentActive.value === 'REGISTER' && (
          <div className={`${styles['query-input']} ${styles.left}`}>
            <Lov dataSet={ds} name="moObj" placeholder="请输入或扫描MO号" />
            <img src={scanIcon} alt="" />
          </div>
        )}
        <div className={styles['query-input']}>
          <Lov
            dataSet={ds}
            name={
              currentActive.value === 'IN' || currentActive.value === 'OUT'
                ? 'operationObj'
                : 'moOperationObj'
            }
            placeholder="选择工序"
            prefix={<img src={orgIcon} alt="" />}
            disabled={operationLock}
            onChange={onOperactionChange}
          />
          {operationLock ? (
            <img src={lockIcon} alt="" onClick={onLock} />
          ) : (
            <img src={unLockIcon} alt="" onClick={onLock} />
          )}
        </div>
      </div>
    </div>
  );
};
