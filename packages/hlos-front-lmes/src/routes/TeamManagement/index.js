/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-21 10:39:43
 * @LastEditTime: 2021-07-15 18:11:41
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { Row, Col, Tabs } from 'choerodon-ui';
import moment from 'moment';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentUserId } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import intl from 'utils/intl';

import './index.less';
import { LovSelect, DatePickerSelect, Selected } from './components';
import ShiftSummaryTab from './components/ShiftSummaryTab';
import TeamManagementTab from './components/TeamManageTab';
import PerformanceCheckTab from './components/PerformanceCheckTab';
import workerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import lockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import unLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
import dateIcon from 'hlos-front/lib/assets/icons/date.svg';
import teamIcon from 'hlos-front/lib/assets/icons/team.svg';
import classesIcon from 'hlos-front/lib/assets/icons/classess.svg';
import imgDefaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
// import workType from 'hlos-front/lib/assets/icons/work-type.svg';
import exitIcon from 'hlos-front/lib/assets/icons/exit.svg';
import { commonHeaderDS } from '@/stores/teamManagementDS';
import { userSetting } from '@/services/teamManagementService';

const { TabPane } = Tabs;
const commonDS = new DataSet(commonHeaderDS());
const userId = getCurrentUserId();
// const teamManagementDs = new DataSet(teamManagementDS());

const TeamManagement = ({ history }) => {
  const [paramsFlag, setParamsFlag] = useState(false);
  const [workerGroupId, setWorkerGroupId] = useState('');
  const [worker, setWorker] = useState('');
  const [calendarShift, setCalendarShift] = useState(null);
  // const [workerTimeType, setWorkerTimeType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment(new Date()).format(DEFAULT_DATE_FORMAT));
  const [wokerFile, setWokerFile] = useState('');
  const [defaultWorker, setDefaultWorker] = useState({});
  const [lockWorker, setLockWorker] = useState(false);
  const [validFlag, setValidFlag] = useState(false);

  const defaultUserSetting = async () => {
    await userSetting({
      userId,
      queryCodeFlag: 'Y',
    }).then((res) => {
      if (res && res.content && res.content[0]) {
        const {
          workerOrganizationId: organizationId,
          workerOrganizationCode: organizationCode,
          // organizationName,
          workerId,
          workerCode,
          workerName,
          fileUrl,
          workerGroupId: groupId,
          workerGroupCode,
          workerGroupName,
          workerTypeMeaning,
          manageRuleId,
        } = res.content[0];
        setDefaultWorker({
          workerId,
          workerCode,
          workerName,
          fileUrl,
          workerGroupId,
          workerGroupCode,
          workerGroupName,
          organizationId,
          organizationCode,
        });
        commonDS.current.set('organizationId', organizationId);
        commonDS.current.set('organizationCode', organizationCode);
        commonDS.current.set('supervisorObj', {
          fileUrl,
          workerId,
          workerCode,
          workerName,
        });
        selectWorker({
          organizationId,
          organizationCode,
          // organizationName,
          workerId,
          workerCode,
          workerName,
          workerGroupId: groupId,
          workerGroupCode,
          workerGroupName,
          workerTypeMeaning,
          manageRuleId,
        });
      }
    });
  };

  useEffect(() => {
    defaultUserSetting();
  }, []);

  const selectWorkerGroup = (value) => {
    if (!value) return;
    setWorkerGroupId(commonDS.current.get('workerGroupId'));
    handleSearch();
  };

  const selectCalendarShift = () => {
    setCalendarShift(commonDS.current.get('calendarShift'));
    handleSearch();
  };

  // const selectWorkerTimeType = () => {
  //   setWorkerTimeType(commonDS.current.get('workerTimeType'));
  // };
  // 选择日期
  const selectDate = () => {
    setSelectedDate(commonDS.current.get('date'));
    handleSearch();
  };

  // // 选择工作时间大类
  // const selectWorkTimeClass = () => {
  //   setWorkTimeClass(commonDS.current.get('workTimeClass'));
  // };

  // 选择主管
  const selectWorker = (value) => {
    if (!value) return;
    setWokerFile(commonDS.current.get('fileUrl'));
    setWorker(commonDS.current.get('supervisorId'));
    commonDS.current.set('workerGroupObj', {
      workerGroupId: value.workerGroupId,
      workerGroupCode: value.workerGroupCode,
      workerGroupName: value.workerGroupName,
      manageRuleId: value.manageRuleId,
    });
    handleSearch();
  };
  // 搜索
  const handleSearch = async () => {
    const validateValue = await commonDS.validate(false, false);
    if (!validateValue) {
      setValidFlag(false);
      return notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
    }
    setValidFlag(true);
  };
  useEffect(() => {
    setParamsFlag(!paramsFlag);
    // setValidFlag(true);
  }, [worker, workerGroupId, calendarShift, selectedDate]);
  // 退出
  const exitFun = () => {
    commonDS.current.reset();
    history.push('/workplace');
    closeTab('/pub/lmes/team-management');
  };

  // 锁
  const onLockChange = () => {
    setLockWorker(!lockWorker);
  };

  return (
    <div className="team-management">
      <div className="team-management-header">
        <div className="avator-img">
          <img src={wokerFile || imgDefaultAvator} alt="" />
        </div>
        <div className="team-management-header-right">
          <Row type="flex" align="middle" justify="space-between">
            <Col className="gutter-row">
              <LovSelect
                headerDS={commonDS}
                name="supervisorObj"
                leftIcon={workerIcon}
                rightIcon={lockWorker ? lockIcon : unLockIcon}
                onQuery={selectWorker}
                onLockChange={onLockChange}
              />
            </Col>
            <Col className="gutter-row">
              <LovSelect
                headerDS={commonDS}
                name="workerGroupObj"
                leftIcon={teamIcon}
                onQuery={selectWorkerGroup}
              />
            </Col>
            <Col className="gutter-row">
              <DatePickerSelect
                headerDS={commonDS}
                name="date"
                leftIcon={dateIcon}
                onQuery={selectDate}
              />
            </Col>
            <Col className="gutter-row">
              <Selected
                headerDS={commonDS}
                name="calendarShift"
                leftIcon={classesIcon}
                onQuery={selectCalendarShift}
                placeholder="班次"
              />
            </Col>
            <Col className="gutter-row">
              <img src={exitIcon} alt="" style={{ marginLeft: '30px' }} onClick={exitFun} />
            </Col>
          </Row>
        </div>
      </div>
      <div className="team-management-content">
        <Tabs
          size="large"
          tabBarStyle={{ color: '#1C879C' }}
          defaultActiveKey="1"
          // onChange={callback}
          className="content-tabs"
        >
          <TabPane tab="班组管理" key="1">
            <TeamManagementTab
              {...defaultWorker}
              paramsFlag={paramsFlag}
              calendarShift={calendarShift}
              // workerTimeType={workerTimeType}
              selectedDate={selectedDate}
              workerGroupId={workerGroupId}
              worker={worker}
              searchDs={commonDS}
              validFlag={validFlag}
            />
          </TabPane>
          <TabPane tab="班次小结" key="2">
            <ShiftSummaryTab searchDs={commonDS} defaultWorker={defaultWorker} />
          </TabPane>
          <TabPane tab="绩效查看" key="3">
            <PerformanceCheckTab
              paramsFlag={paramsFlag}
              searchDs={commonDS}
              calendarShift={calendarShift}
              // workerTimeType={workerTimeType}
              workerGroupId={workerGroupId}
              selectedDate={selectedDate}
              worker={worker}
              validFlag={validFlag}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamManagement;
