/*
 * @Description:RateOfFinishedProducts
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-11-09 15:01:44
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-11-23 18:23:57
 */

import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Header, Content } from 'components/Page';
import {
  Lov,
  DataSet,
  Radio,
  Table,
  Button,
  NumberField,
  DatePicker,
  Icon,
  Select,
} from 'choerodon-ui/pro';
import { userSetting } from 'hlos-front/lib/services/api';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { queryChartData } from '@/services/iqcStatisticalReportService';
import { QueryDS, TimeDS, TableDS } from '@/stores/RateOfFinishedProductsDS';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';
import styles from './style/index.module.less';
import handleJudgeColumn from './utils';

const tId = getCurrentOrganizationId();

export default function RateOfFinishedProducts() {
  const [chartRef, setChartRef] = useState();
  const [hidden, setHidden] = useState(true);
  const [columns, setColumns] = useState([]);
  const [resData, setResData] = useState([]);
  const [checkedValue, setCheckedValue] = useState('DAY');
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);
  const timeRangeDS = useMemo(() => new DataSet(TimeDS()), []);
  const bottomTableDS = useMemo(() => new DataSet(TableDS()), []);
  const [radioValue, setRadioValue] = useState('today');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    color: ['#00B3A9'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: (() => {
          if (resData.length) {
            let timeUmo;
            switch (checkedValue) {
              case 'DAY':
                timeUmo = '';
                break;
              case 'WEEK':
                timeUmo = '周';
                break;
              case 'MONTH':
                timeUmo = '月';
                break;
              default:
                timeUmo = '';
            }
            return [...resData.map((i) => `${i.x}${timeUmo}`)];
          }
          return [];
        })(),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: (() => {
          if (resData.length) {
            return Math.max(...resData.map((i) => i.batchQty + (100 - (i.batchQty % 100))));
          }
        })(),
        interval: (() => {
          if (resData.length) {
            return Math.max(...resData.map((i) => i.batchQty + (100 - (i.batchQty % 100)))) / 5;
          }
        })(),
      },
      {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        position: 'right',
        axisLabel: {
          formatter: '{value} %',
        },
      },
    ],
    series: [
      {
        name: '检验总量',
        type: 'bar',
        barWidth: '50%',
        data: (() => {
          if (resData.length) {
            return [...resData.map((i) => i.batchQty)];
          }
          return [];
        })(),
      },
      {
        name: '合格率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: (() => {
          if (resData.length) {
            return [...resData.map((i) => (i.rate * 100).toFixed(2))];
          }
          return [];
        })(),
        areaStyle: { color: 'rgba(0, 179, 169, 0.1)' },
        lineStyle: { color: 'rgba(0, 179, 169, 0.1)' },
      },
    ],
  };

  const tableProps = {
    dataSet: bottomTableDS,
    columns,
    columnResizable: true,
    editMode: 'inline',
  };
  /**
   * @description: 窗口大小改变 图表的响应
   */
  useEffect(() => {
    if (chartRef) {
      const statisticalChart = echarts.init(chartRef);
      window.removeEventListener('resize', statisticalChart.resize);
      window.addEventListener('resize', statisticalChart.resize);
      statisticalChart.setOption(options);
      return () => window.removeEventListener('resize', statisticalChart.resize);
    }
  }, [chartRef, hidden, options]);

  /**
   * @description: 首次进入设置默认组织并查询
   */
  useEffect(() => {
    queryDS.create();
    timeRangeDS.create();
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        queryDS.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          meOuName: res.content[0].organizationName,
        });
      }
      handleSearch();
    }
    getUserInfo();
  }, []);

  /**
   * @description: 日期变更触发绑定的函数并查询
   */
  useEffect(() => {
    timeRangeDS.removeEventListener('update', bindFunc);
    timeRangeDS.addEventListener('update', bindFunc);
    return () => timeRangeDS.removeEventListener('update', bindFunc);
  }, [timeRangeDS, bindFunc, checkedValue]);

  /**
   * @description: 日周月切换时触发查询
   */
  useEffect(() => {
    handleSearch();
  }, [checkedValue]);

  /**
   * @description: 绑定的事件函数
   */
  const bindFunc = useCallback(
    async ({ name }) => {
      if (name === 'time') {
        await handleSearch();
      }
    },
    [checkedValue, handleSearch]
  );

  /**
   * @description: 日周月切换
   */
  const handleRadioChange = (value) => {
    let startTime;
    let endTime;
    setRadioValue(value);

    if (value === 'today') {
      startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
      endTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      );
      timeRangeDS.current.set('time', {
        start: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else if (value === 'curWeek') {
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD 00:00:00');
      endTime = moment(getPrevDate(startTime, -6)).format('YYYY-MM-DD 23:59:59');
      timeRangeDS.current.set('time', {
        start: startTime,
        end: endTime,
      });
    } else if (value === 'curMonth') {
      startTime = moment(new Date()).format('YYYY-MM-01 00:00:00');
      endTime = new Date(
        new Date(moment(getPrevMonth(startTime)).format('YYYY-MM-DD 00:00:00')).getTime() - 1
      );
      timeRangeDS.current.set('time', {
        start: startTime,
        end: endTime,
      });
    }
  };

  /**
   * @description: 控制chart的显隐
   */
  const handleExpendOrHide = () => {
    setHidden(!hidden);
  };

  /**
   * @description: 查询按钮
   */
  const handleSearch = useCallback(async () => {
    const queryDSValidate = await queryDS.validate(false, false);
    const timeDSValidate = await timeRangeDS.validate(false, false);
    if (!queryDSValidate || !timeDSValidate) {
      return;
    }
    let params = {};
    if (queryDS.current && queryDS.current.data) {
      const {
        rateTo,
        itemObj,
        rateFrom,
        reportType,
        firstRateTo,
        categoryObj,
        prodLineObj,
        firstRateFrom,
        equipmentObj,
        workerObj,
        organizationObj,
        summaryDataType,
        templateType,
        inspectionDocType,
      } = queryDS.current.data;
      let timeArr;
      if (timeRangeDS.current && timeRangeDS.current.data) {
        const { time } = timeRangeDS.current.data;
        timeArr = time;
      }
      params = {
        reportType,
        inspectionDocType,
        rateTo: rateTo ? rateTo / 100 : undefined,
        rateFrom: rateFrom ? rateFrom / 100 : undefined,
        firstRateFrom: firstRateFrom ? firstRateFrom / 100 : undefined,
        firstRateTo: firstRateTo ? firstRateTo / 100 : undefined,
        summaryDateType: checkedValue,
        inspectionTemplateType: templateType,
        itemId: itemObj.length > 0 ? itemObj.map((i) => i.itemId) : undefined,
        summaryDataType: summaryDataType ? [...summaryDataType] : undefined,
        organizationId: organizationObj?.meOuId ? organizationObj.meOuId : undefined,
        prodLineId: prodLineObj.length > 0 ? prodLineObj.map((i) => i.operationId) : undefined,
        categoryId: categoryObj ? categoryObj.categoryId : undefined,
        equipmentId: equipmentObj.length ? equipmentObj.map((i) => i.equipmentId) : undefined,
        workerId: workerObj.length ? workerObj.map((i) => i.workerId) : undefined,
        queryEndDate: timeArr ? moment(timeArr.end).format(DEFAULT_DATETIME_FORMAT) : undefined,
        queryStartDate: timeArr ? moment(timeArr.start).format(DEFAULT_DATETIME_FORMAT) : undefined,
      };
      const dataTypeArr = [...summaryDataType];
      setColumns(handleJudgeColumn(dataTypeArr, checkedValue));
    } else {
      setColumns(handleJudgeColumn());
    }
    bottomTableDS.queryParameter = params;
    bottomTableDS.query();
    const res = await queryChartData(params);
    if (res) {
      setResData(res);
    } else {
      setResData([]);
    }
  }, [checkedValue]);

  /**
   * @description: 下拉框
   */
  const handleChange = (value) => {
    setCheckedValue(value);
  };

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = queryDS.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    let itemIds = null;
    let categoryIds = null;
    let equipmentIds = null;
    let workerIds = null;
    let prodLineIds = null;
    let timeArr = {};
    if (fieldsValue.itemObj) {
      itemIds = fieldsValue?.itemObj.map((v) => v.itemId).join();
    }
    if (fieldsValue.categoryObj) {
      categoryIds = fieldsValue.categoryObj.map((v) => v.categoryId).join();
    }
    if (fieldsValue.equipmentObj) {
      equipmentIds = fieldsValue.equipmentObj.map((v) => v.equipmentId).join();
    }
    if (fieldsValue.prodLineObj) {
      prodLineIds = fieldsValue.prodLineObj.map((v) => v.prodLineId).join();
    }
    if (fieldsValue.workerObj) {
      workerIds = fieldsValue.workerObj.map((v) => v.workerId).join();
    }
    if (timeRangeDS.current && timeRangeDS.current.data) {
      const { time } = timeRangeDS.current.data;
      timeArr = time;
    }
    return filterNullValueObject({
      ...fieldsValue,
      itemIds,
      categoryIds,
      equipmentIds,
      workerIds,
      prodLineIds,
      summaryDateType: fieldsValue?.checkedValue,
      queryStartDate: timeArr ? moment(timeArr.start).format(DEFAULT_DATETIME_FORMAT) : undefined,
      queryEndDate: timeArr ? moment(timeArr.end).format(DEFAULT_DATETIME_FORMAT) : undefined,
      itemObj: null,
      categoryObj: null,
      equipmentObj: null,
      prodLineObj: null,
      workerObj: null,
    });
  }

  return (
    <Fragment>
      <div
        className={styles['Pqc-statistical-report']}
        style={{
          width: '100%',
        }}
      >
        <Header>
          <div className={styles['header-search']}>
            <div className={styles['header-search-left']}>
              <div className={styles['header-search-first']}>
                <Radio
                  mode="button"
                  name="day"
                  value="today"
                  checked={radioValue === 'today'}
                  onChange={handleRadioChange}
                >
                  今日
                </Radio>
                <Radio
                  mode="button"
                  name="week"
                  value="curWeek"
                  checked={radioValue === 'curWeek'}
                  onChange={handleRadioChange}
                >
                  本周
                </Radio>
                <Radio
                  mode="button"
                  name="month"
                  value="curMonth"
                  checked={radioValue === 'curMonth'}
                  onChange={handleRadioChange}
                >
                  本月
                </Radio>
              </div>
              <div className={styles['header-search-second']}>
                <DatePicker
                  dataSet={timeRangeDS}
                  name="time"
                  placeholder={['开始日期', '结束日期']}
                />
              </div>
            </div>
            <div className={styles['header-search-right']}>
              <Lov dataSet={queryDS} name="organizationObj" placeholder="组织" noCache />
              <ExcelExport
                requestUrl={`${HLOS_LMES}/v1/${tId}/inspection-docs/qualified/excel`}
                queryParams={getExportQueryParams}
              />
            </div>
          </div>
        </Header>
        <Content>
          <div className={styles['search-title-content']}>
            <span className={styles['search-title']}>
              <Select
                dataSet={queryDS}
                name="summaryDataType"
                placeholder="请选择"
                maxTagCount={2}
                maxTagTextLength={3}
                maxTagPlaceholder={(restValues) => `+${restValues.length}...`}
              />
            </span>
            <span className={styles['search-select']}>
              <Select
                dataSet={queryDS}
                name="checkedValue"
                placeholder="请选择"
                onChange={handleChange}
              />
            </span>
            <span className={styles['search-tip']}>选择想要统计的维度</span>
          </div>
          <div className={styles['top-search']}>
            <div className={styles['top-search-lineOne']}>
              <Lov className={styles['top-search-lineOne-item']} dataSet={queryDS} name="itemObj" />
              <Lov
                className={styles['top-search-lineOne-item']}
                dataSet={queryDS}
                name="prodLineObj"
                placeholder="生产线"
              />
              <Lov
                className={styles['top-search-lineOne-item']}
                dataSet={queryDS}
                name="equipmentObj"
                placeholder="设备"
              />
              <Lov
                className={styles['top-search-lineOne-item']}
                dataSet={queryDS}
                name="workerObj"
                placeholder="人员"
              />
            </div>
            <div className={styles['top-search-lineTwo']}>
              <Lov
                className={styles['top-search-lineTwo-left']}
                dataSet={queryDS}
                name="categoryObj"
                placeholder="物料类别"
              />
              <div className={styles['lineTwo-right-item-rate']}>
                <span className={styles['statistical-rate']}>合格率</span>
                <NumberField
                  dataSet={queryDS}
                  name="rateFrom"
                  className={styles['statistical-rate']}
                  suffix={<span style={{ lineHeight: '20px', color: '#9b9b9b' }}>%</span>}
                />
                <span className={styles['statistical-rate-mid']} style={{ lineHeight: '20px' }}>
                  ~
                </span>
                <NumberField
                  dataSet={queryDS}
                  name="rateTo"
                  className={styles['statistical-rate']}
                  suffix={<span style={{ lineHeight: '20px', color: '#9b9b9b' }}>%</span>}
                />
              </div>
              <div className={styles['lineTwo-right-item-rate']}>
                <span className={styles['statistical-rate']}>一次合格率</span>
                <NumberField
                  dataSet={queryDS}
                  name="firstRateFrom"
                  className={styles['statistical-rate']}
                  suffix={<span style={{ lineHeight: '20px', color: '#9b9b9b' }}>%</span>}
                />
                <span className={styles['statistical-rate-mid']} style={{ lineHeight: '20px' }}>
                  ~
                </span>
                <NumberField
                  dataSet={queryDS}
                  name="firstRateTo"
                  className={styles['statistical-rate']}
                  suffix={<span style={{ lineHeight: '20px', color: '#9b9b9b' }}>%</span>}
                />
              </div>
              <div className={styles['lineTwo-right-item-query']}>
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
            </div>
          </div>
          <div className={styles['mid-chart']}>
            <div className={styles['expend-or-hide']} onClick={handleExpendOrHide}>
              <Icon type={hidden ? 'expand_less' : 'expand_more'} />
              <span>成品合格率统计图</span>
            </div>
            <div
              style={{
                width: '100%',
                height: hidden ? '0' : '350px',
                opacity: hidden ? '0' : '1',
                transition: 'all 0.1s',
              }}
            >
              <div
                ref={(node) => setChartRef(node)}
                style={{
                  width: '100%',
                  height: '350px',
                }}
              />
            </div>
          </div>
          <div className={styles['bottom-table']}>
            <Table {...tableProps} />
          </div>
        </Content>
      </div>
    </Fragment>
  );
}
