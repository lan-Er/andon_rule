/*
 * @Description:IQC合格率统计报表
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-11-02 12:53:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-14 20:40:04
 */
import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import echarts from 'echarts';
import moment from 'moment';
// import quickSort from '../../utils/quickSort';
import { Header, Content } from 'components/Page';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
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
import { queryChartData } from '@/services/iqcStatisticalReportService';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { isUndefined } from 'lodash';

import { QueryDS, TableDS, TimeDS } from '@/stores/IqcStatisticalReportDS';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';

import styles from './style/index.module.less';

const { Option } = Select;
const organizationId = getCurrentOrganizationId();

export default function IqcStatisticalReport() {
  const [chartRef, setChartRef] = useState();
  const [hidden, setHidden] = useState(true);
  const [columns, setColumns] = useState([]);
  const [resData, setResData] = useState([]);
  const [checkedValue, setCheckedValue] = useState('DAY');
  const [radioValue, setRadioValue] = useState('today');
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);
  const bottomTableDS = useMemo(() => new DataSet(TableDS()), []);
  const timeRangeDS = useMemo(() => new DataSet(TimeDS()), []);

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
  const initColumns = [
    {
      align: 'right',
      width: 82,
      name: 'rate',
      renderer: ({ record }) => `${(record.get('rate') * 100).toFixed(2)}%`,
    },
    {
      align: 'right',
      width: 82,
      name: 'batchQty',
    },
    {
      align: 'right',
      width: 82,
      name: 'qcOkQty',
    },
    {
      align: 'right',
      width: 82,
      name: 'qcNgQty',
    },
    {
      align: 'right',
      width: 82,
      name: 'concessionQty',
    },
    {
      align: 'right',
      width: 82,
      name: 'returnedQty',
    },
    {
      align: 'left',
      width: 100,
      name: 'dayWeekMonth',
      renderer: ({ record }) => {
        const result = record.get('declaredDate').split(' ')[0];
        switch (checkedValue) {
          case 'DAY':
            return result;
          case 'WEEK':
            return `${record.get('x')}周`;
          case 'MONTH':
            return `${record.get('x')}月`;
          default:
            return result;
        }
      },
    },
  ];
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
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD');
      endTime = moment(getPrevDate(startTime, -6)).format('YYYY-MM-DD');
      timeRangeDS.current.set('time', {
        start: startTime,
        end: endTime,
      });
    } else if (value === 'curMonth') {
      startTime = moment(new Date()).format('YYYY-MM-01 00:00:00');
      endTime = new Date(
        new Date(moment(getPrevMonth(startTime)).format('YYYY-MM-DD HH:mm:ss')).getTime() - 1
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
    const item = {
      align: 'left',
      width: 128,
      name: 'itemCode',
      lock: true,
    };
    const description = {
      align: 'left',
      width: 200,
      name: 'itemName',
    };
    const supplier = {
      align: 'left',
      width: 200,
      name: 'partyName',
    };
    const uomName = {
      align: 'left',
      width: 70,
      name: 'uomName',
    };
    const handleSetColumn = (arg) => {
      const tempColumn = [...initColumns];
      tempColumn.unshift(...arg);
      return tempColumn;
    };
    if (queryDS.current && queryDS.current.data) {
      const {
        organizationObj,
        itemObj,
        reportType,
        summaryDataType,
        customerObj,
        rateFrom,
        rateTo,
      } = queryDS.current.data;
      let timeArr;
      if (timeRangeDS.current && timeRangeDS.current.data) {
        const { time } = timeRangeDS.current.data;
        timeArr = time;
      }
      const newParams = {
        organizationId: organizationObj?.meOuId ? organizationObj.meOuId : undefined,
        reportType,
        summaryDateType: checkedValue,
        summaryDataType: summaryDataType ? [...summaryDataType] : undefined,
        queryStartDate: timeArr ? moment(timeArr.start).format(DEFAULT_DATETIME_FORMAT) : undefined,
        queryEndDate: timeArr ? moment(timeArr.end).format(DEFAULT_DATETIME_FORMAT) : undefined,
        itemId: itemObj.length > 0 ? itemObj.map((i) => i.itemId) : undefined,
        partyId: customerObj.length > 0 ? customerObj.map((i) => i.partyId) : undefined,
        rateFrom: rateFrom ? rateFrom / 100 : undefined,
        rateTo: rateTo ? rateTo / 100 : undefined,
        inspectionDocType: 'IQC',
      };
      params = newParams;
      if ([...summaryDataType].includes('ITEM') && ![...summaryDataType].includes('SUPPLIER')) {
        // 按物料维度时，不展示供应商列，数据按物料汇总
        setColumns(handleSetColumn([item, description, uomName]));
      } else if (
        ![...summaryDataType].includes('ITEM') &&
        [...summaryDataType].includes('SUPPLIER')
      ) {
        // 按供应商维度时，不展示物料、物料描述及单位列，数据按供应商汇总
        setColumns(handleSetColumn([supplier]));
      } else {
        // 按物料+供应商时，展示所有列，数据按一物料对一供应商汇总
        setColumns(handleSetColumn([item, description, supplier, uomName]));
      }
    } else {
      setColumns(handleSetColumn([item, description, supplier, uomName]));
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
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    let timeArr;
    let partyIds = null;
    let itemIds = null;
    if (timeRangeDS.current && timeRangeDS.current.data) {
      const { time } = timeRangeDS.current.data;
      timeArr = time;
    }
    if(fieldsValue.customerObj && fieldsValue.customerObj.length) {
      partyIds = fieldsValue.customerObj.map(v => v.partyId).join();
    }
    if(fieldsValue.itemObj && fieldsValue.itemObj.length) {
      itemIds = fieldsValue.itemObj.map(v => v.itemId).join();
    }
    return {
      ...fieldsValue,
      queryStartDate: timeArr ? moment(timeArr.start).format(DEFAULT_DATETIME_FORMAT) : undefined,
      queryEndDate: timeArr ? moment(timeArr.end).format(DEFAULT_DATETIME_FORMAT) : undefined,
      summaryDataTypes: fieldsValue.summaryDataType.join(),
      itemObj: null,
      customerObj: null,
      summaryDateType: checkedValue,
      partyIds,
      itemIds,
    };
  }

  return (
    <Fragment>
      <div
        className={styles['Iqc-statistical-report']}
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
                requestUrl={`${HLOS_LMES}/v1/${organizationId}/inspection-docs/rate/excel`}
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
              <Select required value={checkedValue} placeholder="请选择" onChange={handleChange}>
                <Option value="DAY">按日</Option>
                <Option value="WEEK">按周</Option>
                <Option value="MONTH">按月</Option>
              </Select>
            </span>
            <span className={styles['search-tip']}>选择想要统计的维度</span>
          </div>
          <div className={styles['top-search']}>
            <div className={styles['top-search-left']}>
              <span className={styles['top-search-left-item']}>
                <Lov dataSet={queryDS} name="itemObj" />
              </span>
              <span className={styles['top-search-left-item']}>
                <Lov
                  dataSet={queryDS}
                  name="customerObj"
                />
              </span>
              <div className={styles['top-search-left-item']}>
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
            </div>
            <div className={styles['top-search-right']}>
              <Button
                onClick={() => {
                  queryDS.reset();
                  timeRangeDS.reset();
                }}
              >
                重置
              </Button>
              <Button color="primary" onClick={handleSearch}>
                查询
              </Button>
            </div>
          </div>
          <div className={styles['mid-chart']}>
            <div className={styles['expend-or-hide']} onClick={handleExpendOrHide}>
              <Icon type={hidden ? 'expand_less' : 'expand_more'} />
              <span>IQC合格率统计图</span>
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
