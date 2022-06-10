/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:34:24
 * @LastEditTime: 2020-09-29 10:45:18
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-仓库
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import WarehouseListDS from '../store/WarehouseListDS';

const preCode = 'zmda.warehouse';
const organizationId = getCurrentOrganizationId();
@connect()
@formatterCollections({
  code: [`${preCode}`],
})
export default class ZmdaWareHouse extends Component {
  tableDS = new DataSet({
    ...WarehouseListDS(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      {
        name: 'wmOuName',
        lock: true,
        width: 150,
      },
      {
        name: 'organizationName',
        width: 150,
        lock: true,
      },
      {
        name: 'categoryName',
        width: 150,
      },
      {
        name: 'warehouseCode',
        width: 150,
      },
      {
        name: 'warehouseName',
        width: 150,
      },
      {
        name: 'warehouseAlias',
        width: 150,
      },
      {
        name: 'description',
        width: 150,
      },
      {
        name: 'warehouseGroup',
        width: 150,
      },
      {
        name: 'onhandFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'negativeFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'wmAreaFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'wmUnitFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'tagFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'lotFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'planFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'locationName',
        width: 150,
      },
      {
        name: 'externalOrganization',
        width: 150,
      },
      {
        name: 'enabledFlag',
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
    ];
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.warehouse`).d('仓库')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/warehouse-views/excel`}
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
