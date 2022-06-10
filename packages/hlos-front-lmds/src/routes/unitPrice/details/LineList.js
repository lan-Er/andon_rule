/*
 * @module: 工时单价行列表
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-31 14:51:27
 * @LastEditTime: 2021-01-07 14:09:39
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { Fragment } from 'react';
import { Tooltip } from 'choerodon-ui';
import { Table, Button } from 'choerodon-ui/pro';

export default function LineList({ mylineDs }) {
  /**
   * @description: 如果为新增则删除该行，否则重置该行
   * @param {*} record
   * @return {*}
   */
  function removeDetailsData(record) {
    const { status } = record;
    if (status === 'add') {
      mylineDs.children.workPriceVersionList.remove(record);
    } else {
      mylineDs.children.workPriceVersionList.current.reset();
    }
    handleRecoveryState();
  }

  /**
   * @description: 取消新增行时候，恢复第一个为最新版本状态
   * @param {*}
   * @return {*}
   */
  function handleRecoveryState() {
    mylineDs.children.workPriceVersionList.records.forEach((item, index) => {
      if (index === 0) {
        item.set('currentVersionFlag', true);
      } else {
        item.set('currentVersionFlag', false);
      }
    });
  }
  function column() {
    const columns = [
      {
        name: 'lineNum',
        renderer: ({ value, record, dataSet }) => {
          if (value) {
            return value;
          } else {
            const { length } = dataSet;
            return length - record.index;
          }
        },
        lock: true,
      },
      { name: 'workPriceVersion', editor: (record) => record.status === 'add', lock: true },
      { name: 'description', editor: true, width: 180 },
      { name: 'versionStatus', editor: true, width: 140 },
      { name: 'unitPrice', editor: true, width: 140 },
      { name: 'currencyObj', editor: true, width: 140 },
      { name: 'currentVersionFlag' },
      { name: 'startDate', editor: (record) => record.status === 'add', width: 160 },
      { name: 'endDate', editor: true, width: 160 },
      { name: 'auditor', editor: true },
      { name: 'issuedDate', editor: true, width: 160 },
      { name: 'auditWorkflow', editor: true, width: 180 },
      {
        header: '操作',
        lock: 'right',
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title="取消">
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeDetailsData(record)}
              />
            </Tooltip>,
          ];
        },
      },
    ];
    return columns;
  }

  /**
   * @description: 创建新行数据
   * @param {*}
   * @return {*}
   */
  function handleCreateNewVersion() {
    const _data = mylineDs.children.workPriceVersionList;
    const length = _data && _data.length;
    _data.forEach((ele) => {
      ele.set('currentVersionFlag', false);
    });
    mylineDs.children.workPriceVersionList.create(
      { lineNum: length + 1, currentVersionFlag: true },
      0
    );
  }
  return (
    <Fragment>
      <Table
        dataSet={mylineDs.children.workPriceVersionList}
        columns={column()}
        queryBar="null"
        buttons={[<Button onClick={handleCreateNewVersion}>新建版本</Button>]}
        editMode="cell"
      />
    </Fragment>
  );
}
