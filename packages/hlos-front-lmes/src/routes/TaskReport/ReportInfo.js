/**
 * @Description: 任务报工--content-left
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Row, Col } from 'choerodon-ui';
import styles from './style.less';

export default ({ taskInfo, moInfo, moNull, isReturn, taskTypeName }) => {
  const { moExecuteList } = moInfo;

  return (
    <div className={`${styles['report-info']} ${isReturn && styles.return}`}>
      <div className={styles['info-header']}>
        <div>
          <span className={styles.num}>{taskInfo.taskNum}</span>
          <span className={styles.status}>
            <span>{taskInfo.taskStatusMeaning}</span>
          </span>
        </div>
        <span className={styles.num}>{taskTypeName}</span>
      </div>
      <div className={styles['info-content']}>
        <div className={styles['content-top']}>
          <p>{taskInfo.itemCode}</p>
          <p>
            {taskInfo.itemDescription}
            <span className={styles.demand}>需求数量</span>
            <span className={styles.num}>{taskInfo.taskQty}</span>
          </p>
          <p className={styles.operation}>
            {taskInfo.operation}
            {taskInfo.firstOperationFlag === true && (
              <span style={{ marginRight: 10 }}>首工序</span>
            )}
            {taskInfo.lastOperationFlag === true && <span>末工序</span>}
          </p>
          <p className={styles.desc}>{taskInfo.instruction}</p>
        </div>
        {moNull ? (
          <div className={styles['content-bottom']}>无关联MO</div>
        ) : (
          <div className={styles['content-bottom']}>
            <div className={styles.mo}>
              <p className={styles.num}>
                {moInfo.moNum}
                <span>{moInfo.moStatusMeaning}</span>
              </p>
              <p className={styles.routing}>{moInfo.routingDescription}</p>
            </div>
            <div className={styles['mo-type']}>
              <p>{moInfo.moTypeName}</p>
              <p>{moInfo.bomDescription}</p>
            </div>
            {moExecuteList && (
              <div className={styles['progress-line']}>
                <div className={styles.progress}>
                  <Row className={styles['progress-block']}>
                    <Col
                      span={Math.floor(
                        (Number(moExecuteList[0].completedQty || 0) / moInfo.makeQty) * 24
                      )}
                      className={styles.completed}
                    />
                    <Col
                      span={Math.floor(
                        (Number(moExecuteList[0].suppliedQty || 0) / moInfo.makeQty) * 24
                      )}
                      className={styles.supplied}
                    />
                    <Col
                      span={Math.floor(
                        (Number(moExecuteList[0].scrappedQty || 0) / moInfo.makeQty) * 24
                      )}
                      className={styles.scapped}
                    />
                  </Row>
                  <div className={styles.percent}>
                    {(
                      ((Number(moExecuteList[0].completedQty || 0) +
                        Number(moExecuteList[0].suppliedQty || 0) +
                        Number(moExecuteList[0].scrappedQty || 0)) /
                        Number(moInfo.makeQty)) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
                <div className={styles.scale}>
                  已完成：
                  {Number(moExecuteList[0].completedQty || 0) +
                    Number(moExecuteList[0].suppliedQty || 0) +
                    Number(moExecuteList[0].scrappedQty || 0)}
                  /{Number(moInfo.makeQty)}
                </div>
              </div>
            )}
            <div className={styles.lengend}>
              <p>
                <span className={`${styles.circle} ${styles.completed}`} />
                已完工
              </p>
              <p>
                <span className={`${styles.circle} ${styles.supplied}`} />
                已供应
              </p>
              <p>
                <span className={`${styles.circle} ${styles.scapped}`} />
                报废
              </p>
            </div>
            <div className={styles.customer}>{moInfo.customerName}</div>
            <div className={styles.remark}>{moInfo.remark}</div>
          </div>
        )}
      </div>
    </div>
  );
};
