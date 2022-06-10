/*
 * @Description: 领料单平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-08 16:24:13
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import { Table } from 'choerodon-ui/pro';

const mainLineColumns = () => {
  return [
    {
      name: 'requestLineNum',
      width: 70,
      lock: 'left',
    },
    {
      name: 'itemObj',
      width: 128,
      lock: 'left',
    },
    {
      name: 'itemDescription',
      width: 200,
      editor: false,
    },
    {
      name: 'operation',
      width: 128,
      editor: false,
    },
    {
      name: 'uomObj',
      width: 70,
      editor: false,
    },
    {
      name: 'applyQty',
      width: 84,
      editor: false,
    },
    {
      name: 'requestLineStatus',
      width: 84,
      align: 'center',
      // TODO: add style depending on current state
      renderer: ({ text }) => <span>{text}</span>,
    },
    {
      name: 'warehouseObj',
      width: 128,
    },
    {
      name: 'wmAreaObj',
      width: 128,
      editor: false,
    },
    {
      name: 'workcellObj',
      width: 128,
      editor: false,
    },
    {
      name: 'locationObj',
      width: 128,
      editor: false,
    },
    {
      name: 'toWarehouseObj',
      width: 128,
      editor: false,
    },
    {
      name: 'toWmAreaObj',
      width: 128,
      editor: false,
    },
    {
      name: 'toWorkcellObj',
      width: 128,
      editor: false,
    },
    {
      name: 'toLocationObj',
      width: 150,
      editor: false,
    },
    {
      name: 'wmMoveTypeObj',
      width: 128,
      editor: false,
    },
    {
      name: 'itemControlType',
      width: 84,
    },
    {
      name: 'applyPackQty',
      width: 84,
      editor: false,
    },
    {
      name: 'applyWeight',
      width: 84,
      editor: false,
    },
    {
      name: 'secondUomObj',
      width: 70,
      editor: false,
    },
    {
      name: 'secondApplyQty',
      width: 84,
      editor: false,
    },
    {
      name: 'sourceDocTypeObj',
      width: 128,
      editor: false,
    },
    {
      name: 'sourceDocNumObj',
      width: 128,
      editor: false,
    },
    {
      name: 'sourceDocLineNumObj',
      width: 70,
      editor: false,
    },
    {
      name: 'lineRemark',
      width: 200,
      editor: false,
    },
  ];
};

const execLineColumns = () => [
  {
    name: 'requestLineNum',
    width: 150,
    editor: false,
    lock: 'left',
  },
  {
    name: 'itemObj',
    width: 150,
    editor: false,
    lock: 'left',
  },
  {
    name: 'applyQty',
    width: 150,
    editor: false,
  },
  {
    name: 'pickedFlag',
    width: 150,
    editor: false,
  },
  {
    name: 'pickedQty',
    width: 150,
    editor: false,
  },
  {
    name: 'executedQty',
    width: 150,
    editor: false,
  },
  {
    name: 'confirmedQty',
    width: 150,
    editor: false,
  },
  {
    name: 'pickedWorkerObj',
    width: 150,
    editor: false,
  },
  {
    name: 'pickRuleObj',
    width: 150,
    editor: false,
  },
  {
    name: 'reservationRuleObj',
    width: 150,
    editor: false,
  },
  {
    name: 'lotNumber',
    width: 150,
    editor: false,
  },
  {
    name: 'tagCode',
    width: 150,
    editor: false,
  },
];

export function MainLineTable(props) {
  const { dataSet, applyQtyDisabled } = props;
  return (
    <Table
      dataSet={dataSet}
      columns={mainLineColumns(applyQtyDisabled)}
      columnResizable="true"
      border={false}
    />
  );
}

export function ExecLineTable(props) {
  const { dataSet } = props;
  return (
    <Table dataSet={dataSet} columns={execLineColumns()} columnResizable="true" border={false} />
  );
}
