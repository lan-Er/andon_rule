/*
 * @Description: 领料单平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-08 16:24:13
 * @LastEditors: Please set LastEditors
 */

import React, { Fragment } from 'react';
import intl from 'utils/intl';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import { statusRender } from 'hlos-front/lib/utils/renderer';

const intlPrefix = 'lwms.issueRequestPlatform';

// 主要tab页
const mainLineColumns = () => [
  {
    title: intl.get(`${intlPrefix}.lineNum`).d('行号'),
    dataIndex: 'requestLineNum',
    width: 70,
    sortType: 'asc',
    editor: false,
    fixed: 'left',
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.item`).d('物料'),
    dataIndex: 'itemCode',
    width: 128,
    editor: false,
    fixed: 'left',
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.itemDesc`).d('物料描述'),
    dataIndex: 'itemDescription',
    width: 200,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.uom`).d('单位'),
    dataIndex: 'uomName',
    width: 70,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
    dataIndex: 'applyQty',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.lineStatus`).d('行状态'),
    dataIndex: 'requestLineStatusMeaning',
    width: 84,
    editor: false,
    align: 'center',
    resizable: true,
    // TODO: add style depending on current state
    render: ({ rowData }) =>
      statusRender(rowData.requestLineStatus, rowData.requestLineStatusMeaning),
  },
  {
    title: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
    dataIndex: 'warehouseName',
    render: ({ rowData }) => {
      return `${rowData.warehouseCode || ''} ${rowData.warehouseName || ''}`;
    },
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
    dataIndex: 'wmAreaName',
    render: ({ rowData }) => {
      return `${rowData.wmAreaCode || ''} ${rowData.wmAreaName || ''}`;
    },
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.workcell`).d('发出工位'),
    dataIndex: 'workcellName',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.location`).d('发出地点'),
    name: 'locationName',
    width: 136,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.toWarehouse`).d('接收仓库'),
    dataIndex: 'toWarehouseName',
    render: ({ rowData }) => {
      return `${rowData.toWarehouseCode || ''} ${rowData.toWarehouseName || ''}`;
    },
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.toWMArea`).d('接收货位'),
    dataIndex: 'toWmAreaName',
    render: ({ rowData }) => {
      return `${rowData.toWmAreaCode || ''} ${rowData.toWmAreaName || ''}`;
    },
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.toWorkcell`).d('接收工位'),
    dataIndex: 'toWorkcellName',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.toLocation`).d('接收地点'),
    name: 'toLocationName',
    width: 136,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
    dataIndex: 'wmMoveTypeName',
    width: 100,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
    dataIndex: 'costCenterName',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
    dataIndex: 'projectNum',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.itemControlType`).d('物料控制类型'),
    dataIndex: 'itemControlType',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
    dataIndex: 'applyPackQty',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
    dataIndex: 'applyWeight',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.secondUOM`).d('辅助单位'),
    dataIndex: 'secondUomName',
    width: 70,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
    dataIndex: 'secondApplyQty',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.specifySupplier`).d('指定供应商'),
    dataIndex: 'partyName',
    width: 200,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
    dataIndex: 'sourceDocTypeName',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
    dataIndex: 'sourceDocNum',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源单据行号'),
    dataIndex: 'sourceDocLineNum',
    width: 70,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
    dataIndex: 'lineRemark',
    width: 200,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.externalID`).d('外部ID'),
    dataIndex: 'externalId',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.externalNum`).d('外部单据号'),
    dataIndex: 'externalNum',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.externalID`).d('外部行ID'),
    dataIndex: 'externalLineId',
    width: 70,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.externalNum`).d('外部单据行号'),
    dataIndex: 'externalLineNum',
    width: 70,
    editor: false,
    resizable: true,
  },
];

// 执行tab页
const execLineColumns = () => [
  {
    title: intl.get(`${intlPrefix}.lineNum`).d('行号'),
    dataIndex: 'requestLineNum',
    width: 70,
    sortType: 'asc',
    editor: false,
    fixed: 'left',
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.item`).d('物料'),
    dataIndex: 'itemCode',
    width: 128,
    editor: false,
    fixed: 'left',
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.pickedFlag`).d('拣料标识'),
    dataIndex: 'pickedFlag',
    width: 70,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.pickedQty`).d('拣料数量'),
    dataIndex: 'pickedQty',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.executedQty`).d('发出数量'),
    dataIndex: 'executedQty',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.confirmedQty`).d('接收数量'),
    dataIndex: 'confirmedQty',
    width: 82,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.pickedWorker`).d('拣料员工'),
    dataIndex: 'pickedWorker',
    width: 100,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
    dataIndex: 'pickRule',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
    dataIndex: 'reservationRule',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.fifoRule`).d('FIFO规则'),
    dataIndex: 'fifoRule',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.wmInspectRule`).d('仓库检验规则'),
    dataIndex: 'wmInspectRule',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    dataIndex: 'lotNumber',
    width: 128,
    editor: false,
    resizable: true,
  },
  {
    title: intl.get(`${intlPrefix}.tag`).d('指定标签'),
    dataIndex: 'tagCode',
    width: 128,
    editor: false,
    resizable: true,
    flexGrow: 1,
  },
];

export function MainLineTable(props) {
  const {
    dataSource,
    tableHeight,
    loading,
    totalElements,
    size,
    currentPage,
    onPageChange,
  } = props;
  return (
    // <Table dataSet={dataSet} columns={mainLineColumns()} columnResizable="true" border={false} />
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="requestLineId"
        data={dataSource}
        columns={mainLineColumns()}
        height={tableHeight}
        loading={loading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={totalElements}
        onChange={onPageChange}
        pageSize={size}
        page={currentPage}
      />
    </Fragment>
  );
}

export function ExecLineTable(props) {
  const {
    dataSource,
    tableHeight,
    loading,
    totalElements,
    size,
    currentPage,
    onPageChange,
  } = props;
  return (
    // <Table dataSet={dataSet} columns={execLineColumns()} columnResizable="true" border={false} />
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="requestLineId"
        data={dataSource}
        columns={execLineColumns()}
        height={tableHeight}
        loading={loading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={totalElements}
        onChange={onPageChange}
        pageSize={size}
        page={currentPage}
      />
    </Fragment>
  );
}
