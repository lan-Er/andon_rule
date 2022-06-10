/*
 * @Description: 日历管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-18 15:05:22
 * @LastEditors: 赵敏捷
 */
import React from 'react';
import {
  Button,
  Tabs,
} from 'choerodon-ui/pro';
import { Modal } from 'hzero-ui';
import moment from 'moment';
import { connect } from 'dva';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
// import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Header } from 'components/Page';
import styles from './index.module.less';
import Picker from '../../components/calendar/picker';
// import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import Overview from './overview';
import Detail from './detail';
import YearView from './year';
import CopyForm from './modal/copyCalendarModal';
import MaintainModal from './modal/MaintainModal';
import CopyDayModal from './modal/copyDayModal';

const intlPrefix = 'lmds.calendar';
const commonPrefix = 'lmds.common';
const commonButtonIntlPrefix = 'hzero.common.button';

@connect(({ calendar }) => ({
  calendar,
}))
@formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })
export default class Calendar extends React.Component {
  // modal 标题
  modalTitle = '';

  // modal 类型
  modalType = '';

  constructor(props) {
    super(props);
    this.state = {
      // 三种状态： 'overview' | 'detail' | 'year';
      step: 'overview',
      calendars: '',
      overviewDrawVisible: false,
      month: moment().startOf('month'),
      pickerType: 'month',
      currentCalendarInfo: '',
      modalVisible: false,
      modalOptions: {},
    };
  };

  async componentDidMount() {
    this.handleRefreshCalendars(this.state.month);
  }

