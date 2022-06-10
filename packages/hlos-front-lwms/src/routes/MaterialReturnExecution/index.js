/**
 * @Description: 退料执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { xor, isEmpty } from 'lodash';
import { TextField, Lov, Button, Modal } from 'choerodon-ui/pro';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import uuidv4 from 'uuid/v4';
import intl from 'utils/intl';
import { queryLovData } from 'hlos-front/lib/services/api';
import { queryDocumentType } from '@/services/api';
import codeConfig from '@/common/codeConfig';
import { queryDS } from '@/stores/materialReturnExecutionDS';
import {
  requestItemByLot,
  requestItemByTag,
  submitWmReturn,
  requestItemByCode,
} from '@/services/materialReturnExecutionService';

import Loading from 'hlos-front/lib/components/Loading';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import LotBtnIcon from 'hlos-front/lib/assets/icons/lot-unselect.svg';
import LotBtnActiveIcon from 'hlos-front/lib/assets/icons/lot-selected.svg';
import TagBtnIcon from 'hlos-front/lib/assets/icons/tag-unselect.svg';
import TagBtnActiveIcon from 'hlos-front/lib/assets/icons/tag-selected.svg';
import NumBtnIcon from 'hlos-front/lib/assets/icons/number-unselect.svg';
import NumBtnActiveIcon from 'hlos-front/lib/assets/icons/number-selected.svg';
import ScanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import ListItem from './components/ListItem';
import Footer from './components/Footer';
import SubHeader from './components/SubHeader';
import ReturnModal from './components/ReturnModal';

import './style.less';

let modal;
const { common } = codeConfig.code;

export default (props) => {
  const [activeTab, changeActiveTab] = useState('NUMBER');
  const [orgLock, setOrgLock] = useState(false);
  const [warehouseLock, setWhLock] = useState(false);
  const [documentLock, setDocLock] = useState(false);
  const [currentWorker, setCurrentWorker] = useState({});
  const [itemList, setItemList] = useState([]);
  const [itemNumList, setItemNumList] = useState([]);
  const [itemLotList, setItemLotList] = useState([]);
  const [itemTagList, setItemTagList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function queryDefaultLovData() {
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes) && workerRes.content && workerRes.content[0]) {
        setCurrentWorker(workerRes.content[0]);
      }
      const orgRes = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(orgRes) && orgRes.content && orgRes.content[0]) {
        queryDS.current.set('organizationObj', {
          organizationId: orgRes.content[0].organizationId,
          organizationCode: orgRes.content[0].organizationCode,
          organizationName: orgRes.content[0].organizationName,
        });
      }

      const whRes = await queryLovData({ lovCode: common.warehouse, defaultFlag: 'Y' });
      if (getResponse(whRes) && whRes.content && whRes.content[0]) {
        queryDS.current.set('warehouseObj', {
          warehouseId: whRes.content[0].warehouseId,
          warehouseCode: whRes.content[0].warehouseCode,
          warehouseName: whRes.content[0].warehouseName,
        });
      }

      const typeRes = await queryDocumentType({
        documentClass: 'WM_RETURNED',
        documentTypeCode: 'STANDARD_RETURNED_REQUEST',
      });
      if (typeRes && !typeRes.failed && typeRes.content && typeRes.content[0]) {
        queryDS.current.set('documentTypeObj', typeRes.content[0]);
      }
    }
    queryDefaultLovData();
  }, []);

  async function handleTabClick(value) {
    changeActiveTab(value);
    if (value === 'LOT') {
      setItemList(itemLotList);
    } else if (value === 'TAG') {
      setItemList(itemTagList);
    } else {
      setItemList(itemNumList);
    }
    queryDS.current.set('itemObj', null);
    queryDS.current.set('inputNum', null);
  }

  function handleNumChange(value, record) {
    if (activeTab === 'NUMBER') {
      itemNumList.forEach((i) => {
        const _i = i;
        if (_i.onhandId === record.onhandId) {
          _i.returnedQty = value;
        }
      });
    } else if (activeTab === 'LOT') {
      itemLotList.forEach((i) => {
        const _i = i;
        if (_i.lotNumber === record.lotNumber) {
          _i.returnedQty = value;
        }
      });
    } else if (activeTab === 'TAG') {
      itemTagList.forEach((i) => {
        const _i = i;
        if (_i.tagCode === record.tagCode) {
          _i.returnedQty = value;
        }
      });
    }
  }

  async function handleItemChange(record = {}) {
    if (isEmpty(record)) return;
    if (!isEmpty(itemNumList.find((i) => i.itemCode === record.itemCode))) {
      notification.warning({
        message: '该物料已存在',
      });
      return;
    }
    const res = await requestItemByCode({
      itemId: record.itemId,
      organizationId: queryDS.current.get('organizationId'),
      warehouseId: queryDS.current.get('warehouseId'),
      wmAreaId: queryDS.current.get('wmAreaId'),
    });
    if (getResponse(res)) {
      if (Array.isArray(res) && res.length) {
        res.forEach((i) => {
          i.checked = false;
          // i.warehouseName = queryDS.current.get('toWarehouseName');
          // i.wmAreaName = queryDS.current.get('toWmAreaName');
          i.itemControlType = 'QUANTITY';
        });
        // res.checked = false;
        // res.warehouseName = queryDS.current.get('toWarehouseName');
        // res.wmAreaName = queryDS.current.get('toWmAreaName');
        // res.itemControlType = 'QUANTITY';
        setItemNumList(itemNumList.concat(res));
        setItemList(itemNumList.concat(res));
        queryDS.current.set('itemObj', null);
      } else {
        notification.warning({
          message: `该仓库下不存在物料为${record.itemCode}的数据`,
        });
      }
    }
  }

  function handleCheck(record, e) {
    let currentTabList = itemNumList;
    let index = currentTabList.findIndex((el) => el.onhandId === record.onhandId);
    if (activeTab === 'LOT') {
      currentTabList = itemLotList;
    } else if (activeTab === 'TAG') {
      currentTabList = itemTagList;
      index = currentTabList.findIndex(
        (el) => el.tagCode === record.tagCode && el.itemId === record.itemId
      );
    }

    const list = [];
    currentTabList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      checked: e.target.checked,
    });
    if (activeTab === 'LOT') {
      setItemLotList(list);
    } else if (activeTab === 'TAG') {
      setItemTagList(list);
    } else {
      setItemNumList(list);
    }
    setItemList(list);
  }

  function handleCheckAll() {
    let currentTabList = itemNumList;
    if (activeTab === 'LOT') {
      currentTabList = itemLotList;
    } else if (activeTab === 'TAG') {
      currentTabList = itemTagList;
    }
    const list = [];
    if (currentTabList.every((item) => item.checked)) {
      currentTabList.forEach((item) => {
        list.push({
          ...item,
          checked: false,
        });
      });
    } else {
      currentTabList.forEach((item) => {
        list.push({
          ...item,
          checked: true,
        });
      });
    }
    if (activeTab === 'LOT') {
      setItemLotList(list);
    } else if (activeTab === 'TAG') {
      setItemTagList(list);
    } else {
      setItemNumList(list);
    }
    setItemList(list);
  }

  function handleLockClick(type) {
    if (type === 'Org') {
      setOrgLock(!orgLock);
    } else if (type === 'Wh') {
      setWhLock(!warehouseLock);
    } else if (type === 'Doc') {
      setDocLock(!documentLock);
    }
  }

  function handleExecuteOk(checkedList = []) {
    const _checkedList = [];
    checkedList.forEach((item) => {
      if (
        activeTab === 'LOT' &&
        itemLotList.findIndex((i) => i.lotNumber === item.lotNumber && i.itemId === item.itemId) !==
          -1
      ) {
        return;
      } else if (
        activeTab === 'TAG' &&
        itemTagList.findIndex((i) => i.tagCode === item.tagCode && i.itemId === item.itemId) !== -1
      ) {
        return;
      }
      _checkedList.push({
        ...item,
        checked: false,
        itemControlType: activeTab,
      });
    });
    if (activeTab === 'LOT') {
      setItemLotList(itemLotList.concat(..._checkedList));
    } else {
      setItemTagList(itemTagList.concat(..._checkedList));
    }

    setItemList(itemList.concat(..._checkedList));
    modal.close();
  }

  function handleExecuteCancel() {
    modal.close();
  }

  async function handleSearch(e) {
    e.persist();
    let res = {};
    let params = {
      organzationId: queryDS.current.get('organzationId'),
      warehouseId: queryDS.current.get('warehouseId'),
      wmAreaId: queryDS.current.get('wmAreaId'),
    };
    let title = '批次';
    if (e.keyCode === 13) {
      if (activeTab === 'LOT') {
        title = '批次';
        params = {
          ...params,
          lotNumber: e.target.value,
        };
        res = await requestItemByLot(params);
      } else {
        title = '标签';
        params = {
          ...params,
          tagCode: e.target.value,
        };
        res = await requestItemByTag(params);
      }
      if (getResponse(res) && !res.content.length) {
        notification.warning({
          message: `不存在${title}号为${e.target.value}的物料`,
        });
      } else if (getResponse(res) && res.content && res.content.length && activeTab === 'LOT') {
        modal = Modal.open({
          key: 'material-return-execution-modal',
          title: '退料执行',
          className: 'lwms-material-return-execution-modal',
          footer: null,
          children: (
            <ReturnModal
              list={res.content}
              value={e.target.value}
              activeTab={activeTab}
              onModalClose={handleExecuteCancel}
              onModalSure={handleExecuteOk}
            />
          ),
        });
      } else if (getResponse(res) && res.content && res.content.length && activeTab === 'TAG') {
        setItemTagList(itemTagList.concat(...res.content));
        setItemList(itemTagList.concat(...res.content));
      }
      queryDS.current.set('inputNum', null);
    }
  }

  function handleExit() {
    props.history.push('/workplace');
    closeTab('/pub/lwms/materiral-return-execution');
  }

  function handleDelete() {
    let currentTabList = itemNumList;
    if (activeTab === 'LOT') {
      currentTabList = itemLotList;
    } else if (activeTab === 'TAG') {
      currentTabList = itemTagList;
    }
    const checkedList = currentTabList.filter((item) => item.checked);
    if (!checkedList.length) {
      notification.warning({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const newList = xor(currentTabList, checkedList);
    if (activeTab === 'LOT') {
      setItemLotList(newList);
    } else if (activeTab === 'TAG') {
      setItemTagList(newList);
    } else {
      setItemNumList(newList);
    }
    setItemList(newList);
  }

  async function handleReturn() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) return;
    const params = {
      ...queryDS.current.toJSONData(),
      workerId: currentWorker.workerId,
      worker: currentWorker.workerCode,
      returnedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
    };
    const _itemNumList = [];
    itemNumList.forEach((i) => {
      if (i.checked) {
        _itemNumList.push({
          ...i,
          itemControlType: 'QUANTITY',
          requestReturnDetailList: [
            {
              returnedQty: i.returnedQty || 0,
            },
          ],
        });
      }
    });
    const requestReturnLineList1 = [];
    const requestReturnLineList2 = [];
    itemLotList.forEach((i) => {
      const index = requestReturnLineList1.findIndex((item) => item.itemId === i.itemId);
      if (i.checked) {
        if (index !== -1) {
          requestReturnLineList1[index].requestReturnDetailList.push({
            ...i,
            returnedQty: i.returnedQty || 0,
          });
        } else {
          requestReturnLineList1.push({
            itemId: i.itemId,
            itemCode: i.itemCode,
            uomId: i.uomId,
            uom: i.uom,
            itemControlType: 'LOT',
            requestReturnDetailList: [
              {
                ...i,
                returnedQty: i.returnedQty || 0,
              },
            ],
          });
        }
      }
    });
    itemTagList.forEach((i) => {
      const index = requestReturnLineList2.findIndex((item) => item.itemId === i.itemId);
      if (i.checked) {
        if (index !== -1) {
          requestReturnLineList2[index].requestReturnDetailList.push({
            ...i,
            returnedQty: i.returnedQty || i.quantity || 0,
          });
        } else {
          requestReturnLineList2.push({
            itemId: i.itemId,
            itemCode: i.itemCode,
            uomId: i.uomId,
            uom: i.uom,
            itemControlType: 'TAG',
            requestReturnDetailList: [
              {
                ...i,
                returnedQty: i.quantity || 0,
              },
            ],
          });
        }
      }
    });

    const requestReturnLineList = _itemNumList.concat(
      requestReturnLineList1,
      requestReturnLineList2
    );

    if (!requestReturnLineList.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    setSubmitLoading(true);
    const res = await submitWmReturn({
      ...params,
      requestReturnLineList,
    });
    if (!isEmpty(res) && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else {
      notification.success();
      setItemList([]);
      setItemLotList([]);
      setItemTagList([]);
      setItemNumList([]);
    }
    setSubmitLoading(false);
  }

  function handleReset() {
    const { organizationObj, warehouseObj, documentTypeObj } = queryDS.current.data;
    queryDS.current.reset();
    if (orgLock) {
      queryDS.current.set('organizationObj', organizationObj);
    }
    if (warehouseLock) {
      queryDS.current.set('warehouseObj', warehouseObj);
    }
    if (documentLock) {
      queryDS.current.set('documentTypeObj', documentTypeObj);
    }
    setItemList([]);
    setItemLotList([]);
    setItemTagList([]);
    setItemNumList([]);
  }

  function handleToWhChange(record) {
    let currentTabList = itemNumList;
    if (activeTab === 'LOT') {
      currentTabList = itemLotList;
    } else if (activeTab === 'TAG') {
      currentTabList = itemTagList;
    }
    const _itemList = currentTabList.slice();
    if (activeTab === 'NUMBER') {
      _itemList.forEach((item) => {
        const _item = item;
        _item.warehouseName = record.warehouseName;
      });
      setItemNumList(_itemList);
    } else if (activeTab === 'LOT') {
      setItemLotList(_itemList);
    } else if (activeTab === 'TAG') {
      setItemTagList(_itemList);
    }

    setItemList(_itemList);
  }

  function handleToWmChange(record) {
    let currentTabList = itemNumList;
    if (activeTab === 'LOT') {
      currentTabList = itemLotList;
    } else if (activeTab === 'TAG') {
      currentTabList = itemTagList;
    }
    const _itemList = currentTabList.slice();
    if (activeTab === 'NUMBER') {
      _itemList.forEach((item) => {
        const _item = item;
        _item.wmAreaName = record.wmAreaName;
      });
      setItemNumList(_itemList);
    } else if (activeTab === 'LOT') {
      setItemLotList(_itemList);
    } else if (activeTab === 'TAG') {
      setItemTagList(_itemList);
    }
    setItemList(_itemList);
  }

  return (
    <div className="lwms-material-return-execution">
      <CommonHeader title="退料执行" />
      <SubHeader
        queryDS={queryDS}
        orgLock={orgLock}
        warehouseLock={warehouseLock}
        documentLock={documentLock}
        currentWorker={currentWorker}
        onLockClick={handleLockClick}
        onToWhChange={handleToWhChange}
        onToWmChange={handleToWmChange}
      />
      <div className="lwms-material-return-execution-content">
        <div className="lwms-material-return-execution-content-search">
          <div className="tab-btn">
            <Button
              className={activeTab === 'NUMBER' ? 'active' : ''}
              onClick={() => handleTabClick('NUMBER')}
            >
              <img src={activeTab === 'NUMBER' ? NumBtnActiveIcon : NumBtnIcon} alt="" />
              数量
            </Button>
            <Button
              className={activeTab === 'LOT' ? 'active' : ''}
              onClick={() => handleTabClick('LOT')}
            >
              <img src={activeTab === 'LOT' ? LotBtnActiveIcon : LotBtnIcon} alt="" />
              批次
            </Button>
            <Button
              className={activeTab === 'TAG' ? 'active' : ''}
              onClick={() => handleTabClick('TAG')}
            >
              <img src={activeTab === 'TAG' ? TagBtnActiveIcon : TagBtnIcon} alt="" />
              标签
            </Button>
          </div>
          {activeTab === 'NUMBER' ? (
            <div className="item-input">
              <Lov
                dataSet={queryDS}
                name="itemObj"
                noCache
                clearButton={false}
                placeholder="请选择物料"
                onChange={handleItemChange}
              />
            </div>
          ) : (
            <div className="item-scan">
              <TextField
                dataSet={queryDS}
                name="inputNum"
                onKeyDown={handleSearch}
                placeholder={`请扫描物料${activeTab === 'LOT' ? '批次' : '标签'}号/查找${
                  activeTab === 'LOT' ? '批次' : '标签'
                }`}
              />
              <img src={ScanIcon} alt="" />
            </div>
          )}
        </div>
        <div className="lwms-material-return-execution-content-list">
          {itemList.map((item) => {
            return (
              <ListItem
                key={uuidv4()}
                queryDS={queryDS}
                tabType={activeTab}
                data={item}
                onNumChange={handleNumChange}
                onCheck={handleCheck}
              />
            );
          })}
        </div>
      </div>
      <Footer
        onCheckAll={handleCheckAll}
        onDelete={handleDelete}
        onReturn={handleReturn}
        onReset={handleReset}
        onExit={handleExit}
      />
      {submitLoading && <Loading title="退料中..." />}
    </div>
  );
};
