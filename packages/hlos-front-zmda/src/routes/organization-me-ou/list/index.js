/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 09:55:18
 * @LastEditTime: 2020-09-29 10:13:15
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-工厂
 */

import * as React from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import MeOuListDs from '../store/MeOuListDS';

const intlPrefix = 'zmda.meOu';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`],
})
export default class ZmdaMeOuList extends React.Component {
  meOuListDs = new DataSet({
    ...MeOuListDs(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'meOuCode', width: 150, lock: true },
      { name: 'meOuName', width: 150, lock: true },
      { name: 'meOuAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'enterprise', width: 150 },
      { name: 'apsOu', width: 150 },
      { name: 'scmOu', width: 150 },
      { name: 'sopOu', width: 150 },
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
        width: 100,
        renderer: yesOrNoRender,
      },
    ];
  }

  @Bind
  getExportQueryParams() {
    const { meOuListDs: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { meOuListDs } = this;
    return (
      <React.Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.meOu`).d('工厂')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/me-ou-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table columns={this.columns} dataSet={meOuListDs} columnResizable />
        </Content>
      </React.Fragment>
    );
  }
}
