/*
 * @Description:员工工时统计报表
 * @Author: hongming。zhang@hand-china.com
 * @Date: 2020-12-21 12:53:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-18 11:01:45
 */

import React from 'react';
import { Table } from 'hzero-ui';

export default function HeaderTable(props) {
  const {
    // loading,
    columns = [],
    dataSource = [],
    pagination,
    handlePagination,
    tableScrollWidth,
    // rowSelection,
  } = props;
  return (
    <Table
      // loading={loading}
      rowKey="rowId"
      bordered
      scroll={{ x: tableScrollWidth(columns) }}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={handlePagination}
      rowClassName={(record) =>
        dataSource.find((list) => list.rowId === record.rowId) ? 'row-active' : 'row-noactive'
      }
      // onRow={(record) => {
      //   return {
      //     onClick: () => {
      //       rowSelection(record);
      //     },
      //   };
      // }}
    />
  );
}
