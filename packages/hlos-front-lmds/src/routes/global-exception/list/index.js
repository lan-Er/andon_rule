/*
 * @Author: zhang yang
 * @Description: 异常- i
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-18 13:50:07
 */

import * as React from 'react';
import { DataSet, Table, CheckBox, TextField, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import intl from 'utils/intl';
import queryString from 'query-string';
import { Bind } from 'lodash-decorators';
import { openTab } from 'utils/menuTab';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import statusConfig from '@/common/statusConfig';
import ExceptionListDs from '../stores/ExceptionListDs';

const intlPrefix = `lmds.common`;
const preCode = 'lmds.exception';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const {
  importTemplateCode: { exception },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: [`${intlPrefix}`, `${preCode}`],
})
export default class ExceptionList extends React.Component {
  ExceptionListDs = new DataSet({
    ...ExceptionListDs(),
  });

  get columns() {
    return [
      { name: 'exceptionClass', width: 150, editor: true, lock: true },
      { name: 'exceptionType', width: 150, editor: true, lock: true },
      {
        name: 'exceptionCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'exceptionName', width: 150, editor: true },
      { name: 'exceptionAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'exceptionCategory', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
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
    this.ExceptionListDs.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const { ExceptionListDs: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${exception}`,
        title: intl.get(`${preCode}.view.title.exceptionImport`).d('异常导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
          // tenantId: getCurrentOrganizationId(),
          // prefixPath: '/limp',
          // templateType: 'C',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.exception`).d('异常')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/exceptions/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            editMode="inline"
            key="enemy"
            columns={this.columns}
            dataSet={this.ExceptionListDs}
            columnResizable
          />
        </Content>
      </React.Fragment>
    );
  }
}
