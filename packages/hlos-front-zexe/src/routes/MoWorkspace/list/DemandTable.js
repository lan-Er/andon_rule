/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Table } from 'hzero-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';

const preCode = 'zexe.moWorkspace.model';
const commonCode = 'zexe.common.model';

export default function DemandTable(props) {
  const {
    loading,
    tableScrollWidth,
    dataSource,
    pagination,
    handlePagination,
    linkRenderer,
    rowSelection,
  } = props;

  const columns = [
    {
      title: intl.get(`${commonCode}.supplier`).d('供应商编码'),
      dataIndex: 'supplierNumber',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
      dataIndex: 'supplierName',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organization',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 150,
      render: linkRenderer,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 150,
      fixed: 'left',
    },
    { title: intl.get(`${preCode}.demandQty`).d('需求数量'), dataIndex: 'demandQty', width: 150 },
    { title: intl.get(`${preCode}.demandDate`).d('需求日期'), dataIndex: 'demandDate', width: 150 },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.customerSite`).d('客户地点'),
      dataIndex: 'customerSiteName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.soNum`).d('销售订单号'),
      dataIndex: 'soNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
      dataIndex: 'soLineNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单'),
      dataIndex: 'demandNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.customerItem`).d('客户物料'),
      dataIndex: 'customerItemCode',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
      dataIndex: 'customerItemDesc',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.customerPo`).d('客户PO'),
      dataIndex: 'customerPo',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      dataIndex: 'customerPoLine',
      width: 150,
    },
  ];

  return (
    <Table
      loading={loading}
      rowKey="moId"
      bordered
      scroll={{ x: tableScrollWidth(columns) }}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={handlePagination}
      rowSelection={isEmpty(dataSource) ? null : rowSelection}
    />
  );
}
