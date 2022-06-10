/*
 * @module-: 中间
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-24 10:41:46
 * @LastEditTime: 2020-10-23 16:10:40
 * @copyright: Copyright (c) 2018,Hand
 */
import { connect } from 'dva';
import React, { Component } from 'react';

import { Bind } from 'lodash-decorators';
import ReactEcharts from 'echarts-for-react';

import style from './index.less';

@connect(({ MoldMonitoringModel }) => ({
  MoldMonitoringModel,
}))
export default class MyContent extends Component {
  constructor(props) {
    super(props);
    this.echartsDOM = null;
    this.state = {
      stateProps: [],
      type: [],
      typeData: [],
      pieChart: [], // 饼图数据汇总
      echartsUsing: [],
      echartsUnUsed: [],
      echartsService: [], // 维修中
      echartsScrapped: [], // 已报废
      colorLists: ['#1890FF', '#6612C2', '#FFFF00', '#FF8C00', '#F04864', '#FE8463'], // 饼图颜色划s分
    };
  }

  shouldComponentUpdate(nextProps) {
    const typeAll = [];
    const pieChart = [];
    const echartsEveryUsing = [];
    const echartsEveryUnUsed = [];
    const echartsEveryService = [];
    const echartsEveryScrapped = [];
    if (nextProps.originalValue !== this.state.stateProps) {
      const { originalValue } = nextProps;
      const typeData = this.groupArray(originalValue); // 模具根据类型分类
      for (let i = 0; i < typeData.length; i++) {
        let echartsUsing = 0;
        let echartsUnUsed = 0;
        let echartsService = 0;
        let echartsScrapped = 0;
        typeAll.push(typeData[i].attribute7);
        pieChart.push({ name: typeData[i].attribute7, value: typeData[i].data.length });
        const dataList = typeData[i].data;
        for (let j = 0; j < dataList.length; j++) {
          if (dataList[j].attribute3 === '未使用') {
            echartsUnUsed += 1;
          } else if (dataList[j].attribute3 === '使用中') {
            echartsUsing += 1;
          } else if (dataList[j].attribute3 === '维修中') {
            echartsService += 1;
          } else if (dataList[j].attribute3 === '已报废') {
            echartsScrapped += 1;
          }
        }
        echartsEveryUsing.push(echartsUsing);
        echartsEveryUnUsed.push(echartsUnUsed);
        echartsEveryService.push(echartsService);
        echartsEveryScrapped.push(echartsScrapped);
      }
      // 默认颜色不足，追加随机颜色
      if (typeAll.length > this.state.colorLists.length) {
        const gap = typeAll.length - this.state.colorLists.length;
        const append = [];
        for (let h = 0; h < gap; h++) {
          const colors = Math.floor(Math.random() * 0xffffff);
          append.push(`#${colors.toString(16)}`);
        }
        const newColor = [...this.state.colorLists].concat(append);
        this.setState({ colorLists: newColor });
      }
      this.setState({
        pieChart,
        typeData,
        stateProps: originalValue,
        type: typeAll,
        echartsUsing: echartsEveryUsing,
        echartsUnUsed: echartsEveryUnUsed,
        echartsService: echartsEveryService,
        echartsScrapped: echartsEveryScrapped,
      });
      if (this.state.echartsDOM) {
        this.state.echartsDOM.style.width = '100%';
      }
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    // 解决echarts不能随着窗口缩放改变大小问题
    if (this.echartsDOM) {
      const doms = document.querySelector('#my-content-center-left');
      if (doms) {
        doms.style.width = '625px';
      }
    }
  }

  @Bind()
  groupArray(arr) {
    const map = {};
    const dest = [];
    for (let i = 0; i < arr.length; i++) {
      const ai = arr[i];
      if (!map[ai.attribute7]) {
        dest.push({
          attribute7: ai.attribute7,
          data: [ai],
        });
        map[ai.attribute7] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          const dj = dest[j];
          if (dj.attribute7 === ai.attribute7) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  }

  /**
   *左侧柱形图
   *
   * @returns
   * @memberof MyContent
   */
  @Bind()
  getOption() {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: ['待使用', '使用中', '维修中', '已报废'],
        left: 'right',
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
          data: this.state.type,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '待使用',
          type: 'bar',
          stack: 'type',
          data: this.state.echartsUnUsed,
          itemStyle: {
            normal: {
              color: '#1890FF',
            },
          },
        },
        {
          name: '使用中',
          type: 'bar',
          stack: 'type',
          data: this.state.echartsUsing,
          itemStyle: {
            normal: {
              color: '#BBD751',
            },
          },
        },
        {
          name: '维修中',
          type: 'bar',
          stack: 'type',
          data: this.state.echartsService,
          itemStyle: {
            normal: {
              color: '#FF8B5E',
            },
          },
        },
        {
          name: '已报废',
          type: 'bar',
          stack: 'type',
          data: this.state.echartsScrapped,
          itemStyle: {
            normal: {
              color: '#ccc',
            },
          },
        },
      ],
    };
    return option;
  }

  /**
   *右侧饼图
   *
   * @returns
   * @memberof MyContent
   */
  @Bind()
  getOptionRight() {
    const options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        bottom: 'bottom',
        icon: 'circle',
        data: this.state.type,
      },
      series: [
        {
          name: '模具占比情况',
          type: 'pie',
          top: 'top',
          radius: '55%',
          center: ['50%', '50%'],
          data: this.state.pieChart,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            normal: {
              color: (params) => {
                const colorList = this.state.colorLists;
                return colorList[params.dataIndex];
              },
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
              },
              labelLine: { show: true },
            },
          },
        },
      ],
    };

    return options;
  }

  /**
   *点击对应的图表
   *
   * @param {*} e
   * @memberof MyContent
   */
  @Bind()
  onChartClick(e) {
    const { dispatch } = this.props;
    const { typeData } = this.state;
    const dataList = typeData.filter((item) => item.attribute7 === e.name);
    dispatch({
      type: 'MoldMonitoringModel/updateMold',
      payload: {
        name: e.name,
        data: { ...dataList[0] },
      },
    });
  }

  render() {
    const onEvents = {
      click: this.onChartClick,
    };
    const { type } = this.state;
    return (
      <div className={style['my-content-center']}>
        <section className={style['my-content-center-left']} id="my-content-center-left">
          <header>
            <div>模具类型 ({type.length}种)</div>
            <span />
          </header>
          <div>
            <ReactEcharts
              option={this.getOption()}
              onEvents={onEvents}
              opts={{ renderer: 'canvas' }}
              ref={(refsDOM) => {
                this.echartsDOM = refsDOM;
              }}
            />
          </div>
        </section>
        <section className={style['my-content-center-right']}>
          <header>
            <div>模具占比情况</div>
            <span />
          </header>
          <div className={style['my-content-right-img']}>
            <ReactEcharts
              option={this.getOptionRight()}
              onEvents={onEvents}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </section>
      </div>
    );
  }
}
