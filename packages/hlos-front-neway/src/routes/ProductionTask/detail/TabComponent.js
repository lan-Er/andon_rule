/**
 * @Description: 生产任务详情--tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 15:38:04
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { Table, Button } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import intl from 'utils/intl';

export default function TabComponent({ detailDS }) {
  const ds = detailDS.children.taskItems;

  const itemColumns = [
    {
      name: 'itemLineType',
      width: 128,
      lock: true,
    },
    {
      name: 'itemObj',
      width: 128,
      lock: true,
    },
    { name: 'itemDescription', width: 200 },
    { name: 'uomObj', width: 70 },
    { name: 'taskQty', width: 150 },
    { name: 'wipQty', width: 82 },
    { name: 'pendingQty', width: 82 },
    { name: 'processOkQty', width: 82 },
    { name: 'scrappedQty', width: 82 },
    { name: 'reworkQty', width: 82 },
    { name: 'suggestQty', width: 82 },
    { name: 'executableQty', width: 82 },
    {
      name: 'linePriority',
      width: 150,
    },
    {
      name: 'lineRemark',
      width: 150,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 90,
      command: ({ record, dataSet }) => {
        if (record.index !== dataSet.length - 1) {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record)}
              />
            </Tooltip>,
          ];
        }
      },
      lock: 'right',
    },
  ];

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  function removeData(record) {
    const { taskItems } = detailDS.children;
    if (record.toData().taskItemLineId) {
      taskItems.current.reset();
    } else {
      taskItems.remove(record);
    }
  }

  return (
    <Fragment>
      <Table dataSet={ds} columns={itemColumns} border={false} columnResizable="true" />
    </Fragment>
  );
}
