/*
 * @Description: 日历班次/天维护弹窗
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 15:57:46
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import {
  Form,
  Button,
  DatePicker,
  Select,
  Table,
  DataSet,
  notification,
  CheckBox,
  TextField,
} from 'choerodon-ui/pro';
import { Modal } from 'hzero-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import InitialModal from './InitialModal';
import MaintenanceModalDS from '../stores/MaintenanceModalDS';
import CalendarDayListDS from '../stores/CalendarDayListDS';
import CalendarShiftListDS from '../stores/CalendarShiftListDS';

const intlPrefix = 'lmds.calendar';
const commonPrefix = 'lmds.common';
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })
export default class MaintainModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initializeModalVisible: false,
      selectedShiftIds: [],
    };
  }

  componentDidMount() {
    this.handleQuery();
  }

  calendarDayListDS = new DataSet({
    ...CalendarDayListDS(this.props.calendar),
  });

  calendarShiftListDS = new DataSet({
    ...CalendarShiftListDS(this.props.calendar),
  });

  maintenanceModalDS = new DataSet({
    ...MaintenanceModalDS(this.props),
  });

  handleInitializeShift = () => {
    const { selected } = this.calendarShiftListDS;
    if (!selected.length) {
      notification.warning({
        message: '警告',
        description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据'),
      });
      return;
    }
    const firstCalendarData = selected[0].data.calendarDay;
    const hasDifferentDateError = selected.some(
      (i) => i.data.calendarDay.diff(firstCalendarData) !== 0
    );
    if (hasDifferentDateError) {
      notification.warning({
        message: '警告',
        description: intl.get(`${intlPrefix}.msg.choose.oneday`).d('请选择同一天班次数据'),
      });
      return;
    }
    this.setState({
      selectedShiftIds: selected.map((i) => i.data.calendarShiftId),
      initializeModalVisible: true,
    });
  };

  handleAdd = () => {
    const { startDate } = this.maintenanceModalDS.current?.data || {};
    const {
      calendar: { calendarLineType: type },
    } = this.props;
    const initRec = {};
    if (startDate) {
      initRec.calendarDay = startDate;
    }
    if (type === 'SHIFT') {
      this.calendarShiftListDS.create(initRec, 0);
    } else if (type === 'DAY') {
      this.calendarDayListDS.create(initRec, 0);
    }
  };

  handleQuery = () => {
    const { startDate, endDate } = this.maintenanceModalDS.current?.data || {};
    const {
      calendar: { calendarId, calendarLineType: type },
    } = this.props;
    if (!startDate || !endDate) {
      let warningMessage = '请填写';
      if (!startDate) {
        warningMessage += '开始日期';
      }
      if (!endDate) {
        warningMessage += `${startDate ? '和' : ''}结束日期`;
      }
      notification.warning({ message: '警告', description: warningMessage });
      return;
    }
    const queryParameter = {
      calendarId,
      startDate: startDate.format(DEFAULT_DATE_FORMAT),
      endDate: endDate.format(DEFAULT_DATE_FORMAT),
    };
    if (type === 'SHIFT') {
      this.calendarShiftListDS.queryParameter = queryParameter;
      this.calendarShiftListDS.query();
    } else if (type === 'DAY') {
      this.calendarDayListDS.queryParameter = queryParameter;
      this.calendarDayListDS.query();
    }
  };

  handleCloseInitializeModal = () => {
    this.setState({
      initializeModalVisible: false,
    });
  };

  get dayColumns() {
    return [
      {
        name: 'calendarDay',
        width: 150,
        editor: (record) => (record.status === 'add' ? <DatePicker /> : null),
      },
      {
        name: 'startTime',
        width: 150,
        editor: true,
      },
      {
        name: 'endTime',
        width: 150,
        editor: true,
      },
      {
        name: 'remark',
        width: 150,
        editor: true,
      },
      {
        name: 'overtimeFlag',
        width: 150,
        editor: true,
      },
      {
        name: 'holidayFlag',
        width: 150,
        editor: true,
      },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : null),
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: () => ['edit'],
        lock: 'right',
        align: 'center',
      },
    ];
  }

  get shiftColumns() {
    return [
      {
        name: 'calendarDay',
        width: 150,
        editor: (record) => (record.status === 'add' ? <DatePicker /> : null),
      },
      {
        name: 'weekNumber',
        width: 150,
        editor: false,
      },
      {
        name: 'shiftCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
      },
      {
        name: 'shiftPhase',
        width: 150,
        editor: true,
      },
      {
        name: 'shiftStartTime',
        width: 150,
        editor: true,
      },
      {
        name: 'shiftEndTime',
        width: 150,
        editor: true,
      },
      {
        name: 'breakTime',
        width: 150,
        editor: true,
      },
      {
        name: 'activity',
        width: 150,
        editor: true,
      },
      {
        name: 'replenishCapacity',
        width: 150,
        editor: true,
      },
      {
        name: 'availableTime',
        width: 150,
        editor: true,
      },
      // {
      //   name: 'availableCapacity',
      //   width: 150,
      //   editor: true,
      // },
      {
        name: 'remark',
        width: 150,
        editor: true,
      },
      {
        name: 'overtimeFlag',
        width: 150,
        editor: true,
      },
      {
        name: 'holidayFlag',
        width: 150,
        editor: true,
      },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : null),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: () => ['edit'],
        lock: 'right',
        align: 'center',
      },
    ];
  }

  renderButtons() {
    const {
      calendar: { calendarLineType: type },
    } = this.props;
    return (
      <div>
        <Button onClick={this.handleQuery}>
          {intl.get(`${commonButtonIntlPrefix}.search`).d('查询')}
        </Button>
        <Button onClick={this.handleAdd}>
          {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
        </Button>
        {type === 'SHIFT' ? (
          <Button onClick={this.handleInitializeShift}>
            {intl.get(`${intlPrefix}.button.initialize`).d('初始化')}
          </Button>
        ) : null}
      </div>
    );
  }

  renderQueryParameters() {
    return (
      <Form columns={3} dataSet={this.maintenanceModalDS} labelAlign="center" labelWidth={80}>
        <TextField name="calendarCode" disabled />
        <DatePicker name="startDate" />
        <DatePicker name="endDate" />
        <TextField name="calendarType" disabled />
        <TextField name="calendarLineType" disabled />
      </Form>
    );
  }

  renderTable() {
    const {
      calendar: { calendarLineType: type },
    } = this.props;
    return (
      <React.Fragment>
        {type === 'DAY' ? (
          <Table
            // loading={onLoading}
            editMode="inline"
            dataSet={this.calendarDayListDS}
            columns={this.dayColumns}
          />
        ) : null}
        {type === 'SHIFT' ? (
          <Table
            // loading={onLoading}
            editMode="inline"
            dataSet={this.calendarShiftListDS}
            columns={this.shiftColumns}
          />
        ) : null}
      </React.Fragment>
    );
  }

  renderInitializeModal() {
    const { calendar } = this.props;
    const { initializeModalVisible, selectedShiftIds } = this.state;
    return (
      <Modal
        title={intl.get(`${intlPrefix}.view.title.initializeCalendarShift`).d('初始化日历班次')}
        visible={initializeModalVisible}
        footer={null}
        onCancel={this.handleCloseInitializeModal}
      >
        <InitialModal
          sourceShiftIds={selectedShiftIds}
          calendarInfo={calendar}
          handleCloseInitializeModal={() => {
            this.setState({ initializeModalVisible: false });
            this.handleQuery();
          }}
        />
      </Modal>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderButtons()}
        {this.renderQueryParameters()}
        {this.renderTable()}
        {this.renderInitializeModal()}
      </React.Fragment>
    );
  }
}
