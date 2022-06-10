/**
 * @Description: 制造协同-客户主数据
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-09 10:15:16
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { DataSet, Table } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender, enableRender } from 'hlos-front/lib/utils/renderer';
import CustomerListDS from './store/CustomerListDS';

const preCode = 'zmda.customer';
const organizationId = getCurrentOrganizationId();

export default class ZmdaCustomer extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...CustomerListDS(),
    });
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind
  getExportQueryParams() {
    const { tableDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  get columns() {
    return [
      {
        name: 'customerNumber',
        width: 150,
        lock: true,
      },
      {
        name: 'customerName',
        width: 150,
        lock: true,
      },
      {
        name: 'customerAlias',
        width: 150,
      },
      {
        name: 'description',
        width: 150,
      },
      {
        name: 'category',
        width: 150,
      },
      {
        name: 'salesman',
        width: 150,
      },
      {
        name: 'customerGroup',
        width: 150,
      },
      {
        name: 'societyNumber',
        width: 150,
      },
      {
        name: 'customerRank',
        width: 150,
      },
      {
        name: 'customerStatus',
        width: 150,
        align: 'center',
        renderer: enableRender,
      },
      {
        name: 'consignFlag',
        width: 150,
      },
      {
        name: 'fobType',
        width: 150,
      },
      {
        name: 'paymentDeadline',
        width: 150,
      },
      {
        name: 'paymentMethod',
        width: 150,
      },
      {
        name: 'currency',
        width: 150,
      },
      {
        name: 'taxRate',
        width: 150,
      },
      {
        name: 'countryRegion',
        width: 150,
      },
      {
        name: 'provinceState',
        width: 150,
      },
      {
        name: 'city',
        width: 150,
      },
      {
        name: 'address',
        width: 150,
      },
      {
        name: 'zipcode',
        width: 150,
      },
      {
        name: 'contact',
        width: 150,
      },
      {
        name: 'phoneNumber',
        width: 150,
      },
      {
        name: 'email',
        width: 150,
      },
      {
        name: 'startDate',
        width: 130,
        align: 'center',
      },
      {
        name: 'endDate',
        width: 130,
        align: 'center',
      },
      {
        name: 'externalId',
        width: 150,
      },
      {
        name: 'externalNum',
        width: 150,
      },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.customer`).d('客户')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/customer-views/excel`}
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
