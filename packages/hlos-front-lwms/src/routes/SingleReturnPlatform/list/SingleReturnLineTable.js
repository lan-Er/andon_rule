/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-11 18:23:54
 * @LastEditTime: 2020-10-05 11:15:02
 * @Description:
 */
import React, { Fragment } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const intlPrefix = 'lwms.singleReturnPlatform.model';

const mainLineColumns = () => {
  const columns = [
    {
      title: intl.get(`${intlPrefix}.requestLineNum`).d('No.'),
      dataIndex: 'requestLineNum',
      key: 'requestLineNum',
      width: 100,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.itemCode`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 150,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.uomName`).d('单位'),
      dataIndex: 'uomName',
      key: 'uomName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyQty`).d('退料数量'),
      dataIndex: 'applyQty',
      key: 'applyQty',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestLineStatus`).d('行状态'),
      dataIndex: 'requestLineStatusMeaning',
      key: 'requestLineStatusMeaning',
      width: 150,
      render: ({ rowData }) =>
        statusRender(rowData.requestLineStatus, rowData.requestLineStatusMeaning),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.warehouse`).d('来源仓库'),
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.wmArea`).d('来源货位'),
      dataIndex: 'wmArea',
      key: 'wmArea',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.workcellName`).d('来源工位'),
      dataIndex: 'workcellName',
      key: 'workcellName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.locationName`).d('来源地点'),
      dataIndex: 'locationName',
      key: 'locationName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
      dataIndex: 'toWarehouse',
      key: 'toWarehouse',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouse`).d('目标货位'),
      dataIndex: 'toWmArea',
      key: 'toWmArea',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWorkcell`).d('目标工位'),
      dataIndex: 'toWorkcellName',
      key: 'toWorkcellName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toLocation`).d('目标地点'),
      dataIndex: 'toLocation',
      key: 'toLocation',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.itemControlTypeMeaning`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      key: 'itemControlTypeMeaning',
      width: 150,
      resizable: true,
      flexGrow: true,
    },
  ];
  return columns;
};

const execLineColumns = () => {
  const columns = [
    {
      title: intl.get(`${intlPrefix}.requestLineNum`).d('No.'),
      dataIndex: 'requestLineNum',
      key: 'requestLineNum',
      width: 100,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.itemCode`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 150,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyQty`).d('退料数量'),
      dataIndex: 'applyQty',
      key: 'applyQty',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.tagCode`).d('指定标签'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnedWorker`).d('退料员工'),
      dataIndex: 'returnedWorkerName',
      key: 'returnedWorkerName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnedTime`).d('退料时间'),
      dataIndex: 'returnedTime',
      key: 'returnedTime',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.pickedFlag`).d('拣料标识'),
      dataIndex: 'pickedFlag',
      key: 'pickedFlag',
      width: 150,
      render: yesOrNoRender,
      resizable: true,
      flexGrow: true,
    },
  ];
  return columns;
};

const SingleReturnLineTable = ({
  type,
  dataSource,
  tableRef,
  tableHeight,
  loading,
  totalElements,
  size,
  currentPage,
  onPageChange,
}) => {
  const columns = type === 'main' ? mainLineColumns() : execLineColumns();
  return (
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="requestLineId"
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
};

export default SingleReturnLineTable;
