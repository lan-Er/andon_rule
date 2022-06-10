/*
 * @Description: 日历-日历天拷贝弹窗
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-28 15:32:48
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import { connect } from 'dva';
import { DatePicker, Button, Form, DataSet, Select, TextField } from 'choerodon-ui/pro';
import { Divider } from 'choerodon-ui';

import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import CopyCalendarModalDS from '../stores/CopyCalendarModalDS';
import CopyCalendarTargetModalDS from '../stores/CopyCalendarTargetModalDS';

const intlPrefix = 'lmds.calendar';
const commonPrefix = 'lmds.common';

@connect(({ calendar }) => ({
  calendar,
}))
@formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })
export default class CopyDayModal extends React.Component {

  copyCalendarModalDS = new DataSet({
    ...CopyCalendarModalDS({
      calendarId: this.props.calendarInfo.calendarId,
      month: this.props.curMonth,
    }),
  });

  copyCalendarTargetModalDS = new DataSet({
    ...CopyCalendarTargetModalDS({}),
  });

  constructor(props) {
    super(props);
    this.state = {
      onCopying: false,
    };
  }

  componentDidMount() {
    this.copyCalendarTargetModalDS.create({});
  }

  handleCopy = () => {
    const { dispatch, calendarInfo: { calendarId } } = this.props;
    const { startDate: sourceStartDate, endDate: sourceEndDate } = this.copyCalendarModalDS.current.data;
    const { startDate: targetStartDate, endDate: targetEndDate } = this.copyCalendarTargetModalDS.current.data;
    if (!sourceStartDate || !sourceEndDate || !targetStartDate || !targetEndDate) {
      notification.warning({ message: '警告', description: '请填写起止日期范围'});
      return;
    }
    this.setState({ onCopying: true });
    dispatch({
      type: 'calendar/copyCalendarDate',
      payload: {
        calendarId,
        startDate: sourceStartDate.format(DEFAULT_DATE_FORMAT),
        endDate: sourceEndDate.format(DEFAULT_DATE_FORMAT),
        targetStartDate: targetStartDate.format(DEFAULT_DATE_FORMAT),
        targetEndDate: targetEndDate.format(DEFAULT_DATE_FORMAT),
      },
    }).then(res => {
      if(res){
        notification.success({
          message: '复制成功',
        });
        this.props.handleCloseModal();
      }
    });
  };

  render() {
    const { onCopying } = this.state;
    return (
      <React.Fragment>
        <div>
          <Button
            onClick={this.handleCopy}
            loading={onCopying}
          >
            { intl.get('hzero.common.button.copy').d('复制') }
          </Button>
          <Divider orientation="left">{intl.get(`${intlPrefix}.title.source`).d('来源')}</Divider>

          <Form dataSet={this.copyCalendarModalDS} columns={2}>
            <Select name="calendarType" disabled />
            <TextField name="calendarCode" disabled />
            <DatePicker name="startDate" />
            <DatePicker name="endDate" />
          </Form>

          <Divider orientation="left">{intl.get(`${intlPrefix}.title.target`).d('目标')}</Divider>

          <Form dataSet={this.copyCalendarTargetModalDS} columns={2}>
            <DatePicker name="startDate" />
            <DatePicker name="endDate" />
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
