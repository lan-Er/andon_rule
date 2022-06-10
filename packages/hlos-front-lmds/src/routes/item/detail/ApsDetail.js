/**
 * @Description: 物料计划详情信息
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
export default class ApsDetail extends PureComponent {
  render() {
    const { detailDS } = this.props;
    return (
      <Fragment>
        <Form dataSet={detailDS.children.itemAps} columns={4}>
          <TextField name="apsOuName" disabled />
          <Lov name="meOuObj" noCache disabled />
          <Select name="itemApsType" />
          <Lov name="apsCategoryObj" noCache />
          <Lov name="planObj" noCache />
          <Lov name="plannerObj" noCache />
          <Select name="resourceRule" />
          <Lov name="apsResourceObj" noCache />
          <Lov name="releaseRuleObj" noCache />
          <Switch name="mtoFlag" />
          <Switch name="planFlag" />
          <Switch name="keyComponentFlag" />
          <NumberField
            name="preProcessLeadTime"
            addonAfter={intl.get(`${commonCode}.hour`).d('小时')}
          />
          <NumberField
            name="processLeadTime"
            addonAfter={intl.get(`${commonCode}.hour`).d('小时')}
          />
          <NumberField
            name="postProcessLeadTime"
            addonAfter={intl.get(`${commonCode}.hour`).d('小时')}
          />
          <NumberField
            name="safetyLeadTime"
            addonAfter={intl.get(`${commonCode}.hour`).d('小时')}
          />
          <NumberField name="exceedLeadTime" addonAfter={intl.get(`${commonCode}.day`).d('天')} />
          <NumberField name="demandTimeFence" addonAfter={intl.get(`${commonCode}.day`).d('天')} />
          <NumberField name="orderTimeFence" addonAfter={intl.get(`${commonCode}.day`).d('天')} />
          <NumberField name="releaseTimeFence" addonAfter={intl.get(`${commonCode}.day`).d('天')} />
          <NumberField
            name="demandMergeTimeFence"
            addonAfter={intl.get(`${commonCode}.day`).d('天')}
          />
          <NumberField
            name="supplyMergeTimeFence"
            addonAfter={intl.get(`${commonCode}.day`).d('天')}
          />
          <Select name="safetyStockMethod" />
          <NumberField
            name="safetyStockPeriod"
            addonAfter={intl.get(`${commonCode}.day`).d('天')}
          />
          <NumberField name="safetyStockValue" />
          <NumberField name="minStockQty" />
          <NumberField name="maxStockQty" />
          <NumberField
            name="capacityTimeFence"
            addonAfter={intl.get(`${commonCode}.day`).d('天')}
          />
          <NumberField name="capacityValue" />
          <NumberField name="assemblyShrinkage" />
          <NumberField name="economicLotSize" />
          <NumberField name="economicSplitParameter" />
          <NumberField name="minOrderQty" />
          <NumberField name="fixedLotMultiple" />
          <Switch name="enabledFlag" />
        </Form>
      </Fragment>
    );
  }
}
