/**
 * @Description: 事务查询主要列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';

export default class MainList extends PureComponent {

  get columns() {
    return [
      { name: 'organizationName', width: 150, lock: true },
      { name: 'transactionTime', width: 150, lock: true },
      { name: 'transactionTypeName', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'transactionQty', width: 150 },
      { name: 'transactionUom', width: 150 },
      { name: 'featureCode', width: 150 },
      { name: 'description', width: 150 },
      { name: 'warehouseName', width: 150 },
      { name: 'wmAreaName', width: 150 },
      { name: 'wmUnitCode', width: 150 },
      { name: 'transactionDate', width: 150 },
      { name: 'documentTypeName', width: 150 },
      { name: 'documentNum', width: 150 },
      { name: 'documentLineNum', width: 150 },
      { name: 'sourceDocTypeName', width: 150 },
      { name: 'sourceDocNum', width: 150 },
      { name: 'sourceDocLineNum', width: 150 },
      { name: 'lotNumber', width: 150 },
      { name: 'tagCode', width: 150 },
      { name: 'partyTypeMeaning', width: 150 },
      { name: 'partyName', width: 150 },
      { name: 'partySiteName', width: 150 },
      { name: 'locationName', width: 150 },
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
