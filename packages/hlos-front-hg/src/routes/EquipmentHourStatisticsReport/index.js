/**
 * @Description: 设备工时统计报表--index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-10 09:52:33
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { ListDS } from '@/stores/equipmentHourStatisticsReportDS';

const preCode = 'hg.equipmentHourStatistics';

@formatterCollections({
  code: ['hg.equipmentHourStatisticsReport', 'hg.common'],
})
export default class EquipmentHourStatisticsReport extends Component {
  tableDS = new DataSet({
    ...ListDS(),
  });

  get columns() {
    return [
      { name: 'prodLineName', width: 150 },
      { name: 'equipmentCode', width: 150 },
      { name: 'equipmentName', width: 150 },
      { name: 'morningWorkTime', width: 150 },
      { name: 'eveningWorkTime', width: 150 },
      { name: 'workDate', width: 150 },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.index`).d('设备工时统计报表')} />
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
