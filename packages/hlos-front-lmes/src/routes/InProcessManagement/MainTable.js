/**
 * @Description: 在制品管理-tab
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-11
 * @LastEditors: leying.yan
 */

import React from 'react';
import { Table } from 'hzero-ui';
import { Tag } from 'choerodon-ui';
import intl from 'utils/intl';

const preCode = 'lmes.inProcessManagement.model';
const commonCode = 'lmes.common.model';

export default function MainTab(props) {
  const { loading, tableScrollWidth, dataSource, pagination, handlePagination } = props;
  const columns = [
    {
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organizationCode',
      width: 150,
      fixed: 'left',
      render: (value, record) => {
        return `${value} ${record.organizationName}`;
      },
    },
    {
      title: intl.get(`${commonCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.taskNum`).d('任务号'),
      dataIndex: 'taskNum',
      width: 150,
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
      title: intl.get(`${preCode}.operation`).d('工序'),
      dataIndex: 'operation',
      width: 150,
    },
    {
      title: intl.get(`${commonCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.wipQty`).d('在制数量'),
      dataIndex: 'wipQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('批次'),
      dataIndex: 'lotNumber',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.tag`).d('标签'),
      dataIndex: 'tagCode',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.productTag`).d('产品码'),
      dataIndex: 'productTagCode',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.outerTag`).d('外层标签'),
      dataIndex: 'outerTagCode',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.verificationCode`).d('验证码'),
      dataIndex: 'verificationCode',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.nextOperation`).d('下一工序'),
      dataIndex: 'nextOperation',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.nextTask`).d('下一任务'),
      dataIndex: 'nextTask',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.wipSequence`).d('在制顺序'),
      dataIndex: 'wipSequenceNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      dataIndex: 'secondUomName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.secondWipQty`).d('辅助数量'),
      dataIndex: 'secondWipQty',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.party`).d('商业伙伴'),
      dataIndex: 'partyNumber',
      width: 150,
      render: (value, record) => {
        return `${value} ${record.partyName}`.replace(/null/g, ' ');
      },
    },
    {
      title: intl.get(`${preCode}.partySite`).d('伙伴地点'),
      dataIndex: 'partySiteNumber',
      width: 150,
      render: (value, record) => {
        return `${value} ${record.partySiteName}`.replace(/null/g, ' ');
      },
    },
    {
      title: intl.get(`${preCode}.inProcessStatus`).d('在制状态'),
      dataIndex: 'wipStatusMeaning',
      width: 150,
      render: wipStatusRender,
    },
    {
      title: intl.get(`${commonCode}.picture`).d('图片'),
      dataIndex: 'pictures',
      width: 150,
    },
    {
      title: intl.get(`${commonCode}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 150,
    },
  ];

  /**
   * 渲染在制状态
   * @param value
   * @param meaning
   */
  function wipStatusRender(value, record) {
    const { wipStatus } = record;
    switch (wipStatus) {
      case 'INSPECTED':
        // 黄绿色
        return <Tag color="#7FFF00">{value}</Tag>;
      case 'WIP': // 蓝色
        return <Tag color="#108ee9">{value}</Tag>;
      case 'COMPLETED': // 绿色
        return <Tag color="green">{value}</Tag>;
      case 'OFFLINE': // 浅红色
        return <Tag color="red">{value}</Tag>;
      default:
        return value;
    }
  }
  return (
    <Table
      loading={loading}
      rowKey="wipId"
      bordered
      scroll={{ x: tableScrollWidth(columns) }}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={handlePagination}
    />
  );
}
