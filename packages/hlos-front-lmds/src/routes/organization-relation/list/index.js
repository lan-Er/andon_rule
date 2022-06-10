/*
 * @Author: zhang yang
 * @Description: 组织关系-- Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-19 11:06:53
 */

import * as React from 'react';
import { DataSet, Table, Lov, Button, Select, CheckBox } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import OrgRelationListDs from '../stores/OrgRelationListDs';

const organizationId = getCurrentOrganizationId();

const intlPrefix = `lmds.common`;
const preCode = 'lmds.orgRelation';
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({
  code: [`${intlPrefix}`, `${preCode}`],
})
export default class OrgRelationList extends React.Component {
  OrgRelationListDs = new DataSet({
    ...OrgRelationListDs(),
  });

  get columns() {
    return [
      {
        name: 'relationType',
        width: 150,
        editor: record => (record.status === 'add' ? <Select /> : null),
      },
      {
        name: 'organization',
        width: 150,
        disable: true,
        editor: record =>
          record.status === 'add' ? (
            <Lov noCache disabled={isEmpty(record.get('relationType'))} />
          ) : null,
      },
      { name: 'organizationDesc', width: 150 },
      {
        name: 'relatedOrganization',
        width: 150,
        disable: true,
        editor: record =>
          record.status === 'add' ? (
            <Lov noCache disabled={isEmpty(record.get('relationType'))} />
          ) : null,
      },
      { name: 'relatedOrganizationDesc', width: 150, editor: false },
      {
        name: 'enabledFlag',
        width: 100,
        renderer: yesOrNoRender,
        editor: record => (record.editing ? <CheckBox /> : false),
      },
      {
        header: intl.get(`${commonButtonIntlPrefix}.action`).d('操作'),
        width: 100,
        command: () => ['edit'],
        lock: 'right',
      },
    ];
  }

  @Bind
  handleCreate() {
    this.OrgRelationListDs.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const formObj = this.OrgRelationListDs.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.orgRelation`).d('组织关系')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/organization-relations/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            columns={this.columns}
            dataSet={this.OrgRelationListDs}
            editMode="inline"
            selectionMode="click"
          />
        </Content>
      </React.Fragment>
    );
  }
}
