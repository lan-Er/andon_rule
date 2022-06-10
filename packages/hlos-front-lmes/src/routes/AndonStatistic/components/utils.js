import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

export function debounce(fun, timeout = 100) {
  let timeId;
  return (...args) => {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      fun(...args);
      timeId = null;
    }, timeout);
  };
}

function addDays(src, days) {
  const date = new Date(src.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

export function getDates(startDate, stopDate) {
  const dateArray = [];
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(moment(new Date(currentDate)).format(DEFAULT_DATE_FORMAT));
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}

// 获取对象数组中前三项对应 key 的最大 value
export function getMaxValueOfKeyInArrayOfObj(arr, key) {
  if (Array.isArray(arr)) {
    const tempArr = arr.slice(0, 3);
    return tempArr.reduce((acc, i) => {
      if (key in i) {
        const val = i[key] || 0;
        return acc > val ? acc : val;
      }
      return 0;
    }, 0);
  }
  return 0;
}

// 获取当天/周/月首尾日期
export function getStartAndEndDays() {
  const day = {
    start: moment().startOf('day'),
    end: moment().endOf('day'),
  };

  const week = {
    start: moment().startOf('isoWeek'),
    end: moment().endOf('isoWeek'),
  };

  const month = {
    start: moment().startOf('month'),
    end: moment().endOf('month'),
  };
  return {
    day,
    week,
    month,
  };
}
