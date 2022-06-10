import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Lov, Form, Button, TextField, Modal } from 'choerodon-ui/pro';
import { Checkbox } from 'choerodon-ui';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import CommonInput from 'hlos-front/lib/components/CommonInput';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';
import { getTag, getQuantity } from '@/services/deliveryReturnService';
import styles from './index.less';
import CommonQuantityField from './CommonQuantityField';

// const preCode = 'lwms.deliveryReturnReceive';

const ReceiveModal = ({
  type,
  record,
  onModalCancel,
  onModalSave,
  ds,
  warehouseObj,
  organizationId,
  modalList,
  qty,
  selectQty,
}) => {
  const [list, setList] = useState(modalList || []);
  const [allChecked, changeAllChecked] = useState(false);
  const [showQuantityContent, setShowQuantityContent] = useState(true);
  const [currentData, setCurrentData] = useState(record);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [totalQty, setTotalQty] = useState(0);
  const [selectedQty, setSelectedQty] = useState(0);

  useEffect(() => {
    if (type === 'QUANTITY') {
      setShowQuantityContent(true);
    } else {
      setShowQuantityContent(false);
    }
    if (!isEmpty(warehouseObj)) {
      ds.current.set('warehouseObj', warehouseObj);
      setInputDisabled(false);
    }
    if (!isEmpty(modalList)) {
      changeAllChecked(modalList.every((i) => i.checked));
      setSelectedQty(selectQty);
    }
    if (qty) {
      setTotalQty(qty);
    }
    if (organizationId) {
      ds.current.set('organizationId', organizationId);
    }
    if (record.itemId) {
      ds.current.set('itemId', record.itemId);
    }
  }, []);

  function handleItemCheck(data, e) {
    let idx = list.findIndex((i) => i.tagCode === data.tagCode);
    if (type === 'LOT') {
      idx = list.findIndex((i) => i.lotNumber === data.lotNumber);
    }
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...data,
      checked: e.target.checked,
    });
    let _qty = 0;
    _list.forEach((i) => {
      if (i.checked) {
        _qty += i.returnedQty;
      }
    });
    setList(_list);
    changeAllChecked(_list.length ? _list.every((i) => i.checked) : false);
    setSelectedQty(_qty);
  }

  function handleAllCheck() {
    const _list = list.slice();
    let _qty = 0;
    if (allChecked) {
      _list.map((i) => {
        const _i = i;
        _i.checked = false;
        _qty += i.returnedQty;
        return _i;
      });
    } else {
      _list.map((i) => {
        const _i = i;
        _i.checked = true;
        return _i;
      });
    }
    setList(_list);
    changeAllChecked(!allChecked);
    setSelectedQty(_qty);
  }

  function handleNumChange(val, rec) {
    setCurrentData({
      ...rec,
      returnedQty: val,
    });
  }

  function handleQtyChange(val, rec) {
    const idx = list.findIndex((i) => i.lotNumber === rec.lotNumber);
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...rec,
      returnedQty: val,
    });
    let _qty = 0;
    let _selectedQty = 0;
    _list.forEach((i) => {
      _qty += i.returnedQty;
      if (i.checked) {
        _selectedQty += i.returnedQty;
      }
    });
    setList(_list);
    setTotalQty(_qty);
    setSelectedQty(_selectedQty);
  }

  async function handleSearch(val) {
    if (val) {
      let res = {};
      if (type === 'LOT') {
        res = await getQuantity({
          lotNumber: val,
          organizationId,
          warehouseId: ds.current.get('returnWarehouseId'),
          itemId: currentData.itemId,
        });
      } else if (type === 'TAG') {
        res = await getTag({
          tagCode: val,
          wmsOrganizationId: organizationId,
          warehouseId: ds.current.get('returnWarehouseId'),
          itemId: currentData.itemId,
        });
      }
      if (getResponse(res) && res.content) {
        if (!res.content.length) {
          notification.warning({
            message: `无效的${type === 'LOT' ? '批次' : '标签'}号`,
          });
        } else {
          handleLovChange(res.content);
        }
      }
    }
  }

  function handleBlur(e) {
    const val = e.target.value.trim();
    const idx = list.findIndex((i) => i.lotNumber === val || i.tagCode === val);
    if (idx !== -1) {
      Modal.confirm({
        key: Modal.key(),
        children: <span>是否删除该{type === 'LOT' ? '批次' : '标签'}</span>,
      }).then((button) => {
        if (button === 'ok') {
          const _list = list.slice();
          _list.splice(idx, 1);
          let _qty = 0;
          let _selectedQty = 0;
          _list.forEach((i) => {
            _qty += i.returnedQty;
            if (i.checked) {
              _selectedQty += i.returnedQty;
            }
          });
          setList(_list);
          setTotalQty(_qty);
          setSelectedQty(_selectedQty);
          changeAllChecked(_list.length ? _list.every((i) => i.checked) : false);
        }
      });
    } else {
      handleSearch(val);
    }
  }

  // function handleInputChange(e) {
  //   e.persist();
  //   if(e.keyCode === 13) {
  //     handleSearch(e.target.value.trim());
  //   }
  // }

  function handleWarehouseChange(rec, oldRec) {
    if (oldRec && list.length) {
      Modal.confirm({
        key: Modal.key(),
        children: <span>修改仓库将清空已添加{type === 'LOT' ? '批次' : '标签'}</span>,
      }).then((button) => {
        if (button === 'cancel') {
          ds.current.set('warehouseObj', oldRec);
        } else {
          setList([]);
          setTotalQty(0);
          setSelectedQty(0);
          changeAllChecked(false);
        }
      });
    }
    if (rec) {
      setInputDisabled(false);
    } else {
      setInputDisabled(true);
    }
  }

  function handleWmAreaChange(rec, oldRec) {
    if (list.length) {
      Modal.confirm({
        key: Modal.key(),
        children: <span>修改货位将清空已添加{type === 'LOT' ? '批次' : '标签'}</span>,
      }).then((button) => {
        if (button === 'cancel') {
          ds.current.set('wmAreaObj', oldRec);
        } else {
          setList([]);
          setTotalQty(0);
          setSelectedQty(0);
          changeAllChecked(false);
        }
      });
    }
  }

  function handleLovChange(rec) {
    const _list = list.slice();
    const {
      returnWarehouseId,
      returnWarehouseCode,
      returnWarehouseName,
      returnWmAreaId,
      returnWmAreaCode,
      returnWmAreaName,
    } = ds.current.toJSONData();
    const params = {
      returnWarehouseId,
      returnWarehouseCode,
      returnWarehouseName,
      returnWmAreaId,
      returnWmAreaCode,
      returnWmAreaName,
      checked: true,
    };
    let _qty = totalQty;
    let repeatFlag = false;
    const repeatList = [];
    rec.forEach((i) => {
      if (type === 'LOT') {
        if (_list.some((v) => v.lotNumber === i.lotNumber)) {
          repeatFlag = true;
          repeatList.push(i);
          return;
        }
        _list.push({
          ...params,
          lotId: i.lotId,
          lotNumber: i.lotNumber,
          returnedQty: i.quantity || 0,
        });
        _qty += i.quantity || 0;
      } else if (type === 'TAG') {
        if (_list.some((v) => v.tagCode === i.tagCode)) {
          repeatFlag = true;
          repeatList.push(i);
          return;
        }
        _list.push({
          ...params,
          tagId: i.tagId,
          tagCode: i.tagCode,
          lotId: i.lotId,
          lotNumber: i.lotNumber,
          returnedQty: i.quantity || 0,
        });
        _qty += i.quantity || 0;
      }
    });
    if (repeatFlag) {
      Modal.confirm({
        key: Modal.key(),
        children: <span>是否删除重复{type === 'LOT' ? '批次' : '标签'}</span>,
      }).then((button) => {
        if (button === 'ok') {
          repeatList.forEach((v) => {
            let idx = -1;
            if (type === 'LOT') {
              idx = _list.findIndex((i) => i.lotNumber === v.lotNumber);
            } else {
              idx = _list.findIndex((i) => i.tagCode === v.tagCode);
            }
            _list.splice(idx, 1);
          });
        }
        let _selectedQty = 0;
        _list.forEach((i) => {
          _selectedQty += i.returnedQty;
        });
        setList(_list);
        setTotalQty(_selectedQty);
        setSelectedQty(_selectedQty);
        changeAllChecked(_list.length ? _list.every((i) => i.checked) : false);
      });
    } else {
      setList(_list);
      setTotalQty(_qty);
      setSelectedQty(_qty);
      changeAllChecked(_list.length ? _list.every((i) => i.checked) : false);
    }
    ds.current.set('lotObj', null);
    ds.current.set('tagObj', null);
  }

  function handleUpdate(rec, val) {
    const idx = list.findIndex((i) => i.lotNumber === rec.lotNumber);
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...rec,
      returnedQty: rec.returnedQty + val,
    });
    setList(_list);
    let _qty = 0;
    let _selectQty = 0;
    _list.forEach((i) => {
      _qty += i.returnedQty;
      if (i.checked) {
        _selectQty += i.returnedQty;
      }
    });
    setTotalQty(_qty);
    setSelectedQty(_selectQty);
  }

  if (showQuantityContent) {
    return (
      <>
        <div className={styles.title}>
          <div>
            <img src={OrderImg} alt="" />
            {currentData.itemCode}-{currentData.description}
          </div>
          <CommonInput
            value={currentData.returnedQty}
            record={currentData}
            onChange={handleNumChange}
          />
        </div>
        <Form>
          <Lov dataSet={ds} name="warehouseObj" noCache placeholder="退货仓库" />
          <Lov dataSet={ds} name="wmAreaObj" noCache placeholder="退货货位" />
          <TextField dataSet={ds} name="poNum" placeholder="采购订单" />
          <TextField dataSet={ds} name="returnReason" placeholder="退货原因" />
        </Form>
        <div className={styles['modal-footer']}>
          <Button onClick={onModalCancel}>
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
          <Button
            color="primary"
            onClick={() =>
              onModalSave({
                ...currentData,
                ...ds.current.toJSONData(),
              })
            }
          >
            {intl.get('lwms.common.button.sure').d('确认')}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.title}>
        <div>
          <img src={OrderImg} alt="" />
          {currentData.itemCode}-{currentData.description}
        </div>
        <div>
          <TextField
            placeholder={`请输入/扫描物料${type === 'LOT' ? '批次' : '标签'}号`}
            suffix={<img src={ScanImg} alt="" />}
            disabled={inputDisabled}
            // onKeyDown={handleInputChange}
            onBlur={handleBlur}
          />
          <Lov
            dataSet={ds}
            name={type === 'LOT' ? 'lotObj' : 'tagObj'}
            mode="button"
            clearButton={false}
            disabled={inputDisabled}
            icon="add"
            noCache
            onChange={handleLovChange}
          >
            添加
          </Lov>
        </div>
      </div>
      <Form dataSet={ds} columns={3} labelLayout="placeholder">
        <Lov name="warehouseObj" noCache onChange={handleWarehouseChange} />
        <Lov name="wmAreaObj" noCache onChange={handleWmAreaChange} />
        <TextField name="poNum" />
        <TextField colSpan={3} name="returnReason" />
      </Form>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox checked={allChecked} onChange={handleAllCheck} />
              <span>
                {type === 'TAG' ? '标签' : '批次'}数：{list.filter((i) => i.checked).length}/
                {list.length}
              </span>
            </th>
            <th>
              总数：{totalQty} {currentData.uomName || currentData.uom}
            </th>
            <th>仓库 - 货位</th>
          </tr>
        </thead>
        <tbody>
          {list.map((i) => {
            return (
              <tr key={uuidv4()}>
                <td>
                  <Checkbox checked={i.checked} onChange={(e) => handleItemCheck(i, e)} />
                  <span>{type === 'LOT' ? i.lotNumber : i.tagCode}</span>
                </td>
                {type === 'LOT' ? (
                  <td>
                    <CommonQuantityField
                      value={i.returnedQty}
                      record={i}
                      onChange={handleQtyChange}
                      onUpdate={handleUpdate}
                    />
                  </td>
                ) : (
                  <td> {i.returnedQty} </td>
                )}
                <td>
                  {' '}
                  {i.returnWarehouseName}-{i.returnWmAreaName}{' '}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles['modal-footer']}>
        <Button onClick={onModalCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button
          color="primary"
          onClick={() =>
            onModalSave(
              {
                ...currentData,
                ...ds.current.toJSONData(),
              },
              list,
              totalQty,
              selectedQty
            )
          }
        >
          {intl.get('lwms.common.button.sure').d('确认')}
        </Button>
      </div>
    </>
  );
};

export default ReceiveModal;
