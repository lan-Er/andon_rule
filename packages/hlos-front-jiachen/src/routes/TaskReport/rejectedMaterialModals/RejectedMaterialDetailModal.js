/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-11-19 19:16:48
 * @LastEditTime: 2021-03-10 16:50:57
 * @Description:退料批次详情
 */
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Button, NumberField } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';

import notification from 'utils/notification';
import { getResponse } from 'utils/utils';

import { queryReturnTaskItemDetailV2 } from '@/services/taskService';
import LotIcon from 'hlos-front/lib/assets/icons/lot-icon.svg';
import ItemDescIcon from 'hlos-front/lib/assets/icons/item-icon2.svg';
import ReturnMaterialDetailTagLine from './returnMaterialDetailTagLine';
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

export default (props) => {
  const { itemInfo, taskId } = props;
  const [itemDetailList, setItemDetailList] = useState([]);
  const [changeFlag, setChangeFlag] = useState(false);
  const [totalExecuteQty, setTotalExecuteQty] = useState(0);
  async function queryReturnTaskItemDetailList() {
    const res = await queryReturnTaskItemDetailV2({
      taskId,
      itemId: itemInfo.itemId,
      itemControlType: itemInfo.itemControlType,
      taskItemLineId: itemInfo.taskItemLineId,
    });
    if (!res || res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    if (getResponse(res) && !res.failed) {
      // setTotalExecuteQty(res.totalExecuteQty);
      if (itemInfo.itemControlType === 'TAG') {
        const tagLineList = [];
        if (Object.keys(res) && Object.keys(res).length) {
          let sumNum = 0;
          Object.keys(res).forEach((tag) => {
            res[tag].forEach((item) => {
              sumNum += item.executeQty;
            });
            setTotalExecuteQty(sumNum);
          });

          Object.keys(res).forEach((tag) => {
            let lotNumberExecuteQty = 0;
            res[tag].forEach((item) => {
              lotNumberExecuteQty += item.executeQty;
            });
            const param = {
              lotNumberExecuteQty,
            };
            param[tag] = res[tag];
            tagLineList.push(param);
          });
        }
        setItemDetailList([...tagLineList]);
      } else if (itemInfo.itemControlType === 'LOT') {
        let sumNum = 0;
        Object.keys(res).forEach((tag) => {
          res[tag].forEach((item) => {
            sumNum += item.executeQty;
          });
          setTotalExecuteQty(sumNum);
        });
        const tagLineList = [];
        if (Object.keys(res) && Object.keys(res).length) {
          Object.keys(res).forEach((lot) => {
            const param = {};
            param[lot] = res[lot];
            param.lotId = res[lot][0].lotId;
            param.lotNumber = res[lot][0].lotNumber;
            param.executeQty = (res[lot] && res[lot][0].executeQty) || 0;
            tagLineList.push(param);
          });
        }
        setItemDetailList([...tagLineList]);
      }
    }

    // 老接口逻辑
    //   setTotalExecuteQty(res.totalExecuteQty);
    //   if (itemInfo.itemControlType === 'TAG') {
    //     if (res.tagLineList && res.tagLineList.length) {
    //       setItemDetailList([...res.tagLineList]);
    //     }
    //   } else if (itemInfo.itemControlType === 'LOT') {
    //     if (res.lotLineList && res.lotLineList.length) {
    //       setItemDetailList([...res.lotLineList]);
    //     }
    //   }
    // }
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
  // 删除标签
  function onDelTag(lineIndex, lotIndex, lotNumberKey) {
    const newList = itemDetailList.slice();
    newList[lotIndex][lotNumberKey].splice(lineIndex, 1);
    setItemDetailList(newList);
    setChangeFlag(!changeFlag);
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
              onDelTag={onDelTag}
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
