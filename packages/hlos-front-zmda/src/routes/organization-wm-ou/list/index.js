/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:28:03
 * @LastEditTime: 2020-09-29 10:33:05
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-仓储中心
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
import WmOuListDS from '../store/WmOuListDS';

const preCode = 'zmda.wmOu';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: [`${preCode}`],
})
export default class ZmdaWmOu extends Component {
  tableDS = new DataSet({
    ...WmOuListDS(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'wmOuCode', width: 150, lock: true },
      { name: 'wmOuName', width: 150, lock: true },
      { name: 'wmOuAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'organizationName', width: 150 },
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
        <Header title={intl.get(`${preCode}.view.title.wmOu`).d('仓储中心')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/wm-ou-views/excel`}
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
