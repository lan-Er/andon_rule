/*
 * @Description: 班组管理 任务弹窗
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-06-04 09:57:18
 * @LastEditTime: 2021-07-29 14:05:44
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Button, CheckBox } from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import imgDefaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { runTask, pauseTask, getWorkerGroupTask } from '@/services/teamManagementService';
import styles from '../index.less';

const { TabPane } = Tabs;
const TaskModal = ({ workerInfo }) => {
  const [allChecked, changeAllChecked] = useState(false);
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    const res = await getWorkerGroupTask({
      page: -1,
      workerGroupId: workerInfo.workerGroupId,
      // organizationId: workerInfo.organizationId,
      taskStatus: 'RUNNING,PAUSE,PENDING',
    });
    if (getResponse(res) && res && res.content) {
      setTaskList(res.content);
    }
  }

  function handleCheckAll(val) {
    changeAllChecked(val);
    const cloneList = [...taskList];
    cloneList.forEach((i) => {
      i.checked = val;
    });
    setTaskList(cloneList);
  }

  function handleCheckItem(val, record) {
    const cloneList = [...taskList];
    const index = cloneList.findIndex((v) => v.taskId === record.taskId);
    cloneList[index].checked = val;
    setTaskList(cloneList);
    const allFlag = taskList.every((i) => i.checked);
    changeAllChecked(allFlag);
  }

  async function handlePause() {
    const taskIds = taskList.filter((i) => i.checked).map((i) => i.taskId);
    const res = await pauseTask(taskIds);
    if (getResponse(res)) {
      notification.success();
      handleSearch();
    }
  }

  async function handleRun() {
    const taskIds = taskList.filter((i) => i.checked).map((i) => i.taskId);
    const res = await runTask({
      taskIds,
      workerId: workerInfo.supervisorId,
      worker: workerInfo.supervisorCode,
    });
    if (getResponse(res)) {
      notification.success();
      handleSearch();
    }
  }

  function TaskLine({ i, onCheckItem }) {
    return (
      <div key={i.taskId} className={styles['task-list-item']}>
        <div className={styles['worker-info']}>
          <CheckBox checked={i.checked} onChange={(val) => onCheckItem(val, i)} />
          <img src={i.fileUrl || imgDefaultAvator} alt="" />
          <div className={styles.worker}>
            {i.workerName} ({i.workerCode})
          </div>
        </div>
        <div className={styles['task-info']}>
          <div>
            <div className={styles.item}>
              {i.itemCode}
              {i.itemDescription && <span>-{i.itemDescription}</span>}
            </div>
            <div className={styles.qty}>
              {i.taskQty} {i.uomName}
            </div>
          </div>
          <div>
            <div>
              <span>{i.taskNumber}</span>
              <span className={styles['task-status']}>{i.taskStatusMeaning}</span>
            </div>
            <div>
              <span className={styles.date}>
                {i.actualStartTime && <span>{i.actualStartTime} ~</span>} {i.actualEndTime}
              </span>
              <span className={styles.time}>{i.processedTime || 0} h</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className={styles['task-header']}>
        <div>
          <img src={workerInfo.fileUrl || imgDefaultAvator} alt="" />
          <div className={styles['worker-info']}>
            <div className={styles['worker-name']}>
              {workerInfo.supervisorName} ({workerInfo.supervisorCode})
            </div>
            <div className={styles['worker-group']}>{workerInfo.workerGroupName}</div>
          </div>
        </div>
        <div>
          <CheckBox checked={allChecked} onChange={handleCheckAll}>
            {intl.get('hzero.c7nUI.Select.selectAll').d('全选')}
          </CheckBox>
          <Button className={styles['pause-btn']} onClick={handlePause}>
            {intl.get('lmes.common.button.pause').d('暂停')}
          </Button>
          <Button className={styles['run-btn']} onClick={handleRun}>
            {intl.get('lmes.common.button.run').d('运行')}
          </Button>
        </div>
      </div>
      <div className={styles['task-list']}>
        <Tabs defaultActiveKey="1" animated={false}>
          <TabPane
            tab={`运行中(${taskList.filter((v) => v.taskStatus === 'RUNNING').length})`}
            key="1"
          >
            {taskList &&
              taskList
                .filter((v) => v.taskStatus === 'RUNNING')
                .map((i) => <TaskLine i={i} onCheckItem={handleCheckItem} />)}
          </TabPane>
          <TabPane tab={`暂停(${taskList.filter((v) => v.taskStatus === 'PAUSE').length})`} key="2">
            {taskList
              .filter((v) => v.taskStatus === 'PAUSE')
              .map((i) => (
                <TaskLine i={i} onCheckItem={handleCheckItem} />
              ))}
          </TabPane>
          <TabPane
            tab={`暂挂(${taskList.filter((v) => v.taskStatus === 'PENDING').length})`}
            key="3"
          >
            {taskList &&
              taskList
                .filter((v) => v.taskStatus === 'PENDING')
                .map((i) => <TaskLine i={i} onCheckItem={handleCheckItem} />)}
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default TaskModal;
