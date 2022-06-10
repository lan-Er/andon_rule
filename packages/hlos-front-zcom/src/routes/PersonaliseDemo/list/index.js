/**
 * @Description: 仓库收货信息维护
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-29 14:06:02
 */

import React, { Component, Fragment } from 'react';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
// import withCustomize from 'components/Customize';
import { CustBoxC7N as CustButton, WithCustomizeC7N as WithCustomize } from 'components/Customize';
import WarehouseReceiveDS from '../store/WarehouseReceiveDS';

const preCode = 'zmda.warehouseReceive';
const organizationId = getCurrentOrganizationId();

@WithCustomize({
  unitCode: ['ZCOM.PERSONALISE_DEMO.GRID'],
})
export default class ZmdaWarehouseReceive extends Component {
  tableDS = new DataSet({
    ...WarehouseReceiveDS(),
  });

  get columns() {
    return [
      {
        name: 'wmOuObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'organizationName', width: 150, editor: false },
      {
        name: 'warehouseObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'warehouseName', width: 150, editor: false },
      { name: 'contactName', width: 150, editor: true },
      { name: 'contactPhone', width: 150, editor: true },
      { name: 'warehouseAddress', width: 150, editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
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
    console.log('this.props.customizeTable', this.props.customizeTable);
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.warehouseReceive`).d('仓库收货信息维护')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/warehouse-contacts/excel`}
            queryParams={this.getExportQueryParams}
          />
          <CustButton
            unit={[
              {
                code: 'ZCOM.PERSONALISE_DEMO.GRID', // 单元编码，必传
              },
            ]}
          />
        </Header>
        <Content>
          {this.props.customizeTable(
            {
              code: 'ZCOM.PERSONALISE_DEMO.GRID', // 单元编码，必传
            },
            <Table
              dataSet={this.tableDS}
              columns={this.columns}
              columnResizable="true"
              editMode="inline"
            />
          )}
        </Content>
      </Fragment>
    );
  }
}
