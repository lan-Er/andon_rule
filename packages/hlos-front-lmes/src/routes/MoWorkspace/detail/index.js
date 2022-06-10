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
  // Button,
  Modal,
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
import notification from 'utils/notification';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import { PENDING, SUCCESS } from 'components/Permission/Status';
import { Button as ButtonPermission } from 'components/Permission';
import { userSetting, queryLovData } from 'hlos-front/lib/services/api';
import { MoDetailDS } from '@/stores/moWorkspaceDS';
import {
  releaseMo,
  cancelMo,
  closeMo,
  exploreMo,
  holdMo,
  unholdMo,
  getMoItem,
} from '@/services/moWorkspaceService';
// import codeConfig from '@/common/codeConfig';

import LineDetail from './LineDetail';

// const { common } = codeConfig.code;

const preCode = 'lmes.moWorkspace';

export default ({ match, history, location }) => {
  const detailDS = useMemo(() => new DataSet(MoDetailDS()), []);
  const [showFlag, setShowFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(true);
  const [allDisabled, setAllDisabled] = useState(false);
  const [meOuDisabled, setMeOuDisabled] = useState(false);
  const [moNumDisabled, setMoNumDisabled] = useState(false);
  const [pendingDisabled, setPendingDisabled] = useState(false);
  const [organizationObj, setOrganizationObj] = useState(null);
  const [moTypeObj, setMoTypeObj] = useState(null);
  const [dispatchRuleJson, setDispatchRuleJson] = useState(null);
  const [executeRuleJson, setExecuteRuleJson] = useState(null);
  const [inspectionRuleJson, setInspectionRuleJson] = useState(null);
  const [packingRuleJson, setPackingRuleJson] = useState(null);
  const [reworkRuleJson, setReworkRuleJson] = useState(null);
  // const [collectorJson, setCollectorJson] = useState(null);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [isChange, setChangeFlag] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(PENDING);
  const [closeLoading, setCloseLoading] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [unholdLoading, setUnholdLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [routingDisabled, setRoutingDisabled] = useState(true);
  const [secondDemandQtyDisabled, setsecondDemandQtyDisabled] = useState(true);
  const [currentItemData, setCurrentItemData] = useState({});

  useEffect(() => {
    const { ownerOrganizationId, moId } = match.params;
    const { state } = location;
    /**
     *设置默认值
     */
    async function defaultLovSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        detailDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
        detailDS.children.moExecute.current.set('organizationId', res.content[0].organizationId);
        setOrganizationObj({
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
        detailDS.children.moPlan.current.set('organizationId', res.content[0].organizationId);
        detailDS.children.moPlan.current.set('apsOuObj', {
          apsOuId: res.content[0].apsOuId,
          apsOuCode: res.content[0].apsOuCode,
          apsOuName: res.content[0].apsOuName,
        });
        detailDS.children.moExecute.current.set('meOuObj', {
          meOuId: res.content[0].meOuId,
          meOuCode: res.content[0].meOuCode,
          organizationName: res.content[0].organizationName,
        });
      }
      const { moTypeCode } = res.content[0];
      const resp = await queryLovData({
        lovCode: 'LMDS.DOCUMENT_TYPE',
        documentClass: 'MO',
        documentTypeCode: moTypeCode,
      });
      if (getResponse(resp)) {
        handleMoTypeChange(resp.content[0]);
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
          if (res.content[0].secondUomId) {
            setsecondDemandQtyDisabled(false);
          }
          if (res.content[0].moExecuteList && res.content[0].moExecuteList[0]) {
            setDispatchRuleJson(res.content[0].moExecuteList[0].dispatchRule);
            setExecuteRuleJson(res.content[0].moExecuteList[0].executeRule);
            setInspectionRuleJson(res.content[0].moExecuteList[0].inspectionRule);
            setPackingRuleJson(res.content[0].moExecuteList[0].packingRule);
            setReworkRuleJson(res.content[0].moExecuteList[0].reworkRule);
            // setCollectorJson(res.content[0].moExecuteList[0].collector);
          }
        }
      });
    }

    // async function getDefaultDocumentType() {
    //   const res = await queryLovData({
    //     lovCode: 'LMDS.DOCUMENT_TYPE',
    //     documentClass: 'MO',
    //     documentTypeCode: 'STANDARD_MO',
    //   });
    //   if (res && res.content && res.content[0]) {
    //     detailDS.current.set('moTypeObj', res.content[0]);
    //   }
    // }

    function updateDSDirty({ record, name }) {
      setChangeFlag(detailDS.dirty);
      if (name === 'organizationObj') {
        detailDS.children.moExecute.current.set(
          'organizationId',
          record.get('organizationObj').organizationId
        );
      }
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
      // getDefaultDocumentType();
    }

    return () => {
      detailDS.removeEventListener('update', updateDSDirty);
      detailDS.removeEventListener('create', updateDSDirty);
      detailDS.removeEventListener('remove', updateDSDirty);
    };
  }, [detailDS]);

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
      if (
        result.content[0].moStatus === 'CLOSED' ||
        result.content[0].moStatus === 'CANCELLED' ||
        result.content[0].moStatus === 'PENDING' ||
        result.content[0].moStatus === 'COMPLETED'
      ) {
        setAllDisabled(true);
      }
      if (result.content[0].moStatus !== 'NEW' && result.content[0].moStatus !== 'SCHEDULED') {
        setMeOuDisabled(true);
      }
      if (result.content[0].moStatus === 'CLOSED' || result.content[0].moStatus === 'CANCELLED') {
        setPendingDisabled(true);
      }
      if (result.content[0].moStatus === 'NEW') {
        setRoutingDisabled(false);
        setAllDisabled(false);
        setMeOuDisabled(false);
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
      onOk: () => handleSave(true),
      onCancel: () => handleModalCancel(),
    });
  }

  function handleModalCancel() {
    const pathname = `/lmes/mo-workspace/create`;
    history.push(pathname);
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
    cloneData.parentMoNums = null;
    cloneData.topMoId = null;
    cloneData.topMoNum = null;
    cloneData.moLevel = null;
    cloneData.mtoExploredFlag = false;
    cloneData.moExecute.forEach((element) => {
      const _elm = element;
      _elm.moId = null;
      _elm.moNum = null;
      _elm.moExecuteId = null;
      _elm.executeStatus = null;
      _elm.supplyQty = null;
      _elm.inputQty = null;
      _elm.maxIssuedQty = null;
      _elm.issuedSuit = null;
      _elm.completedQty = null;
      _elm.inventoryQty = null;
      _elm.scrappedQty = null;
      _elm.ngQty = null;
      _elm.reworkQty = null;
      _elm.pendingQty = null;
      _elm.executePriority = null;
      _elm.printedDate = null;
      _elm.issuedFlag = null;
      _elm.printedFlag = null;
    });
    cloneData.moPlan.forEach((element) => {
      const _elm = element;
      _elm.moId = null;
      _elm.moNum = null;
      _elm.moPlanId = null;
      _elm.earliestStartTime = null;
      _elm.startTime = null;
      _elm.fulfillTime = null;
      _elm.scheduleReleaseTime = null;
      _elm.fpsTime = null;
      _elm.fpcTime = null;
      _elm.lpsTime = null;
      _elm.lpcTime = null;
    });
    history.push({
      pathname: '/lmes/mo-workspace/create',
      state: { mode: 'copy', cloneData },
    });
    setCreateFlag(true);
  }

  /**
   *保存
   */
  async function handleSave(flag) {
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
    } else if (res === undefined && !flag) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (flag) {
      const pathname = `/lmes/mo-workspace/create`;
      history.push(pathname);
      return;
    }
    if (res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmes/mo-workspace/detail/${res.content[0].ownerOrganizationId}/${res.content[0].moId}`;
      history.push(pathname);
      setChangeFlag(false);
      sessionStorage.setItem('moWorkspaceParentQuery', true);
    } else if (!createFlag) {
      refreshPage();
      sessionStorage.setItem('moWorkspaceParentQuery', true);
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
              setPendingDisabled(false);
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
  function handleMoTypeChange(record, flag) {
    if (flag) {
      handleReset();
    }
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
        JSON.parse(record.docProcessRule).doc_num === 'manual'
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
    // detailDS.children.moPlan.data = [];
    // detailDS.children.moExecute.data = [];
    detailDS.children.moPlan.create({}, 0);
    detailDS.children.moExecute.create({}, 0);
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
      }
      if (record.secondUomId) {
        detailDS.current.set('secondUomObj', {
          uomId: record.secondUomId,
          uomCode: record.secondUom,
          uomName: record.secondUomName,
        });
        setsecondDemandQtyDisabled(false);
      } else {
        setsecondDemandQtyDisabled(true);
      }
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
      const res = await getMoItem([
        {
          organizationId: organizationObj.organizationId,
          itemId: record.itemId,
        },
      ]);
      if (Array.isArray(res) && res[0]) {
        const { bomVersion, bomId, routingVersion, routingId, itemMe = {}, itemAps = {} } = res[0];
        setCurrentItemData(res[0]);
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
        if (itemMe && itemMe.meCategoryId) {
          detailDS.current.set('itemCategoryObj', {
            categoryId: itemMe.meCategoryId,
            categoryCode: itemMe.meCategoryCode,
            categoryName: itemMe.meCategoryName,
          });
        } else {
          detailDS.current.set('itemCategoryObj', null);
        }
        if (itemAps && itemAps.releaseRuleId) {
          detailDS.children.moPlan.current.set('releaseRuleObj', {
            ruleId: itemAps.releaseRuleId,
            ruleName: itemAps.releaseRuleName,
            ruleJson: itemAps.releaseRule,
          });
        }
        if (itemMe && itemMe.inspectionRuleId) {
          detailDS.children.moExecute.current.set('inspectionRuleObj', {
            ruleId: itemMe.inspectionRuleId,
            ruleName: itemMe.inspectionRuleName,
            ruleJson: itemMe.inspectionRule,
          });
        }
        if (itemMe && itemMe.packingRuleId) {
          detailDS.children.moExecute.current.set('packingRuleObj', {
            ruleId: itemMe.packingRuleId,
            ruleName: itemMe.packingRuleName,
            ruleJson: itemMe.packingRule,
          });
        }
        if (itemMe && itemMe.reworkRuleId) {
          detailDS.children.moExecute.current.set('reworkRuleObj', {
            ruleId: itemMe.reworkRuleId,
            ruleName: itemMe.reworkRuleName,
            ruleJson: itemMe.reworkRule,
          });
        }
        if (itemMe && itemMe.meOuId) {
          detailDS.children.moExecute.current.set('meOuObj', {
            meOuId: itemMe.meOuId,
            meOuCode: itemMe.meOuCode,
            organizationName: itemMe.meOuName,
          });
        }
        if (itemMe && itemMe.dispatchRuleId) {
          detailDS.children.moExecute.current.set('dispatchRuleObj', {
            ruleId: itemMe.dispatchRuleId,
            ruleName: itemMe.dispatchRuleName,
            ruleJson: itemMe.dispatchRule,
          });
        }
        if (itemMe && itemMe.numberRule) {
          detailDS.current.set('ruleCodeObj', {
            ruleCode: itemMe.numberRule,
            ruleName: itemMe.numberRuleName,
          });
        }
        if (itemAps && itemAps.apsOuId) {
          detailDS.children.moPlan.current.set('apsOuObj', {
            apsOuId: itemAps.apsOuId,
            apsOuCode: itemAps.apsOuCode,
            apsOuName: itemAps.apsOuName,
          });
        }
      }
      // if (permissionStatus === SUCCESS) {
      //   const res = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.ITEM_ROUTING`, {
      //     method: 'GET',
      //     query: {
      //       itemId: record.itemId,
      //     },
      //   });
      //   if (getResponse(res) && res.content && res.content[0]) {
      //     detailDS.current.set('routingObj', res.content[0]);
      //   }
      // }
      // const bomRes = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.ITEM_BOM`, {
      //   method: 'GET',
      //   query: {
      //     itemId: record.itemId,
      //   },
      // });
      // if (getResponse(bomRes) && bomRes.content && bomRes.content[0]) {
      //   detailDS.current.set('bomObj', bomRes.content[0]);
      // }
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

  function handleProdVersionChange(val, oldVal) {
    if (!val && oldVal && !isEmpty(currentItemData)) {
      const { bomVersion, bomId, routingVersion, routingId } = currentItemData;
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
    }
  }

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台')}
        backPath="/lmes/mo-workspace/list"
        isChange={isChange}
      >
        <ButtonPermission
          type="c7n-pro"
          icon="add"
          color={allDisabled || createFlag ? 'default' : 'primary'}
          onClick={handleAdd}
          disabled={allDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.create',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={unholdLoading}
          waitType="throttle"
          onClick={handleRestore}
          disabled={createFlag || pendingDisabled}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.restore',
              type: 'button',
              meaning: '复原',
            },
          ]}
        >
          {intl.get('lmes.common.button.restore').d('复原')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={pendingLoading}
          waitType="throttle"
          onClick={handlePending}
          disabled={allDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.pending',
              type: 'button',
              meaning: '暂挂',
            },
          ]}
        >
          {intl.get('lmes.common.button.pending').d('暂挂')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={exploreLoading}
          waitType="throttle"
          onClick={handleExplore}
          disabled={allDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.explore',
              type: 'button',
              meaning: '分解',
            },
          ]}
        >
          {intl.get('lmes.common.button.explore').d('分解')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={submitLoading}
          waitType="throttle"
          onClick={() => handleSave(false)}
          disabled={allDisabled}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.save',
              type: 'button',
              meaning: '保存',
            },
          ]}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={closeLoading}
          waitType="throttle"
          onClick={handleClose}
          disabled={pendingDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.close',
              type: 'button',
              meaning: '关闭',
            },
          ]}
        >
          {intl.get('hzero.common.button.close').d('关闭')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={cancelLoading}
          waitType="throttle"
          onClick={handleCancel}
          disabled={allDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleCopy}
          disabled={allDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.copy',
              type: 'button',
              meaning: '复制',
            },
          ]}
        >
          {intl.get('hzero.common.button.copy').d('复制')}
        </ButtonPermission>
        <ButtonPermission
          loading={releaseLoading}
          waitType="throttle"
          onClick={handleRelease}
          disabled={allDisabled || createFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.release',
              type: 'button',
              meaning: '下达',
            },
          ]}
        >
          {intl.get('lmes.common.button.release').d('下达')}
        </ButtonPermission>
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
              onChange={(rec) => handleMoTypeChange(rec, true)}
            />
            <TextField name="moNum" disabled={moNumDisabled || !createFlag} />
            <Select name="moStatus" disabled />
            <Lov
              name="itemObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleItemChange}
            />
            <Lov name="uomObj" noCache disabled />
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
              <TextField name="creatorInfo" disabled />
              <TextField name="releaseInfo" disabled />
              <TextField name="closeInfo" disabled />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '12.5%',
                marginTop: '-50px',
                marginLeft: '75%',
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
                marginLeft: '87.5%',
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
            routingDisabled={routingDisabled}
            secondDemandQtyDisabled={secondDemandQtyDisabled}
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
            onProdVersionChange={handleProdVersionChange}
            // collectorJson={collectorJson}
            // setCollectorJson={setCollectorJson}
          />
        </Card>
      </Content>
    </>
  );
};
