/*
 * @module-: 今日退料
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-29 15:41:24
 * @LastEditTime: 2020-07-31 17:39:32
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { getSerialNum } from '@/utils/renderer';

import { returnToday } from '@/stores/dataLargeScreenDeliveryRateDs';

export default class ReturnToday extends Component {
  constructor(props) {
    super(props);
    this.ds = new DataSet(returnToday(this.props.supplier));
  }

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
        name: 'attribute4',
        width: 150,
      },
      {
        name: 'attribute6',
      },
      {
        name: 'attribute7',
      },
      {
        name: 'attribute8',
        width: 150,
      },
      {
        name: 'attribute9',
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
