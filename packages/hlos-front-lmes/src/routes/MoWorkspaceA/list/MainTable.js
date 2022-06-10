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

const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

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
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.category`).d('类别'),
      dataIndex: 'itemCategoryName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      width: 70,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      dataIndex: 'demandDate',
      width: 140,
    },
    // {
    //   title: intl.get(`${preCode}.makeQty`).d('制造数量'),
    //   dataIndex: 'makeQty',
    //   width: 150,
    // },

    {
      title: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
      dataIndex: 'planStartDate',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
      dataIndex: 'planEndDate',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.moType`).d('MO类型'),
      dataIndex: 'moTypeName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.moStatus`).d('MO状态'),
      dataIndex: 'moStatusMeaning',
      width: 84,
      render: orderStatusRender,
    },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.soNum`).d('销售订单号'),
      dataIndex: 'soNum',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
      dataIndex: 'soLineNum',
      width: 70,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单'),
      dataIndex: 'demandNum',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
      dataIndex: 'bomVersion',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.prodVersion`).d('生产版本'),
      dataIndex: 'productionVersion',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.topMo`).d('顶层MO'),
      dataIndex: 'topMoNum',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.parentMos`).d('父级MO'),
      dataIndex: 'parentMoNums',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      dataIndex: 'wbsNum',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('生产批次'),
      dataIndex: 'moLotNumber',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('生产标签'),
      dataIndex: 'tagCode',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      dataIndex: 'tagTemplate',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.mto`).d('按单生产'),
      dataIndex: 'mtoFlag',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
      dataIndex: 'mtoExploredFlag',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.moWarnning`).d('MO警告'),
      dataIndex: 'moWarnningFlag',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${commonCode}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.releasedBy`).d('下达者'),
      dataIndex: 'releasedBy',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.releasedDate`).d('下达时间'),
      dataIndex: 'releasedDate',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.closedBy`).d('关闭者'),
      dataIndex: 'closedBy',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.closedDate`).d('关闭时间'),
      dataIndex: 'closedDate',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.releasedStartDate`).d('下达开始时间'),
      dataIndex: 'releasedStartDate',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.releasedEndDate`).d('下达结束时间'),
      dataIndex: 'releasedEndDate',
      width: 140,
    },
    {
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      width: 128,
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
