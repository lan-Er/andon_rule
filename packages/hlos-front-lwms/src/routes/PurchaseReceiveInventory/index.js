/*
 * @Module: 采购接收入库/到货入库
 * @Author: yu.na <yu.na@hand-china.com>
 * @Date: 2020-09-21 19:39:48
 * @LastEditors: leying.yan
 */

import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Modal, DataSet } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import { getCurrentUserId } from 'utils/utils';
// import { BUCKET_NAME_WMS } from 'hlos-front/lib/utils/config';
import Loading from 'hlos-front/lib/components/Loading';
import { userSetting } from 'hlos-front/lib/services/api';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import { HeaderDS, QueryDS } from '@/stores/purchaseReceiveInventoryDS';
import {
  queryDeliveryTicket,
  submitDeliveryTicket,
} from '@/services/purchaseReceiveInventoryService';
import SubHeader from './components/SubHeader';
import SearchArea from './components/SearchArea';
import ListItem from './components/ListItem';
import Footer from './components/Footer';
import InventoryModal from './components/InventoryModal';
import './style.less';

let modal = null;
// let pictureModal = null;
const commonCode = 'lwms.common';
// const directory = 'purchase-receive-inventory';

function PurchaseReceiveInventory({ ticketList, dispatch, history }) {
  // const [ticketList, setOrderList] = useState([]);
  const [workerLock, setWorkerLock] = useState(false);
  const [orgLock, setOrgLock] = useState(false);
  const [warehouseLock, setWarehouseLock] = useState(false);
  const [wmAreaLock, setWmAreaLock] = useState(false);
  const [avatorUrl, setAvatorUrl] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await userSetting({
        userId: getCurrentUserId(),
        defaultFlag: 'Y',
      });
      if (!isEmpty(res) && res.content && res.content[0]) {
        const {
          workerId,
          workerCode,
          workerName,
          organizationId,
          organizationCode,
          organizationName,
          warehouseId,
          warehouseCode,
          warehouseName,
          fileUrl,
        } = res.content[0];
        if (workerId && workerName) {
          headerDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
        }
        if (fileUrl) {
          setAvatorUrl(fileUrl);
        }
        if (organizationId && organizationName) {
          headerDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
        if (warehouseId && warehouseName) {
          headerDS.current.set('warehouseObj', {
            warehouseId,
            warehouseCode,
            warehouseName,
          });
        }
      }
    }
    queryDefaultSetting();
  }, [headerDS]);

  const headerDS = useMemo(() => {
    return new DataSet(HeaderDS());
  }, []);

  const queryDS = useMemo(() => {
    return new DataSet(QueryDS());
  }, []);

  const handleControlTypeClick = async ({
    itemControlType: controlType,
    ticketId,
    ticketLineId,
    partyName,
    poNum,
    poLineNum,
    receivedList,
  }) => {
    if (controlType === 'QUANTITY') return;
    let modalList = [];
    if (!receivedList) {
      const params = {
        documentId: ticketId,
        documentLineId: ticketLineId,
        lotFlag: controlType === 'LOT',
        page: -1,
      };
      const res = await dispatch({
        type: 'purchaseReceiveInventory/updateDocReservation',
        payload: params,
      });
      if (res && Array.isArray(res)) {
        modalList = res;
      }
    }

    modal = Modal.open({
      key: 'lwms-purchase-receive-inventory-modal',
      className: 'lwms-purchase-receive-inventory-modal',
      title: `添加${controlType === 'LOT' ? '批次' : '标签'}数量`,
      children: (
        <InventoryModal
          receivedList={receivedList || modalList}
          controlType={controlType}
          partyName={partyName}
          poNum={poNum}
          poLineNum={poLineNum}
          ticketId={ticketId}
          ticketLineId={ticketLineId}
          onModalOk={handleModalOk}
          onModalCancel={handleModalCancel}
        />
      ),
      footer: null,
    });
  };

  const handleModalOk = (id, qty, list) => {
    const index = ticketList.findIndex((i) => i.ticketLineId === id);
    const _orderList = ticketList.slice();
    _orderList[index].inventoryQty1 = qty;
    _orderList[index].receivedList = list;
    if (qty > 0) {
      _orderList[index].checked = true;
    }
    dispatch({
      type: 'purchaseReceiveInventory/updateState',
      payload: {
        ticketList: _orderList,
      },
    });
    modal.close();
  };

  const handleModalCancel = async () => {
    const res = await Modal.confirm({
      key: Modal.key(),
      children: (
        <span>
          {intl
            .get(`${commonCode}.view.message.exit.no.saving`)
            .d('退出后不保存当前编辑，确认退出？')}
        </span>
      ),
    });
    if (res === 'ok') {
      modal.close();
    }
  };

  const handleOrderSearch = async () => {
    if (
      !queryDS.current.get('poNum') &&
      !queryDS.current.get('partyName') &&
      !queryDS.current.get('ticketNumLike')
    ) {
      notification.warning({
        message: '采购订单、送货单、供应商三者不能同时为空',
      });
      return;
    }
    const res = await queryDeliveryTicket({ ...queryDS.current.toJSONData(), page: -1 });
    if (!isEmpty(res) && res.content) {
      const list = [];
      res.content.forEach((i) => {
        if (i.lineList) {
          i.lineList.forEach((lineItem) => {
            const pictures = [];
            if (lineItem.pictures) {
              lineItem.pictures.split('#').forEach((item) => {
                pictures.push({
                  url: item,
                  uid: uuidv4(),
                  name: item.split('@')[1],
                  status: 'done',
                });
              });
            }
            list.push({
              ...lineItem,
              pictures,
              ticketId: i.ticketId,
              ticketNum: i.ticketNum,
              partyName: i.partyName,
            });
          });
        }
      });
      dispatch({
        type: 'purchaseReceiveInventory/updateState',
        payload: {
          ticketList: list,
        },
      });
    }
  };

  const handleExit = () => {
    Modal.confirm({
      key: Modal.key(),
      children: (
        <span>
          {intl
            .get(`${commonCode}.view.message.exit.no.saving`)
            .d('退出后不保存当前编辑，确认退出？')}
        </span>
      ),
    }).then((button) => {
      if (button === 'ok') {
        handleReset();
        history.push('/workplace');
        closeTab('/pub/lwms/purchase-receive-inventory');
      }
    });
  };

  const handleSubmit = async () => {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) return;
    let disableSubmitFlag = false;
    const list = ticketList.filter((i) => i.checked);
    if (!list.length) {
      notification.warning({
        message: '请选中入库信息',
      });
      return;
    }
    list.forEach((i) => {
      const _i = i;
      if (!_i.inventoryQty1) {
        disableSubmitFlag = true;
      }
      _i.inventoryQty = _i.inventoryQty1;
    });
    if (disableSubmitFlag) {
      notification.warning({
        message: '入库数量不能为0',
      });
      return;
    }
    const _list = [];
    list.forEach((i) => {
      const index = _list.findIndex((item) => item.ticketId === i.ticketId);
      let processPictures = '';
      if (i.pictures) {
        i.pictures.forEach((item) => {
          processPictures = processPictures === '' ? item.url : `${processPictures}#${item.url}`;
        });
      }
      if (index < 0) {
        _list.push({
          ...headerDS.current.toJSONData(),
          ticketId: i.ticketId,
          ticketNum: i.ticketNum,
          lineList: [
            {
              ...i,
              pictures: processPictures,
              warehouseId: headerDS.current.get('warehouseId'),
              warehouseCode: headerDS.current.get('warehouseCode'),
              wmAreaId: headerDS.current.get('wmAreaId'),
              wmAreaCode: headerDS.current.get('wmAreaCode'),
              receivedList: i.receivedList.filter((r) => r.checked),
            },
          ],
        });
      } else {
        _list[index].lineList.push({
          ...i,
          pictures: processPictures,
          warehouseId: headerDS.current.get('warehouseId'),
          warehouseCode: headerDS.current.get('warehouseCode'),
          wmAreaId: headerDS.current.get('wmAreaId'),
          wmAreaCode: headerDS.current.get('wmAreaCode'),
          receivedList: i.receivedList.filter((r) => r.checked),
        });
      }
    });

    setSubmitLoading(true);
    const res = await submitDeliveryTicket(_list);
    if (!isEmpty(res) && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (!isEmpty(res) && Array.isArray(res)) {
      notification.success();
      handleOrderSearch();
    }
    setSubmitLoading(false);
  };

  const handleReset = () => {
    if (!workerLock) {
      headerDS.current.set('workerObj', null);
    }
    if (!orgLock) {
      headerDS.current.set('organizationObj', null);
    }
    if (!warehouseLock) {
      headerDS.current.set('warehouseObj', null);
    }
    if (!wmAreaLock) {
      headerDS.current.set('wmAreaObj', null);
    }
    queryDS.current.reset();
    dispatch({
      type: 'purchaseReceiveInventory/updateState',
      payload: {
        ticketList: [],
      },
    });
  };

  const handleItemCheck = (data, e) => {
    const index = ticketList.findIndex((i) => i.ticketLineId === data.ticketLineId);
    const _orderList = ticketList.slice();
    _orderList.splice(index, 1, {
      ...data,
      checked: e.target.checked,
    });
    dispatch({
      type: 'purchaseReceiveInventory/updateState',
      payload: {
        ticketList: _orderList,
      },
    });
  };

  const handleNumChange = (val, record) => {
    const index = ticketList.findIndex((item) => item.ticketLineId === record.ticketLineId);
    const list = [];
    ticketList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      inventoryQty1: val,
      receivedList: [
        {
          inventoryQty: val || 0,
          checked: true,
        },
      ],
    });
    dispatch({
      type: 'purchaseReceiveInventory/updateState',
      payload: {
        ticketList: list,
      },
    });
  };

  const handleChangePictures = (val, record) => {
    const index = ticketList.findIndex((item) => item.ticketLineId === record.ticketLineId);
    const list = [];
    ticketList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      pictures: val,
    });
    dispatch({
      type: 'purchaseReceiveInventory/updateState',
      payload: {
        ticketList: list,
      },
    });
  };

  const handleChangeRemark = (val, record) => {
    const index = ticketList.findIndex((item) => item.ticketLineId === record.ticketLineId);
    const list = [];
    ticketList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      lineRemark: val,
    });
    dispatch({
      type: 'purchaseReceiveInventory/updateState',
      payload: {
        ticketList: list,
      },
    });
  };

  const handleLockClick = (type) => {
    if (type === 'Worker') {
      setWorkerLock(!workerLock);
    } else if (type === 'Org') {
      setOrgLock(!orgLock);
    } else if (type === 'Warehouse') {
      setWarehouseLock(!warehouseLock);
    } else if (type === 'WmArea') {
      setWmAreaLock(!wmAreaLock);
    }
  };

  return (
    <div className="lwms-purchase-receive-inventory">
      <div className="lwms-purchase-receive-inventory-header">
        <img src={LogoImg} alt="" />
      </div>
      <SubHeader
        ds={headerDS}
        avatorUrl={avatorUrl}
        setAvator={setAvatorUrl}
        workerLock={workerLock}
        orgLock={orgLock}
        warehouseLock={warehouseLock}
        wmAreaLock={wmAreaLock}
        onLockClick={handleLockClick}
      />
      <div className="lwms-purchase-receive-inventory-content">
        <SearchArea ds={queryDS} onSearch={handleOrderSearch} />
        <div className="lwms-purchase-receive-inventory-list">
          {ticketList.map((i) => {
            return (
              <ListItem
                key={i.ticketLineId}
                data={i}
                onCheck={handleItemCheck}
                onNumChange={handleNumChange}
                onControlTypeClick={handleControlTypeClick}
                onChangePictures={(data) => handleChangePictures(data, i)}
                onChangeRemark={(data) => handleChangeRemark(data, i)}
              />
            );
          })}
        </div>
      </div>
      <Footer
        onExit={handleExit}
        onSubmit={handleSubmit}
        onReset={handleReset}
        // onRemark={handleRemark}
        // onPicture={handlePicture}
      />
      {submitLoading && <Loading title="提交中..." />}
    </div>
  );
}

export default connect(({ purchaseReceiveInventory }) => ({
  ticketList: purchaseReceiveInventory?.ticketList,
  modalList: purchaseReceiveInventory?.modalList,
}))(
  formatterCollections({
    code: ['lwms.purchaseReceiveInventory', 'lwms.common'],
  })(PurchaseReceiveInventory)
);
