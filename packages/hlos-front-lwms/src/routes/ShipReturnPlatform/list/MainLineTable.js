/**
 * @Description: 销售退货单平台 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 14:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'lwms.shipReturnPlatform.model';

export default function MainTab({
  type,
  size,
  currentPage,
  loading,
  totalElements,
  dataSource,
  tableRef,
  tableHeight,
  onPageChange,
}) {
  const mainLineColumns = [
    {
      title: intl.get(`${preCode}.lineNum`).d('行号'),
      dataIndex: 'returnLineNum',
      key: 'returnLineNum',
      width: 82,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.so`).d('销售订单'),
      dataIndex: 'soNum',
      key: 'soNum',
      width: 144,
      fixed: true,
      render: ({ rowData }) => `${rowData.soNum || ''}-${rowData.soLineNum || ''}`,
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
      title: intl.get(`${preCode}.applyQty`).d('制单数量'),
      dataIndex: 'applyQty',
      key: 'applyQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.receivedQty`).d('接收数量'),
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: 82,
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
      title: intl.get(`${preCode}.lineStatus`).d('行状态'),
      dataIndex: 'returnLineStatusMeaning',
      key: 'returnLineStatusMeaning',
      width: 84,
      render: ({ rowData }) =>
        statusRender(rowData.returnLineStatus, rowData.returnLineStatusMeaning),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      key: 'demandNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipOrderNum`).d('发货单号'),
      dataIndex: 'shipOrderNum',
      key: 'shipOrderNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipOrderLineNum`).d('发货单行号'),
      dataIndex: 'shipOrderLineNum',
      key: 'shipOrderLineNum',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerPo`).d('客户PO'),
      dataIndex: 'customerPo',
      key: 'customerPo',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipReturnRule`).d('退货规则'),
      dataIndex: 'shipReturnRule',
      key: 'shipReturnRule',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      key: 'itemControlTypeMeaning',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.returnReason`).d('退货原因'),
      dataIndex: 'returnReasonName',
      key: 'returnReasonName',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocTypeName',
      key: 'sourceDocTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
      dataIndex: 'sourceDocNum',
      key: 'sourceDocNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      key: 'sourceDocLineNum',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalNum`).d('外部系统号'),
      dataIndex: 'externalNum',
      key: 'externalNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalLineNum`).d('外部系统行号'),
      dataIndex: 'externalLineNum',
      key: 'externalLineNum',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      dataIndex: 'lineRemark',
      key: 'lineRemark',
      width: 200,
      resizable: true,
    },
  ];

  const receiveLineColumns = [
    {
      title: intl.get(`${preCode}.lineNum`).d('行号'),
      dataIndex: 'returnLineNum',
      key: 'returnLineNum',
      width: 82,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.so`).d('销售订单'),
      dataIndex: 'soNum',
      key: 'soNum',
      width: 144,
      fixed: true,
      render: ({ rowData }) => `${rowData.soNum || ''}-${rowData.soLineNum || ''}`,
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
      title: intl.get(`${preCode}.applyQty`).d('制单数量'),
      dataIndex: 'applyQty',
      key: 'applyQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.receivedQty`).d('接收数量'),
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      dataIndex: 'receiveWarehouseCode',
      key: 'receiveWarehouseCode',
      width: 128,
      render: ({ rowData }) =>
        `${rowData.receiveWarehouseCode || ''} ${rowData.receiveWarehouseName || ''}`,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      dataIndex: 'receiveWmAreaCode',
      key: 'receiveWmAreaCode',
      width: 128,
      render: ({ rowData }) =>
        `${rowData.receiveWmAreaCode || ''} ${rowData.receiveWmAreaName || ''}`,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
      dataIndex: 'qcDocNum',
      key: 'qcDocNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      dataIndex: 'qcOkQty',
      key: 'qcOkQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      dataIndex: 'qcNgQty',
      key: 'qcNgQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.receiver`).d('收货员'),
      dataIndex: 'receiveWorkerName',
      key: 'receiveWorkerName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
      dataIndex: 'actualArrivalTime',
      key: 'actualArrivalTime',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lot`).d('指定批次'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tag`).d('指定标签'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingQty`).d('包装数'),
      dataIndex: 'packingQty',
      key: 'packingQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.containerQty`).d('装箱数'),
      dataIndex: 'containerQty',
      key: 'containerQty',
      width: 82,
      resizable: true,
    },
  ];

  let columns = mainLineColumns;

  if (type === 'receive') {
    columns = receiveLineColumns;
  }

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="shipReturnId"
        data={dataSource}
        ref={tableRef}
        columns={columns}
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
