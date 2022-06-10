/*
 * @Descripttion: 组织信息业务实体
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-07 15:23:39
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-08 10:41:02
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button, Modal, TextField, Form, CheckBox } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import ListDS from '../store/indexDS';

const preCode = 'zmda.operationUnit';
// let modal = null;
export default class ZmdaOperationUnit extends Component {
  tableDS = new DataSet({
    ...ListDS(),
  });

  get columns() {
    return [
      {
        name: 'businessUnitCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      { name: 'businessUnitName', width: 150, editor: true },
      {
        name: 'companyObj',
        width: 150,
        editor: true,
      },
      {
        name: 'addressNum',
        width: 150,
        editor: true,
      },
      { name: 'addressName', width: 150, editor: true },
      {
        name: 'fullAddress',
        width: 150,
        align: 'center',
        renderer: ({ value }) => {
          // const {
          //   country = '',
          //   province = '',
          //   city = '',
          //   county = '',
          //   addressDetail = '',
          // } = record.data;
          return (
            <a onClick={this.handleAddress} style={{ textAlign: 'center' }}>
              {/* {`${country || ''}${province || ''}${city || ''}${county || ''}${
                addressDetail || ''
              }` || '编辑'} */}
              {value || '编辑'}
            </a>
          );
        },
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

  @Bind()
  handleAddress() {
    Modal.open({
      key: 'zmda-operation-unit-address-modal',
      title: '详细地址',
      children: (
        <Form dataSet={this.tableDS}>
          <TextField name="country" key="country" />
          <TextField name="province" key="province" />
          <TextField name="city" key="city" />
          <TextField name="county" key="county" />
          <TextField name="addressDetail" key="addressDetail" />
        </Form>
      ),
      // onOk: this.handleAddressModalOk,
    });
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
        <Header title={intl.get(`${preCode}.view.title.operationUnit`).d('业务实体')}>
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
