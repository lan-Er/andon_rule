/*
 * @module-: 数据大屏右侧
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-27 16:21:56
 * @LastEditTime: 2020-08-03 10:29:17
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { Modal } from 'choerodon-ui/pro';

import { Bind } from 'lodash-decorators';
import { queryList } from '@/services/api';

import style from './index.less';
import productCategory from '../../../assets/images/product-category.svg';
import numberOfSuppliers from '../../../assets/images/number-of-suppliers.svg';
import userNumber from '../../../assets/images/user-number.svg';
import DeliveryRate from '../../../MyDynamicModel/DeliveryRate/index';
import AmountOfUsers from '../../../MyDynamicModel/AmountOfUsers/index';

const modalKey = Modal.key();
const maskStyle = {
  background: 'rgb(0, 193, 255,.3)',
};
export default class MyContentRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliver: {},
      lineChart: [],
    };
  }

  componentDidMount() {
    queryList({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'BOARD-2',
      page: 0,
      size: 100,
    }).then((res) => {
      const { content } = res ?? { content: [] };
      if (content.length > 0) {
        this.setState({
          deliver: content[0],
        });
      }
    });
    queryList({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'BOARD-LINE',
      page: 0,
      size: 100,
    }).then((res) => {
      const { content } = res ?? { content: [] };
      this.setState({
        lineChart: content,
      });
    });
  }

  /**
   *添加分割符
   *
   * @memberof MyContentRight
   */
  @Bind()
  addSeparator(str) {
    const reverseStr = str.split('').reverse().join('');
    const arr = [];
    // 循环下标
    for (const i in reverseStr) {
      // 与3取模
      if (i % 3 === 0) {
        // 开始三三分割字符串并反转，推入数组
        arr.push(reverseStr.substr(i, 3).split('').reverse().join(''));
      }
    }
    // 返回 反转后三三加入逗号的字符串
    return arr.reverse().join(',');
  }

  /**
   *设置每一条线颜色
   *
   * @returns
   * @memberof MyContentRight
   */
  @Bind()
  getEveryLine(selfColor) {
    const everyOne = {
      name: '',
      type: 'line',
      data: [],
      symbolSize: 6,
      symbol: 'circle',
      smooth: true,
      lineStyle: {
        color: `${selfColor}`,
      },
      itemStyle: {
        normal: {
          color: `${selfColor}`,
          borderColor: `${selfColor}`,
        },
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#fe9a8bb3',
          },
          {
            offset: 1,
            color: '#fe9a8b03',
          },
        ]),
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0,
                color: `${selfColor}`,
              },
              {
                offset: 0.4,
                color: `${selfColor}`,
              },
              {
                offset: 0.5,
                color: '#fff',
              },
              {
                offset: 0.7,
                color: '#fff',
              },
              {
                offset: 0.8,
                color: '#fff',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ],
          },
          borderColor: `${selfColor}`,
          borderWidth: 2,
        },
      },
    };
    return everyOne;
  }

  /**
   *折线图
   *
   * @memberof MyContentRight
   */
  @Bind()
  getOption() {
    const { lineChart } = this.state;
    const colors = ['#fe9a8b', '#9E87FF', '#ef9602', '#19ff68'];
    const series = [];
    if (colors.length < lineChart.length) {
      const missingNumber = lineChart.length - colors.length;
      for (let i = 0; i < missingNumber; i++) {
        const dynamicColor = Math.floor(Math.random() * 0xfff).toString(16);
        colors.push(`#${dynamicColor}`);
      }
    }
    lineChart.forEach((item, index) => {
      const data = [
        item.attribute2,
        item.attribute3,
        item.attribute4,
        item.attribute5,
        item.attribute6,
        item.attribute7,
      ];
      const name = item.attribute1;
      const everyOneLine = this.getEveryLine(colors[index]);
      const every = { ...everyOneLine, name, data };
      series.push(every);
    });
    const option = {
      legend: {
        show: true,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 25,
        textStyle: {
          fontSize: 12, // 字体大小
          color: '#fff', // 字体颜色
        },
      },
      grid: {
        top: '10%',
        left: '1%',
        right: '6%',
        bottom: '2%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: [
        {
          type: 'category',
          data: ['8月', '9月', '10月', '11月', '12月', '1月'],
          axisLine: {
            lineStyle: {
              color: '#ddd',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#d1e6eb',
            },
            margin: 15,
          },
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#ddd',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#d1e6eb',
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series,
    };
    return option;
  }

  /**
   *打开累计交付
   *
   * @memberof MyContentRight
   */
  @Bind()
  handleOpenModal(titles, mask = true) {
    Modal.open({
      key: modalKey,
      title: `${titles}`,
      children: (
        <div>
          {titles === '累计交付' ? <DeliveryRate /> : null}
          {titles === '用户数' ? <AmountOfUsers /> : null}
        </div>
      ),
      maskStyle,
      closable: true,
      mask,
      style: {
        width: '80%',
        height: '90%',
        top: '6%',
      },
      footer: null,
      maskClassName: 'mask-class-name',
    });
  }

  render() {
    const { deliver } = this.state;
    return (
      <div className={style['my-content-right-list']}>
        <div className={style['my-content-left-header']}>
          <div className={style['my-content-triangle']} />
          <span>数据统计</span>
        </div>
        <div className={style['my-content-right-top']}>
          <div
            className={style['my-content-cumulative-delivery']}
            onClick={() => this.handleOpenModal('累计交付')}
          >
            <span>累计交付</span>
            <span>{deliver.attribute1 ? this.addSeparator(deliver.attribute1) : ''}</span>
          </div>
          <div className={style['data-statistics-list']}>
            <div>
              <img src={productCategory} alt="产品种类" />
              <div>产品种类</div>
              <span>{deliver.attribute2}</span>
            </div>
            <div>
              <img src={numberOfSuppliers} alt="供应商数" />
              <div>供应商数</div>
              <span>{deliver.attribute3}</span>
            </div>
            <div>
              <img
                src={userNumber}
                alt="用户数"
                onClick={() => this.handleOpenModal('用户数')}
                className={style['crossed-hand']}
              />
              <div>用户数</div>
              <span>{deliver.attribute4}</span>
            </div>
          </div>
        </div>
        <div className={style['my-content-left-header-two']}>
          <div className={style['my-content-triangle']} />
          <span>订单趋势</span>
        </div>
        <div className={style['my-content-right-bottom']}>
          <ReactEcharts option={this.getOption()} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    );
  }
}
