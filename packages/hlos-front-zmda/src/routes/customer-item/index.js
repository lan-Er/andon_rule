/**
 * @Description: 制造协同-客户物料主数据
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-23 10:44:18
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import { Button as HButton } from 'hzero-ui';
import { DataSet, Table, CheckBox, Button, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import CustomerItemListDS from './store/CustomerItemListDS';

const preCode = 'zmda.customerItem';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { customerItem },
} = statusConfig.statusValue.zmda;

@connect()
@formatterCollections({
  code: ['zmda.customerItem', 'zmda.common'],
})
export default class ZmdaCustomerItem extends Component {
  tableDS = new DataSet({
    ...CustomerItemListDS(),
  });

  get columns() {
    return [
      {
        name: 'sopOuObj',
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
        name: 'customerObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'customerSiteObj',
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
      {
        name: 'customerItemObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : <Lov noCache />),
      },
      // { name: 'customerItemCode', width: 150, editor: true },
      { name: 'customerItemDesc', width: 150, editor: true },
      { name: 'terminalProduct', width: 150, editor: true },
      { name: 'customerSpecification', width: 150, editor: true },
      { name: 'customerFeature', width: 150, editor: true },
      { name: 'priority', width: 150, editor: true },
      {
        name: 'keyCustomerFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'salesChannel', width: 150, editor: true },
      { name: 'salesBrand', width: 150, editor: true },
      { name: 'calendarObj', width: 150, editor: <Lov noCache /> },
      { name: 'salesmanObj', width: 150, editor: <Lov noCache /> },
      { name: 'sopPlanRule', width: 150, editor: true },
      { name: 'forecastRuleObj', width: 150, editor: <Lov noCache /> },
      { name: 'shipRuleObj', width: 150, editor: <Lov noCache /> },
      { name: 'minStockQty', width: 150, editor: true },
      { name: 'maxStockQty', width: 150, editor: true },
      { name: 'safetyStockQty', width: 150, editor: true },
      { name: 'roundQty', width: 150, editor: true },
      { name: 'minOrderQty', width: 150, editor: true },
      { name: 'maxOrderQty', width: 150, editor: true },
      {
        name: 'fixedLotFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'fixedOrderQty', width: 150, editor: true },
      { name: 'dayMaxSupply', width: 150, editor: true },
      { name: 'deliveryLeadTime', width: 150, editor: true },
      { name: 'currencyObj', width: 150, editor: <Lov noCache /> },
      {
        name: 'priceListFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'priceList', width: 150, editor: true },
      { name: 'salesPrice', width: 150, editor: true },
      { name: 'freightPrice', width: 150, editor: true },
      {
        name: 'taxable',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'consignFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'fobType', width: 150, editor: true },
      { name: 'transportType', width: 150, editor: true },
      { name: 'transportDays', width: 150, editor: true },
      { name: 'shipWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'shipWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'transitWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'outsideWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'packingRuleObj', width: 150, editor: <Lov noCache /> },
      { name: 'packingFormat', width: 150, editor: true },
      { name: 'packingMaterial', width: 150, editor: true },
      { name: 'minPackingQty', width: 150, editor: true },
      { name: 'packingQty', width: 150, editor: true },
      { name: 'containerQty', width: 150, editor: true },
      { name: 'palletContainerQty', width: 150, editor: true },
      { name: 'tagTemplate', width: 150, editor: true },
      { name: 'startDate', width: 150, editor: true, align: 'center' },
      { name: 'endDate', width: 150, editor: true, align: 'center' },
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${customerItem}`,
        title: intl.get(`${preCode}.view.title.customerItemImport`).d('客户物料导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.customerItem`).d('客户物料')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/customer-items/excel`}
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
