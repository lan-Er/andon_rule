/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-22 14:07:33
 * @LastEditTime: 2021-07-29 14:59:26
 * @Description:组织管理模态框
 */
import React, { useEffect, useState } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';
import { Row, Col, Checkbox, Tabs } from 'choerodon-ui';

import notification from 'utils/notification';
import { teamManagementModalDS } from '@/stores/teamManagementDS';
import { runTask, pauseTask } from '@/services/teamManagementService';
import workerIcon from 'hlos-front/lib/assets/icons/workcell.svg';
import teamIcon from 'hlos-front/lib/assets/icons/team.svg';

const { TabPane } = Tabs;

const teamManagementModalListDs = new DataSet(teamManagementModalDS());

const TeamManagementModalTableLine = (props) => {
  const { modalInfo } = props;
  const handleChangeSelcet = (e) => {
    props.onChecked(modalInfo, e.target.checked);
  };
  return (
    <Row className={`modal-table-line ${props.even ? 'even-modal-table-line' : ''}`}>
      <Col span={8}>
        <div className="first-col line-col col-arrangement-constant">
          <Checkbox
            checked={modalInfo.checked}
            className="line-col-checkbox"
            onChange={handleChangeSelcet}
          />{' '}
          {modalInfo.taskNumber} <span className="span-status">{modalInfo.taskStatusMeaning}</span>
        </div>
      </Col>
      <Col span={5}>
        <div className="line-col col-arrangement">
          <span className="col-span-weight">{modalInfo.itemDescription}</span>
          <span className="col-span-light">{modalInfo.itemCode}</span>
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col">
          {modalInfo.taskQty} {modalInfo.uomName}
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col line-color-blue">{modalInfo.processedTime}H</div>
      </Col>
      <Col span={5}>
        <div className="line-col col-arrangement">
          <span className="col-span-light">{modalInfo.actualStartTime}</span>
          <span className="col-span-light">{modalInfo.actualEndTime}</span>
        </div>
      </Col>
    </Row>
  );
};

const TeamManagementModal = (props) => {
  const { workerId, teamManagementInfo } = props;
  const [teamManagementModalList, setTeamManagementModalList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectAllFlag, setSelectAllFlag] = useState(false);

  async function queryModalList() {
    setIndeterminate(false);
    setSelectAllFlag(false);
    teamManagementModalListDs.setQueryParameter('workerId', workerId);
    const res = await teamManagementModalListDs.query();
    if (res && !res.failed && res.content && res.content.length) {
      const modalList = res.content.map((ele) => ({
        ...ele,
        checked: false,
      }));
      setTeamManagementModalList([...modalList]);
    } else {
      setTeamManagementModalList([]);
    }
  }
  useEffect(() => {
    queryModalList();
  }, []);
  const handleSelectAll = (e) => {
    setSelectAllFlag(e.target.checked);
    const changeList = teamManagementModalList.slice();
    const selectedList = changeList.map((ele) => ({
      ...ele,
      checked: e.target.checked,
    }));
    setTeamManagementModalList([...selectedList]);
    setIndeterminate(false);
  };
  const handleChangeStatus = (record, selectFlag) => {
    const changeList = teamManagementModalList.slice();
    const index = changeList.findIndex((v) => v.taskId === record.taskId);
    changeList[index].checked = selectFlag;
    const selectedList = changeList.filter((ele) => ele.checked);
    setTeamManagementModalList([...changeList]);
    setIndeterminate(!!selectedList.length && selectedList.length < changeList.length);
    setSelectAllFlag(selectedList.length === changeList.length);
  };
  // 暂挂任务
  const holdTaskFun = async () => {
    const lists = [];
    teamManagementModalList.map((el) => {
      if (el.checked) {
        lists.push(el.taskId);
      }
      return lists;
    });
    if (lists.length) {
      const res = await pauseTask(lists);
      if (res.failed) {
        return notification.error({
          message: res.message,
        });
      } else {
        queryModalList();
      }
    } else {
      notification.warning({
        message: '请先选择相关任务',
      });
    }
  };
  // 运行任务
  const runTaskFun = async () => {
    const taskIds = [];
    teamManagementModalList.map((el) => {
      if (el.checked) {
        taskIds.push(el.taskId);
      }
      return taskIds;
    });
    if (taskIds.length) {
      const params = {
        worker: teamManagementInfo.workerCode,
        workerId: teamManagementInfo.workerId,
        taskIds,
      };
      const res = await runTask(params);
      if (res.failed) {
        return notification.error({
          message: res.message,
        });
      } else {
        queryModalList();
      }
    } else {
      notification.warning({
        message: '请先选择相关任务',
      });
    }
  };
  return (
    <div className="team-management-modal-content">
      <div className="team-management-modal-header">
        <div className="worker-detail">
          <div>
            <img src={workerIcon} alt="" /> {teamManagementInfo.workerName}(
            {teamManagementInfo.workerCode ? teamManagementInfo.workerCode : '-'})
          </div>
          <div>
            <img src={teamIcon} alt="" />
            {teamManagementInfo.workerGroupName}
          </div>
        </div>
        <div className="operation-button">
          <Checkbox
            checked={selectAllFlag}
            indeterminate={indeterminate}
            className="all-select"
            onChange={handleSelectAll}
          >
            全选
          </Checkbox>
          <Button className="common-button" onClick={holdTaskFun}>
            暂停
          </Button>
          <Button className="common-button button-blue" onClick={runTaskFun}>
            运行
          </Button>
        </div>
      </div>
      <div className="team-management-modal-table">
        <Tabs defaultActiveKey="1" animated={false}>
          <TabPane
            tab={`运行中(${
              teamManagementModalList.filter((v) => v.taskStatus === 'RUNNING').length
            })`}
            key="1"
          >
            {teamManagementModalList &&
              teamManagementModalList
                .filter((v) => v.taskStatus === 'RUNNING')
                .map((ele, index) => (
                  <TeamManagementModalTableLine
                    even={index % 2}
                    modalInfo={ele}
                    index={index}
                    onChecked={handleChangeStatus}
                  />
                ))}
          </TabPane>
          <TabPane
            tab={`暂停(${teamManagementModalList.filter((v) => v.taskStatus === 'PAUSE').length})`}
            key="2"
          >
            {teamManagementModalList &&
              teamManagementModalList
                .filter((v) => v.taskStatus === 'PAUSE')
                .map((ele, index) => (
                  <TeamManagementModalTableLine
                    even={index % 2}
                    modalInfo={ele}
                    index={index}
                    onChecked={handleChangeStatus}
                  />
                ))}
          </TabPane>
          <TabPane
            tab={`暂挂(${
              teamManagementModalList.filter((v) => v.taskStatus === 'PENDING').length
            })`}
            key="3"
          >
            {teamManagementModalList &&
              teamManagementModalList
                .filter((v) => v.taskStatus === 'PENDING')
                .map((ele, index) => (
                  <TeamManagementModalTableLine
                    even={index % 2}
                    modalInfo={ele}
                    index={index}
                    onChecked={handleChangeStatus}
                  />
                ))}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamManagementModal;
