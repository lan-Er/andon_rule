/**
 * @Description: 物料仓储详情信息
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
export default class WmDetail extends PureComponent {
  render() {
    const { detailDS } = this.props;
    return (
      <Fragment>
        <Form dataSet={detailDS.children.itemWm} columns={4}>
          <TextField name="wmOuName" disabled />
          <Lov name="meOuObj" noCache disabled />
          <Select name="itemWmType" />
          <Lov name="wmCategoryObj" noCache />
          <Lov name="uomObj" noCache />
          <Lov name="wmWorkerObj" noCache />
          <Select name="abcType" />
          <Select name="sequenceLotControl" />
          <Switch name="tagFlag" />
          <Lov name="reservationRuleObj" noCache />
          <Lov name="fifoRuleObj" noCache />
          <Lov name="storageRuleObj" noCache />
          <Lov name="pickRuleObj" noCache />
          <Lov name="replenishRuleObj" noCache />
          <Lov name="waveDeliveryRuleObj" noCache />
          <Lov name="packingRuleObj" noCache />
          <Lov name="wmInspectRuleObj" noCache />
          <Lov name="cycleCountRuleObj" noCache />
          <NumberField name="economicQty" />
          <NumberField name="storageMaxQty" />
          <NumberField name="storageMinQty" />
          <TextField name="packingMaterial" />
          <Select name="packingFormat" />
          <NumberField name="minPackingQty" />
          <NumberField name="packingQty" />
          <NumberField name="containerQty" />
          <NumberField name="palletContainerQty" />
          <Lov name="storageWarehouseObj" noCache />
          <Lov name="storageWmAreaObj" noCache />
          <Lov name="storageWmUnitObj" noCache />
          <Lov name="pickWarehouseObj" noCache />
          <Lov name="pickWmAreaObj" noCache />
          <Lov name="pickWmUnitObj" noCache />
          <Switch name="expireControlFlag" />
          <Select name="expireControlType" />
          <NumberField name="expireDays" />
          <NumberField name="expireAlertDays" />
          <NumberField name="expireLeadDays" addonAfter={intl.get(`${commonCode}.day`).d('天')} />
          <Switch name="enabledFlag" />
        </Form>
      </Fragment>
    );
  }
}
