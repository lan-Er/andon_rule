/**
 * @Description: 加工完成率报表--index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-06 15:38:33
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { Button, DataSet, Table, Form, Lov, DatePicker, NumberField } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { getResponse } from 'utils/utils';
// import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { ListDS } from '@/stores/completionRateReportDS';

const preCode = 'hg.completionRateReport';

@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['hg.completionRateReport', 'hg.common'],
})
export default class CompletionRateReport extends Component {
  async componentDidMount() {
    const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (res.content[0]) {
        this.props.tableDS.queryDataSet.current.set(
          'organizationId',
          res.content[0].organizationId
        );
      }
    }
  }

  get columns() {
    return [
      { name: 'prodLineCode', width: 150 },
      { name: 'prodLineName', width: 150 },
      { name: 'qty', width: 150 },
      { name: 'completedQty', width: 150 },
      { name: 'incompletedQty', width: 150 },
      {
        name: 'rate',
        width: 150,
        renderer: ({ value }) => <span>{value * 100}%</span>,
      },
      { name: 'demandDateStart', width: 150 },
      { name: 'demandDateEnd', width: 150 },
    ];
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
    await this.props.tableDS.query();
  }

  @Bind()
  handleShowChart(type) {
    const { dispatch } = this.props;
    const {
      periodDay,
      demandDateStart,
      demandDateEnd,
      prodLineId,
      prodLineCode,
      prodLineName,
      organizationId,
    } = this.props.tableDS.queryDataSet.current.toJSONData();
    let params = {
      demandDateStart,
      demandDateEnd,
      organizationId,
    };
    if (type === 'single') {
      params = {
        ...params,
        prodLineObj: {
          prodLineId,
          prodLineCode,
          resourceName: prodLineName,
        },
        periodDay,
      };
    }
    dispatch(
      routerRedux.push({
        pathname: `/hg/completion-rate-report/chart/${type}`,
        state: params,
      })
    );
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.index`).d('加工完成率报表')} />
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <Form dataSet={this.props.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="prodLineObj" noCache />
              <NumberField name="periodDay" />
              <DatePicker name="demandDateStart" />
              <DatePicker name="demandDateEnd" />
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
          <div className="hg-completion-rate-charts-button" style={{ marginBottom: 16 }}>
            <Button onClick={() => this.handleShowChart('single')}>单课室图表</Button>
            <Button onClick={() => this.handleShowChart('all')}>全课室图表</Button>
          </div>
          <div className="hg-completion-rate-table-warp">
            <Table
              dataSet={this.props.tableDS}
              columns={this.columns}
              columnResizable="true"
              queryBar="none"
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}
