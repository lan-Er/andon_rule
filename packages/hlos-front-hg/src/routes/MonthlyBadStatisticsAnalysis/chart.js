/**
 * @Description: 月度不良统计分析报表--Chart
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-13 13:44:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import {
  DataSet,
  Form,
  MonthPicker,
  WeekPicker,
  YearPicker,
  DatePicker,
  Button,
  Lov,
  Select,
} from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import echarts from 'echarts';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/monthlyBadStatisticsAnalysisDS';

const preCode = 'hg.monthlyBadStatisticsAnalysis';

@formatterCollections({
  code: ['hg.monthlyBadStatisticsAnalysis', 'hg.common'],
})
export default class Chart extends Component {
  tableDS = new DataSet({
    ...ListDS({ dateType: this.props.location.state.dateType }),
  });

  state = {
    pickerType: this.props.location.state.dateType,
  };

  componentDidMount() {
    const {
      location: { state = {} },
    } = this.props;
    const { judgedDateStart, judgedDateEnd, prodLineId, prodLineName, partyId, partyName } = state;
    this.tableDS.queryDataSet.create({
      judgedDateStart,
      judgedDateEnd,
      prodLineObj: {
        prodLineId,
        resourceName: prodLineName,
      },
      supplierObj: {
        partyId,
        partyName,
      },
    });
    this.handleSearch();
  }

  @Bind()
  dateFields() {
    const { pickerType } = this.state;
    if (pickerType === 'week') {
      return [
        <WeekPicker name="judgedDateStart" key="judgedDateStart" />,
        <WeekPicker name="judgedDateEnd" key="judgedDateEnd" />,
      ];
    } else if (pickerType === 'month') {
      return [
        <MonthPicker name="judgedDateStart" key="judgedDateStart" />,
        <MonthPicker name="judgedDateEnd" key="judgedDateEnd" />,
      ];
    } else if (pickerType === 'year') {
      return [
        <YearPicker name="judgedDateStart" key="judgedDateStart" />,
        <YearPicker name="judgedDateEnd" key="judgedDateEnd" />,
      ];
    }
    return [
      <DatePicker name="judgedDateStart" key="judgedDateStart" />,
      <DatePicker name="judgedDateEnd" key="judgedDateEnd" />,
    ];
  }

  @Bind()
  typeChange(value) {
    this.setState({
      pickerType: value,
    });
  }

  @Bind()
  async handleSearch() {
    const validateValue = await this.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }

    this.chart = echarts.init(document.getElementById('chart'));

    const xArr = [];
    const yArr = [];
    const yArr1 = [];
    const res = await this.tableDS.query();
    if (res && !res.failed && res.content) {
      res.content.forEach((item) => {
        xArr.push(item.exceptionName);
        yArr1.push(item.exceptionQty);
        yArr.push(item.rate * 100);
      });
    }
    const option = {
      grid: {
        containLabel: true,
      },
      // x轴
      xAxis: [
        {
          type: 'category',
          data: xArr,
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ccc',
              width: 1,
            },
          },
          axisLabel: {
            show: true,
            color: '#000',
          },
          axisLine: false,
        },
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              width: 1,
              type: 'dotted',
            },
          },
          axisLabel: {
            show: true,
            color: '#000',
            formatter: '{value}%',
          },
          axisLine: false,
        },
      ],
      series: [
        {
          name: '百分比',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            color: 'orange',
            width: 5,
          },
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{c}%',
              },
            },
          },
          data: yArr,
        },
        {
          name: '不良数量',
          type: 'bar',
          barCategoryGap: '0%', // 消除柱子之间的缝隙
          itemStyle: {
            normal: {
              color() {
                const r = Math.floor(Math.random() * 256); // 随机生成256以内r值
                const g = Math.floor(Math.random() * 256); // 随机生成256以内g值
                const b = Math.floor(Math.random() * 256); // 随机生成256以内b值
                return `rgb(${r},${g},${b})`; // 返回rgb(r,g,b)格式颜色
              },
              label: {
                show: true,
                position: 'top',
              },
            },
          },
          data: yArr1,
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    this.chart.setOption(option);
  }

  @Bind()
  handleReset() {
    this.tableDS.queryDataSet.current.reset();
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.index`).d('不良统计分析报表')}
          backPath="/hg/monthly-bad-statistics-analysis/list"
        />
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
            <Form dataSet={this.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              {this.dateFields()}
              <Select name="dateType" onChange={this.typeChange} />
              <Lov name="prodLineObj" noCache />
              <Lov name="supplierObj" noCache />
            </Form>
            <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', marginTop: 10 }}>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <div id="chart" style={{ width: '100%', height: 500, marginTop: 100 }} />
        </Content>
      </Fragment>
    );
  }
}
