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

export default function MainTab(props) {
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
    handleToPage,
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
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.category`).d('类别'),
      dataIndex: 'itemCategoryName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      width: 70,
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
      title: intl.get(`${preCode}.demandDate`).d('需求时间'),
      dataIndex: 'demandDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
      dataIndex: 'planStartDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
      dataIndex: 'planEndDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moType`).d('MO类型'),
      dataIndex: 'moTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moStatus`).d('MO状态'),
      dataIndex: 'moStatusMeaning',
      width: 90,
      // render: (value, record) => statusRender(record.moStatus, value),
      render: ({ rowData, dataIndex }) => statusRender(rowData.moStatus, rowData[dataIndex]),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      dataIndex: 'promiseDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
      dataIndex: 'deadlineDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.prodVersionEnable`).d('启用生产版本'),
      dataIndex: 'prodVersionEnable',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.prodVersion`).d('生产版本'),
      dataIndex: 'productionVersion',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
      dataIndex: 'bomVersion',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.routingVersion`).d('工艺版本'),
      dataIndex: 'routingVersion',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.mto`).d('按单生产'),
      dataIndex: 'mtoFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
      dataIndex: 'mtoExploredFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.topMo`).d('顶层MO'),
      dataIndex: 'topMoNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.parentMos`).d('父级MO'),
      dataIndex: 'parentMoNums',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moLevel`).d('MO层级'),
      dataIndex: 'moLevel',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moGroup`).d('MO组'),
      dataIndex: 'moGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      dataIndex: 'wbsNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planSupplyQty`).d('计划供应数量'),
      dataIndex: 'planSupplyQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      dataIndex: 'secondUomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
      dataIndex: 'secondDemandQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('生产批次'),
      dataIndex: 'moLotNumber',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('生产标签'),
      dataIndex: 'tagCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      dataIndex: 'tagTemplate',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creator`).d('制单人'),
      dataIndex: 'creator',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creationDate`).d('制单时间'),
      dataIndex: 'creationDate',
      width: 140,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.releasedBy`).d('下达者'),
      dataIndex: 'releasedBy',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.releasedDate`).d('下达时间'),
      dataIndex: 'releasedDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.closedBy`).d('关闭者'),
      dataIndex: 'closedBy',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.closedDate`).d('关闭时间'),
      dataIndex: 'closedDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.releasedStartDate`).d('下达开始时间'),
      dataIndex: 'releasedStartDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.releasedEndDate`).d('下达结束时间'),
      dataIndex: 'releasedEndDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moWarnning`).d('MO警告'),
      dataIndex: 'moWarnningFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalOrderType`).d('外部订单类型'),
      dataIndex: 'externalOrderTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalUpdateDate`).d('外部更新时间'),
      dataIndex: 'externalUpdateDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalCreator`).d('外部创建者'),
      dataIndex: 'externalCreator',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalRemark`).d('外部备注'),
      dataIndex: 'externalRemark',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      width: 150,
      render: ({ rowData }) => {
        return [
          <a
            style={{ marginLeft: '10px' }}
            onClick={() => handleToPage('/lmes/mo-component', rowData)}
          >
            {intl.get(`${preCode}.component`).d('组件')}
          </a>,
          <a
            style={{ marginLeft: '10px' }}
            onClick={() => handleToPage('/neway/mo-operation/list', rowData)}
          >
            {intl.get(`${preCode}.operation`).d('工序')}
          </a>,
          <a
            style={{ marginLeft: '10px' }}
            onClick={() => handleToPage('/lmes/production-task/list', rowData)}
          >
            {intl.get(`${preCode}.task`).d('任务')}
          </a>,
        ];
      },
      fixed: 'right',
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
