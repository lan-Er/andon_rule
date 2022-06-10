/*
 * @Descripttion: 图表数据
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 20:19:31
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-06-24 21:24:04
 */
const ChartData = {
  title: {
    // text: '折线图堆叠',
  },
  tooltip: {
    trigger: 'axis',
  },
  // legend: {
  //   // icon: "line",
  //   data: ['订单确认', '计划下达', '生产完工', '发货客户', '客户退货'],
  // },
  legend: {
    icon: 'line',
    // data: ['订单确认', '计划下达', '生产完工', '发货客户', '客户退货'],
    data: ['订单确认', '计划下达', '生产完工', '发货客户', '客户接收', '客户退货'],
  },
  color: ['#1890FF', '#BBD751', '#FF8B5E', '#A172FC', '#FBDF59', '#64C7BC'],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      // saveAsImage: {}
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '订单确认',
      type: 'line',
      // stack: '总量',
      data: [120, 100, 101, 134, 90, 200, 200],
    },
    {
      name: '计划下达',
      type: 'line',
      // stack: '总量',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '生产完工',
      type: 'line',
      // stack: '总量',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: '发货客户',
      type: 'line',
      // stack: '总量',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: '客户接收',
      type: 'line',
      // stack: '总量',
      data: [800, 932, 901, 934, 1290, 1330, 1320],
    },
    {
      name: '客户退货',
      type: 'line',
      // stack: '总量',
      data: [800, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};
export default ChartData;
