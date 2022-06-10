import React, { useEffect, useState } from 'react';
import { Button, NumberField, DatePicker, TextField, notification, Modal } from 'choerodon-ui/pro';
import { Checkbox } from 'choerodon-ui';
import moment from 'moment';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import { getTag, getLot } from '@/services/shipReturnService';
import styles from './index.less';

const preCode = 'lwms.shipReturnExecute';

const ExecuteModal = ({
  type,
  onModalSave,
  onModalClose,
  shipReturnId,
  shipReturnNum,
  returnLineNum,
  itemId,
  modalList = [],
  qty,
}) => {
  const [list, setList] = useState(modalList || []);
  const [allChecked, changeAllChecked] = useState(false);
  const [showNewLine, setShowNewLine] = useState(false);
  const [lotNumber, setLotNumber] = useState(null);
  const [tagCode, setTagCode] = useState(null);
  const [receivedQty, setQty] = useState(null);
  const [expireDate, setDate] = useState(null);
  const [totalQty, setTotalQty] = useState(0);

  useEffect(() => {
    if (qty) {
      setTotalQty(qty);
    }
    if (modalList) {
      changeAllChecked(modalList.length ? modalList.every((i) => i.checked) : false);
    }
  }, []);

  function handleAllCheck() {
    const _list = list.slice();
    if (allChecked) {
      _list.map((i) => {
        const _i = i;
        _i.checked = false;
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
  }

  function handleItemCheck(data, e) {
    const idx = list.findIndex((i) => i.key === data.key);
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...data,
      checked: e.target.checked,
    });
    setList(_list);
    changeAllChecked(_list.every((i) => i.checked));
  }

  function handleAddLine() {
    setShowNewLine(true);
  }

  function handleDelLine() {
    if (!list.some((i) => i.checked)) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const _list = [];
    list.forEach((i) => {
      if (i.checked) return;
      _list.push(i);
    });
    setList(_list);
  }

  async function handleTextChange(val) {
    if (type === 'TAG') {
      const res = await getTag({
        tagCode: val,
        itemId,
      });
      if (res && res.content && res.content[0]) {
        Modal.confirm({
          key: Modal.key(),
          children: (
            <span>
              {intl
                .get(`${preCode}.view.message.exit.tag`)
                .d('您录入的标签在系统中已存在，是否继续接收？')}
            </span>
          ),
        });
      }
      setTagCode(val);
    } else {
      const res = await getLot({
        lotNumber: val,
        itemId,
      });
      if (res && res.content && res.content[0]) {
        Modal.confirm({
          key: Modal.key(),
          children: (
            <span>
              {intl
                .get(`${preCode}.view.message.exit.lot`)
                .d('您录入的批次在系统中已存在，是否继续接收？')}
            </span>
          ),
        });
      }
      setLotNumber(val);
    }
  }

  function handleNumChange(val) {
    setQty(val);
  }

  function handleDateChange(val) {
    if (val) {
      setDate(val);
    }
  }

  function handleLineSave() {
    const _list = list.slice();
    if (type === 'LOT' && lotNumber && receivedQty) {
      _list.push({
        key: lotNumber,
        lotNumber,
        receivedQty,
        tagCode,
        expireDate: expireDate ? moment(expireDate).format(DEFAULT_DATETIME_FORMAT) : null,
        checked: true,
      });
    } else if (type === 'TAG' && tagCode && receivedQty) {
      _list.push({
        key: tagCode,
        lotNumber,
        receivedQty,
        tagCode,
        expireDate: expireDate ? moment(expireDate).format(DEFAULT_DATETIME_FORMAT) : null,
        checked: true,
      });
    } else {
      return;
    }
    setList(_list);
    setLotNumber(null);
    setTagCode(null);
    setQty(null);
    setDate(null);
    setShowNewLine(false);
    setTotalQty(totalQty + receivedQty);
    changeAllChecked(_list.every((i) => i.checked));
  }

  return (
    <>
      <div className={styles.title}>
        <div className={styles['title-left']}>
          <img src={OrderImg} alt="" />
          <span>
            {shipReturnNum}-{returnLineNum}
          </span>
        </div>
        <div className={styles['title-right']}>
          <Button color="primary" onClick={handleAddLine} disabled={showNewLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button onClick={handleDelLine}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox checked={allChecked} onChange={handleAllCheck} />
              <span>
                {type === 'TAG' ? '标签' : '批次'}（{list.length}）
              </span>
            </th>
            <th>数量（{totalQty}）</th>
            <th>失效日期</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {showNewLine && (
            <tr>
              <td>
                <Checkbox disabled />
                <TextField
                  required
                  value={type === 'TAG' ? tagCode : lotNumber}
                  onChange={handleTextChange}
                />
              </td>
              <td>
                <NumberField
                  required
                  value={receivedQty}
                  min={1}
                  // max 待接收
                  step={1}
                  onChange={handleNumChange}
                />
              </td>
              <td>
                <DatePicker
                  onChange={handleDateChange}
                  value={expireDate}
                  min={moment().add('days', 1)}
                />
              </td>
              <td>
                <span onClick={() => setShowNewLine(false)}>取消</span>
                <span onClick={handleLineSave}>保存</span>
              </td>
            </tr>
          )}
          {list.map((i) => {
            return (
              <tr key={uuidv4()}>
                <td>
                  <Checkbox checked={i.checked || false} onChange={(e) => handleItemCheck(i, e)} />
                  <span>{type === 'TAG' ? i.tagCode : i.lotNumber}</span>
                </td>
                <td> {i.receivedQty} </td>
                <td> {i.expireDate ? moment(i.expireDate).format(DEFAULT_DATE_FORMAT) : null} </td>
                <td />
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles['modal-footer']}>
        <Button onClick={() => onModalClose(list.length !== modalList.length)}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button
          color="primary"
          onClick={() => onModalSave(totalQty, list, returnLineNum, shipReturnId)}
        >
          {intl.get('lwms.common.button.sure').d('确认')}
        </Button>
      </div>
    </>
  );
};

export default ExecuteModal;
