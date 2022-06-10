/*
 * @Description: 确认实绩
 * @Author: wei.tang <wei.tang03@hand-china.com>
 * @LastEditTime: 2021-03-08 17:43:07
 */
// 本页面有bug，但是我没找到。所以重写了一份confirmPage
import React, { Fragment, useEffect, useState } from 'react';
import { Header, Content } from 'components/Page';
import {
  DataSet,
  SelectBox,
  Lov,
  DateTimePicker,
  Select,
  Button,
  Form,
  Table,
} from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import moment from 'moment';
import notification from 'utils/notification';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';
import {
  getLatestWorkPrice,
  saveExecuteLinePerformance,
} from '@/services/employeePerformanceService';
import intl from 'utils/intl';

import { queryLovData } from 'hlos-front/lib/services/api';
import useChangeWidth from '@/utils/useChangeWidth';
import {
  employeeConfirmQueryDS,
  employeeConfirmLineDS,
  // QueryDS,
} from '../../stores/employeePerformanceDS.js';
import Style from './index.less';

const EmployeePerformanceConfirm = () => {
  const confirmQueryDS = new DataSet(employeeConfirmQueryDS());
  const confirmLineDS = new DataSet(employeeConfirmLineDS());
  // const queryDS = new DataSet(QueryDS());
  const showQueryNumber = useChangeWidth();
  const [selectTimeType, setSelectTimeType] = useState(null);
  confirmQueryDS.create({}, 0);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        confirmQueryDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
      }
    }
    handleTime('day');
    queryDefaultSetting();
  }, []);

  const columns = () => {
    return [
      {
        name: 'organization',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'worker',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'workerGroup',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'calendarDay',
        width: 150,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'shift',
        width: 80,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'itemCode',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'operation',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'executeQty',
        width: 100,
        tooltip: 'overflow',
      },
      {
        name: 'uom',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'confirmedQty',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'confirmedTime',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'confirmedWage',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'taskStandardWorkTime',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'processedTime',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'unitPrice',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'executeNgQty',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'scrappedQty',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'reworkQty',
        width: 82,
        tooltip: 'overflow',
      },
      {
        name: 'prodLine',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'equipment',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'moNum',
        width: 128,
        tooltip: 'overflow',
      },
    ];
  };

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <DateTimePicker
        name="executeTimeMin"
        key="executeTimeMin"
        onChange={() => handleUpdateTime()}
      />,
      <DateTimePicker
        name="executeTimeMax"
        key="executeTimeMax"
        onChange={() => handleUpdateTime()}
      />,
      <div className={Style['chart-header']}>
        <div
          className={`${Style['time-day']} ${
            selectTimeType === 'day' ? Style['time-selected'] : Style.unselected
          }`}
          onClick={() => handleTime('day')}
        >
          今日
        </div>
        <div
          className={`${Style['time-week']} ${
            selectTimeType === 'week' ? Style['time-selected'] : Style.unselected
          }`}
          onClick={() => handleTime('week')}
        >
          本周
        </div>
        <div
          className={`${Style['time-month']} ${
            selectTimeType === 'month' ? Style['time-selected'] : Style.unselected
          }`}
          onClick={() => handleTime('month')}
        >
          本月
        </div>
      </div>,
      <Lov name="workerGroupObj" noCache key="workerGroupObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
    ];
  }

  /**
   * 重置
   */
  function handleReset() {
    confirmQueryDS.current.reset();
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await confirmQueryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const data = confirmQueryDS.toData();
    if (data[0].collectOptions && data[0].collectOptions.includes('PROD_LINE')) {
      confirmQueryDS.current.set('prodLineIdGroupFLag', 1);
    } else {
      confirmQueryDS.current.set('prodLineIdGroupFLag', '');
    }
    if (data[0].collectOptions && data[0].collectOptions.includes('EQUIPMENT')) {
      confirmQueryDS.current.set('equipmentIdGroupFLag', 1);
    } else {
      confirmQueryDS.current.set('equipmentIdGroupFLag', '');
    }
    if (data[0].collectOptions && data[0].collectOptions.includes('MO')) {
      confirmQueryDS.current.set('moIdGroupFLag', 1);
    } else {
      confirmQueryDS.current.set('moIdGroupFLag', '');
    }
    confirmLineDS.queryParameter = confirmQueryDS.current.toJSONData();
    await confirmLineDS.query();
  }

  /**
   * 时间修改
   */
  function handleUpdateTime() {
    // setSelectTimeType(null);
  }

  /**
   *时间处理
   */
  function handleTime(value) {
    let startTime;
    let endTime;
    if (value === 'day') {
      startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
      endTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      );
      confirmQueryDS.current.set('executeTimeMin', moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
      confirmQueryDS.current.set('executeTimeMax', moment(endTime).format('YYYY-MM-DD HH:mm:ss'));
      setSelectTimeType('day');
    } else if (value === 'week') {
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD 00:00:00');
      endTime = moment(getPrevDate(startTime, -6)).format('YYYY-MM-DD 23:59:59');
      confirmQueryDS.current.set('executeTimeMin', startTime);
      confirmQueryDS.current.set('executeTimeMax', endTime);
      setSelectTimeType('week');
    } else if (value === 'month') {
      startTime = moment(new Date()).format('YYYY-MM-01 00:00:00');
      endTime = new Date(
        new Date(moment(getPrevMonth(startTime)).format('YYYY-MM-DD 00:00:00')).getTime() - 1
      );
      confirmQueryDS.current.set('executeTimeMin', startTime);
      confirmQueryDS.current.set('executeTimeMax', endTime);
      // 2021-03-31 23:59:59
      setSelectTimeType('month');
    }
    // setTimeClass(value);
    console.log('confirmQueryDS.current', confirmQueryDS.current.toJSONData());
    console.log('confirmQueryDS.current', confirmQueryDS.current.toData());
    // const a = JSON.parse(JSON.stringify(confirmQueryDS.current.toData()));
    confirmQueryDS.reset();
    // confirmQueryDS.create(a);
  }

  /**
   *计算工资
   */
  async function handleCalculateSalary() {
    const { selected } = confirmLineDS;
    // 判断所选状态
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const savePerformanceType = confirmQueryDS.current.get('savePerformanceType');
    selected.forEach(async (record) => {
      const res = await getLatestWorkPrice({
        organizationId: record.data.organizationId,
        itemId: record.data.itemId,
        operationId: record.data.operationId,
      });
      record.set('unitPrice', res);
      if (savePerformanceType === 'QTY') {
        // const fghj = record.get('confirmedQty')
        // debugger
        record.set('confirmedWage', record.get('unitPrice') * record.get('confirmedQty'));
      } else if (savePerformanceType === 'WORK_TIME') {
        record.set('confirmedWage', record.get('unitPrice') * record.get('confirmedTime'));
      }
    });
  }

  /**
   *实绩确认
   */
  async function handleConfirmEmployee() {
    const data = confirmLineDS.toData();
    const savePerformanceType = confirmQueryDS.current.get('savePerformanceType');
    const xArr = [];
    data.forEach((item) => {
      const {
        organizationId,
        organizationCode,
        workerId,
        worker,
        workerGroupId,
        workerGroup,
        calendarDay,
        calendarShiftCodeMeaning,
        prodLineId,
        prodLineCode,
        taskId,
        taskNum,
        itemId,
        itemCode,
        operationId,
        operation,
        taskStandardWorkTime,
        processedTime,
        // confirmedQty: item.confirmedQty === 'QTY'?item.confirmedQty:'',
        // confirmedTime,
        unitPrice,
        confirmedWage,
        confirmFlag,
        remark,
        validateLevel,
        processOkQty,
        processNgQty,
        scrappedQty,
        reworkQty,
        firstPassQty,
        firstPassRate,
      } = item;
      xArr.push({
        organizationId,
        organizationCode,
        workerId,
        worker,
        workerGroupId,
        workerGroup,
        calendarDay: moment(new Date(calendarDay)).format('YYYY-MM-DD HH:mm:ss'),
        calendarShiftCodeMeaning,
        prodLineId,
        prodLineCode,
        taskId,
        taskNum,
        itemId,
        itemCode,
        operationId,
        operation,
        taskStandardWorkTime,
        processedTime,
        confirmedQty: savePerformanceType === 'QTY' ? item.confirmedQty : '',
        confirmedTime: savePerformanceType === 'WORK_TIME' ? item.confirmedQty : '',
        unitPrice,
        confirmedWage,
        confirmFlag,
        remark,
        validateLevel,
        processOkQty,
        processNgQty,
        scrappedQty,
        reworkQty,
        firstPassQty,
        firstPassRate,
      });
    });
    console.log(xArr);
    const res = await saveExecuteLinePerformance(xArr);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '实绩确认成功',
      });
    }
  }

  return (
    <Fragment>
      <Header title="员工实绩" backPath="/lmes/employee-performance/list">
        <Button color="primary" onClick={() => handleCalculateSalary()}>
          计算工资
        </Button>
        <Button color="primary" onClick={() => handleConfirmEmployee()}>
          实绩确认
        </Button>
      </Header>
      <Content>
        <div className={Style['search-display']}>
          <div className={Style['search-title-content']}>
            <span className={Style['search-tip']}>汇总选项：</span>
            <span className={Style['search-title']}>
              <SelectBox dataSet={confirmQueryDS} name="collectOptions" key="collectOptions" />
            </span>
          </div>
          <div className={Style['search-title-content']}>
            <span className={Style['search-tip']}>确认类型：</span>
            <span className={Style['search-title']}>
              <Select
                dataSet={confirmQueryDS}
                name="savePerformanceType"
                placeholder="请选择"
                maxTagCount={2}
                maxTagTextLength={3}
                maxTagPlaceholder={(restValues) => `+${restValues.length}...`}
              />
            </span>
          </div>
        </div>
        <div className={Style.content}>
          <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
            <Form dataSet={confirmQueryDS} columns={showQueryNumber} style={{ flex: 'auto' }}>
              {queryFields()}
            </Form>
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginLeft: 8,
                marginTop: 10,
              }}
            >
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Table dataSet={confirmLineDS} columns={columns()} queryFieldsLimit={4} />
        </div>
      </Content>
    </Fragment>
  );
};

export default EmployeePerformanceConfirm;
