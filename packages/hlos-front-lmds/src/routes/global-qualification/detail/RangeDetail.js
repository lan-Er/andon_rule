/**
 * @Description: 明细范围
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 14:57:00
 * @LastEditors: yiping.liu
 */

import React, { Component, Fragment } from 'react';
import { Table, Select, Tooltip, Button, Lov } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import notification from 'utils/notification';

export default class RangeDetail extends Component {
  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    try {
      const res = await this.props.detailDS.children.ranges.delete([record]);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      } else {
        this.props.detailDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  /**
   *取消
   *
   * @param {*} record
   * @memberof RangeDetail
   */
  @Bind()
  removeData(record) {
    const { ranges } = this.props.detailDS.children;
    if (record.toData().qualificationId) {
      ranges.current.reset();
    } else {
      ranges.remove(record);
    }
  }

  get columns() {
    return [
      {
        name: 'organizationObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 200,
      },
      {
        name: 'sourceType',
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        width: 128,
      },
      {
        name: 'sourceObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 200,
      },
      {
        name: 'sourceName',
        editor: false,
        width: 200,
      },
      {
        name: 'itemObj',
        width: 240,
        editor: true,
      },
      { name: 'startDate', editor: true, align: 'center' },
      { name: 'endDate', editor: true, align: 'center' },
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
                onClick={() => this.handleDelLine(record)}
              />
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

  render() {
    const { detailDS } = this.props;
    const tableProps = {
      columns: this.columns,
      dataSet: detailDS.children.ranges,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
