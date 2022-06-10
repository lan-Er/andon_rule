/**
 * @Description: 产成品入库
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-10-01 10:05:15
 * @LastEditors: yu.na
 */

import React, { useMemo, useState, useEffect } from 'react';
import { DataSet, Modal, TextField } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
import { closeTab } from 'utils/menuTab';
import { getCurrentUserId, getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { HeaderDS, QueryDS } from '@/stores/finishedProductInventoryDS';
import { userSetting } from 'hlos-front/lib/services/api';
import { directTransfer, queryDefaultMeOu } from '@/services/finishedProductInventoryService';
import Loading from 'hlos-front/lib/components/Loading';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import SubHeader from './components/SubHeader';
import SearchArea from './components/SearchArea';
import ListItem from './components/ListItem';
import Footer from './components/Footer';
import InventoryModal from './components/InventoryModal';

import './style.less';

let modal = null;

const FinishedProductInventory = (props) => {
  const [orderList, setOrderList] = useState([]);
  const [workerLock, setWorkerLock] = useState(false);
  const [warehouseLock, setWarehouseLock] = useState(false);
  const [allCheckFlag, changeAllCheckFlag] = useState(false);
  const [remark, setRemark] = useState(null);
  const [avatorUrl, setAvatorUrl] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const headerDS = useMemo(() => {
    return new DataSet(HeaderDS());
  }, []);

  const queryDS = useMemo(() => {
    return new DataSet(QueryDS());
  }, []);

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
        if (warehouseId && warehouseName) {
          headerDS.current.set('warehouseObj', {
            warehouseId,
            warehouseCode,
            warehouseName,
          });
        }
      }

      const orgRes = await queryDefaultMeOu({ defaultFlag: 'Y' });
      if (getResponse(orgRes) && orgRes.content && orgRes.content[0]) {
        const { meOuId, meOuCode, organizationName } = orgRes.content[0];
        if (meOuId && organizationName) {
          headerDS.current.set('organizationObj', {
            meOuId,
            meOuCode,
            organizationName,
          });
          queryDS.queryDataSet.current.set('organizationId', meOuId);
        }
      }
    }
    queryDefaultSetting();
  }, [headerDS, queryDS]);

  const handleLockClick = (type) => {
    if (type === 'Worker') {
      setWorkerLock(!workerLock);
    } else if (type === 'Warehouse') {
      setWarehouseLock(!warehouseLock);
    }
  };
  const handleOrderSearch = async () => {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) return;
    const res = await queryDS.query();
    setOrderList(res);
  };

  const handleItemCheck = (data, e) => {
    const index = orderList.findIndex((i) => i.itemId === data.itemId);
    const _orderList = orderList.slice();
    _orderList.splice(index, 1, {
      ...data,
      checked: e.target.checked,
    });
    setOrderList(_orderList);
    changeAllCheckFlag(_orderList.every((i) => i.checked));
  };

  const handleAllCheck = () => {
    const _orderList = orderList.slice();

    if (allCheckFlag) {
      _orderList.map((i) => {
        const _i = i;
        _i.checked = false;
        return _i;
      });
      changeAllCheckFlag(false);
    } else {
      _orderList.map((i) => {
        const _i = i;
        _i.checked = true;
        return _i;
      });

      changeAllCheckFlag(true);
    }
    setOrderList(_orderList);
  };

  const handleNumChange = (val, record) => {
    const index = orderList.findIndex((item) => item.itemId === record.itemId);
    const list = [];
    orderList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      productionWmQty: val,
      receiveDTOList: [
        {
          productionWmQty: val || 0,
        },
      ],
    });
    setOrderList(list);
  };

  const handleControlTypeClick = (data) => {
    if (data.itemControlType === 'QUANTITY') return;

    modal = Modal.open({
      key: 'lwms-finished-product-inventory-modal',
      className: 'lwms-finished-product-inventory-modal',
      title: `${data.itemControlType === 'LOT' ? '批次' : '标签'}拣料`,
      children: (
        <InventoryModal
          data={data}
          ds={queryDS}
          controlType={data.itemControlType}
          onModalOk={handleModalOk}
          onModalCancel={handleModalCancel}
        />
      ),
      footer: null,
      closable: true,
    });
  };

  const handleModalOk = (id, qty, checkedList) => {
    const index = orderList.findIndex((i) => i.itemId === id);
    const _orderList = orderList.slice();
    _orderList[index].productionWmQty = qty;
    _orderList[index].receiveDTOList = checkedList;
    setOrderList(_orderList);
    modal.close();
  };

  const handleModalCancel = () => {
    modal.close();
  };

  const handleExit = () => {
    props.history.push('/workplace');
    closeTab('/pub/lwms/finished-product-inventory');
  };

  const handleSubmit = async () => {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) return;
    const {
      workerId,
      workerCode,
      meOuId,
      meOuCode,
      warehouseId,
      warehouseCode,
      wmAreaId,
      wmAreaCode,
    } = headerDS.current.toJSONData();
    const params = {
      workerId,
      worker: workerCode,
      organizationId: meOuId,
      organizationCode: meOuCode,
      warehouseId: queryDS.queryDataSet.current.get('warehouseId'),
      warehouseCode: queryDS.queryDataSet.current.get('warehouseCode'),
      wmAreaId: queryDS.queryDataSet.current.get('wmAreaId'),
      wmAreaCode: queryDS.queryDataSet.current.get('wmAreaCode'),
      toOrganizationId: meOuId,
      toOrganizationCode: meOuCode,
      toWarehouseId: warehouseId,
      toWarehouseCode: warehouseCode,
      toWmAreaId: wmAreaId,
      toWmAreaCode: wmAreaCode,
      remark,
      productionWmRule: headerDS.current.get('productionWmRule'),
      lineList: orderList.filter((i) => i.checked),
    };

    setSubmitLoading(true);
    const res = await directTransfer(params);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else if (getResponse(res)) {
      notification.success();
      handleOrderSearch();
    }
    setSubmitLoading(false);
  };

  const handleReset = () => {
    if (!workerLock) {
      headerDS.current.set('workerObj', null);
    }
    if (!warehouseLock) {
      headerDS.current.set('warehouseObj', null);
    }
    headerDS.current.set('remark', null);
    queryDS.queryDataSet.current.set('prodLineWarehouseObj', null);
    queryDS.queryDataSet.current.set('prodLineWmAreaObj', null);
    queryDS.queryDataSet.current.set('itemObj', null);
    setRemark(null);
    setOrderList([]);
  };

  /**
   * 备注弹窗
   */
  function handleRemark() {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: 'lwms-finished-product-inventory-remark-modal',
      movable: false,
      children: (
        <TextField
          dataSet={headerDS}
          name="remark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
        />
      ),
      onOk: () => setRemark(headerDS.current.get('remark')),
      onCancel: () => headerDS.current.set('remark', remark),
    });
  }

  return (
    <div className="lwms-finished-product-inventory">
      <CommonHeader title="产成品入库" />
      <div className="lwms-finished-product-inventory-content">
        <SubHeader
          ds={headerDS}
          workerLock={workerLock}
          warehouseLock={warehouseLock}
          avatorUrl={avatorUrl}
          setAvator={setAvatorUrl}
          onLockClick={handleLockClick}
        />
        <SearchArea
          ds={queryDS.queryDataSet}
          onSearch={handleOrderSearch}
          onAllCheck={handleAllCheck}
        />
        <div className="lwms-finished-product-inventory-list">
          {orderList.map((i) => {
            return (
              <ListItem
                key={i.itemId}
                data={i}
                onCheck={handleItemCheck}
                onNumChange={handleNumChange}
                onControlTypeClick={handleControlTypeClick}
              />
            );
          })}
        </div>
        <Footer
          onExit={handleExit}
          onSubmit={handleSubmit}
          onReset={handleReset}
          onRemark={handleRemark}
        />
        {submitLoading && <Loading title="提交中..." />}
      </div>
    </div>
  );
};

export default connect(({ finishedProductInventory }) => ({
  modalList: finishedProductInventory?.modalList || [],
}))(
  formatterCollections({
    code: ['lwms.finishedProductInventory', 'lwms.common'],
  })(FinishedProductInventory)
);
