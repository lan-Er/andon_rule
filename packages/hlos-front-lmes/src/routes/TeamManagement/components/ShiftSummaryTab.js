/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-21 12:19:32
 * @LastEditTime: 2020-10-22 15:04:21
 * @Description:班次小结
 */
import React, { Fragment, useState } from 'react';
import moment from 'moment';
import { Button, TextField, TextArea, DataSet } from 'choerodon-ui/pro';
import { Icon, Row, Col, Spin } from 'choerodon-ui';
import notification from 'utils/notification';
import { CommonInput } from './index';
import { shiftSummaryDS } from '@/stores/teamManagementDS';
import { saveWorkerGroupPerformance } from '@/services/teamManagementService';

import '../common.less';

const shiftSummaryDs = new DataSet(shiftSummaryDS());

const ShiftSummaryTab = (props) => {
  const { searchDs, defaultWorker } = props;
  const [addPerson, setAddPerson] = useState(false);
  const [addEquipment, setAddEquipment] = useState(false);
  const [addAbnormal, setAddAbnormal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 班次小结
  const handleSaveWorkerGroupPerformance = async () => {
    setLoading(true);
    const params = {
      // calendarShift:'',
      // calendarYear:'',
      // calendarMonth:'',
      // calendarWeek:'',
      ...shiftSummaryDs.current.data,
      organizationId: searchDs.current.get('organizationId'),
      organizationCode: searchDs.current.get('organizationCode'),
      performanceCode: '',
      submitWorkerId: defaultWorker.workerId,
      submitWorker: defaultWorker.workerCode,
      workerGroupId: searchDs.current.get('workerGroupId'),
      workerGroup: searchDs.current.get('workerGroupCode'),
      calendarDay: moment(searchDs.current.get('date')).format('YYYY-MM-DD 00:00:00'),
    };
    const res = await saveWorkerGroupPerformance(params);
    if (res.failed) {
      setLoading(false);
      return notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '保存成功',
      });
    }
    setLoading(false);
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="shift-summary-tab">
        <div className="shift-summary-tab-header">
          <div className="shift-summary-tab-header-left">
            <Button
              className={`button ${addPerson ? 'button-gray' : ''}`}
              onClick={() => setAddPerson(true)}
            >
              <Icon type="add" />
              人员说明
            </Button>
            <Button
              className={`button ${addEquipment ? 'button-gray' : ''}`}
              onClick={() => setAddEquipment(true)}
            >
              <Icon type="add" />
              设备说明
            </Button>
            <Button
              className={`button ${addAbnormal ? 'button-gray' : ''}`}
              onClick={() => setAddAbnormal(true)}
            >
              <Icon type="add" />
              异常说明
            </Button>
          </div>
          <div className="shift-summary-tab-header-right">
            <Button className="button save-button" onClick={handleSaveWorkerGroupPerformance}>
              保存
            </Button>
          </div>
        </div>
        <div className="shift-summary-tab-container">
          <Row gutter={16} className="have-bottom">
            <Col span={3} className="shift-summary-title">
              班次小结:
            </Col>
            <Col span={21}>
              <TextArea
                style={{
                  fontSize: '20px',
                }}
                dataSet={shiftSummaryDs}
                name="performanceSummary"
                cols="100%"
                rows={6}
                placeholder="请输入班次小结"
              />
            </Col>
          </Row>
          {addPerson && (
            <Fragment>
              <Row gutter={16}>
                <Col span={3} className="shift-summary-title">
                  人员:
                </Col>
                <Col span={2} className="sub-title-input">
                  计划
                </Col>
                <Col span={5}>
                  <CommonInput dataSet={shiftSummaryDs} name="planWorkerQty" />
                </Col>
                <Col span={2} className="sub-title-input">
                  实到
                </Col>
                <Col span={5}>
                  <CommonInput dataSet={shiftSummaryDs} name="actualWorkerQty" />
                </Col>
                <Col span={2} className="sub-title-input">
                  缺勤
                </Col>
                <Col span={5}>
                  <CommonInput dataSet={shiftSummaryDs} name="absentWorkerQty" />
                </Col>
              </Row>
              <Row gutter={16} className="have-bottom">
                <Col span={3} />
                <Col span={21}>
                  <TextField
                    dataSet={shiftSummaryDs}
                    name="workerSummary"
                    className="shift-summary-description"
                    placeholder="请输入描述"
                  />
                </Col>
              </Row>
            </Fragment>
          )}
          {addEquipment && (
            <Fragment>
              <Row gutter={16}>
                <Col span={3} className="shift-summary-title">
                  设备:
                </Col>
                <Col span={2} className="sub-title-input">
                  运行
                </Col>
                <Col span={5}>
                  <CommonInput dataSet={shiftSummaryDs} name="runningEquipmentQty" />
                </Col>
                <Col span={2} className="sub-title-input">
                  故障
                </Col>
                <Col span={5}>
                  <CommonInput dataSet={shiftSummaryDs} name="brokenEquipmentQty" />
                </Col>
                <Col span={2} className="sub-title-input">
                  维修
                </Col>
                <Col span={5}>
                  <CommonInput dataSet={shiftSummaryDs} name="repairingEquipmentQty" />
                </Col>
              </Row>
              <Row gutter={16} className="have-bottom">
                <Col span={3} />
                <Col span={21}>
                  <TextField
                    dataSet={shiftSummaryDs}
                    name="resourceSummary"
                    className="shift-summary-description"
                    placeholder="请输入描述"
                  />
                </Col>
              </Row>
            </Fragment>
          )}
          {addAbnormal && (
            <Fragment>
              <Row gutter={16}>
                <Col span={3} className="shift-summary-title">
                  异常:
                </Col>
                <Col span={21}>
                  <TextField
                    dataSet={shiftSummaryDs}
                    name="exceptionSummary"
                    className="shift-summary-description"
                    placeholder="请输入描述"
                  />
                </Col>
              </Row>
            </Fragment>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default ShiftSummaryTab;
