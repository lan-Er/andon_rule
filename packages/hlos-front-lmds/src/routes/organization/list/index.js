/*
 * @Description: 组织管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: 赵敏捷
 */

import React, { Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import intl from "utils/intl";
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import OrganizationListDS from '../stores/OrganizationListDS';

const intlPrefix = 'lmds.organization';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class Organization extends React.Component {
  organizationListDs = new DataSet({
    ...OrganizationListDS(),
  });

  get columns() {
    return [
      { name: 'organizationCode', editor: false, width: 150, lock: true },
      { name: 'organizationLevel', editor: false, width: 150, lock: true },
      { name: 'organizationName', editor: false, width: 150 },
      { name: 'organizationAlias', editor: false, width: 150 },
      { name: 'description', editor: false, width: 150 },
      { name: 'organizationClassMeaning', editor: false, width: 150 },
      { name: 'organizationTypeMeaning', editor: false, width: 150 },
      { name: 'parentOrganizationName', editor: false, width: 150 },
      { name: 'locationName', editor: false, width: 150 },
      { name: 'externalOrganization', editor: false, width: 150 },
      { name: 'enabledFlag', editor: false, width: 100, renderer: yesOrNoRender },
    ];
  }

  @Bind
  handleCreate () {
    this.meOuListDs.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const {
      organizationListDs,
    } = this;
    const queryDataDs = organizationListDs && organizationListDs.queryDataSet && organizationListDs.queryDataSet.current;
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
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/organizations/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={organizationListDs}
            columns={columns}
            selectionMode='dblclick'
          />
        </Content>
      </Fragment>
    );
  }
}
