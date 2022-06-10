/**
 * @Description: 在制品管理 -tab
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-11
 * @LastEditors: leying.yan
 */

import React from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

const preCode = 'lmes.inProcessManagement.model';
const commonCode = 'lmes.common.model';

export default function ExecuteTable(props) {
  const { loading, tableScrollWidth, dataSource, pagination, handlePagination } = props;

  const columns = [
    {
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organizationCode',
      width: 150,
      fixed: 'left',
      render: (value, record) => {
        return `${value} ${record.organizationName}`;
      },
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.taskNum`).d('任务号'),
      dataIndex: 'taskNum',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.prodLine`).d('生产线'),
      dataIndex: 'prodLineName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.workcell`).d('工位'),
      dataIndex: 'workcellName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.equipment`).d('设备'),
      dataIndex: 'equipmentName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.workGroup`).d('班组'),
      dataIndex: 'workerGroupName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.worker`).d('操作工'),
      dataIndex: 'workerName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.locationName`).d('地点'),
      dataIndex: 'locationName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moveInTime`).d('移入时间'),
      dataIndex: 'moveInTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moveOutTime`).d('移出时间'),
      dataIndex: 'moveOutTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.processedTime`).d('实际加工时间'),
      dataIndex: 'processedTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
      dataIndex: 'inspectionDocNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inspectedResult`).d('判定结果'),
      dataIndex: 'inspectedResult',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.lastProcessedTime`).d('最近处理时间'),
      dataIndex: 'lastProcessedTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.lastEventId`).d('最近时间ID'),
      dataIndex: 'lastEventId',
      width: 150,
    },
  ];

  return (
    <Table
      loading={loading}
      rowKey="wipId"
      bordered
      scroll={{ x: tableScrollWidth(columns) }}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={handlePagination}
    />
  );
}
