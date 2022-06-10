/*
 * @Author: zhang yang
 * @Description: 移动类型 dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-21 15:38:48
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Button as HButton } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DataSet, Table, CheckBox, Lov, Button, TextField, Select } from 'choerodon-ui/pro';
import { openTab } from 'utils/menuTab';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import MoveTypeListDs from '../stores/MoveTypeListDs';

const preCode = 'lmds.moveType';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.moveType', 'lmds.common'],
})
export default class MoveTypeList extends Component {
  tableDS = new DataSet({
    ...MoveTypeListDs(),
  });

  get columns() {
    return [
      {
        name: 'organization',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'wmType',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'wmMoveClass',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'moveTypeCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'moveTypeName', width: 150, editor: true },
      { name: 'moveTypeAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'wmMoveCategory', width: 150, editor: true },
      { name: 'eventType', width: 150, editor: <Lov noCache /> },
      { name: 'transactionType', width: 150, editor: <Lov noCache /> },
      { name: 'costCenter', width: 150, editor: true },
      { name: 'department', width: 150, editor: <Lov noCache /> },
      { name: 'warehouse', width: 150, editor: <Lov noCache /> },
      { name: 'wmArea', width: 150, editor: <Lov noCache /> },
      { name: 'workcell', width: 150, editor: <Lov noCache /> },
      { name: 'location', width: 150, editor: <Lov noCache /> },
      { name: 'toWarehouse', width: 150, editor: <Lov noCache /> },
      { name: 'toWmArea', width: 150, editor: <Lov noCache /> },
      { name: 'toWorkcell', width: 150, editor: <Lov noCache /> },
      { name: 'toLocation', width: 150, editor: <Lov noCache /> },
      { name: 'viaWarehouse', width: 150, editor: <Lov noCache /> },
      { name: 'viaWmArea', width: 150, editor: <Lov noCache /> },
      { name: 'viaWorkcell', width: 150, editor: <Lov noCache /> },
      { name: 'viaLocation', width: 150, editor: <Lov noCache /> },
      { name: 'toOrganization', width: 150, editor: <Lov noCache /> },
      {
        name: 'transInOrgFlag',
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'transBetweenOrgsFlag',
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'inventoryAdjustFlag',
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'scrapFlag',
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'internalUseFlag',
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'itemSwitchFlag',
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'externalCode', editor: true, width: 150 },
      { name: 'externalId', editor: true, width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
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
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const { tableDS } = this;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.WM_MOVE_TYPE`,
      title: '移动类型导入',
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.moveType`).d('移动类型')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            导入
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/wm-move-types/excel`}
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
