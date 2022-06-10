import React, { Fragment, useState, useEffect, createRef } from 'react';
import { TextField, CheckBox, NumberField, Button } from 'choerodon-ui/pro';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import notification from 'utils/notification';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getResponse } from 'utils/utils';
import {
  getMoNum,
  searchOperationCode,
  getExecuteLot,
  createTaskQcDoc,
} from '@/services/onePieceFlowReportService';
import intl from 'utils/intl';
import styles from '../index.less';

const preCode = 'jc.onePieceFlowReport.model';

export default ({
  userSetting,
  workerObj,
  moNumObjTemp,
  workcellObj,
  operationObjTemp,
  onInspectionModalClose,
}) => {
  const moNumRef = createRef();
  const operationNameRef = createRef();
  const tagRef = createRef();
  const lotRef = createRef();

  const [moNum, setMoNum] = useState(null); // 工单编码
  const [moNumObj, setMoNumObj] = useState({}); // 工单编码对象
  const [operationName, setOperationName] = useState(null); // 工序编码显示名称
  const [operationObj, setOperationObj] = useState({}); // 工序对象
  const [tagCode, setTagCode] = useState(null); // 标签
  const [lotNumber, setLotNumber] = useState(null); // 批次

  const [preTagOrLot, setPreTagOrLot] = useState(null);

  const [inspectList, setInspectList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    if (Object.keys(moNumObj).length === 0 || !moNum) {
      moNumRef.current.focus();
    } else if (Object.keys(operationObj).length === 0 || !operationName) {
      operationNameRef.current.focus();
    }
  });

  useEffect(() => {
    setMoNum(moNumObjTemp.moNum);
    setMoNumObj(moNumObjTemp);
    setOperationName(operationObjTemp.operationName);
    setOperationObj(operationObjTemp);
  }, [moNumObjTemp, operationObjTemp]);

  useEffect(() => {
    if (Object.keys(moNumObj).length && Object.keys(operationObj).length) {
      queryInspectList();
    } else {
      setInspectList([]);
    }
  }, [moNumObj, operationObj]);

  useEffect(() => {
    queryInspectList();
  }, [tagCode, lotNumber]);

  async function queryInspectList(params = {}) {
    const res = await getExecuteLot(
      Object.keys(params).length
        ? params
        : {
            moId: moNumObj.moId,
            operationId: operationObj.operationId,
            executeType: 'PENDING_QTY',
            tagCode,
            lotNumber,
            unInspectTag: 1,
          }
    );
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

  function handleChange(value, type) {
    if (type === 'moNum') {
      setMoNum(value);
    } else if (type === 'operation') {
      setOperationName(value);
    } else if (type === 'tag') {
      setTagCode(value);
    } else if (type === 'lot') {
      setLotNumber(value);
    }
  }

  async function handleKeyDown(e, type) {
    e.persist();
    if (e.keyCode === 13) {
      if (type === 'moNum') {
        if (!e.target.value) {
          setMoNum(null);
          setMoNumObj({});
          return;
        }
        const params = {
          moNum: e.target.value,
        };
        const resp = await getMoNum(params);
        if (resp && resp.failed) {
          notification.error({
            message: resp.message,
          });
          setMoNum(null);
          setMoNumObj({});
        } else {
          setMoNum(resp.moNum ? resp.moNum : null);
          setMoNumObj(resp);
        }
      } else if (type === 'operation') {
        if (!e.target.value) {
          setOperationName(null);
          setOperationObj({});
          return;
        }
        const params = {
          operationCode: e.target.value,
        };
        const resp = await searchOperationCode(params);
        if (resp && resp.failed) {
          notification.error({
            message: resp.message,
          });
          setOperationName(null);
          setOperationObj({});
        } else {
          setOperationName(resp.operationName ? resp.operationName : null);
          setOperationObj(resp);
        }
      } else if (type === 'tag' || type === 'lot') {
        if (e.keyCode === 13) {
          if (type === 'tag') {
            setTagCode(() => e.target.value);
          } else {
            setLotNumber(() => e.target.value);
          }
        }
      }
    }
  }

  function handleItemCheck(val, idx) {
    const cloneList = [...inspectList];
    cloneList[idx].checked = val;
    setInspectList(cloneList);
    setAllChecked(cloneList.every((i) => i.checked));
  }

  function handleQtyChange(val, idx) {
    const cloneList = [...inspectList];
    cloneList[idx].batchQty = val;
    setInspectList(cloneList);
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

  function handleReset() {
    setInspectList([]);
    setTagCode(null);
    setLotNumber(null);
    queryInspectList();
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
          itemControlType: i.itemControlType,
          declarerId: workerObj && workerObj.workerId ? workerObj.workerId : userSetting?.workerId,
          declarer:
            workerObj && workerObj.workerCode ? workerObj.workerCode : userSetting?.workerCode,
          workerId: workerObj && workerObj.workerId ? workerObj.workerId : userSetting?.workerId,
          worker:
            workerObj && workerObj.workerCode ? workerObj.workerCode : userSetting?.workerCode,
          prodLineId: null, // 工位选项上的数据
          prodLineCode: null, // 工位选项上的数据
          workcellId:
            workcellObj && workcellObj.workcellId
              ? workcellObj.workcellId
              : userSetting?.workcellId, // userSetting?.workcellId,
          calendarDay: moment().format('YYYY-MM-DD'),
          calendarShiftCode: 'MORNING SHIFT',
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
        <div className={styles.inputs}>
          <TextField
            ref={moNumRef}
            placeholder="请输入或扫描MO号"
            suffix={<img src={scanIcon} alt="" />}
            clearButton
            value={moNum}
            onChange={(value) => handleChange(value, 'moNum')}
            onKeyDown={(e) => handleKeyDown(e, 'moNum')}
          />
          <TextField
            ref={operationNameRef}
            placeholder="请输入或扫描工序"
            suffix={<img src={scanIcon} alt="" />}
            clearButton
            value={operationName}
            onChange={(value) => handleChange(value, 'operation')}
            onKeyDown={(e) => handleKeyDown(e, 'operation')}
            disabled={!moNumObj || (moNumObj && Object.keys(moNumObj).length === 0)}
          />
          <TextField
            ref={tagRef}
            placeholder="请输入或扫描标签"
            suffix={<img src={scanIcon} alt="" />}
            clearButton
            value={tagCode}
            onChange={(value) => handleChange(value, 'tag')}
            onKeyDown={(e) => handleKeyDown(e, 'tag')}
            disabled={
              !moNumObj ||
              (moNumObj && Object.keys(moNumObj).length === 0) ||
              !operationObj ||
              (operationObj && Object.keys(operationObj).length === 0)
            }
          />
          <TextField
            ref={lotRef}
            placeholder="请输入或扫描批次"
            suffix={<img src={scanIcon} alt="" />}
            clearButton
            value={lotNumber}
            onChange={(value) => handleChange(value, 'lot')}
            onKeyDown={(e) => handleKeyDown(e, 'lot')}
            disabled={
              !moNumObj ||
              (moNumObj && Object.keys(moNumObj).length === 0) ||
              !operationObj ||
              (operationObj && Object.keys(operationObj).length === 0)
            }
          />
        </div>
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
          <div style={{ marginLeft: '20px' }}>共 {inspectList.length} 条</div>
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
