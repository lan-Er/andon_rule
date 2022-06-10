/**
 * @Description: 完工入库--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React, { useMemo, useState, useEffect } from 'react';
import { xor, isEmpty } from 'lodash';
import { TextField, Lov, Button } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
// import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { queryDS } from '@/stores/wipCompletionDS';
import {
  requestItemByLot,
  // requestItemByTag,
  requertItemByCode,
  completeToInventory,
} from '@/services/wipCompletionService';

import Loading from 'hlos-front/lib/components/Loading';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import LotBtnIcon from 'hlos-front/lib/assets/icons/lot-unselect.svg';
import LotBtnActiveIcon from 'hlos-front/lib/assets/icons/lot-selected.svg';
import TagBtnIcon from 'hlos-front/lib/assets/icons/tag-unselect.svg';
import TagBtnActiveIcon from 'hlos-front/lib/assets/icons/tag-selected.svg';
import NumBtnIcon from 'hlos-front/lib/assets/icons/number-unselect.svg';
import NumBtnActiveIcon from 'hlos-front/lib/assets/icons/number-selected.svg';
import ScanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import Time from './components/Time';
import ListItem from './components/ListItem';
import Footer from './components/Footer';
import SubHeader from './components/SubHeader';

import './style.less';

const { common } = codeConfig.code;

export default (props) => {
  const timeComponent = useMemo(() => <Time />, []);
  const [activeTab, changeActiveTab] = useState('QUANTITY');
  const [orgLock, setOrgLock] = useState(false);
  const [prodLineLock, setWhLock] = useState(false);
  const [wmAreaLock, setDocLock] = useState(false);
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
        queryDS.current.set('defaultOrgId', orgRes.content[0].organizationId);
      }
    }
    queryDefaultLovData();
  }, []);

  async function handleTabClick(value) {
    changeActiveTab(value);
    queryDS.current.set('itemObj', null);
    queryDS.current.set('inputNum', null);
    queryDS.current.set('itemControlType', value);
    if (value === 'LOT') {
      setItemList(itemLotList);
    } else if (value === 'TAG') {
      setItemList(itemTagList);
    } else {
      setItemList(itemNumList);
    }
  }

  function handleNumChange(value, record) {
    if (activeTab === 'QUANTITY') {
      itemNumList.forEach((i) => {
        const _i = i;
        if (_i.itemId === record.itemId) {
          _i.inventoryQty = value;
          _i.checked = true;
        }
      });
      setItemNumList(itemNumList);
      setItemList(itemNumList);
    } else if (activeTab === 'LOT') {
      itemLotList.forEach((i) => {
        const _i = i;
        if (_i.lotNumber === record.lotNumber) {
          _i.inventoryQty = value;
          _i.checked = true;
        }
      });
      setItemLotList(itemLotList);
      setItemList(itemLotList);
    } else if (activeTab === 'TAG') {
      itemTagList.forEach((i) => {
        const _i = i;
        if (_i.tagCode === record.tagCode) {
          _i.inventoryQty = value;
          _i.checked = true;
        }
      });
      setItemTagList(itemTagList);
      setItemList(itemTagList);
    }
  }

  async function handleItemChange(record = {}) {
    if (activeTab !== 'QUANTITY') return;
    if (!isEmpty(itemNumList.find((i) => i.itemCode === record.itemCode))) {
      notification.warning({
        message: '该物料已录入',
      });
    } else {
      const res = await requertItemByCode({ itemCode: record.itemCode });
      if (getResponse(res)) {
        res.checked = false;
        res.warehouseName = queryDS.current.get('warehouseName');
        res.wmAreaName = queryDS.current.get('wmAreaName');
        setItemNumList(itemNumList.concat(res));
        setItemList(itemNumList.concat(res));
      }
    }
  }

  function handleCheck(record, e) {
    let currentTabList = itemNumList;
    let index = currentTabList.findIndex((el) => el.itemId === record.itemId);
    if (activeTab === 'LOT') {
      currentTabList = itemLotList;
      index = currentTabList.findIndex((el) => el.lotNumber === record.lotNumber);
    } else if (activeTab === 'TAG') {
      currentTabList = itemTagList;
      index = currentTabList.findIndex((el) => el.tagCode === record.tagCode);
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
    } else if (type === 'ProdLine') {
      setWhLock(!prodLineLock);
    } else if (type === 'WmArea') {
      setDocLock(!wmAreaLock);
    }
  }

  async function handleSearch(e) {
    e.persist();
    let params = {
      meOuId: queryDS.current.get('organizationId'),
    };
    if (e.keyCode === 13) {
      if (!queryDS.current.get('organizationId')) {
        notification.warning({
          message: '请选择工厂',
        });
        return;
      }
      if (activeTab === 'LOT') {
        if (!queryDS.current.get('itemCode')) {
          notification.warning({
            message: '请选择物料',
          });
          return;
        }
        if (itemLotList.filter((i) => i.lotNumber === e.target.value).length) {
          notification.warning({
            message: '该批次已录入',
          });
          return;
        }
        params = {
          ...params,
          lotNumber: e.target.value,
        };
        const res = await requestItemByLot(params);
        if (res && res.failed && res.message) {
          notification.warning({
            message: res.message,
          });
          return;
        }
        setItemLotList(itemLotList.concat(...res));
        setItemList(itemLotList.concat(...res));
      } else {
        const tagItem = {
          tagCode: e.target.value,
          itemId: queryDS.current.get('itemId'),
          itemCode: queryDS.current.get('itemCode'),
          description: queryDS.current.get('description'),
          uomId: queryDS.current.get('uomId'),
          uom: queryDS.current.get('uom'),
          uomName: queryDS.current.get('uomName'),
        };
        setItemTagList(itemTagList.concat(tagItem));
        setItemList(itemTagList.concat(tagItem));
      }
    }
  }

  function handleExit() {
    props.history.push('/workplace');
    closeTab('/pub/lwms/wip-completion');
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

  async function handleSubmit() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) return;
    let workPara = {};
    const itemNumListSelected = itemNumList.filter((i) => i.checked);
    const itemLotListSelected = itemLotList.filter((i) => i.checked);
    const itemTagListSelected = itemTagList.filter((i) => i.checked);

    if (!isEmpty(currentWorker)) {
      workPara = {
        workerId: currentWorker.workerId,
        worker: currentWorker.workerCode,
        eventBy: currentWorker.workerId,
      };
    }
    const headerData = {
      ...queryDS.current.toJSONData(),
      ...workPara,
    };
    const lineList = itemNumListSelected.concat(itemLotListSelected, itemTagListSelected);
    const finalList = [];
    lineList.forEach((i) => {
      const index = finalList.findIndex((item) => item.itemId === i.itemId);
      if (index !== -1) {
        finalList[index].completeToInventoryLineDtoList.push(i);
      } else {
        finalList.push({
          ...headerData,
          itemControlType: null,
          itemId: i.itemId,
          itemCode: i.itemCode,
          uomId: i.uomId,
          uom: i.uom,
          completeToInventoryLineDtoList: [i],
        });
      }
    });
    setSubmitLoading(true);
    const res = await completeToInventory(finalList);
    if (res && res.failed && res.message) {
      notification.warning({
        message: res.message,
      });
    } else if (getResponse(res)) {
      notification.success();
      handleReset();
    }
    setSubmitLoading(false);
  }

  function handleReset() {
    const { orgObj, prodLineObj, wmAreaObj } = queryDS.current.data;
    queryDS.current.reset();
    if (orgLock) {
      queryDS.current.set('orgObj', orgObj);
    }
    if (prodLineLock) {
      queryDS.current.set('prodLineObj', prodLineObj);
    }
    if (wmAreaLock) {
      queryDS.current.set('wmAreaObj', wmAreaObj);
    }
    setItemNumList([]);
    setItemLotList([]);
    setItemTagList([]);
    setItemList([]);
  }

  return (
    <div className="lwms-wip-completion">
      <div className="lwms-wip-completion-header">
        <img src={LogoImg} alt="" />
        {timeComponent}
      </div>
      <SubHeader
        queryDS={queryDS}
        orgLock={orgLock}
        prodLineLock={prodLineLock}
        wmAreaLock={wmAreaLock}
        currentWorker={currentWorker}
        onLockClick={handleLockClick}
      />
      <div className="lwms-wip-completion-content">
        <div className="lwms-wip-completion-content-search">
          <div className="tab-btn">
            <Button
              className={activeTab === 'QUANTITY' ? 'active' : ''}
              onClick={() => handleTabClick('QUANTITY')}
            >
              <img src={activeTab === 'QUANTITY' ? NumBtnActiveIcon : NumBtnIcon} alt="" />
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
          {activeTab !== 'QUANTITY' && (
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
        <div className="lwms-wip-completion-content-list">
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
        onSubmit={handleSubmit}
        onReset={handleReset}
        onExit={handleExit}
      />
      {submitLoading && <Loading title="提交中..." />}
    </div>
  );
};
