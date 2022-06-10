/*
 * @Description:员工工时统计报表
 * @Author: hongming.zhang@hand-china.com
 * @Date: 2020-12-21 12:53:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-19 14:46:34
 */

import React, { Fragment, useMemo, useState } from 'react';
import { Header, Content } from 'components/Page';
import {
  DataSet,
  Lov,
  Form,
  Button,
  DatePicker,
  WeekPicker,
  MonthPicker,
  YearPicker,
  Select,
  Icon,
  SelectBox,
  Radio,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';
import moment from 'moment';
import notification from 'utils/notification';
import { tableScrollWidth } from 'utils/utils';
import { employeeHourStatisticDS } from '@/stores/employeeHourStatisticDS';
import {
  queryWorkTimesReport,
  queryWorkTimeReportMain,
} from '@/services/employeeHourStatisticService';

import LineTable from './LineTable';
import HeaderTable from './HeaderTable';
import ChartStatistics from './ChartStatistics';

import './index.less';

const { Option: SelectBoxOption } = SelectBox;
const { Option } = Select;

export default function EmployeeHourStatistic() {
  const [hidden, setHidden] = useState(false);
  const [headerDataSource, setHeaderDataSource] = useState([]);
  const [headerTableColumns, setHeaderTableColumns] = useState([]);
  const [lineTableColumns, setLineTableColumns] = useState([]);
  const [teamFilter, setTeamFilter] = useState('WORKER_GROUP');
  const [loading, setLoading] = useState(false);
  const [lineLoading, setLineLoading] = useState(false);
  const [titleDate, setTitleDate] = useState('MONTH');
  const [lineDataList, setLineDataList] = useState([]);
  const [lineHeader, setLineHeader] = useState({});
  const employeeHourStatistic = useMemo(() => new DataSet(employeeHourStatisticDS()), []);

  const RenderTimePicker = () => {
    if (titleDate === 'MONTH') {
      return <MonthPicker dataSet={employeeHourStatistic.queryDataSet} name="startDate" />;
    } else if (titleDate === 'DAYS') {
      return <DatePicker dataSet={employeeHourStatistic.queryDataSet} name="startDate" />;
    } else if (titleDate === 'WEEK') {
      return <WeekPicker dataSet={employeeHourStatistic.queryDataSet} name="startDate" />;
    } else {
      return <YearPicker dataSet={employeeHourStatistic.queryDataSet} name="startDate" />;
    }
  };

  /**
   * @description: 控制chart的显隐
   */
  const handleExpendOrHide = () => {
    setHidden(!hidden);
  };

  async function onSearchSelected() {
    const {
      startDate: dateList,
      groupType,
      statisticType,
      // startDate,
    } = employeeHourStatistic.queryDataSet.current.data;
    const start = moment(dateList).format('YYYY-MM-DD HH:mm:ss');
    const end = getEndDate(groupType, dateList);
    if (start === undefined) {
      notification.error({
        message: intl
          .get('employee.hourStatistic.view.startDate.valid.error')
          .d('开始时间不能为空'),
      });
      return;
    }
    if (end === undefined) {
      notification.error({
        message: intl.get('employee.hourStatistic.view.endDate.valid.error').d('结束时间不能为空'),
      });
      return;
    }
    const myGroupType = groupType.startsWith('DAYS') ? 'DAY' : groupType;
    setLoading(true);
    setLineDataList([]);
    getWorkTimesDate(start, end, groupType, statisticType);
    employeeHourStatistic.setQueryParameter('startDate', start);
    employeeHourStatistic.queryDataSet.current.set('startDate', start);
    employeeHourStatistic.queryDataSet.current.set('endDate', end);
    const res = await employeeHourStatistic.query();
    if (res && Array.isArray(res.content) && res.content.length > 0) {
      const list = {};
      const lines = res.content.map((o) => {
        const { organizationId, workerId, workerGroupId } = o;
        list[`${organizationId}|${workerId}|${workerGroupId}`] = o;
        return { organizationId, workerId, workerGroupId };
      });
      const startDate = start;
      const endDate = end;
      const workerTimeReportConditionDTO = {
        lines,
        groupType: myGroupType,
        statisticType,
        startDate,
        endDate,
      };
      const workTimesList = await queryWorkTimesReport(workerTimeReportConditionDTO);
      getWorkTimesList(workTimesList, list);
      setLoading(false);
    } else {
      setHeaderDataSource([]);
      setLoading(false);
    }
  }

  /**
   * @description: 计算结束日期
   * @param {*} groupType string
   * @param {*} dateList string
   * @return {*} string
   */
  function getEndDate(groupType, dateList) {
    if (groupType === 'DAYS') {
      return moment(dateList).format('YYYY-MM-DD 23:59:59');
    } else if (groupType === 'WEEK') {
      return moment(dateList).add(1, 'weeks').subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
    } else if (groupType === 'MONTH') {
      return moment(dateList).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
    } else {
      return moment(dateList).add(1, 'years').format('YYYY-MM-DD HH:mm:ss');
    }
  }
  /**
   *
   * @param {*} getWorkTimesList
   */
  function getWorkTimesList(workTimesList, workTimesObject) {
    const obj = workTimesObject || {};
    workTimesList.forEach((item) => {
      const {
        organizationId,
        workerId,
        workerGroupId,
        date,
        effectiveTimeTotal,
        workerTimeTotal,
        totalRate,
        rate,
      } = item;
      const myRate = rate ? `${parseFloat(rate * 100, 10).toFixed(2)}%` : 0;
      const rowId = `${organizationId}|${workerId}|${workerGroupId}`;
      const objHeader = obj[rowId];
      obj[rowId] = {
        rowId,
        [date]: myRate,
        effectiveTimeTotal,
        workerTimeTotal,
        totalRate,
        ...objHeader,
      };
    });
    const dataList = Object.keys(obj).map((key) => {
      return obj[key];
    });
    setHeaderDataSource(dataList);
  }

  /**
   *
   * @param {*} getWorkTimesDate
   */
  function getWorkTimesDate(startDate, endDate, groupType, statisticType) {
    const endtime = new Date(endDate);
    const nowtime = new Date(startDate);
    let time = nowtime.getFullYear();
    if (groupType === 'DAYS') {
      const leftsecond = parseInt((endtime.getTime() - nowtime.getTime()) / 1000, 10);
      time = parseInt(leftsecond / (3600 * 24), 10) + 1; // 计算出相差天数
    } else if (groupType === 'WEEK') {
      time = parseInt(Math.abs(nowtime - endtime) / 1000 / 60 / 60 / 24 / 7, 10) || 1;
    } else if (groupType === 'MONTH') {
      time = 1 + Number(moment(endDate).format('MM')) - Number(moment(startDate).format('MM'));
    } else {
      const startYear = Number(moment(startDate).format('YYYY'));
      const endYear = Number(moment(endDate).format('YYYY'));
      time = Math.ceil(endYear - startYear);
    }
    const columns = tableColumns;
    for (let index = 1; index <= time; index++) {
      const params = { groupType, index, startDate };
      const dynamicTitle = getColumnsTitle(params);
      columns.push({
        title: `${dynamicTitle}${intl
          .get(`ldab.employeeHourStatistic.model.${groupType}`)
          .d('日/周/月/年')}`,
        dataIndex: `${dynamicTitle}`,
        width: index === time ? null : 120,
        key: `${index}`,
        render: (text, record) =>
          text ? (
            <a
              onClick={() =>
                rowSelection({ record, dynamicTitle, startDate, endDate, groupType, statisticType })
              }
            >
              {text}
            </a>
          ) : (
            0
          ),
      });
    }
    setHeaderTableColumns(columns);
  }

  function getColumnsTitle({ groupType, index, startDate }) {
    let myTitle = '';
    if (groupType === 'WEEK') {
      myTitle = moment(startDate)
        .add(index - 1, 'weeks')
        .format('YYYY-w');
    } else if (groupType === 'DAYS') {
      myTitle = moment(startDate)
        .add(index - 1, 'days')
        .format('YYYY-MM-DD');
    } else if (groupType === 'MONTH') {
      myTitle = moment(startDate)
        .add(index - 1, 'months')
        .format('YYYY-MM');
    } else if (groupType === 'YEAR') {
      myTitle = moment(startDate)
        .add(index - 1, 'years')
        .format('YYYY');
    }
    return myTitle;
  }
  const tableColumns = useMemo(() => {
    if (teamFilter === 'WORKER_GROUP') {
      return [
        {
          title: '编号',
          dataIndex: 'workerGroupCode',
          width: 100,
          fixed: 'left',
          key: 'workerGroupCode',
        },
        {
          title: '班组',
          dataIndex: 'workerGroupName',
          width: 150,
          fixed: 'left',
          key: 'workerGroupName',
        },
        {
          title: '组织',
          dataIndex: 'organizationName',
          width: 150,
          fixed: 'left',
          key: 'organizationName',
        },
        {
          name: 'totalRate',
          title: '合计',
          key: 'totalRate',
          dataIndex: 'totalRate',
          width: 150,
          render: (value) => (value ? `${parseFloat(value * 100, 10).toFixed(2)}%` : 0),
        },
      ];
    } else {
      return [
        {
          title: '姓名',
          dataIndex: 'workerName',
          width: 100,
          fixed: 'left',
          key: 'workerName',
        },
        {
          title: '工号',
          dataIndex: 'workerCode',
          width: 150,
          fixed: 'left',
          key: 'workerCode',
        },
        {
          title: '组织',
          dataIndex: 'organizationName',
          width: 150,
          fixed: 'left',
          key: 'organizationName',
        },
        {
          name: 'totalRate',
          title: '合计',
          key: 'totalRate',
          dataIndex: 'totalRate',
          width: 150,
          render: (value) => (value ? `${parseFloat(value * 100, 10).toFixed(2)}%` : 0),
        },
      ];
    }
  }, [teamFilter, loading]);
  /**
   * handlePagination - 分页设置
   * @param {object} pagination - 分页对象
   */
  async function handlePagination(page) {
    console.info(page);
    // setMoListLoading(true);
    // if (page) {
    //   const { current, pageSize } = page;
    //   listDS.setQueryParameter('page', current - 1);
    //   listDS.setQueryParameter('size', pageSize);
    // } else {
    //   const { current, pageSize } = pagination;
    //   listDS.setQueryParameter('page', current - 1);
    //   listDS.setQueryParameter('size', pageSize);
    // }
    // const result = await listDS.query();
    // // setDataSource(result.content);
    // dispatch({
    //   type: 'moWorkSpace/updateDataSource',
    //   payload: {
    //     list: result.content,
    //     pagination: createPagination(result),
    //   },
    // });
    // // setPagination();
    // // 清空勾选
    // handleSelectRowKeys();
    // setMoListLoading(false);
  }

  /**
   * @description: 窗口大小改变 图表的响应
   */
  // useEffect(() => {
  //   if (chartRef) {
  //     const statisticalChart = echarts.init(chartRef);
  //     window.removeEventListener('resize', statisticalChart.resize);
  //     window.addEventListener('resize', statisticalChart.resize);
  //     statisticalChart.setOption(options);
  //     return () => window.removeEventListener('resize', statisticalChart.resize);
  //   }
  // }, [chartRef, hidden, options]);

  function handleChangeType(value) {
    setTeamFilter(value);
  }

  function handleChangeDate(value) {
    setTitleDate(value);
  }
  const RenderBar = () => {
    return (
      <Form dataSet={employeeHourStatistic.queryDataSet}>
        <div className="employee-statistic-query">
          <div>
            <SelectBox mode="button" name="groupType" onChange={handleChangeDate}>
              <SelectBoxOption value="DAYS">按日</SelectBoxOption>
              <SelectBoxOption value="WEEK">按周</SelectBoxOption>
              <SelectBoxOption value="MONTH">按月</SelectBoxOption>
              <SelectBoxOption value="YEAR">按年</SelectBoxOption>
            </SelectBox>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <RenderTimePicker />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 12 }}>
            <Select
              name="statisticType"
              // onChange={handleChangeStatisticType}
              style={{ width: 100, marginRight: 20 }}
              onChange={handleChangeType}
            >
              <Option value="WORKER_GROUP">班组</Option>
              <Option value="WORKER">员工</Option>
            </Select>
            <Radio name="utilizationRate" dataSet={employeeHourStatistic} value="useRatio">
              利用率
            </Radio>
            <Radio name="utilizationRate" dataSet={employeeHourStatistic} value="duration">
              时长
            </Radio>
            <span style={{ fontSize: 11, color: '#999999' }}>选择想要统计的维度</span>
          </div>
          <div className="employee-statistic-query-bottom">
            <Lov name="organizationIdList" />
            <Lov name="workerGroupCategoryIdList" style={{ marginLeft: 20 }} />
            <Lov name="workerGroupIdList" style={{ marginLeft: 20 }} />
            <Lov name="workerIdList" style={{ marginLeft: 20 }} />
            <Button
              onClick={() => {
                employeeHourStatistic.queryDataSet.current.set('organizationIdList', null);
                employeeHourStatistic.queryDataSet.current.set('workerGroupCategoryIdList', null);
                employeeHourStatistic.queryDataSet.current.set('workerGroupIdList', null);
                employeeHourStatistic.queryDataSet.current.set('workerIdList', null);
              }}
              style={{ marginLeft: 8 }}
            >
              {intl.get('hzero.common.button.reset').d('重置')}
            </Button>
            <Button color="primary" onClick={onSearchSelected} style={{ marginLeft: 8 }}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  const initLineTableColumns = useMemo(() => {
    return [
      {
        title: '类型',
        dataIndex: 'typeName',
        width: 130,
        fixed: 'left',
        key: 'typeName',
      },
    ];
  }, [teamFilter, lineLoading, loading]);

  /**
   * 点击行加载明细
   * @param {*} record
   */
  async function rowSelection({ record, statisticType, startDate, endDate, groupType }) {
    const { workerGroupId, workerId, organizationId } = record;
    const dataList = employeeHourStatistic.toJSONData();
    const newLineTableColumns = handleSetLineColumns();
    setLineTableColumns(newLineTableColumns);
    setLineLoading(true);
    setLineHeader({ ...record, statisticType });
    const isGroup = statisticType;
    const workTimesList = await queryWorkTimeReportMain({
      ...dataList,
      ...{ startDate, endDate, groupType },
      lines: [{ workerGroupId, workerId, organizationId }],
    });
    if (workTimesList && workTimesList.length > 0) {
      const newObj =
        isGroup === 'WORKER_GROUP'
          ? {
              processed: { typeName: '班组实际加工时间' },
              notProcessed: { typeName: '班组不计产量时间' },
              effective: { typeName: '班组在班时间' },
              work: { typeName: '班组时间利用率' },
            }
          : {
              processed: { typeName: '实际加工工时' },
              notProcessed: { typeName: '非加工工时' },
              effective: { typeName: '有效工作工时' },
              work: { typeName: '员工在班工时' },
            };
      const { startDate: dateList } = employeeHourStatistic.queryDataSet.current.data;
      const start = moment(dateList).format('YYYY-MM-DD HH:mm:ss');
      const end = getEndDate(groupType, dateList);
      const insertNumber = getDate(start, end);
      const dataFill = {};
      for (let j = 0; j < insertNumber + 1; j++) {
        dataFill[moment(start).add(j, 'days').format('YYYY-MM-DD')] = 0;
      }
      Object.keys(newObj).forEach((key) => {
        newObj[key] = Object.assign(newObj[key], dataFill);
        workTimesList.forEach((list) => {
          if (list.date) {
            if (key === 'processed') {
              newObj[key][list.date] = list.processedTime;
            } else if (key === 'notProcessed') {
              newObj[key][list.date] = list.notProcessedTime;
            } else if (key === 'effective') {
              newObj[key][list.date] = list.effectiveTimeTotal;
            } else if (key === 'work') {
              if (isGroup !== 'WORKER_GROUP') {
                newObj[key][list.date] = list.workerTimeTotal;
              }
            }
          }
        });
      });
      if (isGroup === 'WORKER_GROUP') {
        const { processed, effective } = newObj;
        Object.keys(processed).forEach((p) => {
          if (processed[p] && effective[p] && Number(effective[p]) && Number(processed[p])) {
            newObj.work[p] = `${parseFloat((processed[p] / effective[p]) * 100, 10).toFixed(2)}%`;
          }
        });
      }
      setLineDataList(Object.values(newObj));
      setLineLoading(false);
    } else {
      setLineDataList([]);
      setLineLoading(false);
    }
  }

  /**
   * @description: 获取日期间隔
   * @param {*} start
   * @param {*} end
   * @return {*}
   */
  function getDate(start, end) {
    return moment(end).diff(start, 'day');
  }

  /**
   * @description: 获取行列
   * @param {*}
   * @return {*}
   */
  function handleSetLineColumns() {
    const { startDate: dateList, groupType } = employeeHourStatistic.queryDataSet.current.data;
    const start = moment(dateList).format('YYYY-MM-DD HH:mm:ss');
    const end = getEndDate(groupType, dateList);
    const insertNumber = getDate(start, end);
    for (let i = 0; i < insertNumber + 1; i++) {
      initLineTableColumns.push({
        title: `${moment(start).add(i, 'days').format('YYYY-MM-DD')}日`,
        dataIndex: `${moment(start).add(i, 'days').format('YYYY-MM-DD')}`,
        width: 120,
        key: `${moment(start).add(i, 'days').format('YYYY-MM-DD')}`,
      });
    }
    return initLineTableColumns;
  }
  const chartStatisticsProps = {
    hidden,
    lineDataList,
  };

  const headerTableProps = {
    pagination: null,
    handlePagination,
    tableScrollWidth,
    dataSource: headerDataSource,
    columns: headerTableColumns,
  };

  const lineTableProps = {
    dataSource: lineDataList,
    columns: lineTableColumns,
    lineHeader,
  };
  return (
    <Fragment>
      <Header />
      <Content>
        <RenderBar />
        {!loading ? <HeaderTable {...headerTableProps} /> : null}
        {!loading && !lineLoading && lineDataList && lineDataList.length > 0 ? (
          <Fragment>
            <LineTable {...lineTableProps} />
            <div style={{ marginTop: 23, marginBottom: 23 }}>
              <Icon type={hidden ? 'expand_less' : 'expand_more'} />
              <a onClick={handleExpendOrHide}>
                <span>员工时间利用率</span>
              </a>
            </div>
            <ChartStatistics {...chartStatisticsProps} />
          </Fragment>
        ) : null}
      </Content>
    </Fragment>
  );
}
