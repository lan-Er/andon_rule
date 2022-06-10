/**
 * @Description: 物料采购详情信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: Please set LastEditors
 */

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Collapse } from 'choerodon-ui';
import { Select, TextField, NumberField, Form, Lov, Switch } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';

const { Panel } = Collapse;
@connect((state) => state)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class ScmDetail extends PureComponent {
  render() {
    const { detailDS } = this.props;
    return (
      <Fragment>
        <Collapse
          bordered={false}
          className="item-left-list"
          defaultActiveKey={['1', '2', '3', '4']}
        >
          <Panel header="常规数据" key="1">
            <Form dataSet={detailDS.children.itemScm} columns={3}>
              <TextField name="scmOuName" disabled />
              <Lov name="organizationObj" noCache disabled />
              <Select name="itemScmType" />
              <Lov name="scmCategoryObj" noCache />
              <Lov name="buyerObj" noCache />
              <Lov name="uomObj" noCache />
              <Switch name="enabledFlag" />
            </Form>
          </Panel>
          <Panel header="采购计划" key="2">
            <Form dataSet={detailDS.children.itemScm} columns={3}>
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
              <NumberField name="maxDayOrder" />
              <NumberField name="leadTime" />
              <Switch name="vmiFlag" />
            </Form>
          </Panel>
          <Panel header="供应信息" key="3">
            <Form dataSet={detailDS.children.itemScm} columns={3}>
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
              <Lov name="supplierObj" noCache />
              <TextField name="supplierItemCode" />
              <TextField name="supplierItemDesc" />
            </Form>
          </Panel>
          <Panel header="库位设置" key="4">
            <Form dataSet={detailDS.children.itemScm} columns={3}>
              <Select name="receiveRule" />
              <Lov name="receiveWarehouseObj" noCache />
              <Lov name="receiveWmAreaObj" noCache />
              <Lov name="inventoryWarehouseObj" noCache />
              <Lov name="inventoryWmAreaObj" noCache />
            </Form>
          </Panel>
        </Collapse>
      </Fragment>
    );
  }
}
