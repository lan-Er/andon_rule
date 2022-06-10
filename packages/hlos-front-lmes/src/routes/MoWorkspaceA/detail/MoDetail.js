/**
 * @Description: MO工作台新建/详情页面 - 头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-16 18:38:08
 * @LastEditors: yu.na
 */

import React, { useContext, useState, useEffect } from 'react';
import {
  Lov,
  Form,
  Select,
  TextField,
  NumberField,
  Button,
  Modal,
  DatePicker,
  DateTimePicker,
  Switch,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import Store from '@/stores/moWorkspaceADS';
import {
  releaseMo,
  cancelMo,
  closeMo,
  exploreMo,
  holdMo,
  unholdMo,
  queryMeOuData,
  getMoItem,
} from '@/services/moWorkspaceService';
import codeConfig from '@/common/codeConfig';

import LineDetail from './LineDetail';

const { common } = codeConfig.code;

const preCode = 'lmes.moWorkspace';

export default () => {
  const { detailDS, match, history, location } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(true);
  const [allDisabled, setAllDisabled] = useState(false);
  const [moNumDisabled, setMoNumDisabled] = useState(false);
  const [pendingDisabled, setPendingDisabled] = useState(false);
  const [organizationObj, setOrganizationObj] = useState(null);
  const [moTypeObj, setMoTypeObj] = useState(null);
  const [dispatchRuleJson, setDispatchRuleJson] = useState(null);
  const [executeRuleJson, setExecuteRuleJson] = useState(null);
  const [inspectionRuleJson, setInspectionRuleJson] = useState(null);
  const [packingRuleJson, setPackingRuleJson] = useState(null);
  const [reworkRuleJson, setReworkRuleJson] = useState(null);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [closeLoading, setCloseLoading] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [unholdLoading, setUnholdLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
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
        queryMeOuData({ lovCode: common.meOu, defaultFlag: 'Y' }),
      ]);
      if (getResponse(res)) {
        if (res[0] && res[0].content && res[0].content[0]) {
          detailDS.current.set('organizationObj', {
            organizationId: res[0].content[0].organizationId,
            organizationCode: res[0].content[0].organizationCode,
            organizationName: res[0].content[0].organizationName,
          });
          detailDS.children.moExecute.current.set(
            'organizationId',
            res[0].content[0].organizationId
          );
          setOrganizationObj({
            organizationId: res[0].content[0].organizationId,
            organizationCode: res[0].content[0].organizationCode,
            organizationName: res[0].content[0].organizationName,
          });
        }
        if (res[1] && res[1].content && res[1].content[0]) {
          detailDS.children.moExecute.current.set('meOuObj', {
            meOuId: res[1].content[0].meOuId,
            meOuCode: res[1].content[0].meOuCode,
            organizationName: res[1].content[0].organizationName,
          });
        }
      }
      const settingRes = await userSetting({ defaultFlag: 'Y' });
      if (getResponse(settingRes)) {
        if (settingRes && settingRes.content && settingRes.content[0]) {
          detailDS.current.set('moTypeObj', {
            documentTypeId: settingRes.content[0].moTypeId,
            documentTypeCode: settingRes.content[0].moTypeCode,
            documentTypeName: settingRes.content[0].moTypeName,
          });
          detailDS.children.moExecute.current.set('moTypeId', res[0].content[0].moTypeId);
          setMoTypeObj({
            documentTypeId: settingRes.content[0].moTypeId,
            documentTypeCode: settingRes.content[0].moTypeCode,
            documentTypeName: settingRes.content[0].moTypeName,
          });
          // detailDS.children.moExecute.current.set('moTypeObj', {
          //   moTypeId: settingRes.content[0].moTypeId,
          //   moTypeCode: settingRes.content[0].moTypeCode,
          //   moTypeName: settingRes.content[0].moTypeName,
          // });
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

    if (ownerOrganizationId && moId) {
      query(ownerOrganizationId, moId);
      setCreateFlag(false);
    } else {
      if (state && state.mode && state.mode === 'copy') {
        changeMoDisabled(state.cloneData.docProcessRule);
        detailDS.create(state.cloneData, 0);
        return;
      }
      detailDS.create({}, 0);
      detailDS.children.moExecute.create({}, 0);

      defaultLovSetting();
    }
  }, [detailDS, match, location]);

  /*
   **刷新页面
   */
  async function refreshPage() {
    const { moId, ownerOrganizationId } = match.params;
    detailDS.queryParameter = { moId, ownerOrganizationId };
    await detailDS.query();
  }

  /*
   **检查当前MO状态
   */
  function checkMoStatus(result) {
    if (result && result.content && result.content[0]) {
      if (result.content[0].moStatus === 'CLOSED' || result.content[0].moStatus === 'CANCELLED') {
        setAllDisabled(true);
      }
      if (result.content[0].moStatus === 'PENGING') {
        setPendingDisabled(true);
      }
    }
  }
  /**
   *新增
   */
  async function handleAdd() {
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.saveData`).d('是否保存当前数据？')}</p>,
      okText: '是',
      cancelText: '否',
      onOk: handleSave,
      onCancel: () => refreshPage(),
    });
  }

  /**
   *暂挂
   */
  function handlePending() {
    if (
      detailDS.current.data.moStatus !== 'NEW' &&
      detailDS.current.data.moStatus !== 'SCHEDULED' &&
      detailDS.current.data.moStatus !== 'RELEASED'
    ) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.pendingLimit`)
          .d('只有新增、已排期、已下达状态的MO才允许暂挂！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.pendingMo`).d('是否暂挂MO？')}</p>,
      onOk: () => {
        setPendingLoading(true);
        holdMo([detailDS.current.data.moId]).then(async (res) => {
          setPendingLoading(false);
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success({
              message: intl.get(`${preCode}.view.message.pendingOk`).d('暂挂成功'),
            });
            await detailDS.query().then((result) => {
              checkMoStatus(result);
            });
          }
        });
      },
    });
  }

  /**
   *复制
   */
  function handleCopy() {
    const cloneData = detailDS.current.toData();
    cloneData.moNum = null;
    cloneData.moId = null;
    cloneData.moLastStatus = null;
    cloneData.moStatus = 'NEW';
    cloneData.moExecute.forEach((element) => {
      const _elm = element;
      _elm.moId = null;
      _elm.moNum = null;
      _elm.moExecuteId = null;
    });
    history.push({
      pathname: '/lmes/mo-workspace-a/create',
      state: { mode: 'copy', cloneData },
    });
    setCreateFlag(true);
  }

  /**
   *保存
   */
  async function handleSave() {
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    setSubmitLoading(true);
    const res = await detailDS.submit();
    setSubmitLoading(false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmes/mo-workspace-a/detail/${res.content[0].ownerOrganizationId}/${res.content[0].moId}`;
      history.push(pathname);
    } else if (!createFlag) {
      refreshPage();
    }
  }

  /**
   *下达
   */
  function handleRelease() {
    if (
      detailDS.current.data.moStatus !== 'NEW' &&
      detailDS.current.data.data.moStatus !== 'SCHEDULED'
    ) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新增和已排期状态的MO才允许下达！'),
      });
      return;
    }
    setReleaseLoading(true);
    releaseMo([detailDS.current.data.moId]).then(async (res) => {
      setReleaseLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.releaseOk`).d('下达成功'),
        });
        await detailDS.query().then((result) => {
          checkMoStatus(result);
        });
      }
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    if (
      detailDS.current.data.moStatus === 'NEW' ||
      detailDS.current.data.moStatus === 'SCHEDULED' ||
      detailDS.current.data.moStatus === 'RELEASED' ||
      detailDS.current.data.moStatus === 'PENDING'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.cancelMo`).d('是否取消MO？')}</p>,
        onOk: () => {
          setCancelLoading(true);
          cancelMo([detailDS.current.data.moId]).then(async (res) => {
            setCancelLoading(false);
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: intl.get(`${preCode}.view.message.cancelOk`).d('取消成功'),
              });
              await detailDS.query().then((result) => {
                checkMoStatus(result);
              });
            }
          });
        },
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('只有新增、已排期、已下达、已暂挂状态的MO才允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    if (
      detailDS.current.data.moStatus !== 'CANCELLED' &&
      detailDS.current.data.moStatus !== 'CLOSED' &&
      detailDS.current.data.releasedDate
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeMo`).d('是否关闭MO？')}</p>,
        onOk: () => {
          setCloseLoading(true);
          closeMo([detailDS.current.data.moId]).then(async (res) => {
            setCloseLoading(false);
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: intl.get(`${preCode}.view.message.closeOk`).d('关闭成功'),
              });
              await detailDS.query().then((result) => {
                checkMoStatus(result);
              });
            }
          });
        },
      });
    } else if (!detailDS.current.data.releasedDate) {
      notification.error({
        message: intl.get(`${preCode}.view.message.releasedDateLimit`).d('下达时间不能为空！'),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('已取消、已关闭状态的MO不允许关闭！'),
      });
    }
  }

  /**
   *复原
   */
  function handleRestore() {
    if (detailDS.current.data.moStatus === 'PENDING') {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.restoreMo`).d('是否恢复MO？')}</p>,
        onOk: () => {
          setUnholdLoading(true);
          unholdMo([detailDS.current.data.moId]).then(async (res) => {
            setUnholdLoading(false);
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: intl.get(`${preCode}.view.message.restoreOk`).d('复原成功'),
              });
              await detailDS.query().then((result) => {
                checkMoStatus(result);
              });
            }
          });
        },
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.restoreLimit`)
          .d('只有已暂挂状态的MO才允许复原！'),
      });
    }
  }

  /**
   *分解
   */
  function handleExplore() {
    if (
      detailDS.current.data.moStatus !== 'NEW' &&
      detailDS.current.data.moStatus !== 'SCHEDULED' &&
      detailDS.current.data.moStatus !== 'RELEASED'
    ) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.exploreLimit`)
          .d('只有新增、已排期、已下达状态的MO才允许分解！'),
      });
      return;
    }
    setExploreLoading(true);
    exploreMo({
      exploreLevel: 0,
      // exploreRule: {}, // 后续拓展
      moIdList: [detailDS.current.data.moId],
    }).then(async (res) => {
      setExploreLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.exploreOk`).d('分解成功'),
        });
        await detailDS.query().then((result) => {
          checkMoStatus(result);
        });
      }
    });
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
      detailDS.children.moExecute.current.set('organizationId', record.organizationId);
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
      changeMoDisabled(record.docProcessRule);
    } else {
      setMoTypeObj(null);
    }
    if (organizationObj) {
      detailDS.current.set('organizationObj', organizationObj);
    }
  }

  function changeMoDisabled(rule) {
    if (!isEmpty(rule) && JSON.parse(rule).doc_num === 'manual') {
      setMoNumDisabled(false);
      detailDS.fields.get('moNum').set('required', true);
    } else {
      setMoNumDisabled(true);
      detailDS.fields.get('moNum').set('required', false);
    }
  }

  /**
   * 监听物料Lov字段变化
   * @param record 选中行信息
   */
  async function handleItemChange(record) {
    handleReset();
    if (record) {
      detailDS.current.set('itemObj', {
        itemId: record.itemId,
        itemCode: record.itemCode,
        description: record.description,
      });
      detailDS.children.moExecute.current.set('completeControlType', record.completeControlType);
      detailDS.children.moExecute.current.set('completeControlValue', record.completeControlValue);
      const res = await getMoItem([
        {
          organizationId: organizationObj.organizationId,
          itemId: record.itemId,
        },
      ]);
      if (Array.isArray(res) && res[0]) {
        const {
          uomId,
          uom,
          uomName,
          bomVersion,
          bomId,
          routingVersion,
          routingId,
          itemMe,
        } = res[0];
        if (uomId) {
          detailDS.current.set('uomObj', {
            uomId,
            uomCode: uom,
            uomName,
          });
          setUomDiabled(true);
        } else {
          setUomDiabled(false);
        }
        if (bomId) {
          detailDS.current.set('bomObj', {
            bomId,
            bomVersion,
          });
        }
        if (routingId) {
          detailDS.current.set('routingObj', {
            routingVersion,
            routingId,
          });
        }
        if (itemMe) {
          const {
            completeWarehouseId,
            completeWarehouseCode,
            completeWarehouseName,
            completeWmAreaId,
            completeWmAreaCode,
            completeWmAreaName,
            inventoryWarehouseId,
            inventoryWarehouseCode,
            inventoryWarehouseName,
            inventoryWmAreaId,
            inventoryWmAreaCode,
            inventoryWmAreaName,
            executeRuleId,
            executeRuleName,
            executeRule,
            inspectionRuleId,
            inspectionRuleName,
            inspectionRule,
            reworkRuleId,
            reworkRule,
            reworkRuleName,
            packingRuleId,
            packingRuleName,
            packingRule,
            dispatchRuleId,
            dispatchRuleName,
            dispatchRule,
          } = itemMe;
          if (completeWarehouseId) {
            detailDS.children.moExecute.current.set('completeWarehouseObj', {
              warehouseId: completeWarehouseId,
              warehouseCode: completeWarehouseCode,
              warehouseName: completeWarehouseName,
            });
          }
          if (completeWmAreaId) {
            detailDS.children.moExecute.current.set('completeWmAreaObj', {
              wmAreaId: completeWmAreaId,
              wmAreaCode: completeWmAreaCode,
              wmAreaName: completeWmAreaName,
            });
          }
          if (inventoryWarehouseId) {
            detailDS.children.moExecute.current.set('inventoryWarehouseObj', {
              warehouseId: inventoryWarehouseId,
              warehouseCode: inventoryWarehouseCode,
              warehouseName: inventoryWarehouseName,
            });
          }
          if (inventoryWmAreaId) {
            detailDS.children.moExecute.current.set('inventoryWmAreaObj', {
              wmAreaId: inventoryWmAreaId,
              wmAreaCode: inventoryWmAreaCode,
              wmAreaName: inventoryWmAreaName,
            });
          }
          if (executeRuleId) {
            detailDS.children.moExecute.current.set('executeRuleObj', {
              ruleId: executeRuleId,
              ruleName: executeRuleName,
            });
            detailDS.children.moExecute.current.set(
              'executeRuleObject',
              executeRule && JSON.parse(executeRule)
            );
            setExecuteRuleJson(executeRule);
          }
          if (inspectionRuleId) {
            detailDS.children.moExecute.current.set('inspectionRuleObj', {
              ruleId: inspectionRuleId,
              ruleName: inspectionRuleName,
            });
            detailDS.children.moExecute.current.set(
              'inspectionRuleObject',
              inspectionRule && JSON.parse(inspectionRule)
            );
            setInspectionRuleJson(inspectionRule);
          }
          if (reworkRuleId) {
            detailDS.children.moExecute.current.set('reworkRuleObj', {
              ruleId: reworkRuleId,
              ruleName: reworkRuleName,
            });
            detailDS.children.moExecute.current.set(
              'reworkRuleObject',
              reworkRule && JSON.parse(reworkRule)
            );
            setReworkRuleJson(reworkRule);
          }
          if (packingRuleId) {
            detailDS.children.moExecute.current.set('packingRuleObj', {
              ruleId: packingRuleId,
              ruleName: packingRuleName,
            });
            detailDS.children.moExecute.current.set(
              'packingRuleObject',
              packingRule && JSON.parse(packingRule)
            );
            setPackingRuleJson(packingRule);
          }
          if (dispatchRuleId) {
            detailDS.children.moExecute.current.set('dispatchRuleObj', {
              ruleId: dispatchRuleId,
              ruleName: dispatchRuleName,
            });
            detailDS.children.moExecute.current.set(
              'dispatchRuleObject',
              dispatchRule && JSON.parse(dispatchRule)
            );
            setDispatchRuleJson(dispatchRule);
          }
        }
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

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台')}
        backPath="/lmes/mo-workspace-a/list"
      >
        <Button
          icon="add"
          color={allDisabled || createFlag ? 'default' : 'primary'}
          onClick={handleAdd}
          disabled={allDisabled || createFlag}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <Button
          loading={unholdLoading}
          waitType="throttle"
          onClick={handleRestore}
          disabled={createFlag || pendingDisabled}
        >
          {intl.get('lmes.common.button.restore').d('复原')}
        </Button>
        <Button
          loading={pendingLoading}
          waitType="throttle"
          onClick={handlePending}
          disabled={allDisabled || createFlag}
        >
          {intl.get('lmes.common.button.pending').d('暂挂')}
        </Button>
        <Button
          loading={exploreLoading}
          waitType="throttle"
          onClick={handleExplore}
          disabled={allDisabled || createFlag}
        >
          {intl.get('lmes.common.button.explore').d('分解')}
        </Button>
        <Button
          loading={submitLoading}
          waitType="throttle"
          onClick={handleSave}
          disabled={allDisabled}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button
          loading={closeLoading}
          waitType="throttle"
          onClick={handleClose}
          disabled={pendingDisabled || createFlag}
        >
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button
          loading={cancelLoading}
          waitType="throttle"
          onClick={handleCancel}
          disabled={allDisabled || createFlag}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button onClick={handleCopy} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.copy').d('复制')}
        </Button>
        <Button
          loading={releaseLoading}
          waitType="throttle"
          onClick={handleRelease}
          disabled={allDisabled || createFlag}
        >
          {intl.get('lmes.common.button.release').d('下达')}
        </Button>
      </Header>
      <Content>
        <Card key="mo-workspace-detail-header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={detailDS} columns={4}>
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
            <TextField name="itemDescription" colSpan={2} disabled />
            <Lov name="uomObj" noCache disabled={!createFlag || allDisabled || uomDisabled} />
            <NumberField name="demandQty" disabled={allDisabled} />
            <DateTimePicker name="demandDate" disabled={allDisabled} />
            <DatePicker name="planStartDate" disabled={allDisabled} />
            <DatePicker name="planEndDate" disabled={allDisabled} />
            <Lov name="itemCategoryObj" disabled={allDisabled} noCache />
            <Lov name="bomObj" noCache disabled={allDisabled} />
            <Lov name="routingObj" noCache disabled={allDisabled} />
            <TextField name="remark" colSpan={2} disabled={allDisabled} />
            <Lov name="customerObj" noCache disabled={allDisabled} />
            <Lov name="demandObj" noCache disabled={allDisabled} />
            <TextField name="soNum" disabled={allDisabled} />
            <TextField name="soLineNum" disabled={allDisabled} />
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
              <Select name="demandRank" disabled={allDisabled} />
              <TextField name="projectNum" disabled={allDisabled} />
              <TextField name="wbsNum" disabled={allDisabled} />
              <TextField name="executePriority" disabled />
              <TextField name="moLotNumber" disabled={allDisabled} />
              <TextField name="tagCode" disabled={allDisabled} />
              <TextField name="parentMoNums" disabled />
              <TextField name="topMoNum" disabled />
              <TextField name="releaseInfo" colSpan={2} disabled />
              <TextField name="closeInfo" colSpan={2} disabled />
              <Switch name="mtoFlag" disabled={allDisabled} />
              <Switch name="mtoExploredFlag" disabled />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '51%',
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
                width: 100,
                marginTop: '-50px',
                marginLeft: '90%',
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
          />
        </Card>
      </Content>
    </>
  );
};
