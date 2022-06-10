/**
 * @Description: 单件流报工--MainRight-检验
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React, { useState } from 'react';
import { Switch, TextField, Icon, NumberField, Tooltip } from 'choerodon-ui/pro';
import circleCheckIcon from 'hlos-front/lib/assets/icons/circle-check.svg';
import styles from './index.less';

export default ({
  currentTab,
  inspectionList,
  exceptionList,
  // qcOkQty,
  // qcNgQty,
  currentResult,
  resultList,
  onChangeTab,
  onExceptionClick,
  onInspectionItemChange,
  // onQcQtyChange,
  onChangeCurrentResult,
}) => {
  const [isShowResult, setIsShowResult] = useState(false);

  function handleShowResultList() {
    setIsShowResult(!isShowResult);
  }

  function handleChangeResult(rec) {
    onChangeCurrentResult(rec);
  }

  return (
    <>
      <div className={styles['tabs-wrapper']}>
        <div className={`${styles.tabs} ${styles.issue}`}>
          <div
            className={currentTab === 'inspection' ? `${styles.active}` : null}
            onClick={() => onChangeTab('inspection')}
          >
            检验项
          </div>
          <div
            className={currentTab === 'exception' ? `${styles.active}` : null}
            onClick={() => onChangeTab('exception')}
          >
            异常
          </div>
        </div>
        <div className={styles['inspect-header-right']}>
          {/* <div className={`${styles['qc-qty']} ${styles.ok}`}>
            <NumberField
              placeholder="合格"
              value={qcOkQty}
              onChange={(val) => onQcQtyChange(val, 'ok')}
            />
          </div>
          <div className={`${styles['qc-qty']} ${styles.ng}`}>
            <NumberField
              placeholder="不合格"
              value={qcNgQty}
              onChange={(val) => onQcQtyChange(val, 'ng')}
            />
          </div> */}
          <div className={styles['qc-result']} onClick={handleShowResultList}>
            <span className={styles[currentResult.value]}>{currentResult?.meaning}</span>
            <span className={`${styles['triangle-down']} ${styles[currentResult.value]}`} />
            {isShowResult && (
              <div className={styles['qc-result-list']}>
                {resultList.map((i) => {
                  return (
                    <div
                      key={i.value}
                      className={`${currentResult.value === i.value && styles.active}`}
                      onClick={() => handleChangeResult(i)}
                    >
                      {i.meaning}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {currentTab === 'inspection' ? (
        <div className={styles.list}>
          {inspectionList.map((i) => {
            return (
              <div className={styles['inspect-list-item']} key={i.inspectionItemId}>
                <p>
                  <Tooltip title={i.inspectionItemName} placement="top">
                    {i.inspectionItemName}
                  </Tooltip>
                </p>
                <p className={styles.limit}>
                  {i.lcl}-{i.ucl}
                </p>
                <p className={styles['qc-result']}>
                  {i.resultType === 'JUDGE' ? (
                    <Switch
                      unCheckedChildren={<Icon type="close" />}
                      checked={i.qcResult}
                      onChange={(val) => onInspectionItemChange(val, i, 'qcResult')}
                    >
                      <Icon type="check" />
                    </Switch>
                  ) : (
                    <NumberField
                      value={i.qcValue}
                      onChange={(val) => onInspectionItemChange(val, i, 'qcValue')}
                    />
                  )}
                </p>
                <p className={styles.remark}>
                  <TextField
                    value={i.remark}
                    placeholder="备注"
                    onChange={(val) => onInspectionItemChange(val, i, 'remark')}
                  />
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.exception}>
          {exceptionList.map((i) => {
            return (
              <div
                className={`${i.checked && styles.active}`}
                key={i.exceptionId}
                onClick={() => onExceptionClick(i)}
              >
                <span>{i.exceptionName}</span>
                {i.checked && <img src={circleCheckIcon} alt="" />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
