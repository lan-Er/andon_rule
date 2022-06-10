/**
 * @Description: 制造协同-供应商主数据
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-09 11:23:56
 */

import React, { Component, Fragment } from 'react';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import queryString from 'query-string';
import statusConfig from '@/common/statusConfig';
import SupplierListDS from './store/SupplierListDS';

const preCode = 'zmda.supplier';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { supplier },
} = statusConfig.statusValue.zmda;

export default class ZmdaSupplier extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...SupplierListDS(),
    });
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${supplier}`,
        title: intl.get(`${preCode}.view.title.supplierImport`).d('供应商导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'supplierAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'supplierCategory', width: 150 },
      { name: 'buyerCode', width: 150 },
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
      { name: 'enabledFlag', width: 100, align: 'center', renderer: yesOrNoRender },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.supplier`).d('供应商')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/suppliers/excel`}
            queryParams={this.getExportQueryParams}
          />
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('zmda.common.button.import').d('导入')}
          </HButton>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
