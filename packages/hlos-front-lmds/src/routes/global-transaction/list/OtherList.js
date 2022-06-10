/**
 * @Description: 事务查询其他列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';

export default class OtherList extends PureComponent {

  get columns() {
    return [
      { name: 'organizationName', width: 150, lock: true },
      { name: 'transactionTime', width: 150, lock: true },
      { name: 'transactionTypeName', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'transactionQty', width: 150 },
      { name: 'transactionUom', width: 150 },
      { name: 'transactionId', width: 150 },
      { name: 'parentTransactionId', width: 150 },
      { name: 'referenceTransactionId', width: 150 },
      { name: 'inverseTransactionId', width: 150 },
      { name: 'eventRequestId', width: 150 },
      { name: 'accountDate', width: 150 },
      { name: 'transactionReasonCode', width: 150 },
      { name: 'remark', width: 150 },
      { name: 'syncFlagMeaning', width: 150 },
      { name: 'syncStatusMeaning', width: 150 },
      { name: 'syncGroup', width: 150 },
      { name: 'syncExternalId', width: 150 },
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
