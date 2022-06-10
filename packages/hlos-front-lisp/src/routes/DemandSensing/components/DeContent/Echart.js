import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Bind } from 'lodash-decorators';
// 表格连接 https://gallery.echartsjs.com/editor.html?c=xNiGiyW9pp

const normalColor = '#666666';

const borderData = [];
const legend = ['工单数量', '缺料数量', '库存差异', '工单齐套率'];
// const borderHeight = 4;
// xData.forEach(() => {
//   borderData.push(borderHeight);
// });
export default class Echart extends Component {
  @Bind
  getSeriesData() {
    const { data } = this.props;
    const seriesData = [];

    if (data && data.length) {
      const yData1 = [];
      const yData2 = [];
      const yData3 = [];
      const yData4 = [];
      data.forEach((d) => {
        if (yData1.length <= 7) {
          yData1.push(d.attribute1);
        }
        if (yData2.length <= 7) {
          yData2.push(d.attribute2);
        }
        if (yData3.length <= 7) {
          yData3.push(d.attribute3);
        }
        if (yData4.length <= 7) {
          yData4.push(Math.floor(Number(d.attribute4) * 100));
        }
      });
      const colorArr = ['#1F8CFB', '#56CDE6', '#F5A623', '#F96F68'];

      [yData1, yData2, yData3, yData4].forEach((item, index) => {
        let obj1 = {};
        let obj2 = {};
        if (index < 3) {
          obj1 = {
            name: legend[index],
            type: 'bar',
            stack: legend[index],
            data: item,
            barWidth: '15%',
            itemStyle: {
              normal: {
                color: colorArr[index],
              },
            },
          };
          obj2 = {
            name: '',
            type: 'bar',
            stack: legend[index],
            itemStyle: {
              normal: {
                color: colorArr[index],
              },
            },
            data: borderData,
          };
          seriesData.push(obj1);
          seriesData.push(obj2);
        } else {
          const obj3 = {
            name: legend[index],
            type: 'line',
            yAxisIndex: 1,
            smooth: false,
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              normal: {
                width: 2,
              },
            },
            itemStyle: {
              normal: {
                color: colorArr[index],
                borderColor: '#F96F68',
                borderWidth: 1,
              },
            },
            data: item,
            label: {
              normal: {
                show: false,
              },
            },
          };
          seriesData.push(obj3);
        }
      });

      return seriesData;
    }
  }

  @Bind
  getOption() {
    return {
      backgroundColor: '#FFFFFF',
      grid: {
        left: '3%',
        top: '16%',
        right: '3%',
        bottom: 0,
        containLabel: true,
      },
      legend: {
        show: true,
        icon: 'rect',
        itemWidth: 20,
        itemHeight: 3,
        right: '35%',
        top: '10%',
        textStyle: {
          color: normalColor,
        },
        data: legend,
      },
      tooltip: {
        // trigger: 'axis',
        // formatter(params) {
        //   console.log('params', params)
        //   let str = '';
        //   for (let i = 0; i < params.length; i++) {
        //     if (params[i].seriesName !== '') {
        //       // ${params[i].name}:
        //       str += `${params[i].seriesName}:${params[i].value}<br/>`;
        //     }
        //   }
        //   return str;
        // },
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: [
        {
          type: 'category',
          data: this.props.xData.reverse(),
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            textStyle: {
              color: normalColor,
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: normalColor,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '(单位:个)',
          nameTextStyle: {
            color: normalColor,
            fontSize: 12,
          },
          // "min": 0,
          // "max": 50,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: normalColor,
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: normalColor,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: normalColor,
            },
          },
        },
        {
          type: 'value',
          name: '(单位:百分比)',
          nameTextStyle: {
            color: normalColor,
            fontSize: 12,
          },
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: normalColor,
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: normalColor,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.2)',
            },
          },
        },
      ],
      series: this.getSeriesData(),
    };
  }

  render() {
    return (
      <ReactEcharts
        option={this.getOption()}
        // notMerge={true}
        // lazyUpdate={true}
        // theme={"theme_name"}
        // onChartReady={this.onChartReadyCallback}
        // onEvents={EventsDict}
        // opts={}
      />
    );
  }
}
