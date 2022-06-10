/**
 * @Description: 月度不良统计分析报表--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-20 09:44:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import {
  Table,
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
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/monthlyBadStatisticsAnalysisDS';

const preCode = 'hg.monthlyBadStatisticsAnalysis';

@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS({ dateType: 'day' }),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['hg.monthlyBadStatisticsAnalysis', 'hg.common'],
})
export default class MonthlyBadStatisticsAnalysis extends Component {
  state = {
    pickerType: 'date',
  };

  get columns() {
    return [
      { name: 'judgedDateStart', width: 150 },
      { name: 'judgedDateEnd', width: 150 },
      { name: 'exceptionName', width: 150 },
      { name: 'exceptionQty', width: 150 },
      { name: 'totalQty', width: 150 },
      {
        name: 'rate',
        width: 150,
        renderer: ({ value }) => this.rateRender(value),
      },
      { name: 'prodLineName', width: 150 },
      { name: 'partyName', width: 150 },
    ];
  }

  @Bind()
  rateRender(val) {
    if (val === 0) {
      return <span>0%</span>;
    } else if (val) {
      return <span>{(Number(val) * 100).toFixed(2)}%</span>;
    }
    return '';
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
      return [<WeekPicker name="judgedDateStart" />, <WeekPicker name="judgedDateEnd" />];
    } else if (pickerType === 'day') {
      return [<DatePicker name="judgedDateStart" />, <DatePicker name="judgedDateEnd" />];
    } else if (pickerType === 'year') {
      return [<YearPicker name="judgedDateStart" />, <YearPicker name="judgedDateEnd" />];
    }
    return [<MonthPicker name="judgedDateStart" />, <MonthPicker name="judgedDateEnd" />];
  }

  @Bind()
  handleShowChart() {
    const { dispatch } = this.props;
    const {
      judgedDateStart,
      judgedDateEnd,
      prodLineId,
      prodLineName,
      partyId,
      partyName,
    } = this.props.tableDS.queryDataSet.current.toJSONData();
    const params = {
      judgedDateStart,
      judgedDateEnd,
      prodLineId,
      prodLineName,
      partyId,
      partyName,
    };
    dispatch(
      routerRedux.push({
        pathname: `/hg/monthly-bad-statistics-analysis/chart`,
        state: params,
      })
    );
  }

  @Bind
  async handleSearch() {
    const validateValue = await this.props.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await this.props.tableDS.query();
  }

  @Bind()
  handleReset() {
    this.props.tableDS.queryDataSet.current.reset();
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.index`).d('不良统计分析报表')}>
          <Button onClick={this.handleShowChart}>不良统计分析柏拉图</Button>
        </Header>
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
            <Form dataSet={this.props.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="prodLineObj" noCache />
              <Lov name="supplierObj" noCache />
              <Select name="dateType" onChange={this.typeChange} />
              {this.dateFields()}
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
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            columnResizable="true"
            queryBar="none"
          />
        </Content>
      </Fragment>
    );
  }
}
