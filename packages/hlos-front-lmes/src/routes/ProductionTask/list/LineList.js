/**
 * @Description: 生产任务 - 行table
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'lmes.productionTask';

export default function LineList({
  tabType,
  lineTableRef,
  lineSize,
  lineTotalElements,
  lineLoading,
  lineTableHeight,
  currentLinePage,
  lineDataSource,
  onLinePageChange,
}) {
  let columns;

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
      title: intl.get(`${preCode}.maxQty`).d('最大数量'),
      dataIndex: 'maxQty',
      key: 'maxQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executableQty`).d('可执行数量'),
      dataIndex: 'executableQty',
      key: 'executableQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.suggestQty`).d('建议数量'),
      dataIndex: 'suggestQty',
      key: 'suggestQty',
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
      title: intl.get(`${preCode}.processNgQty`).d('不合格数量'),
      dataIndex: 'processNgQty',
      key: 'processNgQty',
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
      title: intl.get(`${preCode}.rawNgQty`).d('来料不合格'),
      dataIndex: 'rawNgQty',
      key: 'rawNgQty',
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
      title: intl.get(`${preCode}.pendingQty`).d('待处理数量'),
      dataIndex: 'pendingQty',
      key: 'pendingQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wipQty`).d('在制品数量'),
      dataIndex: 'wipQty',
      key: 'wipQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.warehouse`).d('仓库'),
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wmArea`).d('货位'),
      dataIndex: 'wmArea',
      key: 'wmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.usage`).d('单位用量'),
      dataIndex: 'itemUsage',
      key: 'itemUsage',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.bomUsage`).d('BOM用量'),
      dataIndex: 'bomUsage',
      key: 'bomUsage',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.supplyType`).d('供应类型'),
      dataIndex: 'supplyTypeMeaning',
      key: 'supplyTypeMeaning',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemControltype`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      key: 'itemControlTypeMeaning',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executeControlType`).d('限制类型'),
      dataIndex: 'executeControlTypeMeaning',
      key: 'executeControlTypeMeaning',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executeControlValue`).d('限制值'),
      dataIndex: 'executeControlValue',
      key: 'executeControlValue',
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

  const stepColumns = [
    {
      title: intl.get(`${preCode}.lineNum`).d('行号'),
      dataIndex: 'taskStepNum',
      key: 'taskStepNum',
      width: 70,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.step`).d('步骤'),
      dataIndex: 'taskStepCode',
      key: 'taskStepCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.stepName`).d('步骤名称'),
      dataIndex: 'taskStepName',
      key: 'taskStepName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.stepAlias`).d('步骤简称'),
      dataIndex: 'taskStepAlias',
      key: 'taskStepAlias',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.description`).d('描述'),
      dataIndex: 'description',
      key: 'description',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.stepType`).d('步骤类型'),
      dataIndex: 'taskStepTypeMeaning',
      key: 'taskStepTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.keyStepFlag`).d('关键步骤'),
      dataIndex: 'keyStepFlag',
      key: 'keyStepFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processRule`).d('处理规则'),
      dataIndex: 'processRule',
      key: 'processRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.collector`).d('数据收集'),
      dataIndex: 'collector',
      key: 'collector',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceType`).d('来源类型'),
      dataIndex: 'sourceTypeName',
      key: 'sourceTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceNum`).d('来源编号'),
      dataIndex: 'sourceNum',
      key: 'sourceNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      dataIndex: 'enabledFlag',
      key: 'enabledFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      key: 'externalId',
      width: 128,
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
      title: intl.get(`${preCode}.stepRemark`).d('备注'),
      dataIndex: 'stepRemark',
      key: 'stepRemark',
      width: 200,
      resizable: true,
    },
  ];

  if (tabType === 'item') {
    columns = itemColumns;
  } else if (tabType === 'step') {
    columns = stepColumns;
  }

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        data={lineDataSource}
        ref={lineTableRef}
        columns={columns}
        height={lineTableHeight}
        loading={lineLoading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={lineTotalElements}
        onChange={onLinePageChange}
        pageSize={lineSize}
        page={currentLinePage}
      />
    </Fragment>
  );
}
