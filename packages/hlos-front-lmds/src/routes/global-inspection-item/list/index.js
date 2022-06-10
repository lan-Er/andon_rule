/**
 * @Description: 检验项目管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 15:01:56
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Button, Lov } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import statusConfig from '@/common/statusConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import InspectionItemListDS from '../stores/InspectionItemListDS';

const preCode = 'lmds.inspectionItem';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { inspectionItem },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.inspectionItem', 'lmds.common'],
})
export default class InspectionItem extends Component {
  tableDS = new DataSet({
    ...InspectionItemListDS(),
  });

  get columns() {
    return [
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => this.editorRenderer(record, 'lov'),
        lock: true,
      },
      {
        name: 'inspectionItemCode',
        width: 150,
        editor: (record) => this.editorRenderer(record, 'text'),
        lock: true,
      },
      { name: 'inspectionItemName', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'inspectionItemAlias', width: 150, editor: true },
      { name: 'inspectionClass', width: 150, editor: true },
      { name: 'inspectionType', width: 150, editor: true },
      { name: 'inspectionResourceObj', width: 150, editor: <Lov noCache /> },
      { name: 'resultType', width: 150, editor: true },
      { name: 'defaultUcl', width: 150, editor: true },
      {
        name: 'defaultUclAccept',
        width: 150,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        renderer: yesOrNoRender,
      },
      { name: 'defaultLcl', width: 150, editor: true },
      {
        name: 'defaultLclAccept',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 150,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
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
   * 判断是否为新建，新建可编辑
   * @param {*} record
   */
  editorRenderer(record, type) {
    if (type === 'lov') {
      return record.status === 'add' ? <Lov noCache /> : null;
    }
    return record.status === 'add' ? <TextField /> : null;
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${inspectionItem}`,
        title: intl.get(`${preCode}.view.title.inspectionItemImport`).d('检验项目导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.inspectionItem`).d('检验项目')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/inspection-items/excel`}
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
