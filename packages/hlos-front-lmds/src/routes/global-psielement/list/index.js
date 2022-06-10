/**
 * @Description: PSI要素管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-06 11:27:14
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { Button, Table, DataSet, CheckBox, Select, TextField, IntlField } from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import PsiElementDS from '../stores/PsiElementDS';

const preCode = 'lmds.psiElement';
const commonCode = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();
@formatterCollections({
  code: [`${preCode}`, 'lmds.common'],
})
export default class PSIElement extends React.Component {
  psiElementDS = new DataSet({
    ...PsiElementDS(),
  });

  /**
   * 新建
   *
   * @memberof PSIElement
   */
  @Bind
  handleCreate() {
    this.psiElementDS.create({}, 0);
  }

  /**
   *导出
   *
   * @returns
   * @memberof PSIElement
   */
  @Bind
  getExportQueryParams() {
    const { psiElementDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  get columns() {
    return [
      {
        name: 'displayArea',
        editor: record => {
          return record.status === 'add' ? <Select /> : null;
        },
        width: 150,
      },
      {
        name: 'elementType',
        editor: record => {
          return record.status === 'add' ? <Select /> : null;
        },
        width: 150,
      },
      { name: 'elementGroup', editor: record => (record.editing ? <Select /> : null), width: 150 },
      {
        name: 'elementCode',
        editor: record => {
          return record.status === 'add' ? <TextField /> : null;
        },
        width: 150,
      },
      {
        name: 'mainCategory',
        editor: record => (record.editing ? <TextField /> : null),
        width: 150,
      },
      {
        name: 'subCategory',
        editor: record => (record.editing ? <TextField /> : null),
        width: 150,
      },
      {
        name: 'description',
        editor: record => (record.editing ? <IntlField /> : null),
        width: 150,
      },
      {
        name: 'orderByCode',
        editor: record => (record.editing ? <TextField /> : null),
        width: 150,
      },
      {
        name: 'initialFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'initialStartTime',
        editor: record => (record.editing ? <Select /> : null),
        width: 150,
      },
      {
        name: 'editFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      { name: 'editStartTime', editor: record => (record.editing ? <Select /> : null), width: 150 },
      {
        name: 'deductionFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'deductionRule',
        editor: record => (record.editing ? <TextField /> : null),
        width: 150,
      },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get(`${commonCode}.action`).d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.psiElement`).d('PSI要素')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonCode}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/psi-elements/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.psiElementDS}
            columns={this.columns}
            editMode="inline"
            selectionMode="click"
          />
        </Content>
      </React.Fragment>
    );
  }
}
