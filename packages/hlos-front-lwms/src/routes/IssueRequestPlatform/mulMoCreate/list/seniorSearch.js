import React, { useEffect } from 'react';
import { Table } from 'choerodon-ui/pro';

import { userSetting } from 'hlos-front/lib/services/api';

export default function SeniorSearch(props) {
  const columns = [
    {
      name: 'moNum',
      width: 130,
    },
    {
      name: 'moStatus',
      width: 130,
    },
    {
      name: 'itemObj',
      width: 130,
    },
    {
      name: 'makeQty',
      width: 130,
    },
    {
      name: 'planSate',
      width: 130,
    },
    {
      name: 'productPosition',
      width: 130,
    },
    {
      name: 'customerName',
      width: 130,
    },
    {
      name: 'projectNum',
      width: 130,
    },
    {
      name: 'soObj',
      width: 130,
    },
    {
      name: 'demandObj',
      width: 130,
    },
    {
      name: 'topMoNum',
      width: 130,
    },
    {
      name: 'parentMoNums',
      width: 130,
    },
    {
      name: 'remark',
      width: 130,
    },
  ];
  const tableProps = {
    dataSet: props.ds,
    columns,
    columnResizable: true,
  };

  /**
   * 设置默认组织
   */
  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        props.ds.queryDataSet.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          meOuName: res.content[0].meOuName,
        });
      }
    }
    getUserInfo();
  }, []);

  return (
    <div>
      <Table {...tableProps} />
    </div>
  );
}
