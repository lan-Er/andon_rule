/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-11-19 16:03:07
 * @LastEditTime: 2021-03-06 15:31:48
 * @Description:任务报工-退料
 */

import React, { useEffect, useState } from 'react';
import { Lov, Modal, Button, DataSet, NumberField, Tooltip } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';

import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';

import { queryReturnTaskItem, returnTaskInput } from '@/services/taskService';
import { TaskReturnDS } from '@/stores/taskReportDS';
import RecLot from 'hlos-front/lib/assets/icons/rec-lot.svg';
import RecTag from 'hlos-front/lib/assets/icons/rec-tag.svg';
import RecQuantity from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import warehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import wmAreaIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import RejectedMaterialDetailModal from './RejectedMaterialDetailModal';

import styles from '../style.less';

const TaskReturnDs = new DataSet(TaskReturnDS());
const modalDetailKey = Modal.key();
const ReturnMaterialLine = (props) => {
  const { itemInfo, taskId, index } = props;
  let _rejectedMaterialDetailModal = null;
  function handleCancel() {
    _rejectedMaterialDetailModal.close();
  }
  function onModifyRejectedMaterial(item, detailList) {
    props.changeRejectedMaterial(item, detailList);
    _rejectedMaterialDetailModal.close();
  }
  function onOpenDetail() {
    _rejectedMaterialDetailModal = Modal.open({
      key: modalDetailKey,
      title: '任务退料',
      className: styles['lmes-task-report-rejected-material-detail-modal'],
      footer: null,
      closable: true,
      destroyOnClose: true,
      style: {
        width: '80%',
      },
      children: (
        <RejectedMaterialDetailModal
          taskId={taskId}
          itemInfo={itemInfo}
          handleCancel={handleCancel}
          onModifyRejectedMaterial={onModifyRejectedMaterial}
        />
      ),
    });
  }

  function showPic() {
    if (itemInfo.itemControlType === 'TAG') {
      return RecTag;
    } else if (itemInfo.itemControlType === 'LOT') {
      return RecLot;
    } else {
      return RecQuantity;
    }
  }

  // 改变数量的退料

  function handleQuantity(value) {
    props.handleQuantityValue(index, value);
  }

  return (
    <Row className={styles['return-material-line']}>
      <Col
        span={2}
        className={styles['return-material-line-col']}
        onClick={itemInfo.itemControlType !== 'QUANTITY' ? onOpenDetail : ''}
      >
        <div className={styles['return-material-icon']}>
          <img src={showPic()} alt="" />
        </div>
      </Col>
      <Col
        span={8}
        className={styles['return-material-line-col']}
        onClick={itemInfo.itemControlType !== 'QUANTITY' ? onOpenDetail : ''}
      >
        <div className={styles['line-material-name']}>
          <Tooltip title={itemInfo.itemDescription}>{itemInfo.itemDescription}</Tooltip>
          <Tooltip title={itemInfo.itemCode}>{itemInfo.itemCode}</Tooltip>
        </div>
      </Col>
      <Col span={10} className={styles['return-material-line-col']}>
        <div>
          本次退料：
          <NumberField
            disabled={itemInfo.itemControlType !== 'QUANTITY'}
            className={styles['return-material-input']}
            min={props.min || 0}
            max={itemInfo.processOkQty || null}
            value={itemInfo.toltalReturnQty || 0}
            onChange={handleQuantity}
          />
        </div>
      </Col>
      <Col span={4} className={styles['return-material-line-col']}>
        已投料：<span style={{ color: '#1C879C' }}>{itemInfo.processOkQty || 0}</span>
      </Col>
    </Row>
  );
};

