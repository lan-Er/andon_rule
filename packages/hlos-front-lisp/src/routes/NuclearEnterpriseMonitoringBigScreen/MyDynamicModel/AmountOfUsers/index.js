/*
 * @module-: 用户数
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-29 16:08:13
 * @LastEditTime: 2020-07-29 16:15:08
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { getSerialNum } from '@/utils/renderer';

import { userNumber } from '@/stores/dataLargeScreenDeliveryRateDs';

export default class AmountOfUsers extends Component {
  ds = new DataSet(userNumber());

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
        name: 'attribute4',
        width: 150,
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
