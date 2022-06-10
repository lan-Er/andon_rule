/*
 * @Author: hongdong.shan@hand-china,com
 * @Date: 2020-09-29 10:58:31
 * @LastEditTime: 2020-09-29 11:02:53
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-销售组
 */

import * as React from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import SopGroupListDs from '../store/SopGroupListDS';

const preCode = 'zmda.sopGroup';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${preCode}`],
})
export default class ZmdaSopGroupList extends React.Component {
  SopGroupListDs = new DataSet({
    ...SopGroupListDs(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      {
        name: 'sopOuName',
        width: 150,
        lock: true,
      },
      {
        name: 'sopGroupCode',
        width: 150,
        lock: true,
      },
      { name: 'sopGroupName', width: 150 },
      { name: 'sopGroupAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'locationName', width: 150 },
      { name: 'externalOrganization', width: 150 },
      { name: 'enabledFlag', width: 100 },
    ];
  }

  @Bind
  getExportQueryParams() {
    const queryDataDs =
      this.SopGroupListDs &&
      this.SopGroupListDs.queryDataSet &&
      this.SopGroupListDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.sopGroup`).d('销售组')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/sop-group-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table columns={this.columns} dataSet={this.SopGroupListDs} columnResizable />
        </Content>
      </React.Fragment>
    );
  }
}
