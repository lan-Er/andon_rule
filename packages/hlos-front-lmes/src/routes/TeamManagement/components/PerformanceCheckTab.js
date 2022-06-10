/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-21 14:19:34
 * @LastEditTime: 2020-10-23 11:24:12
 * @Description:绩效查看
 */
import React, { useEffect, useState } from 'react';
import { Lov, Button, Modal } from 'choerodon-ui/pro';
import { Row, Col, Checkbox, Spin } from 'choerodon-ui';
import moment from 'moment';

import notification from 'utils/notification';
import intl from 'utils/intl';

// import capacityIcon from '../assets/capacityIcon.svg';
import dateIcon from 'hlos-front/lib/assets/icons/clock.svg';
import workerIcon from 'hlos-front/lib/assets/icons/workcell.svg';
import PerformanceCheckModal from './PerformanceCheckModal';
import { workGroupUserDetail, saveWorkerPerformance } from '@/services/teamManagementService';

const modalKey = Modal.key();

const TableLine = (props) => {
  const { lineInfo, workerGroupName } = props;
  const openCheckModal = () => {
    Modal.open({
      key: modalKey,
      title: '详情',
      className: 'performance-check-modal',
      children: (
        <PerformanceCheckModal
          detailInfo={lineInfo}
          workerId={lineInfo.workerId}
          workerGroupName={workerGroupName}
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
    <Row className={`table-line ${props.even ? 'even-table-line' : ''}`}>
      <Col span={6} className="fist-col">
        <Checkbox checked={lineInfo.checked} onChange={handleChangeStatus} />
        <span className="worker-name" onClick={openCheckModal}>
          {lineInfo.workerName || '-'}
        </span>
      </Col>
      <Col span={3}>
        <div className="mumber-tag">
          <span className="radius-tag" style={{ background: '#2D9558' }} />
          {lineInfo.userExecuteQty || 0}
        </div>
      </Col>
      <Col span={3}>
        <div className="mumber-tag">
          <span className="radius-tag" style={{ background: '#F7B500' }} />
          {lineInfo.userReworkQty || 0}
        </div>
      </Col>
      <Col span={3}>
        <div className="mumber-tag">
          <span className="radius-tag" style={{ background: '#DF5630' }} />
          {lineInfo.userExecuteNgQty || 0}
        </div>
      </Col>
      <Col span={3}>
        <div className="mumber-tag">
          <span className="radius-tag" />
          {lineInfo.userScrappedQty || 0}
        </div>
      </Col>
      <Col span={6}>{lineInfo.workTime}</Col>
    </Row>
  );
};

const PerformanceCheckTab = (props) => {
  const {
    paramsFlag,
    searchDs,
    // calendarShift,
    // workerTimeType,
    // selectedDate,
    // workerGroupId,
    // worker,
    validFlag,
  } = props;
  const [summaryObj, setSummaryObj] = useState({});
  const [workGroupPerformanceLineVoList, setWorkGroupPerformanceLineVoList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [loading, setLoading] = useState(false);
  // 获取绩效
  async function queryWorkGroupPerformance() {
    let SearchParams = {};
    if (searchDs.current) {
      SearchParams = {
        // supervisorId: searchDs.current.get('supervisorId'),
        // employeeOrganizationId: searchDs.current.get('workerGroupId'),
        // date: searchDs.current.get('date'),
        // calendarShift: searchDs.current.get('calendarShift'),
        // workerTimeType: searchDs.current.get('workerTimeType'),
        workerId: searchDs.current.get('workerId'),
        workerGroupId: searchDs.current.get('workerGroupId'),
      };
    }
    const validateValue = await searchDs.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    setLoading(true);
    const res = await workGroupUserDetail(SearchParams);
    if (res && !res.failed) {
      setSummaryObj(res);
      if (res.workGroupUserInfoVoList) {
        const handleWorkGroupUserInfoVoList = res.workGroupUserInfoVoList.map((el) => ({
          ...el,
          checked: false,
        }));
        setWorkGroupPerformanceLineVoList([...handleWorkGroupUserInfoVoList]);
      } else {
        setWorkGroupPerformanceLineVoList([]);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (validFlag) {
      queryWorkGroupPerformance();
    }
  }, [paramsFlag, validFlag]);

  // 查询

  const handleQuery = () => {
    if (validFlag) {
      queryWorkGroupPerformance();
    } else {
      notification.warning({
        message: '请先填写必输项',
      });
    }
  };

  const handleSubmit = async () => {
    console.log(checkedList);
    const filterList = checkedList.map((element) => {
      const workerPerformanceLineList = element.workerGroupTaskInfoVoList.map((el) => ({
        ...el,
        processNgQty: el.taskExecuteNgQty || null,
        processOkQty: el.taskExecuteQty || null,
        reworkQty: el.taskReworkQty || null,
        scrappedQty: el.taskScrappedQty || null,
      }));
      return {
        ...element,
        workerGroup: searchDs.current.get('workerGroupCode'),
        worker: element.workerCode,
        workerGroupId: searchDs.current.get('workerGroupId'),
        organizationCode: searchDs.current.get('organizationCode'),
        organizationId: searchDs.current.get('organizationId'),
        calendarDay: moment(searchDs.current.get('date')).format('YYYY-MM-DD 00:00:00'),
        workerPerformanceLineList,
      };
    });
    if (!filterList.length) {
      notification.warning({
        message: '请先选择提交的数据',
      });
      return;
    }
    setLoading(true);
    const res = await saveWorkerPerformance(filterList);
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      setLoading(false);
    } else {
      notification.success({
        message: '提交成功',
      });
      setLoading(false);
      queryWorkGroupPerformance();
    }
  };

  const handleChecked = (index, checkFlag) => {
    const changeList = workGroupPerformanceLineVoList.slice();
    // console.log(changeList, index, checkFlag );
    changeList[index].checked = checkFlag;
    const checkedSubmitList = changeList.filter((ele) => ele.checked);
    setWorkGroupPerformanceLineVoList([...changeList]);
    setCheckedList([...checkedSubmitList]);
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="performance-check-tab">
        <div className="performance-check-tab-header">
          <Lov
            dataSet={searchDs}
            name="workerObj"
            placeholder="请输入员工姓名"
            className="worker-select-suffix"
            onChange={handleQuery}
          />
          <Button className="submit-button" onClick={handleSubmit}>
            确认
          </Button>
        </div>
        <div className="performance-check-tab-container">
          <div className="container-table-header-summary">
            <div>
              <div>
                <img src={workerIcon} alt="" /> 员工{' '}
                <span className="show-number">{workGroupPerformanceLineVoList.length || 0}</span> 人
              </div>
              {/* <div>
              <img src={capacityIcon} alt="" /> 产能<span className="show-number"> 0 </span>个
            </div> */}
              <div>
                <img src={dateIcon} alt="" /> {summaryObj.startLocalTime} ~{' '}
                {summaryObj.endLocalTime} <span className="show-number"> 0 H </span>
              </div>
            </div>
            <div>
              <div>
                <span className="radius-tag" style={{ background: '#2D9558' }} /> 合格{' '}
                <span className="show-number"> {summaryObj.executeQty} </span>
              </div>
              <div>
                <span className="radius-tag" style={{ background: '#F7B500' }} /> 返修{' '}
                <span className="show-number"> {summaryObj.reworkQty} </span>
              </div>
              <div>
                <span className="radius-tag" style={{ background: '#DF5630' }} /> 不合格{' '}
                <span className="show-number"> {summaryObj.executeNgQty} </span>
              </div>
              <div>
                <span className="radius-tag" /> 报废{' '}
                <span className="show-number"> {summaryObj.scrappedQty} </span>
              </div>
            </div>
          </div>
          <div className="container-table">
            <div className="container-table-header">
              <Row>
                <Col span={6} className="fist-col">
                  员工
                </Col>
                <Col span={3}>合格</Col>
                <Col span={3}>返修</Col>
                <Col span={3}>不合格</Col>
                <Col span={3}>报废</Col>
                <Col span={6}>总工时</Col>
              </Row>
            </div>
            <div className="container-table-content">
              {workGroupPerformanceLineVoList &&
                workGroupPerformanceLineVoList.map((element, index) => (
                  <TableLine
                    lineInfo={element}
                    workerGroupName={searchDs.current.get('workerGroupName')}
                    index={index}
                    even={index % 2}
                    onChecked={handleChecked}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default PerformanceCheckTab;
