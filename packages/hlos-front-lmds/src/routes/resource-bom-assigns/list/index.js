/**
 * @Description: 资源BOM分配管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-06 16:25:01
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Button, Table, Lov, CheckBox, DataSet } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import {getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import BomAllocationDS from '../stores/BomAllocationDS';

const preCode = 'lmds.bomAllocation';
const commonCode = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${preCode}`, 'lmds.common'],
})
export default class BomAssigns extends React.Component {
  bomAllocationDS = new DataSet({
    ...BomAllocationDS(),
  });


  /**
   *
   *新建
   * @memberof BomAllocation
   */
  @Bind
  handleCreate () {
    this.bomAllocationDS.create({}, 0);
  }

  /**
   *导出
   *
   * @returns
   * @memberof BomAllocation
   */
  @Bind
  getExportQueryParams() {
    const {
      bomAllocationDS: ds,
    } = this;
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
        name: 'organizationObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: true,
      },
      {
        name: 'resourceObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
      },
      {
        name: 'resourceGroupObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
      },
      {
        name: 'resourceBomObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
      },
      {
        name: 'primaryFalg',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'startDate',
        editor: true,
        width: 120,
        align: 'center',
      },
      {
        name: 'endDate',
        editor: true,
        width: 120,
        align: 'center',
      },
      {
        header: intl.get(`${commonCode}.action`).d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  get queryFields() {
    return {
      'resourceObj': <Lov name='resourceObj' clearButton noCache />,
      'resourceGroupObj': <Lov name='resourceGroupObj' clearButton noCache />,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.bomAllocation`).d('资源BOM分配')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonCode}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/resource-bom-assigns/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.bomAllocationDS}
            columns={this.columns}
            editMode="inline"
            selectionMode="click"
            queryFields={this.queryFields}
          />
        </Content>
      </React.Fragment>
    );
  }
}
