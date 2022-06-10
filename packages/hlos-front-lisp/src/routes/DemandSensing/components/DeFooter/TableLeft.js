import React, { Component } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import withProps from 'utils/withProps';
import { ListDS } from './TableLeftDS';

@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS(),
    });

    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class TableLeft extends Component {
  get columns() {
    return [
      { name: 'poNumber', width: 140, align: 'center' },
      { name: 'demandQty', width: 90, align: 'center', tooltip: 'overflow' },
      { name: 'subQty', width: 90, align: 'center', tooltip: 'overflow' },
      { name: 'zaiTuQty', width: 70, align: 'center', tooltip: 'overflow' },
      { name: 'unReciveQty', width: 100, align: 'center', tooltip: 'overflow' },
      { name: 'replyDate', width: 140, align: 'center', tooltip: 'overflow' },
    ];
  }

  render() {
    return (
      <React.Fragment>
        <Table
          dataSet={this.props.tableDS}
          columns={this.columns}
          columnResizable={false}
          selectedHighLightRow={false}
          queryBar="none"
          selectionMode="none"
          onRow={({ record }) => {
            return {
              onClick: () => {
                const { poId } = record.data;
                if (this.props.leftTableSelect) {
                  this.props.leftTableSelect(poId);
                }
              },
            };
          }}
        />
      </React.Fragment>
    );
  }
}
