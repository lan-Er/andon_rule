/*
 * @Description: 日历-初始化弹窗
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-28 15:32:48
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { Row, Col, DatePicker } from 'choerodon-ui/pro';
import { Input, Button, Checkbox } from 'choerodon-ui';
import classNames from 'classnames';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import notification from 'utils/notification';

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sai'];
const defaultCheckedList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const intlPrefix = 'lmds.calendar';
const commonPrefix = 'lmds.common';

@connect(({ calendar }) => ({
  calendar,
}))
@formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })
export default class InitialModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      onProcessing: false,
    };
  }

  handleCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  handleCheckWeekChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  mapWeek(weekDay) {
    const dayArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sai', 'Sun'];
    const index = dayArr.indexOf(weekDay);
    if (index !== -1) {
      return index + 1;
    } else {
      return -1;
    }
  }

  handleInitialize = () => {
    const { startDate, endDate, checkedList } = this.state;
    const { sourceShiftIds, dispatch, calendarInfo, handleCloseInitializeModal } = this.props;
    if (!startDate || !endDate) {
      notification.warning({ message: '警告', description: '请填写起止日期范围' });
      return;
    }
    const weekdays = checkedList.map((item) => this.mapWeek(item));
    this.setState({ onProcessing: true });
    dispatch({
      type: 'calendar/initializeShift',
      payload: {
        calendarId: calendarInfo.calendarId,
        weekdays,
        startDate: startDate.format(DEFAULT_DATE_FORMAT),
        endDate: endDate.format(DEFAULT_DATE_FORMAT),
        calendarShiftIds: sourceShiftIds,
      },
    }).then((res) => {
      if (res) {
        notification.success({ message: '成功', description: '初始化班组成功!' });
        handleCloseInitializeModal();
      }
      this.setState({ onProcessing: false });
    });
  };

  render() {
    const { onProcessing } = this.state;
    const {
      calendarInfo: { calendarCode, calendarTypeMeaning },
    } = this.props;
    return (
      <React.Fragment>
        <div className={classNames(styles['wrapper-body-top'])}>
          <Button type="primary" loading={onProcessing} onClick={this.handleInitialize}>
            {intl.get(`${intlPrefix}.button.initialize`).d('初始化')}
          </Button>
          <Row
            type="flex"
            align="middle"
            justify="center"
            style={{ margin: '10px 0', textAlign: 'center' }}
          >
            <Col span={4}>
              <span>{intl.get(`${intlPrefix}.model.calendarType`).d('日历类型')}</span>
            </Col>
            <Col span={8}>
              <Input readOnly forceFocus value={calendarTypeMeaning} />
            </Col>
            <Col span={4}>
              <span>{intl.get(`${intlPrefix}.model.calendarCode`).d('日历编码')}</span>
            </Col>
            <Col span={8}>
              <Input readOnly forceFocus value={calendarCode} />
            </Col>
          </Row>
          <Row
            type="flex"
            align="middle"
            justify="center"
            style={{ margin: '10px 0', textAlign: 'center' }}
          >
            <Col span={4}>
              <span>{intl.get(`${intlPrefix}.model.startTime`).d('开始时间')}</span>
            </Col>
            <Col span={8}>
              <DatePicker
                format={DEFAULT_DATE_FORMAT}
                onChange={(date) => {
                  this.setState({ startDate: date });
                }}
              />
            </Col>
            <Col span={4}>
              <span>{intl.get(`${intlPrefix}.model.endTime`).d('结束时间')}</span>
            </Col>
            <Col span={8}>
              <DatePicker
                format={DEFAULT_DATE_FORMAT}
                onChange={(date) => {
                  this.setState({ endDate: date });
                }}
              />
            </Col>
          </Row>
        </div>
        <div className={classNames(styles['wrapper-body-bottom'])}>
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.handleCheckAllChange}
              checked={this.state.checkAll}
            >
              {intl.get('lmds.common.checkAll').d('勾选所有')}
            </Checkbox>
          </div>
          <br />
          <CheckboxGroup
            options={plainOptions}
            value={this.state.checkedList}
            onChange={this.handleCheckWeekChange}
          />
        </div>
      </React.Fragment>
    );
  }
}
