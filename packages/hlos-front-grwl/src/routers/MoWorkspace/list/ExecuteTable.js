/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination, CheckBox } from 'choerodon-ui/pro';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';
// import styles from './style.less';

const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

export default function ExecuteTable(props) {
  const {
    loading,
    // tableScrollWidth,
    dataExecuteSource,
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
          checked={checkValues.length > 0 && checkValues.length === dataExecuteSource.length}
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
      title: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.meOu`).d('制造工厂'),
      dataIndex: 'meOu',
      width: 126,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.meArea`).d('车间'),
      dataIndex: 'meArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.prodLine`).d('生产线'),
      dataIndex: 'prodLineName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executeStatus`).d('执行状态'),
      dataIndex: 'executeStatusMeaning',
      width: 90,
      // render: (value, record) => statusRender(record.moExecuteList[0]?.executeStatus, value),
      render: ({ rowData, dataIndex }) => statusRender(rowData.executeStatus, rowData[dataIndex]),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.makeQty`).d('制造数量'),
      dataIndex: 'makeQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.completedQty`).d('完工数量'),
      dataIndex: 'completedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      dataIndex: 'inventoryQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      dataIndex: 'scrappedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      dataIndex: 'ngQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      dataIndex: 'reworkQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      dataIndex: 'pendingQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wipQty`).d('在制数量'),
      dataIndex: 'wipQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.accumulativeRate`).d('累计加工百分比'),
      dataIndex: 'accumulativeRate',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      dataIndex: 'standardWorkTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
      dataIndex: 'actualStartTime',
      width: 140,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
      dataIndex: 'actualEndTime',
      width: 140,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processedTime`).d('实际加工时间'),
      dataIndex: 'processedTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.transactionTime`).d('已传输事务时间'),
      dataIndex: 'transactionTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
      dataIndex: 'completeControlTypeMeaning',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.completeControlValue`).d('完工限制值'),
      dataIndex: 'completeControlValue',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inputQty`).d('关键投入'),
      dataIndex: 'inputQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.issuedSuit`).d('投料套数'),
      dataIndex: 'issuedSuit',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.maxIssuedQty`).d('最大投入'),
      dataIndex: 'maxIssuedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planSupplyQty`).d('计划供应数量'),
      dataIndex: 'planSupplyQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.suppliedQty`).d('已供应数量'),
      dataIndex: 'suppliedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executePriority`).d('生产优先级'),
      dataIndex: 'executePriority',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.issuedFlag`).d('投料标识'),
      dataIndex: 'issuedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.workcell`).d('工位'),
      dataIndex: 'workcellName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.equipment`).d('设备'),
      dataIndex: 'equipmentName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.location`).d('地点'),
      dataIndex: 'locationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.workGroup`).d('班组'),
      dataIndex: 'workerGroupName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.worker`).d('操作工'),
      dataIndex: 'workerName',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.calendarDay`).d('指定日期'),
      dataIndex: 'calendarDay',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.calendarShiftCode`).d('指定班次'),
      dataIndex: 'calendarShiftCode',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.completeWarehouse`).d('完工仓库'),
      dataIndex: 'completeWarehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.completeWmArea`).d('完工货位'),
      dataIndex: 'completeWmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      dataIndex: 'inventoryWarehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      dataIndex: 'inventoryWmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executeRule`).d('执行规则'),
      dataIndex: 'executeRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      dataIndex: 'inspectionRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      dataIndex: 'dispatchRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('包装规则'),
      dataIndex: 'packingRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      dataIndex: 'reworkRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.collector`).d('数据收集项'),
      dataIndex: 'collector',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executeRemark`).d('执行备注'),
      dataIndex: 'executeRemark',
      width: 200,
      resizable: true,
    },
  ];

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="moId"
        data={dataExecuteSource}
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
