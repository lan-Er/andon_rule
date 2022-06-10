/**
 * @Description: 生产版本管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-09 20:25:42
 * @LastEditors: yiping.liu
 */

import React from 'react';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { Button, Table, Lov, DataSet } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import ProductionVersionDS from '../stores/ProductionVersionDS';

const preCode = 'lmds.productionVersion';
const commonCode = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${preCode}`],
})
export default class productionVersion extends React.Component {
  productionVersionDS = new DataSet({
    ...ProductionVersionDS(),
  });

  /**
   *新建
   *
   * @memberof productionVersion
   */
  @Bind
  handleCreate () {
    this.productionVersionDS.create({}, 0);
  }

  /**
   *导出
   *
   * @returns
   * @memberof productionVersion
   */
  @Bind
  getExportQueryParams() {
    const {
      productionVersionDS: ds,
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
        name: 'itemObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: true,
      },
      {
        name: 'itemDescription',
        editor: false,
        width: 150,
        lock: true,
      },
      {
        name: 'categoryObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: true,
      },
      {
        name: 'productionVersion',
        editor: true,
        width: 150,
      },
      {
        name: 'bomVersionObj',
        editor: true,
        width: 200,
      },
      {
        name: 'routingVersionObj',
        editor: true,
        width: 200,
      },
      {
        name: 'remark',
        editor: true,
        width: 150,
      },
      {
        name: 'startDate',
        editor: true,
        align: 'center',
        width: 120,
      },
      {
        name: 'endDate',
        editor: true,
        align: 'center',
        width: 120,
      },
      {
        header: intl.get(`${commonCode}.action`).d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  };

  get queryFields() {
    return {
      'itemObj': <Lov name='itemObj' clearButton noCache />,
      'categoryObj': <Lov name='categoryObj' clearButton noCache />,
    };
  }

  render(){
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.productionVersion`).d('生产版本')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonCode}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/production-versions/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.productionVersionDS}
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
