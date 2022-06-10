/**
 * @Description: 非关键工序报工--Index
 * @Author: <tian.zhu@hand-china.com>
 * @Date: 2021-5-19
 */

import React, { useState } from 'react';
import {
  DataSet,
  Lov,
  TextField,
  // Modal,
} from 'choerodon-ui/pro';
import { Row, Col, Spin } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import confirmIcon from 'hlos-front/lib/assets/icons/confirm.svg';
import backIcon from 'hlos-front/lib/assets/icons/back.svg';
import cancelIcon from 'hlos-front/lib/assets/icons/cancel_report.svg';

import { FormDs } from '@/stores/nonKeyOperationReportDs';
import { confirmReport, cancelReport } from '@/services/nonKeyOperationService';
import styles from './index.less';
import Header from '@/components/Header';

// const commonCode = 'lmes.common';

// const preCode = 'neway.dispatchOrderReport.model';
const DispatchOrderReport = ({ history }) => {
  const formDs = useDataSet(() => new DataSet(FormDs()), []);

  const [avator, setAvator] = useState(defaultAvatorImg);
  const [resourceName, setGroupName] = useState(null);
  const [infoList, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWorkerChange = (record) => {
    if (record) {
      const { fileUrl, workerGroupName } = record;
      setAvator(fileUrl);
      setGroupName(workerGroupName);
    } else {
      setAvator(defaultAvatorImg);
      setGroupName(null);
      formDs.queryDataSet.current.set('taskLov', null);
    }
  };

  const handleExit = () => {
    history.push('/workplace');
    closeTab('/pub/neway/non-key-operation-report');
  };

  const queryData = async () => {
    try {
      setLoading(true);
      await formDs.query();
      const formData = formDs.current.toJSONData();
      formDs.queryDataSet.getField('quantity').set('required', true);
      setInfo(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskChange = (record) => {
    if (record) {
      queryData();
    }
  };

  const handleBtn = async (type) => {
    const validateFlag = await formDs.queryDataSet.validate(false, false);
    if (!validateFlag) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    try {
      setLoading(true);
      const data = {
        workerId: formDs.queryDataSet.current.get('workerId'),
        taskId: formDs.queryDataSet.current.get('taskId'),
        taskNum: formDs.queryDataSet.current.get('taskNum'),
        quantity: formDs.queryDataSet.current.get('quantity'),
      };
      let res;
      if (type === 'confirm') {
        res = await confirmReport(data);
      } else {
        res = await cancelReport(data);
      }

      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
        return;
      }
      await queryData();
      formDs.queryDataSet.current.set('quantity', null);
    } finally {
      setLoading(false);
    }
  };

  const formRender = () => {
    return [
      <Lov
        dataSet={formDs.queryDataSet}
        name="workerLov"
        placeholder="员工"
        clearButton
        noCache
        onChange={handleWorkerChange}
      />,
      <Lov
        dataSet={formDs.queryDataSet}
        name="taskLov"
        onChange={handleTaskChange}
        placeholder="任务"
        clearButton
      />,
      <TextField
        dataSet={formDs.queryDataSet}
        name="quantity"
        key="quantity"
        placeholder="数量"
        noCache
        clearButton
      />,
    ];
  };

  return (
    <div className={styles['dispatch-order-report']}>
      <Spin dataSet={formDs} spinning={loading}>
        <Header formRender={formRender} formData={{ formDs, resourceName, avator }} />
        {infoList && (
          <div className={styles['dispatch-order-report-content']}>
            <Row type="flex">
              <Col span={12}>
                <div className={styles['content-left']}>
                  <div className={styles['content-info-area']}>
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
                  <p className={styles['order-info']}>物料编码: {infoList.itemCode}</p>
                  <p className={styles['order-info']}>物料描述: {infoList.itemDesc}</p>
                  <p className={styles['order-info']}>计划开始时间: {infoList.planStartDate}</p>
                  <p className={styles['order-info']}>计划结束时间: {infoList.planEndDate}</p>
                  <p className={styles['order-info']}>工艺路线: {infoList.routingName}</p>
                  <div className={styles['quantity-bar']}>
                    <span>合格: {infoList.inventoryQty}</span>
                    <span>报废: {infoList.scrappedQty}</span>
                    <span>
                      待加工: {infoList.makeQty - infoList.inventoryQty - infoList.scrappedQty}
                    </span>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles['content-right']}>
                  <div className={styles['content-info-area']}>
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
        )}

        <div className={styles['dispatch-order-report-footer']}>
          <div>
            <img className={styles.avator} src={backIcon} alt="返回" onClick={handleExit} />
            <span>返回</span>
          </div>
          {infoList && (
            <>
              <div>
                <img
                  className={styles.avator}
                  src={confirmIcon}
                  alt="确认"
                  onClick={() => handleBtn('confirm')}
                />
                <span>确认</span>
              </div>
              <div>
                <img
                  className={styles.avator}
                  src={cancelIcon}
                  alt="取消报工"
                  onClick={() => handleBtn('cancel')}
                />
                <span>取消报工</span>
              </div>
            </>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default formatterCollections({ code: 'neway.dispatchOrderReport' })(DispatchOrderReport);
