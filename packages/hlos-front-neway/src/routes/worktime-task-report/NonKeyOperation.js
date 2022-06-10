/**
 * @Description: 非关键工序报工--Index
 * @Author: <tian.zhu@hand-china.com>
 * @Date: 2021-5-19
 */

import React from 'react';
import { Row, Col } from 'choerodon-ui';
import { withRouter } from 'react-router';

import styles from './nonIndex.less';

// const commonCode = 'lmes.common';

// const preCode = 'neway.nonKeyOperation.model';
const NonKeyOperation = (props) => {
  const { infoList } = props;

  return (
    <div className={styles['dispatch-order-report-content']}>
      <Row type="flex">
        <Col span={12}>
          <div className={styles['content-left']}>
            <div className={styles['content-info-top']}>
              <div>
                <p className={styles.title}>生产订单信息</p>
                <p className={styles['order-code']}>{infoList.documentNum}</p>
                <div>
                  <span>{infoList.documentTypeName}</span>
                  <span className={styles['order-status']} name="moStatus">
                    {infoList.moStatusMeaning}
                  </span>
                </div>
              </div>
              <div className={styles['right-box']}>
                <p>MO数量</p>
                <p className={styles['order-qty']}>
                  <span>{infoList.makeQty}</span>
                  <span>EA</span>
                </p>
              </div>
            </div>
            <div className={styles['content-info-middle']}>
              <p className={styles['order-info']}>物料编码: {infoList.itemCode}</p>
              <p className={styles['order-info']}>物料描述: {infoList.itemDesc}</p>
              <p className={styles['order-info']}>计划开始时间: {infoList.planStartDate}</p>
              <p className={styles['order-info']}>计划结束时间: {infoList.planEndDate}</p>
              <p className={styles['order-info']}>工艺路线: {infoList.routingName}</p>
            </div>

            <div className={styles['quantity-bar']}>
              <span>合格: {infoList.inventoryQty}</span>
              <span>报废: {infoList.scrappedQty}</span>
              <span>待加工: {infoList.makeQty - infoList.inventoryQty - infoList.scrappedQty}</span>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['content-right']}>
            <div className={styles['content-info-top']}>
              <div>
                <p className={styles.title}>生产任务信息</p>
                <p className={styles['order-code']}>{infoList.taskNum}</p>
                <div>
                  <span>{infoList.operation}</span>
                  <span className={styles['order-status']}>{infoList.taskStatusMeaning}</span>
                </div>
              </div>
              <div className={styles['right-box']}>
                <p>任务可执行数</p>
                <p className={styles['order-qty']}>
                  <span>{infoList.taskQty}</span>
                  <span>EA</span>
                </p>
              </div>
            </div>
            <div className={styles['quantity-bar']}>
              <span>已报工: {infoList.processOkQty}</span>
              <span>待处理: {infoList.taskQty - infoList.processOkQty}</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(NonKeyOperation);
