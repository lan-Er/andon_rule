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
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default function TabComponent({ detailDS, tabType, allDisabled }) {
  let columns;
  let ds;

  const itemColumns = [
    {
      name: 'itemLineType',
      editor: (record) => record.status === 'add' && !allDisabled,
      width: 128,
      lock: true,
    },
    {
      name: 'itemObj',
      editor: (record) => record.status === 'add' && !allDisabled,
      width: 128,
      lock: true,
    },
    { name: 'itemDescription', width: 200, lock: true },
    { name: 'taskQty', editor: !allDisabled, width: 150 },
    { name: 'uomObj', editor: (record) => record.status === 'add' && !allDisabled, width: 70 },
    { name: 'maxQty', editor: !allDisabled, width: 82 },
    { name: 'executableQty', editor: true, width: 82 },
    { name: 'suggestQty', editor: true, width: 82 },
    { name: 'processOkQty', width: 82 },
    { name: 'processNgQty', width: 82 },
    { name: 'scrappedQty', width: 82 },
    { name: 'rawNgQty', width: 82 },
    { name: 'reworkQty', width: 82 },
    { name: 'pendingQty', width: 82 },
    { name: 'wipQty', width: 82 },
    {
      name: 'warehouseObj',
      editor: (record) => record.status === 'add' && !allDisabled,
      width: 128,
    },
    { name: 'wmAreaObj', editor: (record) => record.status === 'add' && !allDisabled, width: 128 },
    { name: 'itemUsage', width: 82 },
    { name: 'bomUsage', width: 82 },
    {
      name: 'supplyType',
      editor: (record) => record.status === 'add' && !allDisabled,
      width: 82,
    },
    {
      name: 'itemControlType',
      editor: (record) => record.status === 'add' && !allDisabled,
      width: 82,
    },
    {
      name: 'executeControlType',
      editor: (record) => record.status === 'add' && !allDisabled,
      width: 82,
    },
    { name: 'executeControlValue', width: 82 },
    {
      name: 'linePriority',
      editor: (record) => record.status === 'add' && !allDisabled,
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
                onClick={() => removeData(record, 'item')}
              />
            </Tooltip>,
          ];
        }
      },
      lock: 'right',
    },
  ];

  const stepColumns = [
    { name: 'taskStepNum', editor: !allDisabled, width: 70, lock: true },
    { name: 'taskStepCode', editor: !allDisabled, width: 128, lock: true },
    { name: 'taskStepName', editor: !allDisabled, width: 128, lock: true },
    { name: 'taskStepAlias', editor: !allDisabled, width: 128 },
    { name: 'description', editor: !allDisabled, width: 128 },
    { name: 'taskStepType', editor: !allDisabled, width: 128 },
    {
      name: 'keyStepFlag',
      width: 70,
      align: 'center',
      editor: !allDisabled,
      renderer: yesOrNoRender,
    },
    { name: 'processRuleObj', editor: !allDisabled, width: 128 },
    { name: 'collectorObj', editor: !allDisabled, width: 128 },
    { name: 'sourceTypeObj', editor: !allDisabled, width: 128 },
    { name: 'sourceNumObj', editor: !allDisabled, width: 128 },
    {
      name: 'enabledFlag',
      width: 70,
      align: 'center',
      editor: !allDisabled,
      renderer: yesOrNoRender,
    },
    { name: 'externalId', editor: !allDisabled, width: 128 },
    { name: 'externalNum', editor: !allDisabled, width: 128 },
    { name: 'stepRemark', editor: !allDisabled, width: 200 },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 90,
      command: ({ record }) => {
        return [
          <Tooltip
            key="cancen-btn"
            placement="bottom"
            title={intl.get('hzero.common.button.cancel').d('取消')}
          >
            <Button
              icon="cancle_a"
              color="primary"
              funcType="flat"
              onClick={() => removeData(record, 'step')}
            />
          </Tooltip>,
        ];
      },
      lock: 'right',
    },
  ];

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  function removeData(record, type) {
    const { taskItems, taskSteps } = detailDS.children;
    if (type === 'item') {
      if (record.toData().taskItemLineId) {
        taskItems.current.reset();
      } else {
        taskItems.remove(record);
      }
    } else if (type === 'step') {
      if (record.toData().taskStepId) {
        taskSteps.current.reset();
      } else {
        taskSteps.remove(record);
      }
    }
  }

  if (tabType === 'item') {
    columns = itemColumns;
    ds = detailDS.children.taskItems;
  } else if (tabType === 'step') {
    columns = stepColumns;
    ds = detailDS.children.taskSteps;
  }

  return (
    <Fragment>
      <Table
        dataSet={ds}
        columns={columns}
        border={false}
        columnResizable="true"
        buttons={['add']}
      />
    </Fragment>
  );
}
