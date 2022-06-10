/*
 * @module-: 今日需求
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-29 15:26:14
 * @LastEditTime: 2020-07-31 17:40:46
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { getSerialNum } from '@/utils/renderer';

import { todayDemand } from '@/stores/dataLargeScreenDeliveryRateDs';

export default class TodayDemand extends Component {
  ds = new DataSet(todayDemand(this.props.supplier));

  columns = () => {
    return [
      {
        header: '序号',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'attribute1',
      },
      {
        name: 'attribute2',
      },
      {
        name: 'attribute3',
        width: 150,
      },
      {
        name: 'attribute5',
        width: 150,
      },
      {
        name: 'attribute6',
        width: 150,
      },
      {
        name: 'attribute7',
      },
    ];
  };

  render() {
    return (
      <div>
        <Table
          dataSet={this.ds}
          columns={this.columns()}
          border={false}
          columnResizable="true"
          queryFieldsLimit={4}
        />
      </div>
    );
  }
}
