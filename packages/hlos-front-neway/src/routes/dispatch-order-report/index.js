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

import { WorkerDs } from '@/stores/dispatchOrderReportDs';
import { confirmReport, cancelReport } from '@/services/dispatchOrderReportService';
import styles from './index.less';
import Header from '@/components/Header';

// const commonCode = 'lmes.common';

// const preCode = 'neway.dispatchOrderReport.model';
const DispatchOrderReport = ({ history }) => {
  const headerDs = useDataSet(() => new DataSet(WorkerDs()), []);

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
      headerDs.queryDataSet.current.set('taskLov', null);
    }
  };

  const handleExit = () => {
    // Modal.confirm({
    //   key: Modal.key(),
    //   children: (
    //     <span>
    //       {intl
    //         .get(`${commonCode}.view.message.exit.no.saving`)
    //         .d('退出后不保存当前编辑，确认退出？')}
    //     </span>
    //   ),
    // }).then((button) => {
    //   if (button === 'ok') {
    //     history.push('/workplace');
    //     closeTab('/pub/neway/dispatch-order-report');
    //   }
    // });
    history.push('/workplace');
    closeTab('/pub/neway/dispatch-order-report');
  };

  const queryData = async () => {
    try {
      setLoading(true);
      await headerDs.query();
      const headerData = headerDs.current.toJSONData();
      headerDs.queryDataSet.getField('workTime').set('required', true);
      setInfo(headerData);
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
    const validateFlag = await headerDs.queryDataSet.validate(false, false);
    if (!validateFlag) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    try {
      setLoading(true);
      const workTime = headerDs.queryDataSet.current.get('workTime');
      const data = {
        ...headerDs.current.toJSONData(),
        workTime,
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
      headerDs.queryDataSet.current.set('workTime', null);
      await queryData();
    } finally {
      setLoading(false);
    }
  };

  const formRender = () => {
    return [
      <Lov
        dataSet={headerDs.queryDataSet}
        name="workerLov"
        placeholder="员工"
        clearButton
        noCache
        onChange={handleWorkerChange}
      />,
      <Lov
        dataSet={headerDs.queryDataSet}
        name="taskLov"
        onChange={handleTaskChange}
        placeholder="任务"
        clearButton
      />,
      <TextField
        dataSet={headerDs.queryDataSet}
        name="workTime"
        key="workTime"
        placeholder="工时"
        noCache
        clearButton
      />,
    ];
  };

  return (
    <div className={styles['dispatch-order-report']}>
      <Spin dataSet={headerDs} spinning={loading}>
        <Header formRender={formRender} formData={{ headerDs, resourceName, avator }} />
        {infoList && (
          <div className={styles['dispatch-order-report-content']}>
            <Row type="flex">
              <Col span={12}>
                <div className={styles['content-left']}>
                  <div className={styles['content-info-area']}>
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
                  <div className={styles['content-info-area']}>
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
