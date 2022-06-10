/**
 * @Description: 检验不良率分析报表--Chart
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
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/defectiveRateOfInspectionDS';

const preCode = 'hg.defectiveRateOfInspection';

@formatterCollections({
  code: ['hg.defectiveRateOfInspection', 'hg.common'],
})
export default class Chart extends Component {
  tableDS = new DataSet({
    ...ListDS({ summaryType: this.props.location.state.summaryType }),
  });

  state = {
    pickerType: this.props.location.state.summaryType,
  };

  componentDidMount() {
    const {
      location: { state = {} },
    } = this.props;
    const { startDate, endDate, prodLineId, prodLineName, partyId, partyName, summaryType } = state;
    this.tableDS.queryDataSet.create({
      startDate,
      endDate,
      summaryType,
      prodLineObj: {
        prodLineId,
        resourceName: prodLineName,
      },
      supplierObj: {
        partyId,
        partyName,
      },
    });
    if (prodLineId || partyId) {
      this.handleSearch();
    }
  }

  @Bind()
  async handleSearch(isBtn) {
    const validateValue = await this.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (isBtn) {
      const { prodLineId, partyId } = this.tableDS.queryDataSet.current.toJSONData();
      if (!prodLineId && !partyId) {
        notification.warning({
          message: '课室和供应商必须有一个查询条件不为空',
        });
        return;
      }
    }

    this.chart = echarts.init(document.getElementById('chart'));

    const xArr = [];
    const yArr = [];
    const res = await this.tableDS.query();
    const { summaryType } = this.tableDS.queryDataSet.current.toJSONData();
    if (res && !res.failed && res.content) {
      res.content.forEach((item) => {
        if (summaryType === 'week') {
          xArr.push(`第${item.x}周`);
        } else if (summaryType === 'month') {
          xArr.push(`${item.x}月`);
        } else if (summaryType === 'year') {
          xArr.push(`${item.x}年`);
        } else {
          xArr.push(item.x);
        }
        yArr.push(item.rate * 100);
      });
    }
    const { prodLineName } = this.tableDS.queryDataSet.current.toJSONData();
    const option = {
      title: {
        text: prodLineName ? `（${prodLineName}）检验不良率图表` : '检验不良率图表',
        left: 'center',
      },
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
  typeChange(value) {
    this.setState({
      pickerType: value,
    });
  }

  @Bind()
  dateFields() {
    const { pickerType } = this.state;
    if (pickerType === 'week') {
      return [
        <WeekPicker name="startDate" key="startDate" />,
        <WeekPicker name="endDate" key="endDate" />,
      ];
    } else if (pickerType === 'month') {
      return [
        <MonthPicker name="startDate" key="startDate" />,
        <MonthPicker name="endDate" key="endDate" />,
      ];
    } else if (pickerType === 'year') {
      return [
        <YearPicker name="startDate" key="startDate" />,
        <YearPicker name="endDate" key="endDate" />,
      ];
    }
    return [
      <DatePicker name="startDate" key="startDate" />,
      <DatePicker name="endDate" key="endDate" />,
    ];
  }

  @Bind()
  handleReset() {
    this.tableDS.queryDataSet.current.reset();
  }

  render() {
    return (
      <Fragment key="DefectiveRateOfInspection">
        <Header
          title={intl.get(`${preCode}.view.title.index`).d('检验不良率分析报表')}
          backPath="/hg/defective-rate-of-inspection/list"
        />
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
            <Form dataSet={this.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="prodLineObj" noCache />
              <Lov name="supplierObj" noCache />
              <Select name="summaryType" onChange={this.typeChange} />
              {this.dateFields()}
            </Form>
            <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', marginTop: 10 }}>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleSearch(true)}>
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
