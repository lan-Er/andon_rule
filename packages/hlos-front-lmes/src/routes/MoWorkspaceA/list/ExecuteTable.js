/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Table } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

export default function ExecuteTable(props) {
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
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organization',
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 144,
      render: linkRenderer,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
      dataIndex: 'moExecuteList[0].itemControlType',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.meArea`).d('车间'),
      dataIndex: 'moExecuteList[0].meArea',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.prodLine`).d('生产线'),
      dataIndex: 'moExecuteList[0].prodLineName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.equipment`).d('设备'),
      dataIndex: 'moExecuteList[0].equipmentName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.workGroup`).d('班组'),
      dataIndex: 'moExecuteList[0].workerGroupName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.worker`).d('操作工'),
      dataIndex: 'moExecuteList[0].workerName',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.calendarDay`).d('指定日期'),
      dataIndex: 'moExecuteList[0].calendarDay',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.calendarShiftCode`).d('指定班次'),
      dataIndex: 'moExecuteList[0].calendarShiftCode',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.executeStatus`).d('执行状态'),
      dataIndex: 'moExecuteList[0].executeStatusMeaning',
      width: 84,
      render: (value, record) => statusRender(record.moExecuteList[0]?.executeStatus, value),
    },
    {
      title: intl.get(`${preCode}.completedQty`).d('完工数量'),
      dataIndex: 'moExecuteList[0].completedQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      dataIndex: 'moExecuteList[0].inventoryQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      dataIndex: 'moExecuteList[0].scrappedQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.processNgQty`).d('不合格数量'),
      dataIndex: 'moExecuteList[0].processNgQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      dataIndex: 'moExecuteList[0].reworkQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.inputQty`).d('投入数量'),
      dataIndex: 'moExecuteList[0].inputQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      dataIndex: 'moExecuteList[0].pendingQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.wipQty`).d('在制数量'),
      dataIndex: 'moExecuteList[0].wipQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.accumulativeRate`).d('累计加工百分比'),
      dataIndex: 'moExecuteList[0].accumulativeRate',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      dataIndex: 'moExecuteList[0].standardWorkTime',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
      dataIndex: 'moExecuteList[0].completeControlTypeMeaning',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.completeControlValue`).d('完工限制值'),
      dataIndex: 'moExecuteList[0].completeControlValue',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
      dataIndex: 'moExecuteList[0].actualStartTime',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
      dataIndex: 'moExecuteList[0].actualEndTime',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.processedTime`).d('加工工时'),
      dataIndex: 'moExecuteList[0].processedTime',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.completeWarehouse`).d('完工仓库'),
      dataIndex: 'moExecuteList[0].completeWarehouse',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.completeWmArea`).d('完工货位'),
      dataIndex: 'moExecuteList[0].completeWmArea',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      dataIndex: 'moExecuteList[0].inventoryWarehouse',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      dataIndex: 'moExecuteList[0].inventoryWmArea',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.executeRule`).d('执行规则'),
      dataIndex: 'moExecuteList[0].executeRuleName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      dataIndex: 'moExecuteList[0].inspectionRuleName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      dataIndex: 'moExecuteList[0].dispatchRuleName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('包装规则'),
      dataIndex: 'moExecuteList[0].packingRuleName',
      width: 128,
    },
    { title: intl.get(`${preCode}.reworkRule`).d('返修规则'), dataIndex: 'reworkRule', width: 128 },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'moExecuteList[0].printedFlag',
      width: 70,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.executePriority`).d('生产优先级'),
      dataIndex: 'moExecuteList[0].executePriority',
      width: 70,
    },
    {
      title: intl.get(`${preCode}.executeRemark`).d('执行备注'),
      dataIndex: 'moExecuteList[0].executeRemark',
      width: 200,
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
