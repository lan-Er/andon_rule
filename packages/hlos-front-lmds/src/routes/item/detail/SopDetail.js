/**
 * @Description: 物料销售详情信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Select, TextField, NumberField, Form, Lov, Switch } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';

const commonCode = 'lmds.common';

@connect((state) => state)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class SopDetail extends PureComponent {
  render() {
    const { detailDS } = this.props;
    return (
      <Fragment>
        <Form dataSet={detailDS.children.itemSop} columns={4}>
          <TextField name="sopOuName" disabled />
          <TextField name="apsOuName" disabled />
          <Select name="itemSopType" />
          <Lov name="sopCategoryObj" noCache />
          <Lov name="salesmanObj" noCache />
          <Lov name="uomObj" noCache />
          <Select name="sopPlanRule" />
          <Lov name="forecastRuleObj" noCache />
          <NumberField name="minStockQty" />
          <NumberField name="maxStockQty" />
          <NumberField name="safetyStockQty" />
          <NumberField name="roundQty" />
          <NumberField name="minOrderQty" />
          <NumberField name="maxOrderQty" />
          <NumberField name="fixedOrderQty" />
          <Switch name="fixedLotFlag" />
          <NumberField name="deliveryLeadTime" addonAfter={intl.get(`${commonCode}.day`).d('天')} />
          <Select name="shipToleranceType" />
          <NumberField name="shipTolerance" />
          <Switch name="priceListFlag" />
          <TextField name="priceList" noCache />
          <Lov name="shipRuleObj" noCache />
          <Select name="transportType" />
          <NumberField name="maxDayOrder" />
          <Lov name="shipWarehouseObj" noCache />
          <Lov name="shipWmAreaObj" noCache />
          <Lov name="customerObj" noCache />
          <TextField name="customerItemCode" />
          <TextField name="customerItemDesc" />
          <Switch name="enabledFlag" />
        </Form>
      </Fragment>
    );
  }
}
