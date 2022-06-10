/**
 * @Description: 加工完成率报表--chart
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-06 15:38:33
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import echarts from 'echarts';
import moment from 'moment';
import { Button, DataSet, Form, Lov, DatePicker, NumberField } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/completionRateReportDS';
import './style.less';

const preCode = 'hg.completionRateReport';

@formatterCollections({
  code: ['hg.completionRateReport', 'hg.common'],
})
export default class Chart extends Component {
  state = {
    // dateArr: [],
  };

  tableDS = new DataSet({
    ...ListDS(),
  });

  componentDidMount() {
    const {
      location: { state = {} },
      match,
    } = this.props;
    const { prodLineObj, periodDay, demandDateStart, demandDateEnd, organizationId } = state;
    const { chartType } = match.params;
    this.tableDS.queryDataSet.create({
      prodLineObj,
      periodDay,
      demandDateStart,
      demandDateEnd,
      organizationId,
    });
    if (chartType === 'all') {
      this.tableDS.queryDataSet.fields.get('prodLineObj').set('multiple', true);
      this.tableDS.queryDataSet.fields.get('periodDay').set('required', false);
    }
    this.handleSearch(chartType);
  }

  @Bind()
  handleReset() {
    this.tableDS.queryDataSet.current.reset();
  }

  @Bind()
  async handleSearch(chartType) {
    const validateValue = await this.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }

    this.chart = echarts.init(document.getElementById('chart'));
    let option = {};
    const {
      periodDay,
      demandDateStart,
      demandDateEnd,
      prodLineName,
    } = this.tableDS.queryDataSet.current.toJSONData();
    const dateStart = moment(demandDateStart).format('MMDD');
    const dateEnd = moment(demandDateEnd).format('MMDD');
    if (chartType === 'single') {
      const _dateArr = [];
      let arrDateEnd = moment(demandDateStart).add(periodDay - 1, 'days');
      const dif = Math.ceil(
        (new Date(demandDateEnd).getTime() - new Date(demandDateStart).getTime()) /
          1000 /
          60 /
          60 /
          24
      );
      const num = Math.ceil(dif / periodDay);
      if (dif / periodDay === 1) {
        _dateArr.push(`${dateStart}-${arrDateEnd.format('MMDD')}`, dateEnd);
      } else if (dif / periodDay < 1) {
        _dateArr.push(`${dateStart}-${dateEnd}`);
      } else if (periodDay !== 1) {
        _dateArr.push(`${dateStart}-${arrDateEnd.format('MMDD')}`);
        for (let i = 1; i < num; i++) {
          if (moment(arrDateEnd).add(1 + periodDay, 'days') < moment(demandDateEnd)) {
            const start = moment(arrDateEnd).add(1, 'days');
            if (start === moment(demandDateEnd)) {
              _dateArr.push(`${start.format('MMDD')}`);
              arrDateEnd = demandDateEnd;
            } else {
              _dateArr.push(
                `${start.format('MMDD')}-${moment(arrDateEnd)
                  .add(periodDay, 'days')
                  .format('MMDD')}`
              );
              arrDateEnd = moment(arrDateEnd).add(periodDay, 'days');
            }
          } else {
            _dateArr.push(
              `${moment(arrDateEnd).add(1, 'days').format('MMDD')}-${moment(demandDateEnd).format(
                'MMDD'
              )}`
            );
            arrDateEnd = demandDateEnd;
          }
        }
      } else {
        _dateArr.push(dateStart);
        for (let i = 0; i < num; i++) {
          _dateArr.push(
            moment(demandDateStart)
              .add(periodDay + i, 'days')
              .format('MMDD')
          );
        }
      }

      const res = await this.tableDS.query();
      const rateArr = [];
      if (getResponse(res) && !res.failed && res.content) {
        res.content.forEach((item) => {
          rateArr.push(item.rate * 100);
        });
      }
      option = {
        title: {
          text: `${prodLineName} ${dateStart}-${dateEnd}完成率`,
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: _dateArr,
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
    } else {
      const res = await this.tableDS.query();
      const xArr = [];
      const yArr = [];
      if (getResponse(res) && !res.failed && res.content) {
        res.content.forEach((item) => {
          xArr.push(item.prodLineName);
          yArr.push(item.rate * 100);
        });
      }
      option = {
        title: {
          text: `${dateStart}-${dateEnd}完成率`,
          left: 'center',
        },
        color: ['#28c828'],
        xAxis: {
          type: 'category',
          data: xArr,
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
            data: yArr,
            type: 'bar',
            barWidth: 50,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}%',
                },
              },
            },
          },
        ],
      };
    }

    // 使用刚指定的配置项和数据显示图表。
    this.chart.setOption(option);
  }

  render() {
    const { match } = this.props;
    const { chartType } = match.params;
    return (
      <Fragment>
        <Header
          title={
            chartType === 'all'
              ? intl.get(`${preCode}.view.title.allChart`).d('全课室图表')
              : intl.get(`${preCode}.view.title.singleChart`).d('单课室图表')
          }
          backPath="/hg/completion-rate-report/list"
        />
        <Content className="hg-completion-rate-chart">
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <Form dataSet={this.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="prodLineObj" noCache />
              {chartType === 'single' && <NumberField name="periodDay" />}
              <DatePicker name="demandDateStart" />
              <DatePicker name="demandDateEnd" />
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
