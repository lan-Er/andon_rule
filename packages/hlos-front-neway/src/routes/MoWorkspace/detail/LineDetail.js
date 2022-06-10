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
  NumberField,
  TextField,
  DatePicker,
  DateTimePicker,
  Switch,
  ColorPicker,
  Icon,
} from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import intl from 'utils/intl';
// import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import LovPermission from './components/LovPermission';
import './style.less';

const preCode = 'lmes.moWorkspace';
const { TabPane } = Tabs;

export default function LineDetail(props) {
  const {
    isCreate,
    allDisabled,
    meOuDisabled,
    routingDisabled,
    secondDemandQtyDisabled,
    tableDS,
    dispatchRuleJson,
    executeRuleJson,
    inspectionRuleJson,
    packingRuleJson,
    reworkRuleJson,
    onPermissionStatus,
    // collectorJson,
    // setCollectorJson,
    onDemandChange,
  } = props;

  function handleMeOuChange(record, oldRecord) {
    if (!oldRecord || (record && record.meOuId !== oldRecord.meOuId)) {
      tableDS.children.moExecute.current.reset();
      tableDS.children.moExecute.current.set('meOuObj', {
        meOuId: record.meOuId,
        meOuCode: record.meOuCode,
        organizationName: record.organizationName,
      });
    }
  }

  function handleRuleChange(record, ruleType) {
    if (record) {
      // if(ruleType === 'Collector') {
      //   setCollectorJson(record.collectorJson)
      // } else {
      props[`set${ruleType}RuleJson`](record.ruleJson);
      // }
    }
  }

  function mainFields() {
    return [
      <DateTimePicker name="planStartDate" disabled={allDisabled} key="planStartDate" />,
      <DateTimePicker name="planEndDate" disabled={allDisabled} key="planEndDate" />,
      <TextField name="parentMoNums" disabled key="parentMoNums" />,
      <TextField name="topMoNum" disabled key="topMoNum" />,
      <NumberField name="planSupplyQty" disabled={allDisabled} key="planSupplyQty" />,
      <TextField name="makeQty" disabled key="makeQty" />,
      <TextField name="moGroup" disabled={allDisabled} key="moGroup" />,
      <TextField name="moLevel" disabled key="moLevel" />,
      <Switch
        name="prodVersionEnable"
        disabled={!isCreate || allDisabled}
        key="prodVersionEnable"
      />,
      <Lov
        name="productionVersionObj"
        noCache
        disabled={!isCreate || allDisabled}
        key="productionVersionObj"
      />,
      <Lov name="bomObj" noCache disabled={!isCreate || allDisabled} key="bomObj" />,
      <LovPermission
        permissionList={[
          {
            code: `hlos.lmes.mo.workspace.ps.lov.routing`,
            type: 'lov',
            meaning: '工艺路线',
          },
        ]}
        name="routingObj"
        noCache
        disabled={allDisabled || (!isCreate && routingDisabled)}
        key="routingObj"
        dataSet={tableDS}
        onPermissionStatus={onPermissionStatus}
        extraAttr={{
          limit: 'itemId',
        }}
      />,
      <Lov name="secondUomObj" noCache disabled key="secondUomObj" />,
      <TextField
        name="secondDemandQty"
        disabled={allDisabled || secondDemandQtyDisabled}
        key="secondDemandQty"
        onChange={(val) => onDemandChange(val)}
      />,
      <TextField name="projectNum" disabled={allDisabled} key="projectNum" />,
      <TextField name="wbsNum" disabled={allDisabled} key="wbsNum" />,
      <Lov
        name="itemCategoryObj"
        noCache
        disabled={!isCreate || allDisabled}
        key="itemCategoryObj"
      />,
      <TextField name="moLotNumber" disabled={allDisabled} key="moLotNumber" />,
      <TextField name="tagCode" disabled={allDisabled} key="tagCode" />,
      <TextField name="tagTemplate" disabled={allDisabled} key="tagTemplate" />,
      <Switch
        name="mtoFlag"
        disabled={allDisabled || (tableDS.current && tableDS.current.data.mtoExploredFlag)}
        key="mtoFlag"
      />,
      <Switch name="mtoExploredFlag" disabled key="mtoExploredFlag" />,
    ];
  }

  function demandFields() {
    return [
      <Lov name="demandObj" noCache disabled={!isCreate || allDisabled} key="demandObj" />,
      <TextField name="soNum" disabled={!isCreate || allDisabled} key="soNum" />,
      <TextField name="soLineNum" disabled={!isCreate || allDisabled} key="soLineNum" />,
      <Lov name="customerObj" noCache disabled={!isCreate || allDisabled} key="customerObj" />,
      <Lov
        name="customerSiteObj"
        noCache
        disabled={
          !isCreate || allDisabled || !(tableDS.current && tableDS.current.data.customerObj)
        }
        key="customerSiteObj"
      />,
      <TextField name="customerPo" disabled={allDisabled} key="customerPo" />,
      <TextField name="customerPoLine" disabled={allDisabled} key="customerPoLine" />,
      <TextField name="customerItemCode" disabled={allDisabled} key="customerItemCode" />,
      <TextField name="customerItemDesc" disabled={allDisabled} key="customerItemDesc" />,
    ];
  }

  function planFields() {
    return [
      <Lov name="apsOuObj" noCache disabled={!isCreate || allDisabled} key="apsOuObj" />,
      <Lov name="apsGroupObj" noCache disabled={allDisabled} key="apsGroupObj" />,
      <Lov name="apsResourceObj" noCache disabled={allDisabled} key="apsResourceObj" />,
      <Lov name="relatedResourceObj" noCache disabled={allDisabled} key="relatedResourceObj" />,
      <NumberField name="planQty" disabled key="planQty" />,
      <Select name="planRule" disabled={allDisabled} key="planRule" />,
      <TextField name="planLevel" disabled key="planLevel" />,
      <TextField name="planPriority" disabled key="planPriority" />,
      <Select name="capacityType" disabled={allDisabled} key="capacityType" />,
      <NumberField name="capacityValue" disabled={allDisabled} key="capacityValue" />,
      <Select name="moReferenceType" disabled={allDisabled} key="moReferenceType" />,
      <Lov name="referenceMoObj" noCache disabled={allDisabled} key="referenceMoObj" />,
      <TextField name="earliestStartTime" disabled key="earliestStartTime" />,
      <TextField name="startTime" disabled key="startTime" />,
      <TextField name="fulfillTime" disabled key="fulfillTime" />,
      <TextField name="scheduleReleaseTime" disabled key="scheduleReleaseTime" />,
      <TextField name="fpsTime" disabled key="fpsTime" />,
      <TextField name="fpcTime" disabled key="fpcTime" />,
      <TextField name="lpsTime" disabled key="lpsTime" />,
      <TextField name="lpcTime" disabled key="lpcTime" />,
      <Select name="resourceRule" disabled={allDisabled} key="resourceRule" />,
      <Lov name="releaseRuleObj" noCache disabled={allDisabled} key="releaseRuleObj" />,
      <NumberField name="mpsLeadTime" disabled={allDisabled} key="mpsLeadTime" />,
      <NumberField name="exceedLeadTime" disabled={allDisabled} key="exceedLeadTime" />,
      <NumberField name="preProcessLeadTime" disabled={allDisabled} key="preProcessLeadTime" />,
      <NumberField name="processLeadTime" disabled={allDisabled} key="processLeadTime" />,
      <NumberField name="postProcessLeadTime" disabled={allDisabled} key="postProcessLeadTime" />,
      <NumberField name="safetyLeadTime" disabled={allDisabled} key="safetyLeadTime" />,
      <NumberField name="switchTime" disabled={allDisabled} key="switchTime" />,
      <NumberField name="releaseTimeFence" disabled={allDisabled} key="releaseTimeFence" />,
      <NumberField name="orderTimeFence" disabled={allDisabled} key="orderTimeFence" />,
      <TextField name="planRemark" colSpan={2} disabled={allDisabled} key="planRemark" />,
      <ColorPicker name="specialColor" disabled={allDisabled} key="specialColor" />,
      <Switch name="resourceFixFlag" disabled={allDisabled} key="resourceFixFlag" />,
      <Switch name="planFlag" disabled={allDisabled} key="planFlag" />,
      <Switch name="endingFlag" disabled key="endingFlag" />,
      <Switch name="planWarnningFlag" disabled key="planWarnningFlag" />,
    ];
  }

  function executeFields() {
    return [
      <Lov
        name="meOuObj"
        noCache
        disabled={meOuDisabled}
        onChange={(record, oldRecord) => handleMeOuChange(record, oldRecord)}
        key="meOuObj"
      />,
      <Lov name="meAreaObj" noCache disabled={allDisabled} key="meAreaObj" />,
      <Lov name="prodLineObj" noCache disabled={allDisabled} key="prodLineObj" />,
      <Select name="executeStatus" disabled key="executeStatus" />,
      <Lov name="workcellObj" noCache disabled={allDisabled} key="workcellObj" />,
      <Lov name="equipmentObj" noCache disabled={allDisabled} key="equipmentObj" />,
      <Lov name="workerGroupObj" noCache disabled={allDisabled} key="workerGroupObj" />,
      <Lov name="workerObj" noCache disabled={allDisabled} key="workerObj" />,
      <DatePicker name="calendarDay" noCache disabled={allDisabled} key="calendarDay" />,
      <Select name="calendarShiftCode" noCache disabled={allDisabled} key="calendarShiftCode" />,
      <Lov name="completeWarehouseObj" noCache disabled={allDisabled} key="completeWarehouseObj" />,
      <Lov name="completeWmAreaObj" noCache disabled={allDisabled} key="completeWmAreaObj" />,
      <Lov
        name="inventoryWarehouseObj"
        noCache
        disabled={allDisabled}
        key="inventoryWarehouseObj"
      />,
      <Lov name="inventoryWmAreaObj" noCache disabled={allDisabled} key="inventoryWmAreaObj" />,
      <TextField name="supplyQty" disabled key="supplyQty" />,
      <TextField name="inputQty" disabled key="inputQty" />,
      <TextField name="maxIssuedQty" disabled key="maxIssuedQty" />,
      <TextField name="issuedSuit" disabled key="issuedSuit" />,
      <TextField name="completedQty" disabled key="completedQty" />,
      <TextField name="inventoryQty" disabled key="inventoryQty" />,
      <TextField name="scrappedQty" disabled key="scrappedQty" />,
      <TextField name="ngQty" disabled key="ngQty" />,
      <TextField name="reworkQty" disabled key="reworkQty" />,
      <TextField name="pendingQty" disabled key="pendingQty" />,
      <TextField name="executePriority" disabled key="executePriority" />,
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
      <div name="executeRuleObj" key="executeRuleObj-wrap">
        {/* <LovPermission
          permissionList={[
            {
              code: `hlos.lmes.mo.workspace.ps.lov.executerule`,
              type: 'lov',
              meaning: '执行规则',
            },
          ]}
          key="executeRuleObj"
          name="executeRuleObj"
          noCache
          disabled={allDisabled}
          onChange={(record) => handleRuleChange(record, 'Execute')}
          dataSet={tableDS.children.moExecute}
          isCreate={isCreate}
          extraAttr={{
            defaultValue: {
              // ruleId: '81799664848482304',
              ruleCode: 'MO_TASK_EXECUTE',
              url: `${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.RULE&`,
              // ruleName: 'MO-TASK执行规则',
              // ruleJson: '{"execute_object": "TASK"}',
            },
          }}
        /> */}
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
      <div name="packingRuleObj" key="packingRuleObj">
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
      // <div className="mo-workspace-rule" name="collectorObj" key="collectorObj">
      //   <Lov name="collectorObj" noCache disabled={allDisabled} onChange={(record) => handleRuleChange(record, 'Collector')} />
      //   <Tooltip
      //     placement="top"
      //     title={collectorJson}
      //   >
      //     <Icon type="contact_support-o" />
      //   </Tooltip>
      // </div>,
      <Lov name="collectorObj" noCache disabled={allDisabled} key="collectorObj" />,
      <Lov name="locationObj" noCache disabled={allDisabled} key="locationObj" />,
      <TextField name="printedDate" disabled key="printedDate" />,
      <TextField name="executeRemark" disabled={allDisabled} key="executeRemark" />,
      <Select name="completeControlType" disabled={allDisabled} key="completeControlType" />,
      <TextField name="completeControlValue" disabled={allDisabled} key="completeControlValue" />,
      <Switch name="issuedFlag" disabled key="issuedFlag" />,
      <Switch name="printedFlag" disabled key="printedFlag" />,
    ];
  }

  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: (
          <Form dataSet={tableDS} columns={4}>
            {mainFields()}
          </Form>
        ),
      },
      {
        code: 'demand',
        title: '需求',
        component: (
          <Form dataSet={tableDS} columns={4}>
            {demandFields()}
          </Form>
        ),
      },
      {
        code: 'plan',
        title: '计划',
        component: (
          <Form dataSet={tableDS.children.moPlan} columns={4}>
            {planFields()}
          </Form>
        ),
      },
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
      <Tabs defaultActiveKey="main">
        {tabsArr().map((tab) => (
          <TabPane tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)} key={tab.code}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </Fragment>
  );
}
