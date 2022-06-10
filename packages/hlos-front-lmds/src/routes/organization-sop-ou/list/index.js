/*
 * @Author: zhang yang
 * @Description: 销售中心--Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-18 10:05:07
 */

import * as React from 'react';
import { DataSet, Table, Lov, TextField, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import SopOuListDs from '../stores/SopOuListDs';

const intlPrefix = `lmds.common`;
const preCode = 'lmds.sopOu';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({
  code: [`${intlPrefix}`, `${preCode}`],
})
export default class SopOuList extends React.Component {
  SopOuListDs = new DataSet({
    ...SopOuListDs(),
  });

  get columns() {
    return [
      {
        name: 'enterpriseObj',
        width: 150,
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'sopOuCode',
        width: 150,
        editor: record => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'sopOuName', width: 150, editor: true },
      { name: 'sopOuAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      { name: 'enabledFlag', width: 120, editor: true },
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
    this.SopOuListDs.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const queryDataDs = this.SopOuListDs && this.SopOuListDs.queryDataSet && this.SopOuListDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.sopOu`).d('销售中心')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/sop-ous/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            editMode="inline"
            key="enemy"
            columns={this.columns}
            dataSet={this.SopOuListDs}
            columnResizable
          />
        </Content>
      </React.Fragment>
    );
  }
}
