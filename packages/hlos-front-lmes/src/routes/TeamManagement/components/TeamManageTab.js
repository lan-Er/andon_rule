/*
 * @Description: 班组管理Tab页
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-29 14:58:47
 */
import React, { useState, useEffect } from 'react';
import { Button, DataSet, Modal } from 'choerodon-ui/pro';
import { Spin, Checkbox } from 'choerodon-ui';
import moment from 'moment';
// import Icons from 'components/Icons';

import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import uuidv4 from 'uuid/v4';

import { startWork, endWorkBatch } from '@/services/teamManagementService';
import { teamManagementDS, workTypeDS } from '@/stores/teamManagementDS';
import imgDefaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
import xialaIcon from 'hlos-front/lib/assets/icons/down.svg';

import TeamManagementModal from './TeamManagementModal';
import AddWorkModal from './AddWorkModal';
import TaskModal from './TaskModal';
import { Selected } from './index';
import styles from '../index.less';
import '../common.less';
import '../modal.less';

const commonDS = new DataSet(workTypeDS());
const teamManagementDs = new DataSet(teamManagementDS());
const modalKey = Modal.key();
const workerModalkey = Modal.key();
const taskModalkey = Modal.key();
let workerModal = null;

const TeamManagementTab = ({
  paramsFlag,
  searchDs,
  organizationId,
  organizationCode,
  validFlag,
}) => {
  const [workStatus, setWorkStatus] = useState('ON-1');
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamData, setTeamData] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  // const [reQuery, setReQuery] = useState({});
  const [typeList, setTypeList] = useState([]);
  const [totalQty, setTotalQty] = useState(0);

  useEffect(() => {
    if (validFlag) {
      queryTeamManagementList();
    }
  }, [paramsFlag, validFlag]);

  // 数据查询
  async function queryTeamManagementList() {
    setIndeterminate(false);
    setCheckAll(false);
    if (searchDs.current) {
      teamManagementDs.queryParameter = {
        supervisorId: searchDs.current.get('supervisorId'),
        organizationId,
        workerGroupId: searchDs.current.get('workerGroupId'),
        calendarDay: searchDs.current.get('date')
          ? moment(searchDs.current.get('date')).format('YYYY-MM-DD')
          : '',
        calendarShift: searchDs.current.get('calendarShift'),
        // workStatus: value || workStatus,
      };
    }
    setLoading(true);
    const res = await teamManagementDs.query();
    if (getResponse(res) && res.content && res.content.length) {
      const _typeList = [
        {
          status: 'OFF',
          value: '休息中',
        },
      ];
      const managementList = res.content.map((ele, index) => {
        if (ele.workStatus === 'ON') {
          ele.workStatus = `${ele.workStatus}-${index}`;
        }
        if (
          ele.lovDescription &&
          _typeList.findIndex((v) => v.value === ele.lovDescription) === -1
        ) {
          _typeList.unshift({
            status: ele.workStatus,
            value: ele.lovDescription,
          });
        }
        return {
          ...ele,
          checked: false,
        };
      });
      const obj = {};
      // obj[value || workStatus] = managementList;
      managementList.forEach((i) => {
        obj[i.workStatus] = i;
      });
      setTeamData(obj);
      setTotalQty(managementList[0].workerSum);
      setCurrentPage({
        ...currentPage,
        [_typeList[0]?.status]: 1,
      });
      // setReQuery({
      //   ...reQuery,
      //   [value || workStatus]: false,
      // });
      setTypeList(_typeList);
      setWorkStatus(_typeList[0]?.status);
    } else {
      setTeamData({});
      setTotalQty(0);
    }
    setLoading(false);
  }

  // Card 组件
  function Card({ teamManagementInfo, onChecked, index }) {
    return (
      <div className="team-management-card">
        <div className="card-left">
          <img
            src={teamManagementInfo.picture ? teamManagementInfo.picture : imgDefaultAvator}
            alt=""
            onClick={() => openModal(teamManagementInfo)}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="card-right">
          <div>
            <div className="my-right-list">
              <Checkbox
                checked={teamManagementInfo.checked}
                onChange={(e) => onChecked(index, e.target.checked)}
              />
              <span className="name">
                {teamManagementInfo.workerName}(
                {teamManagementInfo.workerCode ? teamManagementInfo.workerCode : '-'})
              </span>
            </div>
            {teamManagementInfo.workStatus !== 'OFF' ? (
              <span
                className={`status ${
                  teamManagementInfo.workStatus === 'OFF' ? 'end-status' : 'start-status'
                }`}
              >
                {teamManagementInfo.workTimeTypeMeaning}
              </span>
            ) : null}
          </div>
          <div className="my-list-footer-time">
            <span>
              <span>首次开班：</span>
              <span>
                {teamManagementInfo.startTime
                  ? moment(teamManagementInfo.startTime).format('MM-DD HH:mm:ss')
                  : ''}
              </span>
            </span>
            <span className="start-time">
              {teamManagementInfo.sumWorkTime ? `${teamManagementInfo.sumWorkTime} H` : ''}
            </span>
          </div>
          <div className="my-list-footer-time" style={{ marginTop: '-10px' }}>
            <span>
              <span>上次更新：</span>
              <span>
                {teamManagementInfo.workerLastUpdateDate
                  ? moment(teamManagementInfo.workerLastUpdateDate).format('MM-DD HH:mm:ss')
                  : ''}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  function openModal(teamManagementInfo) {
    Modal.open({
      key: modalKey,
      title: '详情',
      className: 'team-management-modal',
      children: (
        <TeamManagementModal
          workerId={teamManagementInfo.workerId}
          teamManagementInfo={teamManagementInfo}
        />
      ),
      footer: null,
      closable: true,
      destroyOnClose: true,
      style: {
        width: '80%',
      },
    });
  }

  // 切换页签
  function handleSelectStatus(value) {
    setWorkStatus(value);
    // const { queryWorkerGroupVOS } = teamData[value];
    // setCurrentList(queryWorkerGroupVOS);
    setCurrentPage({
      ...currentPage,
      [value]: currentPage[value] || 1,
    });
    // const validateValue = await searchDs.validate(false, false);
    // if (!validateValue) {
    //   notification.error({
    //     message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
    //   });
    //   return;
    // }
    // if(reQuery[value]) {
    //   // 数据有状态更改的时候, 重新查询
    //   queryTeamManagementList(value);
    //   setReQuery({
    //     ...reQuery,
    //     [workStatus]: false,
    //   });
    // } else if(!teamData[value]?.length) {
    //   queryTeamManagementList(value);
    // } else if(teamData[value].every(v => v.checked)) {
    //   setIndeterminate(false);
    //   setCheckAll(true);
    // } else if(teamData[value].some(v => v.checked)){
    //   setIndeterminate(true);
    //   setCheckAll(false);
    // } else {
    //   setIndeterminate(false);
    //   setCheckAll(false);
    // }
  }

  // 全选按钮
  function onCheckAllChange(e) {
    setCheckAll(e.target.checked);
    setIndeterminate(false);
    const changeList = teamData[workStatus].queryWorkerGroupVOS.slice();
    const chooseAllList = changeList.map((ele) => ({
      ...ele,
      checked: e.target.checked,
    }));
    setTeamData({
      ...teamData,
      [workStatus]: {
        ...teamData[workStatus],
        queryWorkerGroupVOS: chooseAllList,
      },
    });
  }

  async function processDataFun(type) {
    let cloneList = [...teamData[workStatus].queryWorkerGroupVOS];
    cloneList = cloneList.map((el) => {
      if (type === 'start') {
        return {
          ...el,
          worker: el.workerCode,
          workerGroup: el.workerGroupCode,
          workTimeType: commonDS.current.get('workerTimeType'),
        };
      }
      return { ...el };
    });
    const filterList = cloneList.filter((ele) => ele.checked);

    const validateValue = await searchDs.validate(false, false);
    if (!validateValue || (type !== 'allOver' && !filterList.length)) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const params = {
      supervisorId: searchDs.current.get('supervisorId'),
      supervisorCode: searchDs.current.get('supervisorCode'),
      workerGroupId: searchDs.current.get('workerGroupId'),
      workerGroup: searchDs.current.get('workerGroupCode'),
      organizationId,
      organizationCode,
      // calendarDay: searchDs.current.get('date'),
      calendarShift: searchDs.current.get('calendarShift'),
      manageRuleId: searchDs.current.get('manageRuleId'),
      workTimeType: commonDS.current.get('workerTimeType'),
      // startTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      lineList: type === 'allOver' ? cloneList : [...filterList],
    };
    return params;
  }

  // // 更改 reQuery
  // function changeReQuery() {
  //   const tempObj = {...reQuery};
  //   for(const v in tempObj) {
  //     if(v === workStatus) {
  //       tempObj[v] = false;
  //     } else {
  //       tempObj[v] = true;
  //     }
  //   }
  //   setReQuery({...tempObj});
  // }
  // 开班
  async function startWorkFun() {
    const params = await processDataFun('start');
    if (!params) {
      return;
    }
    setLoading(true);
    params.startTime = moment(new Date()).format(DEFAULT_DATETIME_FORMAT);
    const res = await startWork(params);
    if (res.failed) {
      setLoading(false);
      return notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '开班成功',
      });
      await queryTeamManagementList();
    }
    setLoading(false);
    // changeReQuery();
  }

  // 结班
  async function endWorkFun() {
    const params = await processDataFun('over');
    if (!params) {
      return;
    }
    setLoading(true);
    params.endTime = moment(new Date()).format(DEFAULT_DATETIME_FORMAT);

    const submitList = [];
    const { lineList, ...otherPara } = params;
    lineList.forEach((i) => {
      submitList.push({
        ...otherPara,
        workTimeType: i.workTimeType,
        tenantId: getCurrentOrganizationId(),
        lineList: [
          {
            workerId: i.workerId,
            worker: i.workerCode,
            remark: i.remark,
          },
        ],
      });
    });

    const res = await endWorkBatch(submitList);
    if (res.failed) {
      setLoading(false);
      return notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '结班成功',
      });
      await queryTeamManagementList();
    }
    setLoading(false);
    // changeReQuery();
  }

  // 任务
  function taskFun() {
    const {
      supervisorId,
      supervisorCode,
      supervisorName,
      workerGroupId,
      workerGroupName,
      fileUrl,
    } = searchDs.current.toJSONData();
    if (!supervisorId) return;
    const workerInfo = {
      supervisorId,
      supervisorCode,
      supervisorName,
      workerGroupId,
      workerGroupName,
      organizationId,
      fileUrl,
    };
    Modal.open({
      key: taskModalkey,
      title: '任务列表',
      className: styles['team-management-task-modal'],
      children: <TaskModal workerInfo={workerInfo} />,
      footer: null,
      closable: true,
      destroyOnClose: true,
    });
  }

  // 全部下班
  async function allEndFun() {
    const params = await processDataFun('allOver');
    if (!params) {
      return;
    }
    setLoading(true);

    const submitList = [];
    const { lineList, ...otherPara } = params;
    lineList.forEach((i) => {
      submitList.push({
        ...otherPara,
        endTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        workTimeType: i.workTimeType,
        tenantId: getCurrentOrganizationId(),
        lineList: [
          {
            workerId: i.workerId,
            worker: i.workerCode,
            remark: i.remark,
          },
        ],
      });
    });
    const res = await endWorkBatch(submitList);
    if (res.failed) {
      setLoading(false);
      return notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '下班成功',
      });
      await queryTeamManagementList();
    }
    setLoading(false);
    // changeReQuery();
  }

  // 单选
  function handleChecked(index, checkFlag) {
    const changeList = teamData[workStatus].queryWorkerGroupVOS.slice();
    changeList[index].checked = checkFlag;
    const checkedList = changeList.filter((ele) => ele.checked);
    setIndeterminate(!!checkedList.length && checkedList.length < changeList.length);
    setCheckAll(checkedList.length === changeList.length);
    setTeamData({
      ...teamData,
      [workStatus]: {
        ...teamData[workStatus],
        queryWorkerGroupVOS: changeList,
      },
    });
  }

  // 新增员工
  function handleAddWorker() {
    if (
      searchDs.current &&
      searchDs.current.get('supervisorId') &&
      searchDs.current.get('workerGroupId')
    ) {
      workerModal = Modal.open({
        key: workerModalkey,
        title: '添加员工',
        className: 'team-management-add-worker-modal',
        children: (
          <AddWorkModal
            onAddworkerClick={addworkerClick}
            workerGroupId={searchDs.current.get('workerGroupId')}
          />
        ),
        footer: null,
        closable: true,
        destroyOnClose: true,
        style: {
          width: '30%',
        },
      });
    } else {
      notification.warning({
        message: '请选择班组',
      });
    }
  }

  // 添加员工仅前端展示
  async function addworkerClick(data) {
    workerModal.close();
    if (!data) {
      return;
    }
    if (data && data.workerId) {
      const isAddList = teamData[workStatus].queryWorkerGroupVOS.filter(
        (el) => el.workerId === data.workerId
      );
      if (isAddList.length) {
        notification.warning({
          message: `${data.workerName || data.workerCode}已存在，请勿重复添加`,
        });
      } else {
        setTeamData({
          ...teamData,
          [workStatus]: {
            ...teamData[workStatus],
            queryWorkerGroupVOS: teamData[workStatus].queryWorkerGroupVOS.concat({
              ...data,
              picture: data.fileUrl,
              checked: false,
            }),
          },
        });
      }
    }
  }

  return (
    <Spin size="large" spinning={loading}>
      <div className="team-management-tab">
        <div className="team-management-tab-header">
          <div className="team-management-tab-list">
            {typeList.map((v) => (
              <Button
                className={`common-button none-left-button ${
                  workStatus === v.status ? 'closed-class' : ''
                }`}
                onClick={() => handleSelectStatus(v.status)}
              >
                {`${v.value}(${teamData[v.status]?.workerQty ?? 0})`}
              </Button>
            ))}
            {typeList.length ? (
              <span
                style={{ fontSize: 20, marginLeft: 24, verticalAlign: 'middle', color: '#666' }}
              >
                合计：{totalQty}人
              </span>
            ) : null}
          </div>
          <div className="tab-right-header" style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              indeterminate={indeterminate}
              checked={checkAll}
              onChange={onCheckAllChange}
              className="all-select"
            >
              全选
            </Checkbox>
            <Selected
              className="worker-type"
              headerDS={commonDS}
              name="workerTimeType"
              placeholder="工作类型"
              // onQuery={selectWorkerTimeType}
            />
            <Button
              className="common-button start-class"
              onClick={startWorkFun}
              disabled={workStatus !== 'OFF'}
            >
              开班
            </Button>
            <Button
              className="common-button end-class"
              onClick={endWorkFun}
              disabled={workStatus === 'OFF'}
            >
              结班
            </Button>
            <Button className="common-button other-class" onClick={taskFun}>
              任务
            </Button>
            <Button
              className="common-button other-class"
              onClick={allEndFun}
              disabled={workStatus === 'OFF'}
            >
              全部下班
            </Button>
          </div>
        </div>
        <div className="team-management-tab-container">
          {teamData[workStatus]?.queryWorkerGroupVOS.length
            ? teamData[workStatus].queryWorkerGroupVOS
                .slice(0, currentPage[workStatus] * 30)
                .map((i, index) => {
                  return (
                    <Card
                      key={uuidv4()}
                      teamManagementInfo={i}
                      index={index}
                      onChecked={handleChecked}
                    />
                  );
                })
            : null}
          {workStatus === 'OFF' ? (
            <div className="team-management-card add-card" onClick={handleAddWorker}>
              + 新增
            </div>
          ) : null}
          {teamData[workStatus]?.queryWorkerGroupVOS.length > 30 && (
            <div
              className="show-icon"
              style={{
                cursor:
                  teamData[workStatus].queryWorkerGroupVOS.length ===
                  teamData[workStatus].queryWorkerGroupVOS.slice(0, currentPage[workStatus] * 30)
                    .length
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              <img
                src={xialaIcon}
                alt=""
                onClick={() =>
                  setCurrentPage({ ...currentPage, [workStatus]: currentPage[workStatus] + 1 })
                }
              />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default TeamManagementTab;
