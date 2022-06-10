/**
 * @Description: 销售退货接收--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Lov, Modal, DataSet, NumberField, Button } from 'choerodon-ui/pro';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import Loading from 'hlos-front/lib/components/Loading';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { checkControlType } from '@/services/issueRequestService';
import { shipReturnReceiveApi } from '@/services/shipReturnService';

import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import { HeaderDS, QueryDS } from '@/stores/shipReturnReceiveDS';
import SubHeader from './SubHeader';
import Footer from './Footer';
import ListItem from './ListItem';
import ReceiveModal from './ReceiveModal';

import styles from './index.less';

let modal = null;
const preCode = 'lwms.shipReturnReceive';
const { common } = codeConfig.code;

const headerFactory = () => new DataSet(HeaderDS());
const queryFactory = () => new DataSet(QueryDS());

const ShipReturnReceive = (props) => {
  const headerDS = useDataSet(headerFactory, ShipReturnReceive);
  const queryDS = useDataSet(queryFactory);
  const [orgLock, setOrgLock] = useState(false);
  const [workerLock, setWorkerLock] = useState(false);
  const [warehouseLock, setWarehouseLock] = useState(false);
  const [currentWorker, setCurrentWorker] = useState({});
  const [list, setList] = useState([]);
  const [showQtyInput, setShowQtyInput] = useState(false);
  const [controlType, setControlType] = useState(null);
  const [allChecked, changeAllChecked] = useState(false);
  const [noQtyFlag, setNoQtyFlag] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function queryWorker() {
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes) && workerRes.content && workerRes.content[0]) {
        setCurrentWorker(workerRes.content[0]);
        headerDS.current.set('workerObj', workerRes.content[0]);
      }
    }
    async function queryOrg() {
      const orgRes = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(orgRes) && orgRes.content && orgRes.content[0]) {
        headerDS.current.set('organizationObj', orgRes.content[0]);
        queryDS.current.set('organizationId', orgRes.content[0].organizationId);
      }
    }
    async function queryWarehouse() {
      const warehouseRes = await queryLovData({ lovCode: common.warehouse, defaultFlag: 'Y' });
      if (getResponse(warehouseRes) && warehouseRes.content && warehouseRes.content[0]) {
        headerDS.current.set('warehouseObj', warehouseRes.content[0]);
      }
    }
    async function queryDefaultLovData() {
      const defaultSetting = localStorage.getItem('shipReturnReceive/defaultSetting');
      if (defaultSetting && !isEmpty(JSON.parse(defaultSetting))) {
        const { workerObj, organizationObj, warehouseObj } = JSON.parse(defaultSetting);
        if (!isEmpty(workerObj)) {
          setCurrentWorker(workerObj);
          headerDS.current.set('workerObj', workerObj);
        } else {
          queryWorker();
        }
        if (!isEmpty(organizationObj)) {
          headerDS.current.set('organizationObj', organizationObj);
        } else {
          queryOrg();
        }
        if (!isEmpty(warehouseObj)) {
          headerDS.current.set('warehouseObj', warehouseObj);
        }
      } else {
        queryWorker();
        queryOrg();
      }
      queryWarehouse();
    }
    queryDefaultLovData();
    return () => {
      headerDS.current.reset();
    };
  }, []);

  function handleLockClick(type) {
    if (type === 'Org') {
      setOrgLock(!orgLock);
    } else if (type === 'Worker') {
      setWorkerLock(!workerLock);
    } else if (type === 'Warehouse') {
      setWarehouseLock(!warehouseLock);
    }
  }

  function handleSelectAll() {
    const _list = list.slice();
    _list.map((i) => {
      const _i = i;
      _i.checked = !_i.checked;
      return _i;
    });
    setList(_list);
    changeAllChecked(!allChecked);
  }

  /**
   * 上传图片
   */
  function handlePicture() {
    // 暂不实现
  }

  async function handleSubmit() {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) return;
    if (!list.length) {
      notification.warning({
        message: '请选择销售订单',
      });
      return;
    }
    const _list = [];
    const {
      receiveWarehouseId,
      receiveWarehouseCode,
      receiveWmAreaId,
      receiveWmAreaCode,
    } = headerDS.current.toJSONData();
    list.forEach((i) => {
      if (i.checked) {
        const { returnReasonObj, ...params } = i;
        let item = {
          ...params,
          receiveWarehouseId,
          receiveWarehouseCode,
          receiveWmAreaId,
          receiveWmAreaCode,
        };
        if (!isEmpty(returnReasonObj)) {
          item = {
            ...item,
            returnReasonId: returnReasonObj.exceptionId,
            returnReason: returnReasonObj.exceptionCode,
          };
        }
        _list.push(item);
      }
    });
    const params = {
      ...headerDS.current.toJSONData(),
      customerlineList: _list,
    };
    setSubmitLoading(true);
    const res = await shipReturnReceiveApi(params);
    if (getResponse(res)) {
      notification.success();
      setList([]);
      setShowQtyInput(false);
      queryDS.current.reset();
    }
    setSubmitLoading(false);
  }

  function setLockData() {
    const { workerObj, organizationObj, warehouseObj } = headerDS.current.data;
    let params = {};
    if (workerLock) {
      params = {
        ...params,
        workerObj,
      };
    }
    if (orgLock) {
      params = {
        ...params,
        organizationObj,
      };
    }
    if (warehouseLock) {
      params = {
        ...params,
        warehouseObj,
      };
    }
    localStorage.setItem('shipReturnReceive/defaultSetting', JSON.stringify(params));
  }

  function handleExit() {
    if (list.length) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>
            {intl.get(`${preCode}.view.message.exit.no.saving`).d('您尚有数据未提交，是否退出?')}
          </span>
        ),
      }).then((button) => {
        if (button === 'ok') {
          setLockData();
          props.history.push('/workplace');
          closeTab('/pub/lwms/ship-return-receive');
        }
      });
    } else {
      setLockData();
      props.history.push('/workplace');
      closeTab('/pub/lwms/ship-return-receive');
    }
  }

  function handleReset() {
    const { workerObj, organizationObj, warehouseObj } = headerDS.current.data;
    headerDS.current.reset();
    if (workerLock) {
      headerDS.current.set('workerObj', workerObj);
    }
    if (orgLock) {
      headerDS.current.set('organizationObj', organizationObj);
    }
    if (warehouseLock) {
      headerDS.current.set('warehouseObj', warehouseObj);
    }
    queryDS.current.reset();
    setList([]);
    setShowQtyInput(false);
  }

  function handleShowModal(type, modalList, returnReasonObj, data) {
    const _type = type || controlType;
    if (_type === 'QUANTITY') return;
    if (_type !== 'LOT' && _type !== 'TAG') {
      notification.warning({
        message: `物料控制类型错误：${_type}`,
      });
      return;
    }
    const headerData = {
      ...queryDS.current.toJSONData(),
    };
    modal = Modal.open({
      key: 'lwms-ship-return-receice-modal',
      className: `${styles['lwms-ship-return-receive-modal']} ${_type === 'LOT' && styles.lot}`,
      title: `添加${_type === 'LOT' ? '批次' : '标签'}`,
      children: (
        <ReceiveModal
          type={_type}
          record={data || headerData}
          modalList={modalList || []}
          returnReasonObj={returnReasonObj || headerDS.current.get('returnReasonObj')}
          onSave={handdleModalSave}
        />
      ),
      footer: null,
      closable: true,
      movable: false,
    });
  }

  function handdleModalSave(modalList, data, itemControlType, totalQty, reasonDS) {
    const { returnReasonObj } = reasonDS.current.data;
    const _list = list.slice();
    const idx = list.findIndex((i) => i.itemId === data.itemId);
    let selectedQty = 0;
    modalList.forEach((i) => {
      if (i.checked) {
        selectedQty += i.receivedQty;
      }
    });
    if (idx !== -1) {
      _list.splice(idx, 1, {
        ..._list[idx],
        returnReasonObj,
        totalQty,
        selectedQty,
        detailList: modalList,
        checked: true,
      });
    } else {
      _list.push({
        ...data,
        returnReasonObj,
        totalQty,
        selectedQty,
        itemControlType,
        detailList: modalList,
        checked: true,
      });
    }
    setList(_list);
    modal.close();
  }

  async function queryControlType({ itemId, orgId, warehouseId }) {
    const res = await checkControlType([
      {
        itemId: itemId || queryDS.current.get('itemId'),
        organizationId: orgId || headerDS.current.get('organizationId'),
        warehouseId: warehouseId || headerDS.current.get('warehouseId'),
        groupId: orgId || headerDS.current.get('organizationId'),
        tenantId: getCurrentOrganizationId(),
      },
    ]);
    if (!isEmpty(res) && res[0] && res[0].itemControlType) {
      setControlType(res[0].itemControlType);
      if (res[0].itemControlType === 'QUANTITY') {
        setShowQtyInput(true);
        queryDS.fields.get('receivedQty').set('required', true);
      } else {
        setShowQtyInput(false);
        queryDS.fields.get('receivedQty').set('required', false);
      }
    }
  }

  async function handleItemChange(record) {
    if (!isEmpty(record)) {
      queryControlType({ itemId: record.itemId });
    } else {
      setShowQtyInput(false);
      queryDS.fields.get('receivedQty').set('required', false);
    }
    queryDS.current.set('soObj', null);
  }

  function handleOrgChange(record) {
    if (!isEmpty(record)) {
      queryControlType({ orgId: record.organizationId });
      queryDS.current.set('organizationId', record.organizationId);
    } else {
      setShowQtyInput(false);
      queryDS.fields.get('receivedQty').set('required', false);
      queryDS.current.set('organizationId', null);
    }
  }

  function handleWarehouseChange(record) {
    if (!isEmpty(record)) {
      queryControlType({ warehosueId: record.organizationId });
    } else {
      setShowQtyInput(false);
      queryDS.fields.get('receivedQty').set('required', false);
    }
  }

  async function handleAddLine() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) return;
    const _list = list.slice();
    const {
      receivedQty,
      itemId,
      itemCode,
      description,
      uomId,
      uom,
      uomName,
      shippedQty,
      returnedQty,
      soId,
      soNum,
      soLineId,
      soLineNum,
    } = queryDS.current.toJSONData();
    const { returnReasonObj } = headerDS.current.data;
    if (_list.some((i) => i.itemId === itemId)) {
      notification.warning({
        message: '该物料已存在',
      });
      return;
    }
    const params = {
      itemControlType: 'QUANTITY',
      receivedQty,
      itemId,
      itemCode,
      description,
      uomId,
      uom,
      uomName,
      soId,
      soNum,
      soLineId,
      soLineNum,
      returnReasonObj,
      checked: true,
      maxQty: (shippedQty || 0) - (returnedQty || 0),
      detailList: [
        {
          receivedQty,
        },
      ],
    };
    _list.push(params);
    setList(_list);
  }

  function handleNumChange(val, record) {
    const idx = list.findIndex((i) => i.itemId === record.itemId);
    const _list = list.slice();
    if (record.maxQty !== undefined && record.maxQty !== null && val > record.maxQty) {
      _list.splice(idx, 1, {
        ...record,
        receivedQty: record.maxQty,
        detailList: [
          {
            receivedQty: record.maxQty,
          },
        ],
      });
    } else {
      _list.splice(idx, 1, {
        ...record,
        receivedQty: val,
        detailList: [
          {
            receivedQty: val,
          },
        ],
      });
    }

    setList(_list);
  }

  function handleSoChange(record) {
    if (controlType === 'QUANTITY') {
      if (record) {
        queryDS.current.set('receivedQty', (record.shippedQty || 0) - (record.returnedQty || 0));
        if ((record.shippedQty || 0) === (record.returnedQty || 0)) {
          setNoQtyFlag(true);
          notification.warning({
            message: '无可退货数量！',
          });
        } else {
          setNoQtyFlag(false);
        }
      } else {
        queryDS.current.set('receivedQty', null);
      }
    } else {
      checkShowModal(record);
    }
  }

  function checkShowModal() {
    const { itemId, soId } = queryDS.current.toJSONData();
    if (itemId && soId) {
      handleShowModal();
    }
  }

  function handleItemCheck(data, e) {
    const idx = list.findIndex((i) => i.itemId === data.itemId);
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...data,
      checked: e.target.checked,
    });
    setList(_list);
  }

  function handleReasonChange(record) {
    const _list = [];
    list.forEach((i) => {
      if (!isEmpty(i.returnReasonObj)) {
        _list.push(i);
      } else {
        _list.push({
          ...i,
          returnReasonObj: record,
        });
      }
    });
    setList(_list);
  }

  return (
    <div className={styles['lwms-ship-return-receive']}>
      <CommonHeader title="销售退货接收" />
      <SubHeader
        ds={headerDS}
        orgLock={orgLock}
        workerLock={workerLock}
        warehouseLock={warehouseLock}
        currentWorker={currentWorker}
        onLockClick={handleLockClick}
        onOrgChange={handleOrgChange}
        onWarehouseChange={handleWarehouseChange}
        onReasonChange={handleReasonChange}
      />
      <div className={styles['lwms-ship-return-receive-content']}>
        <div className={styles.query}>
          <Lov
            dataSet={queryDS}
            name="itemObj"
            noCache
            placeholder="物料"
            onChange={handleItemChange}
            clearButton={false}
          />
          <Lov
            dataSet={queryDS}
            name="soObj"
            noCache
            placeholder="销售订单"
            clearButton={false}
            onChange={handleSoChange}
          />
          {showQtyInput && (
            <NumberField
              dataSet={queryDS}
              name="receivedQty"
              placeholder="数量"
              disabled={noQtyFlag}
            />
          )}
          {showQtyInput && (
            <Button color="primary" onClick={handleAddLine} disabled={noQtyFlag}>
              {intl.get('lwms.common.button.sure').d('确认')}
            </Button>
          )}
        </div>
        <div className={styles.list}>
          {list.map((i) => {
            return (
              <ListItem
                key={i.itemId}
                data={i}
                totalQty={i.totalQty}
                onShowModal={handleShowModal}
                onNumChange={handleNumChange}
                onItemCheck={handleItemCheck}
              />
            );
          })}
        </div>
      </div>
      <Footer
        onSelectAll={handleSelectAll}
        onPicture={handlePicture}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onExit={handleExit}
      />
      {submitLoading && <Loading title="提交中..." />}
    </div>
  );
};

export default formatterCollections({
  code: ['lwms.shipReturnReceive', 'lwms.common'],
})(ShipReturnReceive);
