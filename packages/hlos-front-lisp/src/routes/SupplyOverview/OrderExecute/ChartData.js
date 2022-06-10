/*
 * @Descripttion: 图表数据
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 20:19:31
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-06-26 13:44:01
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
    data: ['已确认', '已下达', '已完工', '已发运', '已接收'],
  },
  color: ['#1890FF', '#BBD751', '#FF8B5E', '#A172FC', '#FBDF59'],
  // '#64C7BC'
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
      name: '已确认',
      type: 'line',
      // stack: '总量',
      data: [0],
    },
    {
      name: '已下达',
      type: 'line',
      // stack: '总量',
      data: [0],
    },
    {
      name: '已完工',
      type: 'line',
      // stack: '总量',
      data: [0],
    },
    {
      name: '已发运',
      type: 'line',
      // stack: '总量',
      data: [0],
    },
    {
      name: '已接收',
      type: 'line',
      // stack: '总量',
      data: [0],
    },
  ],
};
export default ChartData;
