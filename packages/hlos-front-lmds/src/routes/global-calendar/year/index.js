/*
 * @Description: 日历年视图--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-18 16:49:24
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import { Col, Row } from 'choerodon-ui/pro';
import moment from 'moment';
import styles from '../overview/calendars.module.less';
import Cell from '../overview/cell';

export default class YearView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      span: 6,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.calendar !== this.props.calendar ||
      nextProps.year !== this.props.year ||
      nextState.span !== this.state.span
    );
  }

  renderCalendar(calendar, date) {
    return (
      <div className={styles['calendar-wrapper']}>
        <Cell
          calendar={calendar}
          month={date}
          onHeaderClick={() => this.props.onHeaderClick(date)}
          title={date.format('MMM YYYY')}
        />
      </div>
    );
  }

  renderCalendars() {
    const calendars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const { calendar } = this.props;
    return (
      <Row>
        {calendars.map((item) => (
          <Col span={this.state.span} key={item}>
            {this.renderCalendar(
              // `${index}`,
              calendar,
              moment(`${this.props.year}-${item}`, 'YYYY-MM')
            )}
          </Col>
        ))}
      </Row>
    );
  }

  render() {
    return (
      // LKResizer
      <div className={styles.calendars}>
        <div className={styles.calendar}>
          <div>{this.renderCalendars()}</div>
        </div>
      </div>
    );
  }
}
