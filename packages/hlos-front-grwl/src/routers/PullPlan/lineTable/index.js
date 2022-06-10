/*
 * @module: 行表格
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 17:28:14
 * @LastEditTime: 2021-04-27 17:54:31
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { useMemo } from 'react';
import { Table } from 'choerodon-ui/pro';

export default function LineTable(props) {
  const getColumns = useMemo(() => {
    return [
      { name: 'poNum', lock: 'left', width: 160 },
      { name: 'poLineNum', lock: 'left', width: 160 },
      { name: 'shipOrderNum' },
      { name: 'shipOrderLineNum' },
      { name: 'customerDeliveryNum' },
      { name: 'customerDeliveryLineNum' },
      { name: 'shipOrderLineStatus' },
      { name: 'applyQty' },
      { name: 'demandDate' },
      { name: 'issueWorker' },
      { name: 'issueDate' },
      { name: 'executedWorker' },
      { name: 'executedDate' },
      { name: 'executedQty' },
    ];
  }, []);
  return (
    <div style={{ marginTop: '30px' }}>
      <Table dataSet={props.dataSet} columns={getColumns} queryBar="none" />
    </div>
  );
}
