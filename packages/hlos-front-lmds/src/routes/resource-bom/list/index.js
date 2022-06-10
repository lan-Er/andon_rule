/*
 * @Author: zhang yang
 * @Description: 资源BOM  index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-10 14:31:04
 */
import React, { Component, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { connect } from 'dva';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import ResourceBomListDS from '../stores/ResourceBomListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const preCode = 'lmds.resourceBom';

@formatterCollections({
  code: ['lmds.resourceBom', 'lmds.common'],
})
@connect()
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ResourceBomListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class ResourceBomList extends Component {
  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'resourceBomType', width: 150 },
      { name: 'resourceBomCode', width: 150 },
      { name: 'resourceBomName', width: 150 },
      { name: 'description', width: 150 },
      { name: 'resourceBomVersion', width: 150 },
      { name: 'organizationObj', width: 150 },
      { name: 'resource', width: 150 },
      { name: 'startDate', width: 130, align: 'center' },
      { name: 'endDate', width: 130, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleToDetailPage('/lmds/resource-bom/detail', record)}
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
  handleCreate(url) {
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
  handleToDetailPage(url, record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('resourceBomId')}`,
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
        <Header title={intl.get(`${preCode}.view.title.resourceBom`).d('资源BOM')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/resource-bom/create')}
          >
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/resource-boms/excel`}
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
