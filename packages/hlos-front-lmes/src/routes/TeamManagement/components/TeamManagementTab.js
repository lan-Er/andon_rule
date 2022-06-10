/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-21 14:19:34
 * @LastEditTime: 2021-06-02 10:47:42
 * @Description:班组管理
 */
import moment from 'moment';
import Icons from 'components/Icons';
import { Checkbox, Spin } from 'choerodon-ui';
import React, { useState, useEffect } from 'react';
import { Button, Modal, DataSet } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { teamManagementDS, workTypeDS } from '@/stores/teamManagementDS';
import xialaIcon from 'hlos-front/lib/assets/icons/down.svg';
import { startWork, endWork } from '@/services/teamManagementService';
import imgDefaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
// import workType from 'hlos-front/lib/assets/icons/work-type.svg';
import { Selected } from './index';

import '../common.less';
import '../modal.less';
import AddWorkModal from './AddWorkModal';
import TeamManagementModal from './TeamManagementModal';

const modalKey = Modal.key();
const teamManagementDs = new DataSet(teamManagementDS());
const workerModalkey = Modal.key();
let workerModal = null;
const commonDS = new DataSet(workTypeDS());

const Card = (props) => {
  const { teamManagementInfo } = props;
  const openModal = () => {
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
  };
  const handleChangeStatus = (e) => {
    props.onChecked(props.index, e.target.checked);
  };
  return (
    <div className="team-management-card">
      <div className="card-left">
        <img
          src={teamManagementInfo.picture ? teamManagementInfo.picture : imgDefaultAvator}
          alt=""
          onClick={openModal}
          style={{cursor: 'pointer'}}
        />
      </div>
      <div className="card-right">
        <div>
          <div className="my-right-list">
            <Checkbox checked={teamManagementInfo.checked} onChange={handleChangeStatus} />
            <span className="name">
              {teamManagementInfo.workerName}(
              {teamManagementInfo.workerCode ? teamManagementInfo.workerCode : '-'})
            </span>
          </div>
          <span
            className={`status ${
              teamManagementInfo.workStatus !== 'ON' ? 'end-status' : 'start-status'
            }`}
          >
            {teamManagementInfo.workStatusMeaning}
          </span>
        </div>
        <div>
          <Icons type="odd-number" size="26" color="#999" />
          <div className="control-exceed" title={teamManagementInfo.taskNum}>
            {teamManagementInfo.taskNum}
          </div>
        </div>
        {/* <div>
          <Icons type="banzuguanli-1" size="26" color="#999" />
          <div
            className="control-exceed"
            title={`${teamManagementInfo.itemCode} ${teamManagementInfo.itemDescription}`}
          >
            {teamManagementInfo.itemCode}
            {teamManagementInfo.itemDescription}
          </div>
        </div> */}
        <div className="my-list-footer-time">
          <span>
            <Icons type="clock" size="26" color="#999" />
            {moment(teamManagementInfo.startTime).format('LTS')}
          </span>
          {teamManagementInfo.workStatus === 'OFF' && (
            <span>{moment(teamManagementInfo.endTime).format('LTS')}</span>
          )}
          <span className="start-time">
            {teamManagementInfo.effectiveTime ? `${teamManagementInfo.effectiveTime} H` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

const TeamManagementTab = (props) => {
  const {
    paramsFlag,
    searchDs,
    organizationId,
    // calendarShift,
    // workerTimeType,
    // selectedDate,
    // workerGroupId,
    // worker,
    validFlag,
  } = props;
  const [workStatus, setWorkStatus] = useState('ON');
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [teamManagementList, setTeamManagementList] = useState([]);
  const [openFlag, setOpenFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeList, setTypeList] = useState([{
    status: 'OTHER',
    value: '休息中',
  }]);

  const handleSelectStatus = async (value) => {
    await setWorkStatus(value);
    const validateValue = await searchDs.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    queryTeamManagementList(value);
  };
  const onCheckAllChange = (e) => {
    setCheckAll(e.target.checked);
    setIndeterminate(false);
    const changeList = teamManagementList.slice();
    const chooseAllList = changeList.map((ele) => ({
      ...ele,
      checked: e.target.checked,
    }));
    setTeamManagementList([...chooseAllList]);
  };

  async function queryTeamManagementList(value) {
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
        workStatus: value || workStatus,
      };
    }
    setLoading(true);
    try {
      const res = await teamManagementDs.query();
      if (res && !res.failed && res.content && res.content.length) {
        const _typeList = typeList.slice();
        const managementList = res.content.map((ele) => {
          if(ele.lovDescription && _typeList.findIndex(v => v.value === ele.lovDescription) === -1){
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
        setTeamManagementList([...managementList]);
        setTypeList(_typeList);
        setWorkStatus(value || workStatus);
      } else {
        setTeamManagementList([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (validFlag) {
      queryTeamManagementList();
    }
  }, [paramsFlag, validFlag]);

  const handleChecked = (index, checkFlag) => {
    const changeList = teamManagementList.slice();
    changeList[index].checked = checkFlag;
    const checkedList = changeList.filter((ele) => ele.checked);
    setIndeterminate(!!checkedList.length && checkedList.length < changeList.length);
    setCheckAll(checkedList.length === changeList.length);
    setTeamManagementList([...changeList]);
  };

  const handleOpenCard = () => {
    setOpenFlag(true);
  };

  // 开班

  const startWorkFun = async () => {
    const params = await processDataFun();
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
      queryTeamManagementList();
    }
    setLoading(false);
  };

  const endWorkFun = async () => {
    const params = await processDataFun();
    if (!params) {
      return;
    }
    setLoading(true);
    params.endTime = moment(new Date()).format(DEFAULT_DATETIME_FORMAT);
    const res = await endWork(params);
    if (res.failed) {
      setLoading(false);
      return notification.error({
        message: res.message,
      });
    } else {
      queryTeamManagementList();
    }
    setLoading(false);
  };

  const processDataFun = async () => {
    let filterList = teamManagementList.filter((ele) => ele.checked);
    filterList = filterList.map((el) => ({
      ...el,
      worker: el.workerCode,
      workerGroup: el.workerGroupCode,
    }));
    const validateValue = await searchDs.validate(false, false);
    if (!validateValue || !filterList.length) {
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
      organizationId: searchDs.current.get('organizationId'),
      organizationCode: searchDs.current.get('organizationCode'),
      // calendarDay: searchDs.current.get('date'),
      calendarShift: searchDs.current.get('calendarShift'),
      workTimeType: searchDs.current.get('workerTimeType'),
      // startTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      lineList: [...filterList],
    };
    return params;
  };
  // 添加员工仅前端展示
  const addworkerClick = async (data) => {
    workerModal.close();
    if (!data) {
      return;
    }
    if (data && data.workerId) {
      const isAddList = teamManagementList.filter((el) => el.workerId === data.workerId);
      if (isAddList.length) {
        notification.warning({
          message: `${data.workerName || data.workerCode}已存在，请勿重复添加`,
        });
      } else {
        setTeamManagementList([
          ...teamManagementList,
          ...[{ ...data, picture: data.fileUrl, checked: false }],
        ]);
      }
    }
  };
  // 新增员工
  const handleAddWorker = () => {
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
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="team-management-tab">
        <div className="team-management-tab-header">
          <div>
            {
              typeList.length > 1 && typeList.map(v => (
                <Button
                  className={`common-button none-left-button ${
                    workStatus === v.status ? 'closed-class' : ''
                  }`}
                  onClick={() => handleSelectStatus(v.status)}
                >
                  {`${v.value}(${teamManagementList.length})`}
                </Button>
              ))
            }
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
            <Button className="common-button start-class" onClick={startWorkFun}>
              开班
            </Button>
            <Button className="common-button end-class" onClick={endWorkFun}>
              结班
            </Button>
            <Button className="common-button other-class" onClick={endWorkFun}>
              任务
            </Button>
            <Button className="common-button other-class" onClick={endWorkFun}>
              全部下班
            </Button>
          </div>
        </div>
        <div className="team-management-tab-container">
          {teamManagementList &&
            teamManagementList.map((element, index) => {
              if (teamManagementList.length > 40 && !openFlag && !checkAll) {
                if (index < 8) {
                  return (
                    <Card teamManagementInfo={element} index={index} onChecked={handleChecked} />
                  );
                } else {
                  return '';
                }
              } else {
                return (
                  <Card teamManagementInfo={element} index={index} onChecked={handleChecked} />
                );
              }
            })
          }
          {workStatus !== 'ON' && (
            <div className="team-management-card add-card" onClick={handleAddWorker}>
              + 新增
            </div>
          )}
          {teamManagementList.length > 40 && !openFlag && !checkAll && (
            <div className="show-icon">
              <img src={xialaIcon} alt="" onClick={handleOpenCard} />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default TeamManagementTab;
