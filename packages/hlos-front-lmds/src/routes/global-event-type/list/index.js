/**
 * @Description: 事件类型管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-18 15:21:39
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Button, TextField, Select, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Button as HButton } from 'hzero-ui';
import { openTab } from 'utils/menuTab';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import EventTypeListDS from '../stores/EventTypeListDS';

const preCode = 'lmds.eventType';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.eventType', 'lmds.common'],
})
export default class EventType extends Component {
  tableDS = new DataSet({
    ...EventTypeListDS(),
  });

  get columns() {
    return [
      {
        name: 'eventClass',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'eventTypeCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'eventTypeName', width: 150, editor: true, lock: true },
      { name: 'eventTypeAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'organizationObj', width: 150, editor: <Lov noCache /> },
      { name: 'eventCategory', width: 150, editor: true },
      { name: 'relatedEventTypeObj', width: 150, editor: <Lov noCache /> },
      { name: 'relatedTransactionTypeObj', width: 150, editor: <Lov noCache /> },
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
      key: `/himp/commentImport/LMDS.EVENT_TYPE`,
      title: '事件类型导入',
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.eventType`).d('事件类型')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            导入
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/event-types/excel`}
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
