/**
 * @Description: 工时对比报表--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-06 10:04:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { Button, DataSet, Table, Form, Lov, DateTimePicker } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { ListDS, TaskDS } from '@/stores/timeCompareReportDS';
import './style.less';

const preCode = 'hg.timeCompareReport';

@formatterCollections({
  code: ['hg.timeCompareReport', 'hg.common'],
})
export default class TimeCompareReport extends Component {
  state = {
    saveLoading: false,
  };

  leftTableDS = new DataSet({
    ...ListDS(),
  });

  rightTableDS = new DataSet({
    ...TaskDS(),
  });

  get leftColumns() {
    return [
      { name: 'equipmentCode', width: 150 },
      { name: 'equipmentName', width: 150 },
      { name: 'startTime', width: 150 },
      { name: 'endTime', width: 150 },
      { name: 'workTime', width: 150 },
      { name: 'remark', editor: true, width: 150 },
    ];
  }

  get rightColumns() {
    return [
      { name: 'taskNum', width: 150 },
      { name: 'operation', width: 150 },
      { name: 'workerName', width: 150 },
      { name: 'actualStartTime', width: 150 },
      { name: 'actualEndTime', width: 150 },
      { name: 'taskHour', width: 150 },
      { name: 'remark', editor: true, width: 150 },
    ];
  }

  @Bind()
  handleReset() {
    this.leftTableDS.queryDataSet.current.reset();
  }

  @Bind()
  async handleSearch() {
    const validateValue = await this.leftTableDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await this.leftTableDS.query();

    const data = this.leftTableDS.queryDataSet.current.toJSONData();
    this.rightTableDS.queryParameter = {
      equipmentId: data.equipmentId,
      actualStartTime: data.startTime,
      actualEndTime: data.endTime,
    };
    await this.rightTableDS.query();
  }

  @Bind()
  async handleSave() {
    if (!this.leftTableDS.selected.length && !this.rightTableDS.selected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    this.setState({
      saveLoading: true,
    });
    try {
      let res;
      if (this.leftTableDS.selected.length) {
        res = await this.leftTableDS.submit(this.leftTableDS.selected);
      }
      if (this.rightTableDS.selected.length) {
        res = await this.rightTableDS.submit(this.rightTableDS.selected);
      }
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
    this.setState({
      saveLoading: false,
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.index`).d('工时对比报表')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleSave}
            loading={this.state.saveLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <Form dataSet={this.leftTableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="equipmentObj" noCache />
              <DateTimePicker name="startTime" />
              <DateTimePicker name="endTime" />
            </Form>
            <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <div className="hg-time-compare-table-warp">
            <Table
              dataSet={this.leftTableDS}
              columns={this.leftColumns}
              columnResizable="true"
              queryBar="none"
            />
            <Table dataSet={this.rightTableDS} columns={this.rightColumns} columnResizable="true" />
          </div>
        </Content>
      </Fragment>
    );
  }
}
