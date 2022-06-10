import React, { useState, useEffect, createRef } from 'react';
import { TextField } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import moment from 'moment';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import styles from '../index.less';
import { issueTask, expandTagNew } from '@/services/onePieceFlowReportService';

const querySnNumRef = createRef();
const queryFeedNumRef = createRef();

export default ({ userSetting, workerObj, taskItemsObj, workcellObj }) => {
  const [querySnNum, setQuerySnNum] = useState(null);
  const [queryFeedNum, setQueryFeedNum] = useState(null);

  useEffect(() => {
    setQuerySnNum(null);
    setQueryFeedNum(null);
    setTimeout(() => {
      querySnNumRef.current.focus();
    }, 0);
  }, []);

  function changeSnNum(value) {
    setQuerySnNum(value);
  }

  async function commitSnNum(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        return;
      }
      queryFeedNumRef.current.focus();
    }
  }

  function changeFeedNum(value) {
    setQueryFeedNum(value);
  }

  async function commitFeedNum(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        return;
      }
      const tagRes = await expandTagNew({
        tagCode: e.target.value,
        taskId: taskItemsObj.taskId,
      });
      if (tagRes && Object.keys(tagRes).indexOf('failed') !== -1 && tagRes.failed) {
        notification.error({
          message: tagRes.message,
          duration: 5,
        });
      } else {
        if (!tagRes) {
          return;
        }
        if (!tagRes.itemId) {
          notification.error({
            message: '该任务下未查询到投料码信息，请重新扫描输入！',
            duration: 5,
          });
          return;
        }
        const { tagId, tagCode } = { tagId: null, tagCode: null };
        const params = {
          organizationId: userSetting.organizationId,
          organizationCode: userSetting.organizationCode,
          taskId: taskItemsObj.taskId,
          taskNum: taskItemsObj.taskNum,
          workerId: workerObj.workerId,
          worker: workerObj.workerCode,
          prodLineId: null,
          prodLineCode: null,
          workcellId: workcellObj.workcellId,
          workcellCode: workcellObj.workcellCode,
          calendarDay: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          calendarShiftCode: 'MORNING SHIFT',
          assemblyTagId: tagId,
          assemblyTagCode: tagCode || querySnNum,
          issuedTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          issueTaskItemList: [
            {
              itemId: tagRes.itemId,
              itemCode: tagRes.itemCode,
              uomId: tagRes.uomId,
              uom: tagRes.uom,
              taskItemLineId: tagRes.taskItemLineId,
              itemControlType: tagRes.itemControlType,
              warehouseId: workcellObj.issueWarehouseId,
              warehouseCode: workcellObj.issueWarehouseCode,
              wmAreaId: workcellObj.issueWmAreaId,
              wmAreaCode: workcellObj.issueWmAreaCode,
              lineList: tagRes.lineList,
              // [
              //   {
              //     issuedOkQty: tagObj.quantity,
              //     lotId: tagObj.lotId,
              //     lotNumber: tagObj.lotNumber,
              //     tagCode: tagObj.tagCode,
              //     tagId: tagObj.tagId,
              //   },
              // ],
            },
          ],
        };
        const res = await issueTask(params);
        if (res && res.failed) {
          notification.error({
            message: res.message,
            duration: 5,
          });
        } else {
          setQueryFeedNum(null);
          notification.success({
            message: '提交成功',
          });

          queryFeedNumRef.current.focus();
        }
      }
    }
  }

  return (
    <div className={styles['jiachen-opfr-exception-modal']}>
      <div style={{ width: '45%' }}>
        <TextField
          ref={querySnNumRef}
          placeholder="请扫描或输入SN号"
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          value={querySnNum}
          onChange={changeSnNum}
          onKeyDown={commitSnNum}
        />
      </div>
      <div style={{ width: '45%' }}>
        <TextField
          ref={queryFeedNumRef}
          placeholder="请扫描或输入投料码"
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          value={queryFeedNum}
          onChange={changeFeedNum}
          onKeyDown={commitFeedNum}
        />
      </div>
    </div>
  );
};
