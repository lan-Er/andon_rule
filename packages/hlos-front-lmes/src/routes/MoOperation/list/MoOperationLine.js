/**
 * @Description: Mo工序管理信息--行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-09 10:32:13
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default function LineList(props) {
  let columns;

  const resourceColumns = [
    { name: 'resource', width: 150 },
    {
      name: 'preferredFlag',
      align: 'center',
      width: 100,
      renderer: yesOrNoRender,
    },
    { name: 'remark', width: 150 },
  ];
  const stepColumns = [
    { name: 'operationStepNum', width: 70, lock: true },
    { name: 'operationStepCode', width: 150, lock: true },
    { name: 'operationStepName', width: 150, lock: true },
    { name: 'operationStepAlias', width: 150 },
    { name: 'description' },
    { name: 'operationStepTypeMeaning', width: 150 },
    {
      name: 'keyStepFlag',
      align: 'center',
      width: 100,
      renderer: yesOrNoRender,
    },
    { name: 'processRule', width: 150 },
    { name: 'collector', width: 150 },
    { name: 'remark', width: 150 },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 100,
      renderer: yesOrNoRender,
    },
  ];
  const componentColumns = [
    { name: 'lineNum', width: 70, lock: true },
    { name: 'moComponentLineNum', width: 150 },
    { name: 'organization', width: 150 },
    { name: 'componentItemCode', width: 150 },
    { name: 'componentItemDescription' },
    { name: 'componentQty', width: 150 },
    { name: 'remark', width: 150 },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 100,
      renderer: yesOrNoRender,
    },
  ];

  if(props.tabType === 'resource') {
    columns = resourceColumns;
  } else if(props.tabType === 'step') {
    columns = stepColumns;
  } else if(props.tabType === 'component') {
    columns = componentColumns;
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
