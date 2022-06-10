/**
 * @Description: 销售退货单平台 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 14:28:08
 * @LastEditors: yu.na
 */

import React, { useCallback } from 'react';
import { Table } from 'choerodon-ui/pro';

export default function MainTab(props) {
  const { dataSet, buttons } = props;

  const columns = useCallback(() => {
    return [
      { name: 'returnLineNum', width: 82, lock: true },
      { name: 'soNum', width: 144, lock: true },
      { name: 'itemObj', width: 128, lock: true },
      { name: 'itemDescription', width: 200 },
      { name: 'applyQty', editor: true, width: 82 },
      { name: 'receivedQty', width: 82 },
      { name: 'receiveWarehouseName', width: 128 },
      { name: 'receiveWmAreaObj', editor: true, width: 128 },
      { name: 'receiveWorkerName', width: 128 },
      { name: 'actualArrivalTime', width: 150 },
      { name: 'qcDocNum', width: 144 },
      { name: 'qcNgQty', width: 82 },
      { name: 'qcOkQty', width: 82 },
      { name: 'lotNumber', editor: true, width: 128 },
      { name: 'tagCode', editor: true, width: 128 },
    ];
  }, []);

  return (
    <Table
      dataSet={dataSet}
      border={false}
      columnResizable="true"
      columns={columns()}
      buttons={buttons}
      queryBar="none"
    />
  );
}
