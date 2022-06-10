/**
 * @Description: 任务报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import DeleteImg from 'hlos-front/lib/assets/icons/delete.svg';

import styles from './style.less';

export default (props) => {
  return (
    <div>
      {props.lotList.length ? (
        <div className={styles['history-list']}>
          {props.lotList.map((item, index) => {
            return (
              <div className={styles['history-item-line']}>
                <div className={styles['line-left']}>
                  <p>{item.lotNumber}</p>
                </div>
                <div className={styles['line-right']}>
                  {props.showInputArr.findIndex((i) => i === 'ok') !== -1 && (
                    <div className={styles['line-input']}>
                      <p>
                        <span>
                          <span className={[`${styles.circle} ${styles.OK}`]} />
                          合格
                        </span>
                        <span className={styles['second-uom']}>
                          {props.secondUomShow &&
                            `${item.processOkQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className={styles['lmes-task-report-common-input']}>
                        <NumberField
                          min={0}
                          step={0.000001}
                          value={item.processOkQty || 0}
                          onChange={(value) =>
                            props.onHistoryQtyChange('processOkQty', value, index)
                          }
                        />
                        {/* <span
                          className={`${styles.sign} ${styles.left}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'processOkQty',
                              (item.processOkQty || 0) - 1 < 0 ? 0 : item.processOkQty || 0,
                              index
                            )
                          }
                        >
                          -
                        </span>
                        <span
                          className={`${styles.sign} ${styles.right}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'processOkQty',
                              (item.processOkQty || 0) + 1,
                              index
                            )
                          }
                        >
                          +
                        </span> */}
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'ng') !== -1 && (
                    <div className={styles['line-input']}>
                      <p>
                        <span>
                          <span className={[`${styles.circle} ${styles.NG}`]} />
                          不合格
                        </span>
                        <span className={styles['second-uom']}>
                          {props.secondUomShow &&
                            `${item.processNgQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className={styles['lmes-task-report-common-input']}>
                        <NumberField
                          min={0}
                          step={0.000001}
                          value={item.processNgQty || 0}
                          onChange={(value) =>
                            props.onHistoryQtyChange('processNgQty', value, index)
                          }
                        />
                        {/* <span
                          className={`${styles.sign} ${styles.left}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'processNgQty',
                              (item.processNgQty || 0) - 1 < 0 ? 0 : item.processNgQty || 0,
                              index
                            )
                          }
                        >
                          -
                        </span>
                        <span
                          className={`${styles.sign} ${styles.right}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'processNgQty',
                              (item.processNgQty || 0) + 1,
                              index
                            )
                          }
                        >
                          +
                        </span> */}
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'scrapped') !== -1 && (
                    <div className={styles['line-input']}>
                      <p>
                        <span>
                          <span className={[`${styles.circle} ${styles.SCRAPPED}`]} />
                          报废
                        </span>
                        <span className={styles['second-uom']}>
                          {props.secondUomShow &&
                            `${item.scrappedQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className={styles['lmes-task-report-common-input']}>
                        <NumberField
                          min={0}
                          step={0.000001}
                          value={item.scrappedQty || 0}
                          onChange={(value) =>
                            props.onHistoryQtyChange('scrappedQty', value, index)
                          }
                        />
                        {/* <span
                          className={`${styles.sign} ${styles.left}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'scrappedQty',
                              (item.scrappedQty || 0) - 1 < 0 ? 0 : item.scrappedQty || 0,
                              index
                            )
                          }
                        >
                          -
                        </span>
                        <span
                          className={`${styles.sign} ${styles.right}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'scrappedQty',
                              (item.scrappedQty || 0) + 1,
                              index
                            )
                          }
                        >
                          +
                        </span> */}
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'rework') !== -1 && (
                    <div className={styles['line-input']}>
                      <p>
                        <span>
                          <span className={[`${styles.circle} ${styles.REWORK}`]} />
                          返修
                        </span>
                        <span className={styles['second-uom']}>
                          {props.secondUomShow && `${item.reworkQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className={styles['lmes-task-report-common-input']}>
                        <NumberField
                          min={0}
                          step={0.000001}
                          value={item.reworkQty || 0}
                          onChange={(value) => props.onHistoryQtyChange('reworkQty', value, index)}
                        />
                        {/* <span
                          className={`${styles.sign} ${styles.left}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'reworkQty',
                              (item.reworkQty || 0) - 1 < 0 ? 0 : item.reworkQty || 0,
                              index
                            )
                          }
                        >
                          -
                        </span>
                        <span
                          className={`${styles.sign} ${styles.right}`}
                          onClick={() =>
                            props.onHistoryQtyChange('reworkQty', (item.reworkQty || 0) + 1, index)
                          }
                        >
                          +
                        </span> */}
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'pending') !== -1 && (
                    <div className={styles['line-input']}>
                      <p>
                        <span>
                          <span className={[`${styles.circle} ${styles.PENDING}`]} />
                          待定
                        </span>
                        <span className={styles['second-uom']}>
                          {props.secondUomShow &&
                            `${item.pendingQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className={styles['lmes-task-report-common-input']}>
                        <NumberField
                          min={0}
                          step={0.000001}
                          value={item.pendingQty || 0}
                          onChange={(value) => props.onHistoryQtyChange('pendingQty', value, index)}
                        />
                        {/* <span
                          className={`${styles.sign} ${styles.left}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'pendingQty',
                              (item.pendingQty || 0) - 1 < 0 ? 0 : item.pendingQty || 0,
                              index
                            )
                          }
                        >
                          -
                        </span>
                        <span
                          className={`${styles.sign} ${styles.right}`}
                          onClick={() =>
                            props.onHistoryQtyChange(
                              'pendingQty',
                              (item.pendingQty || 0) + 1,
                              index
                            )
                          }
                        >
                          +
                        </span> */}
                      </div>
                    </div>
                  )}
                  <div className={styles.icon} onClick={() => props.onHistoryDel(index)}>
                    <img src={DeleteImg} alt="" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ width: '100%', textAlign: 'center', fontSize: 22, marginTop: 30 }}>
          暂无历史数据
        </p>
      )}
    </div>
  );
};
