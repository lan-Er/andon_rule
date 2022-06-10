/**
 * @Description: 任务报工--副产品报工Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-24 10:21:08
 */

import React, { useState, useEffect, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
import { Lov, NumberField, Select, TextField, DataSet, Modal, Button } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import intl from 'utils/intl';
import scanImg from 'hlos-front/lib/assets/icons/scan.svg';
import itemIcon from 'hlos-front/lib/assets/icons/item.svg';
import historyIcon from 'hlos-front/lib/assets/icons/history.svg';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import { ByProductionDS } from '@/stores/taskReportDS';
import { queryItemData } from '@/services/taskService';
import HistoryModal from './HistoryModal';

import styles from './style.less';

const ByProduction = ({
  lotList,
  dispatch,
  taskInfo = {},
  moInfo = {},
  secondUomShow,
  converseValueShow,
  showMainUom,
  showInputArr,
  makeLotNumber,
  organizationId,
  onCancel,
  onOk,
}) => {
  const ds = useMemo(() => new DataSet(ByProductionDS()), []);
  const [arr, setArr] = useState([]);
  const [lotArr, setLotArr] = useState([]);
  const [tagArr, setTagArr] = useState([]);
  const [itemInfo, setItemInfo] = useState({});
  const [legendArr, setLegendArr] = useState([]);
  const [currentLotNumber, setCurrentLot] = useState(null);

  let historyModal = null;

  useEffect(() => {
    async function queryItem(taskId) {
      const res = await queryItemData({
        lovCode: 'LMES.TASK_ITEM',
        taskId,
        itemLineType: 'BYPRODUCT',
      });
      if (res && res.content && res.content[0]) {
        const {
          itemId,
          itemCode,
          itemDescription,
          inventoryWarehouseId,
          inventoryWarehouseCode,
          inventoryWarehouseName,
          inventoryWmAreaId,
          inventoryWmAreaCode,
          inventoryWmAreaName,
        } = res.content[0];
        setItemInfo(res.content[0]);
        ds.current.set('itemObj', {
          itemId,
          itemCode,
          itemDescription,
        });
        if (inventoryWarehouseId) {
          ds.current.set('warehouseObj', {
            warehouseId: inventoryWarehouseId,
            warehouseCode: inventoryWarehouseCode,
            warehouseName: inventoryWarehouseName,
          });
        }
        if (inventoryWmAreaId) {
          ds.current.set('wmAreaObj', {
            wmAreaId: inventoryWmAreaId,
            wmAreaCode: inventoryWmAreaCode,
            wmAreaName: inventoryWmAreaName,
          });
        }
      }
    }
    if (ds.current) {
      ds.current.reset();
    }
    if (taskInfo?.taskId) {
      ds.current.set('taskId', taskInfo.taskId);
      queryItem(taskInfo.taskId);
    }
    if (organizationId) {
      ds.current.set('orgId', organizationId);
    }
    if (moInfo?.inventoryWarehouseId) {
      ds.current.set('warehouseObj', {
        warehouseId: moInfo?.inventoryWarehouseId,
        warehouseCode: moInfo?.inventoryWarehouseCode,
        warehouseName: moInfo?.inventoryWarehouseName,
      });
    }
    if (moInfo?.inventoryWmAreaId) {
      ds.current.set('wmAreaObj', {
        wmAreaId: moInfo?.inventoryWmAreaId,
        wmAreaCode: moInfo?.inventoryWmAreaCode,
        wmAreaName: moInfo?.inventoryWmAreaName,
      });
    }
    if (makeLotNumber) {
      setCurrentLot(makeLotNumber);
      dispatch({
        type: 'taskReport/updateLotArr',
        payload: [
          {
            lotNumber: makeLotNumber,
          },
        ],
      });
    }
  }, []);

  useEffect(() => {
    if (showInputArr && showInputArr.length) {
      const inputArr = [];
      showInputArr.forEach((i) => {
        let item = {};
        if (i === 'ok') {
          item = {
            style: 'OK',
            title: '合格',
            name: 'processOkQty',
          };
        } else if (i === 'rework') {
          item = {
            style: 'REWORK',
            title: '返修',
            name: 'reworkQty',
          };
        } else if (i === 'scrapped') {
          item = {
            style: 'SCRAPPED',
            title: '报废',
            name: 'scrappedQty',
          };
        } else if (i === 'pending') {
          item = {
            style: 'PENDING',
            title: '待定',
            name: 'pendingQty',
          };
        } else if (i === 'ng') {
          item = {
            style: 'NG',
            title: '不合格',
            name: 'processNgQty',
          };
        }
        inputArr.push(item);
      });
      setArr(inputArr);
    }
  }, [showInputArr]);

  useEffect(() => {
    setLegendArr([
      {
        code: 'OK',
        meaning: '合格',
        name: 'processOkQty',
        quantity: itemInfo.processOkQty || 0,
      },
      {
        code: 'NG',
        meaning: '不合格',
        name: 'processNgQty',
        quantity: itemInfo.processNgQty || 0,
      },
      {
        code: 'REWORK',
        meaning: '返修',
        name: 'reworkQty',
        quantity: itemInfo.reworkQty || 0,
      },
      {
        code: 'SCRAPPED',
        meaning: '报废',
        name: 'scrappedQty',
        quantity: itemInfo.scrappedQty || 0,
      },
      {
        code: 'PENDING',
        meaning: '待定',
        name: 'pendingQty',
        quantity: itemInfo.pendingQty || 0,
      },
    ]);
  }, [itemInfo]);

  // function handleValueChange(num, type) {
  //   if (ds.current.get(`${type}`) + num < 0) return;
  //   ds.current.set(`${type}`, ds.current.get(`${type}`) + num);
  //   if (itemInfo?.itemControlType === 'LOT') {
  //     const idx = lotList.findIndex((i) => i.lotNumber === currentLotNumber);
  //     if (idx !== -1) {
  //       const _lotArr = lotList.slice();
  //       _lotArr.splice(idx, 1, {
  //         ...lotList[idx],
  //         [type]: ds.current.get(`${type}`),
  //       });
  //       setLotArr(_lotArr);
  //       dispatch({
  //         type: 'taskReport/updateLotArr',
  //         payload: JSON.parse(JSON.stringify(_lotArr)),
  //       });
  //     }
  //   }
  // }

  function handleTagValueChange(val, rec) {
    const idx = tagArr.findIndex((i) => i.tagCode === rec.tagCode);
    if (idx !== -1) {
      const _tagArr = tagArr.slice();
      _tagArr.splice(idx, 1, {
        ...rec,
        quantity: val,
      });
      setTagArr(_tagArr);
    }
  }

  function handleItemChange(rec) {
    if (rec) {
      setItemInfo(rec);
    } else {
      setItemInfo({});
    }
  }

  function handleTagEnterDDown(e) {
    if (e.target.value.trim()) {
      const idx = tagArr.findIndex((i) => i.tagCode === e.target.value.trim());
      if (idx !== -1) {
        notification.warning({
          message: '该标签已录入',
        });
        return;
      }
      const { quantity, qcType } = ds.current.toJSONData();
      const _tagArr = tagArr.slice();
      _tagArr.push({
        quantity: quantity || 0,
        qcType,
        tagCode: e.target.value.trim(),
      });
      setTagArr(_tagArr);
      ds.current.set('tagCode', null);
    }
  }

  function handleLotEnterDDown(e) {
    if (e.target.value.trim()) {
      const idx = lotList.findIndex((i) => i.lotNumber === e.target.value.trim());
      if (idx !== -1) {
        notification.warning({
          message: '该批次已录入',
        });
        return;
      }
      const {
        quantity,
        processOkQty,
        processNgQty,
        reworkQty,
        scrappedQty,
        pendingQty,
      } = ds.current.toJSONData();
      const _lotArr = lotList.slice();
      const preIdx = lotList.findIndex((i) => i.lotNumber === currentLotNumber);
      if (preIdx !== -1) {
        _lotArr.splice(preIdx, 1, {
          ..._lotArr[preIdx],
          processOkQty,
          processOkQtyExchange: Number(processOkQty).toFixed(2),
          processNgQty,
          processNgQtyExchange: Number(processNgQty).toFixed(2),
          reworkQty,
          reworkQtyExchange: Number(reworkQty).toFixed(2),
          scrappedQty,
          scrappedQtyExchange: Number(scrappedQty).toFixed(2),
          pendingQty,
          pendingQtyExchange: Number(pendingQty).toFixed(2),
        });
      }
      const okExchange = showMainUom
        ? quantity * taskInfo.uomConversionValue
        : quantity / taskInfo.uomConversionValue;
      _lotArr.unshift({
        processOkQty: quantity || 0,
        processOkQtyExchange: Number(okExchange).toFixed(2),
        reworkQty: 0,
        reworkQtyExchange: 0,
        processNgQty: 0,
        processNgQtyExchange: 0,
        scrappedQty: 0,
        scrappedQtyExchange: 0,
        pendingQty: 0,
        pendingQtyExchange: 0,
        lotNumber: e.target.value.trim(),
      });

      setLotArr(_lotArr);
      dispatch({
        type: 'taskReport/updateLotArr',
        payload: JSON.parse(JSON.stringify(_lotArr)),
      });
      setCurrentLot(e.target.value.trim());
      ds.current.set('processOkQty', quantity || 0);
      ds.current.set('processNgQty', 0);
      ds.current.set('reworkQty', 0);
      ds.current.set('scrappedQty', 0);
      ds.current.set('pendingQty', 0);
      ds.current.set('lotNumber', null);
    }
  }

  function handleItemDelete(rec) {
    const idx = tagArr.findIndex((i) => i.tagCode === rec.tagCode);
    if (idx !== -1) {
      const _tagArr = tagArr.slice();
      _tagArr.splice(idx, 1);
      setTagArr(_tagArr);
    }
  }

  function handleHistoryClick() {
    historyModal = Modal.open({
      key: 'history',
      title: `已扫描（${lotList.length}）`,
      className: styles['lmes-task-report-history-modal'],
      children: (
        <HistoryModal
          taskInfo={taskInfo}
          lotList={lotList}
          secondUomShow={secondUomShow}
          converseValueShow={converseValueShow}
          onHistoryQtyChange={handleHistoryQtyChange}
          onHistoryDel={handleHistoryDel}
          showInputArr={showInputArr}
        />
      ),
      onOk: handleHisOk,
      onCancel: handleHisCancel,
    });
  }

  /**
   * 扫描标签历史Modal 确定按钮
   */
  function handleHisOk() {
    dispatch({
      type: 'taskReport/updateLotArr',
      payload: JSON.parse(JSON.stringify(lotArr)),
    });
    if (lotArr.length) {
      ds.current.set('processOkQty', lotArr[0].processOkQty);
      ds.current.set('processNgQty', lotArr[0].processNgQty);
      ds.current.set('reworkQty', lotArr[0].reworkQty);
      ds.current.set('scrappedQty', lotArr[0].scrappedQty);
      ds.current.set('pendingQty', lotArr[0].pendingQty);
    }
  }

  /**
   * 扫描标签历史Modal 取消按钮
   */
  function handleHisCancel() {
    setLotArr(lotList);
  }

  /**
   * 批次历史数量修改
   */
  function handleHistoryQtyChange(type, value, index) {
    const _list = lotArr.slice();

    _list.forEach((item, i) => {
      const _item = item;
      if (i === index) {
        _item[`${type}`] = value;
      }
      if (showMainUom) {
        _item[`${type}Exchange`] = Number(value * taskInfo.uomConversionValue).toFixed(2);
      } else {
        _item[`${type}Exchange`] = Number(value / taskInfo.uomConversionValue).toFixed(2);
      }
    });

    setLotArr(_list);
  }

  /**
   * 扫描标签历史删除
   */
  function handleHistoryDel(index) {
    const _lotList = lotArr;
    _lotList.splice(index, 1);
    setLotArr(_lotList);

    historyModal.update({
      children: (
        <HistoryModal
          taskInfo={taskInfo}
          lotList={_lotList}
          secondUomShow={secondUomShow}
          converseValueShow={converseValueShow}
          onHistoryQtyChange={handleHistoryQtyChange}
          onHistoryDel={handleHistoryDel}
          showInputArr={showInputArr}
        />
      ),
    });
  }

  function handleInputChange(val, type) {
    const idx = lotList.findIndex((i) => i.lotNumber === currentLotNumber);
    if (idx !== -1) {
      const _lotArr = lotList.slice();
      _lotArr.splice(idx, 1, {
        ...lotList[idx],
        [type]: val,
      });
      setLotArr(_lotArr);
      dispatch({
        type: 'taskReport/updateLotArr',
        payload: JSON.parse(JSON.stringify(_lotArr)),
      });
    }
  }

  function handleOk() {
    if (isEmpty(itemInfo)) return;
    if (!ds.current.get('warehouseId')) {
      notification.warning({
        message: '请选择仓库',
      });
      return;
    }
    if (!ds.current.get('remark')) {
      notification.warning({
        message: '原因',
      });
      return;
    }
    if (itemInfo?.itemControlType === 'LOT' && !lotList.length && !makeLotNumber) {
      notification.warning({
        message: '请录入批次后再提交',
      });
      return;
    } else if (itemInfo?.itemControlType === 'TAG' && !tagArr.length) {
      notification.warning({
        message: '请录入标签后再提交',
      });
      return;
    }
    const list = getSubmitList();
    const { warehouseId, warehouseCode, wmAreaId, wmAreaCode, remark } = ds.current.toJSONData();
    const wmObj = {
      warehouseId,
      warehouseCode,
      wmAreaId,
      wmAreaCode,
      remark,
    };
    onOk(itemInfo, list, wmObj);
  }

  function getSubmitList() {
    const list = [];
    if (itemInfo?.itemControlType === 'QUANTITY') {
      if (showMainUom) {
        list.push({
          executeQty: ds.current.get('processOkQty'),
          executeNgQty: ds.current.get('processNgQty'),
          scrappedQty: ds.current.get('scrappedQty'),
          reworkQty: ds.current.get('reworkQty'),
          pendingQty: ds.current.get('pendingQty'),
        });
      } else {
        list.push({
          executeQty: ds.current.get('processOkQty') / taskInfo.uomConversionValue,
          executeNgQty: ds.current.get('processNgQty') / taskInfo.uomConversionValue,
          scrappedQty: ds.current.get('scrappedQty') / taskInfo.uomConversionValue,
          reworkQty: ds.current.get('reworkQty') / taskInfo.uomConversionValue,
          pendingQty: ds.current.get('pendingQty') / taskInfo.uomConversionValue,
        });
      }
    } else if (itemInfo?.itemControlType === 'LOT') {
      lotList.forEach((item) => {
        const processOkQty = makeLotNumber ? ds.current.get('processOkQty') : item.processOkQty;
        const processNgQty = makeLotNumber ? ds.current.get('processNgQty') : item.processNgQty;
        const scrappedQty = makeLotNumber ? ds.current.get('scrappedQty') : item.scrappedQty;
        const reworkQty = makeLotNumber ? ds.current.get('reworkQty') : item.reworkQty;
        const pendingQty = makeLotNumber ? ds.current.get('pendingQty') : item.pendingQty;
        if (showMainUom) {
          list.push({
            lotNumber: item.lotNumber,
            executeQty: processOkQty,
            executeNgQty: processNgQty,
            scrappedQty,
            reworkQty,
            pendingQty,
          });
        } else {
          list.push({
            lotNumber: item.lotNumber,
            executeQty: processOkQty / taskInfo.uomConversionValue,
            executeNgQty: processNgQty / taskInfo.uomConversionValue,
            scrappedQty: scrappedQty / taskInfo.uomConversionValue,
            reworkQty: reworkQty / taskInfo.uomConversionValue,
            pendingQty: pendingQty / taskInfo.uomConversionValue,
          });
        }
      });
    } else if (itemInfo?.itemControlType === 'TAG') {
      tagArr.forEach((item) => {
        const _item = item;
        if (_item.qcType === 'OK') {
          _item.executeQty = _item.quantity;
        } else if (item.qcType === 'NG') {
          _item.executeNgQty = _item.quantity;
        } else if (item.qcType === 'SCRAPPED') {
          _item.scrappedQty = _item.quantity;
        } else if (item.qcType === 'REWORK') {
          _item.reworkQty = _item.quantity;
        } else if (item.qcType === 'PENDING') {
          _item.pendingQty = _item.quantity;
        }
        if (showMainUom) {
          list.push({
            tagCode: _item.tagCode,
            executeQty: _item.executeQty,
            executeNgQty: _item.executeNgQty,
            scrappedQty: _item.scrappedQty,
            reworkQty: _item.reworkQty,
            pendingQty: _item.pendingQty,
          });
        } else {
          list.push({
            tagCode: _item.tagCode,
            executeQty: _item.executeQty / taskInfo.uomConversionValue,
            executeNgQty: _item.executeNgQty / taskInfo.uomConversionValue,
            scrappedQty: _item.scrappedQty / taskInfo.uomConversionValue,
            reworkQty: _item.reworkQty / taskInfo.uomConversionValue,
            pendingQty: _item.pendingQty / taskInfo.uomConversionValue,
          });
        }
      });
    }
    return list;
  }

  return (
    <div>
      <div className={styles['input-area']}>
        <Lov dataSet={ds} name="itemObj" placeholder="请选择物料" onChange={handleItemChange} />
        <Lov dataSet={ds} name="warehouseObj" placeholder="仓库" />
        <Lov dataSet={ds} name="wmAreaObj" placeholder="货位" />
        <Select dataSet={ds} name="remark" placeholder="原因" />
      </div>
      <div className={styles['input-area']}>
        {(itemInfo?.itemControlType === 'TAG' || itemInfo?.itemControlType === 'LOT') &&
          !makeLotNumber && <NumberField dataSet={ds} name="quantity" placeholder="请输入数量" />}
        {itemInfo?.itemControlType === 'TAG' && (
          <div className={styles['scan-input']}>
            <Select dataSet={ds} name="qcType" className={styles['scan-select']} />
            <div className={styles['scan-text']}>
              <TextField
                dataSet={ds}
                name="tagCode"
                placeholder="请输入或扫描标签编码"
                onEnterDown={handleTagEnterDDown}
              />
              <img src={scanImg} alt="" />
            </div>
          </div>
        )}
        {itemInfo?.itemControlType === 'LOT' && !makeLotNumber && (
          <div className={styles['scan-input']}>
            <TextField
              dataSet={ds}
              name="lotNumber"
              className={styles['scan-text']}
              placeholder="请输入或扫描批次号"
              onEnterDown={handleLotEnterDDown}
            />
            <img src={scanImg} alt="" />
          </div>
        )}
      </div>
      <div className={styles['base-info']}>
        <div>
          <img src={itemIcon} alt="" />
          <span>
            {itemInfo.itemCode}-{itemInfo.itemDescription}
          </span>
        </div>
        <div>
          <span>
            需求量: <span>{itemInfo.taskQty}</span>
          </span>
          {itemInfo?.itemControlType !== 'TAG' && (
            <span>
              单位: <span>{showMainUom ? itemInfo.uomName : itemInfo.secondUomName || null}</span>
            </span>
          )}
          {itemInfo?.itemControlType === 'LOT' && !isEmpty(lotList) && (
            <span>{lotList[0].lotNumber}</span>
          )}
          {itemInfo?.itemControlType === 'LOT' && !makeLotNumber && !isEmpty(lotList) && (
            <img src={historyIcon} alt="" onClick={handleHistoryClick} />
          )}
        </div>
      </div>
      <div
        className={`${styles['main-input']} ${
          itemInfo?.itemControlType !== 'TAG' ? styles['not-lot'] : ''
        }`}
      >
        <div className={`${styles['chart-legend']} ${styles[itemInfo?.itemControlType]}`}>
          {legendArr.map((i) => {
            return (
              <p key={i.code}>
                <span>
                  <span className={`${styles.circle} ${styles[i.code]}`} />
                  {i.meaning}
                </span>
                <span className={styles.num}>{i.quantity}</span>
              </p>
            );
          })}
        </div>
        {itemInfo?.itemControlType === 'TAG' ? (
          <div className={styles['lot-item-wrapper']}>
            {tagArr.map((i) => {
              return (
                <div className={styles['lot-item']} key={i.tagCode}>
                  <div>
                    <span className={`${styles.circle} ${styles[i.qcType]}`} />
                    <span className={styles.num}>{i.tagCode}</span>
                  </div>
                  <div>
                    <NumberField
                      value={i.quantity}
                      onChange={(val) => handleTagValueChange(val, i)}
                    />
                    <span className={styles.qty}>
                      {secondUomShow && `${converseValueShow(i.quantity)}${secondUomShow}`}
                    </span>
                    <img src={deleteIcon} alt="" onClick={() => handleItemDelete(i)} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {arr.map((i) => {
              return (
                <div className={styles['input-item']}>
                  <div className={styles['input-item-top']}>
                    <p>
                      <span className={`${styles.circle} ${styles[i.style]}`} />
                      {i.title}
                    </p>
                    <p>
                      {secondUomShow &&
                        `${converseValueShow(ds.current.get(`${i.name}`))}${secondUomShow}`}
                    </p>
                  </div>
                  <div className={styles['number-field']}>
                    <NumberField
                      dataSet={ds}
                      name={i.name}
                      // value={i.value}
                      onChange={(val) => handleInputChange(val, i.name)}
                    />
                    {/* <span
                      className={`${styles['compute-btn']} ${styles.left}`}
                      onClick={() => handleValueChange(-1, i.name)}
                    >
                      -
                    </span>
                    <span
                      className={`${styles['compute-btn']} ${styles.right}`}
                      onClick={() => handleValueChange(1, i.name)}
                    >
                      +
                    </span> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles['by-product-modal-footer']}>
        <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button color="primary" onClick={() => handleOk()}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
      </div>
    </div>
  );
};
export default connect(({ taskReport }) => ({
  lotList: taskReport?.lotList || [],
}))(ByProduction);
