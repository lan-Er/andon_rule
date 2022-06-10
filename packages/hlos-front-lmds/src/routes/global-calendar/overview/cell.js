import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './calendars.module.less';
import SmallCalendar from '../../../components/calendar/small-calendar';

export default class Cell extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.title !== this.props.title ||
      nextProps.subTitle !== this.props.subTitle ||
      nextProps.month !== this.props.month ||
      nextProps.calendar !== this.props.calendar
    );
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

  render() {
    const { onHeaderClick, onBodyClick, title, subTitle, calendar, updateFlag } = this.props;

    return (
      <React.Fragment>
        <div className={styles['calendar-header']} onClick={onHeaderClick}>
          {title && <div className={styles['calendar-title']}>{title}</div>}
          {subTitle && <div className={styles['calendar-subtitle']}>{subTitle}</div>}
        </div>
        <div className={styles['calendar-cell-wrapper']} onClick={onBodyClick}>
          <SmallCalendar
            month={this.props.month}
            showHeader={false}
            rowClass={styles['calendar-cell-row']}
            variable={false}
            updateFlag={updateFlag}
            renderCell={(
              year,
              month,
              date,
              isToday,
              isCurrentMonth
              // isWeekend
            ) => {
              // TODO: has shift
              const dateStr = `${year.toString()}-${this.zeroAhead(month, 2)}-${this.zeroAhead(
                date,
                2
              )}`;
              const dayList = calendar.calendarDays;
              let hasShift = isCurrentMonth;
              if (!dayList) {
                hasShift = false;
              } else if (dayList.indexOf(dateStr) <= -1) {
                hasShift = false;
              }
              return (
                <span
                  className={classnames({
                    [styles['calendar-cell-has-shift']]: hasShift,
                  })}
                  style={isToday ? { color: 'red' } : {}}
                >
                  {date}
                </span>
              );
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}
