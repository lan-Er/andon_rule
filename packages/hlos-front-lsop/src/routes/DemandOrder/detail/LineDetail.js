/**
 * @Description: 需求工作台新建/详情页面 - 行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-28 15:58:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import {
  Tabs,
  Form,
  Lov,
  Select,
  NumberField,
  TextField,
  DatePicker,
  CheckBox,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';

const preCode = 'lsop.demandOrder';
const { TabPane } = Tabs;

const LineList = (props) => {
  const { isCreate, allDisabled } = props;

  function saleFields() {
    return [
      <Lov name="salesmanObj" noCache disabled={allDisabled} key="salesmanObj" />,
      <TextField name="soNum" disabled={!isCreate || allDisabled} key="soNum" />,
      <TextField name="soLineNum" disabled={!isCreate || allDisabled} key="soLineNum" />,
      <TextField name="customerPo" disabled={allDisabled} key="customerPo" />,
      <Lov name="customerObj" noCache disabled={!isCreate || allDisabled} key="customerObj" />,
      <Lov
        name="customerSiteObj"
        noCache
        disabled={!isCreate || allDisabled}
        key="customerSiteObj"
      />,
      <TextField name="customerAddress" disabled={allDisabled} key="customerAddress" />,
      <TextField name="customerPoLine" disabled={allDisabled} key="customerPoLine" />,
      <Select name="salesChannel" disabled={allDisabled} key="salesChannel" />,
      <Select name="salesBrand" disabled={allDisabled} key="salesBrand" />,
      <TextField name="customerItemCode" disabled={allDisabled} key="customerItemCode" />,
      <TextField name="customerItemDesc" disabled={allDisabled} key="customerItemDesc" />,
      <DatePicker name="customerDemandDate" disabled={allDisabled} key="customerDemandDate" />,
      <Lov name="currencyObj" noCache disabled={!isCreate || allDisabled} key="currencyObj" />,
      <NumberField name="unitPrice" disabled={allDisabled} key="unitPrice" />,
      <NumberField name="contractAmount" disabled={allDisabled} key="contractAmount" />,
    ];
  }

  function planFields() {
    return [
      <Lov name="apsOuObj" noCache disabled={allDisabled} key="apsOuObj" />,
      <Lov name="meOuObj" noCache disabled={allDisabled} key="meOuObj" />,
      <Lov name="resourceObj" noCache disabled={allDisabled} key="resourceObj" />,
      <Select name="planType" disabled={allDisabled} key="planType" />,
      <NumberField name="plannedQty" disabled key="plannedQty" />,
      <NumberField name="completedQty" disabled key="completedQty" />,
      <Select name="validateStatus" disabled key="validateStatus" />,
      <CheckBox name="mtoFlag" disabled={allDisabled} key="mtoFlag" />,
    ];
  }

  function shipFields() {
    return [
      <NumberField name="shippedQty" disabled key="shippedQty" />,
      <Select name="shippingMethod" disabled={allDisabled} key="shippingMethod" />,
      <Lov name="shipRuleObj" noCache disabled={allDisabled} key="shipRuleObj" />,
      <Lov name="packingRuleObj" noCache disabled={allDisabled} key="packingRuleObj" />,
      <Select name="packingFormat" disabled={allDisabled} key="packingFormat" />,
      <TextField name="packingMaterial" disabled={allDisabled} key="packingMaterial" />,
      <TextField name="packageNum" disabled={allDisabled} key="packageNum" />,
      <TextField name="tagTemplate" disabled={allDisabled} key="tagTemplate" />,
      <NumberField name="minPackingQty" disabled={allDisabled} key="minPackingQty" />,
      <NumberField name="packingQty" disabled={allDisabled} key="packingQty" />,
      <NumberField name="containerQty" disabled={allDisabled} key="containerQty" />,
      <NumberField name="palletContainerQty" disabled={allDisabled} key="palletContainerQty" />,
      <TextField name="lotNumber" colSpan={2} disabled={allDisabled} key="lotNumber" />,
      <TextField name="tagCode" colSpan={2} disabled={allDisabled} key="tagCode" />,
    ];
  }

  const params = {
    dataSet: props.tableDS,
    columns: 4,
  };

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      { code: 'sale', title: '销售', component: <Form {...params}>{saleFields()}</Form> },
      { code: 'plan', title: '计划', component: <Form {...params}>{planFields()}</Form> },
      { code: 'ship', title: '发运', component: <Form {...params}>{shipFields()}</Form> },
    ];
  }

  return (
    <Fragment>
      <Tabs defaultActiveKey="sale">
        {tabsArr().map((tab) => (
          <TabPane tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)} key={tab.code}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </Fragment>
  );
};

export default LineList;
