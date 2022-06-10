/**
 * @Description: SMD清单-LineList
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-08 10:53:29
 * @LastEditors: yu.na
 */
import React, { useMemo } from 'react';
import { Table } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const LineList = ({ ds }) => {
  const columns = useMemo(() => {
    return [
      {
        name: 'smdLineNum',
        width: 70,
        lock: true,
      },
      {
        name: 'organizationObj',
        width: 128,
        lock: true,
      },
      {
        name: 'deviceItemObj',
        width: 128,
        lock: true,
      },
      {
        name: 'deviceItemDescription',
        width: 200,
      },
      {
        name: 'loadSeat',
        width: 82,
      },
      {
        name: 'deviceQty',
        width: 82,
      },
      {
        name: 'pcbMountPosition',
        width: 200,
      },
      {
        name: 'deviceSubstituteGroup',
        width: 82,
      },
      {
        name: 'deviceSubstituteFlag',
        width: 82,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'mouterPosition',
        width: 82,
      },
      {
        name: 'mouterGroup',
        width: 82,
      },
      {
        name: 'trolleyCategoryObj',
        width: 128,
      },
      {
        name: 'feederCategoryObj',
        width: 128,
      },
      {
        name: 'feederLayLength',
        width: 128,
      },
      {
        name: 'warningQty',
        width: 82,
      },
      {
        name: 'remark',
        width: 200,
      },
      {
        name: 'externalLineId',
        width: 128,
      },
      {
        name: 'externalLineNum',
        width: 128,
      },
      {
        name: 'enabledFlag',
        width: 82,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }, []);

  return (
    <Table
      dataSet={ds}
      bordered="false"
      columns={columns}
      columnResizable="true"
      editMode="inline"
      queryBar="none"
    />
  );
};

export default LineList;
