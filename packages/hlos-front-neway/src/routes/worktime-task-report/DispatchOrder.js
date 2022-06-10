import React from 'react';
import { Row, Col } from 'choerodon-ui';
import { withRouter } from 'react-router';

import styles from './dispatchIndex.less';

// const commonCode = 'neway.common';

// const preCode = 'neway.worktimeTaskReport.model';
const DispatchOrderReport = (props) => {
  const { infoList } = props;
  return (
    <div className={styles['dispatch-order-report-content']}>
      <Row type="flex">
        <Col span={12}>
          <div className={styles['content-left']}>
            <div className={styles['content-info-top']}>
              <div>
                <p className={styles.title}>派工单信息</p>
                <p className={styles['order-num']}>{infoList.documentNum}</p>
                <div>
                  <span>{infoList.documentTypeName}</span>
                  <span className={styles['order-status']} name="moStatus">
                    {infoList.moStatusMeaning}
                  </span>
                </div>
              </div>
              <div className={styles['right-box']}>
                <p>对应生产订单号</p>
                <p className={styles['order-num']}>{infoList.sourceDocNum}</p>
              </div>
            </div>
            <div className={styles['content-remark']}>派工单备注: {infoList.remark}</div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['content-right']}>
            <div className={styles['content-info-top']}>
              <div>
                <p className={styles.title}>生产任务信息</p>
                <p className={styles['order-num']}>{infoList.taskNum}</p>
                <div>
                  <span>{infoList.operation}</span>
                  <span className={styles['order-status']}>{infoList.taskStatusMeaning}</span>
                </div>
              </div>
              <div className={styles['right-box']}>
                <p>任务可执行工时</p>
                <p className={styles['order-work-time']}>{infoList.planProcessTime}</p>
              </div>
            </div>
            <div className={styles['bottom-box']}>
              <span>已报工: {infoList.processedTime}</span>
              <span>待处理: {infoList.planProcessTime}</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(DispatchOrderReport);
