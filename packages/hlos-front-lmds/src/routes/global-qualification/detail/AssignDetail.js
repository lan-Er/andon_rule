/**
 * @Description: 资源分配
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 15:29:53
 * @LastEditors: yiping.liu
 */
import React, { Component, Fragment } from 'react';
import { Table, Tooltip, Button, Lov, Select } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';

export default class RangeDetail extends Component {
  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    try {
      const res = await this.props.detailDS.children.assigns.delete([record]);
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
   *
   *取消
   * @param {*} record
   * @memberof RangeDetail
   */
  @Bind()
  removeData(record) {
    const { assigns } = this.props.detailDS.children;
    if (record.toData().qualificationId) {
      assigns.current.reset();
    } else {
      assigns.remove(record);
    }
  }

  get columns() {
    return [
      {
        name: 'organizationObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 200,
      },
      { name: 'sourceType', editor: (record) => (record.status === 'add' ? <Select /> : null) },
      {
        name: 'sourceObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 200,
      },
      {
        name: 'performanceLevel',
        editor: (record) => (record.status === 'add' ? <Select /> : null),
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
      dataSet: detailDS.children.assigns,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
