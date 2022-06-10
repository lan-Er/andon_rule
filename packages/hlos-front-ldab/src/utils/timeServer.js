/*
 * @Descripttion: 获取两日期之间日期列表函数
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-26 12:55:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-13 18:15:59
 */
// 获取两日期之间日期列表函数
export function getdiffdate(stime, etime) {
  const diffdate = [];
  // eslint-disable-next-line no-unused-vars
  let i = 0;
  // 开始日期小于等于结束日期,并循环
  while (stime <= etime) {
    diffdate.push(stime);
    // 获取开始日期时间戳
    // eslint-disable-next-line camelcase
    const stime_ts = new Date(stime).getTime();
    // eslint-disable-next-line camelcase
    const nextDate = stime_ts + 24 * 60 * 60 * 1000;
    const nextDatesY = `${new Date(nextDate).getFullYear()}-`;
    const nextDatesM =
      new Date(nextDate).getMonth() + 1 < 10
        ? `0${new Date(nextDate).getMonth() + 1}-`
        : `${new Date(nextDate).getMonth() + 1}-`;
    const nextDatesD =
      new Date(nextDate).getDate() < 10
        ? `0${new Date(nextDate).getDate()}`
        : new Date(nextDate).getDate();
    // eslint-disable-next-line no-param-reassign
    stime = nextDatesY + nextDatesM + nextDatesD;
    i++;
  }
  return diffdate;
}

// 获取本周第一天
export function getFirstDayOfWeek() {
  const now = new Date();
  const day = now.getDay() || 7;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 - day);
}

// 获取日期的前多少天的日期
export function getPrevDate(date, num) {
  const date2 = new Date(date);
  date2.setDate(date2.getDate() - num);
  // num是正数表示之后的时间，num负数表示之前的时间，0表示今天
  const time2 = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
  return time2;
}

// 获取上个月第一天
export function getPrevMonth(date) {
  const nowdays = new Date(date);
  let year = nowdays.getFullYear();
  let month = nowdays.getMonth() + 2;
  if (month === 12) {
    month = 1;
    year += 1;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  const firstDay = `${year}-${month}-01`;
  return firstDay;
}

/**
 * 格式化千位符
 */
export function formatMoney(num) {
  const val = num;
  const source = String(parseInt(val, 10).toFixed(2)).split('.');
  const reg = /(\d)(?=(?:\d{3})+$)/g;
  source[0] = `${source[0]}`.replace(reg, '$1,');
  return source.join('.');
}
