/*
 * @Description: 日历--日历修改Modal
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-18 16:49:24
 * @LastEditors: 赵敏捷
 */

import React, { Fragment } from 'react';
import { Form, DataSet, TimePicker, Select, TextField, CheckBox, Lov } from 'choerodon-ui/pro';
import statusConfig from '@/common/statusConfig';
import CreateAndModifyCalendarDS from '../stores/CreateAndModifyCalendarDS';

export default class ModifyCalendarForm extends React.Component {
  modifyCalendarFormDS = new DataSet({
    ...CreateAndModifyCalendarDS(this.props),
  });

  componentDidMount() {
    const { calendarId } = this.props;
    if (calendarId) {
      this.modifyCalendarFormDS.query();
    }
  }

  render() {
    const {
      common: { edit },
    } = statusConfig.statusValue.lmds;
    const { type, calendarId } = this.props;
    const isEdit = !!(type === edit && calendarId);
    return (
      <Fragment>
        <Form dataSet={this.modifyCalendarFormDS}>
          <TextField name="calendarCode" disabled={isEdit} />
          <TextField name="calendarName" />
          <TextField name="description" />
          <Select name="calendarType" disabled={isEdit} />
          <Select name="calendarLineType" disabled={isEdit} />
          <Lov name="organizationObj" />
          <Lov name="resourceObj" />
          <TextField name="resourceName" disabled />
          <TimePicker name="dayStartTime" />
          <CheckBox name="enabledFlag" />
        </Form>
      </Fragment>
    );
  }
}
