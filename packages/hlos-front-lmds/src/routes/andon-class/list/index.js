/*
 * @Author: zhang yang
 * @Description: 安灯分类 - index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 09:04:51
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DataSet, Table, CheckBox, TextField, Button } from 'choerodon-ui/pro';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import AndonClassDS from '../stores/AndonClassDS';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.andonClass';

@connect()
@formatterCollections({
  code: ['lmds.andonClass', 'lmds.common'],
})
export default class AndonClass extends React.Component {
  tableDS = new DataSet({
    ...AndonClassDS(),
  });

  get columns() {
    return [
      {
        name: 'andonClassCode',
        editor: record => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'andonClassName', editor: true, lock: true },
      { name: 'andonClassAlias', editor: true },
      { name: 'description', editor: true },
      { name: 'orderByCode', editor: true },
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
        command: ['edit'],
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
        <Header title={intl.get(`${preCode}.view.title.andonClass`).d('安灯分类')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/andon-classs/excel`}
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
