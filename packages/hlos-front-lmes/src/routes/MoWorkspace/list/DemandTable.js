/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination, CheckBox } from 'choerodon-ui/pro';
import intl from 'utils/intl';
// import styles from './style.less';

const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

export default function DemandTable(props) {
  const {
    loading,
    // tableScrollWidth,
    dataSource,
    // handlePagination,
    linkRenderer,
    // rowSelection,
    tableRef,
    currentPage,
    size,
    tableHeight,
    totalElements,
    handlePageChange,
    checkValues,
    onCheckCell,
    onCheckAllChange,
  } = props;

  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'moId',
      key: 'moId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organization',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 144,
      render: linkRenderer,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求时间'),
      dataIndex: 'demandDate',
      width: 140,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerSite`).d('客户地点'),
      dataIndex: 'customerSiteName',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soNum`).d('销售订单号'),
      dataIndex: 'soNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
      dataIndex: 'soLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单'),
      dataIndex: 'demandNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandRank`).d('需求等级'),
      dataIndex: 'demandRank',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerItem`).d('客户物料'),
      dataIndex: 'customerItemCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
      dataIndex: 'customerItemDesc',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerPo`).d('客户PO'),
      dataIndex: 'customerPo',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      dataIndex: 'customerPoLine',
      width: 70,
      resizable: true,
    },
  ];

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="moId"
        data={dataSource}
        ref={tableRef}
        columns={columns}
        height={tableHeight}
        loading={loading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={totalElements}
        onChange={handlePageChange}
        pageSize={size}
        page={currentPage}
      />
    </Fragment>
    // <Table
    //   className={styles['lmes-mo-workspace-table']}
    //   loading={loading}
    //   rowKey="moId"
    //   bordered
    //   scroll={{ x: tableScrollWidth(columns) }}
    //   columns={columns}
    //   dataSource={dataSource}
    //   pagination={pagination}
    //   onChange={handlePagination}
    //   rowSelection={isEmpty(dataSource) ? null : rowSelection}
    // />
  );
}
