/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:16:00
 * @LastEditTime: 2020-09-29 10:26:09
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-车间
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
import meAreaListDS from '../store/MeAreaListDS';

const preCode = 'zmda.meArea';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: [`${preCode}`],
})
export default class ZmdaMeArea extends Component {
  tableDS = new DataSet({
    ...meAreaListDS(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'meAreaCode', width: 150, lock: true },
      { name: 'meAreaName', width: 150, lock: true },
      { name: 'meAreaAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'meOu', width: 150 },
      { name: 'issueWarehouse', width: 150 },
      { name: 'issueWmArea', width: 150 },
      { name: 'completeWarehouse', width: 150 },
      { name: 'completeWmArea', width: 150 },
      { name: 'inventoryWarehouse', width: 150 },
      { name: 'inventoryWmArea', width: 150 },
      { name: 'locationName', width: 150 },
      { name: 'externalOrganization', width: 150 },
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
        <Header title={intl.get(`${preCode}.view.title.meArea`).d('车间')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/me-area-views/excel`}
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
