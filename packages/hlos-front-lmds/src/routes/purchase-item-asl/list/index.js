/*
 * @Author: zhang yang
 * @Description: 货源清单
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-11 10:56:03
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, Button, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ItemAslListDS from '../stores/ItemAslListDS';

const preCode = 'lmds.itemAsl';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.itemAsl', 'lmds.common'],
})
export default class ItemAsl extends Component {
  tableDS = new DataSet({
    ...ItemAslListDS(),
  });

  get columns() {
    return [
      {
        name: 'scmOuObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'itemObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'supplierObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'supplierSiteObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      { name: 'itemDescription', width: 150 },
      {
        name: 'uomObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'keySupplyFlag', width: 100, renderer: yesOrNoRender, editor: true },
      { name: 'supplyType', width: 150, editor: true },
      { name: 'supplySource', width: 150, editor: true },
      { name: 'supplyRatio', width: 150, editor: true },
      { name: 'priority', width: 150, editor: true },
      { name: 'minOrderQty', width: 150, editor: true },
      { name: 'maxOrderQty', width: 150, editor: true },
      { name: 'dayMaxSupply', width: 150, editor: true },
      { name: 'roundQty', width: 150, editor: true },
      { name: 'calendar', width: 150, editor: <Lov noCache /> },
      { name: 'windowTime', width: 150, editor: true },
      { name: 'leadTime', width: 150, editor: true },
      { name: 'currency', width: 150, editor: true },
      { name: 'purchasePrice', width: 150, editor: true },
      { name: 'receiveRule', width: 150, editor: true },
      { name: 'bondedFlag', width: 100, editor: true },
      { name: 'consignFlag', width: 100, editor: true },
      { name: 'vmiFlag', width: 100, editor: true },
      { name: 'vmiMinQty', width: 150, editor: true },
      { name: 'vmiMaxQty', width: 150, editor: true },
      { name: 'vmiSafetyQty', width: 150, editor: true },
      { name: 'taxable', width: 150, editor: true },
      { name: 'receiveTolerance', width: 150, editor: true },
      { name: 'invoiceTolerance', width: 150, editor: true },
      { name: 'receiveWarehouse', width: 150, editor: <Lov noCache /> },
      { name: 'receiveWmArea', width: 150, editor: <Lov noCache /> },
      { name: 'inventoryWarehouse', width: 150, editor: <Lov noCache /> },
      { name: 'inventoryWmArea', width: 150, editor: <Lov noCache /> },
      { name: 'supplierItemCode', width: 150, editor: true },
      { name: 'supplierItemDesc', width: 150, editor: true },
      { name: 'startDate', width: 130, editor: true, align: 'center' },
      { name: 'endDate', width: 130, editor: true, align: 'center' },
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
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.tableDS.submit();
    if (res === undefined) {
      notification.warning({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
    } else if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else {
      await this.tableDS.query();
    }
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
        <Header title={intl.get(`${preCode}.view.title.itemAsl`).d('货源清单')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/item-asls/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
