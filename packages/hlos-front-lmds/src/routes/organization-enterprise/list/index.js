/*
 * @Description: 集团管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { CheckBox, Table, DataSet, TextField, Button, Lov } from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from "utils/intl";
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { Content, Header } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import EnterpriseListDS from '../store/EnterpriseListDS';

const intlPrefix = 'lmds.enterprise';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })
class Enterprise extends Component {

  enterpriseListDs = new DataSet({
    ...EnterpriseListDS(),
  });

  commands = () => [
    'edit',
  ];

  @Bind
  handleCreate () {
    this.enterpriseListDs.create({}, 0);
  }

  get columns () {
    return [
      {
        name: 'enterpriseCode',
        width: 150,
        editor: record => record.status === 'add' ? <TextField /> : null,
        lock: true,
      },
      { name: 'enterpriseName', width: 150, editor: true, lock: true },
      { name: 'enterpriseAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'locationObj', width: 200, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      {
        name: 'enabledFlag',
        width: 100,
        minWidth: 100,
        align: 'center',
        editor: record => record.editing ? <CheckBox /> : null,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        lock: 'right',
        command: this.commands,
      },
    ];
  }

  @Bind
  getExportQueryParams() {
    const {
      enterpriseListDs: ds,
    } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { enterpriseListDs } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.enterprise`).d('集团')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/enterprises/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={enterpriseListDs}
            pagination
            editMode="inline"
            selectionMode='click'
            columns={this.columns}
          />
        </Content>
      </Fragment>
    );
  }
}

export default Enterprise;
