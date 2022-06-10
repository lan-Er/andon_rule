/**
 * @Description: 库位
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-09 11:51:55
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button, TextField, CheckBox } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ListDS from '../store/LibraryPositionDS';

const preCode = 'zmda.libraryPosition';
export default class ZmdaLibraryPosition extends Component {
  tableDS = new DataSet({
    ...ListDS(),
  });

  get columns() {
    return [
      {
        name: 'inventorySeatCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      { name: 'inventorySeatName', width: 150, editor: true },
      {
        name: 'inventoryHouseObj',
        width: 150,
        editor: true,
      },
      {
        name: 'inventoryOrgName',
        width: 150,
      },
      {
        name: 'businessUnitName',
        width: 150,
      },
      {
        name: 'sourceCode',
        align: 'center',
      },
      {
        name: 'enabledFlag',
        align: 'center',
        editor: <CheckBox dataSet={this.tableDS} name="enabledFlag" />,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            record.status === 'add' ? <a onClick={() => this.handleDelete(record)}>删除</a> : null,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 删除
   * @param {*} record 行记录
   */
  @Bind
  async handleDelete(record) {
    this.tableDS.delete([record]);
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  /**
   * 新建
   */
  @Bind()
  async handleSave() {
    const validateValue = await this.tableDS.validate(false, false);
    if (!validateValue) {
      notification.warning({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    this.tableDS.submit();
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.libraryPosition`).d('库位')}>
          <Button icon="save" color="primary" onClick={this.handleSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="add" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
