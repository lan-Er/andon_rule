/*
 * @module: 柱状图卡片
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-03 16:34:05
 * @LastEditTime: 2020-12-03 16:52:51
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

import style from './index.module.less';

export default function LineCard() {
  function options() {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      itemStyle: {
        color: '#02CAB3',
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            color: '#fff',
            margin: 10,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            color: '#fff',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff',
            },
          },
        },
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220],
        },
      ],
    };
    return option;
  }
  return (
    <div className={style['my-line-card']}>
      <div>
        <ReactEcharts
          option={options()}
          opts={{ renderer: 'canvas' }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
