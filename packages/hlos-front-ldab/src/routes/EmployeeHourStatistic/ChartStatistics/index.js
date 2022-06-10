/*
 * @Description:员工工时统计报表
 * @Author: hongming。zhang@hand-china.com
 * @Date: 2020-12-21 12:53:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-19 17:47:01
 */

import React, { useState, useEffect } from 'react';
import echarts from 'echarts';

export default function ChartStatistics(props) {
  const { hidden, lineDataList } = props;
  const [chartRef, setChartRef] = useState();
  const [echartsDateList, setEchartsDateList] = useState([]);
  const [effectiveList, setEffectiveList] = useState([]);
  const [activeDataList, setActiveDataList] = useState([]);
  const [lineData, setLineData] = useState([]);
  useEffect(() => {
    if (lineDataList && lineDataList.length > 0) {
      const processed = { ...lineDataList[0] };
      const effective = { ...lineDataList[2] };
      const total = {};
      delete processed.typeName;
      delete effective.typeName;
      Object.keys(effective).forEach((item) => {
        total[item] = effective[item] + processed[item];
      });
      setEchartsDateList(Object.keys(processed));
      setEffectiveList(Object.values(effective));
      setActiveDataList(Object.values(processed));
      setLineData(Object.values(total));
    } else {
      setEchartsDateList([]);
    }
  }, [props]);

  useEffect(() => {
    if (chartRef) {
      const statisticalChart = echarts.init(chartRef);
      window.removeEventListener('resize', statisticalChart.resize);
      window.addEventListener('resize', statisticalChart.resize);
      statisticalChart.setOption(options);
      return () => window.removeEventListener('resize', statisticalChart.resize);
    }
  }, [chartRef, hidden, options]);

  const options = {
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        textStyle: {
          color: '#000',
        },
      },
    },
    grid: {
      borderWidth: 0,
      top: 110,
      bottom: 95,
      textStyle: {
        color: '#000',
      },
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,.5)',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: 'rgba(0,0,0,0.7)',
          fontSize: 18,
        },
        data: echartsDateList,
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: 'rgba(0,0,0,0.5)',
          fontSize: 20,
        },
        splitArea: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '实际加工工时',
        type: 'bar',
        stack: '总量',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#00B3A9', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#00B3A9', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        data: activeDataList,
      },

      {
        name: '有效工作工时',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 179, 169, 0.16)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0, 179, 169, 0.16)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            barBorderRadius: 0,
          },
        },
        data: effectiveList,
      },
      {
        name: '总数',
        type: 'line',
        symbolSize: 10,
        symbol: 'circle',
        smooth: true,
        itemStyle: {
          normal: {
            color: 'rgba(255, 196, 53, 1)',
            barBorderRadius: 0,
          },
        },
        lineStyle: {
          normal: {
            width: 2,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#F4AF3D', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F4AF3D', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        data: lineData,
      },
    ],
  };

  return (
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
  );
}
