/**
 * @Description: MO退料--退料Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-30 10:11:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import uuidv4 from 'uuid/v4';
import { TextField, NumberField, Button } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import Icons from 'components/Icons';
import lotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import styles from './index.less';

const ReturnModal = ({
  idx,
  returnList,
  componentItemCode,
  componentDescription,
  itemControlType,
  onCancel,
  dispatch,
}) => {
  const [itemReturnLineList, setModalList] = useState([]);
  const [totalExecuteQty, setTotalExecuteQty] = useState(0);
  const [currentQty, setCurrentQty] = useState(0);
  const [currentTag, setCurrentTag] = useState(null);

  useEffect(() => {
    if (returnList[idx].itemReturnLineList) {
      let qty = 0;
      returnList[idx].itemReturnLineList.forEach((i) => {
        qty += i.executeQty;
      });
      setModalList(returnList[idx].itemReturnLineList);
      setTotalExecuteQty(qty);
    }
  }, [returnList, idx]);

  const handleShowChange = (rec, type) => {
    const modalIdx = itemReturnLineList.findIndex((i) => i.lotNumber === rec.lotNumber);
    const cloneModalList = itemReturnLineList.map((i, index) => {
      if (type === 'addFlag' && index !== modalIdx) {
        return { ...i, addFlag: false };
      }
      return { ...i, [type]: !rec[type] };
    });
    setModalList(cloneModalList);
  };

  const handleCurrentChange = (val, type, flag) => {
    if (type === 'qty') {
      if (flag) {
        if (currentQty + val < 0) {
          setCurrentQty(0);
        } else {
          setCurrentQty(currentQty + val);
        }
      } else {
        setCurrentQty(val);
      }
    } else if (type === 'tag') {
      setCurrentTag(val);
    }
  };

  const handleLineCancel = (rec) => {
    const cloneModalList = itemReturnLineList.map((i) => {
      if (i.lotNumber === rec.lotNumber) {
        return { ...i, addFlag: false };
      }
      return i;
    });
    setModalList(cloneModalList);
  };

  const handleLineSave = (rec) => {
    const cloneModalList = itemReturnLineList.map((i) => {
      if (i.lotNumber === rec.lotNumber) {
        if (i.tagList.findIndex((t) => t.tagCode === currentTag) > -1) {
          notification.warning({
            message: '标签重复',
          });
          return i;
        }
        const newTagList = i.tagList.concat({
          tagCode: currentTag,
          returnedOkQty: currentQty,
        });
        return {
          ...i,
          totalQty: newTagList.map((n) => n.returnedOkQty).reduce((pre, cur) => pre + cur),
          addFlag: false,
          tagList: newTagList,
        };
      }
      return i;
    });
    setModalList(cloneModalList);
  };

  const handleLineQtyChange = (val, rec, tIdx, flag) => {
    const cloneModalList = [...itemReturnLineList];
    const fIdx = cloneModalList.findIndex((i) => i.lotNumber === rec.lotNumber);
    const qty = cloneModalList[fIdx].tagList[tIdx].returnedOkQty || 0;
    if (flag) {
      cloneModalList[fIdx].tagList[tIdx].returnedOkQty = qty + val < 0 ? 0 : qty + val;
    } else {
      cloneModalList[fIdx].tagList[tIdx].returnedOkQty = val;
    }
    let totalQty = 0;
    cloneModalList[fIdx].tagList.forEach((i) => {
      totalQty += i.returnedOkQty || 0;
    });
    cloneModalList[fIdx].totalQty = totalQty;
    setModalList(cloneModalList);
  };

  const handleLotQtyChange = (val, rec) => {
    const cloneModalList = itemReturnLineList.map((i) => {
      if (i.lotNumber === rec.lotNumber) {
        return { ...i, returnedOkQty: val };
      }
      return i;
    });
    setModalList(cloneModalList);
  };

  const handleSave = () => {
    const cloneReturnList = [...returnList];
    let qty = 0;
    itemReturnLineList.forEach((i) => {
      const _i = i;
      if (itemControlType === 'TAG') {
        i.tagList.forEach((t) => {
          qty += t.returnedOkQty || 0;
        });
      } else if (itemControlType === 'LOT') {
        qty += i.returnedOkQty || 0;
      }
      _i.addFlag = false;
    });
    cloneReturnList.splice(idx, 1, {
      ...returnList[idx],
      returnedOkQty: qty,
      checked: qty > 0,
      itemReturnLineList,
    });
    dispatch({
      type: 'moReturnMaterial/updateState',
      payload: {
        returnList: cloneReturnList,
      },
    });

    onCancel();
  };

  return (
    <Fragment>
      <div className={styles['modal-top']}>
        <div className={styles.item}>
          <Icons type="item" color="#0C6B7E" size="32" />
          <div>
            {componentItemCode}
            {componentDescription && <span>-{componentDescription}</span>}
          </div>
        </div>
        <div className={styles['returned-qty']}>
          已投料: <span>{totalExecuteQty}</span>
        </div>
      </div>
      <div className={styles['modal-center']}>
        {itemReturnLineList.map((i) => {
          if (itemControlType === 'TAG') {
            return (
              <div
                key={i.lotNumber}
                className={`${styles['list-item']} ${
                  i.showFlag ? styles['list-item-show-more'] : null
                }`}
              >
                <div className={styles['item-main']}>
                  <div>
                    <Icon
                      type="baseline-arrow_right"
                      onClick={() => handleShowChange(i, 'showFlag')}
                    />
                    <img src={lotImg} alt="" />
                    <div>{i.lotNumber === 'null' ? '无批次标签' : i.lotNumber}</div>
                  </div>
                  <div>
                    <span>
                      {i.totalQty || 0}/{i.executeQty || 0}
                    </span>
                    <span onClick={() => handleShowChange(i, 'addFlag')}>+</span>
                  </div>
                </div>
                {i.showFlag && (
                  <div className={styles['item-more']}>
                    {i.addFlag && (
                      <div>
                        <div>
                          <TextField
                            placeholder="请输入标签号"
                            value={currentTag}
                            onChange={(val) => handleCurrentChange(val, 'tag')}
                          />
                          <span
                            className={styles['cancel-btn']}
                            onClick={() => handleLineCancel(i)}
                          >
                            {intl.get('hzero.common.button.cancel').d('取消')}
                          </span>
                          <span className={styles['save-btn']} onClick={() => handleLineSave(i)}>
                            {intl.get('hzero.common.button.save').d('保存')}
                          </span>
                        </div>
                        <div className={styles['qty-input']}>
                          <span
                            className={`${styles.change} ${styles.left}`}
                            onClick={() => handleCurrentChange(-1, 'qty', true)}
                          >
                            -
                          </span>
                          <NumberField
                            min={0}
                            value={currentQty}
                            onChange={(val) => handleCurrentChange(val, 'qty')}
                          />
                          <span
                            className={`${styles.change} ${styles.right}`}
                            onClick={() => handleCurrentChange(1, 'qty', true)}
                          >
                            +
                          </span>
                        </div>
                      </div>
                    )}
                    {i.tagList &&
                      i.tagList.map((t, tIdx) => {
                        return (
                          <div key={uuidv4()}>
                            <div>{t.tagCode}</div>
                            <div className={styles['qty-input']}>
                              <span
                                className={`${styles.change} ${styles.left}`}
                                onClick={() => handleLineQtyChange(-1, i, tIdx, true)}
                              >
                                -
                              </span>
                              <NumberField
                                min={0}
                                value={t.returnedOkQty || 0}
                                onChange={(val) => handleLineQtyChange(val, i, tIdx)}
                              />
                              <span
                                className={`${styles.change} ${styles.right}`}
                                onClick={() => handleLineQtyChange(1, i, tIdx, true)}
                              >
                                +
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          }
          return (
            <div className={`${styles['list-item']} ${styles.lot}`}>
              <div className={styles['item-left']}>
                <img src={lotImg} alt="" />
                <span>{i.lotNumber}</span>
              </div>
              <div className={styles['item-center']}>
                <span>本次退料：</span>
                <NumberField
                  min={0}
                  value={i.returnedOkQty || 0}
                  onChange={(val) => handleLotQtyChange(val, i)}
                />
              </div>
              <div className={styles['item-right']}>
                <span>已投料：</span>
                <span>{i.executeQty}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles['modal-bottom']}>
        <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button color="primary" onClick={handleSave}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </div>
    </Fragment>
  );
};

export default connect(({ moReturnMaterial }) => ({
  returnList: moReturnMaterial?.returnList || [],
}))(ReturnModal);
