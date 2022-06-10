/*
 * @Author: zhang yang
 * @Description: 供应商 I
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-28 14:47:23
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { Button as HButton } from 'hzero-ui';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import { isUndefined } from 'lodash';
import withProps from 'utils/withProps';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import statusConfig from '@/common/statusConfig';
import SupplierListDS from '../stores/SupplierListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const preCode = 'lmds.supplier';
const {
  importTemplateCode: { supplier },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: ['lmds.supplier', 'lmds.common'],
})
@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...SupplierListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class SupplierList extends Component {
  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'supplierAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'supplierCategory', width: 150 },
      { name: 'buyer', width: 150 },
      { name: 'supplierGroup', width: 150 },
      { name: 'societyNumber', width: 150 },
      { name: 'supplierRank', width: 150 },
      { name: 'supplierStatus', width: 150 },

      { name: 'consignFlag', width: 150 },
      { name: 'vmiFlag', width: 150 },
      { name: 'paymentDeadline', width: 150 },
      { name: 'paymentMethod', width: 150 },
      { name: 'currencyName', width: 150 },
      { name: 'taxRate', width: 150 },
      { name: 'countryRegion', width: 150 },
      { name: 'provinceState', width: 150 },
      { name: 'city', width: 150 },
      { name: 'address', width: 150 },

      { name: 'zipcode', width: 150 },
      { name: 'contact', width: 150 },
      { name: 'phoneNumber', width: 150 },
      { name: 'email', width: 150 },

      { name: 'startDate', width: 150, align: 'center' },
      { name: 'endDate', width: 150, align: 'center' },
      { name: 'externalId', width: 150 },
      { name: 'externalNum', width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
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
              onClick={() => this.handleToDetailPage('/lmds/supplier/detail', record)}
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
        pathname: `${url}/${record.get('supplierId')}`,
      })
    );
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

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/${supplier}`,
      title: intl.get(`${preCode}.view.title.supplierImport`).d('供应商导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.supplierImport`).d('供应商导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.supplier`).d('供应商')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/supplier/create')}
          >
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/suppliers/excel`}
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
