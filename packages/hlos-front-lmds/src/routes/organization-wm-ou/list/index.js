/**
 * @Description -  仓储中心管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-07 16:18:40
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Button, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import WmOuListDS from '../stores/WmOuListDS';

const preCode = 'lmds.wmOu';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.wmOu', 'lmds.common'],
})

export default class wmOu extends Component {
  tableDS = new DataSet({
    ...WmOuListDS(),
  });

  get columns() {
    return [
      {
        name: 'wmOuCode',
        editor: (record) => record.status === 'add' ? <TextField /> : null,
        width: 150,
        lock: true,
      },
      { name: 'wmOuName', editor: true, width: 150, lock: true },
      { name: 'wmOuAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'organizationObj', width: 150, editor: <Lov noCache /> },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: record => record.editing ? <CheckBox /> : false,
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        lock: 'right',
        command: ['edit'],
      },
    ];
  };

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


  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.wmOu`).d('仓储中心')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/wm-ous/excel`}
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