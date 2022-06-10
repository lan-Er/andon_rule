import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, Button, Lov, Select, CheckBox } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import AssignListDS from '../stores/AssignListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const preCode = 'lmds.psiElementAssign';

@formatterCollections({
  code: ['lmds.psiElementAssign', 'lmds.common'],
})
@connect(state => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...AssignListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class PsiElementAssign extends Component {

  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'assignType', width: 150, editor: record => record.status === 'add'? <Select />: null, lock: true },
      { name: 'sourceObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null, lock: true },
      { name: 'elementObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null, lock: true },
      { name: 'displayAreaMeaning', width: 150 },
      { name: 'mainCategory', width: 150 },
      { name: 'subCategory', width: 150 },
      { name: 'description', width: 150 },
      { name: 'orderByCode', editor: true, width: 150 },
      {
        name: 'displayFlag',
        align: 'center',
        editor: record => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'enabledFlag',
        align: 'center',
        editor: record => (record.editing ? <CheckBox /> : false),
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit', 'delete'],
        lock: 'right',
      },
    ];
  }

  get queryFields() {
    return {
      'sourceObj': <Lov name="sourceObj" clearButton noCache />,
    };
  }

  /**
   *新增行
   */
  @Bind()
  handleAddLine() {
   this.props.tableDS.create({}, 0);
  }

  /**
   *
   *跳转到初始化页面
   * @param url
   */
  @Bind()
  handleToInitialPage(url) {
    this.props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  /**
   * 获取导出字段查询参数
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
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.psiElementAssign`).d('PSI要素分配')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/psi-element-assigns/excel`}
            queryParams={this.getExportQueryParams}
          />
          <Button
            icon="refresh"
            color="primary"
            onClick={() => this.handleToInitialPage('/lmds/psi-element-assign/initial')}
          >
            {intl.get('lmds.psiElementAssign.button.initial').d('初始化')}
          </Button>
        </Header>
        <Content>
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
            queryFieldsLimit={4}
            queryFields={this.queryFields}
          />
        </Content>
      </Fragment>
    );
  }
}
