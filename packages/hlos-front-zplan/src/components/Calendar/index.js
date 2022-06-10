import React, { useRef, useState, useEffect } from 'react';
import { Icon, Popover } from 'choerodon-ui';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import styles from './index.less';

let lastClick;
const labelKeys = ['一', '二', '三', '四', '五', '六', '日'];

function Calendar({
  year,
  month,
  monthData,
  beginDate, // 选中开始日期
  overDate, // 选中结束日期
  moveDate, // 选择时移动到的最新日期
  onDateChange, // 三种类型的日期改变时触发
  isMouseDown, // 鼠标是否按下
  onDownChange, // 鼠标是否按下的值改变时触发
  clickTotal, // 第几次点击
  onClickTotalChange, // 第几次点击的值改变时触发
  showLeftArrow,
  showRightArrow,
  leftArrowClick,
  rightArrowClick,
  addFestivalClick,
  isActivity, // 是不是活动日历
}) {
  const containerNode = useRef(null);
  const [allDays, setAllDays] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [movingDate, setMovingDate] = useState(null);
  const [isClickDown, setIsClickDown] = useState(false); // 鼠标是否按下
  const [clickNum, setClickNum] = useState(0); // 鼠标点击的次数

  useEffect(() => {
    setAllDays(getAllDays());
  }, [monthData]);

  useEffect(() => {
    setStartDate(beginDate);
    setEndDate(overDate);
    setMovingDate(moveDate);
    setIsClickDown(isMouseDown);
    setClickNum(clickTotal);
  }, [beginDate, overDate, moveDate, isMouseDown, clickTotal]);

  // 判断是不是当天
  function isActive(yearNum, monthNum, dayNum) {
    const curStr = moment(new Date()).format(DEFAULT_DATE_FORMAT);
    const dStr = `${yearNum}-${monthNum > 10 ? monthNum : `0${monthNum}`}-${dayNum}`;
    return curStr === dStr;
  }

  function getAllDays() {
    const arr = [];
    let dayTotal = 0;
    if (monthData && monthData.yearNum) {
      // 获取年月周日打平后的数据
      monthData.monthList[0].weekList.forEach((wItem) => {
        wItem.dayList.forEach((dItem) => {
          const obj = {
            ...dItem,
            yearNum: monthData.yearNum,
            monthNum: monthData.monthList[0].monthNum,
            weekNum: wItem.weekNum,
            active: isActive(monthData.yearNum, monthData.monthList[0].monthNum, dItem.dayNum),
            isStart: false,
            connect: false,
            isEnd: false,
            isDisable: false,
            inMonth: true,
            date: `${monthData.yearNum}-${monthData.monthList[0].monthNum}-${dItem.dayNum}`,
            isWeek: dItem.dayOfWeek === '0' || dItem.dayOfWeek === '6',
            isFestival: !!dItem.festivalId,
          };
          dayTotal += 1;
          arr.push(obj);
        });
      });
      // 获取当前月第一天是星期几，然后给星期几之前的星期补数据
      const firstDayOfWeek = arr[0].dayOfWeek === '0' ? 7 : arr[0].dayOfWeek;
      for (let fv = 0; fv < firstDayOfWeek - 1; fv++) {
        const obj = {
          dayNum: '',
          inMonth: false,
          isDisable: true,
        };
        dayTotal += 1;
        arr.unshift(obj);
      }
      // 获取当前月最后一天是星期几，然后给星期几之后的星期补数据
      const lastDayOfWeek =
        arr[arr.length - 1].dayOfWeek === '0' ? 7 : arr[arr.length - 1].dayOfWeek;
      for (let lv = 0; lv < 7 - lastDayOfWeek; lv++) {
        const obj = {
          dayNum: '',
          inMonth: false,
          isDisable: true,
        };
        dayTotal += 1;
        arr.push(obj);
      }
      // 补全最后一行的数据
      for (let v = 0; v < 42 - dayTotal; v++) {
        const obj = {
          dayNum: '',
          inMonth: false,
          isDisable: true,
        };
        arr.push(obj);
      }
    }
    return arr;
  }

  // 判断是不是同一天
  function isSameDay(strDate, enDate) {
    return strDate === enDate;
  }

  // 判断是不是开始日期后
  function isDayAfter(strDate, enDate) {
    return moment(strDate).isAfter(enDate, 'day');
  }

  // 判断是不是结束日期前
  function isDayBefore(strDate, enDate) {
    return moment(strDate).isBefore(enDate, 'day');
  }

  function handleMouseDown(date) {
    setIsClickDown(true);
    if (typeof onDownChange === 'function') {
      onDownChange(true);
    }
    // 第一次点击
    if (clickNum + 1 === 1) {
      setClickNum(1);
      if (typeof onClickTotalChange === 'function') {
        onClickTotalChange(1);
      }
      setStartDate(date);
      setEndDate(null);
      setMovingDate(null);
      if (typeof onDateChange === 'function') {
        onDateChange(date, null, null);
      }
    }
    // 第二次点击
    if (clickNum + 1 === 2) {
      setClickNum(0);
      if (typeof onClickTotalChange === 'function') {
        onClickTotalChange(0);
      }
      // 同一天则取消选中
      if (isSameDay(startDate, date)) {
        setStartDate(null);
        setEndDate(null);
        setMovingDate(null);
        if (typeof onDateChange === 'function') {
          onDateChange(null, null, null);
        }
      }
      if (moment(date).isBefore(startDate)) {
        setEndDate(startDate);
        setStartDate(date);
        if (typeof onDateChange === 'function') {
          onDateChange(date, startDate, movingDate);
        }
      } else if (moment(date).isAfter(startDate)) {
        setEndDate(date);
        if (typeof onDateChange === 'function') {
          onDateChange(startDate, date, movingDate);
        }
      }
    }
  }

  function handleMouseMove(date) {
    if (isClickDown) {
      setMovingDate(date);
      if (typeof onDateChange === 'function') {
        onDateChange(startDate, endDate, date);
      }
    }
  }

  function handleMouseUp(date) {
    setIsClickDown(false);
    if (typeof onDownChange === 'function') {
      onDownChange(false);
    }
    if (clickNum === 1) {
      // 拖拽选择
      if (movingDate && isSameDay(date, movingDate) && !isSameDay(date, startDate)) {
        if (moment(date).isBefore(startDate)) {
          setEndDate(startDate);
          setStartDate(date);
          setClickNum(0);
          if (typeof onClickTotalChange === 'function') {
            onClickTotalChange(0);
          }
          if (typeof onDateChange === 'function') {
            onDateChange(date, startDate, movingDate);
          }
        } else {
          setEndDate(date);
          setClickNum(0);
          if (typeof onClickTotalChange === 'function') {
            onClickTotalChange(0);
          }
          if (typeof onDateChange === 'function') {
            onDateChange(startDate, date, movingDate);
          }
        }
      }
    }
  }

  function handleClick(date) {
    const clickTime = new Date().getTime();
    if (lastClick && clickTime - lastClick < 400) {
      setStartDate(date);
      setEndDate(date);
      setMovingDate(null);
      if (typeof onDateChange === 'function') {
        onDateChange(date, date, null);
      }
    } else {
      lastClick = clickTime;
    }
  }

  function getWeekName(num) {
    let str = '';
    switch (num) {
      case '0':
        str = '日';
        break;
      case '1':
        str = '一';
        break;
      case '2':
        str = '二';
        break;
      case '3':
        str = '三';
        break;
      case '4':
        str = '四';
        break;
      case '5':
        str = '五';
        break;
      case '6':
        str = '六';
        break;
      default:
        str = '';
    }
    return str;
  }

  function handleAddFestivel() {
    if (typeof addFestivalClick === 'function') {
      addFestivalClick();
    }
  }

  function renderRowDays(days) {
    return days.map((item) => {
      const allowDownEvent = !item.isDisable && item.inMonth;
      return item.dayNum ? (
        <>
          <Popover
            placement="top"
            overlayClassName={styles['holiday-calendar-popover']}
            content={
              <div style={{ textAlign: 'center' }}>
                <div>{`${item.yearNum}年${item.monthNum}月${item.dayNum}日`}</div>
                <div>{`星期${getWeekName(item.dayOfWeek)}`}</div>
                {item.festivalId && <div>{`节日：${item.festivalName}`}</div>}
                {isActivity && item.activityId && <div>{`促销活动：${item.activityName}`}</div>}
              </div>
            }
          >
            <div
              className={`${styles['calendar-days-item']}
              ${item.active ? styles['calendar-days-item-active--single'] : ''}
              ${item.isStart ? styles['calendar-days-item-active--start'] : ''}
              ${item.connect ? styles['calendar-days-item-active--connect'] : ''}
              ${item.isEnd ? styles['calendar-days-item-active--end'] : ''}
              ${item.isWeek ? styles['calendar-days-item-active--week'] : ''}
              ${
                item.isFestival || !!item.dayActivityId
                  ? styles['calendar-days-item-active--festival']
                  : ''
              }`}
              onMouseDown={() => allowDownEvent && handleMouseDown(item.date)}
              onMouseMove={() => allowDownEvent && handleMouseMove(item.date)}
              onMouseUp={() => allowDownEvent && handleMouseUp(item.date)}
              onClick={() => allowDownEvent && handleClick(item.date)}
            >
              {item.dayNum}
            </div>
          </Popover>
          {item.isEnd && startDate && endDate && startDate !== endDate && (
            <div className={styles['add-festival-btn']} onClick={handleAddFestivel}>
              {`+添加${isActivity ? '促销活动' : '节日'}`}
            </div>
          )}
        </>
      ) : (
        <div className={`${styles['calendar-days-item']}`}>{item.dayNum}</div>
      );
    });
  }

  function renderAllDays() {
    const rowArray = [];
    let arr = [];
    allDays.forEach((item, idx) => {
      if (item.dayNum) {
        if (startDate && endDate) {
          item.isStart = isSameDay(startDate, item.date);
          item.isEnd = isSameDay(endDate, item.date);
          item.connect = isDayAfter(item.date, startDate) && isDayBefore(item.date, endDate);
        } else if (startDate && !endDate) {
          item.isStart = isSameDay(startDate, item.date);
          item.isEnd = isSameDay(movingDate, item.date);
          item.connect =
            (isDayAfter(item.date, startDate) && isDayBefore(item.date, movingDate)) ||
            (isDayBefore(item.date, startDate) && isDayAfter(item.date, movingDate));
        } else if (endDate && !startDate) {
          item.isStart = isSameDay(movingDate, item.date);
          item.isEnd = isSameDay(endDate, item.date);
          item.connect =
            (isDayAfter(item.date, endDate) && isDayBefore(item.date, movingDate)) ||
            (isDayBefore(item.date, endDate) && isDayAfter(item.date, movingDate));
        } else {
          item.isStart = isSameDay(startDate, item.date);
          item.isEnd = isSameDay(endDate, item.date);
          item.connect = false;
        }
      }
      if (idx > 0 && idx % 7 === 0) {
        rowArray.push(arr);
        arr = [];
      }
      arr.push(item);
    });
    if (arr.length) {
      rowArray.push(arr);
    }
    return (
      <div className={styles['calendar-view']}>
        {rowArray.map((rowDays) => (
          <div className={styles['calendar-days-row']}>{renderRowDays(rowDays)}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={styles['calendar-container']}
      ref={(node) => {
        containerNode.current = node;
      }}
    >
      <div className={styles['calendar-title']}>
        {showLeftArrow && (
          <div onClick={leftArrowClick} className={styles['calendar-title-arrow']}>
            <Icon type="navigate_before" />
          </div>
        )}
        <div className={styles['calendar-title-text']}>{`${year}年${month}月`}</div>
        {showRightArrow && (
          <div onClick={rightArrowClick} className={styles['calendar-title-arrow']}>
            <Icon type="navigate_next" />
          </div>
        )}
      </div>
      <div className={styles['calendar-labels']}>
        {labelKeys.map((item) => (
          <div
            className={`${styles['calendar-labels-item']}
                ${['六', '日'].includes(item) ? styles['calendar-labels-item--week'] : ''}`}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div className={styles['calendar-body']}>{renderAllDays()}</div>
    </div>
  );
}

export default Calendar;
