/*
 * @Author: zhang yang
 * @Description: 时段 明细 detail
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:07
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, Tooltip, Button, TextField } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

export default class PeriodDetail extends PureComponent {
  /**
   * 新增
   */
  @Bind()
  async handleAddChildrenList() {
    this.props.detailDS.children.periodLineList.create({}, 0);
  }

  get columns() {
    return [
      { name: 'startDate', editor: true, width: 130, align: 'center' },
      { name: 'endDate', editor: true, width: 130, align: 'center' },
      { name: 'segmentCode', editor: false },
      {
        name: 'segment1',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'segment2',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'segment3',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                disabled={!record.get('periodId')}
                onClick={() => this.handleDelLine(record)}
              />
            </Tooltip>,
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { periodLineList } = this.props.detailDS.children;
    if (record.toData().periodLineId) {
      periodLineList.current.reset();
    } else {
      periodLineList.remove(record);
    }
  }

  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    const { detailDS } = this.props;
    await detailDS.children.periodLineList.delete([record]);
    detailDS.children.periodLineList.query();
  }

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.periodLineList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
