/*
 * @Description: 转移单平台明细
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-03-03 17:30:39
 * @LastEditors: Please set LastEditors
 */

import React, { useState, useEffect, Fragment, useCallback } from 'react';
import {
  Lov,
  Form,
  TextField,
  Button,
  Switch,
  Select,
  Tabs,
  DataSet,
  DateTimePicker,
  // NumberField,
  Modal,
} from 'choerodon-ui/pro';
import { Card, Divider, Icon } from 'choerodon-ui';

import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import { queryLovData } from 'hlos-front/lib/services/api';
import { createTransferRequestPlatformDS } from '@/stores/transferRequestDS';
import codeConfig from '@/common/codeConfig';
import { LineTable } from './transferRequestLineTable';
import { checkControlType, getItemWmRule } from '@/services/issueRequestService';
import { createAndUpdateTR } from '@/services/transferRequestService';

const intlPrefix = 'lwms.transferRequestPlatform';
const commonIntlPrefix = 'lwms.common.model';
const commonButtonPrefix = 'hzero.common.button';
const { TabPane } = Tabs;
const { common } = codeConfig.code;

let defaultOrg;
let defaultCreator;
// 数据来源（默认含义是手动创建，为'copy'表明数据是拷贝而来）
let dataSource = null;
const createTRDS = new DataSet(createTransferRequestPlatformDS());
const createTRLineDS = createTRDS.children.requestLineList;

// 确认弹框
function doConfirm(warningMsg, okCallback, cancelCallback) {
  Modal.confirm({
    title: intl.get(`${intlPrefix}.view.warning.warning`).d('警告'),
    children: <p>{warningMsg}</p>,
  }).then((button) => {
    if (button === 'ok' && okCallback) {
      okCallback();
    } else if (button === 'cancel' && cancelCallback) {
      cancelCallback();
    }
  });
}

// init organization && creator
async function setDefaultDSValue() {
  if (!defaultOrg) {
    const org = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(org)) {
      if (Array.isArray(org?.content) && createTRDS.current) {
        defaultOrg = {
          organizationId: org.content[0].organizationId,
          organizationName: org.content[0].organizationName,
          organizationCode: org.content[0].organizationCode,
        };
        createTRDS.current.set('organizationObj', defaultOrg);
        createTRDS.current.set('toOrganizationObj', defaultOrg);
      }
    }
    // return org;
  } else {
    createTRDS.current.set('organizationObj', defaultOrg);
    createTRDS.current.set('toOrganizationObj', defaultOrg);
  }
  if (!defaultCreator) {
    const user = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
    if (getResponse(user)) {
      if (Array.isArray(user?.content) && createTRDS.current) {
        defaultCreator = {
          workerId: user.content[0].workerId,
          workerName: user.content[0].workerName,
        };
        createTRDS.current.set('creatorObj', defaultCreator);
      }
    }
    // return user;
  } else {
    createTRDS.current.set('creatorObj', defaultCreator);
  }
  return Promise.resolve();
}

