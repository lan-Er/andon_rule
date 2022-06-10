/**
 * @Description: 检验单平台--行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:50:02
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';
import { getSerialNum } from '@/utils/renderer';

export default function LineList(props) {
  const columns = [
    { header: '行号', width: 60, lock: true, renderer: ({ record }) => getSerialNum(record) },
    { name: 'inspectionItem', lock: true },
    { name: 'qcOkQty' },
    { name: 'qcNgQty' },
  ];

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
