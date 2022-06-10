/*
 * @module-:
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-27 15:39:14
 * @LastEditTime: 2020-08-03 10:24:36
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

import { Bind } from 'lodash-decorators';
import { queryList } from '@/services/api';

import style from './index.less';

export default class MyContentLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatistics: {
        attribute1: 0,
        attribute2: 0,
        attribute3: 0,
      },
      inventoryIndex: [],
    };
  }

  componentDidMount() {
    queryList({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'BOARD-STOCK',
      page: 0,
      size: 100,
    }).then((res) => {
      const { content } = res ?? { content: [] };
      if (content.length > 0) {
        this.setState({
          orderStatistics: content[0],
        });
      }
    });
    queryList({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'BOARD-1',
      page: 0,
      size: 100,
    }).then((res) => {
      const { content } = res ?? { content: [] };
      this.setState({
        inventoryIndex: content,
      });
    });
  }

  /**
   *库存分布饼图
   *
   * @returns
   * @memberof MyContentLeft
   */
  @Bind()
  getOption() {
    const {
      orderStatistics: { attribute1, attribute2, attribute3 },
    } = this.state;
    const dataList = [
      { name: '原材料', value: attribute1 },
      { name: '半成品', value: attribute2 },
      { name: '成品', value: attribute3 },
    ];
    let totalNumber = 0;
    dataList.forEach((item) => {
      totalNumber += Number(item.value);
    });
    const colorList = ['#2AC5A9 ', '#FF4B4B', '#FBA35C'];

    const option = {
      title: {
        text: `${totalNumber}`,
        subtext: '总库存',
        textStyle: {
          fontSize: 20,
          color: '#fff',
          lineHeight: 20,
        },
        subtextStyle: {
          fontSize: 16,
          color: '#868FA4',
        },
        textAlign: 'center',
        left: '29%',
        top: '38%',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        // type: 'scroll',
        orient: 'vertical',
        right: 18,
        top: 'center',
        itemGap: 20,
        selectedMode: false,
        icon: 'pin',
        data: ['原材料', '半成品', '成品'],
        textStyle: {
          color: '#77899c',
          rich: {
            uname: {
              width: 40,
              fontSize: 12,
              color: '#868FA4',
            },
            unum: {
              color: '#fff',
              width: 40,
              fontSize: 18,
              align: 'right',
            },
          },
        },
        formatter(name) {
          // 获取legend显示内容
          const data = dataList; // 你的数据
          // let total = 0;
          // let tarValue = 0;
          let value = 0;
          for (let i = 0, l = data.length; i < l; i++) {
            // total += data[i].value;
            if (data[i].name === name) {
              // tarValue = data[i].value;
              value = data[i].value ?? '';
            }
          }
          // const p = ((tarValue / total) * 100).toFixed(1);
          return `{uname|${name}}{unum|${value}}`;
        },
      },
      color: colorList,
      series: [
        {
          name: '总库存',
          type: 'pie',
          radius: [52, 70],
          center: ['30%', '50%'],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: 'transparent',
          },
          data: dataList,
        },
      ],
    };

    return option;
  }

  /**
   *条形图
   *
   * @returns
   * @memberof MyContentLeft
   */
  @Bind()
  getOptions() {
    const { inventoryIndex } = this.state;
    const nameData = [];
    const totalInventoryIndex = [];
    const inventoryHand = [];
    inventoryIndex.forEach((item) => {
      nameData.push(item.attribute1);
      totalInventoryIndex.push(Number(item.attribute11));
      inventoryHand.push(Number(item.attribute10));
    });
    const option = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter(params) {
          return (
            `${params[0].name}<br/>` +
            `<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>${
              params[0].seriesName
            } : ${Number(params[0].value.toFixed(2)).toLocaleString()} <br/>`
          );
        },
      },
      xAxis: {
        show: false,
        type: 'value',
      },
      yAxis: [
        {
          type: 'category',
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: nameData,
        },
        {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: '12',
            },
            formatter(value) {
              return value.toLocaleString();
            },
          },
          data: inventoryHand,
        },
      ],
      series: [
        {
          name: '库存指标现有量',
          type: 'bar',
          zlevel: 1,
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: 'rgb(57,89,255,1)',
                },
                {
                  offset: 1,
                  color: 'rgb(46,200,207,1)',
                },
              ]),
            },
          },
          barWidth: 10,
          data: inventoryHand,
        },
        {
          name: '背景',
          type: 'bar',
          barWidth: 10,
          barGap: '-100%',
          data: totalInventoryIndex,
          itemStyle: {
            normal: {
              color: 'rgba(24,31,68,1)',
              barBorderRadius: 30,
            },
          },
        },
      ],
    };
    return option;
  }

  render() {
    return (
      <React.Fragment>
        <div className={style['my-content-left-header']}>
          <div className={style['my-content-triangle']} />
          <span>订单统计</span>
        </div>
        <div className={style['my-content-left']}>
          <div className={style['my-content-left-title']}>库存分布</div>
          <div className={style['my-content-inventory-distribution']}>
            <ReactEcharts option={this.getOption()} style={{ height: '100%', width: '100%' }} />
          </div>
          <div className={style['my-content-left-title']}>库存指标</div>
          <div className={style['my-content-inventory-inventory-index']}>
            <ReactEcharts
              option={this.getOptions()}
              opts={{ renderer: 'canvas' }}
              style={{ height: '146px', width: '80%', margin: '0 auto' }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
