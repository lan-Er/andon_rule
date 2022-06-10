/*
 * @Description: 日历-日历拷贝弹窗
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 14:29:18
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Button, DatePicker, Table, DataSet, TextField, Select } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import CopyModalListDS from '../stores/CopyModalListDS';
import CopyCalendarModalDS from '../stores/CopyCalendarModalDS';

const intlPrefix = 'lmds.calendar';
const commonPrefix = 'lmds.common';

@connect(({ calendar }) => ({
  calendar,
}))
@formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })
export default class CopyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onCopying: false,
    };
  }

  copyModalListDS = new DataSet({
    ...CopyModalListDS(this.props.calendarInfo),
  });

  copyCalendarModalDS = new DataSet({
    ...CopyCalendarModalDS({
      calendarId: this.props.calendarInfo.calendarId,
      month: this.props.curMonth,
    }),
  });

  copy = () => {
    const { calendarInfo, dispatch } = this.props;
    const { selected } = this.copyModalListDS;
    const { current: { data } } = this.copyCalendarModalDS;
    if (!data.startDate || !data.endDate) {
      notification.warning({ message: '警告', description: '请填写起止日期范围'});
      return;
    }
    if (!selected.length) {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
      return;
    }
    if (calendarInfo) {
      const aimCalendarIdList = selected.map(i => i.data.calendarId);
      this.setState({ onCopying: true });
      dispatch({
        type: 'calendar/copyCalendar',
        payload: {
          ...calendarInfo,
          aimCalendarIdList,
          startDate: moment(data.startDate).format(DEFAULT_DATE_FORMAT),
          endDate: moment(data.endDate).format(DEFAULT_DATE_FORMAT),
        },
      }).then(res => {
        if (res && this.props.onSave) {
          setTimeout(() => {
            this.setState({ onCopying: false });
            notification.success({ message: '成功', description: '复制成功!'});
            this.props.onSave();
          }, 300);
        }
      });
    }
  };

  get columns () {
    return [
      { name: 'calendarCode', editor: false },
      { name: 'calendarName', editor: false },
      { name: 'calendarType', editor: false },
    ];
  }

  render() {
    const { onCopying } = this.state;
    return (
      <React.Fragment>
        <Button
          loading={onCopying}
          onClick={this.copy}
        >
          { intl.get('hzero.common.button.copy').d('复制') }
        </Button>
        <Form dataSet={this.copyCalendarModalDS} columns={2}>
          <Select name="calendarType" disabled />
          <TextField name="calendarCode" disabled />
          <DatePicker name="startDate" />
          <DatePicker name="endDate" />
        </Form>
        <Table
          columns={this.columns}
          dataSet={this.copyModalListDS}
        />
      </React.Fragment>
    );
  }
}
