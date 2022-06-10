/**
 * @Description: 物料计划详情信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: Please set LastEditors
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Collapse } from 'choerodon-ui';
import { Select, TextField, NumberField, Form, Lov, Switch } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';

const commonCode = 'lmds.common';
const { Panel } = Collapse;

@connect((state) => state)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class ApsDetail extends PureComponent {
  render() {
    const { detailDS } = this.props;
    return (
      <Fragment>
        <Collapse bordered={false} className="item-left-list" defaultActiveKey={['1', '2', '3']}>
          <Panel header="常规数据" key="1">
            <Form dataSet={detailDS.children.itemAps} columns={3}>
              <TextField name="apsOuName" disabled />
              <Lov name="organizationObj" noCache disabled />
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
              <Switch name="enabledFlag" />
            </Form>
          </Panel>
          <Panel header="时间计划" key="2">
            <Form dataSet={detailDS.children.itemAps} columns={3}>
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
              <NumberField
                name="exceedLeadTime"
                addonAfter={intl.get(`${commonCode}.day`).d('天')}
              />
              <NumberField
                name="demandTimeFence"
                addonAfter={intl.get(`${commonCode}.day`).d('天')}
              />
              <NumberField
                name="orderTimeFence"
                addonAfter={intl.get(`${commonCode}.day`).d('天')}
              />
              <NumberField
                name="releaseTimeFence"
                addonAfter={intl.get(`${commonCode}.day`).d('天')}
              />
              <NumberField
                name="demandMergeTimeFence"
                addonAfter={intl.get(`${commonCode}.day`).d('天')}
              />
              <NumberField
                name="supplyMergeTimeFence"
                addonAfter={intl.get(`${commonCode}.day`).d('天')}
              />
            </Form>
          </Panel>
          <Panel header="数量计划" key="3">
            <Form dataSet={detailDS.children.itemAps} columns={3}>
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
            </Form>
          </Panel>
        </Collapse>
      </Fragment>
    );
  }
}
