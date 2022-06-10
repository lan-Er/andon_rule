/**
 * @Description: 促销日历详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-23 10:52:04
 */

import moment from 'moment';
import React, { useState, useEffect, Fragment } from 'react';
import { Spin } from 'choerodon-ui';
import { DataSet, Form, TextField, Button, Select, Modal, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import {
  queryCalendar,
  queryYearData,
  addOrUpdateActivity,
  deleteActivity,
  querySalesEntity,
} from '@/services/promotionCalendarService';
import Calendar from '@/components/Calendar';
import { detailQueryDS, activityDS } from '../store/indexDS';
import styles from './index.less';

const { Option } = Select;
const actKey = Modal.key();
const actViewKey = Modal.key();
const intlPrefix = 'zplan.promotionCalendar';
const organizationId = getCurrentOrganizationId();
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
const ActivityDS = () => new DataSet(activityDS());

let activityModal;
let activityViewModal;

function ZplanPromotionCalendarDetail({ match }) {
  const QueryDS = useDataSet(DetailQueryDS);
  const ActDS = useDataSet(ActivityDS);

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
  const [salesEntityObj, setSalesEntityObj] = useState({});

  const {
    params: { salesEntityId },
  } = match;

  useEffect(() => {
    initData();
    initSelectData();
    window.addEventListener('keydown', escFunction);
    return () => {
      window.removeEventListener('keydown', escFunction);
    };
  }, []);

  async function initData() {
    const res = await querySalesEntity({
      salesEntityId,
    });
    if (res && !res.failed) {
      setSalesEntityObj(res.content[0]);
      getMonthData(year, month, res.content[0] || {});
      QueryDS.current.set('salesEntityCode', res.content[0].salesEntityCode);
    }
  }

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

  async function getMonthData(curYear, curMonth, salesObj) {
    setLoading(true);
    const arr = [];
    arr.push(
      queryCalendar({
        yearNum: curYear,
        monthNum: curMonth - 1,
        calendarId: salesEntityObj.calendarId || (salesObj && salesObj.calendarId),
        salesEntityId,
      })
    );
    arr.push(
      queryCalendar({
        yearNum: curYear,
        monthNum: curMonth,
        calendarId: salesEntityObj.calendarId || (salesObj && salesObj.calendarId),
        salesEntityId,
      })
    );
    arr.push(
      queryCalendar({
        yearNum: curYear,
        monthNum: Number(curMonth) + 1,
        calendarId: salesEntityObj.calendarId || (salesObj && salesObj.calendarId),
        salesEntityId,
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
    activityViewModal.close();
  }

  function handleEdit(date) {
    activityViewModal.close();
    handleAdd(date);
  }

  function getSingleSelectDateData(thedate) {
    return new Promise(async (resolve) => {
      const data = [];
      const sMonth = new Date(thedate).getMonth() + 1;
      const res = await queryCalendar({
        yearNum: year,
        monthNum: sMonth,
        calendarId: salesEntityObj.calendarId,
        salesEntityId,
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
    if (arr[0] && arr[0].activityId) {
      ActDS.current.set('activityObj', {
        activityId: arr[0].activityId,
        activityName: arr[0].activityName,
      });
      activityViewModal = Modal.open({
        key: actViewKey,
        title: '促销活动查看界面',
        children: (
          <div>
            <div className={styles['festival-modal-btn']}>
              <Button onClick={handleReturn}>返回</Button>
              <Button onClick={() => handleEdit(date)} color="primary">
                编辑
              </Button>
            </div>
            <Form dataSet={ActDS} labelWidth={60}>
              <Lov name="activityObj" key="activityObj" noCache clearButton disabled />
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
            calendarId: salesEntityObj.calendarId,
            salesEntityId,
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
                  salesEntityId,
                  salesEntityCode: salesEntityObj.salesEntityCode,
                  calendarId: salesEntityObj.calendarId,
                  calendarCode: salesEntityObj.calendarCode,
                  dayId: vItem.dayId,
                  dayNum: vItem.dayNum,
                  dayOfWeek: vItem.dayOfWeek,
                  dayActivityId: vItem.dayActivityId,
                  activityId: ActDS.current.get('activityId'),
                  weekendFlag: vItem.dayOfWeek === '0' || vItem.dayOfWeek === '6' ? 1 : 0,
                  objectVersionNumber: vItem.dayActivityObjectVersionNumber,
                  tenantId: organizationId,
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
        if (v.activityId && !v.dayActivityId) {
          postArr.push({
            ...v,
            _status: 'create',
          });
        }
        if (v.activityId && v.dayActivityId) {
          postArr.push({
            ...v,
            _status: 'update',
          });
        }
        if (!v.activityId && v.dayActivityId) {
          deleteArr.push(v);
        }
      });
      let res;
      if (postArr.length) {
        res = await addOrUpdateActivity(postArr);
      }
      if (deleteArr.length) {
        res = await deleteActivity(deleteArr);
      }
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        activityModal.close();
        handleClear();
        handleSearch();
        resolve();
      } else {
        notification.error({
          message: res.message,
        });
        activityModal.close();
        handleClear();
        resolve(false);
      }
    });
  }

  function handleCancel() {
    handleClear();
    activityModal.close();
  }

  function handleClear() {
    ActDS.current.set('activityObj', null);
  }

  async function handleAdd(date) {
    activityModal = Modal.open({
      key: actKey,
      title: '促销活动编辑界面',
      children: (
        <div>
          <Form dataSet={ActDS} labelWidth={60}>
            <Lov name="activityObj" key="activityObj" noCache clearButton />
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
          title={intl.get(`${intlPrefix}.view.title.promotionCalendarDetail`).d('促销日历详情')}
          backPath="/zplan/promotion-calendar"
        />
        <Spin spinning={loading}>
          <Content>
            <div className={styles['content-search-area']}>
              <Form dataSet={QueryDS} columns={3}>
                <TextField name="salesEntityCode" disabled />
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
                  isActivity
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
                isActivity
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
                  isActivity
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
})(ZplanPromotionCalendarDetail);
