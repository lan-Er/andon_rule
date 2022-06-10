/**
 * @Description: MO工作台新建/详情页面 - 头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-16 18:38:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Lov,
  Form,
  Select,
  TextField,
  NumberField,
  DatePicker,
  DateTimePicker,
  DataSet,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import request from 'utils/request';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import { PENDING, SUCCESS } from 'components/Permission/Status';
import { queryLovData } from 'hlos-front/lib/services/api';
import { MoDetailDS } from '../store/moWorkspaceDS';
import { queryMeOuData } from '@/services/moWorkspaceService';
import codeConfig from '@/common/codeConfig';

import LineDetail from './LineDetail';

const { common } = codeConfig.code;

const preCode = 'zexe.moWorkspace';

export default ({ match }) => {
  const detailDS = useMemo(() => new DataSet(MoDetailDS()), []);
  const [showFlag, setShowFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(true);
  const [allDisabled, setAllDisabled] = useState(false);
  const [meOuDisabled, setMeOuDisabled] = useState(false);
  const [moNumDisabled, setMoNumDisabled] = useState(false);
  const [organizationObj, setOrganizationObj] = useState(null);
  const [moTypeObj, setMoTypeObj] = useState(null);
  const [dispatchRuleJson, setDispatchRuleJson] = useState(null);
  const [executeRuleJson, setExecuteRuleJson] = useState(null);
  const [inspectionRuleJson, setInspectionRuleJson] = useState(null);
  const [packingRuleJson, setPackingRuleJson] = useState(null);
  const [reworkRuleJson, setReworkRuleJson] = useState(null);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [isChange, setChangeFlag] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(PENDING);
  const [uomDisabled, setUomDiabled] = useState(false);

  useEffect(() => {
    const { ownerOrganizationId, moId } = match.params;
    const { state } = location;
    /**
     *设置默认值
     */
    async function defaultLovSetting() {
      const res = await Promise.all([
        queryLovData({ lovCode: common.organization, defaultFlag: 'Y' }),
        queryLovData({ lovCode: common.apsOu, defaultFlag: 'Y' }),
        queryMeOuData({ lovCode: common.meOu, defaultFlag: 'Y' }),
      ]);

      if (getResponse(res)) {
        if (res[0] && res[0].content && res[0].content[0]) {
          detailDS.current.set('organizationObj', {
            organizationId: res[0].content[0].organizationId,
            organizationCode: res[0].content[0].organizationCode,
            organizationName: res[0].content[0].organizationName,
          });
          setOrganizationObj({
            organizationId: res[0].content[0].organizationId,
            organizationCode: res[0].content[0].organizationCode,
            organizationName: res[0].content[0].organizationName,
          });
        }
        if (res[1] && res[1].content && res[1].content[0]) {
          detailDS.children.moPlan.current.set('apsOuObj', {
            apsOuId: res[1].content[0].apsOuId,
            apsOuCode: res[1].content[0].apsOuCode,
            apsOuName: res[1].content[0].apsOuName,
          });
        }
        if (res[2] && res[2].content && res[2].content[0]) {
          detailDS.children.moExecute.current.set('meOuObj', {
            meOuId: res[2].content[0].meOuId,
            meOuCode: res[2].content[0].meOuCode,
            organizationName: res[2].content[0].organizationName,
          });
        }
      }
    }

    /**
     * 查询并校验状态
     */
    async function query(orgId, id) {
      detailDS.queryParameter = { ownerOrganizationId: orgId, moId: id };
      await detailDS.query().then((res) => {
        if (getResponse(res) && res.content && res.content[0]) {
          checkMoStatus(res);
          setDocProcessRule(res.content[0].docProcessRule);
          if (res.content[0].moExecuteList && res.content[0].moExecuteList[0]) {
            setDispatchRuleJson(res.content[0].moExecuteList[0].dispatchRule);
            setExecuteRuleJson(res.content[0].moExecuteList[0].executeRule);
            setInspectionRuleJson(res.content[0].moExecuteList[0].inspectionRule);
            setPackingRuleJson(res.content[0].moExecuteList[0].packingRule);
            setReworkRuleJson(res.content[0].moExecuteList[0].reworkRule);
          }
        }
      });
    }

    function updateDSDirty() {
      setChangeFlag(detailDS.dirty);
    }

    function addDirtyDetect() {
      detailDS.addEventListener('update', updateDSDirty);
      detailDS.addEventListener('create', updateDSDirty);
      detailDS.addEventListener('remove', updateDSDirty);
    }

    if (ownerOrganizationId && moId) {
      query(ownerOrganizationId, moId);
      setCreateFlag(false);
      addDirtyDetect();
    } else {
      if (state && state.mode && state.mode === 'copy') {
        detailDS.create(state.cloneData, 0);
        return;
      }
      if (!detailDS.current) {
        detailDS.create({}, 0);
        detailDS.children.moPlan.create({}, 0);
        detailDS.children.moExecute.create({}, 0);
      }

      defaultLovSetting().then(addDirtyDetect);
    }

    return () => {
      detailDS.removeEventListener('update', updateDSDirty);
      detailDS.removeEventListener('create', updateDSDirty);
      detailDS.removeEventListener('remove', updateDSDirty);
    };
  }, [detailDS, match, location]);

  /*
   **检查当前MO状态
   */
  function checkMoStatus(result) {
    if (result && result.content && result.content[0]) {
      if (
        result.content[0].moStatus === 'CLOSED' ||
        result.content[0].moStatus === 'CANCELLED' ||
        result.content[0].moStatus === 'PENDING'
      ) {
        setAllDisabled(true);
      }
      if (result.content[0].moStatus !== 'NEW' && result.content[0].moStatus !== 'SCHEDULED') {
        setMeOuDisabled(true);
      }
    }
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * 监听组织Lov字段变化
   * @param record 选中行信息
   */
  function handleOrgChange(record) {
    handleReset();
    if (!isEmpty(record)) {
      setOrganizationObj({
        organizationId: record.organizationId,
        organizationCode: record.organizationCode,
        organizationName: record.organizationName,
      });
      detailDS.current.set('organizationObj', {
        organizationId: record.organizationId,
        organizationCode: record.organizationCode,
        organizationName: record.organizationName,
      });
    } else {
      setOrganizationObj(null);
    }
    if (moTypeObj) {
      detailDS.current.set('moTypeObj', moTypeObj);
    }
  }

  /**
   * 监听订单类型Lov字段变化
   * @param record 选中行信息
   */
  function handleMoTypeChange(record) {
    handleReset();
    if (!isEmpty(record)) {
      setMoTypeObj({
        documentTypeId: record.documentTypeId,
        documentTypeCode: record.documentTypeCode,
        documentTypeName: record.documentTypeName,
        docProcessRule: record.docProcessRule,
      });
      detailDS.current.set('moTypeObj', {
        documentTypeId: record.documentTypeId,
        documentTypeCode: record.documentTypeCode,
        documentTypeName: record.documentTypeName,
        docProcessRule: record.docProcessRule,
      });
      setDocProcessRule(record.docProcessRule);
      if (
        !isEmpty(record.docProcessRule) &&
        JSON.parse(record.docProcessRule).mo_num === 'manual'
      ) {
        setMoNumDisabled(false);
        detailDS.fields.get('moNum').set('required', true);
      } else {
        setMoNumDisabled(true);
        detailDS.fields.get('moNum').set('required', false);
      }
    } else {
      setMoTypeObj(null);
    }
    if (organizationObj) {
      detailDS.current.set('organizationObj', organizationObj);
    }
  }

  /**
   * 监听物料Lov字段变化
   * @param record 选中行信息
   */
  async function handleItemChange(record) {
    if (permissionStatus === SUCCESS) {
      // setRoutingObj(detailDS.current.get('routingObj'));
    }
    handleReset();
    if (record) {
      detailDS.current.set('itemObj', {
        itemId: record.itemId,
        itemCode: record.itemCode,
        description: record.description,
        uomConversionValue: record.uomConversionValue,
      });
      detailDS.current.set('mtoFlag', !!record.mtoFlag);
      if (record.uomId) {
        detailDS.current.set('uomObj', {
          uomId: record.uomId,
          uomCode: record.uom,
          uomName: record.uomName,
        });
        setUomDiabled(true);
      } else {
        setUomDiabled(false);
      }
      detailDS.current.set('secondUomObj', {
        uomId: record.secondUomId,
        uomCode: record.secondUom,
        uomName: record.secondUomName,
      });
      detailDS.children.moExecute.current.set('completeWarehouseObj', {
        warehouseId: record.completeWarehouseId,
        warehouseCode: record.completeWarehouseCode,
        warehouseName: record.completeWarehouseName,
      });
      detailDS.children.moExecute.current.set('completeWmAreaObj', {
        wmAreaId: record.completeWmAreaId,
        wmAreaCode: record.completeWmAreaCode,
        wmAreaName: record.completeWmAreaName,
      });
      detailDS.children.moExecute.current.set('inventoryWarehouseObj', {
        warehouseId: record.inventoryWarehouseId,
        warehouseCode: record.inventoryWarehouseCode,
        warehouseName: record.inventoryWarehouseName,
      });
      detailDS.children.moExecute.current.set('inventoryWmAreaObj', {
        wmAreaId: record.inventoryWmAreaId,
        wmAreaCode: record.inventoryWmAreaCode,
        wmAreaName: record.inventoryWmAreaName,
      });
      detailDS.children.moExecute.current.set('executeRuleObj', {
        ruleId: record.executeRuleId,
        ruleName: record.executeRuleName,
      });
      detailDS.children.moExecute.current.set('completeControlType', record.completeControlType);
      detailDS.children.moExecute.current.set('completeControlValue', record.completeControlValue);
      detailDS.children.moExecute.current.set(
        'executeRuleObject',
        record.executeRule && JSON.parse(record.executeRule)
      );
      setExecuteRuleJson(record.executeRule);
      if (permissionStatus === SUCCESS) {
        const res = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.ITEM_ROUTING`, {
          method: 'GET',
          query: {
            itemId: record.itemId,
          },
        });
        if (getResponse(res) && res.content && res.content[0]) {
          detailDS.current.set('routingObj', res.content[0]);
        }
      }
      const bomRes = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.ITEM_BOM`, {
        method: 'GET',
        query: {
          itemId: record.itemId,
        },
      });
      if (getResponse(bomRes) && bomRes.content && bomRes.content[0]) {
        detailDS.current.set('bomObj', bomRes.content[0]);
      }
    } else {
      setUomDiabled(false);
    }
    if (organizationObj) {
      detailDS.current.set('organizationObj', organizationObj);
    }
    if (moTypeObj) {
      detailDS.current.set('moTypeObj', moTypeObj);
    }
  }

  /**
   * 重置
   */
  function handleReset() {
    detailDS.current.reset();
  }

  async function getPermissionStatus(status) {
    if (status === SUCCESS && detailDS.current) {
      const res = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.RULE`, {
        method: 'GET',
        query: {
          ruleCode: 'MO_TASK_EXECUTE',
        },
      });
      if (res && res.content && res.content[0]) {
        if (detailDS.children.moExecute.current) {
          detailDS.children.moExecute.current.set('executeRuleObj', res.content[0]);
        } else {
          detailDS.children.moExecute.create({ executeRuleObj: res.content[0] });
        }
      }
    }
    setPermissionStatus(status);
  }

  function handleDemandChange(val, flag) {
    const { uomConversionValue } = detailDS.current.toJSONData();
    if (flag) {
      const num = uomConversionValue * val;
      detailDS.current.set('secondDemandQty', `${num}`.indexOf('.') === -1 ? num : num.toFixed(4));
    } else {
      const num = val / uomConversionValue;
      detailDS.current.set('demandQty', `${num}`.indexOf('.') === -1 ? num : num.toFixed(4));
    }
  }

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台')}
        backPath="/zexe/mo-workspace/list"
        isChange={isChange}
      />
      <Content>
        <Card key="mo-workspace-detail-header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={detailDS} columns={4}>
            <TextField name="supplierNumber" disabled={moNumDisabled || !createFlag} />
            <TextField name="supplierName" disabled={moNumDisabled || !createFlag} />
            <Lov
              name="organizationObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleOrgChange}
            />
            <Lov
              name="moTypeObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleMoTypeChange}
            />
            <TextField name="moNum" disabled={moNumDisabled || !createFlag} />
            <Select name="moStatus" disabled />
            <Lov
              name="itemObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleItemChange}
            />
            <Lov name="uomObj" noCache disabled={!createFlag || allDisabled || uomDisabled} />
            <TextField name="itemDescription" colSpan={2} disabled />
            <NumberField
              name="demandQty"
              disabled={allDisabled}
              onChange={(val) => handleDemandChange(val, true)}
            />
            <DateTimePicker name="demandDate" disabled={allDisabled} />
            <TextField name="remark" colSpan={2} disabled={allDisabled} />
          </Form>
          <Divider>
            <div>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {!showFlag
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div style={!showFlag ? { display: 'none' } : { display: 'block' }}>
            <Form dataSet={detailDS} columns={4}>
              <DatePicker name="promiseDate" disabled={allDisabled} />
              <DatePicker name="deadlineDate" disabled={allDisabled} />
              <TextField name="releaseTimeStart" disabled />
              <TextField name="releaseTimeEnd" disabled />
              <Lov name="sourceDocTypeObj" noCache disabled={!createFlag || allDisabled} />
              <Lov name="sourceDocObj" noCache disabled={!createFlag || allDisabled} />
              <Lov name="sourceDocLineObj" noCache disabled={!createFlag || allDisabled} />
              <Select name="externalOrderType" disabled={!createFlag || allDisabled} />
              <NumberField name="externalId" disabled={!createFlag || allDisabled} />
              <TextField name="externalNum" disabled={!createFlag || allDisabled} />
              <TextField name="externalInfo" colSpan={2} disabled />
              <TextField name="releaseInfo" disabled />
              <TextField name="closeInfo" disabled />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '50%',
                position: 'absolute',
                lineHeight: '50px',
              }}
            >
              <span>{intl.get(`${preCode}.model.moWarnning`).d('MO警告')}:</span>
              <span
                style={{
                  display: 'inline-block',
                  width: 20,
                  height: 20,
                  marginLeft: 10,
                  borderRadius: '50%',
                  verticalAlign: 'middle',
                  background: detailDS.moWarnningFlag ? 'red' : 'green',
                }}
              />
            </div>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '75%',
                position: 'absolute',
                lineHeight: '50px',
              }}
            >
              <Tooltip placement="top" title={docProcessRule}>
                <a>{intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}</a>
              </Tooltip>
            </div>
          </div>
        </Card>
        <Card
          key="mo-workspace-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <LineDetail
            tableDS={detailDS}
            isCreate={createFlag}
            allDisabled={allDisabled}
            meOuDisabled={meOuDisabled}
            setDispatchRuleJson={setDispatchRuleJson}
            dispatchRuleJson={dispatchRuleJson}
            setExecuteRuleJson={setExecuteRuleJson}
            executeRuleJson={executeRuleJson}
            setInspectionRuleJson={setInspectionRuleJson}
            inspectionRuleJson={inspectionRuleJson}
            setPackingRuleJson={setPackingRuleJson}
            packingRuleJson={packingRuleJson}
            setReworkRuleJson={setReworkRuleJson}
            reworkRuleJson={reworkRuleJson}
            onPermissionStatus={getPermissionStatus}
            onDemandChange={handleDemandChange}
          />
        </Card>
      </Content>
    </>
  );
};
