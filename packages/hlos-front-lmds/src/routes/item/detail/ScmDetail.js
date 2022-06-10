/**
 * @Description: 物料采购详情信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Select, TextField, NumberField, Form, Lov, Switch } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';

@connect((state) => state)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class ScmDetail extends PureComponent {
  render() {
    const { detailDS } = this.props;
    return (
      <Fragment>
        <Form dataSet={detailDS.children.itemScm} columns={4}>
          <TextField name="scmOuName" disabled />
          <Lov name="meOuObj" noCache disabled />
          <Select name="itemScmType" />
          <Lov name="scmCategoryObj" noCache />
          <Lov name="buyerObj" noCache />
          <Lov name="uomObj" noCache />
          <Select name="scmPlanRule" />
          <NumberField name="eoq" />
          <NumberField name="minStockQty" />
          <NumberField name="maxStockQty" />
          <NumberField name="safetyStockQty" />
          <NumberField name="roundQty" />
          <NumberField name="minOrderQty" />
          <NumberField name="maxOrderQty" />
          <NumberField name="fixedOrderQty" />
          <Switch name="fixedLotFlag" />
          <Switch name="vmiFlag" />
          <NumberField name="marketPrice" />
          <NumberField name="purchasePrice" />
          <Switch name="taxable" />
          <Lov name="currencyObj" noCache />
          <NumberField name="priceTolerance" />
          <Select name="receiveToleranceType" />
          <NumberField name="receiveTolerance" />
          <NumberField name="invoiceTolerance" />
          <Switch name="aslFlag" />
          <Switch name="rfqFlag" />
          <Switch name="bondedFlag" />
          <NumberField name="maxDayOrder" />
          <NumberField name="leadTime" />
          <Select name="receiveRule" />
          <Lov name="receiveWarehouseObj" noCache />
          <Lov name="receiveWmAreaObj" noCache />
          <Lov name="inventoryWarehouseObj" noCache />
          <Lov name="inventoryWmAreaObj" noCache />
          <Lov name="supplierObj" noCache />
          <TextField name="supplierItemCode" />
          <TextField name="supplierItemDesc" />
          <Switch name="enabledFlag" />
        </Form>
      </Fragment>
    );
  }
}
