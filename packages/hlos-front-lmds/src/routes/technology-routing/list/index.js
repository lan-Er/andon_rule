/**
 * @Description: 工艺路线管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:27:24
 * @LastEditors: yu.na
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
import statusConfig from '@/common/statusConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import RoutingListDS from '../stores/RoutingListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const preCode = 'lmds.routing';
const {
  importTemplateCode: { routing },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: ['lmds.routing', 'lmds.common'],
})
@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...RoutingListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class Routing extends Component {
  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'routingType', width: 128, lock: true },
      { name: 'routingCode', width: 128, lock: true },
      { name: 'description', width: 200 },
      { name: 'routingVersion', width: 84, align: 'center' },
      { name: 'organizationObj', width: 128 },
      { name: 'itemObj', width: 128 },
      { name: 'itemDescription', width: 200 },
      { name: 'alternate', width: 128 },
      { name: 'startDate', width: 128, align: 'center' },
      { name: 'endDate', width: 128, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleToDetailPage('/lmds/routing/detail', record)}
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
        pathname: `${url}/${record.get('routingId')}`,
      })
    );
  }

  @Bind()
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${routing}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.routingImport`).d('工艺路线导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.routingImport`).d('工艺路线导入'),
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
        <Header title={intl.get(`${preCode}.view.title.routing`).d('工艺路线')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/routing/create')}
          >
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/routings/excel`}
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
