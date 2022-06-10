/*
 * @Description: 工厂管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: Please set LastEditors
 */
import * as React from 'react';
import { DataSet, Table, TextField, Button, Lov, CheckBox } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { userSetting } from 'hlos-front/lib/services/api';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import MeOuListDs from '../stores/MeOuListDs';

const intlPrefix = 'lmds.meOu';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class MeOuList extends React.Component {
  meOuListDs = new DataSet({
    ...MeOuListDs(),
  });

  handleLovEditableOnAdd(record) {
    if (record.get('enterpriseObj')) {
      return record.status === 'add' ? <Lov noCache /> : null;
    } else {
      return <Lov onClick={() => notification.warning({ message: '请先选择集团' })} />;
    }
  }

  get columns() {
    return [
      {
        name: 'meOuCode',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 150,
        lock: true,
      },
      { name: 'meOuName', editor: true, width: 150, lock: true },
      { name: 'meOuAlias', editor: true, width: 150 },
      { name: 'description', width: 150, editor: true },
      { name: 'enterpriseObj', width: 150, editor: true },
      { name: 'apsOuObj', editor: this.handleLovEditableOnAdd, width: 150 },
      { name: 'scmOuObj', editor: this.handleLovEditableOnAdd, width: 150 },
      { name: 'sopOuObj', editor: this.handleLovEditableOnAdd, width: 150 },
      { name: 'issueWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'issueWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'completeWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'completeWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'inventoryWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'inventoryWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      {
        name: 'enabledFlag',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : null),
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
  async handleCreate() {
    const res = await userSetting({ defaultFlag: 'Y' });
    this.meOuListDs.create({}, 0);
    this.meOuListDs.current.set('organizationId', res.content[0].organizationId);
  }

  @Bind
  getExportQueryParams() {
    const { meOuListDs: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { meOuListDs } = this;
    return (
      <React.Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.meOu`).d('工厂')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/me-ous/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            editMode="inline"
            key="enemy"
            columns={this.columns}
            dataSet={meOuListDs}
            columnResizable
          />
        </Content>
      </React.Fragment>
    );
  }
}
