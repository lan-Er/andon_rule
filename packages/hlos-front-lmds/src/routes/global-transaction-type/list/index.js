/**
 * @Description: 事务类型管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-18 15:09:36
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Select, Button, TextField, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Button as HButton } from 'hzero-ui';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { openTab } from 'utils/menuTab';

import TransactionTypeListDS from '../stores/TransactionTypeListDS';

const preCode = 'lmds.transactionType';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.transactionType', 'lmds.common'],
})
export default class TransactionType extends Component {
  tableDS = new DataSet({
    ...TransactionTypeListDS(),
  });

  get columns() {
    return [
      {
        name: 'transactionClass',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'transactionTypeCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'transactionTypeName', width: 150, editor: true, lock: true },
      { name: 'transactionTypeAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'organizationObj', width: 150, editor: <Lov noCache /> },
      { name: 'transactionCategory', width: 150, editor: true },
      { name: 'externalCode', width: 150, editor: true },
      { name: 'externalId', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.TRANSACTION_TYPE`,
      title: '事务类型导入',
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.transactionType`).d('事务类型')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            导入
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/transaction-types/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
