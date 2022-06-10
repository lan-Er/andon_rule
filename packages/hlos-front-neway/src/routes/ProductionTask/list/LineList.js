/**
 * @Description: 生产任务 - 行table
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import intl from 'utils/intl';

const preCode = 'lmes.productionTask';

export default function LineList({
  lineTableRef,
  lineSize,
  lineTotalElements,
  lineLoading,
  lineTableHeight,
  currentLinePage,
  lineDataSource,
  onLinePageChange,
}) {
  const itemColumns = [
    {
      title: intl.get(`${preCode}.itemLineType`).d('类型'),
      dataIndex: 'itemLineTypeMeaning',
      key: 'itemLineTypeMeaning',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.taskQty`).d('任务数量'),
      dataIndex: 'taskQty',
      key: 'taskQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wipQty`).d('进站数量'),
      dataIndex: 'wipQty',
      key: 'wipQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.pendingQty`).d('出站数量'),
      dataIndex: 'pendingQty',
      key: 'pendingQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processOkQty`).d('合格数量'),
      dataIndex: 'processOkQty',
      key: 'processOkQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      dataIndex: 'scrappedQty',
      key: 'scrappedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      dataIndex: 'reworkQty',
      key: 'reworkQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.suggestQty`).d('已创建返修数量'),
      dataIndex: 'suggestQty',
      key: 'suggestQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executableQty`).d('返修合格数量'),
      dataIndex: 'executableQty',
      key: 'executableQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.priority`).d('优先级'),
      dataIndex: 'linePriority',
      key: 'linePriority',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lineRemark`).d('行备注'),
      dataIndex: 'lineRemark',
      key: 'lineRemark',
      width: 150,
      resizable: true,
    },
  ];

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        data={lineDataSource}
        ref={lineTableRef}
        columns={itemColumns}
        height={lineTableHeight}
        loading={lineLoading}
      />
      <Pagination
        pageSizeOptions={['10', '100', '200', '500', '1000', '5000', '10000']}
        total={lineTotalElements}
        onChange={onLinePageChange}
        pageSize={lineSize}
        page={currentLinePage}
      />
    </Fragment>
  );
}
