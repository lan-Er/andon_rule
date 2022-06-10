/*
 * @Author: zhang yang
 * @Description: 销售组-- Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-18 13:45:28
 */

import * as React from 'react';
import { DataSet, Table, TextField, Lov, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import SopGroupListDs from '../stores/SopGroupListDs';

const intlPrefix = `lmds.common`;
const preCode = 'lmds.sopGroup';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({
  code: [`${intlPrefix}`, `${preCode}`],
})
export default class SopGroupList extends React.Component {
  SopGroupListDs = new DataSet({
    ...SopGroupListDs(),
  });

  get columns() {
    return [
      {
        name: 'sopOu',
        width: 150,
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'sopGroupCode',
        width: 150,
        editor: record => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'sopGroupName', width: 150, editor: true },
      { name: 'sopGroupAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      { name: 'enabledFlag', editor: true },
      {
        header: intl.get(`${commonButtonIntlPrefix}.action`).d('操作'),
        width: 120,
        command: () => ['edit'],
        lock: 'right',
      },
    ];
  }

  @Bind
  handleCreate() {
    this.SopGroupListDs.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const queryDataDs =
    this.SopGroupListDs && this.SopGroupListDs.queryDataSet && this.SopGroupListDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.sopGroup`).d('销售组')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/sop-groups/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            editMode="inline"
            key="enemy"
            columns={this.columns}
            dataSet={this.SopGroupListDs}
            columnResizable
          />
        </Content>
      </React.Fragment>
    );
  }
}
