/**
 * @Description: 单件流报工--报检弹窗
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-05-26 14:27:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState, createRef, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Lov, TextField, Button, CheckBox, NumberField, DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import Icons from 'components/Icons';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { InspectQueryDS } from '@/stores/onePieceFlowReportDS';
import { getExecuteLot, createTaskQcDoc } from '@/services/onePieceFlowReportService';
import styles from '../index.less';

const preCode = 'lmes.onePieceFlowReport.model';
const tagRef = createRef();

export default ({ organizationId, leftData, loginData, onInspectionModalClose }) => {
  const ds = useMemo(() => new DataSet(InspectQueryDS()), []);

  const [inspectList, setInspectList] = useState([]);
  // const [firstQueryFlag, setFirstQueryFlag] = useState(true);
  const [preTagOrLot, setPreTagOrLot] = useState(null);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    if (organizationId) {
      ds.current.set('organizationId', organizationId);
    }
  }, [organizationId]);

  useEffect(() => {
    if (!isEmpty(leftData)) {
      let curDocId = leftData.documentId;
      let curDocNum = leftData.moNum;
      let curOperationId = leftData.operationId;
      let curOperation = leftData.operation;
      if (leftData.wip && !isEmpty(leftData.wip)) {
        curDocId = leftData.wip.moId;
        curDocNum = leftData.wip.moNum;
        curOperationId = leftData.wip.operationId;
        curOperation = leftData.wip.operation;
      }
      ds.current.set('moObj', {
        documentId: curDocId,
        documentNum: curDocNum,
      });
      ds.getField('moObj').set('disabled', true);
      ds.getField('moObj').set('required', false);
      ds.current.set('moOperationObj', {
        operationId: curOperationId,
        operationName: curOperation,
      });
      ds.getField('moOperationObj').set('disabled', true);
      ds.getField('moOperationObj').set('required', false);
      queryInspectList({ moId: curDocId, operationId: curOperationId });
    }
  }, [leftData]);

  async function queryInspectList(params) {
    const { moId, operationId, tagCode, lotNumber } = params;
    const res = await getExecuteLot({
      moId,
      operationId,
      executeType: 'PENDING_QTY',
      tagCode,
      lotNumber,
      unInspectTag: 1,
    });
    if (getResponse(res) && Array.isArray(res)) {
      setPreTagOrLot(tagCode || lotNumber);
      const newRes = [...inspectList];
      if (res.length) {
        res.forEach((i) => {
          i.batchQty = i.pendingQty;
          const idx = newRes.findIndex((j) => i.executeLotId === j.executeLotId);
          if (idx < 0) {
            newRes.push(i);
          }
        });
      }
      if (preTagOrLot) {
        setInspectList(newRes);
      } else {
        setInspectList(res);
      }
    }
  }

  function handleItemCheck(val, idx) {
    const cloneList = [...inspectList];
    cloneList[idx].checked = val;
    setInspectList(cloneList);
    setAllChecked(cloneList.every((i) => i.checked));
  }

  function handleCheckAll(val) {
    if (!inspectList.length) return;
    setAllChecked(val);
    const cloneList = [...inspectList];
    cloneList.forEach((i) => {
      i.checked = val;
    });
    setInspectList(cloneList);
  }

  function handleQueryChange(rec) {
    setInspectList([]);
    setAllChecked(false);
    if (rec) {
      const { moId, moOperationId, tagCode, lotNumber } = ds.current.toJSONData();
      if (moId && moOperationId) {
        queryInspectList({
          moId,
          operationId: moOperationId,
          tagCode,
          lotNumber,
        });
      }
    }
  }

  async function handleKeyDown(e) {
    if (e.keyCode === 13) {
      const validateValue = await ds.validate(false, false);
      if (!validateValue) return;
      const { moId, moOperationId, tagCode, lotNumber } = ds.current.toJSONData();
      // const flag = tagCode || lotNumber;
      // setFirstQueryFlag(false);
      queryInspectList({
        moId,
        operationId: moOperationId,
        tagCode,
        lotNumber,
      });
      tagRef.current.focus();
    }
  }

  function handleQtyChange(val, idx) {
    const cloneList = [...inspectList];
    cloneList[idx].batchQty = val;
    setInspectList(cloneList);
  }

  function handleReset() {
    setInspectList([]);
    ds.current.set('tagCode', null);
    ds.current.set('lotNumber', null);
    const { moId, moOperationId, tagCode, lotNumber } = ds.current.toJSONData();
    queryInspectList({
      moId,
      operationId: moOperationId,
      tagCode,
      lotNumber,
    });
  }

  function handleAllInspect() {
    handleCheckAll(true);
    handleInspect();
  }

  async function handleInspect() {
    const checkList = inspectList.filter((i) => i.checked);
    const paramsList = [];
    checkList.forEach((i) => {
      const idx = paramsList.findIndex((v) => v.taskId === i.taskId);
      if (idx > -1) {
        paramsList[idx].taskQcDocLineDtoList.push({
          tagId: i.tagId,
          tagCode: i.tagCode,
          lotId: i.lotId,
          lotNumber: i.lotNumber,
          batchQty: i.batchQty,
        });
      } else {
        paramsList.push({
          taskId: i.taskId,
          itemId: i.itemId,
          itemControlType: 'TAG',
          declarerId: loginData?.workerId,
          declarer: loginData?.worker,
          workerId: loginData?.workerId,
          worker: loginData?.worker,
          prodLineId: loginData?.prodLineId,
          prodLineCode: loginData?.prodLineCode,
          workcellId: loginData?.workcellId,
          calendarDay: loginData?.calendarDay,
          calendarShiftCode: loginData?.calendarShiftCode,
          declaredDate: moment().format(DEFAULT_DATETIME_FORMAT),
          taskQcDocLineDtoList: [
            {
              tagId: i.tagId,
              tagCode: i.tagCode,
              lotId: i.lotId,
              lotNumber: i.lotNumber,
              batchQty: i.batchQty,
            },
          ],
        });
      }
    });
    const res = await createTaskQcDoc(paramsList);
    if (getResponse(res)) {
      notification.success({
        message: '报检成功',
      });
      onInspectionModalClose();
    }
  }

  return (
    <Fragment>
      <div className={styles['inspect-query']}>
        <Lov
          dataSet={ds}
          name="moObj"
          placeholder="请选择MO号"
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
        />
        <Lov
          dataSet={ds}
          name="moOperationObj"
          placeholder="请选择工序"
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
        />
        <TextField
          ref={tagRef}
          name="tagCode"
          dataSet={ds}
          placeholder="请输入/扫描标签"
          suffix={<Icons type="scan" color="#0C6B7E" size="24" />}
          onKeyDown={handleKeyDown}
        />
        <TextField
          dataSet={ds}
          name="lotNumber"
          placeholder="请输入/扫描批次"
          suffix={<Icons type="scan" color="#0C6B7E" size="24" />}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles['inspect-list']}>
        {inspectList.map((i, index) => (
          <div className={styles['inspect-list-item']} key={i.executeLotId}>
            <div>
              <CheckBox checked={i.checked} onChange={(val) => handleItemCheck(val, index)} />
              <span className={styles['inspect-num']}>{i.itemCode}</span>
              <span>{i.itemDescription}</span>
            </div>
            <div>
              <span>{i.tagCode}</span>
              <span className={styles['lot-num']}>{i.lotNumber}</span>
              <NumberField
                min={0}
                value={i.batchQty}
                onChange={(val) => handleQtyChange(val, index)}
              />
              <span className={styles.uom}>{i.uomName}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles['inspect-footer']}>
        <div>
          <CheckBox onChange={handleCheckAll} checked={allChecked}>
            {intl.get('hzero.c7nUI.Select.selectAll').d('全选')}
          </CheckBox>
          <Button style={{ marginLeft: 24 }} onClick={handleReset}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
        <div>
          <Button onClick={handleAllInspect}>
            {intl.get(`${preCode}.button.inspectAll`).d('全部报检')}
          </Button>
          <Button color="primary" onClick={handleInspect}>
            {intl.get(`${preCode}.button.confirm`).d('确认')}
          </Button>
        </div>
      </div>
    </Fragment>
  );
};
