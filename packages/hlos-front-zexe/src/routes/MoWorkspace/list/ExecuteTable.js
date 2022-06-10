/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Table } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'zexe.moWorkspace.model';
const commonCode = 'zexe.common.model';

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
    {
      title: intl.get(`${preCode}.meOu`).d('制造工厂'),
      dataIndex: 'moExecuteList[0].meOu',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.meArea`).d('车间'),
      dataIndex: 'moExecuteList[0].meArea',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.prodLine`).d('生产线'),
      dataIndex: 'moExecuteList[0].prodLineName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.executeStatus`).d('执行状态'),
      dataIndex: 'moExecuteList[0].executeStatusMeaning',
      width: 150,
    },
    { title: intl.get(`${preCode}.demandQty`).d('需求数量'), dataIndex: 'demandQty', width: 150 },
    { title: intl.get(`${preCode}.makeQty`).d('制造数量'), dataIndex: 'makeQty', width: 150 },
    {
      title: intl.get(`${preCode}.completedQty`).d('完工数量'),
      dataIndex: 'moExecuteList[0].completedQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      dataIndex: 'moExecuteList[0].inventoryQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      dataIndex: 'moExecuteList[0].scrappedQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
      dataIndex: 'moExecuteList[0].completeControlTypeMeaning',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.completeControlValue`).d('完工限制值'),
      dataIndex: 'moExecuteList[0].completeControlValue',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inputQty`).d('关键投入'),
      dataIndex: 'moExecuteList[0].inputQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.issuedSuit`).d('投料套数'),
      dataIndex: 'moExecuteList[0].issuedSuit',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.maxIssuedQty`).d('最大投入'),
      dataIndex: 'moExecuteList[0].maxIssuedQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planSupplyQty`).d('计划供应数量'),
      dataIndex: 'moExecuteList[0].planSupplyQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.suppliedQty`).d('已供应数量'),
      dataIndex: 'moExecuteList[0].suppliedQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.executePriority`).d('生产优先级'),
      dataIndex: 'moExecuteList[0].executePriority',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.issuedFlag`).d('投料标识'),
      dataIndex: 'moExecuteList[0].issuedFlag',
      width: 100,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.workcell`).d('工位'),
      dataIndex: 'moExecuteList[0].workcellName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.equipment`).d('设备'),
      dataIndex: 'moExecuteList[0].equipmentName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.location`).d('地点'),
      dataIndex: 'moExecuteList[0].locationName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.workGroup`).d('班组'),
      dataIndex: 'moExecuteList[0].workerGroupName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.worker`).d('操作工'),
      dataIndex: 'moExecuteList[0].workerName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.completeWarehouse`).d('完工仓库'),
      dataIndex: 'moExecuteList[0].completeWarehouse',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.completeWmArea`).d('完工货位'),
      dataIndex: 'moExecuteList[0].completeWmArea',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      dataIndex: 'moExecuteList[0].inventoryWarehouse',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      dataIndex: 'moExecuteList[0].inventoryWmArea',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.executeRule`).d('执行规则'),
      dataIndex: 'moExecuteList[0].executeRuleName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      dataIndex: 'moExecuteList[0].inspectionRuleName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      dataIndex: 'moExecuteList[0].dispatchRuleName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('包装规则'),
      dataIndex: 'moExecuteList[0].packingRuleName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      dataIndex: 'moExecuteList[0].reworkRuleName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'moExecuteList[0].printedFlag',
      width: 100,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.printedDate`).d('打印时间'),
      dataIndex: 'moExecuteList[0].printedDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.collector`).d('数据收集项'),
      dataIndex: 'moExecuteList[0].collector',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.executeRemark`).d('执行备注'),
      dataIndex: 'moExecuteList[0].executeRemark',
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
