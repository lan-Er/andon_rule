/*
 * @Author: hongdong.shan@hand-china.com
 * @Date: 2020-09-28 15:15:37
 * @LastEditTime: 2020-09-28 16:35:30
 * @LastEditors: Please set LastEditors
 * @Description: 制造协同-集团
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import EnterpriseListDS from '../store/EnterpriseListDS';

const intlPrefix = 'zmda.enterprise';
const organizationId = getCurrentOrganizationId();

@formatterCollections({ code: [`${intlPrefix}`] })
export default class ZmdaEnterprise extends Component {
  enterpriseListDs = new DataSet({
    ...EnterpriseListDS(),
  });

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'enterpriseCode', width: 150, lock: true },
      { name: 'enterpriseName', width: 150, lock: true },
      { name: 'enterpriseAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'locationName', width: 200 },
      { name: 'externalOrganization', width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
        minWidth: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  @Bind
  getExportQueryParams() {
    const { enterpriseListDs: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { enterpriseListDs } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.enterprise`).d('集团')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/enterprise-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={enterpriseListDs} pagination columns={this.columns} />
        </Content>
      </Fragment>
    );
  }
}
