/*
 * @Description: 日历-详情页面Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-18 16:49:24
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import classnames from 'classnames';
import { Icon } from 'choerodon-ui/pro';
import styles from './index.module.less';
import Month from '@/components/calendar/month';
import SmallCalendar from '@/components/calendar/small-calendar';

export default class Detail extends React.Component {
  month;

  constructor(props) {
    super(props);
    this.month = new Month(props.month);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.month !== this.props.month || nextProps.calendar !== this.props.calendar) {
      this.month = new Month(nextProps.month);
      return true;
    }
    return false;
  }

  zeroAhead(input, length) {
    let numstr = input.toString();
    const l = numstr.length;
    if (l >= length) {
      return numstr;
    }

    for (let i = 0; i < length - l; i++) {
      numstr = `0${numstr}`;
    }
    return numstr;
  }

  getWeekdays = () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  };

  renderDateCell(x, y, allDayShift) {
    const data = this.month.get(x, y);
    let classname = '';
    let title = `${data.date}`;

    if (data.whichMonth !== 'current') {
      classname = styles['cell-other'];
    }
    if (title === '1') {
      if (data.whichMonth === 'current') {
        title = `${data.currentMonth} - ${title}`;
      } else {
        title = `${data.nextMonth} - ${title}`;
      }
    }

    if (data.isToday) {
      classname += ` ${styles['cell-current']}`;
    }

    if (y === 0 || y === 6) {
      classname += ` ${styles['cell-weekend']}`;
    }
    const dateStr = `${data.year.toString()}-${this.zeroAhead(
      data.currentMonth,
      2
    )}-${this.zeroAhead(data.date, 2)}`;
    const newArray = allDayShift.filter((item) => item.DAY === dateStr)[0];
    return (
      <div key={y} className={classnames(styles.col, styles.cell, classname)}>
        <div className={styles['cell-title']}>{title}</div>
        {data.whichMonth === 'current' && newArray && (
          <div>
            {newArray.detailInfo.map((p) => {
              return (
                <div key={p.endTime} className={styles['cell-shift-wrapper']}>
                  <div
                    style={{
                      backgroundColor: p.shiftCode === 'DAY' ? '#93f1b9' : '#fca5fd',
                      textAlign: 'center',
                    }}
                  >
                    <span className={styles.time}>
                      {p.startTime} - {p.endTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  getLegends = () => {
    return [
      {
        title: 'Day',
        color: '#93f1b9',
      },
      {
        title: 'Night',
        color: '#fca5fd',
      },
    ];
  };

  // getProductLines = () => {
  //   return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
  //     item => `Product Line ${item}`
  //   );
  // };

  render() {
    const { calendar } = this.props;
    const allDayShift = calendar.detail;
    return (
      <React.Fragment>
        <div className={styles.sider}>
          <div className={styles['sider-top']}>
            <div className={styles['legend-wrapper']}>
              {this.getLegends().map((legend) => (
                <div key={legend.title} className={styles.legend}>
                  <span>{legend.title}</span>
                  <i
                    style={{
                      backgroundColor: legend.color,
                    }}
                  />
                </div>
              ))}
            </div>
            <ul className={styles['product-line']}>
              <li key="calendarCode">
                <Icon type="predefine" />
                <span>{calendar.calendarCode}</span>
              </li>
              {calendar.resourceName ? (
                <li key="resourceName">
                  <Icon type="predefine" />
                  <span>{calendar.resourceName}</span>
                </li>
              ) : null}
            </ul>
          </div>
          <div className={styles['sider-calendar']}>
            <SmallCalendar onMonthChange={this.props.onMonthChange} />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles['content-header']}>
            {this.getWeekdays().map((weekday) => (
              <div key={weekday} className={styles.col}>
                {weekday}
              </div>
            ))}
          </div>
          <div className={styles['content-calendar-wrapper']}>
            {[1, 2, 3, 4, 5, 6].map((i1, x) => (
              <div key={i1} className={styles['content-row']}>
                {[1, 2, 3, 4, 5, 6, 7].map((i2, y) => this.renderDateCell(x, y, allDayShift))}
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
