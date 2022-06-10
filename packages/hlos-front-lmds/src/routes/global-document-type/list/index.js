/*
 * @Author: zhang yang
 * @Description: 单据类型-- Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-19 16:40:31
 */
import React, { Component, Fragment } from 'react';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DataSet, Table, CheckBox, TextField, Button, Select, Lov } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { openTab } from 'utils/menuTab';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import DocumentTypeListDs from '../stores/DocumentTypeListDs';

const preCode = 'lmds.documentType';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: ['lmds.documentType', 'lmds.common'],
})
export default class DocumentTypeList extends Component {
  DocumentTypeListDs = new DataSet({
    ...DocumentTypeListDs(),
  });

  get columns() {
    return [
      {
        name: 'documentClass',
        width: 128,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'documentTypeCode',
        width: 128,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'documentTypeName', width: 128, editor: true, lock: true },
      { name: 'documentTypeAlias', width: 128, editor: true },
      { name: 'description', width: 200, editor: true },
      { name: 'organization', width: 128, editor: <Lov noCache /> },
      { name: 'documentCategory', width: 128, editor: true },
      { name: 'orderByCode', width: 70, editor: true },
      { name: 'docProcessRule', width: 128, editor: <Lov noCache /> },
      { name: 'approvalRule', width: 128, editor: true },
      { name: 'approvalWorkFlowObj', width: 128, editor: true },
      { name: 'numberRule', width: 128, editor: <Lov noCache /> },
      {
        name: 'printFlag',
        width: 80,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        renderer: yesOrNoRender,
      },
      { name: 'printTemplate', width: 200, editor: true },
      { name: 'externalCode', width: 200, editor: true },
      { name: 'externalId', width: 136, editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 80,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: () => ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.DocumentTypeListDs.create({}, 0);
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.DocumentTypeListDs.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.DOCUMENT_TYPE`,
      title: '单据类型导入',
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.documentType`).d('单据类型')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            导入
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/document-types/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.DocumentTypeListDs}
            columns={this.columns}
            columnResizable="true"
            selectionMode="dblclick"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
