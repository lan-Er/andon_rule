/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-11-19 19:16:48
 * @LastEditTime: 2021-02-01 11:39:12
 * @Description:退料批次详情
 */
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { TextField, Button, NumberField } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';

import notification from 'utils/notification';
import { getResponse } from 'utils/utils';

import { queryReturnTaskItemDetail } from '@/services/taskService';
import LotIcon from 'hlos-front/lib/assets/icons/lot-icon.svg';
import ShouqiIcon from 'hlos-front/lib/assets/icons/triangle2.svg';
import zhankaiIcon from 'hlos-front/lib/assets/icons/triangle1.svg';
import ItemDescIcon from 'hlos-front/lib/assets/icons/item-icon2.svg';

import styles from '../style.less';

const ReturnMaterialDetailLine = (props) => {
  const { detailObj, index } = props;
  function handleChange(value) {
    props.onChangeLotReturnNumber(index, value);
  }
  return (
    <div className={styles['return-material-detail-line-box']}>
      <Row className={styles['return-material-detail-line']}>
        <Col span={2} className={styles['return-material-line-col']}>
          <div className={styles['return-material-icon']}>
            <img src={LotIcon} alt="" />
          </div>
        </Col>
        <Col span={8} className={styles['return-material-line-col']}>
          {detailObj.lotNumber}
        </Col>
        <Col span={10} className={styles['return-material-line-col']}>
          <div>
            本次退料：
            <NumberField
              className={styles['return-material-input']}
              min={props.min || 0}
              max={detailObj.executeQty || null}
              value={detailObj.returnedOkQty || 0}
              onChange={handleChange}
            />
          </div>
        </Col>
        <Col span={4} className={styles['return-material-line-col']}>
          已投料：<span style={{ color: '#1C879C' }}>{detailObj.executeQty}</span>
        </Col>
      </Row>
    </div>
  );
};

