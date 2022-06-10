/*
 * @module: 卡片饼图
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-27 10:50:08
 * @LastEditTime: 2020-12-03 11:34:43
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

import style from './index.module.less';

export default function PieCard() {
  function options() {
    const getname = ['洗衣间', '信息中心', '厨房餐厅', '游泳池', '健身房', '实验室'];
    const getvalue = [180, 200, 150, 130, 110, 110];
    const indata = [];
    for (let i = 0; i < getname.length; i++) {
      indata.push({
        name: getname[i],
        value: getvalue[i],
      });
    }
    const colorList = ['#02CAB3', '#4885FF', '#FEC67C', '#54C3FC', '#9991F6', '#FF78E7'];
    const option = {
      title: {
        text: '880千瓦时',
        textStyle: {
          color: '#fff',
          fontSize: 17,
        },

        subtext: '总用电量',
        subtextStyle: {
          color: '#fff',
          fontSize: 15,
        },
        itemGap: 20,
        left: 'center',
        top: '45%',
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '55%'],
          center: ['50%', '50%'],
          clockwise: true,
          avoidLabelOverlap: true,
          hoverOffset: 15,
          itemStyle: {
            normal: {
              color (params) {
                return colorList[params.dataIndex];
              },
            },
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{a|{b}}\n{b|{c}千瓦时}\n{hr|●}',
            rich: {
              hr: {
                width: 6,
                height: 6,
                padding: [3, -10, 0, -10],
              },
              a: {
                padding: [-30, 15, -40, 15],
                color: '#666666',
                fontSize: 14,
              },
              b: {
                padding: [-30, 15, 0, 15],
                color: '#666666',
                fontSize: 14,
              },
            },
          },
          labelLine: {
            normal: {
              length: 30,
              length2: 30,
              lineStyle: {
                width: 1,
                color: '#CDCDCD',
              },
            },
          },
          data: indata,
        },
        {
          itemStyle: {
            normal: {
              color: 'rgba(255,255,255, 0)',
            },
          },
          type: 'pie',
          hoverAnimation: false,
          radius: ['42%', '58%'],
          center: ['50%', '50%'],
          label: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: 1,
            },
          ],
          z: -1,
        },
      ],
    };
    return option;
  }
  return (
    <div className={style['my-pie-card']}>
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
