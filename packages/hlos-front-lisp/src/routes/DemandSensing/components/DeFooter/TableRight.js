import React, { Component } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import withProps from 'utils/withProps';
import { ListDS } from './TableRightDS';

@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS({ summaryType: 'day' }),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class TableRight extends Component {
  get columns() {
    return [
      { name: 'moNumber', width: 140, align: 'center' },
      { name: 'makeQty', width: 90, align: 'center', tooltip: 'overflow' },
      { name: 'unCheckQty', width: 100, align: 'center', tooltip: 'overflow' },
      { name: 'ngQty', width: 70, align: 'center', tooltip: 'overflow' },
    ];
  }

  render() {
    return (
      <React.Fragment>
        <Table
          dataSet={this.props.tableDS}
          columns={this.columns}
          columnResizable="false"
          selectionMode="click"
          queryBar="none"
        />
      </React.Fragment>
    );
  }
}