  // 刷新
  handleRefreshCalendars = (month, type) => {
    if (type === 'closeOnly') {
      this.setState({
        overviewDrawVisible: false,
      });
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'calendar/queryCalendar',
      payload: {
        month: month.format('YYYY-MM'),
      },
    }).then(calendars => {
      if (calendars) {
        this.setState({
          calendars,
          month,
          overviewDrawVisible: false,
          currentCalendarInfo: null,
          modalVisible: false,
        });
      }
    });
  };

  handleOverviewAdd = () => {
    this.setState({ overviewDrawVisible: true, type: 'NEW' });
  };

  handleOverviewDelete = () => {
    this.modalTitle = intl.get(`${commonButtonIntlPrefix}.delete`).d('删除');
    this.modalType = 'delete';
    const { currentCalendarInfo } = this.state;
    if (currentCalendarInfo) {
      this.setState({
        modalVisible: true,
        modalOptions: {
          onOk: () => this.handleOverviewDeleteConfirm(),
          onCancel: () => {
            this.modalType = null;
            this.handleRefreshCalendars(this.state.month);
          },
        },
      });
    } else {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
    }
  };

  handleOverviewDeleteConfirm = () => {
    const { dispatch } = this.props;
    const { currentCalendarInfo } = this.state;
    if (currentCalendarInfo) {
      dispatch({
        type: 'calendar/deleteCalendar',
        payload: [currentCalendarInfo],
      }).then(() => {
        this.handleRefreshCalendars(this.state.month);
      });
    }
  };

  handleOverviewCopy = () => {
    const { currentCalendarInfo } = this.state;
    if (!currentCalendarInfo) {
      notification.warning({
        message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据'),
      });
      return;
    }
    this.modalTitle = intl.get('hzero.common.button.copy').d('复制');
    this.modalType = 'copy';
    this.setState({
      modalVisible: true,
      modalOptions: {
        width: 650,
        footer: null,
        onCancel: () => this.handleRefreshCalendars(this.state.month),
      },
    });
  };

  handleOverviewEdit = () => {
    if (this.state.currentCalendarInfo) {
      this.setState({ overviewDrawVisible: true, type: 'EDIT' });
    } else {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
    }
  };

  handleShowMaintainModal = (type) => { // 'Day' | 'Shift'
    if (!this.state.currentCalendarInfo) {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
      return;
    }
    const day = intl.get(`${intlPrefix}.view.title.dayMaintenance`).d('日历天维护');
    const shift = intl.get(`${intlPrefix}.view.title.shiftMaintenance`).d('日历班次维护');
    this.modalTitle = type === 'Day' ? day : shift;
    this.modalType = 'maintain';
    this.setState({
      modalVisible: true,
      modalOptions: {
        footer: null,
        width: 750,
      },
    });
  };

  handleShowCopyDayModal = () => {
    if (!this.state.currentCalendarInfo) {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
      return;
    }
    this.modalTitle = intl.get(`${intlPrefix}.title.copyDate`).d('日期复制');
    this.modalType = 'copyDay';
    this.setState({ modalVisible: true, modalOptions: { footer: null } });
  };

  handleLoadCalendarShift = (calendar, month) => {
    const { dispatch } = this.props;
    if (!calendar) {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
      return;
    }
    dispatch({
      type: 'calendar/queryCalendarDetail',
      payload: {
        month: month.format('YYYY-MM'),
        calendarId: calendar.calendarId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          currentCalendarShift: res,
          currentCalendarInfo: calendar,
          step: 'detail',
          month,
        });
      }
    });
  };

  handleRefreshCalendarsByYear = (month) => {
    const { dispatch } = this.props;
    const { currentCalendarInfo } = this.state;
    if (!currentCalendarInfo) {
      notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
      return;
    }
    dispatch({
      type: 'calendar/queryCalendarYearDetail',
      payload: {
        year: month.format('YYYY'),
        calendarId: currentCalendarInfo.calendarId,
      },
    }).then(calendar => {
      if (calendar) {
        this.setState({
          currentCalendarInfo: calendar,
          calendars: [calendar],
          month,
        });
      }
    });
  };

  renderOverviewButtons = () => {
    return (
      <React.Fragment>
        <Button icon="add" onClick={this.handleOverviewAdd}>
          { intl.get(`${intlPrefix}.button.calendar`).d('日历') }
        </Button>

        <Button icon="delete" onClick={this.handleOverviewDelete}>
          { intl.get(`${commonButtonIntlPrefix}.delete`).d('删除') }
        </Button>

        <Button icon="content_copy" onClick={this.handleOverviewCopy}>
          { intl.get(`${commonButtonIntlPrefix}.copy`).d('复制') }
        </Button>

        <Button icon="mode_edit" onClick={this.handleOverviewEdit}>
          { intl.get(`${commonButtonIntlPrefix}.edit`).d('编辑') }
        </Button>
      </React.Fragment>
    );
  };

  renderDetailButtons = () => {
    const { dispatch } = this.props;
    const { currentCalendarInfo, month } = this.state;
    return (
      <React.Fragment>
        <Button
          type="button"
          icon="today"
          onClick={() => {
            this.handleLoadCalendarShift(
              currentCalendarInfo,
              moment().startOf('month')
            );
          }}
        >
          { intl.get(`${intlPrefix}.button.today`).d('今天')}
        </Button>
        <Button
          icon="date_range"
          onDoubleClick={() => {
            dispatch({
              type: 'calendar/queryCalendar',
              payload: {
                month: month.format('YYYY-MM'),
              },
            }).then(calendars => {
              if (calendars) {
                this.setState({
                  calendars,
                  step: 'overview',
                  currentCalendarInfo: '',
                });
              }
            });
          }}
        >
          { intl.get(`${intlPrefix}.button.Calendar`).d('日历')}
        </Button>
        <Button
          icon="event_note"
          onClick={() => {
            if (!currentCalendarInfo) {
              notification.warning({ message: '警告', description: intl.get(`${intlPrefix}.msg.selectFirst`).d('请先选择一条数据') });
              return;
            }
            dispatch({
              type: 'calendar/queryCalendarYearDetail',
              payload: {
                year: month.format('YYYY'),
                calendarId: currentCalendarInfo.calendarId,
              },
            }).then(calendar => {
              if (calendar) {
                this.setState({
                  currentCalendarInfo: calendar,
                  calendars: [calendar],
                  month,
                  step: 'year',
                  pickerType: 'year',
                });
              }
            });
          }}
        >
          { intl.get(`${intlPrefix}.button.year`).d('年')}
        </Button>
        <Button icon="content_copy" onClick={this.handleShowCopyDayModal}>
          { intl.get('hzero.common.button.copy').d('复制') }
        </Button>

        {currentCalendarInfo &&
        currentCalendarInfo.calendarLineType === 'SHIFT' && (
          <Button
            icon="shift"
            onClick={() => {
              this.handleShowMaintainModal('Shift');
            }}
          >
            { intl.get(`${intlPrefix}.button.shift`).d('班次')}
          </Button>
        )}
        {currentCalendarInfo &&
        currentCalendarInfo.calendarLineType === 'DAY' && (
          <Button
            icon="shift"
            onClick={() => {
              this.handleShowMaintainModal('Day');
            }}
          >
            { intl.get(`${intlPrefix}.button.day`).d('天')}
          </Button>
        )}
      </React.Fragment>
    );
  };

  renderButtons() {
    const { step, currentCalendarInfo } = this.state;

    return (
      <div
        style={{
          display: 'inline-block',
          width: 'calc(100% - 200px)',
        }}
      >
        <Tabs className={styles['calendar-header-tabs']} activeKey={step}>
          <Tabs.TabPane key="overview" tab="">
            {this.renderOverviewButtons()}
          </Tabs.TabPane>
          <Tabs.TabPane key="detail" tab="">
            {this.renderDetailButtons()}
          </Tabs.TabPane>
          <Tabs.TabPane key="year" tab="">
            {currentCalendarInfo &&
            `${currentCalendarInfo.calendarCode} - ${
              currentCalendarInfo.calendarName
            }`}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }

  renderDatePicker = () => {
    const { pickerType, currentCalendarInfo} = this.state;
    return (
      <Picker
        type={pickerType}
        date={this.state.month}
        onMonthChange={m => {
          if (this.state.step === 'overview') {
            this.handleRefreshCalendars(m);
          } else if (this.state.step === 'detail') {
            this.handleLoadCalendarShift(currentCalendarInfo, m);
          } else if (this.state.step === 'year') {
            this.handleRefreshCalendarsByYear(m);
          } else {
            this.setState({ month: m });
          }
        }}
      />
    );
  };

  renderModalContent (type) {
    const { currentCalendarInfo, month } = this.state;
    switch (type) {
      case 'copy':
        return (
          <CopyForm
            calendarInfo={currentCalendarInfo}
            curMonth={month}
            onSave={() => {
              this.modalType = null;
              this.handleRefreshCalendars(month);
              this.setState({ modalVisible: false });
            }}
          />
        );
      case 'maintain':
        return (
          <MaintainModal
            month={month}
            // type={type}
            calendar={currentCalendarInfo}
          />
        );
      case 'copyDay':
        return (
          <CopyDayModal
            handleCloseModal={() => {
              this.setState({ modalVisible: false });
              this.handleLoadCalendarShift(currentCalendarInfo, month);
            }}
            calendarInfo={currentCalendarInfo}
          />
        );
      case 'delete':
        return <span>{intl.get(`${intlPrefix}.msg.deleteConfirm`).d('确认删除该日历？')}</span>;
      default:
        return null;
    }
  }

  renderModal = () => {
    const { modalVisible, modalOptions, currentCalendarInfo, month } = this.state;
    return (
      <Modal
        title={this.modalTitle}
        visible={modalVisible}
        onCancel={() => {
          this.modalType = null;
          this.setState({ modalVisible: false });
          this.handleLoadCalendarShift(currentCalendarInfo, month);
        }}
        destroyOnClose
        {...modalOptions}
      >
        {this.renderModalContent(this.modalType)}
      </Modal>
    );
  };

  render() {
    const {
      step,
      month,
      overviewDrawVisible,
      currentCalendarInfo,
    } = this.state;
    return (
      <React.Fragment>
        <Header>
          {this.renderButtons()}
          {this.renderDatePicker()}
        </Header>
        <Tabs activeKey={step} className={styles['calendar-content-tabs']}>
          <Tabs.TabPane key="overview" tab="">
            <Overview
              month={this.state.month}
              onNextStep={calendar => {
                this.handleLoadCalendarShift(
                  calendar,
                  this.state.month,
                );
              }}
              afterSave={(type) => this.handleRefreshCalendars(month, type)}
              type={this.state.type}
              calendars={this.state.calendars}
              currentCalendarInfo={currentCalendarInfo}
              onSelectCalendar={c => {
                this.setState({ currentCalendarInfo: c, overviewDrawVisible: false });
              }}
              drawVisible={overviewDrawVisible}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="detail" tab="">
            {this.state.currentCalendarShift && (
              <Detail
                onPreviousStep={() => {
                  this.setState({
                    step: 'overview',
                  });
                }}
                calendar={this.state.currentCalendarShift}
                month={this.state.month}
                onMonthChange={val =>
                  this.setState({ month: val })
                }
              />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane key="year" tab="">
            {currentCalendarInfo && (
              <YearView
                calendar={currentCalendarInfo}
                year={month.year()}
                onHeaderClick={date => {
                  const m = date.clone().startOf('month');
                  this.handleLoadCalendarShift(
                    currentCalendarInfo,
                    m,
                  );
                  this.setState({
                    pickerType: 'month',
                  });
                }}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
        {this.renderModal()}
      </React.Fragment>
    );
  }

}
