/**
 * @Description: 试模合格率报表--Chart
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-13 13:44:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { DataSet, Form, DatePicker, Button, Lov } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import echarts from 'echarts';
import moment from 'moment';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/moldTestPassRateReportDS';

const preCode = 'hg.moldTestPassRateReport';

@formatterCollections({
  code: ['hg.moldTestPassRateReport', 'hg.common'],
})
export default class Chart extends Component {
  tableDS = new DataSet({
    ...ListDS({ chartType: this.props.match.params.chartType }),
  });

  get title() {
    const { match } = this.props;
    const { chartType } = match.params;
    if (chartType === 'month') {
      return intl.get(`${preCode}.view.title.month`).d('月度报表');
    } else if (chartType === 'year') {
      return intl.get(`${preCode}.view.title.year`).d('年度报表');
    }
    return intl.get(`${preCode}.view.title.week`).d('周度报表');
  }

  componentDidMount() {
    const {
      location: { state = {} },
      match,
    } = this.props;
    const {
      judgedDateStart,
      judgedDateEnd,
      workerId,
      workerName,
      equipmentId,
      equipmentName,
    } = state;
    const { chartType } = match.params;
    this.tableDS.queryDataSet.create({
      judgedDateStart,
      judgedDateEnd,
      workerObj: {
        workerId,
        workerName,
      },
      equipmentObj: {
        equipmentId,
        equipmentName,
      },
    });
    this.handleSearch(chartType);
  }

  @Bind()
  async handleSearch(chartType = 'year') {
    const validateValue = await this.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }

    this.chart = echarts.init(document.getElementById('chart'));
    const rateArr = [];

    const { judgedDateStart, judgedDateEnd } = this.tableDS.queryDataSet.current.toJSONData();
    let axisData = [];
    if (chartType === 'week') {
      const fromDayOfWeek =
        new Date(judgedDateStart).getDay() === 0 ? 6 : new Date(judgedDateStart).getDay() - 1;
      const toDayOfWeek =
        new Date(judgedDateEnd).getDay() === 0 ? 6 : new Date(judgedDateEnd).getDay() - 1;
      const fromWeekStartDate = moment(judgedDateStart).add(-fromDayOfWeek, 'days');
      const fromWeekEndDate = moment(judgedDateStart).add(6 - fromDayOfWeek, 'days');
      const toWeekEndDate = moment(judgedDateEnd).add(6 - toDayOfWeek, 'days');
      const between =
        Math.floor(
          (new Date(toWeekEndDate).getTime() - new Date(fromWeekEndDate).getTime()) /
            1000 /
            60 /
            60 /
            24 /
            7
        ) + 1;
      axisData = [
        `${moment(fromWeekStartDate).format('MMDD')}-${moment(fromWeekEndDate).format('MMDD')}`,
      ];
      for (let i = 1; i < between; i++) {
        const start = moment(fromWeekStartDate).add(i, 'weeks');
        axisData.push(`${start.format('MMDD')}-${start.add(6, 'days').format('MMDD')}`);
      }
    } else if (chartType === 'month') {
      const fromMonth = new Date(judgedDateStart).getMonth() + 1;
      const toMonth = new Date(judgedDateEnd).getMonth() + 1;
      const between = toMonth - fromMonth + 1;
      for (let i = 0; i < between; i++) {
        axisData.push(`${fromMonth + i}月`);
      }
    } else if (chartType === 'year') {
      const fromYear = new Date(judgedDateStart).getFullYear();
      const toyear = new Date(judgedDateEnd).getFullYear();
      const between = toyear - fromYear + 1;
      for (let i = 0; i < between; i++) {
        axisData.push(`${fromYear + i}年`);
      }
    }
    this.tableDS.queryParameter = {
      summaryType: chartType.toLocaleUpperCase(),
    };
    const res = await this.tableDS.query();
    if (res && !res.failed && res.content) {
      res.content.forEach((item) => {
        rateArr.push(item.rate * 100);
      });
    }

    const option = {
      title: {
        text: '试模合格率图表',
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: axisData,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter(val) {
            return `${val}%`;
          },
        },
      },
      series: [
        {
          data: rateArr,
          type: 'line',
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{c}%',
              },
            },
          },
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
    const { match } = this.props;
    const { chartType } = match.params;
    return (
      <Fragment>
        <Header title={this.title} backPath="/hg/mold-test-pass-rate-report/list" />
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <Form dataSet={this.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <DatePicker name="judgedDateStart" />
              <DatePicker name="judgedDateEnd" />
              <Lov name="workerObj" noCache />
              <Lov name="equipmentObj" noCache />
            </Form>
            <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleSearch(chartType)}>
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
