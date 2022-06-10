/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-28 16:15:18
 * @LastEditTime: 2020-09-28 16:32:37
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-组织
 */

import React, { Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import OrganizationListDS from '../store/OrganizationDS';

const intlPrefix = 'zmda.organization';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`],
})
export default class ZmdaOrganization extends React.Component {
  organizationListDs = new DataSet({
    ...OrganizationListDS(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'organizationCode', width: 150, lock: true },
      { name: 'organizationLevel', width: 150, lock: true },
      { name: 'organizationName', width: 150 },
      { name: 'organizationAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'organizationClassMeaning', width: 150 },
      { name: 'organizationTypeMeaning', width: 150 },
      { name: 'parentOrganizationName', width: 150 },
      { name: 'locationName', width: 150 },
      { name: 'externalOrganization', width: 150 },
      { name: 'enabledFlag', width: 100, renderer: yesOrNoRender },
    ];
  }

  @Bind
  getExportQueryParams() {
    const { organizationListDs } = this;
    const queryDataDs =
      organizationListDs &&
      organizationListDs.queryDataSet &&
      organizationListDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { columns, organizationListDs } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.organization`).d('组织')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/organization-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={organizationListDs} columns={columns} />
        </Content>
      </Fragment>
    );
  }
}
