/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-22 14:07:54
 * @LastEditTime: 2020-10-15 12:47:31
 * @Description:绩效查看模态框
 */
import React, { useEffect, useState } from 'react';

import { DataSet } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';

import { performanceCheckModalDS } from '@/stores/teamManagementDS';
import workerIcon from 'hlos-front/lib/assets/icons/workcell.svg';
import workNumberIcon from 'hlos-front/lib/assets/icons/NO.svg';

const performanceCheckModalList = new DataSet(performanceCheckModalDS());

const PerformanceCheckModalTableLine = (props) => {
  const { performanceCheckListLine } = props;
  return (
    <Row className={`modal-table-line ${props.even ? 'even-modal-table-line' : ''}`}>
      <Col span={5} className="first-col">
        <div className="line-col">{performanceCheckListLine.taskNum}</div>
      </Col>
      <Col span={4}>
        <div className="line-col col-arrangement">
          <span className="col-span-weight">{performanceCheckListLine.itemDescription}</span>
          <span className="col-span-light">{performanceCheckListLine.itemCode}</span>
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col col-arrangement-constant">
          <span className="radius-tag" style={{ background: '#2D9558' }} />{' '}
          {performanceCheckListLine.executeQty}
          {performanceCheckListLine.uom}
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col col-arrangement-constant">
          <span className="radius-tag" style={{ background: '#F7B500' }} />{' '}
          {performanceCheckListLine.reworkQty} {performanceCheckListLine.uom}
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col col-arrangement-constant">
          <span className="radius-tag" style={{ background: '#DF5630' }} />{' '}
          {performanceCheckListLine.executeNgQty} {performanceCheckListLine.uom}
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col col-arrangement-constant">
          <span className="radius-tag" /> {performanceCheckListLine.scrappedQty}{' '}
          {performanceCheckListLine.uom}
        </div>
      </Col>
      <Col span={3}>
        <div className="line-col">{performanceCheckListLine.timeSpan} H</div>
      </Col>
    </Row>
  );
};

const PerformanceCheckModal = (props) => {
  const { workerId, detailInfo } = props;
  const [list, setList] = useState([]);
  async function queryModalList() {
    performanceCheckModalList.setQueryParameter('workerId', workerId);
    const res = await performanceCheckModalList.query();
    if (res && !res.failed) {
      setList([...res.content]);
    } else {
      setList([]);
    }
  }

  useEffect(() => {
    queryModalList();
  }, []);
  return (
    <div className="performance-check-modal-content">
      <div className="performance-check-modal-header">
        <div className="worker-detail">
          <div>
            <img src={workerIcon} alt="" /> {detailInfo.workerName}
          </div>
          <div>
            <img src={workNumberIcon} alt="" />
            {detailInfo.workerCode}
          </div>
        </div>
      </div>
      <div className="performance-check-modal-table">
        <Row className="table-header-row">
          <Col span={5} className="first-col">
            <div>任务</div>
          </Col>
          <Col span={4}>
            <div>物料</div>
          </Col>
          <Col span={3}>
            <div>合格</div>
          </Col>
          <Col span={3}>
            <div>返修</div>
          </Col>
          <Col span={3}>
            <div>不合格</div>
          </Col>
          <Col span={3}>
            <div>报废</div>
          </Col>
          <Col span={3}>
            <div>时长</div>
          </Col>
        </Row>
        <div className="table-content">
          {list &&
            list.map((ele, index) => (
              <PerformanceCheckModalTableLine performanceCheckListLine={ele} even={index % 2} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceCheckModal;