function TransferRequestDetail(props) {
  const { dispatch } = props;
  // 是创建还是编辑状态
  const [isCreate, setIsCreate] = useState(false);

  // 头部是否 valid
  const [isHeadValid, toggleHeadValid] = useState(false);

  // 转移单必输控制
  const [isTRNumRequired, toggleTRNumRequired] = useState(false);

  // 显示转移单头其他字段
  const [showOtherCondition, toggleShowConditionFlag] = useState(false);

  // 当前转移单头状态
  const [requestStatus, toggleRequestStatus] = useState('NEW');

  // 冻结态，不可编辑
  const freezeStatus = ['COMPLETED', 'CLOSED', 'CANCELLED'];

  // 转移单含脏数据 flag
  const [isDSDirty, setDSDirty] = useState(false);

  // 路由相关字段
  const {
    match: {
      params: { requestId },
    },
    history,
    location: { state },
  } = props;

  if (state && state.dataSource === 'copy') {
    dataSource = 'copy';
    state.dataSource = null;
  } else {
    dataSource = null;
  }

  // 初始化 DS 数据
  const initDS = useCallback(() => {
    // JUDGE: create | edit
    if (requestId) {
      setIsCreate(false);
      const {
        children: { requestLineList },
      } = createTRDS;
      createTRDS.setQueryParameter('requestId', requestId);
      requestLineList.setQueryParameter('requestId', requestId);
      createTRDS
        .query()
        .then((res) => {
          const { content } = res;
          if (Array.isArray(content) && content[0] && content[0].requestStatus) {
            toggleRequestStatus(content[0].requestStatus);
          }
          createTRDS.validate(false, false).then((v) => {
            toggleHeadValid(v);
          });
        })
        .catch((e) => notification.error({ message: e.message }));
    } else {
      setIsCreate(true);
      const { current } = createTRDS;
      const defaultData =
        dataSource === 'copy'
          ? { ...current.toData(), requestStatus: 'NEW', requestNum: null }
          : { requestStatus: 'NEW' };
      const defaultLineData =
        dataSource === 'copy'
          ? createTRLineDS.records.map((r) => {
              return { ...r.toData(), requestLineStatus: 'NEW' };
            })
          : [];
      createTRDS.loadData([]);
      createTRLineDS.loadData(defaultLineData);
      createTRDS.create(defaultData);
      // defaultLineData.forEach((line, index) => {
      //     createTRLineDS.create(
      //       {
      //         ...line,
      //         requestLineStatus: 'NEW',
      //       },
      //       index
      //     )
      //   }
      // );
      if (dataSource === null) {
        return setDefaultDSValue();
      } else {
        toggleHeadValid(true);
      }
    }
    return Promise.resolve();
  }, [requestId]);

  // 监听行 数据
  async function handleLineUpdate({ record, name }) {
    const { requestLineList } = createTRDS?.children || {};
    setDSDirty(requestLineList);
    // 根据物料带出物料控制类型的meaning, 拣料规则，FIFO规则，预留规则，仓库质检规则
    if (name === 'itemObj') {
      if (record.get('itemId')) {
        // // console.log(record.get('itemUomId'), record.get('itemUomName'), record.get('itemUomCode'),record.get('uomObj'))
        record.set('uom', record.get('itemUomName'));
        record.set('uomId', record.get('itemUomId'));
        const typeRes = await checkControlType([
          {
            organizationId: createTRDS.current.get('organizationId'),
            itemId: record.get('itemId'),
            groupId: createTRDS.current.get('organizationId'),
            tenantId: getCurrentOrganizationId(),
          },
        ]);
        if (typeRes && typeRes[0]) {
          record.set('itemControlTypeMeaning', typeRes[0].itemControlTypeMeaning);
        }
        // 获取 拣料规则，FIFO规则，预留规则，仓库质检规则
        const ruleRes = await getItemWmRule([
          {
            organizationId: createTRDS.current.get('organizationId'),
            itemId: record.get('itemId'),
          },
        ]);
        if (ruleRes && ruleRes[0]) {
          const {
            pickRule,
            pickRuleId,
            reservationRule,
            reservationRuleId,
            wmInspectRule,
            wmInspectRuleId,
            fifoRule,
            fifoRuleId,
          } = ruleRes[0];
          record.set('pickRuleObj', pickRuleId ? { ruleId: pickRuleId, ruleJson: pickRule } : null);
          record.set(
            'reservationRuleObj',
            reservationRuleId ? { ruleId: reservationRuleId, ruleJson: reservationRule } : null
          );
          record.set('fifoRuleObj', fifoRuleId ? { ruleId: fifoRuleId, ruleJson: fifoRule } : null);
          record.set(
            'wmInspectRuleObj',
            wmInspectRuleId ? { ruleId: wmInspectRuleId, ruleJson: wmInspectRule } : null
          );
        }
      } else {
        record.set('itemControlType', '');
        record.set('pickRuleObj', null);
        record.set('reservationRuleObj', null);
        record.set('fifoRuleObj', null);
        record.set('wmInspectRuleObj', null);
      }
    }
  }
  // 监听 DS 字段更新
  function handleUpdate({ record, name, value }) {
    // 控制页面是否可以编辑 (isHeadValid)
    if (name === 'organizationObj') {
      createTRDS.validate(false, false).then((res) => {
        toggleHeadValid(res);
      });
      // 组织、转移单类型变更，清空所有数据
      if (record.dirty) {
        // eslint-disable-next-line no-param-reassign
        record.data = {
          // ...toJS(record.pristineData),
          organizationObj: record.get('organizationObj'),
          requestTypeObj: record.get('requestTypeObj'),
          requestStatus: record.get('requestStatus'),
          creatorObj: defaultCreator,
          toOrganizationObj: null,
        };
        // eslint-disable-next-line no-param-reassign
        record.memo = undefined;
      }
      // record.set('creatorObj', defaultCreator);
      createTRLineDS.loadData([]);
    } else if (name === 'requestTypeObj') {
      // 转移单类型变化
      createTRDS.validate(false, false).then((res) => {
        toggleHeadValid(res);
      });
      // 清空所有数据
      if (record.dirty) {
        // eslint-disable-next-line no-param-reassign
        record.data = {
          // ...toJS(record.pristineData),
          organizationObj: record.get('organizationObj'),
          requestTypeObj: record.get('requestTypeObj'),
          requestStatus: record.get('requestStatus'),
          creatorObj: defaultCreator,
          toOrganizationObj: record.get('toOrganizationObj'),
        };
      }
      if (value && value.docProcessRule) {
        const { docProcessRule } = value;
        record.set('docProcessRule', docProcessRule);
        try {
          // eslint-disable-next-line
          const { doc_num } = JSON.parse(docProcessRule);
          // eslint-disable-next-line
          if (doc_num === 'manual') {
            toggleTRNumRequired(true);
            // 重新校验头部
            createTRDS.validate(false, false).then((res) => {
              toggleHeadValid(res);
            });
          } else {
            toggleTRNumRequired(false);
          }
        } catch (e) {
          notification.error({ message: e.message });
        }
      } else {
        record.set('docProcessRule', '');
      }
      createTRLineDS.loadData([]);
    } else if (
      [
        'wmMoveTypeObj',
        'toOrganizationObj',
        'warehouseObj',
        'wmAreaObj',
        'toWarehouseObj',
        'toWmAreaObj',
      ].includes(name)
    ) {
      // “移动类型”、"目标组织”、“发出仓库”、“发货货位”、“接收仓库”、“接收货位” 变更
      const Name2Id = {
        wmMoveTypeObj: 'moveTypeId',
        warehouseObj: 'warehouseId',
        wmAreaObj: 'wmAreaId',
        toWarehouseObj: 'warehouseId',
        toWmAreaObj: 'wmAreaId',
      };
      const Name2Translate = {
        wmMoveTypeObj: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
        warehouseObj: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
        wmAreaObj: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
        toWarehouseObj: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
        toWmAreaObj: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
      };
      // 设置值
      if (value) {
        // 已有行的情况下输入
        if (createTRLineDS.records.length > 0) {
          const hasConflictLines =
            createTRLineDS.records.filter(
              (r) => r.get(name) && r.get(name)[Name2Id[name]] !== value[Name2Id[name]]
            ).length > 0;
          if (hasConflictLines) {
            const msg = `转移单行中存在"${Name2Translate[name]}"字段与当前设置的"${Name2Translate[name]}"不一致问题`;
            Modal.warning(msg);
          } else {
            // 设置行对应字段默认值
            createTRLineDS.records.forEach((r) => r.set(name, value));
          }
        }
      }
      // 移动类型 变更，清空“目标组织”、“发出仓库”、“发货货位”、“接收仓库”、“接收货位”字段输入值
      // 根据选择的“移动类型”自动带出：
      // 发出仓库,发出货位,目标组织,目标仓库,目标货位
      if (name === 'wmMoveTypeObj') {
        if (value) {
          const {
            locationName,
            locationId,
            warehouseName,
            warehouseId,
            wmAreaName,
            wmAreaId,
            viaLocationName,
            viaLocationId,
            viaWarehouseName,
            viaWarehouseId,
            viaWmAreaName,
            viaWmAreaId,
            toOrganizationName,
            toOrganizationId,
            toWarehouseName,
            toWarehouseId,
            toWmAreaName,
            toWmAreaId,
            toLocationName,
            toLocationId,
          } = value;
          record.set('locationObj', locationId ? { locationName, locationId } : null);
          record.set('warehouseObj', warehouseId ? { warehouseName, warehouseId } : null);
          record.set('wmAreaObj', wmAreaId ? { wmAreaName, wmAreaId } : null);
          record.set('viaLocationObj', viaLocationId ? { viaLocationName, viaLocationId } : null);
          record.set(
            'viaWarehouseObj',
            viaWarehouseId ? { viaWarehouseName, viaWarehouseId } : null
          );
          record.set('viaWmAreaObj', viaWmAreaId ? { viaWmAreaName, viaWmAreaId } : null);
          record.set(
            'toOrganizationObj',
            toOrganizationId
              ? { toOrganizationName, toOrganizationId }
              : record.get('toOrganizationObj')
          );
          record.set('toWarehouseObj', toWarehouseId ? { toWarehouseName, toWarehouseId } : null);
          record.set('toWmAreaObj', toWmAreaId ? { toWmAreaName, toWmAreaId } : null);
          record.set('toLocationObj', toLocationId ? { toLocationName, toLocationId } : null);
        } else {
          record.set('toOrganizationObj', record.get('toOrganizationObj'));
          record.set('warehouseObj', null);
          record.set('wmAreaObj', null);
          record.set('toWarehouseObj', null);
          record.set('toWmAreaObj', null);
        }
      } else if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
        // console.log('发出货位: ', record.get('wmAreaObj'));
      } else if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      } else if (name === 'toOrganizationObj') {
        record.set('toWarehouseObj', null);
      }
    }
    setDSDirty(createTRDS.dirty);
  }

  // 远程操作
  function doAction(type, payload, callback) {
    dispatch({
      type,
      payload,
    })
      .then((res) => {
        if (res) {
          notification.success({
            message: intl.get(`${intlPrefix}.view.warning.successfulOperation`).d('操作成功'),
          });
          if (callback) {
            callback(res);
          }
        }
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  }

  // 脏数据检测
  function detectDirty(showWarningMsg) {
    const dirty =
      createTRDS.dirtyRecords.some((arr) => arr.length > 0) ||
      createTRLineDS.dirtyRecords.some((arr) => arr.length > 0);
    if (dirty && showWarningMsg) {
      const warningMsg = intl
        .get(`${intlPrefix}.view.warning.dirtyRecordDetectedSaveOrReset`)
        .d('检测到数据变更，请保存或重置后再进行操作');
      notification.warning({ message: warningMsg });
    }
    return dirty;
  }

  // 初始化 effect
  useEffect(() => {
    const { requestLineList } = createTRDS?.children || {};
    function updateDSDirtyState(ds) {
      setDSDirty(ds.dirty);
    }
    initDS().then(() => {
      // 跳过初始化数据时的数据校验
      createTRDS.addEventListener('update', handleUpdate);
      if (requestLineList) {
        requestLineList.addEventListener('update', handleLineUpdate);
        requestLineList.addEventListener('create', () => updateDSDirtyState(requestLineList));
        requestLineList.addEventListener('remove', () => updateDSDirtyState(requestLineList));
      }
    });
    return () => {
      createTRDS.removeEventListener('update');
      if (requestLineList) {
        requestLineList.removeEventListener('update');
        requestLineList.removeEventListener('create');
        requestLineList.removeEventListener('remove');
      }
    };
  }, [initDS]);

  /**
   *  事件处理函数
   */

  const handleCreateTR = () => {
    if (detectDirty()) {
      const warningMessage = intl
        .get(`${intlPrefix}.view.warning.saveOrNot`)
        .d('是否保存当前数据？');
      doConfirm(warningMessage, handleSaveTR, () => {
        if (!isCreate) {
          history.push('/lwms/transfer-request-platform/create');
        } else {
          initDS();
        }
      });
    } else {
      history.push('/lwms/transfer-request-platform/create');
    }
  };
  const handleCopyTR = () => {
    if (detectDirty(true)) {
      return;
    }
    const { current } = createTRDS;
    const { records } = createTRLineDS;
    current.set('requestStatus', 'NEW');
    current.set('requestNum', null);
    records.forEach((record) => {
      record.set('requestLineStatus', 'NEW');
    });
    history.push('/lwms/transfer-request-platform/create', { dataSource: 'copy' });
  };
  const handleSaveTR = async () => {
    if (detectDirty()) {
      const isHeadFormValid = await createTRDS.validate(false, false);
      const isLineValid = await createTRLineDS.validate(false, false);
      if (!isHeadFormValid || !isLineValid) {
        notification.warning({
          message: intl
            .get(`${intlPrefix}.view.warn.formInvalid`)
            .d('存在必填字段尚未填写或填写格式不对'),
        });
        return;
      }
      const { current: parentCurrent } = createTRDS;
      const needValidFields = [
        'wmMoveTypeId',
        'warehouseId',
        'wmAreaId',
        'toWarehouseId',
        'toWmAreaId',
      ];
      const filterNeedValidFields = needValidFields.filter((i) => parentCurrent.get(i));
      const isTRLineValid = createTRLineDS.records.every((r) =>
        filterNeedValidFields.every((f) => r.get(f) === parentCurrent.get(f))
      );
      if (!isTRLineValid) {
        notification.error({
          message: intl
            .get(`${intlPrefix}.view.warn.someFieldsConflict`)
            .d(
              '转移单行中存在“移动类型”、“发出仓库”、“发货货位”、“接收仓库”、“接收货位”与转移单头不一致'
            ),
        });
        return;
      }
      // const type = 'transferRequest/createAndUpdateTR';
      const payload = createTRDS.current.toJSONData();
      // 保存
      const res = await createAndUpdateTR(payload);
      const { requestId: trId } = res;
      if (trId && isCreate) {
        history.push(`/lwms/transfer-request-platform/detail/${trId}`);
        sessionStorage.setItem('transferRequestParentQuery', true);
      } else {
        initDS();
      }
      // const callback = (res) => {
      //   const { requestId: trId } = res;
      //   if (trId && isCreate) {
      //     history.push(`/lwms/transfer-request-platform/detail/${trId}`);
      //     sessionStorage.setItem('transferRequestParentQuery', true);
      //   } else {
      //     initDS();
      //   }
      // };
      // doAction(type, payload, callback);
    }
  };
  const handleCancelTR = () => {
    if (detectDirty(true)) {
      return;
    }
    if (requestStatus !== 'NEW' && requestStatus !== 'RELEASED') {
      notification.warning({
        message: intl
          .get(`${intlPrefix}.view.warning.onlyNewAndReleaseStatusTRCanCancel`)
          .d('只有“新增”和“已提交”状态的转移单才允许取消'),
      });
      return;
    }
    const warningMessage = intl.get(`${intlPrefix}.warning.cancelOrNot`).d('是否取消转移单？');
    const doCancel = () => {
      const type = 'transferRequest/cancelTR';
      const submitCallback = () => {
        initDS();
      };
      const payload = [createTRDS.current.get('requestId')];
      doAction(type, payload, submitCallback);
    };
    doConfirm(warningMessage, doCancel, null);
  };
  const handleCloseTR = () => {
    if (detectDirty(true)) {
      return;
    }
    if (['NEW', 'CANCELLED', 'CLOSED'].includes(requestStatus)) {
      notification.warning({
        message: intl
          .get(`${intlPrefix}.view.warning.newAndCanceledAndClosedStatusTRCanNotClose`)
          .d('“新增”，“已取消”和“已关闭”状态的转移单不允许关闭'),
      });
      return;
    }
    const warningMessage = intl.get(`${intlPrefix}.warning.closeOrNot`).d('是否关闭转移单？');
    const doClose = () => {
      const type = 'transferRequest/closeTR';
      const submitCallback = () => {
        initDS();
      };
      const payload = [createTRDS.current.get('requestId')];
      doAction(type, payload, submitCallback);
    };
    doConfirm(warningMessage, doClose, null);
  };
  const handleAddLine = () => {
    const validateResult = createTRDS.current.validate(false, false);
    if (!validateResult) {
      return;
    }

    if (freezeStatus.includes(requestStatus)) {
      return;
    }

    // const lineTableCount =
    //   (createTRLineDS && createTRLineDS.records && createTRLineDS.records.length) || 0;
    let lineTableCount = Number(
      (createTRLineDS && createTRLineDS.records[0] && createTRLineDS.records[0].requestLineNum) || 0
    );
    createTRLineDS.records.forEach((item) => {
      if (Number(item.data.requestLineNum) > lineTableCount) {
        lineTableCount = Number(item.data.requestLineNum);
      }
    });
    const wmMoveTypeObj = createTRDS.current.get('wmMoveTypeObj');
    const warehouseObj = createTRDS.current.get('warehouseObj');
    const wmAreaObj = createTRDS.current.get('wmAreaObj');
    const toWarehouseObj = createTRDS.current.get('toWarehouseObj');
    const toWmAreaObj = createTRDS.current.get('toWmAreaObj');
    createTRLineDS.create(
      {
        requestLineNum: lineTableCount + 1,
        requestLineStatus: 'NEW',
        wmMoveTypeObj,
        warehouseObj,
        wmAreaObj,
        toWarehouseObj,
        toWmAreaObj,
      },
      lineTableCount
    );
  };
  const handleDeleteLine = () => {
    const { selected } = createTRLineDS;
    if (selected.length === 0) {
      notification.warning({
        message: intl.get(`${intlPrefix}.view.warning.selectOneItem`).d('请至少选择一条单据'),
      });
      return;
    }
    if (selected.some((r) => r.get('requestLineStatus') !== 'NEW')) {
      notification.warning({
        message: intl
          .get(`${intlPrefix}.view.warning.onlyNewStatusTRLineCanDelete`)
          .d('只有“新增”状态的转移单行才允许删除'),
      });
      return;
    }
    // delete line
    const warningMsg = intl
      .get(`${intlPrefix}.view.warning.cancelLineOrNot`)
      .d('是否删除转移单行？');
    const type = 'transferRequest/deleteTRLine';
    const payload = selected.map((i) => i.toJSONData());
    const deleteLineCallback = () => {
      initDS();
    };
    const doCancelLine = () => doAction(type, payload, deleteLineCallback);
    doConfirm(warningMsg, doCancelLine, null);
  };

  // 渲染功能菜单
  // render buttons
  const renderFunctionButtons = () => (
    <Fragment>
      <Button
        // type="c7n-pro"
        icon="add"
        color="primary"
        onClick={handleCreateTR}
        // permissionList={[
        //   {
        //     code: 'hlos.lwms.transfer.request.platform.ps.button.create',
        //     type: 'button',
        //     meaning: '新建',
        //   },
        // ]}
      >
        {intl.get(`${commonButtonPrefix}.create`).d('新建')}
      </Button>
      <ButtonPermission
        type="c7n-pro"
        disabled={isCreate}
        onClick={handleCloseTR}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.close',
            type: 'button',
            meaning: '关闭',
          },
        ]}
      >
        {intl.get(`${commonButtonPrefix}.close`).d('关闭')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        disabled={isCreate}
        onClick={handleCancelTR}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.cancel',
            type: 'button',
            meaning: '取消',
          },
        ]}
      >
        {intl.get(`${commonButtonPrefix}.cancel`).d('取消')}
      </ButtonPermission>
      <ButtonPermission
        type="c7n-pro"
        disabled={isCreate}
        onClick={handleCopyTR}
        permissionList={[
          {
            code: 'hlos.lwms.transfer.request.platform.ps.button.copy',
            type: 'button',
            meaning: '复制',
          },
        ]}
      >
        {intl.get(`${commonButtonPrefix}.copy`).d('复制')}
      </ButtonPermission>
      <Button
        // type="c7n-pro"
        wait={2000}
        waitType="debounce"
        onClick={handleSaveTR}
        // permissionList={[
        //   {
        //     code: 'hlos.lwms.transfer.request.platform.ps.button.save',
        //     type: 'button',
        //     meaning: '保存',
        //   },
        // ]}
      >
        {intl.get(`${commonButtonPrefix}.save`).d('保存')}
      </Button>
    </Fragment>
  );

  const handleChangeOrg = () => {
    // createTRDS.current.set('toOrganizationObj', null);
  };

  // 渲染头部
  const renderTransferHead = () => (
    <React.Fragment>
      <Form dataSet={createTRDS} columns={4}>
        <Lov name="organizationObj" disabled={!isCreate} onChange={handleChangeOrg} />
        <Lov name="requestTypeObj" disabled={!isCreate} />
        <Lov name="wmMoveTypeObj" disabled={!isCreate || !isHeadValid} />
        <Select name="requestStatus" disabled />
        <TextField name="requestNum" disabled={!isTRNumRequired} required={isTRNumRequired} />
        <Lov name="warehouseObj" disabled={!isCreate || !isHeadValid} />
        <Lov name="wmAreaObj" disabled={!isCreate || !isHeadValid} />
        <Lov name="creatorObj" disabled={!isCreate || !isHeadValid} />
        <Lov name="toOrganizationObj" disabled={!isCreate || !isHeadValid} />
        <Lov name="toWarehouseObj" disabled={!isCreate || !isHeadValid} />
        <Lov name="toWmAreaObj" disabled={!isCreate || !isHeadValid} />
        <DateTimePicker name="creationDate" disabled />
      </Form>
      <Divider>
        <div>
          <span
            onClick={() => toggleShowConditionFlag(!showOtherCondition)}
            style={{ cursor: 'pointer' }}
          >
            {showOtherCondition
              ? `${intl.get(`${commonButtonPrefix}.hidden`).d('隐藏')}`
              : `${intl.get(`${commonButtonPrefix}.expand`).d('展开')}`}
          </span>
          <Icon type={showOtherCondition ? 'expand_more' : 'expand_less'} />
        </div>
      </Divider>
      <div style={{ display: showOtherCondition ? 'block' : 'none' }}>
        <Form dataSet={createTRDS} columns={4}>
          <TextField
            name="remark"
            colSpan={2}
            disabled={!(createTRDS.current && createTRDS.current.requestStatus !== 'NEW')}
          />
          <DateTimePicker name="executedTime" disabled />

          <TextField name="executedWorker" disabled />
          <TextField name="externalId" disabled={!isCreate || !isHeadValid} />
          <TextField name="externalNum" disabled={!isCreate || !isHeadValid} />
          <DateTimePicker name="printedDate" disabled />
          <Switch name="printedFlag" disabled />
          {/* <TextField name="docProcessRule" disabled /> */}
        </Form>
      </div>
    </React.Fragment>
  );

  // 渲染行表
  const renderLineTable = () => {
    const tabsArr = [
      {
        code: 'main',
        title: '主要',
        component: (
          <LineTable
            type="main"
            isEditPage
            dataSet={createTRLineDS}
            isCreate={isCreate}
            isHeadValid={isHeadValid}
          />
        ),
      },
      {
        code: 'exec',
        title: '执行',
        component: (
          <LineTable
            type="exec"
            isEditPage
            dataSet={createTRLineDS}
            isCreate={isCreate}
            isHeadValid={isHeadValid}
          />
        ),
      },
    ];
    return (
      <Tabs defaultActiveKey="main">
        {tabsArr.map((tab) => (
          <TabPane
            tab={intl.get(`${intlPrefix}.view.title.${tab.code}`).d(tab.title)}
            key={tab.code}
          >
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    );
  };

  // 渲染行表上方操作按钮
  const renderLineTableButtons = () => {
    const isTRDisabled = freezeStatus.includes(requestStatus);
    const tableDisabled = !isHeadValid || isTRDisabled || requestStatus !== 'NEW';
    return [
      <Button
        key="add"
        icon="playlist_add"
        funcType="flat"
        color="primary"
        onClick={handleAddLine}
        disabled={tableDisabled}
      >
        {intl.get(`${commonIntlPrefix}.create`).d('新增')}
      </Button>,
      <Button
        key="delete"
        icon="delete"
        funcType="flat"
        color="primary"
        onClick={handleDeleteLine}
        disabled={tableDisabled}
      >
        {intl.get(`${commonIntlPrefix}.delete`).d('删除')}
      </Button>,
    ];
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.transferRequestPlatform`).d('转移单平台')}
        backPath="/lwms/transfer-request-platform/list"
        isChange={isDSDirty}
      >
        {renderFunctionButtons()}
      </Header>
      <Content>
        <Card
          key="party-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={
            <h3>{intl.get(`${intlPrefix}.view.title.transferRequestPlatform`).d('转移单平台')}</h3>
          }
        >
          {renderTransferHead()}
        </Card>
        <Card
          key="party-detail-body"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={
            <h3>{intl.get(`${intlPrefix}.view.title.transferRequestPlatform`).d('转移单平台')}</h3>
          }
        >
          {renderLineTableButtons()}
          {renderLineTable()}
        </Card>
      </Content>
    </Fragment>
  );
}

const WrappedComponent = formatterCollections({
  code: [`${intlPrefix}`, `${commonIntlPrefix}`],
})(TransferRequestDetail);

export default WrappedComponent;
