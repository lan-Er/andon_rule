/**
 * @Description: 节日日历详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-19 14:17:26
 */

import moment from 'moment';
import React, { useState, useEffect, Fragment } from 'react';
import { Spin } from 'choerodon-ui';
import { DataSet, Form, TextField, Button, Select, Modal, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import {
  queryCalendar,
  queryYearData,
  addOrUpdateFestival,
  deleteFestival,
} from '@/services/holidayCalendarService';
import Calendar from '@/components/Calendar';
import { detailQueryDS, festivalDS } from '../store/indexDS';
import styles from './index.less';

const { Option } = Select;
const fesKey = Modal.key();
const fesViewKey = Modal.key();
const intlPrefix = 'zplan.holidayCalendar';
const monthSelectData = [
  { value: '1', meaning: '1' },
  { value: '2', meaning: '2' },
  { value: '3', meaning: '3' },
  { value: '4', meaning: '4' },
  { value: '5', meaning: '5' },
  { value: '6', meaning: '6' },
  { value: '7', meaning: '7' },
  { value: '8', meaning: '8' },
  { value: '9', meaning: '9' },
  { value: '10', meaning: '10' },
  { value: '11', meaning: '11' },
  { value: '12', meaning: '12' },
];
const DetailQueryDS = () => new DataSet(detailQueryDS());
const FestivalDS = () => new DataSet(festivalDS());

let festivalModal;
let festivalViewModal;

function ZplanHolidayCalendarDetail({ match }) {
  const QueryDS = useDataSet(DetailQueryDS);
  const FesDS = useDataSet(FestivalDS);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [preMonthData, setPreMonthData] = useState({});
  const [curMonthData, setCurMonthData] = useState({});
  const [nextMonthData, setNextMonthData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [movingDate, setMovingDate] = useState(null);
  const [yearSelectData, setYearSelectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [clickTotal, setClickTotal] = useState(0);
  const [isSelect, setIsSelect] = useState(false);

  const {
    params: { calendarId, calendarCode },
  } = match;

  useEffect(() => {
    initSelectData();
    getMonthData(year, month);
    QueryDS.current.set('calendarCode', calendarCode);
    window.addEventListener('keydown', escFunction);
    return () => {
      window.removeEventListener('keydown', escFunction);
    };
  }, []);

  function escFunction(e) {
    if (e && e.code === 'Escape') {
      handleClearSelect();
    }
  }

  function handleClearSelect() {
    setStartDate(null);
    setEndDate(null);
    setMovingDate(null);
    setIsDown(false);
    setClickTotal(0);
    setIsSelect(false);
  }

  async function initSelectData() {
    const res = await queryYearData({ size: 100 });
    const arr = [];
    if (res && res.content) {
      res.content.forEach((v) => {
        arr.unshift(v);
      });
    }
    setYearSelectData(arr);
  }

  async function getMonthData(curYear, curMonth) {
    setLoading(true);
    const arr = [];
    arr.push(
      queryCalendar({
        yearNum: curYear,
        monthNum: curMonth - 1,
        calendarId,
      })
    );
    arr.push(
      queryCalendar({
        yearNum: curYear,
        monthNum: curMonth,
        calendarId,
      })
    );
    arr.push(
      queryCalendar({
        yearNum: curYear,
        monthNum: Number(curMonth) + 1,
        calendarId,
      })
    );
    const res = await Promise.all(arr);
    if (res[0] && res[1] && res[2]) {
      setPreMonthData(res[0][0]);
      setCurMonthData(res[1][0]);
      setNextMonthData(res[2][0]);
    }
    setLoading(false);
  }

  function handleReset() {
    QueryDS.current.set('yearNum', null);
    QueryDS.current.set('monthNum', null);
    handleClearSelect();
  }

  function handleSearch() {
    handleClearSelect();
    const { yearNum, monthNum } = QueryDS.current.toData();
    const curYear = new Date().getFullYear();
    const curMonth = new Date().getMonth() + 1;
    const yStr = yearNum || curYear;
    const mStr = monthNum || curMonth;
    setYear(yStr);
    setMonth(mStr);
    getMonthData(yStr, mStr);
  }

  function handleLeftClick() {
    setMonth(month - 1);
    QueryDS.current.set('monthNum', month - 1);
    getMonthData(year, month - 1);
  }

  function handleRightClick() {
    setMonth(Number(month) + 1);
    QueryDS.current.set('monthNum', Number(month) + 1);
    getMonthData(year, Number(month) + 1);
  }

  function handleReturn() {
    handleClear();
    festivalViewModal.close();
  }

  function handleEdit(date) {
    festivalViewModal.close();
    handleAdd(date);
  }

  function getSingleSelectDateData(thedate) {
    return new Promise(async (resolve) => {
      const data = [];
      const sMonth = new Date(thedate).getMonth() + 1;
      const res = await queryCalendar({
        yearNum: year,
        monthNum: sMonth,
        calendarId,
      });
      if (res && res[0]) {
        res[0].monthList[0].weekList.forEach((wItem) => {
          wItem.dayList.forEach((vItem) => {
            const date = `${res[0].yearNum}-${res[0].monthList[0].monthNum}-${vItem.dayNum}`;
            if (isSameDay(date, thedate)) {
              data.push(vItem);
            }
          });
        });
      }
      resolve(data);
    });
  }

  async function handleSingleSelect(date) {
    const arr = await getSingleSelectDateData(date);
    if (arr[0] && arr[0].festivalId) {
      FesDS.current.set('festivalObj', {
        festivalId: arr[0].festivalId,
        festivalName: arr[0].festivalName,
      });
      festivalViewModal = Modal.open({
        key: fesViewKey,
        title: '节日查看界面',
        children: (
          <div>
            <div className={styles['festival-modal-btn']}>
              <Button onClick={handleReturn}>返回</Button>
              <Button onClick={() => handleEdit(date)} color="primary">
                编辑
              </Button>
            </div>
            <Form dataSet={FesDS} labelWidth={50}>
              <Lov name="festivalObj" key="festivalObj" noCache clearButton disabled />
            </Form>
          </div>
        ),
        footer: null,
        className: styles['zplan-holiday-calendar-festival-view-modal'],
      });
    } else {
      handleAdd(date);
    }
  }

  function handleDateChange(sDate, eDate, mdate) {
    setStartDate(sDate);
    setEndDate(eDate);
    setMovingDate(mdate);
    if (sDate && eDate && sDate === eDate) {
      handleSingleSelect(sDate);
    }
    if (sDate && eDate) {
      setIsSelect(true);
    } else {
      setIsSelect(false);
    }
  }

  function handleDownChange(flag) {
    setIsDown(flag);
  }

  function handleTotalChange(num) {
    setClickTotal(num);
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

  function getSelectDateData(thedate) {
    return new Promise(async (resolve) => {
      const arr = [];
      const data = [];
      const sMonth = new Date(startDate || thedate).getMonth() + 1;
      const eMonth = new Date(endDate || thedate).getMonth() + 1;
      for (let v = Number(sMonth); v <= Number(eMonth); v++) {
        arr.push(
          queryCalendar({
            yearNum: year,
            monthNum: v,
            calendarId,
          })
        );
      }
      const res = await Promise.all(arr);
      if (res[0]) {
        for (let v = 0; v < res.length; v++) {
          res[v][0].monthList[0].weekList.forEach((wItem) => {
            wItem.dayList.forEach((vItem) => {
              const date = `${res[0][0].yearNum}-${res[0][0].monthList[0].monthNum}-${vItem.dayNum}`;
              if (
                isSameDay(date, startDate) ||
                (isDayAfter(date, startDate) && isDayBefore(date, endDate)) ||
                isSameDay(date, endDate) ||
                isSameDay(date, thedate)
              ) {
                data.push({
                  calendarId,
                  calendarCode,
                  dayId: vItem.dayId,
                  dayNum: vItem.dayNum,
                  dayOfWeek: vItem.dayOfWeek,
                  dayFestivalId: vItem.dayFestivalId,
                  festivalId: FesDS.current.get('festivalId'),
                  weekendFlag: vItem.dayOfWeek === '0' || vItem.dayOfWeek === '6' ? 1 : 0,
                  objectVersionNumber: vItem.dayFestivalObjectVersionNumber,
                });
              }
            });
          });
        }
      }
      resolve(data);
    });
  }

  function handleSure(date) {
    return new Promise(async (resolve) => {
      const arr = await getSelectDateData(date);
      const postArr = [];
      const deleteArr = [];
      arr.forEach((v) => {
        if (v.festivalId && !v.dayFestivalId) {
          postArr.push({
            ...v,
            _status: 'create',
          });
        }
        if (v.festivalId && v.dayFestivalId) {
          postArr.push({
            ...v,
            _status: 'update',
          });
        }
        if (!v.festivalId && v.dayFestivalId) {
          deleteArr.push(v);
        }
      });
      let res;
      if (postArr.length) {
        res = await addOrUpdateFestival(postArr);
      }
      if (deleteArr.length) {
        res = await deleteFestival(deleteArr);
      }
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        festivalModal.close();
        handleClear();
        handleSearch();
        resolve();
      } else {
        notification.error({
          message: res.message,
        });
        festivalModal.close();
        handleClear();
        resolve(false);
      }
    });
  }

  function handleCancel() {
    handleClear();
    festivalModal.close();
  }

  function handleClear() {
    FesDS.current.set('festivalObj', null);
  }

  async function handleAdd(date) {
    festivalModal = Modal.open({
      key: fesKey,
      title: '节日编辑界面',
      children: (
        <div>
          <Form dataSet={FesDS} labelWidth={50}>
            <Lov name="festivalObj" key="festivalObj" noCache clearButton />
          </Form>
          <div className={styles['festival-modal-btn']}>
            <Button onClick={handleClear}>清空</Button>
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={() => handleSure(date)} color="primary">
              确定
            </Button>
          </div>
        </div>
      ),
      footer: null,
      className: styles['zplan-holiday-calendar-festival-modal'],
    });
  }

  function handleClickWhite(e) {
    if (
      e.target.className &&
      e.target.className.indexOf('index_calendar-days-item') === -1 &&
      e.target.className.indexOf('index_calendar-days-row') === -1 &&
      e.target.className.indexOf('c7n-pro-btn') === -1 &&
      e.target.className.indexOf('index_content-calendar-area') === -1 &&
      e.target.className.indexOf('add-festival-btn') === -1
    ) {
      handleClearSelect();
    }
  }

  return (
    <Fragment>
      <div onClick={handleClickWhite}>
        <Header
          title={intl.get(`${intlPrefix}.view.title.holidayCalendarDetail`).d('节日日历详情')}
          backPath="/zplan/holiday-calendar"
        >
          {/* {isSelect && <Button onClick={handleAdd}>添加节日</Button>} */}
        </Header>
        <Spin spinning={loading}>
          <Content>
            <div className={styles['content-search-area']}>
              <Form dataSet={QueryDS} columns={3}>
                <TextField name="calendarCode" disabled />
                <Select name="yearNum">
                  {yearSelectData.map((v) => (
                    <Option value={v.yearNum}>{v.yearNum}</Option>
                  ))}
                </Select>
                <Select name="monthNum">
                  {monthSelectData.map((v) => (
                    <Option value={v.value}>{v.meaning}</Option>
                  ))}
                </Select>
              </Form>
              <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
                <Button onClick={handleReset}>重置</Button>
                <Button color="primary" onClick={handleSearch}>
                  查询
                </Button>
              </div>
            </div>
            <div className={styles['content-calendar-area']}>
              {month >= 2 && (
                <Calendar
                  year={year}
                  month={month - 1}
                  monthData={preMonthData}
                  beginDate={startDate}
                  overDate={endDate}
                  moveDate={movingDate}
                  isMouseDown={isDown}
                  clickTotal={clickTotal}
                  onDownChange={handleDownChange}
                  onDateChange={handleDateChange}
                  onClickTotalChange={handleTotalChange}
                  showLeftArrow={month >= 3}
                  leftArrowClick={handleLeftClick}
                  addFestivalClick={isSelect && handleAdd}
                />
              )}
              <Calendar
                year={year}
                month={month}
                monthData={curMonthData}
                beginDate={startDate}
                overDate={endDate}
                moveDate={movingDate}
                isMouseDown={isDown}
                clickTotal={clickTotal}
                onDownChange={handleDownChange}
                onDateChange={handleDateChange}
                onClickTotalChange={handleTotalChange}
                addFestivalClick={isSelect && handleAdd}
              />
              {month <= 11 && (
                <Calendar
                  year={year}
                  month={Number(month) + 1}
                  monthData={nextMonthData}
                  beginDate={startDate}
                  overDate={endDate}
                  moveDate={movingDate}
                  isMouseDown={isDown}
                  clickTotal={clickTotal}
                  onDownChange={handleDownChange}
                  onDateChange={handleDateChange}
                  onClickTotalChange={handleTotalChange}
                  showRightArrow={month <= 10}
                  rightArrowClick={handleRightClick}
                  addFestivalClick={isSelect && handleAdd}
                />
              )}
            </div>
          </Content>
        </Spin>
      </div>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZplanHolidayCalendarDetail);
