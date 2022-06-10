/*
 * @Description:我的任务
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-01-12
 * @LastEditors:
 * @LastEditTime:
 */

import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { Lov, DataSet, Radio, Table, Form, DatePicker, Button, Progress } from 'choerodon-ui/pro';
import { Tag } from 'choerodon-ui';
import moment from 'moment';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import codeConfig from '@/common/codeConfig';
import { QueryDS, TaskDS, TimeDS } from '@/stores/myTaskDS';

import styles from './index.less';

const debug = true;
const log = debug ? console.log.bind(console, '**debugging**') : function () {};
const { common } = codeConfig.code;
const taskStatusList = [
  'NEW',
  'RELEASED',
  'RUNNING',
  'PENDING',
  'PAUSE',
  'DISPATCHED',
  'QUEUING',
  'COMPLETED',
];
// const now = new Date(); // 当前日期
// const nowDayOfWeek = now.getDay(); // 今天本周的第几天
// const nowDay = now.getDate(); // 当前日
// const nowMonth = now.getMonth(); // 当前月
// const nowYear = now.getYear(); // 当前年

export default function IqcStatisticalReport() {
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);
  const doingTaskDS = useMemo(() => new DataSet(TaskDS()), []);
  const beforeTaskDS = useMemo(() => new DataSet(TaskDS()), []);
  const oldTaskDS = useMemo(() => new DataSet(TaskDS()), []);
  const timeRangeDS = useMemo(() => new DataSet(TimeDS()), []);

  const [checkedValue, setCheckedValue] = useState('DAY');
  const [taskQueryType, setTaskQueryType] = useState('TASK');
  // const [workId, setWorkId] = useState('');
  // const [prodLineId, setProdLineId] = useState('');
  // const [workcellId, setWorkcellId] = useState('');
  // const [equipmentId, setEquipmentIdId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [doingNum, setDoingNum] = useState(0);
  const [beforeNum, setBeforeNum] = useState(0);
  const [oldNum, setOldNum] = useState(0);
  const [taskPage, setTaskPage] = useState(false);
  const [isTask, setIsTask] = useState('TASK');

  // 设置lov的默认值
  useEffect(() => {
    // rule是获取用户的信息
    async function defaultLovSetting() {
      const ruleRes = await userSetting({
        defaultFlag: 'Y',
      });
      log('ruleRes', ruleRes);
      if (ruleRes && ruleRes.content && ruleRes.content[0]) {
        queryDS.current.set('orgId', ruleRes.content[0].organizationId);
      }

      // 查询操作工对应的值集的信息
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      log('workerRes', workerRes);
      if (getResponse(workerRes)) {
        if (workerRes && workerRes.content && workerRes.content[0]) {
          queryDS.current.set('workerObj', {
            workerId: workerRes.content[0].workerId,
            workerCode: workerRes.content[0].workerCode,
            workerName: workerRes.content[0].workerName,
          });
        }
      }

      // 获取默认产线
      const prodLineRes = await queryLovData({
        lovCode: common.prodLine,
        organizationId:
          ruleRes && ruleRes.content && ruleRes.content[0] && ruleRes.content[0].organizationId,
        defaultFlag: 'Y',
      });
      log('prodLineRes', prodLineRes);
      if (
        getResponse(prodLineRes) &&
        prodLineRes &&
        prodLineRes.content &&
        prodLineRes.content[0]
      ) {
        queryDS.current.set('prodLineObj', {
          prodLineId: prodLineRes.content[0].prodLineId,
          prodLineCode: prodLineRes.content[0].prodLineCode,
          resourceName: prodLineRes.content[0].resourceName,
        });
      }

      // 获取默认工位
      const workcellRes = await queryLovData({
        lovCode: common.workcell,
        defaultFlag: 'Y',
      });
      log('workcellRes', workcellRes);
      if (getResponse(workcellRes)) {
        if (workcellRes && workcellRes.content && workcellRes.content[0]) {
          queryDS.current.set('workcellObj', {
            workcellId: workcellRes.content[0].workcellId,
            workcellCode: workcellRes.content[0].workcellCode,
            workcellName: workcellRes.content[0].workcellName,
          });
        }
      }

      // 获取默认设备
      const equipmentRes = await queryLovData({
        lovCode: common.equipment,
        defaultFlag: 'Y',
      });
      log('equipmentRes', equipmentRes);
      if (
        getResponse(equipmentRes) &&
        equipmentRes &&
        equipmentRes.content &&
        equipmentRes.content[0]
      ) {
        queryDS.current.set('equipmentObj', {
          equipmentId: equipmentRes.content[0].equipmentId,
          equipmentCode: equipmentRes.content[0].equipmentCode,
          equipmentName: equipmentRes.content[0].equipmentName,
        });
      }

      // handleSearch();
    }
    defaultLovSetting();
  }, [queryDS]);
  // 页签
  // useEffect(() => {
  //   if(taskPage){
  //     handleSearch();
  //   }
  // }, [taskQueryType]);
  // 日，周，月
  useEffect(() => {
    if (taskPage) {
      handleSearch();
    }
  }, [checkedValue]);

  const columnsDoing = [
    {
      name: 'item',
      width: 250,
      lock: true,
      renderer: (record) => {
        return (
          `${record.record.pristineData.itemCode ? record.record.pristineData.itemCode : ' '}` +
          '-' +
          `${
            record.record.pristineData.itemDescription
              ? record.record.pristineData.itemDescription
              : ' '
          }` +
          '-' +
          `${record.record.pristineData.operation ? record.record.pristineData.operation : ''}`
        );
      },
    },
    {
      name: 'placeOfProduction',
      width: 250,
      renderer: (record) => {
        return (
          `${
            record.record.pristineData.prodLineName ? record.record.pristineData.prodLineName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.workcellName ? record.record.pristineData.workcellName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.equipmentName ? record.record.pristineData.equipmentName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.locationName ? record.record.pristineData.locationName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.outsideLocation
              ? record.record.pristineData.outsideLocation
              : ''
          }`
        );
      },
    },
    {
      name: 'productionSchedule',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        const executionNum =
          thisCode.processOkQty +
          thisCode.processNgQty +
          thisCode.scrappedQty +
          thisCode.reworkQty +
          thisCode.wipQty;
        const scheduleNum = executionNum === 0 ? thisCode.taskQty / executionNum : 0;
        return <Progress value={scheduleNum.toFixed(4, 10) * 100} status="active" />;
      },
    },
    {
      name: 'taskTypeName',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        return thisCode.taskTypeName ? <Tag color="green">{`${thisCode.taskTypeName}`}</Tag> : null;
      },
    },
    {
      name: 'number',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        return (
          <div>
            <span>{`${thisCode.taskNum}`}</span>
            <br />
            <span>{`${thisCode.documentNum}`}</span>
          </div>
        );
      },
    },
    {
      name: 'executionNum',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        return (
          <div>
            <span>{`${thisCode.executableQty ? thisCode.executableQty : ''}`}</span>
            <span>{`${thisCode.processOkQty ? thisCode.processOkQty : ''}`}</span>
            <span>{`${thisCode.processNgQty ? thisCode.processNgQty : ''}`}</span>
            <span>{`${thisCode.scrappedQty ? thisCode.scrappedQty : ''}`}</span>
            <span>{`${thisCode.reworkQty ? thisCode.reworkQty : ''}`}</span>
            <span>{`${thisCode.wipQty ? thisCode.wipQty : ''}`}</span>
          </div>
        );
      },
    },
    { name: 'actualStartTime', width: 200 },
    {
      name: 'planTime',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        return (
          <div>
            <span>{`${thisCode.planStartTime}`}</span>
            <br />
            <span>{`${thisCode.planEndTime}`}</span>
          </div>
        );
      },
    },
    { name: 'workcellName', width: 200 },
  ];
  const columnsBefore = [
    {
      name: 'item',
      width: 250,
      renderer: (record) => {
        return (
          `${record.record.pristineData.itemCode ? record.record.pristineData.itemCode : ' '}` +
          '-' +
          `${
            record.record.pristineData.itemDescription
              ? record.record.pristineData.itemDescription
              : ' '
          }` +
          '-' +
          `${record.record.pristineData.operation ? record.record.pristineData.operation : ''}`
        );
      },
    },
    {
      name: 'placeOfProduction',
      width: 250,
      renderer: (record) => {
        return (
          `${
            record.record.pristineData.prodLineName ? record.record.pristineData.prodLineName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.workcellName ? record.record.pristineData.workcellName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.equipmentName ? record.record.pristineData.equipmentName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.locationName ? record.record.pristineData.locationName : ''
          }` +
          '-' +
          `${
            record.record.pristineData.outsideLocation
              ? record.record.pristineData.outsideLocation
              : ''
          }`
        );
      },
    },
    {
      name: 'planTime',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        return (
          <div>
            <span>{`${thisCode.planStartTime}`}</span>
            <br />
            <span>{`${thisCode.planEndTime}`}</span>
          </div>
        );
      },
    },
    { name: 'taskQty', width: 200 },
    {
      name: 'number',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        return (
          <div>
            <span>{`${thisCode.taskNum}`}</span>
            <br />
            <span>{`${thisCode.documentNum}`}</span>
          </div>
        );
      },
    },
    { name: 'workcellName', width: 200 },
  ];
  const columnsOld = [
    { name: 'taskNum', width: 200, lock: true },
    { name: 'documentNum', width: 200, lock: true },
    {
      name: 'item',
      width: 200,
      lock: true,
      renderer: (record) => {
        return (
          `${record.record.pristineData.itemCode ? record.record.pristineData.itemCode : ' '}` +
          '-' +
          `${
            record.record.pristineData.itemDescription
              ? record.record.pristineData.itemDescription
              : ' '
          }` +
          '-' +
          `${record.record.pristineData.operation ? record.record.pristineData.operation : ''}`
        );
      },
    },
    { name: 'operation', width: 200, lock: true },
    { name: 'taskTypeName', width: 200 },
    { name: 'taskQty', width: 200 },
    { name: 'processOkQty', width: 200 },
    { name: 'processNgQty', width: 200 },
    { name: 'scrappedQty', width: 200 },
    { name: 'reworkQty', width: 200 },
    {
      name: 'percentOfPass',
      width: 200,
      renderer: (record) => {
        const thisCode = record.record.pristineData;
        const executionNum = thisCode.processOkQty;
        const scheduleNum = executionNum / thisCode.taskQty;
        return <Progress value={scheduleNum.toFixed(4, 10) * 100} status="active" />;
      },
    },
    { name: 'actualEndTime', width: 200 },
    { name: 'planTime', width: 200 },
    { name: 'processedTime', width: 200 },
    { name: 'standardWorkTime', width: 200 },
    { name: 'workcellName', width: 200 },
    { name: 'placeOfProduction', width: 200 },
  ];

  // 查询默认展示的数据
  function defaultQuerparams() {
    //   setWorkId(queryDS.current.get('workerId'));
    //   setProdLineId(queryDS.current.get('prodLineId'));
    //   setWorkcellId(queryDS.current.get('workcellId'));
    //   setEquipmentIdId(queryDS.current.get('equipmentId'));
    setStartDate(
      timeRangeDS.current.get('time').start
        ? moment(timeRangeDS.current.get('time').start).format('YYYY-MM-DD HH:mm:ss')
        : undefined
    );
    setEndDate(
      timeRangeDS.current.get('time').end
        ? moment(timeRangeDS.current.get('time').end).format('YYYY-MM-DD 23:59:59')
        : undefined
    );
  }
  useEffect(() => {
    defaultQuerparams();
  }, [startDate]);
  /**
   * @description: 日周月切换
   */
  const handleRadioChange = (eventDate) => {
    setTaskPage(true);
    log('eventDate', eventDate);
    if (eventDate === 'DAY') {
      setStartDate(moment().format('YYYY-MM-DD 00:00:00'));
      setEndDate(moment().format('YYYY-MM-DD 23:59:59'));
      setCheckedValue('DAY');
    }
    if (eventDate === 'WEEK') {
      setStartDate(getWeekStartDate());
      setEndDate(getWeekEndDate());
      setCheckedValue('WEEK');
    }
    if (eventDate === 'MONTH') {
      setStartDate(getMonthStartDate());
      setEndDate(getMonthEndDate());
      setCheckedValue('MONTH');
    }
  };

  // 获得本周的开端日期
  function getWeekStartDate() {
    return moment().week(moment().week()).startOf('week').format('YYYY-MM-DD HH:mm:ss');
  }

  // 获得本周的停止日期
  function getWeekEndDate() {
    return moment().week(moment().week()).endOf('week').format('YYYY-MM-DD HH:mm:ss');
  }

  // 获得本月的开端日期
  function getMonthStartDate() {
    return moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
  }

  // 获得本月的停止日期
  function getMonthEndDate() {
    return moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
  }

  // 获得某月的天数
  // function getMonthDays(myMonth) {
  //   const monthStartDate = new Date(nowYear, myMonth, 1);
  //   const monthEndDate = new Date(nowYear, myMonth + 1, 1);
  //   const someDays = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  //   return someDays;
  // }

  /**
   * @description: 查询按钮
   */
  const handleSearch = async () => {
    defaultQuerparams();
    const { workerId, prodLineId, workcellId, equipmentId } = queryDS.current.toData();
    // const {
    //   time,
    // } = timeRangeDS.current.toData();
    // const startTime = time.start
    // ? moment(time.start).format('YYYY-MM-DD HH:mm:ss')
    // : undefined;
    // const endTime = time.end
    // ? moment(time.end).format('YYYY-MM-DD 23:59:59')
    // : undefined;
    //  setEndDate(endTime);
    // setStartDate(startTime);

    if (!workerId && !prodLineId && !workcellId && !equipmentId) {
      notification.warning({
        message: '请至少输入一个查询条件',
      });
      return;
    }
    const params = {
      taskQueryType,
      taskStatusList,
      workerId,
      prodLineId,
      workcellId,
      equipmentId,
    };
    // 进行中
    doingTaskDS.queryParameter = {
      ...params,
      actualStartTimeNull: '1',
    };
    const resDoing = await doingTaskDS.query();
    setDoingNum(resDoing.totalElements);

    // 未开始
    beforeTaskDS.queryParameter = {
      ...params,
      actualStartTimeNull: '0',
    };
    const resBefore = await beforeTaskDS.query();
    setBeforeNum(resBefore.totalElements);

    // 已完成
    oldTaskDS.queryParameter = {
      ...params,
      taskStatusList: ['COMPLETED'],
      endDate,
      startDate,
    };
    const resOld = await oldTaskDS.query();
    setOldNum(resOld.totalElements);
  };

  // 页签按钮
  function handleClick(eventStatus) {
    setIsTask(eventStatus);
    setTaskQueryType(eventStatus);
  }

  function handleWorkcellChange(rec) {
    if (rec) {
      queryDS.current.set('prodLineObj', {
        prodLineId: rec.prodLineId,
        prodLineCode: rec.prodLineCode,
        resourceName: rec.prodLineName,
      });
    }
  }

  function handleEquipmentChange(rec) {
    if (rec) {
      queryDS.current.set('prodLineObj', {
        prodLineId: rec.prodLineId,
        prodLineCode: rec.prodLineCode,
        resourceName: rec.prodLineName,
      });
      queryDS.current.set('workcellObj', {
        workcellId: rec.workcellId,
        workcellCode: rec.workcellCode,
        workcellName: rec.workcellName,
      });
    }
  }

  return (
    <Fragment>
      <div className={styles.page}>
        <div className={styles.Tags}>
          <div style={{ marginLeft: 10, marginTop: 10 }}>
            <span
              style={{
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                border: '1px solid #ccc',
                padding: 5,
                fontSize: 16,
                cursor: 'pointer',
                borderRight: 'none',
              }}
              className={isTask === 'TASK' ? styles.Tag_button_type : null}
              onClick={() => handleClick('TASK')}
            >
              生产任务
            </span>
            <span
              style={{
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                border: '1px solid #ccc',
                padding: 5,
                fontSize: 16,
                cursor: 'pointer',
              }}
              className={isTask === 'NO_TASK' ? styles.Tag_button_type : null}
              onClick={() => handleClick('NO_TASK')}
            >
              非生产任务
            </span>
          </div>
        </div>
        <div className={styles.Query}>
          <Form
            className={styles['Query-field']}
            dataSet={queryDS}
            columns={5}
            labelLayout="placeholder"
          >
            <Lov name="workerObj" placeholder="请选择操作工" />
            <Lov name="prodLineObj" placeholder="请选择产线" />
            <Lov name="workcellObj" placeholder="请选择工位" onChange={handleWorkcellChange} />
            <Lov name="equipmentObj" placeholder="请选择设备" onChange={handleEquipmentChange} />
            <div>
              <Button
                onClick={() => {
                  queryDS.reset();
                }}
              >
                重置
              </Button>
              <Button color="primary" onClick={handleSearch}>
                查询
              </Button>
            </div>
          </Form>
        </div>
        <div className={styles.Doing}>
          <div className={styles['Doing-label']}>
            <span className={styles['Doing-label-text']}>进行中</span>
            <span className={styles['Doing-label-num']}>{`${doingNum}`}</span>
          </div>
          <Table className={styles['Doing-table']} dataSet={doingTaskDS} columns={columnsDoing} />
        </div>
        <div className={styles.Before}>
          <div className={styles['Before-label']}>
            <span className={styles['Before-label-text']}>未开始</span>
            <span className={styles['Before-label-num']}>{`${beforeNum}`}</span>
          </div>
          <Table
            className={styles['Before-table']}
            dataSet={beforeTaskDS}
            columns={columnsBefore}
          />
        </div>
        <div className={styles.Old}>
          <div className={styles['header-search']}>
            <div className={styles['Old-label']}>
              <span className={styles['Old-label-text']}>已完成</span>
              <span className={styles['Old-label-num']}>{`${oldNum}`}</span>
            </div>
            <div className={styles['header-search-second']}>
              <DatePicker
                dataSet={timeRangeDS}
                name="time"
                placeholder={['开始日期', '结束日期']}
                onChange={handleSearch}
              />
            </div>
            <div className={styles['header-search-first']}>
              <Radio
                defaultChecked
                mode="button"
                name="day"
                value="DAY"
                checked={checkedValue === 'DAY'}
                onChange={() => handleRadioChange('DAY')}
              >
                本日
              </Radio>
              <Radio
                mode="button"
                name="week"
                value="WEEK"
                checked={checkedValue === 'WEEK'}
                onChange={() => handleRadioChange('WEEK')}
              >
                本周
              </Radio>
              <Radio
                mode="button"
                name="month"
                value="MONTH"
                checked={checkedValue === 'MONTH'}
                onChange={() => handleRadioChange('MONTH')}
              >
                本月
              </Radio>
            </div>
          </div>
          <Table className={styles['Old-table']} dataSet={oldTaskDS} columns={columnsOld} />
        </div>
      </div>
    </Fragment>
  );
}
