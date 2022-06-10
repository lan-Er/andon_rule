/**
 * @Description: 工序外协 - 行table
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-20
 * @LastEditors: leying.yan
 */

import React, { Fragment } from 'react';
import { Table, Tooltip } from 'choerodon-ui/pro';

export default function LineList(props) {
  let columns;

  const mainColumns = [
    { name: 'outsourceLineNum', width: 150, lock: true },
    { name: 'itemCode', width: 150, lock: true },
    { name: 'itemDescription', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'applyQty', width: 150 },
    { name: 'moNum', width: 150 },
    { name: 'taskNum', width: 150 },
    { name: 'moOperationNum', width: 150 },
    { name: 'operation', width: 150 },
    { name: 'projectNum', width: 150 },
    { name: 'demandDate', width: 150 },
    { name: 'promiseDate', width: 150 },
    { name: 'lineStatus', width: 150 },
    { name: 'secondUom', width: 150 },
    { name: 'secondApplyQty', width: 150 },
    { name: 'unitPrice', width: 150 },
    { name: 'lineAmount', width: 150 },
    {
      name: 'executeRule',
      width: 150,
      renderer: ({ record }) => (
        <a style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Tooltip placement="topLeft" title={record.get('executeRule')}>
            {record.get('executeRule')}
          </Tooltip>
        </a>
      ),
    },
    { name: 'inspectionRule', width: 150 },
    { name: 'relatedItem', width: 150 },
    { name: 'relatedItemDesc', width: 150 },
    { name: 'relatedUom', width: 150 },
    { name: 'relatedApplyQty', width: 150 },
    { name: 'poNum', width: 150 },
    { name: 'poLineNum', width: 150 },
    { name: 'sourceDocType', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 150 },
    { name: 'lineRemark', width: 150 },
    { name: 'externalId', width: 150 },
    { name: 'externalNum', width: 150 },
    { name: 'externalLineId', width: 150 },
    { name: 'externalLineNum', width: 150 },
  ];

  const executeColumns = [
    { name: 'outsourceLineNum', width: 150, lock: true },
    { name: 'itemCode', width: 150, lock: true },
    { name: 'applyQty', width: 150 },
    { name: 'shippedQty', width: 150 },
    { name: 'completedQty', width: 150 },
    { name: 'receivedQty', width: 150 },
    { name: 'okQty', width: 100 },
    { name: 'ngQty', width: 150 },
    { name: 'scrappedQty', width: 150 },
    { name: 'qcDocNum', width: 150 },
    { name: 'ngReason', width: 150 },
    { name: 'actualArrivalTime', width: 150 },
    { name: 'receiveWorker', width: 100 },
    { name: 'inspectedTime', width: 150 },
    { name: 'inspector', width: 100 },
  ];

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
      />
    </Fragment>
  );
}
