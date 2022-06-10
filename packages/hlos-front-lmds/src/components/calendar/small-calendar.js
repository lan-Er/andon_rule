/* eslint-disable no-nested-ternary */
/*
 * @Description: 日历-小日历组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-22 15:09:07
 * @LastEditors: 赵敏捷
 */

import * as React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Icon } from 'choerodon-ui/pro';
import Month from './month';
import styles from './small-calendar.module.less';

export default class SmallCalendar extends React.Component {
  month;

  constructor(props) {
    super(props);
    this.state = {
      month: moment().startOf('month'),
    };
    if (!props.month) {
      this.month = new Month(this.state.month);
    } else {
      this.month = new Month(props.month);
    }
  }

  componentDidUpdate(prevProps) {
    const { month: prevMonth } = prevProps;
    const { month: curMonth } = this.props;
    if (prevMonth && curMonth && prevMonth.format('YYYY-MM') !== curMonth.format('YYYY-MM')) {
      this.month = new Month(this.props.month);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        month: this.props.month,
      });
    }
  }

  getWeekdays = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  renderDateCell = (x, y) => {
    const data = this.month.get(x, y);
    let classname = '';
    if (data.whichMonth !== 'current') {
      classname += ` ${styles.other}`;
    }
    if (y !== 0 && y !== 6) {
      classname += ` ${styles.workday}`;
    }
    const { renderCell } = this.props;
    return (
      <span key={y} className={classnames(styles.cell, classname)}>
        {renderCell ? (
          renderCell(
            data.year,
            data.currentMonth,
            data.date,
            data.isToday,
            data.whichMonth === 'current',
            y === 0 || y === 6
          )
        ) : data.isToday ? (
          <span className={styles.current}>{data.date}</span>
        ) : (
          data.date
        )}
      </span>
    );
  };

  render() {
    const {
      month = this.state.month,
      variable = true,
      showHeader = true,
      onMonthChange,
      rowClass,
    } = this.props;

    return (
      <React.Fragment>
        {showHeader && (
          <div className={styles.header}>
            {variable && (
              <Icon
                type="navigate_before"
                onClick={() => {
                  const { month: preMonth } = this.state;
                  const nextMonth = preMonth.clone().add('-1', 'month');
                  this.setState({ month: nextMonth });
                  this.month = new Month(nextMonth);
                }}
              />
            )}
            <span>{month.format('YYYY - MM')}</span>
            {variable && (
              <Icon
                type="navigate_next"
                onClick={() => {
                  const { month: preMonth } = this.state;
                  const nextMonth = preMonth.clone().add('1', 'month');
                  this.setState({ month: nextMonth });
                  this.month = new Month(nextMonth);
                }}
              />
            )}
          </div>
        )}

        <div className={rowClass}>
          {this.getWeekdays().map((day) => (
            <span key={day} className={classnames(styles.cell, styles.title)}>
              {day}
            </span>
          ))}
        </div>
        <div
          style={{
            width: '100%',
            border: 0,
          }}
          onClick={(e) => {
            if (e.target.tagName === 'SPAN' && onMonthChange) {
              onMonthChange(this.state.month);
            }
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i1, x) => (
            <div key={i1} className={rowClass}>
              {[1, 2, 3, 4, 5, 6, 7].map((i2, y) => this.renderDateCell(x, y))}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
