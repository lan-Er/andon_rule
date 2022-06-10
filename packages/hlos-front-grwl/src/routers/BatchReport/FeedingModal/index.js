/*
 * @Description: 投料弹框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-19 09:58:01
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Button, Spin } from 'choerodon-ui/pro';

import uuidv4 from 'uuid/v4';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { queryIssueItem } from '@/services/taskService';

import DetailModal from './DetailModal';
import Line from './Line.js';

import styles from '../style.less';

const FeedingModal = ({
  dispatch,
  loginLovType,
  loginDS,
  orgObj,
  taskInfo,
  feedingList,
  onCancel,
  onFeedingOk,
}) => {
  let feedingDetailsModal = null;

  const [headerList, setHeaderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    handleQueryIssueItem();
  }, []);

  // 获取投料页面物料信息
  async function handleQueryIssueItem() {
    setLoading(true);
    let resourceClass = null;
    let resourceId = null;
    if (loginLovType === 'workcell') {
      resourceId = loginDS.current.get('workcellId');
      resourceClass = 'WKC';
    } else if (loginLovType === 'prodline') {
      resourceId = loginDS.current.get('prodLineId');
      resourceClass = 'PROD_LINE';
    } else if (loginLovType === 'equipment') {
      resourceId = loginDS.current.get('equipmentId');
      resourceClass = 'EQUIPMENT';
    } else if (loginLovType === 'workergroup') {
      resourceId = loginDS.current.get('workerGroupId');
      resourceClass = 'WORKER_GROUP';
    }
    const res = await queryIssueItem({
      organizationId: orgObj.organizationId,
      taskId: taskInfo.taskId,
      resourceClass,
      resourceId,
    });
    if (getResponse(res)) {
      if (Object.keys(res).length) {
        let array = [];
        for (const key in res) {
          if (key) {
            array = [...array, ...res[key]];
          }
        }
        const list = array.length && array.map((v) => ({ ...v, issuedOkQty: 0 }));
        setHeaderList(list);
      } else {
        notification.warning({
          message: '暂无符合条件数据',
        });
      }
    }
    setLoading(false);
    return res;
  }

  function handleUpdateCount(type, headerIndex) {
    if (headerList[headerIndex].supplyType === 'PULL') {
      return;
    }
    const list = headerList.slice();
    if (type === 'add') {
      if (list[headerIndex].issuedOkQty >= list[headerIndex].onhandQty) {
        return;
      }
      list[headerIndex].issuedOkQty++;
    } else {
      if (list[headerIndex].issuedOkQty <= 0) {
        return;
      }
      list[headerIndex].issuedOkQty--;
    }
    if (list[headerIndex].issuedOkQty !== 0) {
      list[headerIndex].lineList = [{ issuedOkQty: list[headerIndex].issuedOkQty, checked: true }];
    }
    dispatch({
      type: 'batchReport/updateState',
      payload: {
        feedingList: list,
      },
    });
  }

  // 数量更改
  function handleInput(value, headerIndex) {
    const list = headerList.slice();
    if (value > list[headerIndex].onhandQty) {
      list[headerIndex].issuedOkQty = 0;
    } else {
      list[headerIndex].issuedOkQty = value;
    }
    if (list[headerIndex].issuedOkQty !== 0) {
      list[headerIndex].lineList = [{ issuedOkQty: value, checked: true }];
    } else {
      delete list[headerIndex].lineList;
    }
    dispatch({
      type: 'batchReport/updateState',
      payload: {
        feedingList: list,
      },
    });
  }

  // 打开详情弹框
  function handleDetailsModal(record, headerIndex) {
    if (record.itemControlType === 'QUANTITY') {
      return;
    }
    feedingDetailsModal = Modal.open({
      key: 'feeding-details',
      title: record.itemControlType === 'TAG' ? '标签投料' : '批次投料',
      className: styles['lmes-batch-report-feeding-detail-modal'],
      movable: true,
      closable: true,
      okText: '保存',
      children: <DetailModal headerInfo={record} orgObj={orgObj} queryLineList={queryLineList} />,
      onOk: () => handleDetailsSave(headerIndex),
      onCancel: handleDetailsCancel,
    });
  }

  // 取消
  function handleDetailsCancel() {
    feedingDetailsModal.close();
  }

  function queryLineList(list) {
    window.localStorage.setItem('lineList', JSON.stringify(list));
  }

  function handleDetailsSave(headerIndex) {
    const hList = headerList.slice();
    const list = JSON.parse(window.localStorage.getItem('lineList'));
    let total = 0;
    const checkedArr = list.filter((v) => v.checked && v.issuedOkQty !== 0);
    checkedArr.forEach((ele) => {
      total += ele.issuedOkQty;
    });
    hList[headerIndex].lineList = list;
    hList[headerIndex].issuedOkQty = total;
    dispatch({
      type: 'batchReport/updateState',
      payload: {
        feedingList: hList,
      },
    });
  }

  async function handleFeedingConfirm() {
    setSubmitLoading(true);
    await onFeedingOk(feedingList);
    setSubmitLoading(false);
  }

  return (
    <>
      <div className={styles['feeding-modal-content']}>
        <Spin spinning={loading}>
          {headerList.length
            ? headerList.map((v, i) => {
                return (
                  <Line
                    key={uuidv4()}
                    {...v}
                    itemControlType={v.itemControlType}
                    handleDetailsModal={() => handleDetailsModal(v, i)}
                    handleUpdateCount={(type) => handleUpdateCount(type, i)}
                    handleInput={(value) => handleInput(value, i)}
                  />
                );
              })
            : null}
        </Spin>
      </div>
      {headerList.length ? (
        <div className={styles['feeding-modal-footer']}>
          <Button onClick={onCancel}>取消</Button>
          <Button loading={submitLoading} color="primary" onClick={handleFeedingConfirm}>
            确认投料
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default connect(({ batchReport }) => ({
  feedingList: batchReport?.feedingList || [],
}))(FeedingModal);