export default (props) => {
  const {
    docObj,
    worker,
    workcell,
    workerGroup,
    equipmentObj,
    prodLine,
    remark,
    calendarDay,
    calendarShiftCode,
  } = props;
  const [itemList, setItemList] = useState([]);
  async function handleRejectedMaterial() {
    if (!TaskReturnDs.current.get('warehouseId')) {
      notification.warning({
        message: '请先选择退料的仓库',
      });
      return;
    }
    if(itemList.every(i => !i.toltalReturnQty)) {
      notification.warning({
        message: '请录入退料数量',
      });
      return;
    }
    const taskItemList = itemList.map((ele) => {
      if (ele.itemControlType === 'TAG') {
        if (ele.detailList) {
          const taskItemLineList = [];
          ele.detailList.map((el) => {
            const keyList = Object.keys(el);
            const finfIndex = keyList.findIndex((item) => item === 'lotNumberExecuteQty');
            keyList.splice(finfIndex, 1);
            const keyString = keyList.join();
            return taskItemLineList.push(...el[keyString]);
          });
          return {
            ...ele,
            warehouseId: TaskReturnDs.current.get('warehouseId'),
            warehouseCode: TaskReturnDs.current.get('warehouseCode'),
            wmAreaId: TaskReturnDs.current.get('wmAreaId'),
            wmAreaCode: TaskReturnDs.current.get('wmAreaCode'),
            taskItemLineList: handleTaskItemLineList(taskItemLineList),
          };
        } else {
          return {
            ...ele,
            warehouseId: TaskReturnDs.current.get('warehouseId'),
            warehouseCode: TaskReturnDs.current.get('warehouseCode'),
            wmAreaId: TaskReturnDs.current.get('wmAreaId'),
            wmAreaCode: TaskReturnDs.current.get('wmAreaCode'),
            taskItemLineList: [],
          };
        }
      } else if (ele.itemControlType === 'LOT') {
        return {
          ...ele,
          warehouseId: TaskReturnDs.current.get('warehouseId'),
          warehouseCode: TaskReturnDs.current.get('warehouseCode'),
          wmAreaId: TaskReturnDs.current.get('wmAreaId'),
          wmAreaCode: TaskReturnDs.current.get('wmAreaCode'),
          taskItemLineList: handleTaskItemLineList(ele.detailList),
        };
      } else if (ele.itemControlType === 'QUANTITY') {
        return {
          ...ele,
          warehouseId: TaskReturnDs.current.get('warehouseId'),
          warehouseCode: TaskReturnDs.current.get('warehouseCode'),
          wmAreaId: TaskReturnDs.current.get('wmAreaId'),
          wmAreaCode: TaskReturnDs.current.get('wmAreaCode'),
          taskItemLineList: handleTaskItemLineList(ele.detailList),
        };
      }
      return ele;
    });
    const newTaskItemList = taskItemList.map((el) => {
      return { ...el, detailList: null };
    });
    const submitItemList = newTaskItemList.filter((i) => !isEmpty(i.taskItemLineList));

    const submitParams = {
      ...docObj, // task
      returnedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      ...worker,
      ...workcell,
      ...workerGroup,
      ...equipmentObj,
      ...equipmentObj,
      ...prodLine,
      worker: worker.workerCode,
      taskItemList: submitItemList,
      remark,
      calendarDay: moment(calendarDay).format(DEFAULT_DATE_FORMAT),
      calendarShiftCode,
    };
    const res = await returnTaskInput(submitParams);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    }
    if (res && getResponse(res) && !res.failed) {
      notification.success({
        message: '提交成功',
      });
      props.handleCancel();
    }
  }
  async function queryReturnTaskItemList() {
    const res = await queryReturnTaskItem({
      taskId: docObj.taskId,
    });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    if (res && getResponse(res) && !res.failed) {
      const showlist = res.map((ele) => ({
        ...ele,
        toltalReturnQty: 0,
      }));
      setItemList([...showlist]);
    }
  }
  // 汇总数量
  function changeRejectedMaterial(modifyItem, detailList) {
    const changAfterList = itemList.slice();
    const fundIndex = changAfterList.findIndex((ele) => ele.itemId === modifyItem.itemId);
    let toltalReturnQty = 0;
    // 标签汇总数量
    if (modifyItem.itemControlType === 'TAG') {
      const taskItemLineList = [];
      detailList.map((el) => {
        const keyList = Object.keys(el);
        const finfIndex = keyList.findIndex((item) => item === 'lotNumberExecuteQty');
        keyList.splice(finfIndex, 1);
        const keyString = keyList.join();
        return taskItemLineList.push(...el[keyString]);
      });
      const haveQtyList = taskItemLineList.filter((el) => el.returnedOkQty);
      haveQtyList.map((el) => {
        toltalReturnQty += el.returnedOkQty;
        return toltalReturnQty;
      });
    } else if (modifyItem.itemControlType === 'LOT') {
      // 批次汇总数量
      const haveQtyList = detailList.filter((el) => el.returnedOkQty);
      haveQtyList.map((el) => {
        toltalReturnQty += el.returnedOkQty;
        return toltalReturnQty;
      });
    }
    changAfterList[fundIndex].detailList = detailList;
    changAfterList[fundIndex].toltalReturnQty = toltalReturnQty;
    setItemList(changAfterList);
  }

  // 筛选掉退料数量为null 或者 不大于 0 的值
  function handleTaskItemLineList(list = []) {
    let lineList = [];
    if (list.length > 0) {
      lineList = list.filter((el) => el.returnedOkQty);
    }
    return lineList;
  }

  // 物料的管控类型是数量时改变数量

  function handleQuantity(index, value) {
    const itemCopyList = itemList.slice();
    itemCopyList[index].toltalReturnQty = value;
    itemCopyList[index].detailList = [{ returnedOkQty: value }];
    setItemList(itemCopyList);
  }

  useEffect(() => {
    TaskReturnDs.create({
      organizationId: docObj?.organizationId,
    });
    queryReturnTaskItemList();
  }, []);

  return (
    <>
      <div className={styles['rejected-material-modals-header']}>
        <div className={styles['lov-suffix']}>
          <img className={styles['left-icon']} src={warehouseIcon} alt="" />
          <Lov
            dataSet={TaskReturnDs}
            name="warehouseObj"
            className={styles['sub-input']}
            placeholder="请选择仓库"
            noCache
          />
        </div>
        <div className={styles['lov-suffix']}>
          <img className={styles['left-icon']} src={wmAreaIcon} alt="" />
          <Lov
            dataSet={TaskReturnDs}
            name="wmAreaObj"
            className={styles['sub-input']}
            placeholder="请选择货位"
            noCache
          />
        </div>
      </div>
      <div className={styles['rejected-material-modals-content']}>
        {itemList &&
          itemList.length &&
          itemList.map((ele, index) => (
            <ReturnMaterialLine
              taskId={docObj.taskId}
              index={index}
              itemInfo={ele}
              changeRejectedMaterial={changeRejectedMaterial}
              handleQuantityValue={handleQuantity}
            />
          ))}
      </div>
      <div className={styles['rejected-material-modals-footer']}>
        <Button onClick={props.handleCancel}>取消</Button>
        <Button color="primary" onClick={handleRejectedMaterial}>
          确认
        </Button>
      </div>
    </>
  );
};
