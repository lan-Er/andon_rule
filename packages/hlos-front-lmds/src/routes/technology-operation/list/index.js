/*
 * @Author: zhang yang
 * @Description: 工序 Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-04 19:56:37
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import withProps from 'utils/withProps';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import OperationListDS from '../stores/OperationListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const preCode = 'lmds.operation';
const {
  importTemplateCode: { operation },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: ['lmds.operation', 'lmds.common'],
})
@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...OperationListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class OperationList extends Component {
  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'operationCode', width: 128, lock: true },
      { name: 'operationName', width: 128, lock: true },
      { name: 'operationAlias', width: 128 },
      { name: 'description', width: 128 },
      { name: 'operationCategory', width: 128 },
      { name: 'operationType', width: 100 },
      { name: 'keyOperationFlag', width: 80, align: 'center', renderer: yesOrNoRender },
      { name: 'organization', width: 128 },
      { name: 'item', width: 128 },
      { name: 'itemDescription', width: 200 },
      { name: 'processTime', width: 82 },
      { name: 'standardWorkTime', width: 82 },
      { name: 'referenceDocument', width: 128 },
      { name: 'processProgram', width: 128 },
      { name: 'collector', width: 128 },
      { name: 'instruction', width: 128 },
      { name: 'downstreamOperation', width: 128 },
      { name: 'executeRule', width: 128 },
      { name: 'inspectionRule', width: 128 },
      { name: 'dispatchRule', width: 128 },
      { name: 'packingRule', width: 128 },
      { name: 'reworkRule', width: 128 },
      { name: 'externalId', width: 128 },
      {
        name: 'enabledFlag',
        width: 70,
        align: 'center',
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
              onClick={() => this.handleToDetailPage('/lmds/operation/detail', record)}
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
        pathname: `${url}/${record.get('operationId')}`,
      })
    );
  }

  @Bind()
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${operation}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`lmds.itemRouting.view.title.operationImport`).d('工序导入'),
      search: queryString.stringify({
        action: intl.get(`lmds.itemRouting.view.title.operationImport`).d('工序导入'),
      }),
    });
  }

  @Bind
  getExportQueryParams() {
    const { tableDS: ds } = this.props;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      // tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.operation`).d('工序')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/operation/create')}
          >
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/operations/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
            autoHeight="true"
          />
        </Content>
      </Fragment>
    );
  }
}
