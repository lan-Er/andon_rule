/*
 * @Description: 退料弹框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-29 16:26:23
 */

import React, { useState, useEffect } from 'react';
import {
  DataSet,
  TextField,
  Lov,
  Row,
  Col,
  CheckBox,
  Button,
  Tooltip,
  Modal,
  NumberField,
} from 'choerodon-ui/pro';
import notification from 'utils/notification';

import OddNumberImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import QuantityImg from 'hlos-front/lib/assets/icons/quantity.svg';
import scanImg from 'hlos-front/lib/assets/icons/scan.svg';
import { ModalDS } from '../../stores/purchaseReturnOrderExecutionDS.js';
import { getTag, getQuantity } from '../../services/purchaseReturnOrderExecutionService.js';

import style from './index.less';

const mDS = new DataSet(ModalDS());

function ReturnModal(props) {
  const [totalQty, setTotalQty] = useState(0);
  const [addList, setAddList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [allChecked, setAllChecked] = useState(true);

  useEffect(() => {
    if (props.organizationId) {
      mDS.current.set('organizationId', props.organizationId);
    }
    if (props.returnWarehouseId) {
      mDS.current.set('warehouseObj', {
        warehouseId: props.returnWarehouseId,
        warehouseCode: props.returnWarehouseCode,
        warehouseName: props.returnWarehouseName,
      });
      mDS.current.set('wmAreaObj', {
        wmAreaId: props.returnWmAreaId,
        wmAreaCode: props.returnWmAreaCode,
        wmAreaName: props.returnWmAreaName,
      });
    }
    // 再次打开弹窗时, 保留弹窗内的数据
    if (props.modalList && props.modalList.length) {
      let sum = 0;
      if (props.itemControlType === 'TAG') {
        sum = props.modalList.reduce((val, el) => {
          return val + el.quantity;
        }, 0);
      } else if (props.itemControlType === 'LOT') {
        sum = props.modalList.reduce((val, el) => {
          return val + el.newQuantity;
        }, 0);
      }
      setTotalQty(sum);
      setAddList(props.modalList);
      setCheckedList(props.modalList);
    }
  }, []);

  const handleQueryData = async (code) => {
    let res = {};
    if (props.itemControlType === 'TAG') {
      res = await getTag({
        wmsOrganizationId: props.organizationId,
        itemId: props.itemId,
        tagCode: code,
        warehouseId: mDS.current.get('warehouseId'),
        wmAreaId: mDS.current.get('wmAreaId'),
      });
    } else {
      res = await getQuantity({
        organizationId: props.organizationId,
        itemId: props.itemId,
        lotNumber: code,
        warehouseId: mDS.current.get('warehouseId'),
        wmAreaId: mDS.current.get('wmAreaId'),
      });
    }
    if (res && res.content && res.content.length) {
      let flagIndex = null;
      if (props.itemControlType === 'TAG') {
        flagIndex = addList.findIndex((v) => v.tagCode === res.content[0].tagCode);
      } else {
        flagIndex = addList.findIndex((v) => v.lotNumber === res.content[0].lotNumber);
      }
      if (flagIndex === -1) {
        const list = [
          ...addList,
          { ...res.content[0], checked: true, newQuantity: res.content[0].quantity },
        ];
        const sum = list.reduce((val, el) => {
          return val + el.quantity;
        }, 0);
        setTotalQty(sum);
        setAddList(list);
        setCheckedList(list);
        mDS.current.set('queryValue', null);
      } else {
        Modal.confirm({
          key: Modal.key(),
          children: <span>是否删除该{props.itemControlType === 'LOT' ? '批次' : '标签'}</span>,
        }).then((button) => {
          if (button === 'ok') {
            const list = addList.slice();
            list.splice(flagIndex, 1);
            const sum = list.reduce((val, el) => {
              return val + el.quantity;
            }, 0);
            setTotalQty(sum);
            setAddList(list);
            setCheckedList(list);
            mDS.current.set('queryValue', null);
          } else {
            mDS.current.set('queryValue', null);
          }
        });
      }
    } else {
      notification.warning({
        message: `无效的${props.itemControlType === 'LOT' ? '批次' : '标签'}号`,
      });
      mDS.current.set('queryValue', null);
    }
  };

  const handleInputAdd = (value) => {
    handleQueryData(value);
  };

  const handleQueryTag = (value) => {
    handleQueryData(props.itemControlType === 'TAG' ? value.tagCode : value.lotNumber);
  };

  const handleCloseModal = () => {
    props.modal.close();
  };

  const handleWarehouseChange = (rec, oldRec) => {
    mDS.current.set('wmAreaObj', {});
    if (oldRec && addList.length) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>修改仓库将清空已添加{props.itemControlType === 'LOT' ? '批次' : '标签'}</span>
        ),
      }).then((button) => {
        if (button === 'cancel') {
          mDS.current.set('warehouseObj', oldRec);
        } else {
          setAddList([]);
          setAllChecked([]);
          setAllChecked(true);
          mDS.current.set('queryValue', null);
        }
      });
    }
  };

  const handleWmAreaChange = (rec, oldRec) => {
    if (oldRec && addList.length) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>修改货位将清空已添加{props.itemControlType === 'LOT' ? '批次' : '标签'}</span>
        ),
      }).then((button) => {
        if (button === 'cancel') {
          mDS.current.set('wmAreaObj', oldRec);
        } else {
          setAddList([]);
          setAllChecked([]);
          setAllChecked(true);
          mDS.current.set('queryValue', null);
        }
      });
    }
  };

  const handleAllCheck = (value) => {
    let list = addList.slice();
    list = list.map((v) => ({ ...v, checked: value }));
    const ckList = list.filter((v) => v.checked);
    setAddList(list);
    setCheckedList(ckList);
    setAllChecked(value);
  };

  const handleSingleCheck = (index) => {
    const list = addList.slice();
    list[index].checked = !list[index].checked;
    const ckList = list.filter((v) => v.checked);
    setAddList(list);
    setCheckedList(ckList);
    if (ckList.length === list.length) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  };

  function handleInputChange(value, lineIndex) {
    const list = addList.slice();
    list[lineIndex].newQuantity = value;
    const sum = list.reduce((val, el) => {
      return val + el.newQuantity;
    }, 0);
    setAddList(list);
    setTotalQty(sum);
  }

  // 数量加减
  function handleUpdateDetailsCount(type, lineIndex) {
    const list = addList.slice();
    if (type === 'add') {
      list[lineIndex].newQuantity++;
    } else {
      list[lineIndex].newQuantity--;
      if (list[lineIndex].newQuantity <= 0) {
        list[lineIndex].newQuantity = 0;
      }
    }
    const sum = addList.reduce((val, el) => {
      return val + el.newQuantity;
    }, 0);
    setAddList(list);
    setTotalQty(sum);
  }

  return (
    <div className={style['purchase-execution-content-modal']}>
      <div className={style['content-header']}>
        <div className={style['header-left']}>
          <div>
            <img src={OddNumberImg} alt="" />
            <span>
              {props.itemCode}
              {props.itemName ? ` - ${props.itemName}` : ''}
            </span>
          </div>
          <div>
            <img src={QuantityImg} alt="" />
            <span>
              {props.returnedAwaitQty} {props.uomName}
            </span>
          </div>
        </div>
        <div className={style['header-right']}>
          <TextField
            dataSet={mDS}
            name="queryValue"
            placeholder={`请输入/扫描物料${props.itemControlType === 'TAG' ? '标签' : '批次'}号`}
            suffix={<img src={scanImg} alt="" />}
            onChange={handleInputAdd}
          />
          <Lov
            icon="add"
            dataSet={mDS}
            name={props.itemControlType === 'TAG' ? 'tagObj' : 'lotObj'}
            mode="button"
            onChange={handleQueryTag}
            clearButton={false}
            noCache
          >
            添加
          </Lov>
        </div>
      </div>
      <div className={style['content-sub-header']}>
        <div>
          <Lov
            dataSet={mDS}
            name="warehouseObj"
            placeholder="仓库"
            noCache
            onChange={handleWarehouseChange}
          />
        </div>
        <div>
          <Lov
            dataSet={mDS}
            name="wmAreaObj"
            placeholder="货位"
            noCache
            onChange={handleWmAreaChange}
          />
        </div>
      </div>
      <div className={style['table-list']}>
        <div className={style['table-list-header']}>
          <Col span={3} className={style['table-col']}>
            <CheckBox checked={allChecked} onChange={handleAllCheck} />
          </Col>
          <Col span={7} className={style['table-col']}>
            <div>
              {props.itemControlType === 'TAG' ? '标签' : '批次'}数：
              {`${checkedList.length}/${addList.length}`}
            </div>
          </Col>
          <Col span={7} className={style['table-col']}>
            总数: {totalQty} {props.uomName}
          </Col>
          <Col span={7} className={style['table-col']}>
            仓库-货位
          </Col>
        </div>
        {addList.length
          ? addList.map((v, index) => {
              return (
                <div className={style['table-line']}>
                  <Row>
                    <Col span={3} className={style['table-col']}>
                      <CheckBox checked={v.checked} onChange={() => handleSingleCheck(index)} />
                    </Col>
                    <Col span={7} className={style['table-col']}>
                      {props.itemControlType === 'TAG' ? v.tagCode : v.lotNumber}
                    </Col>
                    <Col span={7} className={style['table-col']}>
                      {props.itemControlType === 'LOT' ? (
                        <div className={style['details-line-input']}>
                          <span
                            className={style['counter-button']}
                            onClick={() => handleUpdateDetailsCount('minus', index)}
                          >
                            -
                          </span>
                          <NumberField
                            value={v.newQuantity || 0}
                            step={0.001}
                            min={0}
                            onChange={(value) => handleInputChange(value, index)}
                          />
                          <span
                            className={style['counter-button']}
                            onClick={() => handleUpdateDetailsCount('add', index)}
                          >
                            +
                          </span>
                        </div>
                      ) : (
                        <span>
                          {v.quantity} {props.uomName}
                        </span>
                      )}
                    </Col>
                    <Col span={7} className={style['table-col']}>
                      <Tooltip
                        title={
                          v.warehouseName || v.wmArea
                            ? `${v.warehouseName || ''} - ${v.wmArea || ''}`
                            : ''
                        }
                      >
                        {v.warehouseName || v.wmArea
                          ? `${v.warehouseName || ''} - ${v.wmArea || ''}`
                          : ''}
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              );
            })
          : null}
      </div>
      <div className={style['modal-footer']}>
        <Button onClick={handleCloseModal}>取消</Button>
        <Button color="primary" onClick={() => props.onConfirm(checkedList, mDS)}>
          确认
        </Button>
      </div>
    </div>
  );
}

export default ReturnModal;