const ReturnMaterialDetailTagLine = (props) => {
  const { detailObj, keyList, lotNumberIndex, changeFlag } = props;
  const [openTagFlag, setOpenTagFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [addTagObj, setAddTagObj] = useState({
    tagCode: null,
    lotNumber: null,
    returnedOkQty: 0,
  });
  const [lotNumberExecuteQty, setLotNumberExecuteQty] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [lotNumber, setLotNumber] = useState(null);
  const [lineTotalNumber, setLineTotalNumber] = useState(0);
  useEffect(() => {
    keyList.map((ele) => {
      if (ele === 'lotNumberExecuteQty') {
        return setLotNumberExecuteQty(detailObj[ele]);
      } else {
        setLotNumber(ele);
        const newList = detailObj[ele].map((el) => ({
          ...el,
          returnedOkQty: el.returnedOkQty || 0,
        }));
        const putLineTotalNumber = newList.reduce((total, el) => {
          return total + el.returnedOkQty;
        }, 0);
        setLineTotalNumber(putLineTotalNumber);
        return setTagList(newList);
      }
    });
  }, [changeFlag]);
  function openTagDetail() {
    setOpenTagFlag(!openTagFlag);
  }
  function handleChangeQuantity(index, value) {
    props.onChangeQuantity(index, value, lotNumberIndex, lotNumber);
  }
  function handleAddTag() {
    setOpenTagFlag(true);
    setAddFlag(true);
  }
  function addTag(value) {
    const newObj = {
      ...addTagObj,
      lotNumber: lotNumber || null,
      tagCode: value,
    };
    setAddTagObj(newObj);
  }
  function changeAddQty(value) {
    const newObj = {
      ...addTagObj,
      returnedOkQty: value,
    };
    setAddTagObj(newObj);
  }
  function saveAddTag() {
    if (!addTagObj.tagCode || !addTagObj.returnedOkQty) {
      notification.warning({
        message: '请输入新增标签号或数量',
      });
      return;
    }
    props.onAddTag(addTagObj, lotNumberIndex, lotNumber);
    setAddFlag(false);
    setAddTagObj({});
  }
  function cancelAddTag() {
    setAddFlag(false);
  }
  return (
    <div
      className={`${styles['return-material-detail-line-box']} ${
        openTagFlag ? styles['return-material-detail-tag-box'] : ''
      }`}
    >
      <Row className={styles['return-material-detail-line']}>
        <Col
          span={1}
          className={`${styles['return-material-line-col']} ${styles['tag-show-icon']}`}
        >
          <div className={styles['return-material-icon']} onClick={openTagDetail}>
            <img src={openTagFlag ? zhankaiIcon : ShouqiIcon} alt="" />
          </div>
        </Col>
        <Col span={9} className={styles['return-material-line-col']}>
          <div>
            <img src={LotIcon} alt="" /> {lotNumber || '无批次标签'}
          </div>
        </Col>
        <Col span={10} className={styles['return-material-line-col']} />
        <Col span={4} className={styles['return-material-line-col']}>
          <span style={{ color: '#1C879C' }}>
            {lineTotalNumber}/{lotNumberExecuteQty}
          </span>
          <span
            style={{ color: '#1C879C', cursor: 'pointer', fontSize: '30px', marginLeft: '15px' }}
            onClick={handleAddTag}
          >
            +
          </span>
        </Col>
        {/* <Col span={1} className="return-material-line-col">

        </Col> */}
      </Row>
      {addFlag && (
        <Row className={styles['tag-line-row']}>
          <Col span={1} />
          <Col span={12} className={styles['material-tag-line']}>
            <TextField
              className={styles['add-tag-code-text']}
              placeholder="请输入标签号"
              onChange={addTag}
            />
            <span className={styles['span-button']} onClick={cancelAddTag}>
              取消
            </span>
            <span
              className={`${styles['span-button']} ${styles['save-button']}`}
              onClick={saveAddTag}
            >
              保存
            </span>
          </Col>
          <Col
            span={11}
            className={`${styles['material-tag-line']} ${styles['material-tag-number-line']}`}
          >
            <div className={styles['common-input']}>
              <NumberField
                step={props.step || 1}
                min={props.min || 0}
                max={addTagObj.executeQty || null}
                value={addTagObj.returnedOkQty || 0}
                onChange={changeAddQty}
              />
              <span className={`${styles.sign} ${styles.left}`}>-</span>
              <span className={`${styles.sign} ${styles.right}`}>+</span>
            </div>
          </Col>
        </Row>
      )}
      {openTagFlag &&
        tagList &&
        tagList.length &&
        tagList.map((ele, index) => (
          <Row className={styles['tag-line-row']}>
            <Col span={1} />
            <Col span={12} className={styles['material-tag-line']}>
              {ele.tagCode}
            </Col>
            <Col
              span={11}
              className={`${styles['material-tag-line']} ${styles['material-tag-number-line']}`}
            >
              <div className={styles['common-input']}>
                <NumberField
                  step={props.step || 1}
                  min={ele.min || 0}
                  max={ele.executeQty || null}
                  value={ele.returnedOkQty || 0}
                  onChange={(value) => handleChangeQuantity(index, value)}
                  disabled
                />
                <span className={`${styles.sign} ${styles.left}`}>-</span>
                <span className={`${styles.sign} ${styles.right}`}>+</span>
              </div>
            </Col>
          </Row>
        ))}
    </div>
  );
};

export default (props) => {
  const { itemInfo, taskId } = props;
  const [itemDetailList, setItemDetailList] = useState([]);
  const [changeFlag, setChangeFlag] = useState(false);
  const [totalExecuteQty, setTotalExecuteQty] = useState(0);
  async function queryReturnTaskItemDetailList() {
    const res = await queryReturnTaskItemDetail({
      taskId,
      itemId: itemInfo.itemId,
      itemControlType: itemInfo.itemControlType,
    });
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    if (getResponse(res) && !res.failed) {
      setTotalExecuteQty(res.totalExecuteQty);
      if (itemInfo.itemControlType === 'TAG') {
        if (res.tagLineList && res.tagLineList.length) {
          setItemDetailList([...res.tagLineList]);
        }
      } else if (itemInfo.itemControlType === 'LOT') {
        if (res.lotLineList && res.lotLineList.length) {
          setItemDetailList([...res.lotLineList]);
        }
      }
    }
  }
  useEffect(() => {
    if (itemInfo.detailList) {
      setItemDetailList([...itemInfo.detailList]);
      setTotalExecuteQty(itemInfo.processOkQty);
    } else {
      queryReturnTaskItemDetailList();
    }
  }, []);

  // 点击保存按钮
  function handleModifyRejectedMaterial() {
    props.onModifyRejectedMaterial(itemInfo, itemDetailList);
  }
  // tag改变数量
  function changeValue(index, value, listIndex, lotNumber) {
    const newList = itemDetailList.slice();
    newList[listIndex][lotNumber][index].returnedOkQty = value;
    setItemDetailList(newList);
    setChangeFlag(!changeFlag);
  }
  // 添加标签
  function onAddTag(value, lotIndex, lotNumberKey) {
    const newList = itemDetailList.slice();
    const addFlag = newList[lotIndex][lotNumberKey].some((ele) => ele.tagCode === value.tagCode);
    if (addFlag) {
      notification.warning({
        message: '该标签已录入，请勿重复录入',
      });
    } else {
      newList[lotIndex][lotNumberKey].unshift(value);
      setItemDetailList(newList);
      setChangeFlag(!changeFlag);
    }
  }
  // 批次的退料数量
  function onChangeLotReturnNumber(index, value) {
    const itemDetailCopyList = itemDetailList.slice();
    itemDetailCopyList[index].returnedOkQty = value;
    setItemDetailList(itemDetailCopyList);
  }

  return (
    <>
      <div className={styles['rejected-material-detail-modal-title']}>
        <div>
          <img src={ItemDescIcon} alt="" /> {itemInfo.itemCode}/ {itemInfo.itemDescription}
        </div>
        <div>
          已投数量：<span style={{ color: '#1C879C' }}>{totalExecuteQty}</span>
        </div>
      </div>
      <div className={styles['rejected-material-detail-modal-content']}>
        {itemInfo.itemControlType === 'TAG' &&
          !isEmpty(itemDetailList) &&
          itemDetailList.map((ele, index) => (
            <ReturnMaterialDetailTagLine
              changeFlag={changeFlag}
              keyList={Object.keys(ele)}
              detailObj={ele}
              onChangeQuantity={changeValue}
              lotNumberIndex={index}
              onAddTag={onAddTag}
            />
          ))}
        {itemInfo.itemControlType === 'LOT' &&
          !isEmpty(itemDetailList) &&
          itemDetailList.map((ele, index) => (
            <ReturnMaterialDetailLine
              detailObj={ele}
              index={index}
              onChangeLotReturnNumber={onChangeLotReturnNumber}
            />
          ))}
      </div>
      <div className={styles['rejected-material-detail-modal-footer']}>
        <Button onClick={props.handleCancel}>取消</Button>
        <Button color="primary" onClick={handleModifyRejectedMaterial}>
          确认
        </Button>
      </div>
    </>
  );
};
