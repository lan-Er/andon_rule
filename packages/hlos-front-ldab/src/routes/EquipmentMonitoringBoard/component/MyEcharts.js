/*
 * @module: echarts封装
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-21 18:59:12
 * @LastEditTime: 2021-01-22 17:36:25
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import React, { Fragment, useMemo } from 'react';

import style from './index.module.less';

export default function ({
  list: { standardValue, chartDtoList, parametersName, parametersValue },
}) {
  const xArray = useMemo(() => {
    return (
      chartDtoList &&
      chartDtoList.map((item) =>
        item.monitoredTime ? moment(item.monitoredTime).format('HH:mm:ss') : ''
      )
    );
  }, [chartDtoList]);
  const yArray = useMemo(
    () =>
      chartDtoList &&
      chartDtoList.map((item) => (item.parametersValue ? Number(item.parametersValue) : 0)),
    [chartDtoList]
  );

  function standardValueLine(lineValue, index) {
    return {
      name: '标准值',
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(0,244,255,1)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(0,77,167,1)', // 100% 处的颜色
              },
            ],
            false
          ),

          shadowColor: 'rgba(0,160,221,1)',
        },
      },
      markLine: {
        symbol: 'none',
        silent: true,
        lineStyle: {
          normal: {
            type: 'dashed',
          },
        },
        label: {
          position: 'start',
        },
        data: [
          {
            yAxis: lineValue,
            lineStyle: {
              width: 1,
              color: index === 0 ? 'yellow' : 'rgba(0,244,255,1)',
            },
            label: {
              show: true,
              position: '',
            },
          },
        ],
      },
    };
  }
  function haveStandard(standard, yArrayList) {
    let standardValueArr = [];
    const result = [
      {
        data: yArrayList,
        showAllSymbol: true,
        type: 'line',
        smooth: true, // 曲线
        symbol: 'none', // 去除线上点
        lineStyle: {
          normal: {
            width: 2,
            color: '#007AFF',
          },
        },
      },
    ];
    if (!standard) {
      return [];
    } else {
      const haveTwo = standard.includes('~');
      standardValueArr = haveTwo ? standard.split('~') : [standard];
      standardValueArr.forEach((item, index) => {
        const newLine = standardValueLine(item, index);
        result.push(newLine);
      });
    }
    return result;
  }
  function option() {
    const options = {
      grid: {
        left: '9%',
        top: '8%',
        right: '1%',
      },
      xAxis: [
        {
          type: 'category',
          data: xArray,
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.8)',
            },
          },
          axisTick: {
            show: true, // 刻度
          },
          axisLabel: {
            interval: 'auto', // 每隔10个点取一个值
            rotate: 30, // 倾斜显示
            textStyle: {
              color: 'rgba(255,255,255,0.8)',
            },
            // 默认x轴字体大小
            fontSize: 12,
            // margin:文字到x轴的距离
            margin: 6,
          },
          boundaryGap: true,
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.8)',
          },
        },
        splitLine: {
          show: false,
        },
      },
      series: standardValue
        ? haveStandard(standardValue, yArray)
        : {
            data: yArray,
            showAllSymbol: true,
            type: 'line',
            smooth: true, // 曲线
            symbol: 'none', // 去除线上点
            lineStyle: {
              normal: {
                width: 2,
                color: '#007AFF',
              },
            },
          },
    };
    return options;
  }

  function changeStandarValue(value) {
    if (!value) {
      return '暂无';
    } else {
      const haveTwo = value.includes('~');
      const standardValueArr = haveTwo ? value.split('~') : [value];
      let result = '';
      standardValueArr.forEach((item, index) => {
        if (index === 0) {
          result = Number(item);
        } else {
          result = `${result}~${Number(item)}`;
        }
      });
      return result;
    }
  }
  return (
    <Fragment>
      <section className={style['my-echarts-list']}>
        <div>{parametersName}</div>
        <div>{parametersValue ? Number(parametersValue) : 0}</div>
        <div>标准值 {changeStandarValue(standardValue) ?? '无标准值'}</div>
      </section>
      <ReactEcharts
        option={option()}
        opts={{ renderer: 'canvas' }}
        style={{ width: '100%', height: '100%' }}
      />
    </Fragment>
  );
}
