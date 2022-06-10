/**
 * @Description: 事务查询生产列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';

export default class ProductList extends PureComponent {

  get columns() {
    return [
      { name: 'organizationName', width: 150, lock: true },
      { name: 'transactionTime', width: 150, lock: true },
      { name: 'transactionTypeName', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'transactionQty', width: 150 },
      { name: 'transactionUom', width: 150 },
      { name: 'operation', width: 150 },
      { name: 'workerName', width: 150 },
      { name: 'workerGroupName', width: 150 },
      { name: 'prodLineName', width: 150 },
      { name: 'workcellName', width: 150 },
      { name: 'equipmentName', width: 150 },
      { name: 'cutterName', width: 150 },
      { name: 'dieName', width: 150 },
      { name: 'processedTime', width: 150 },
      { name: 'calendarDay', width: 150 },
      { name: 'calendarShiftCode', width: 150 },
    ];
  }

  render() {
    return (
      <Fragment>
        <Table
          dataSet={this.props.tableDS}
          columns={this.columns}
          columnResizable="true"
          editMode="inline"
        />
      </Fragment>
    );
  }
}
