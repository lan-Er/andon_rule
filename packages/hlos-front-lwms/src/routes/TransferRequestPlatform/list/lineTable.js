/*
 * @Description: 转移单平台行表
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-06 17:27:09
 * @LastEditors: leying.yan<leying.yan@hand-china.com>
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const intlPrefix = 'lwms.transferRequestPlatform.model';
const commonIntlPrefix = 'lwms.common.model';

const mainLineColumns = () => {
  const columns = [
    {
      title: intl.get(`${intlPrefix}.lineNum`).d('行号'),
      dataIndex: 'requestLineNum',
      width: 70,
      resizable: true,
      lock: 'left',
    },
    {
      title: intl.get(`${commonIntlPrefix}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      resizable: true,
      lock: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.uom`).d('单位'),
      dataIndex: 'uomName',
      width: 70,
      resizable: true, // (record) => record.status === 'add',
    },
    {
      title: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      dataIndex: 'applyQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
      dataIndex: 'availableQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
      dataIndex: 'onhandQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.lineStatus`).d('行状态'),
      dataIndex: 'requestLineStatus',
      width: 84,
      resizable: true,
      render: ({ rowData }) =>
        statusRender(rowData.requestLineStatus, rowData.requestLineStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      dataIndex: 'wmMoveTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
      dataIndex: 'warehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
      dataIndex: 'wmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.location`).d('发出地点'),
      dataIndex: 'locationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
      dataIndex: 'toWarehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
      dataIndex: 'toWmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toLocation`).d('目标地点'),
      dataIndex: 'toLocationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.viaWarehouse`).d('中转仓库'),
      dataIndex: 'viaWarehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.viaWMArea`).d('中转货位'),
      dataIndex: 'viaWmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.viaLocation`).d('中转地点'),
      dataIndex: 'viaLocationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.itemControlType`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
      dataIndex: 'applyPackQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
      dataIndex: 'applyWeight',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.secondUOM`).d('辅助单位'),
      dataIndex: 'secondUomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
      dataIndex: 'secondApplyQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocTypeName',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.lineRemark`).d('行备注'),
      dataIndex: 'lineRemark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.externalLineID`).d('外部行ID'),
      dataIndex: 'externalLineId',
      align: 'left',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.externalLineNum`).d('外部单据行号'),
      dataIndex: 'externalLineNum',
      width: 70,
      resizable: true,
      flexGrow: 1,
    },
  ];
  return columns;
};

const execLineColumns = () => {
  return [
    {
      title: intl.get(`${intlPrefix}.lineNum`).d('行号'),
      dataIndex: 'requestLineNum',
      width: 70,
      resizable: true,
      lock: 'left',
    },
    {
      title: intl.get(`${commonIntlPrefix}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      resizable: true,
      lock: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      dataIndex: 'applyQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.pickedFlag`).d('拣料标识'),
      dataIndex: 'pickedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.pickedQty`).d('拣料数量'),
      dataIndex: 'pickedQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.executedQty`).d('发出数量'),
      dataIndex: 'executedQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.confirmedQty`).d('接收数量'),
      dataIndex: 'confirmedQty',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.pickedWorker`).d('拣料员工'),
      dataIndex: 'pickedWorker',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
      dataIndex: 'pickRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
      dataIndex: 'reservationRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.fifoRuleName`).d('FIFO规则'),
      dataIndex: 'fifoRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.wmInspectRule`).d('仓库质检规则'),
      dataIndex: 'wmInspectRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonIntlPrefix}.lotNumber`).d('指定批次'),
      dataIndex: 'lotNumber',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.tag`).d('指定标签'),
      dataIndex: 'tagCode',
      width: 128,
      resizable: true,
      flexGrow: 1,
    },
  ];
};

export function LineTable(props) {
  const {
    type,
    lineDataSource,
    lineTableHeight,
    lineLoading,
    lineTotalElements,
    onPageChange,
    lineSize,
    currentLinePage,
  } = props;
  const columns = type === 'main' ? mainLineColumns() : execLineColumns();
  return (
    <Fragment>
      <PerformanceTable
        virtualized
        data={lineDataSource}
        height={lineTableHeight}
        columns={columns}
        loading={lineLoading}
      />
      <Pagination
        pageSizeOptions={['10', '100', '200', '500', '1000', '5000', '10000']}
        total={lineTotalElements}
        onChange={onPageChange}
        pageSize={lineSize}
        page={currentLinePage}
      />
    </Fragment>
  );
}
