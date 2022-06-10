/**
 * @Description: 试模合格率报表--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-13 13:44:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { Button, DataSet, Table, Form, DatePicker, Lov } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/moldTestPassRateReportDS';

const preCode = 'hg.moldTestPassRateReport';

@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS({ chartType: 'year' }),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['hg.moldTestPassRateReport', 'hg.common'],
})
export default class MoldTestPassRateReport extends Component {
  get columns() {
    return [
      { name: 'worker', width: 150 },
      { name: 'equipment', width: 150 },
      { name: 'sampleQty', width: 150 },
      { name: 'qcOkQty', width: 150 },
      {
        name: 'rate',
        width: 150,
        renderer: ({ value }) => this.rateRender(value),
      },
      { name: 'judgedDate', width: 150 },
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
  handleReset() {
    this.props.tableDS.queryDataSet.current.reset();
  }

  @Bind()
  async handleSearch() {
    const validateValue = await this.props.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    this.props.tableDS.queryParameter = {
      summaryType: 'DAY',
    };
    await this.props.tableDS.query();
  }

  @Bind()
  handleShowChart(type) {
    const { dispatch } = this.props;
    const {
      judgedDateStart,
      judgedDateEnd,
      workerId,
      workerName,
      equipmentId,
      equipmentName,
    } = this.props.tableDS.queryDataSet.current.toJSONData();
    const params = {
      judgedDateStart,
      judgedDateEnd,
      workerId,
      workerName,
      equipmentId,
      equipmentName,
    };
    dispatch(
      routerRedux.push({
        pathname: `/hg/mold-test-pass-rate-report/chart/${type}`,
        state: params,
      })
    );
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.index`).d('试模合格率报表')} />
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <Form dataSet={this.props.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <DatePicker name="judgedDateStart" />
              <DatePicker name="judgedDateEnd" />
              <Lov name="workerObj" noCache />
              <Lov name="equipmentObj" noCache />
            </Form>
            <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Button onClick={() => this.handleShowChart('week')}>周度图表</Button>
            <Button onClick={() => this.handleShowChart('month')}>月度图表</Button>
            <Button onClick={() => this.handleShowChart('year')}>年度图表</Button>
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
