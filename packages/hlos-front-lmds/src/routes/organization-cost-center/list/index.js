/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-25 10:12:58
 * @LastEditTime: 2020-08-26 11:06:04
 * @Description:成本中心
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Button, DataSet, Table, CheckBox, TextField } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import CostCenterListDS from '../stores/CostCenterListDS';

const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.costCenter', 'lmds.common'],
})
export default class CostCenter extends Component {
  tableDS = new DataSet({
    ...CostCenterListDS(),
  });

  get columns() {
    return [
      {
        name: 'costCenterCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'costCenterName', width: 150, editor: true },
      { name: 'costCenterAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'accountCode', width: 150, editor: true },
      { name: 'organizationObj', width: 150, editor: true },
      { name: 'departmentObj', width: 150, editor: true },
      { name: 'externalId', width: 150, editor: true },
      { name: 'externalNum', width: 150, editor: true },
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

  render() {
    return (
      <Fragment>
        <Header title="成本中心">
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/cost-centers/excel`}
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
