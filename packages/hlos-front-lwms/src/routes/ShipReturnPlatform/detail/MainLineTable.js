/**
 * @Description: 销售退货单平台 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 14:28:08
 * @LastEditors: yu.na
 */

import React, { useCallback } from 'react';
import { Table } from 'choerodon-ui/pro';
import { statusRender } from 'hlos-front/lib/utils/renderer';

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
      { name: 'uomObj', width: 70 },
      {
        name: 'returnLineStatusMeaning',
        width: 84,
        renderer: ({ value, record }) => statusRender(record.data.returnLineStatus, value),
      },
      { name: 'demandNum', width: 144 },
      { name: 'shipOrderNum', width: 144 },
      { name: 'shipOrderLineNum', width: 82 },
      { name: 'customerPo', width: 144 },
      { name: 'customerPoLine', width: 82 },
      { name: 'shipReturnRule', width: 200 },
      { name: 'itemControlTypeMeaning', width: 70 },
      { name: 'returnReasonName', editor: true, width: 200 },
      { name: 'packingQty', editor: true, width: 82 },
      { name: 'containerQty', editor: true, width: 82 },
      { name: 'sourceDocTypeName', width: 128 },
      { name: 'sourceDocNum', width: 144 },
      { name: 'sourceDocLineNum', width: 82 },
      { name: 'externalNum', width: 144 },
      { name: 'externalLineNum', width: 82 },
      { name: 'lineRemark', editor: true, width: 200 },
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
