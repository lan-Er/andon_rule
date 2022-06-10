/*
 * @module: 卡片折线图
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-03 10:52:56
 * @LastEditTime: 2020-12-03 16:09:42
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

import style from './index.module.less';

export default function LineCard() {
  function options() {
    const option = {
      // backgroundColor: '#010d13',
      textStyle: {
        color: '#b3babe',
      },
      legend: {
        type: 'plain',
        top: 20,
        right: '2%',
        textStyle: {
          fontSize: 18,
        },
        itemGap: 40,
        itemWidth: 40,
        itemHeight: 20,
        data: [
          {
            name: '里弄房屋',
            textStyle: {
              color: '#e2ab2b',
            },
          },
          {
            name: '已列入改造计划',
            textStyle: {
              color: '#03dda3',
            },
          },
        ],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          axis: 'x',
        },
        padding: [10, 10],
        extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
      },
      grid: {
        top: '15%',
        left: '10%',
        right: '10%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          fontSize: 20,
          margin: 20,
          color: '#85d7f9',
        },
        data: ['数量(处)', '数量(栋)', '建筑面积', '户数'],
      },
      yAxis: {
        name: '㎡/数量',
        nameTextStyle: {
          fontSize: 25,
          color: '#3dcaff',
        },
        nameGap: 30,
        axisLine: true,
        axisLabel: {
          fontSize: 20,
          color: '#3dcaff',
          margin: 0,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#123144',
            width: 3,
          },
        },
      },
      series: [
        {
          name: '里弄房屋',
          data: [150, 200, 400, 90],
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#00ca95',
              fontSize: 25,
            },
          },
          itemStyle: {
            normal: {
              color: '#3A84FF',
              lineStyle: {
                color: '#3A84FF',
                width: 1,
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(0, 0, 0, 0)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#21da94', // 100% 处的颜色
                    },
                  ],
                },
              },
            },
          },
        },
        {
          name: '已列入改造计划',
          data: [400, 354, 180, 450],
          type: 'line',
          showAllSymbol: true,
          smooth: true,
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#00ca95',
              fontSize: 25,
            },
          },
          itemStyle: {
            normal: {
              color: '#3A84FF',
              lineStyle: {
                color: '#3A84FF',
                width: 1,
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(0, 0, 0, 0)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#1fb5fc', // 100% 处的颜色
                    },
                  ],
                },
              },
            },
          },
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
