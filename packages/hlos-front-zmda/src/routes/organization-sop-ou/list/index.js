/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-29 10:47:22
 * @LastEditTime: 2020-09-29 10:56:55
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-销售中心
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
import SopOuListDs from '../store/SopOuListDS';

const preCode = 'zmda.sopOu';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${preCode}`],
})
export default class ZmdaSopOuList extends React.Component {
  SopOuListDs = new DataSet({
    ...SopOuListDs(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      {
        name: 'enterpriseName',
        width: 150,
        lock: true,
      },
      {
        name: 'sopOuCode',
        width: 150,
        lock: true,
      },
      { name: 'sopOuName', width: 150 },
      { name: 'sopOuAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'locationName', width: 150 },
      { name: 'externalOrganization', width: 150 },
      { name: 'enabledFlag', width: 120 },
    ];
  }

  @Bind
  getExportQueryParams() {
    const queryDataDs =
      this.SopOuListDs && this.SopOuListDs.queryDataSet && this.SopOuListDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.sopOu`).d('销售中心')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/sop-ou-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table columns={this.columns} dataSet={this.SopOuListDs} columnResizable />
        </Content>
      </React.Fragment>
    );
  }
}
