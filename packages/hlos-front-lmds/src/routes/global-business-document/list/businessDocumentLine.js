/**
 * @Description: 业务单据--行信息
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-11 14:14:03
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Table } from 'choerodon-ui/pro';
import { orderStatusRender } from 'hlos-front/lib/utils/renderer';

function LineTable(props) {

  const columns = [
    { name: 'documentLineNum', editor: false, width: 150 },
    {
      name: 'documentLineStatusMeaning',
      editor: false,
      width: 120,
      align: 'center',
      renderer: ({ value, record }) => orderStatusRender(record.data.documentLineStatus, value),
    },
    { name: 'organization', editor: false },
    { name: 'sourceDocType', editor: false },
    { name: 'sourceDocNum', editor: false },
    { name: 'sourceDocLineNum', editor: false },
  ];

  return (
    <React.Fragment>
      <Table
        dataSet={props.tableDS}
        border={false}
        columnResizable="true"
        editMode="inline"
        columns={columns}
      />
    </React.Fragment>
  );
}

export default LineTable;
