/*
 * @Author: zhang yang
 * @Description: file content
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 14:39:48
 */

import * as React from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import withProps from 'utils/withProps';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Button, CheckBox } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import RuleAssignListDS from '../stores/RuleAssignListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';

@formatterCollections({
  code: ['lmds.ruleAssign', 'lmds.common'],
})
@connect(state => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...RuleAssignListDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class RuleAssignList extends React.Component {

  componentDidMount() {
    this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'rule', width: 150 },
      { name: 'organization', width: 150 },
      { name: 'resource', width: 150 },
      { name: 'itemCategory', width: 150 },
      { name: 'item', width: 150 },
      { name: 'operation', width: 150 },
      {
        name: 'enabledFlag',
        editor: record => record.editing ? <CheckBox /> : false,
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleToDetailPage('/lmds/rule-assign/detail', record)}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  @Bind()
  handleCreate(url, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  /**
   *
   *跳转到详情
   * @param recode
   * @param service
   * @param e
   */
  @Bind()
  handleToDetailPage(url, record, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('assignId')}`,
      })
    );
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const {
      tableDS,
    } = this.props;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title="规则分配">
          <Button icon="add" color="primary" onClick={() => this.handleCreate('/lmds/rule-assign/create')}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/rule-assigns/excel`}
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
      </React.Fragment>
    );
  }
}
