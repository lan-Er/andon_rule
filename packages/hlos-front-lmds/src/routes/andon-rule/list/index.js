import { Button, DataSet, Table } from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import { Content, Header } from 'components/Page';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import React, { Component, Fragment } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import withProps from 'utils/withProps';
import RuleListDS from '../stores/RuleListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const preCode = 'lmds.andonRule';

@formatterCollections({
  code: ['lmds.andonRule', 'lmds.common'],
})
@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...RuleListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class AndonRule extends Component {
  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'organizationObj', width: 150, lock: true },
      { name: 'andonRuleType', width: 150, lock: true },
      { name: 'andonRuleCode', width: 150, lock: true },
      { name: 'andonRuleName', width: 150, lock: true },
      { name: 'andonRuleAlias', width: 150 },
      { name: 'description', width: 150 },
      {
        name: 'enabledFlag',
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
              onClick={() => this.handleToDetailPage('/lmds/andon-rule/detail', record)}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   *
   *跳转到新建页面
   * @param service
   * @param e
   */
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
   * @param record
   * @param service
   * @param e
   */
  @Bind()
  handleToDetailPage(url, record, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('andonRuleId')}`,
      })
    );
  }

  /**
   * 获取导出字段查询参数
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
        <Header title={intl.get(`${preCode}.view.title.andonRule`).d('安灯规则')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/andon-rule/create')}
          >
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/andon-rules/excel`}
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
