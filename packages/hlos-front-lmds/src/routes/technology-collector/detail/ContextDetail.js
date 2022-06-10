/*
 * @Author: zhang yang
 * @Description: 数据收集项 收集项明细 detail
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:07
 */

import React, { PureComponent } from 'react';
import { Table, CheckBox, Select, Tooltip, Button, TextField } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class ContextDetail extends PureComponent {
  get columns() {
    return [
      {
        name: 'contextType',
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        width: 150,
      },
      {
        name: 'contextCode',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 150,
      },
      {
        name: 'referenceValue',
        editor: true,
        width: 150,
        align: 'right',
      },
      {
        name: 'defaultValue',
        editor: true,
        width: 150,
        align: 'right',
      },
      {
        name: 'maxValue',
        editor: true,
        width: 150,
        align: 'right',
      },
      {
        name: 'minValue',
        editor: true,
        width: 150,
        align: 'right',
      },
      { name: 'keyFlag', editor: true, width: 100, align: 'center', renderer: yesOrNoRender },
      { name: 'orderByCode', editor: true, width: 150 },
      {
        name: 'enabledFlag',
        editor: <CheckBox />,
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
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
                disabled={!record.get('collectorLineId')}
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
    const { collectorLineList } = this.props.detailDS.children;
    if (record.toData().collectorLineId) {
      collectorLineList.current.reset();
    } else {
      collectorLineList.remove(record);
    }
  }

  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    const { detailDS } = this.props;
    await detailDS.children.collectorLineList.delete([record]);
    detailDS.children.collectorLineList.query();
  }

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      key: 'collectorLine',
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.collectorLineList,
    };
    return <Table {...tableProps} />;
  }
}
