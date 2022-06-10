/*
 * @Description: 投料弹框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-23 11:28:41
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Button, Spin, TextField } from 'choerodon-ui/pro';

import uuidv4 from 'uuid/v4';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import Icons from 'components/Icons';
import { queryIssueItem } from '@/services/taskService';

import DetailsModal from './DetailsModal';
import Line from './Line.js';

import styles from '../style.less';

const FeedingModal = (props) => {
  let feedingDetailsModal = null;
  const { feedingList } = props;

  // const [headerList, setHeaderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assemblyTagCode, setAssemblyTagCode] = useState('');

  useEffect(() => {
    handleQueryIssueItem();
  }, []);

  // 获取投料页面物料信息
  async function handleQueryIssueItem() {
    setLoading(true);
    let resourceClass = null;
    let resourceId = null;
    if (props.typeRef.current === 'workcell') {
      resourceId = props.headerDS.current.get('workcellId');
      resourceClass = 'WKC';
    } else if (props.typeRef.current === 'prodLine') {
      resourceId = props.headerDS.current.get('prodLineId');
      resourceClass = 'PROD_LINE';
    } else if (props.typeRef.current === 'equipment') {
      resourceId = props.headerDS.current.get('equipmentId');
      resourceClass = 'EQUIPMENT';
    } else if (props.typeRef.current === 'workerGroup') {
      resourceId = props.headerDS.current.get('workerGroupId');
      resourceClass = 'WORKER_GROUP';
    }
    const res = await queryIssueItem({
      organizationId: props.orgObj.organizationId,
      taskId: props.taskInfo.taskId,
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
        props.dispatch({
          type: 'taskReport/updateState',
          payload: {
            feedingList: list,
          },
        });
        // setHeaderList(list);
      } else {
        props.dispatch({
          type: 'taskReport/updateState',
          payload: {
            feedingList: [],
          },
        });
        notification.warning({
          message: '暂无符合条件数据',
        });
      }
    }
    setLoading(false);
    return res;
  }

  function handleUpdateCount(type, headerIndex) {
    if (feedingList[headerIndex].supplyType === 'PULL') {
      return;
    }
    const list = feedingList.slice();
    if (type === 'add') {
      // if (list[headerIndex].issuedOkQty >= list[headerIndex].onhandQty) {
      //   return;
      // }
      list[headerIndex].issuedOkQty++;
      if (String(list[headerIndex].issuedOkQt).includes('.')) {
        list[headerIndex].issuedOkQty = Number(list[headerIndex].issuedOkQty.toFixed(6));
      }
    } else if (list[headerIndex].issuedOkQty - 1 < 0) {
      list[headerIndex].issuedOkQty = 0;
    } else {
      list[headerIndex].issuedOkQty--;
      if (String(list[headerIndex].issuedOkQty).includes('.')) {
        list[headerIndex].issuedOkQty = Number(list[headerIndex].issuedOkQty.toFixed(6));
      }
    }
    if (list[headerIndex].issuedOkQty !== 0) {
      list[headerIndex].lineList = [{ issuedOkQty: list[headerIndex].issuedOkQty, checked: true }];
    }
    props.dispatch({
      type: 'taskReport/updateState',
      payload: {
        feedingList: list,
      },
    });
    // setHeaderList(list);
  }

  // 数量更改
  function handleInput(value, headerIndex) {
    const list = feedingList.slice();
    // if (value > list[headerIndex].onhandQty) {
    //   list[headerIndex].issuedOkQty = 0;
    // } else {
    //   list[headerIndex].issuedOkQty = value;
    // }
    let val = value;
    if (String(value).includes('.')) {
      val = value.toFixed(6);
    }
    list[headerIndex].issuedOkQty = val;
    if (list[headerIndex].issuedOkQty !== 0) {
      list[headerIndex].lineList = [{ issuedOkQty: val, checked: true }];
    } else {
      delete list[headerIndex].lineList;
    }
    // setHeaderList(list);
    props.dispatch({
      type: 'taskReport/updateState',
      payload: {
        feedingList: list,
      },
    });
  }

  // 打开详情弹框
  function handleDetailsModal(record, headerIndex) {
    if (record.itemControlType === 'QUANTITY' || record.supplyType === 'PULL') {
      return;
    }
    feedingDetailsModal = Modal.open({
      key: 'feeding-details',
      title: record.itemControlType === 'TAG' ? '标签投料' : '批次投料',
      className: styles['lmes-task-report-feeding-details-modal'],
      movable: true,
      closable: true,
      okText: '保存',
      children: (
        <DetailsModal headerInfo={record} orgObj={props.orgObj} queryLineList={queryLineList} />
      ),
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
    const hList = feedingList.slice();
    const list = JSON.parse(window.localStorage.getItem('lineList'));
    let total = 0;
    const checkedArr = list.filter((v) => v.checked && v.issuedOkQty !== 0);
    checkedArr.forEach((ele) => {
      total += ele.issuedOkQty;
    });
    hList[headerIndex].lineList = list;
    hList[headerIndex].issuedOkQty = total;
    // setHeaderList(hList);
    props.dispatch({
      type: 'taskReport/updateState',
      payload: {
        feedingList: hList,
      },
    });
  }

  async function handleFeedingConfirm() {
    setSubmitLoading(true);
    await props.handleFeedingConfirm(feedingList, assemblyTagCode);
    setSubmitLoading(false);
  }

  function handleCodeChange(val) {
    setAssemblyTagCode(val);
  }

  function handleAuto() {
    let list = feedingList.slice();

    list = list.map((v) => {
      if (v.itemControlType === 'QUANTITY' && !v.auto) {
        // const curQty = (v.taskQty - (v.processOkQty || 0)) >= v.onhandQty ? v.onhandQty : (v.taskQty - (v.processOkQty || 0));
        const curQty = v.taskQty - (v.processOkQty || 0);
        return {
          ...v,
          issuedOkQty: curQty,
          lineList: [{ issuedOkQty: curQty, checked: true }],
          auto: true,
        };
      } else if (v.auto) {
        return {
          ...v,
          issuedOkQty: 0,
          auto: false,
        };
      }
      return { ...v };
    });

    props.dispatch({
      type: 'taskReport/updateState',
      payload: {
        feedingList: list,
      },
    });
  }

  return (
    <>
      <div className={styles['feeding-modal-content']}>
        <Spin spinning={loading}>
          {feedingList.length
            ? feedingList.map((v, i) => {
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
      <div className={styles['feeding-modal-footer']}>
        <TextField
          value={assemblyTagCode}
          placeholder="请输入或扫描装配标签"
          suffix={<Icons type="scan" size="22" color="#1c879c" />}
          onChange={handleCodeChange}
        />
        <div>
          <Button onClick={handleAuto}>一键填充</Button>
          <Button onClick={props.handleCancel}>取消</Button>
          <Button loading={submitLoading} color="primary" onClick={handleFeedingConfirm}>
            确认投料
          </Button>
        </div>
      </div>
    </>
  );
};

export default connect(({ taskReport }) => ({
  feedingList: taskReport?.feedingList || [],
}))(FeedingModal);
