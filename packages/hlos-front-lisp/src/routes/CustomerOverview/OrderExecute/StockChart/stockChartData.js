/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-26 17:12:53
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-06-26 23:28:38
 */
const chartData = {
  xAxis: {
    type: 'category',
    // data: ['原材料', '半成品', '在制品', '成品', '在途', '不合格品'],
    axisLine: {
      lineStyle: {
        type: 'solid',
        color: '#666666',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        type: 'solid',
        color: '#666666',
      },
    },
  },
  series: [
    {
      data: [0, 0, 0, 0, 0, 0],
      type: 'bar',
      barWidth: 20, // 柱图宽度
      color: '#2AC5A9',
      itemStyle: {
        // 上方显示数值
        normal: {
          label: {
            show: true, // 开启显示
            position: 'top', // 在上方显示
            textStyle: {
              // 数值样式
              color: '#666',
              fontSize: 12,
            },
          },
        },
      },
    },
  ],
};
export default chartData;
