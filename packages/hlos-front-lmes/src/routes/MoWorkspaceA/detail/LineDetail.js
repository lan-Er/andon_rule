/**
 * @Description: MO工作台新建/详情页面 - 行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-16 18:38:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import {
  Tabs,
  Form,
  Lov,
  Select,
  Icon,
  NumberField,
  DateTimePicker,
  Switch,
  TextField,
} from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import intl from 'utils/intl';
import './style.less';

const preCode = 'lmes.moWorkspace';
const { TabPane } = Tabs;

export default function LineDetail(props) {
  const {
    allDisabled,
    tableDS,
    dispatchRuleJson,
    executeRuleJson,
    inspectionRuleJson,
    packingRuleJson,
    reworkRuleJson,
  } = props;

  function handleRuleChange(record, ruleType) {
    if (record) {
      props[`set${ruleType}RuleJson`](record.ruleJson);
    }
  }

  function handleMeAreChange(rec) {
    tableDS.children.moExecute.current.reset();
    tableDS.children.moExecute.current.set('meAreaObj', rec);
  }

  function executeFields() {
    return [
      <Lov
        name="meAreaObj"
        noCache
        disabled={allDisabled}
        key="meAreaObj"
        onChange={handleMeAreChange}
      />,
      <Lov name="prodLineObj" noCache disabled={allDisabled} key="prodLineObj" />,
      <Lov name="equipmentObj" noCache disabled={allDisabled} key="equipmentObj" />,
      <Lov name="workcellObj" noCache disabled={allDisabled} key="workcellObj" />,
      <Lov name="workerGroupObj" noCache disabled={allDisabled} key="workerGroupObj" />,
      <Lov name="workerObj" noCache disabled={allDisabled} key="workerObj" />,
      <Select name="executeStatus" disabled key="executeStatus" />,
      <Lov name="completeWarehouseObj" noCache disabled={allDisabled} key="completeWarehouseObj" />,
      <Lov name="completeWmAreaObj" noCache disabled={allDisabled} key="completeWmAreaObj" />,
      <Lov
        name="inventoryWarehouseObj"
        noCache
        disabled={allDisabled}
        key="inventoryWarehouseObj"
      />,
      <Lov name="inventoryWmAreaObj" noCache disabled={allDisabled} key="inventoryWmAreaObj" />,
      <NumberField name="completedQty" disabled />,
      <NumberField name="inventoryQty" disabled />,
      <NumberField name="scrappedQty" disabled />,
      <NumberField name="reworkQty" disabled />,
      <NumberField name="processNgQty" disabled />,
      <NumberField name="pendingQty" disabled />,
      <NumberField name="inputQty" disabled />,
      <NumberField name="processedTime" disabled />,
      <DateTimePicker name="actualStartTime" disabled />,
      <DateTimePicker name="actualEndTime" disabled />,
      <div className="mo-workspace-rule" name="packingRuleObj" key="packingRuleObj">
        <Lov
          name="packingRuleObj"
          noCache
          disabled={allDisabled}
          onChange={(record) => handleRuleChange(record, 'Packing')}
        />
        <Tooltip placement="top" title={packingRuleJson}>
          <Icon type="contact_support-o" />
        </Tooltip>
      </div>,
      <div name="reworkRuleObj" key="reworkRuleObj">
        <Lov
          name="reworkRuleObj"
          noCache
          disabled={allDisabled}
          onChange={(record) => handleRuleChange(record, 'Rework')}
        />
        <Tooltip placement="top" title={reworkRuleJson}>
          <Icon type="contact_support-o" />
        </Tooltip>
      </div>,
      <div name="dispatchRuleObj" key="dispatchRuleObj">
        <Lov
          name="dispatchRuleObj"
          noCache
          disabled={allDisabled}
          onChange={(record) => handleRuleChange(record, 'Dispatch')}
        />
        <Tooltip placement="top" title={dispatchRuleJson}>
          <Icon type="contact_support-o" />
        </Tooltip>
      </div>,
      <div name="executeRuleObj" key="executeRuleObj">
        <Lov
          name="executeRuleObj"
          noCache
          disabled={allDisabled}
          onChange={(record) => handleRuleChange(record, 'Execute')}
        />
        <Tooltip placement="top" title={executeRuleJson}>
          <Icon type="contact_support-o" />
        </Tooltip>
      </div>,
      <div name="inspectionRuleObj" key="inspectionRuleObj">
        <Lov
          name="inspectionRuleObj"
          noCache
          disabled={allDisabled}
          onChange={(record) => handleRuleChange(record, 'Inspection')}
        />
        <Tooltip placement="top" title={inspectionRuleJson}>
          <Icon type="contact_support-o" />
        </Tooltip>
      </div>,
      <Select name="completeControlType" disabled={allDisabled} key="completeControlType" />,
      <TextField name="completeControlValue" disabled={allDisabled} key="completeControlValue" />,
      <Switch name="printedFlag" disabled={allDisabled} />,
    ];
  }

  function tabsArr() {
    return [
      {
        code: 'execute',
        title: '执行',
        component: (
          <Form className="mo-workspace-execute" dataSet={tableDS.children.moExecute} columns={4}>
            {executeFields()}
          </Form>
        ),
      },
    ];
  }

  return (
    <Fragment>
      <Tabs defaultActiveKey="execute">
        {tabsArr().map((tab) => (
          <TabPane tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)} key={tab.code}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </Fragment>
  );
}
