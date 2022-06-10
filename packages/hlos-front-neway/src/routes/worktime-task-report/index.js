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
import { Spin } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import confirmIcon from 'hlos-front/lib/assets/icons/confirm.svg';
import backIcon from 'hlos-front/lib/assets/icons/back.svg';
import cancelIcon from 'hlos-front/lib/assets/icons/cancel_report.svg';

import { HeaderDs } from '@/stores/worktimeTaskReportDs';
import { confirmReport, cancelReport } from '@/services/wtTaskReportService';
import styles from './index.less';
import Header from '@/components/Header';
import NonKeyOperation from './NonKeyOperation';
import DispatchOrder from './DispatchOrder';

const commonCode = 'neway.common.model';

// const preCode = 'neway.worktimeTaskReport.model';

const WorktimeTaskReport = ({ history }) => {
  const headerDs = useDataSet(() => new DataSet(HeaderDs()), []);

  const [avator, setAvator] = useState(defaultAvatorImg);
  const [resourceName, setGroupName] = useState(null);
  const [infoList, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyOperationFlag, setKeyOperationFlag] = useState(0);

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

  /**
   * 退出
   */
  const handleExit = () => {
    history.push('/workplace');
    closeTab('/pub/neway/worktime-task-report');
  };

  const queryData = async () => {
    try {
      setLoading(true);
      headerDs.queryDataSet.current.set('keyOperationFlag', keyOperationFlag);
      await headerDs.query();
      const formData = headerDs.current.toJSONData();
      headerDs.queryDataSet.getField('quantity').set('required', true);
      setInfo(formData);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 任务修改触发
   * @param {Object} record 选中对象
   */
  const handleTaskChange = (record) => {
    if (
      record &&
      ['OPERATION_TASK', 'REWROK_TASK', 'NO_REWORK_TASK'].includes(record.taskTypeCode)
    ) {
      setKeyOperationFlag(0);
      queryData();
    } else if (
      record &&
      !['OPERATION_TASK', 'REWROK_TASK', 'NO_REWORK_TASK'].includes(record.taskTypeCode)
    ) {
      setKeyOperationFlag(1);
      queryData();
    }
    headerDs.queryDataSet.getField('quantity').set('required', false);
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
      const data = {
        workerId: headerDs.queryDataSet.current.get('workerId'),
        taskId: headerDs.queryDataSet.current.get('taskId'),
        taskNum: headerDs.queryDataSet.current.get('taskNum'),
        quantity: headerDs.queryDataSet.current.get('quantity'),
        keyOperationFlag,
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
      headerDs.queryDataSet.current.set('quantity', null);
    } finally {
      setLoading(false);
    }
  };

  const formRender = () => {
    return [
      <Lov
        dataSet={headerDs.queryDataSet}
        name="workerLov"
        placeholder={intl.get(`${commonCode}.worker`).d('员工')}
        clearButton
        noCache
        onChange={handleWorkerChange}
      />,
      <Lov
        dataSet={headerDs.queryDataSet}
        name="taskLov"
        onChange={handleTaskChange}
        placeholder={intl.get(`${commonCode}.task`).d('任务')}
        clearButton
      />,
      <TextField
        dataSet={headerDs.queryDataSet}
        name="quantity"
        key="quantity"
        placeholder={intl.get(`${commonCode}.qty`).d('数量')}
        noCache
        clearButton
      />,
    ];
  };

  return (
    <div className={styles['dispatch-order-report']}>
      <Spin dataSet={headerDs} spinning={loading}>
        <Header formRender={formRender} formData={{ headerDs, resourceName, avator }} />
        {!infoList && <div style={{ minHeight: '65%' }} />}
        {infoList && keyOperationFlag === 1 && <DispatchOrder infoList={infoList} />}
        {infoList && keyOperationFlag === 0 && <NonKeyOperation infoList={infoList} />}
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

export default formatterCollections({ code: ['neway.worktimeTaskReport', 'neway.common'] })(
  WorktimeTaskReport
);
