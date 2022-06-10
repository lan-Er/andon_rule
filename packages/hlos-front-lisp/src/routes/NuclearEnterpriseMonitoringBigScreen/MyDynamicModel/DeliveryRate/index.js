/*
 * @module-: 交付率
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-29 14:36:19
 * @LastEditTime: 2020-07-29 15:11:39
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { getSerialNum } from '@/utils/renderer';

import { deliveryRate } from '@/stores/dataLargeScreenDeliveryRateDs';

export default class DeliveryRate extends Component {
  ds = new DataSet(deliveryRate());

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
