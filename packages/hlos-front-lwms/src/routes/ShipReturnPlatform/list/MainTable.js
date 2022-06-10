/**
 * @Description: 销售退货单平台 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 14:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination, CheckBox } from 'choerodon-ui/pro';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'lwms.shipReturnPlatform.model';

export default function MainTab({
  type,
  dataSource,
  currentPage,
  size,
  tableRef,
  tableHeight,
  loading,
  totalElements,
  checkValues,
  onCheckCell,
  onCheckAllChange,
  onPageChange,
  onRowClick,
  onDetail,
}) {
  const linkRender = ({ rowData }) => {
    return <a onClick={(e) => onDetail(e, true, rowData.shipReturnId)}>{rowData.shipReturnNum}</a>;
  };

  const customerRender = ({ rowData }) => {
    return `${rowData.customerName || rowData.partyName}`;
  };

  const mainColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'shipReturnId',
      key: 'shipReturnId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
      dataIndex: 'organizationCode',
      key: 'organizationCode',
      width: 128,
      fixed: true,
      resizable: true,
      render: ({ rowData }) =>
        `${rowData.organizationCode || ''} ${rowData.organizationName || ''}`,
    },
    {
      title: intl.get(`${preCode}.shipReturnNum`).d('退货单号'),
      dataIndex: 'shipReturnNum',
      key: 'shipReturnNum',
      width: 144,
      fixed: true,
      render: linkRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipReturnType`).d('退货单类型'),
      dataIndex: 'shipReturnTypeName',
      key: 'shipReturnTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipReturnStatus`).d('退货单状态'),
      dataIndex: 'shipReturnStatusMeaning',
      key: 'shipReturnStatusMeaning',
      width: 82,
      render: ({ rowData }) =>
        statusRender(rowData.shipReturnStatus, rowData.shipReturnStatusMeaning),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      render: customerRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerSite`).d('客户地点'),
      dataIndex: 'customerSiteName',
      key: 'customerSiteName',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.resourceType`).d('来源类型'),
      dataIndex: 'returnSourceTypeMeaning',
      key: 'returnSourceTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soNum`).d('销售订单号'),
      dataIndex: 'soNum',
      key: 'soNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
      dataIndex: 'soLineNum',
      key: 'soLineNum',
      width: 82,
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
      title: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      dataIndex: 'customerPoLine',
      key: 'customerPoLine',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.salesman`).d('销售员'),
      dataIndex: 'salesmanName',
      key: 'salesmanName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.freight`).d('运费'),
      dataIndex: 'freight',
      key: 'freight',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.currency`).d('币种'),
      dataIndex: 'currencyName',
      key: 'currencyName',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.carrier`).d('承运人'),
      dataIndex: 'carrier',
      key: 'carrier',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
      dataIndex: 'carrierContact',
      key: 'carrierContact',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.plateNum`).d('车牌号'),
      dataIndex: 'plateNum',
      key: 'plateNum',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipReturnGroup`).d('退货单组'),
      dataIndex: 'shipReturnGroup',
      key: 'shipReturnGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipToSite`).d('客户收货地点'),
      dataIndex: 'shipToSite',
      key: 'shipToSite',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerContact`).d('客户联系人'),
      dataIndex: 'customerContact',
      key: 'customerContact',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerAddress`).d('客户地址'),
      dataIndex: 'customerAddress',
      key: 'customerAddress',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      key: 'printedFlag',
      width: 82,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      key: 'printedDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creator`).d('制单人'),
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creationDate`).d('制单时间'),
      dataIndex: 'creationDate',
      key: 'creationDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.approvalRule`).d('审批策略'),
      dataIndex: 'approvalRule',
      key: 'approvalRule',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.approvalWorkflow`).d('审批工作流'),
      dataIndex: 'approvalWorkflow',
      key: 'approvalWorkflow',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocTypedataIndex',
      key: 'sourceDocTypedataIndex',
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
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      key: 'docProcessRule',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalId`).d('外部系统ID'),
      dataIndex: 'externalId',
      key: 'externalId',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      key: 'externalNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      resizable: true,
    },
  ];

  const receiveColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'shipReturnId',
      key: 'shipReturnId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
      dataIndex: 'organizationCode',
      key: 'organizationCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.shipReturnNum`).d('退货单号'),
      dataIndex: 'shipReturnNum',
      key: 'shipReturnNum',
      width: 144,
      fixed: true,
      render: linkRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOuCode',
      key: 'sopOuCode',
      width: 128,
      resizable: true,
      render: ({ rowData }) => `${rowData.sopOuCode || ''} ${rowData.sopOuName || ''}`,
    },
    {
      title: intl.get(`${preCode}.returnShipTicket`).d('发运单号'),
      dataIndex: 'returnShipTicket',
      key: 'returnShipTicket',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.returnShippedDate`).d('发运日期'),
      dataIndex: 'returnShippedDate',
      key: 'returnShippedDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达日期'),
      dataIndex: 'expectedArrivalDate',
      key: 'expectedArrivalDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      dataIndex: 'receiveWarehouseCode',
      key: 'receiveWarehouseCode',
      width: 128,
      resizable: true,
      render: ({ rowData }) =>
        `${rowData.receiveWarehouseCode || ''} ${rowData.receiveWarehouseName || ''}`,
    },
    {
      title: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      dataIndex: 'receiveWmAreaCode',
      key: 'receiveWmAreaCode',
      width: 128,
      resizable: true,
      render: ({ rowData }) =>
        `${rowData.receiveWmAreaCode || ''} ${rowData.receiveWmAreaName || ''}`,
    },
    {
      title: intl.get(`${preCode}.receiver`).d('收货员'),
      dataIndex: 'receiveWorkerName',
      key: 'receiveWorkerName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.actualArrivalTime `).d('接收时间'),
      dataIndex: 'actualArrivalTime',
      key: 'actualArrivalTime',
      width: 150,
      resizable: true,
    },
  ];

  let columns = mainColumns;

  if (type === 'receive') {
    columns = receiveColumns;
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
        onRowClick={onRowClick}
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
