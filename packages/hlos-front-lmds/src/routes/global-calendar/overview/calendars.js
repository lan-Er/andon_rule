/*
 * @Description: 日历总览
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-18 16:49:24
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import { Row, Col } from 'choerodon-ui/pro';
import classnames from 'classnames';
import styles from './calendars.module.less';
import Cell from './cell';

export default class Calendars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      span: 6,
      currentCalendarInfo: '',
    };
  }

  selectCalendar = (calendar) => {
    let res = calendar;
    this.setState(
      preState => {
        if (preState.currentCalendarInfo
          && preState.currentCalendarInfo.calendarCode
          && preState.currentCalendarInfo.calendarCode === calendar.calendarCode
        ) {
          res = undefined;
        }
        return {
          currentCalendarInfo: res,
        };
      },
      () => {
        if (this.props.onCalendarSelect) {
          this.props.onCalendarSelect(res);
        }
      }
    );
  };

  renderCalendar(calendar) {
    return (
      <div
        className={
          classnames(
            styles['calendar-wrapper'], {
            [styles['calendar-selected']]: this.state.currentCalendarInfo === calendar,
        })}
      >
        <Cell
          month={this.props.month}
          onHeaderClick={() => {
            this.props.onHeaderClick(calendar);
          }}
          onBodyClick={() => this.selectCalendar(calendar)}
          calendar={calendar}
          updateFlag={this.props.updateFlag}
          title={
            <React.Fragment>
              <span>{calendar.calendarCode}</span>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 12,
                }}
              >
                {calendar.calendarName}
              </span>
            </React.Fragment>
          }
          subTitle={this.props.month.format('MMM YYYY')}
        />
      </div>
    );
  }

  renderCalendars() {
    const { calendars } = this.props;
    if (calendars && calendars.content) {
      return (
        <Row>
          {calendars.content.map(item => (
            <Col span={this.state.span} key={item.calendarCode}>
              {this.renderCalendar(item)}
            </Col>
          ))}
        </Row>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={styles.calendars}>
        <div className={styles.calendar}>
          <div>{this.renderCalendars()}</div>
        </div>
      </div>
    );
  }
}
