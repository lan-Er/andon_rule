/*
 * @Description: 日历-月份组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-22 15:09:07
 * @LastEditors: 赵敏捷
 */

import moment from 'moment';

export default class Month {

  previousMonth;

  nextMonth;

  currentMonth;

  endOfLastMonth;

  endOfThisMonth;

  startWeekdayOfThisMonth;

  current;

  previous;

  next;

  today = moment();

  constructor(month) {
    this.current = month.clone().startOf('month');
    this.previous = this.current.clone().add(-1, 'month');
    this.next = this.current.clone().add(1, 'month');

    this.previousMonth = this.previous.get('month');
    this.nextMonth = this.next.get('month');
    this.currentMonth = this.current.get('month');

    this.endOfThisMonth = this.current
      .clone()
      .endOf('month')
      .daysInMonth();

    this.endOfLastMonth = this.current
      .clone()
      .add(-1, 'day')
      .daysInMonth();

    this.startWeekdayOfThisMonth = month.weekday();
  }

  get(x, y) {
    const offset = x * 7 + y - this.startWeekdayOfThisMonth;
    let date;
    let whichMonth;
    if (offset < 0) {
      date = this.endOfLastMonth + offset + 1;
      whichMonth = 'previous';
    } else if (offset >= this.endOfThisMonth) {
      date = offset - this.endOfThisMonth + 1;
      whichMonth = 'next';
    } else {
      date = offset + 1;
      whichMonth = 'current';
    }

    return {
      whichMonth,
      year: this.current.get('year'),
      date,
      currentMonth: this.currentMonth + 1,
      previousMonth: this.previousMonth + 1,
      nextMonth: this.nextMonth + 1,
      isToday:
        this.today.date() === offset + 1 &&
        this.today.month() === this.currentMonth &&
        this.today.year() === this.current.year(),
    };
  }
}
