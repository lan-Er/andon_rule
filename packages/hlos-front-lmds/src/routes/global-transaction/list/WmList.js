/**
 * @Description: 事务查询仓储列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';

export default class WmList extends PureComponent {

  get columns() {
    return [
      { name: 'organizationName', width: 150, lock: true },
      { name: 'transactionTime', width: 150, lock: true },
      { name: 'transactionTypeName', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'transactionQty', width: 150 },
      { name: 'transactionUom', width: 150 },
      { name: 'warehouseName', width: 150 },
      { name: 'wmAreaName', width: 150 },
      { name: 'wmUnitCode', width: 150 },
      { name: 'toWarehouseName', width: 150 },
      { name: 'toWmAreaName', width: 150 },
      { name: 'toWmUnitCode', width: 150 },
      { name: 'toOrganizationName', width: 150 },
      { name: 'moveTypeName', width: 150 },
      { name: 'finCostCode', width: 150 },
      { name: 'toItemCode', width: 150 },
      { name: 'toItemDescription', width: 150 },
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
