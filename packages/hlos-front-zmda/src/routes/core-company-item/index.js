/**
 * @Description: 制造协同-核企物料主数据查询
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-03 11:06:56
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import CoreCompanyItemListDS from './store/CoreCompanyItemListDS';

const preCode = 'zmda.item';
const organizationId = getCurrentOrganizationId();

export default class ZmdaCoreCompanyItem extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...CoreCompanyItemListDS(),
      autoQuery: true,
    });
  }

  get columns() {
    return [
      { name: 'organizationName', width: 150, lock: true },
      { name: 'meOuObj', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'description', width: 150, lock: true },
      { name: 'itemAlias', width: 150 },
      { name: 'shortCode', width: 150 },
      { name: 'itemType', width: 150 },
      { name: 'designCode', width: 150 },
      { name: 'specification', width: 150 },
      { name: 'uomObj', width: 150 },
      { name: 'secondUomObj', width: 150 },
      { name: 'uomConversionValue', width: 150 },
      { name: 'length', width: 150 },
      { name: 'width', width: 150 },
      { name: 'height', width: 150 },
      { name: 'area', width: 150 },
      { name: 'volume', width: 150 },
      { name: 'unitWeight', width: 150 },
      { name: 'grossWeight', width: 150 },
      { name: 'itemIdentifyCode', width: 150 },
      { name: 'drawingCode', width: 150 },
      { name: 'featureCode', width: 150 },
      { name: 'featureDesc', width: 150 },
      { name: 'packingGroup', width: 150 },
      { name: 'hazardClass', width: 150 },
      { name: 'unNumber', width: 150 },
      { name: 'standardCost', width: 150 },
      { name: 'standardSalesPrice', width: 150 },
      { name: 'externalItemCodeObj', width: 150 },
      { name: 'externalDescription', width: 150 },
      { name: 'fileUrl', width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  @Bind()
  getExportQueryParams() {
    const { tableDS } = this;
    const queryDataDs = tableDS && tableDS.queryDataSet && tableDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.coreCompanyItem`).d('核企物料')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/item-views/excelItem`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
