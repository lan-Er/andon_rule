/**
 * @Description: 检验不良率分析报表--Index
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
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/defectiveRateOfInspectionDS';

const preCode = 'hg.defectiveRateOfInspection';

@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS({ summaryType: 'day' }),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['hg.defectiveRateOfInspection', 'hg.common'],
})
export default class DefectiveRateOfInspection extends Component {
  state = {
    pickerType: 'date',
  };

  get columns() {
    return [
      { name: 'prodLineName', width: 150 },
      { name: 'partyName', width: 150 },
      { name: 'batchQty', width: 150 },
      { name: 'qcNgQty', width: 150 },
      {
        name: 'rate',
        width: 150,
        renderer: ({ value }) => this.rateRender(value),
      },
      { name: 'startDate', width: 150 },
      { name: 'endDate', width: 150 },
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
  handleShowChart() {
    const { dispatch } = this.props;
    const {
      startDate,
      endDate,
      prodLineId,
      prodLineName,
      partyId,
      partyName,
      summaryType,
    } = this.props.tableDS.queryDataSet.current.toJSONData();
    const params = {
      startDate,
      endDate,
      prodLineId,
      prodLineName,
      partyId,
      partyName,
      summaryType,
    };
    dispatch(
      routerRedux.push({
        pathname: `/hg/defective-rate-of-inspection/chart`,
        state: params,
      })
    );
  }

  // @Bind()
  // handleTypeChange(value) {
  //   const type = value? 'date': value;
  //   this.props.tableDS.queryDataSet.fields.get('startDate').set('type', type || 'date');
  //   this.props.tableDS.queryDataSet.fields.get('endDate').set('type', type || 'date');
  // }

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
      return [<WeekPicker name="startDate" />, <WeekPicker name="endDate" />];
    } else if (pickerType === 'month') {
      return [<MonthPicker name="startDate" />, <MonthPicker name="endDate" />];
    } else if (pickerType === 'year') {
      return [<YearPicker name="startDate" />, <YearPicker name="endDate" />];
    }
    return [<DatePicker name="startDate" />, <DatePicker name="endDate" />];
  }

  @Bind
  async handleSearch() {
    const validateValue = await this.props.tableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    const { prodLineId, partyId } = this.props.tableDS.queryDataSet.current.toJSONData();
    if (!prodLineId && !partyId) {
      notification.warning({
        message: '课室和供应商必须有一个查询条件不为空',
      });
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
        <Header title={intl.get(`${preCode}.view.title.index`).d('检验不良率分析报表')}>
          <Button onClick={this.handleShowChart}>时间维度图表</Button>
        </Header>
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
            <Form dataSet={this.props.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="prodLineObj" noCache />
              <Lov name="supplierObj" noCache />
              <Select name="summaryType" onChange={this.typeChange} />
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
