/*
 * @Author: zhang yang
 * @Description: 安灯异常 - I
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-29 13:27:12
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import withProps from 'utils/withProps';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DataSet, Table, CheckBox, Button, Lov } from 'choerodon-ui/pro';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import ExceptionDS from '../stores/ExceptionDS';

const preCode = 'lmds.lmdsAndonException';
const orgId = getCurrentOrganizationId();

@formatterCollections({
  code: ['lmds.lmdsAndonException', 'lmds.common'],
})
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ExceptionDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@connect()
export default class ExceptionList extends Component {
  get columns() {
    return [
      {
        name: 'organizationObj',
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'andonClass',
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      { name: 'andon', editor: <Lov noCache />, lock: true },
      { name: 'exceptionGroup', editor: <Lov noCache />, lock: true },
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
    this.props.tableDS.create({}, 0);
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const { tableDS } = this.props;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.exception`).d('安灯异常')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${orgId}/andon-exception-groups/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
