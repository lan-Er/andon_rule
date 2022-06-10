/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Table } from 'hzero-ui';
import { Tag } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'zexe.moWorkspace.model';
const commonCode = 'zexe.common.model';

export default function MainTab(props) {
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
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.category`).d('类别'),
      dataIndex: 'itemCategoryName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.makeQty`).d('制造数量'),
      dataIndex: 'makeQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      dataIndex: 'demandDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
      dataIndex: 'planStartDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
      dataIndex: 'planEndDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moType`).d('MO类型'),
      dataIndex: 'moTypeName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moStatus`).d('MO状态'),
      dataIndex: 'moStatusMeaning',
      width: 100,
      render: orderStatusRender,
    },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      dataIndex: 'promiseDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
      dataIndex: 'deadlineDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.prodVersionEnable`).d('启用生产版本'),
      dataIndex: 'prodVersionEnable',
      width: 100,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.prodVersion`).d('生产版本'),
      dataIndex: 'productionVersion',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
      dataIndex: 'bomVersion',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.routingVersion`).d('工艺版本'),
      dataIndex: 'routingVersion',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.mto`).d('按单生产'),
      dataIndex: 'mtoFlag',
      width: 100,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
      dataIndex: 'mtoExploredFlag',
      width: 100,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.topMo`).d('顶层MO'),
      dataIndex: 'topMoNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.parentMos`).d('父级MO'),
      dataIndex: 'parentMoNums',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moLevel`).d('MO层级'),
      dataIndex: 'moLevel',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moGroup`).d('MO组'),
      dataIndex: 'moGroup',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      dataIndex: 'wbsNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planSupplyQty`).d('计划供应数量'),
      dataIndex: 'planSupplyQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      dataIndex: 'secondUomName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
      dataIndex: 'secondDemandQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('生产批次'),
      dataIndex: 'moLotNumber',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('生产标签'),
      dataIndex: 'tagCode',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.releasedBy`).d('下达者'),
      dataIndex: 'releasedBy',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.releasedDate`).d('下达时间'),
      dataIndex: 'releasedDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.closedBy`).d('关闭者'),
      dataIndex: 'closedBy',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.closedDate`).d('关闭时间'),
      dataIndex: 'closedDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.releasedStartDate`).d('下达开始时间'),
      dataIndex: 'releasedStartDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.releasedEndDate`).d('下达结束时间'),
      dataIndex: 'releasedEndDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocTypeName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.moWarnning`).d('MO警告'),
      dataIndex: 'moWarnningFlag',
      width: 100,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${commonCode}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 150,
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      width: 150,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.externalOrderType`).d('外部订单类型'),
      dataIndex: 'externalOrderTypeMeaning',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.externalUpdateDate`).d('外部更新时间'),
      dataIndex: 'externalUpdateDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.externalCreator`).d('外部创建者'),
      dataIndex: 'externalCreator',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.externalRemark`).d('外部备注'),
      dataIndex: 'externalRemark',
      width: 150,
    },
  ];

  /**
   * 渲染订单状态
   * @param value
   * @param meaning
   */
  function orderStatusRender(value, record) {
    const { moStatus } = record;
    switch (moStatus) {
      case 'NEW': // 浅蓝色
        return <Tag color="#2db7f5">{value}</Tag>;
      case 'RUNNING':
        // 黄绿色
        return <Tag color="#7FFF00">{value}</Tag>;
      case 'PLANNED':
      case 'SCHEDULED': // 蓝色
        return <Tag color="#108ee9">{value}</Tag>;
      case 'PENDING': // 黄色
        return <Tag color="yellow">{value}</Tag>;
      case 'RELEASED': // 浅绿色
        return <Tag color="#87d068">{value}</Tag>;
      case 'COMPLETED': // 绿色
        return <Tag color="green">{value}</Tag>;
      case 'CLOSED': // 灰色
        return <Tag color="gray">{value}</Tag>;
      case 'CANCELLED': // 浅红色
        return <Tag color="#f50">{value}</Tag>;
      default:
        return value;
    }
  }

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
