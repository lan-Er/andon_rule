/**
 * @Description: 工序外协平台--tab组件
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-20 15:38:04
 * @LastEditors: leying.yan
 */

import React, { Fragment } from 'react';
import { Table, Tooltip } from 'choerodon-ui/pro';
import { Tag } from 'choerodon-ui';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default function TabComponent(props) {
  let columns;

  const mainColumns = [
    { name: 'organization', width: 150, lock: true },
    { name: 'outsourceNum', width: 150, renderer: linkRenderer, lock: true },
    { name: 'outsourceTypeName', width: 150 },
    {
      name: 'outsourceStatusMeaning',
      width: 150,
      renderer: ({ record }) => outsourceStatusRender(record.data.outsourceStatus, record),
    },
    { name: 'partyName', width: 150 },
    { name: 'partySiteName', width: 150 },
    { name: 'partyContact', width: 150 },
    { name: 'contactPhone', width: 150 },
    { name: 'contactEmail', width: 150 },
    { name: 'moNum', width: 150 },
    { name: 'taskNum', width: 150 },
    { name: 'projectNum', width: 150 },
    { name: 'currencyName', width: 150 },
    { name: 'totalAmount', width: 150 },
    { name: 'creator', width: 150 },
    { name: 'creationDate', width: 150 },
    { name: 'printedFlag', width: 150, renderer: yesOrNoRender },
    { name: 'printedDate', width: 150 },
    { name: 'sourceDocType', width: 150 },
    { name: 'sourceDocNum', width: 100 },
    { name: 'sourceDocLineNum', width: 100 },
    {
      name: 'docProcessRule',
      width: 100,
      renderer: ({ record }) => (
        <a style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Tooltip placement="topLeft" title={record.get('executeRule')}>
            {record.get('executeRule')}
          </Tooltip>
        </a>
      ),
    },
    { name: 'remark', width: 150 },
    { name: 'externalId', width: 100 },
  ];

  const executeColumns = [
    { name: 'organization', width: 150, lock: true },
    { name: 'outsourceNum', width: 150, renderer: linkRenderer, lock: true },
    { name: 'shippedDate', width: 150 },
    { name: 'shipWorkerId', width: 150 },
    { name: 'actualArrivalTime', width: 150 },
    { name: 'receiveWorkerId', width: 150 },
    { name: 'carrier', width: 150 },
    { name: 'carrierContact', width: 150 },
    { name: 'shipTicket', width: 150 },
    { name: 'plateNum', width: 150 },
  ];

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer({ value }) {
    return (
      // onClick={() => props.onToDetailPage(`/lmes/process-outsource-platform/create`)}
      <a>{value}</a>
    );
  }

  /**
   * 渲染外协单状态
   * @param value
   * @param record
   */
  function outsourceStatusRender(value, record) {
    const { outsourceStatusMeaning } = record.data;
    switch (value) {
      case 'NEW': // 浅蓝色
        return <Tag color="#2db7f5">{outsourceStatusMeaning}</Tag>;
      case 'RELEASED': // 黄色
        return <Tag color="yellow">{outsourceStatusMeaning}</Tag>;
      case 'SHIPPED': // 橙色
        return <Tag color="orange">{outsourceStatusMeaning}</Tag>;
      case 'RECEIVING': // 蓝绿色？
        return <Tag color="#108ee9">{outsourceStatusMeaning}</Tag>;
      case 'RECEIVED': // 黄绿色
        return <Tag color="#7FFF00">{outsourceStatusMeaning}</Tag>;
      case 'INSPECTED': // 浅绿色
        return <Tag color="#87d068">{outsourceStatusMeaning}</Tag>;
      case 'COMPLETED': // 绿色
        return <Tag color="green">{outsourceStatusMeaning}</Tag>;
      case 'CLOSED': // 灰色
        return <Tag color="gray">{outsourceStatusMeaning}</Tag>;
      case 'CANCELLED': // 浅红色
        return <Tag color="#f50">{outsourceStatusMeaning}</Tag>;
      default:
        return outsourceStatusMeaning;
    }
  }

  function handleRowChange() {
    return {
      onClick: () => {
        props.setShowLine(true);
      },
    };
  }

  if (props.tabType === 'main') {
    columns = mainColumns;
  } else if (props.tabType === 'execute') {
    columns = executeColumns;
  }

  return (
    <Fragment>
      <Table
        dataSet={props.tableDS}
        columns={columns}
        border={false}
        columnResizable="true"
        editMode="inline"
        onRow={(record) => handleRowChange(record)}
        pagination={{
          onChange: (page) => props.onPageChange(page),
        }}
      />
    </Fragment>
  );
}
