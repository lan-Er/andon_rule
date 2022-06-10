/**
 * @Description: 计划中心管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-20 10:48:13
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Lov, Button, TextField } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ApsOuListDS from '../stores/ApsOuListDS';

const preCode = 'lmds.apsOu';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.apsOu', 'lmds.common'],
})
export default class ApsOu extends Component {
  tableDS = new DataSet({
    ...ApsOuListDS(),
  });

  get columns() {
    return [
      { name: 'enterpriseObj', width: 150, editor: record => record.status === 'add' ? <Lov noCache />: null, lock: true },
      { name: 'apsOuCode', width: 150, editor: record => record.status === 'add' ? <TextField /> : null, lock: true },
      { name: 'apsOuName', width: 150, editor: true},
      { name: 'apsOuAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'planStartTime', width: 200, editor: true },
      { name: 'periodicType', width: 150, editor: true },
      { name: 'demandTimeFence', width: 150, editor: true },
      { name: 'fixTimeFence', width: 150, editor: true },
      { name: 'frozenTimeFence', width: 150, editor: true },
      { name: 'forwardPlanTimeFence', width: 150, editor: true },
      { name: 'releaseTimeFence', width: 150, editor: true },
      { name: 'orderTimeFence', width: 150, editor: true },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: [ 'edit' ],
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

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.apsOu`).d('计划中心')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/aps-ous/excel`}
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


