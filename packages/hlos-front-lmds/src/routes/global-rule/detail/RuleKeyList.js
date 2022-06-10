/**
 * @Description: 规则详情页面--规则项列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:15
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, CheckBox, Select, TextField, Button, Tooltip } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class DetailList extends PureComponent {
  get columns() {
    return [
      { name: 'ruleKeyCode', editor: (record) => (record.status === 'add' ? <TextField /> : null) },
      { name: 'ruleKeyName', editor: true },
      { name: 'description', editor: true },
      { name: 'ruleKeyType', editor: (record) => (record.status === 'add' ? <Select /> : null) },
      { name: 'ruleKeyValue', editor: true },
      {
        name: 'enabledFlag',
        editor: <CheckBox />,
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
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
    const { ruleKeyList } = this.props.detailDS.children;
    if (record.toData().ruleKeyId) {
      ruleKeyList.current.reset();
    } else {
      ruleKeyList.remove(record);
    }
  }

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.ruleKeyList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
