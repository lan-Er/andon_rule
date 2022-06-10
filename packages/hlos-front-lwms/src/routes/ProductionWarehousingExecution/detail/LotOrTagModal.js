/**
 * @Description: 生产入库执行--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { TextField, CheckBox, Button, NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import uuidv4 from 'uuid/v4';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import styles from './index.less';

const preCode = 'lwms.productionWarehousingExecution';

const LotOrTagModal = ({
  headerData = {},
  modalList = [],
  dispatch,
  disabledFlag = false,
  totalElements,
  onCancel,
  onOk,
  onItemClick,
  onAllCheckClick,
  onSearch,
}) => {
  const [allChecked, changeAllChecked] = useState(false);
  const [totalQty, setTotalQty] = useState(0);

  useEffect(() => {
    changeAllChecked(modalList.length ? modalList.every((i) => i.checked) : false);
    let qty = 0;
    modalList.forEach((i) => {
      if (i.checked) {
        qty += i.receiveQty;
      }
    });
    setTotalQty(qty);
  }, [modalList]);

  function handleNumChange(val, record) {
    if (disabledFlag) return;
    const cloneModalList = [...modalList];
    let idx = -1;
    if (headerData.itemControlType === 'TAG') {
      idx = modalList.findIndex((i) => i.tagCode === record.tagCode);
    } else {
      idx = modalList.findIndex((i) => i.lotNumber === record.lotNumber);
    }
    cloneModalList.splice(idx, 1, {
      ...record,
      receiveQty: val,
      checked: true,
    });
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        modalList: cloneModalList,
      },
    });
  }

  function handleCheckAll(val) {
    changeAllChecked(!allChecked);
    onAllCheckClick(val, modalList);
  }

  function handleInputChange(e) {
    if (e.keyCode === 13) {
      onSearch(e.target.value, headerData);
    }
  }

  return (
    <Fragment>
      <div className={styles.header}>
        <div>
          <Icons type="odd-number" size="32" color="#1C879C" />
          <span>
            {headerData.itemCode}
            {headerData.itemDescription && <span>-{headerData.itemDescription}</span>}
          </span>
        </div>
        <div>
          <Icons type="location" size="32" color="#1C879C" />
          <span>{headerData.warehouseName}</span>
        </div>
        <div>
          <Icons type="quantity" size="32" color="#1C879C" />
          <span>
            {headerData.applyQty} {headerData.uomName}
          </span>
        </div>
        <div>
          <TextField
            placeholder={`请扫描物料${
              headerData.itemControlType === 'LOT' ? '批次' : '标签'
            }号/查找${headerData.itemControlType === 'LOT' ? '批次' : '标签'}`}
            suffix={<Icons type="scan1" size="24" color="#0C6B7E" />}
            disabled={disabledFlag}
            onKeyDown={handleInputChange}
          />
        </div>
      </div>
      <div className={styles.list}>
        <table>
          <thead>
            <tr>
              <th>
                <CheckBox checked={allChecked} disabled={disabledFlag} onChange={handleCheckAll} />
                <span>
                  {headerData.itemControlType === 'LOT' ? '批次' : '标签'}数：
                  {modalList.filter((i) => i.checked).length}/{totalElements}
                </span>
              </th>
              <th>总数：{totalQty}</th>
              <th>生产日期</th>
            </tr>
          </thead>
          <tbody>
            {modalList.map((i) => {
              return (
                <tr
                  className={`${headerData.itemControlType === 'LOT' ? styles['lot-tr'] : ''}`}
                  key={uuidv4()}
                >
                  <td>
                    <CheckBox
                      checked={i.checked}
                      disabled={disabledFlag}
                      onChange={(val) => onItemClick(val, i, headerData.itemControlType, modalList)}
                    />
                    <span className={styles.num}>{i.tagCode || i.lotNumber}</span>
                  </td>
                  <td>
                    {headerData.itemControlType === 'LOT' ? (
                      <div className={styles['lot-input']}>
                        <span
                          className={`${styles.sign} ${styles.left}`}
                          onClick={() =>
                            handleNumChange(i.receiveQty - 1 < 0 ? 0 : i.receiveQty - 1, i)
                          }
                        >
                          -
                        </span>
                        <NumberField
                          min={0}
                          value={i.receiveQty}
                          disabled={disabledFlag}
                          onChange={(val) => handleNumChange(val, i)}
                        />
                        <span
                          className={`${styles.sign} ${styles.right}`}
                          onClick={() => handleNumChange(i.receiveQty + 1, i)}
                        >
                          +
                        </span>
                      </div>
                    ) : (
                      <span>{disabledFlag ? i.reservationQty : i.quantity}</span>
                    )}
                    <span className={styles.uom}>{i.uomName}</span>
                  </td>
                  <td>{i.madeDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button color="primary" onClick={() => onOk(modalList, headerData, totalQty)}>
          {intl.get(`${preCode}.button.sure`).d('确认')}
        </Button>
      </div>
    </Fragment>
  );
};

export default connect(({ productionWarehousingExecution }) => ({
  // lineList: productionWarehousingExecution?.lineList || [],
  modalList: productionWarehousingExecution?.modalList || [],
}))(
  formatterCollections({
    code: ['lwms.productionWarehousingExecutionDetail'],
  })(LotOrTagModal)
);
