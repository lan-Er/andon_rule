import echarts from 'echarts';
import moment from 'moment';
import { Radio } from 'choerodon-ui/pro';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { connect } from 'dva';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import styles from '../index.module.less';
import { debounce, getDates } from './utils';

const intlPrefix = 'lmes.andonStatistic';

const currentDay = [moment().format(DEFAULT_DATE_FORMAT)];
const currentWeekDays = getDates(
  moment().startOf('isoWeek').toDate(),
  moment().endOf('isoWeek').toDate()
);
const currentMonthDays = getDates(
  moment().startOf('month').toDate(),
  moment().endOf('month').toDate()
);

function PieChart({ dispatch, filterChange, filterData, filterOptionsValid }) {
  const [polylineType, setPolylineType] = useState('TIMES');
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [lineChartInstance, setLineChartInstance] = useState(null);

  useEffect(() => {
    if (filterChange && filterOptionsValid) {
      setPolylineType('TIMES');
      setTimeout(() => handleQuery('all', 'TIMES'));
    }
  }, [filterChange, filterOptionsValid, handleQuery]);

  useEffect(() => {
    handleQuery('statistic', polylineType);
  }, [handleQuery, polylineType]);

  useEffect(() => {
    let debouncePieResizeFun;
    let debounceLineResizeFun;
    const { current: pieChartContainer } = pieChartRef;
    const { current: lineChartContainer } = lineChartRef;
    if (pieChartContainer) {
      const pieChart = echarts.init(pieChartContainer);
      setPieChartInstance(pieChart);
      debouncePieResizeFun = debounce(pieChart.resize, 200);
      pieChart.setOption({
        color: ['#29BECE', '#F1963A', '#F16549'],
        tooltip: {
          trigger: 'item',
          formatter(params) {
            return `${params.marker}${params.name}${'&nbsp'.repeat(6)}${params.data.value}<br>`;
          },
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            label: {
              formatter({ name, value }) {
                return `{label|${
                  name.length > 6 ? `${name.slice(0, 6)}...` : name
                }:} {value|${value}}`;
              },
              rich: {
                label: {
                  fontSize: 12,
                  color: '#666',
                },
                value: {
                  fontSize: 18,
                  color: '#2A2A2A',
                },
              },
            },
          },
        ],
      });
      window.addEventListener('resize', debouncePieResizeFun);
    }
    if (lineChartContainer) {
      const lineChart = echarts.init(lineChartContainer);
      setLineChartInstance(lineChart);
      lineChart.setOption({
        color: [
          '#29BECE',
          '#FBD390',
          '#F8C291',
          '#6A89CC',
          '#82CBDD',
          '#B8E994',
          '#78E08E',
          '#60A2BC',
          '#4A68BD',
          '#E55039',
          '#F7B93B',
          '#FA993A',
          '#EB2E05',
          '#1E3799',
          '#3C6382',
          '#38ADA9',
          '#E68E27',
          '#B7153F',
          '#0C2361',
          '#0B3D62',
          '#049992',
        ],
        tooltip: {
          trigger: 'axis',
          formatter({ 0: param }) {
            return `${param.name}<br>${param.marker}${
              param.value === 0
                ? '&nbsp'.repeat(14)
                : '&nbsp'.repeat(14 - param.value.toString().length - 1)
            }${param.value}`;
          },
        },
        grid: {
          x: 60,
          x2: 40,
          y: 30,
          y2: 30,
        },
        legend: {
          type: 'scroll',
          top: '2%',
          right: '3%',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: generateDateArr('month'),
          axisLine: {
            lineStyle: {
              color: '#DDD',
              width: 2,
            },
          },
          axisLabel: {
            textStyle: {
              color: '#666',
            },
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#DDD',
              width: 2,
            },
          },
          axisLabel: {
            textStyle: {
              color: '#666',
            },
          },
        },
        series: [
          {
            type: 'line',
            symbol: 'circle',
          },
        ],
      });
      window.addEventListener('resize', debounceLineResizeFun);
    }
    return () => {
      window.removeEventListener('resize', debouncePieResizeFun);
      window.removeEventListener('resize', debounceLineResizeFun);
    };
  }, [pieChartRef, lineChartRef]);

  const handleQuery = useCallback(
    (type, value = polylineType) => {
      if (filterOptionsValid === false) {
        return;
      }
      const payload = {
        page: 0,
        size: 10,
        organizationId: filterData.get('meOuId'),
        prodLineId: filterData.get('prodLineId'),
        period: filterData.get('period'),
        startDate: filterData.get('startDate')?.format(DEFAULT_DATE_FORMAT),
        endDate: filterData.get('endDate')?.format(DEFAULT_DATE_FORMAT),
      };
      if (value) {
        payload.polylineType = value;
      }
      if (type === 'statistic') {
        _handleQuery('queryAndonStatistic');
      } else if (type === 'all') {
        _handleQuery('queryAndonTriggerClassification');
        _handleQuery('queryAndonStatistic');
      }

      async function _handleQuery(actionName) {
        const res = await dispatch({
          type: `andonStatistic/${actionName}`,
          payload,
        });
        handleUpdateChart(res, actionName);
      }
    },
    [polylineType, filterData, handleUpdateChart, filterOptionsValid, dispatch]
  );

  const handleUpdateChart = useCallback(
    (res, actionName) => {
      if (actionName === 'queryAndonTriggerClassification') {
        if (Array.isArray(res?.detail)) {
          pieChartInstance.setOption({
            series: [
              {
                data: res.detail
                  .filter((i) => i.amount > 0)
                  .map((i) => ({
                    value: i.amount,
                    name: i.andonClassName,
                  })),
              },
            ],
          });
        }
      } else if (actionName === 'queryAndonStatistic') {
        const xAxis = {};
        switch (filterData.get('period')) {
          case 'DAY':
            xAxis.data = currentDay;
            break;
          case 'WEEK':
            xAxis.data = currentWeekDays;
            break;
          case 'MONTH':
            xAxis.data = currentMonthDays;
            break;
          default:
            // 手动选择日期时 period 为空，手动计算日期范围
            xAxis.data = getDates(
              filterData.get('startDate').toDate(),
              filterData.get('endDate').toDate()
            );
        }
        const options = {
          xAxis,
        };
        if (Array.isArray(res)) {
          lineChartInstance.setOption({
            ...options,
            legend: {
              data: res.map((i) => i.andonClassName),
            },
            series: res.map((item) => ({
              name: item.andonClassName,
              data: item.polyLineDots.map((i) => {
                switch (polylineType) {
                  case 'TIMES':
                    return i.triggerTimes;
                  case 'RESPONSE':
                    return i.responseDuration;
                  case 'CLOSE':
                    return i.closeDuration;
                  default:
                    return 0;
                }
              }),
              type: 'line',
              symbol: 'circle',
            })),
          });
        } else {
          lineChartInstance.setOption(options);
        }
      }
    },
    [pieChartInstance, lineChartInstance, polylineType, filterData]
  );

  function handleRadioChange(value) {
    setPolylineType(value);
  }

  return (
    <div className={styles.chartWrap}>
      <div className={styles.andonPieSignBoardWrap}>
        <span className={styles.title}>
          {intl.get(`${intlPrefix}.view.title.andon.trigger.classification`).d('安灯触发分类')}
        </span>
        <div
          className={styles.andonPieSignBoard}
          ref={(node) => {
            pieChartRef.current = node;
          }}
        />
      </div>
      <div className={styles.andonLineSignBoardWrap}>
        <span className={styles.title}>
          <span className={styles.left}>
            {intl.get(`${intlPrefix}.view.title.andon.statistic`).d('安灯统计')}
          </span>
          <span>
            <Radio
              onChange={handleRadioChange}
              name="polylineType"
              mode="button"
              value="TIMES"
              checked={polylineType === 'TIMES'}
            >
              {intl.get(`${intlPrefix}.view.button.triggerTimes`).d('触发次数')}
            </Radio>
            <Radio
              onChange={handleRadioChange}
              name="polylineType"
              mode="button"
              value="RESPONSE"
              checked={polylineType === 'RESPONSE'}
            >
              {intl.get(`${intlPrefix}.view.button.averageResponse`).d('平均响应')}
            </Radio>
            <Radio
              onChange={handleRadioChange}
              name="polylineType"
              mode="button"
              value="CLOSE"
              checked={polylineType === 'CLOSE'}
            >
              {intl.get(`${intlPrefix}.view.button.averageProcess`).d('平均处理')}
            </Radio>
          </span>
        </span>
        <div
          className={styles.andonLineSignBoard}
          ref={(node) => {
            lineChartRef.current = node;
          }}
        />
      </div>
    </div>
  );
}

export default connect(({ andonStatistic }) => ({
  filterChange: andonStatistic.filterChange,
}))(formatterCollections({ code: [`${intlPrefix}`] })(PieChart));
