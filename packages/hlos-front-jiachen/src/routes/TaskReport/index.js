/**
 * @Description: 任务报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState, useRef, useMemo, createRef } from 'react';
import { Select, Modal, DataSet, TextField, Button } from 'choerodon-ui/pro';
import moment from 'moment';
import { isEmpty, cloneDeep } from 'lodash';
import { closeTab } from 'utils/menuTab';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import Time from 'hlos-front/lib/components/Time';
import Loading from 'hlos-front/lib/components/Loading';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import defaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
import {
  queryLovData,
  userSetting,
  queryFileByDirectory,
  queryIndependentValueSet,
} from 'hlos-front/lib/services/api';
import { QueryDS, TaskDS, HeaderDS } from '@/stores/taskReportDS';
import {
  checkControlType,
  queryMo,
  runTask,
  submitTaskOutput,
  submitTaskByProduct,
  handleInspectionDocs,
  queryTask,
  issueTasks,
  queryWorkerGroup,
  pauseTask,
  getMakeLotNumber,
  returnTask,
  createTaskQcDoc,
  getLastestDrawing,
  // getLastestEsop,
  getLatestEsop,
} from '@/services/taskService';
import codeConfig from '@/common/codeConfig';
import Header from './Header';
import ReportInfo from './ReportInfo';
import ReportItem from './ReportItem';
import LoginModal from './LoginModal';
import Footer from './Footer';
import HistoryModal from './HistoryModal';
import FeedingModal from './feedingModals/FeedingModal';
import ReportModal from './ReportModal';
import RejectedMaterialModal from './rejectedMaterialModals';
import ByProductModal from './ByProductModal';
import styles from './style.less';

const { common, lmesTaskReport } = codeConfig.code;
const modalKey = Modal.key();
const materialModalKey = Modal.key();
const preCode = 'jc.taskReport';
const tagRef = createRef();
const lotRef = createRef();

const qDS = () => new DataSet(QueryDS());
const tDS = () => new DataSet(TaskDS());
const hDS = () => new DataSet(HeaderDS());

const TaskReport = ({ history }) => {
  let modal = null;
  let historyModal = null;
  let feedingModal = null;
  let reportModal = null;
  let _rejectedMaterialModal = null;
  let productModal = null;
  let taskModal = null;

  const queryDS = useDataSet(qDS, TaskReport);
  const headerDS = useDataSet(hDS);
  const taskDS = useDataSet(tDS);

  const typeRef = useRef();
  const imgRef = useRef();
  const instructionRef = useRef();

  const [workerLock, changeWorkerLock] = useState(false);
  const [prodLineLock, changeProdlineLock] = useState(false);
  const [operationLock, changeOperationLock] = useState(false);
  const [taskType, setTaskType] = useState('');
  const [lotList, setLotArr] = useState([]);
  const [avator, setAvator] = useState(defaultAvator);
  const [resourceType, setResourceType] = useState(null);
  const [taskInfo, setTaskInfo] = useState({});
  const [moInfo, setMoInfo] = useState({});
  const [orgObj, setOrgObj] = useState({});
  const [reportType, setReportType] = useState('MO');
  const [lotNumber, setLotNum] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [tagTotal, setTagTotal] = useState(0);
  const [remark, setRemark] = useState(null);
  const [shiftShow, setShiftShow] = useState(false);
  const [newLotArr, setNewLotArr] = useState([]);
  const [hideFlag, changeHideFlag] = useState(false);
  const [docObj, setDocObj] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [executeTotalQty, setExecuteTotalQty] = useState(0);
  const [showInputArr, setShowInputArr] = useState([]);
  const [showByInputArr, setShowByInputArr] = useState([]);
  const [footerExtraBtnArr, setFooterBtnArr] = useState([]);
  const [showMainUom, setShowMainUom] = useState(true);
  const [moNull, setMoNull] = useState(false);
  const [loginCheckArr, setLoginCheckArr] = useState([]);
  const [makeLotNumber, setMakeLotNumber] = useState(null);
  const [isReturn, changeIsReturn] = useState(null);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [drawingDocument, setDrawingDocument] = useState(true);
  // const [esopDocument, setEsopDocument] = useState(true);
  const [drawingRule, setDrawingRule] = useState(null);
  // const [esopRule, setEsopRule] = useState(null);
  const [currentTask, setCurrentTask] = useState({});
  const [qcTypeList, setQcTypeList] = useState([]);
  const [defaultReportTypeArr, setDefaultReportTypeArr] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [inspectTypeList, setInspectTypeList] = useState([]);
  // const [reportBatchQty, setReportBatchQty] = useState(1);
  const reportBatchQtyRef = useRef(null);

  const timeComponent = useMemo(() => <Time />, []);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    if (queryDS.current) {
      queryDS.current.reset();
      queryDS.fields.get('workcellObj').set('required', true);
      const arr = ['prodLine', 'workcell', 'equipment', 'workerGroup'];
      const _arr = arr.filter((item) => item !== 'workcell');
      _arr.forEach((arrItem) => {
        queryDS.fields.get(`${arrItem}Obj`).set('required', false);
        queryDS.current.set(`${arrItem}Obj`, null);
      });
    }
    let ruleArr = [];
    const _ruleArr = [
      {
        key: 'prodLine',
        name: '产线',
      },
      {
        key: 'workcell',
        name: '工位',
      },
      {
        key: 'equipment',
        name: '设备',
      },
      {
        key: 'workerGroup',
        name: '班组',
      },
    ];
    async function defaultLovSetting() {
      const ruleRes = await userSetting({
        defaultFlag: 'Y',
      });
      if (getResponse(ruleRes) && ruleRes && ruleRes.content && ruleRes.content[0]) {
        const {
          meOuId,
          meOuCode,
          executeLoginRuleId,
          workerId,
          workerCode,
          workerName,
          fileUrl,
          workcellId,
          workcellCode,
          workcellName,
        } = ruleRes.content[0];
        if (meOuId) {
          setOrgObj({
            organizationId: meOuId,
            organizationCode: meOuCode,
          });
          queryDS.current.set('orgId', meOuId);
          headerDS.current.set('orgId', meOuId);
        }
        if (executeLoginRuleId) {
          const jsonRes = await queryLovData({
            lovCode: common.rule,
            ruleId: ruleRes.content[0].executeLoginRuleId,
          });
          if (getResponse(jsonRes) && jsonRes.content && jsonRes.content[0]) {
            ruleArr = checkLoginRule(jsonRes.content[0].ruleJson);
          } else {
            ruleArr = _ruleArr;
          }
        } else {
          ruleArr = _ruleArr;
        }
        if (workerId) {
          queryDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
          setAvator(fileUrl);
          const workerGroupRes = await queryWorkerGroup({
            workerId,
          });
          if (getResponse(workerGroupRes)) {
            headerDS.current.set('workerGroupObj', {
              workerGroupId: workerGroupRes.workerGroupId,
              workerGroupCode: workerGroupRes.workerGroupCode,
              workerGroupName: workerGroupRes.workerGroupName,
            });
          }
        }
        if (workcellId) {
          queryDS.current.set('workcellObj', {
            workcellId,
            workcellCode,
            workcellName,
          });
        }
      } else {
        ruleArr = _ruleArr;
      }
      setLoginCheckArr(ruleArr);
      handleChangeLogin(ruleArr);
    }
    async function getQcType() {
      const res = await queryIndependentValueSet({
        lovCode: lmesTaskReport.qcType,
      });
      if (res && Array.isArray(res)) {
        setQcTypeList(res);
      }
    }
    defaultLovSetting();
    getQcType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDS, headerDS.fields]);

  useEffect(() => {
    if (defaultReportTypeArr.includes('OK')) {
      taskDS.current.set('processOkQty1', taskInfo.executableQty);
    }
    if (defaultReportTypeArr.includes('NG')) {
      taskDS.current.set('processNgQty1', taskInfo.executableQty);
    }
    if (defaultReportTypeArr.includes('SCRAPPED')) {
      taskDS.current.set('scrappedQty1', taskInfo.executableQty);
    }
    if (defaultReportTypeArr.includes('REWORK')) {
      taskDS.current.set('reworkQty1', taskInfo.executableQty);
    }
    if (defaultReportTypeArr.includes('PENDING')) {
      taskDS.current.set('pendingQty1', taskInfo.executableQty);
    }
  }, [defaultReportTypeArr]);

  function checkLoginRule(json) {
    const arr = [];
    const rule = JSON.parse(json);
    if (!isEmpty(rule)) {
      if (rule.resource_class) {
        const ruleArr = rule.resource_class.split(',');
        ruleArr.forEach((i) => {
          if (i === 'PRODLINE') {
            arr.push({
              key: 'prodLine',
              name: '产线',
            });
          } else if (i === 'WORKCELL') {
            arr.push({
              key: 'workcell',
              name: '工位',
            });
          } else if (i === 'EQUIPMENT') {
            arr.push({
              key: 'equipment',
              name: '设备',
            });
          } else if (i === 'WORKERGROUP') {
            arr.push({
              key: 'workerGroup',
              name: '班组',
            });
          }
        });
      }
      if (rule.document_class) {
        setReportType(rule.document_class);
        queryDS.current.set('reportType', rule.document_class);
      }
    }
    return arr;
  }

  /**
   * 显示扫描标签历史Modal
   */
  function handleShowHistoryModal(arr) {
    historyModal = Modal.open({
      key: 'history',
      title: `已扫描（${lotList.length}）`,
      className: styles['jc-task-report-history-modal'],
      children: (
        <HistoryModal
          taskInfo={taskInfo}
          lotList={Array.isArray(arr) ? arr : lotList}
          secondUomShow={secondUomShow()}
          converseValueShow={converseValueShow}
          onHistoryQtyChange={handleHistoryQtyChange}
          onHistoryDel={handleHistoryDel}
          showInputArr={showInputArr}
        />
      ),
      onOk: handleHisOk,
      onCancel: handleHisCancel,
    });
  }

  /**
   * 扫描标签历史删除
   */
  function handleHistoryDel(index) {
    if (index === 0) {
      deleteLot(lotList);
    }
    const _lotList = lotList;
    const _newLotList = newLotArr;
    _lotList.splice(index, 1);
    _newLotList.splice(index, 1);
    setLotArr(_lotList);
    setNewLotArr(_newLotList);

    historyModal.update({
      children: (
        <HistoryModal
          taskInfo={taskInfo}
          lotList={_lotList}
          secondUomShow={secondUomShow()}
          converseValueShow={converseValueShow}
          onHistoryQtyChange={handleHistoryQtyChange}
          onHistoryDel={handleHistoryDel}
          showInputArr={showInputArr}
        />
      ),
    });
  }

  /**
   * 批次历史数量修改
   */
  function handleHistoryQtyChange(type, value, index) {
    const _list = lotList.slice();

    _list.forEach((item, i) => {
      const _item = item;
      if (i === index) {
        _item[`${type}`] = value;
        if (showMainUom) {
          _item[`${type}Exchange`] = Number(value * taskInfo.uomConversionValue).toFixed(2);
        } else {
          _item[`${type}Exchange`] = Number(value / taskInfo.uomConversionValue).toFixed(2);
        }
      }
    });

    historyModal.update({
      children: (
        <HistoryModal
          taskInfo={taskInfo}
          lotList={_list}
          secondUomShow={secondUomShow()}
          converseValueShow={converseValueShow}
          onHistoryQtyChange={handleHistoryQtyChange}
          onHistoryDel={handleHistoryDel}
          showInputArr={showInputArr}
        />
      ),
    });

    setLotArr(_list);
  }

  /**
   * 扫描标签历史Modal 确定按钮
   */
  function handleHisOk() {
    setNewLotArr(cloneDeep(lotList));
    if (lotList.length) {
      taskDS.current.set('processOkQty1', lotList[0].processOkQty);
      taskDS.current.set('processNgQty1', lotList[0].processNgQty);
      taskDS.current.set('reworkQty1', lotList[0].reworkQty);
      taskDS.current.set('scrappedQty1', lotList[0].scrappedQty);
      taskDS.current.set('pendingQty1', lotList[0].pendingQty);
    }
  }

  /**
   * 扫描标签历史Modal 取消按钮
   */
  function handleHisCancel() {
    setLotArr(newLotArr);
    if (newLotArr[0]) {
      taskDS.current.set('processOkQty1', newLotArr[0].processOkQty);
      taskDS.current.set('processNgQty1', newLotArr[0].processNgQty);
      taskDS.current.set('reworkQty1', newLotArr[0].reworkQty);
      taskDS.current.set('scrappedQty1', newLotArr[0].scrappedQty);
      taskDS.current.set('pendingQty1', newLotArr[0].pendingQty);
    }
  }

  /**
   * 登录Modal中资源类型选择修改
   */
  function handleRadioChange(value, arr) {
    handleSetOption(value);
    modal.update({
      children: (
        <LoginModal
          ds={queryDS}
          value={value}
          loginCheckArr={arr}
          onLoginClick={handleLoginClick}
          onRadioChange={handleRadioChange}
          onTypeChange={handleTypeChange}
          onExit={handleExit}
          ref={(node) => {
            typeRef.current = node;
          }}
        />
      ),
    });
    typeRef.current = value;
    setResourceType(value);
  }

  async function handleSetOption(value) {
    typeRef.current = value;
    setResourceType(value);
    queryDS.current.set('other', value);
    queryDS.fields.get(`${value}Obj`).set('required', true);
    headerDS.fields.get(`${value}Obj`).set('required', true);

    const arr = ['prodLine', 'workcell', 'equipment', 'workerGroup'];
    const _arr = arr.filter((item) => item !== value);
    _arr.forEach((arrItem) => {
      queryDS.fields.get(`${arrItem}Obj`).set('required', false);
      queryDS.current.set(`${arrItem}Obj`, null);
      headerDS.fields.get(`${arrItem}Obj`).set('required', false);
      headerDS.current.set(`${arrItem}Obj`, null);
    });
    const res = await userSetting({
      defaultFlag: 'Y',
    });
    if (getResponse(res) && res && res.content && res.content[0]) {
      if (value === 'prodLine') {
        queryDS.current.set(`${value}Obj`, {
          [`${value}Id`]: res.content[0][`${value}Id`],
          [`${value}Code`]: res.content[0][`${value}Code`],
          resourceName: res.content[0][`${value}Name`],
        });
      } else {
        queryDS.current.set(`${value}Obj`, {
          [`${value}Id`]: res.content[0][`${value}Id`],
          [`${value}Code`]: res.content[0][`${value}Code`],
          [`${value}Name`]: res.content[0][`${value}Name`],
        });
      }
    }
  }

  /**
   * 底部切换按钮
   */
  function handleChangeLogin(ruleArr = []) {
    const flag = ruleArr.filter((i) => i.key === resourceType).length;
    const optionCheckVal = flag ? resourceType : ruleArr[0].key;
    handleSetOption(optionCheckVal);
    modal = Modal.open({
      key: 'login',
      title: '登录',
      className: styles['jc-task-report-login-modal'],
      footer: null,
      children: (
        <LoginModal
          ds={queryDS}
          value={optionCheckVal}
          loginCheckArr={ruleArr}
          onLoginClick={handleLoginClick}
          onRadioChange={handleRadioChange}
          onTypeChange={handleTypeChange}
          onExit={handleExit}
          ref={(node) => {
            typeRef.current = node;
          }}
        />
      ),
    });
  }

  /**
   * 点击登录
   */
  async function handleLoginClick() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (queryDS.current.get('workerId') !== headerDS.current.get('workerId')) {
      headerDS.current.set('workerObj', {
        workerId: queryDS.current.get('workerId'),
        workerCode: queryDS.current.get('worker'),
        workerName: queryDS.current.get('workerName'),
      });
    }

    typeRef.current = typeRef.current || 'workcell';
    if (
      queryDS.current.get(`${typeRef.current || 'workcell'}Id`) !==
      headerDS.current.get(`${typeRef.current || 'workcell'}Id`)
    ) {
      headerDS.current.set(
        `${typeRef.current || 'workcell'}Obj`,
        queryDS.current.data[`${typeRef.current || 'workcell'}Obj`]
      );
    }

    if (queryDS.current.get('reportType') === 'MO') {
      headerDS.fields.get('operationObj').set('required', true);
    } else {
      headerDS.fields.get('operationObj').set('required', false);
    }

    if (queryDS.current.get('shift')) {
      setShiftShow(true);
    } else {
      setShiftShow(false);
    }
    modal.close();
  }

  /**
   * 锁定查询条件
   */
  function handleLockClick(type) {
    if (type === 'worker') {
      changeWorkerLock(!workerLock);
    } else if (type === 'prodLine') {
      changeProdlineLock(!prodLineLock);
    } else if (type === 'operation') {
      changeOperationLock(!operationLock);
    }
  }

  /**
   * 输入/扫描批次
   */
  function handleLotInput(e) {
    if (!e.target.value.trim()) return;
    if (lotList.filter((item) => item.lotNumber === e.target.value).length) {
      notification.warning({
        message: '该批次已录入',
      });
      taskDS.current.set('lotInput', null);
      lotRef.current.focus();
      return;
    }
    setLotNum(e.target.value);
    const _lotArr = lotList;
    const defaultQty = taskDS.current.get('defaultQty') || 0;
    const defaultExchange = showMainUom
      ? defaultQty * taskInfo.uomConversionValue
      : defaultQty / taskInfo.uomConversionValue;
    const obj = {
      lotNumber: e.target.value,
      processOkQty: 0,
      processOkQtyExchange: 0,
      reworkQty: 0,
      reworkQtyExchange: 0,
      processNgQty: 0,
      processNgQtyExchange: 0,
      scrappedQty: 0,
      scrappedQtyExchange: 0,
      pendingQty: 0,
      pendingQtyExchange: 0,
    };
    if (showInputArr && showInputArr[0]) {
      if (showInputArr[0] === 'ok') {
        obj.processOkQty = defaultQty;
        obj.processOkQtyExchange = Number(defaultExchange).toFixed(2);
      } else if (showInputArr[0] === 'ng') {
        obj.processNgQty = defaultQty;
        obj.processNgQtyExchange = Number(defaultExchange).toFixed(2);
      } else {
        obj[`${showInputArr[0]}Qty`] = defaultQty;
        obj[`${showInputArr[0]}QtyExchange`] = Number(defaultExchange).toFixed(2);
      }
    }
    _lotArr.unshift(obj);
    setLotArr(_lotArr);
    setNewLotArr(cloneDeep(_lotArr));
    taskDS.current.set('lotInput', null);
    taskDS.current.set('processOkQty1', 0);
    taskDS.current.set('processNgQty1', 0);
    taskDS.current.set('reworkQty1', 0);
    taskDS.current.set('scrappedQty1', 0);
    taskDS.current.set('pendingQty1', 0);
    if (showInputArr && showInputArr[0]) {
      if (showInputArr[0] === 'ok') {
        taskDS.current.set('processOkQty1', defaultQty);
      } else if (showInputArr[0] === 'ng') {
        taskDS.current.set('processNgQty1', defaultQty);
      } else {
        taskDS.current.set(`${showInputArr[0]}Qty1`, defaultQty);
      }
    }
    lotRef.current.focus();
  }

  /**
   * 输入/扫描标签
   */
  function handleTagInput(e) {
    if (!e.target.value.trim()) return;
    if (tagList.filter((item) => item.tagCode === e.target.value).length) {
      notification.warning({
        message: '该标签已录入',
      });
      taskDS.current.set('tagInput', null);
      tagRef.current.focus();
      return;
    }
    if (!taskDS.current.get('qcType')) {
      tagRef.current.focus();
      return;
    }
    const inputQty = taskDS.current.get('defaultQty') || 1;

    const total = tagTotal + Number(inputQty);

    const _list = tagList.slice();
    let obj = {};
    if (taskDS.current.get('qcType') === 'OK') {
      obj = {
        executeQty: inputQty,
      };
    } else if (taskDS.current.get('qcType') === 'NG') {
      obj = {
        executeNgQty: inputQty,
      };
    } else if (taskDS.current.get('qcType') === 'SCRAPPED') {
      obj = {
        scrappedQty: inputQty,
      };
    } else if (taskDS.current.get('qcType') === 'REWORK') {
      obj = {
        reworkQty: inputQty,
      };
    } else if (taskDS.current.get('qcType') === 'PENDING') {
      obj = {
        pendingQty: inputQty,
      };
    }
    _list.push({
      ...obj,
      tagCode: e.target.value,
      number: inputQty,
      qcType: taskDS.current.get('qcType'),
    });
    if (_list.length < 6 || _list.length === 6) {
      changeHideFlag(true);
    } else {
      changeHideFlag(false);
    }
    setTagList(_list);
    setTagTotal(total);
    taskDS.current.set('tagInput', null);
    tagRef.current.focus();
  }

  /**
   * 查询条件修改
   * 按工单报工时  输入moNum 查出对应的moId 根据moId限定工序 根据mo和工序查出对应的task
   * 按任务报工时 输入taskNum 查出对应task 根据task对应的moNum 查出对应的mo
   */
  async function handleQueryChange(value, record) {
    if (value && value === 'operation') {
      setTagList([]);
      setTagTotal(0);
      setLotArr([]);
      setNewLotArr([]);
      setLotNum(0);
      changeHideFlag(true);
    }
    if (value === 'worker') {
      setAvator(record.fileUrl);
    }
    // setReportBatchQty(1);
    reportBatchQtyRef.current = 1;
    // 按工单报工时 根据 moNum 查询 Mo信息
    if (reportType === 'MO' && headerDS.current.get('inputNum')) {
      const moRes = await queryMo({
        moNum: headerDS.current.get('inputNum').trim(),
        // ownerOrganizationId: orgObj.organizationId,
        taskItem: 1,
        moStatus: 'RELEASED',
      });
      if (getResponse(moRes)) {
        if (moRes && moRes.content && moRes.content[0]) {
          setMoInfo(moRes.content[0]);
          // 根据 mo 限定 工序
          headerDS.current.set('moId', moRes.content[0].moId);
          headerDS.fields.get('operationObj').set('required', true);
        } else if (!moRes.content.length) {
          headerDS.fields.get('operationObj').set('required', false);
          headerDS.current.set('moId', null);
          headerDS.current.set('operationObj', null);
          setTaskInfo({});
          setMoInfo({});
          return;
        }
      }
    }

    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) {
      return;
    }

    // 不同报工类型 参数不同
    if (reportType === 'MO') {
      let params = {
        moNum: headerDS.current.get('inputNum'),
        organizationId: orgObj.organizationId,
        moQueryFlag: 'Y',
        taskTypeCode: queryDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
      };
      if (queryDS.current.get('reworkFlag')) {
        params = {
          ...params,
          operationId: headerDS.current.get('operationId'),
        };
      } else {
        params = {
          ...params,
          moOperationId: headerDS.current.get('moOperationId'),
        };
      }
      taskDS.queryParameter = params;
    } else if (reportType === 'TASK') {
      taskDS.queryParameter = {
        taskNum: headerDS.current.get('inputNum'),
        organizationId: orgObj.organizationId,
        taskTypeCode: queryDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
      };
    }

    const res = await taskDS.query();
    if (getResponse(res)) {
      if (res && res.content) {
        if (res.content.length > 1) {
          taskModal = Modal.open({
            key: modalKey,
            title: '任务列表',
            className: styles['jc-task-report-draw-modal'],
            children: (
              <div>
                {res.content.map((i) => {
                  return (
                    <p key={i.taskId}>
                      <a style={{ fontSize: '22px' }} onClick={() => handleSelectTask(i)}>
                        {i.taskNum}
                      </a>
                    </p>
                  );
                })}
              </div>
            ),
            footer: null,
          });
        } else if (res.content.length === 1) {
          handleSelectTask(res.content[0]);
        } else {
          notification.warning({
            message: '暂无数据',
          });
          setMoInfo({});
          setTaskInfo({});
        }
      }
    }
  }

  async function handleSelectTask(rec) {
    if (taskModal) {
      taskModal.close();
    }
    setCurrentTask(rec);
    handleQueryTask(rec.taskNum);
    setTaskInfo(rec);
    showInput(rec);
    const { moNum, taskId } = rec;
    if (reportType === 'TASK') {
      // 按任务报工时 根据 taskCode 查询对应 mo
      if (moNum) {
        const moRes = await queryMo({
          moNum,
          // ownerOrganizationId: orgObj.organizationId,
          taskItem: 1,
        });
        if (moRes && moRes.content && moRes.content[0]) {
          setMoInfo(moRes.content[0]);
          setMoNull(false);
        }
      } else {
        setMoInfo({});
        setMoNull(true);
      }
    }

    const controlTypeArr = ['LOT', 'TAG', 'QUANTITY'];
    if (
      rec.executeRule &&
      JSON.parse(rec.executeRule) &&
      JSON.parse(rec.executeRule).item_control_type &&
      controlTypeArr.includes(JSON.parse(rec.executeRule).item_control_type)
    ) {
      setTaskType(JSON.parse(rec.executeRule).item_control_type);
      if (JSON.parse(rec.executeRule).item_control_type === 'LOT') {
        queryMakeLotNumber(taskId);
      }
    } else {
      // 检查物料控制类型 itemControlType
      const typeRes = await checkControlType([
        {
          organizationId: orgObj.organizationId,
          itemId: rec.itemId,
          groupId: rec.taskItemLineId,
          tenantId: getCurrentOrganizationId(),
        },
      ]);
      if (typeRes && typeRes[0]) {
        setTaskType(typeRes[0].itemControlType);
        if (typeRes[0].itemControlType === 'LOT') {
          queryMakeLotNumber(taskId);
        }
      }
    }
  }

  // 获取生产批次号
  async function queryMakeLotNumber(taskId) {
    const {
      moId,
      prodLineCode,
      equipmentCode,
      workerGroup,
      workcellCode,
      worker,
    } = headerDS.current.toJSONData();
    const params = {
      moId,
      taskId,
      prodLineCode,
      equipmentCode,
      workerGroup,
      workcellCode,
      worker,
      executeTime: moment(new Date()).format(DEFAULT_DATE_FORMAT),
    };
    const res = await getMakeLotNumber(params);
    if (!isEmpty(res) && res.makeLotNumber) {
      setLotArr([{ lotNumber: res.makeLotNumber }]);
      setLotNum(res.makeLotNumber);
      setMakeLotNumber(res.makeLotNumber);
    }
  }

  function showInput(record) {
    const { executeRule } = record;
    const _showinputArr = [];
    const _showByinputArr = [];
    const _showFooterBtnArr = [];
    const _inspectTypeList = [];
    const rule = executeRule && JSON.parse(executeRule);
    if (!isEmpty(rule)) {
      if (rule.report_type) {
        const rArr = rule.report_type.split(',');
        if (rArr.includes('OK')) {
          _showinputArr.push('ok');
        }
        if (rArr.includes('NG')) {
          _showinputArr.push('ng');
        }
        if (rArr.includes('SCRAPPED')) {
          _showinputArr.push('scrapped');
        }
        if (rArr.includes('REWORK')) {
          _showinputArr.push('rework');
        }
        if (rArr.includes('PENDING')) {
          _showinputArr.push('pending');
        }
      }
      if (rule.byproduct_report_type) {
        const bArr = rule.byproduct_report_type.split(',');
        if (bArr.includes('OK')) {
          _showByinputArr.push('ok');
        }
        if (bArr.includes('NG')) {
          _showByinputArr.push('ng');
        }
        if (bArr.includes('SCRAPPED')) {
          _showByinputArr.push('scrapped');
        }
        if (bArr.includes('REWORK')) {
          _showByinputArr.push('rework');
        }
        if (bArr.includes('PENDING')) {
          _showByinputArr.push('pending');
        }
      }
      if (rule.issue_input === '1') {
        _showFooterBtnArr.push('issue');
      }
      if (rule.drawing) {
        _showFooterBtnArr.push('document');
        setDrawingRule(rule.drawing);
        if (rule.drawing.indexOf('DOCUMENT') !== -1) {
          setDrawingDocument(true);
        } else if (
          rule.drawing.indexOf('ITEM') !== -1 ||
          rule.drawing.indexOf('OPERATION') !== -1 ||
          rule.drawing.indexOf('DRAWING') !== -1
        ) {
          setDrawingDocument(false);
        }
      }
      if (rule.esop) {
        _showFooterBtnArr.push('instruction');
        // setEsopRule(rule.esop);
        if (rule.esop.indexOf('DOCUMENT') !== -1) {
          // setEsopDocument(true);
        } else if (
          rule.esop.indexOf('ITEM') !== -1 ||
          rule.esop.indexOf('OPERATION') !== -1 ||
          rule.esop.indexOf('ESOP') !== -1
        ) {
          // setEsopDocument(false);
        }
      }
      // if (rule.inspection_report === '1') {
      //   _showFooterBtnArr.push('report');
      // }
      if (rule.report_uom_type === 'MAIN') {
        setShowMainUom(true);
      } else if (rule.report_uom_type === 'SECOND') {
        setShowMainUom(false);
      }
      if (rule.default_report_type) {
        const rArr = rule.default_report_type.split(',');
        setDefaultReportTypeArr(rArr);
      }
      if (rule.inspection_report) {
        const iArr = rule.inspection_report.split(',');
        if (
          iArr.includes('PQC.FIRST') ||
          iArr.includes('PQC.FINISH') ||
          iArr.includes('PQC.LAST')
        ) {
          _showFooterBtnArr.push('report');
        }
        if (iArr.includes('PQC.FIRST')) {
          _inspectTypeList.push('PQC.FIRST');
        }
        if (iArr.includes('PQC.FINISH')) {
          _inspectTypeList.push('PQC.FINISH');
        }
        if (iArr.includes('PQC.LAST')) {
          _inspectTypeList.push('PQC.LAST');
        }
      }
    } else {
      _showinputArr.push('ok');
    }
    setShowInputArr(_showinputArr);
    setShowByInputArr(_showByinputArr);
    setFooterBtnArr(_showFooterBtnArr);
    setInspectTypeList(_inspectTypeList);
  }

  function secondUomShow() {
    if (showMainUom) {
      if (taskInfo.secondUomName) {
        return taskInfo.secondUomName;
      } else {
        return null;
      }
    } else {
      return taskInfo.uomName;
    }
  }

  /**
   * 当前标签类型改变
   */
  function handleTypeChange(value) {
    setReportType(value);
  }

  /**
   * 数量改变
   */
  function handleQtyChange(type, value, flag) {
    const _lotList = lotList.slice();
    if (_lotList.length) {
      _lotList.forEach((item) => {
        const _item = item;
        let addValue = value;
        if (_item.lotNumber === lotNumber) {
          if (flag) {
            addValue = item[type] + value < 0 ? 0 : item[type] + value;
          }
          item[type] = addValue;
          if (showMainUom) {
            _item[`${type}Exchange`] = Number(addValue * taskInfo.uomConversionValue).toFixed(2);
          } else {
            _item[`${type}Exchange`] = Number(addValue / taskInfo.uomConversionValue).toFixed(2);
          }
        }
      });
    }
    if (flag) {
      const oldVal = taskDS.current.get(`${type}1`);
      if ((oldVal || 0) + value < 0) return;
      taskDS.current.set(`${type}1`, (oldVal || 0) + value);
    }
    setLotArr(_lotList);
    setNewLotArr(cloneDeep(_lotList));
  }

  /**
   * 底部开工按钮
   */
  async function handleStart() {
    if (!taskInfo.taskId) return;

    setSubmitLoading(true);
    const res = await runTask({
      taskIds: [taskInfo.taskId],
      workerId: headerDS.current.get('workerId'),
      worker: headerDS.current.get('worker'),
    });
    setSubmitLoading(false);
    if (getResponse(res)) {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '开工成功',
        });

        requestData();
      }
    }
  }

  async function requestData() {
    if (reportType === 'MO') {
      let params = {
        moNum: headerDS.current.get('inputNum'),
        organizationId: orgObj.organizationId,
        moQueryFlag: 'Y',
        taskTypeCode: queryDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
      };
      if (queryDS.current.get('reworkFlag')) {
        params = {
          ...params,
          operationId: headerDS.current.get('operationId'),
        };
      } else {
        params = {
          ...params,
          moOperationId: headerDS.current.get('moOperationId'),
        };
      }
      taskDS.queryParameter = params;
      const moRes = await queryMo({
        moNum: headerDS.current.get('inputNum').trim(),
        // ownerOrganizationId: orgObj.organizationId,
        taskItem: 1,
        moStatus: 'RELEASED',
      });
      if (moRes && moRes.content && moRes.content[0]) {
        setMoInfo(moRes.content[0]);
      }
    } else if (reportType === 'TASK') {
      taskDS.queryParameter = {
        taskNum: headerDS.current.get('inputNum'),
        organizationId: orgObj.organizationId,
        taskTypeCode: queryDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
      };
    }
    const taskRes = await taskDS.query();
    if (getResponse(taskRes) && !taskRes.failed && taskRes.content) {
      let task = taskRes.content[0];
      if (taskRes.content.length > 1) {
        task = taskRes.content.find((i) => i.taskItemLineId === currentTask.taskItemLineId);
      }
      setTaskInfo(task);
      showInput(task);
      if (reportType === 'TASK') {
        const { moNum } = taskRes.content[0];
        const moRes = await queryMo({
          moNum,
          // ownerOrganizationId: orgObj.organizationId,
          taskItem: 1,
        });
        if (moRes && moRes.content && moRes.content[0]) {
          setMoInfo(moRes.content[0]);
        }
      }
    }
  }

  function getSubmitList() {
    const list = [];
    if (taskType === 'QUANTITY') {
      if (showMainUom) {
        list.push({
          executeQty: taskDS.current.get('processOkQty1'),
          executeNgQty: taskDS.current.get('processNgQty1'),
          scrappedQty: taskDS.current.get('scrappedQty1'),
          reworkQty: taskDS.current.get('reworkQty1'),
          pendingQty: taskDS.current.get('pendingQty1'),
        });
      } else {
        list.push({
          executeQty: taskDS.current.get('processOkQty1') / taskInfo.uomConversionValue,
          executeNgQty: taskDS.current.get('processNgQty1') / taskInfo.uomConversionValue,
          scrappedQty: taskDS.current.get('scrappedQty1') / taskInfo.uomConversionValue,
          reworkQty: taskDS.current.get('reworkQty1') / taskInfo.uomConversionValue,
          pendingQty: taskDS.current.get('pendingQty1') / taskInfo.uomConversionValue,
        });
      }
    } else if (taskType === 'LOT') {
      lotList.forEach((item) => {
        if (showMainUom) {
          list.push({
            lotNumber: item.lotNumber,
            executeQty: item.processOkQty,
            executeNgQty: item.processNgQty,
            scrappedQty: item.scrappedQty,
            reworkQty: item.reworkQty,
            pendingQty: item.pendingQty,
          });
        } else {
          list.push({
            lotNumber: item.lotNumber,
            executeQty: item.processOkQty / taskInfo.uomConversionValue,
            executeNgQty: item.processNgQty / taskInfo.uomConversionValue,
            scrappedQty: item.scrappedQty / taskInfo.uomConversionValue,
            reworkQty: item.reworkQty / taskInfo.uomConversionValue,
            pendingQty: item.pendingQty / taskInfo.uomConversionValue,
          });
        }
      });
    } else if (taskType === 'TAG') {
      tagList.forEach((item) => {
        if (showMainUom) {
          list.push({
            tagCode: item.tagCode,
            executeQty: item.executeQty,
            executeNgQty: item.executeNgQty,
            scrappedQty: item.scrappedQty,
            reworkQty: item.reworkQty,
            pendingQty: item.pendingQty,
          });
        } else {
          list.push({
            tagCode: item.tagCode,
            executeQty: item.executeQty / taskInfo.uomConversionValue,
            executeNgQty: item.executeNgQty / taskInfo.uomConversionValue,
            scrappedQty: item.scrappedQty / taskInfo.uomConversionValue,
            reworkQty: item.reworkQty / taskInfo.uomConversionValue,
            pendingQty: item.pendingQty / taskInfo.uomConversionValue,
          });
        }
      });
    }
    list.forEach((ele) => {
      let total = 0;
      total += parseFloat(ele.executeQty);
      setExecuteTotalQty(total);
    });
    return list;
  }

  /**
   * 底部提交按钮
   */
  async function handleSubmit() {
    if (!taskInfo.taskId) return;
    if (taskType === 'LOT' && !lotList.length && !makeLotNumber) {
      notification.warning({
        message: '请录入批次后再提交',
      });
      return;
    } else if (taskType === 'TAG' && !tagList.length) {
      notification.warning({
        message: '请录入标签后再提交',
      });
      return;
    }
    const list = getSubmitList();
    const paramsArr = [
      {
        organizationId: orgObj.organizationId,
        organizationCode: orgObj.organizationCode,
        itemControlType: taskType,
        itemOutputType: 'OUTPUT',
        itemId: taskInfo.itemId,
        itemCode: taskInfo.itemCode,
        taskId: taskInfo.taskId,
        taskNum: taskInfo.taskNum,
        taskStatus: taskInfo.taskStatus,
        executeTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        workerId: headerDS.current.get('workerId'),
        worker: headerDS.current.get('worker'),
        workerGroupId: headerDS.current.get('workerGroupId'),
        workerGroup: headerDS.current.get('workerGroup'),
        prodLineId: headerDS.current.get('prodLineId'),
        prodLineCode: headerDS.current.get('prodLineCode'),
        workcellId: headerDS.current.get('workcellId'),
        workcellCode: headerDS.current.get('workcellCode'),
        equipmentId: headerDS.current.get('equipmentId'),
        equipmentCode: headerDS.current.get('equipmentCode'),
        calendarDay: moment(queryDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
        calendarShiftCode: queryDS.current.get('shift'),
        remark,
        submitOutputLineVoList: list,
      },
    ];
    setSubmitLoading(true);
    const res = await submitTaskOutput(paramsArr);
    setSubmitLoading(false);
    if (getResponse(res)) {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '提交成功',
        });
        handleInitial();
        setIsSubmit(true);
        requestData();
      }
    }
  }

  function handleInitial() {
    taskDS.current.reset();
    if (makeLotNumber) {
      setLotArr([{ lotNumber: makeLotNumber }]);
    } else {
      setLotArr([]);
      setLotNum(null);
    }
    setTagList([]);
    setTagTotal(0);
    setRemark(null);
    setNewLotArr([]);
    setTaskInfo({});
    setMoInfo({});
  }

  /**
   * 底部退回提交按钮
   */
  async function handleReturnSubmit() {
    if (!taskInfo.taskId) return;
    Modal.confirm({
      key: Modal.key(),
      children: <span>{intl.get(`${preCode}.view.message.return.confirm`).d('是否确认退回')}</span>,
    }).then((button) => {
      if (button === 'ok') {
        returnSubmit();
      }
    });
  }

  async function returnSubmit() {
    if (!taskInfo.taskId) return;
    if (taskType === 'LOT' && !lotList.length && !makeLotNumber) {
      notification.warning({
        message: '请录入批次后再提交',
      });
      return;
    } else if (taskType === 'TAG' && !tagList.length) {
      notification.warning({
        message: '请录入标签后再提交',
      });
      return;
    }
    const { taskId, taskNum, itemCode, itemId } = taskInfo;
    const list = getSubmitList();
    const _list = list.slice();
    _list.map((item) => {
      const _item = item;
      if (showInputArr.findIndex((i) => i === 'ok') === -1) {
        delete _item.executeQty;
      }
      if (showInputArr.findIndex((i) => i === 'ng') === -1) {
        delete _item.executeNgQty;
      }
      if (showInputArr.findIndex((i) => i === 'scrapped') === -1) {
        delete _item.scrappedQty;
      }
      if (showInputArr.findIndex((i) => i === 'rework') === -1) {
        delete _item.reworkQty;
      }
      if (showInputArr.findIndex((i) => i === 'pending') === -1) {
        delete _item.pendingQty;
      }
      return _item;
    });
    const params = {
      taskId,
      taskNum,
      itemCode,
      itemId,
      itemOutputType: 'OUTPUT',
      executeTime: moment(new Date()).format(DEFAULT_DATE_FORMAT),
      workerId: headerDS.current.get('workerId'),
      worker: headerDS.current.get('worker'),
      workerGroupId: headerDS.current.get('workerGroupId'),
      workerGroup: headerDS.current.get('workerGroup'),
      prodLineId: headerDS.current.get('prodLineId'),
      prodLineCode: headerDS.current.get('prodLineCode'),
      workcellId: headerDS.current.get('workcellId'),
      workcellCode: headerDS.current.get('workcellCode'),
      equipmentId: headerDS.current.get('equipmentId'),
      equipmentCode: headerDS.current.get('equipmentCode'),
      calendarDay: moment(queryDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
      calendarShiftCode: queryDS.current.get('shift'),
      returnTaskOutputDetailDtoList: _list,
    };
    const res = await returnTask([params]);
    if (getResponse(res)) {
      notification.success({
        message: '退回成功',
      });
      handleInitial();
      requestData();
    }
  }

  /**
   * 删除批次
   */
  function handleDelLot() {
    if (lotList.length) {
      deleteLot(lotList);
      setLotArr(lotList.filter((item) => item.lotNumber !== lotNumber));
      setNewLotArr(cloneDeep(lotList.filter((item) => item.lotNumber !== lotNumber)));
    }
  }

  function deleteLot(list) {
    if (list.length > 1) {
      setLotNum(list[1].lotNumber);
      taskDS.current.set('processOkQty1', list[1].processOkQty);
      taskDS.current.set('processNgQty1', list[1].processNgQty);
      taskDS.current.set('reworkQty1', list[1].reworkQty);
      taskDS.current.set('scrappedQty1', list[1].scrappedQty);
      taskDS.current.set('pendingQty1', list[1].pendingQty);
    } else {
      setLotNum(null);
      taskDS.current.set('processOkQty1', 0);
      taskDS.current.set('processNgQty1', 0);
      taskDS.current.set('reworkQty1', 0);
      taskDS.current.set('scrappedQty1', 0);
      taskDS.current.set('pendingQty1', 0);
    }
  }

  /**
   * 标签行数量修改
   */
  function handleTagInputChange(value, code) {
    let total = 0;
    let obj = {};
    const _tagList = [];
    tagList.forEach((item) => {
      let _item = item;
      if (_item.tagCode === code) {
        if (item.qcType === 'OK') {
          obj = {
            executeQty: value,
          };
        } else if (item.qcType === 'NG') {
          obj = {
            executeNgQty: value,
          };
        } else if (item.qcType === 'SCRAPPED') {
          obj = {
            scrappedQty: value,
          };
        } else if (item.qcType === 'REWORK') {
          obj = {
            reworkQty: value,
          };
        } else if (item.qcType === 'PENDING') {
          obj = {
            pendingQty: value,
          };
        }
        _item = {
          ..._item,
          ...obj,
          number: value,
        };
      }
      _tagList.push(_item);
      total += _item.number;
    });
    setTagList(_tagList);
    setTagTotal(total);
  }

  /**
   * 删除标签
   */
  function handleTagDel(record) {
    const index = tagList.findIndex((item) => item.tagCode === record.tagCode);
    const _tagList = tagList.slice();
    _tagList.splice(index, 1);
    setTagTotal(tagTotal - record.number);
    if (_tagList.length < 6 || _tagList.length === 6) {
      changeHideFlag(true);
    } else {
      changeHideFlag(false);
    }
    setTagList(_tagList);
  }

  /**
   * 备注弹窗
   */
  function handleRemark() {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: styles['jc-task-report-mo-remark-modal'],
      children: (
        <TextField
          dataSet={taskDS}
          name="remark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
        />
      ),
      onOk: () => setRemark(taskDS.current.get('remark')),
      onCancel: () => taskDS.current.set('remark', remark),
    });
  }

  /**
   * 底部重置按钮
   */
  function handleReset() {
    Modal.confirm({
      key: Modal.key(),
      children: <span>{intl.get(`${preCode}.view.message.reset.confirm`).d('是否确认重置')}</span>,
    }).then((button) => {
      if (button === 'ok') {
        if (!workerLock) {
          headerDS.current.set('workerObj', null);
        }
        if (!prodLineLock) {
          headerDS.current.set('prodLineObj', null);
          headerDS.current.set('workcellObj', null);
          headerDS.current.set('equipmentObj', null);
          headerDS.current.set('workerGroupObj', null);
        }
        if (!operationLock) {
          headerDS.current.set('operationObj', null);
        }
        headerDS.current.set('inputNum', null);
        taskDS.current.set('remark', null);
        setTaskInfo({});
        setMoInfo({});
        setLotNum(null);
        setLotArr([]);
        setNewLotArr([]);
        setTagList([]);
        setTagTotal(0);
        setRemark(null);
      }
    });
  }

  /**
   * 底部退出按钮 - 关闭页签
   */
  function handleExit() {
    history.push('/workplace');
    closeTab('/pub/jc/task-report');
  }
  /**
   * 打开详退料情页
   */
  function handelOpenRejectMaterialDetail() {}
  /**
   * 底部按钮 - 退料
   */
  function handleRejectedMaterial() {
    if (!docObj.taskId) {
      return;
    }
    _rejectedMaterialModal = Modal.open({
      key: materialModalKey,
      title: '任务退料',
      className: styles['jc-task-report-rejected-material-modal'],
      footer: null,
      closable: true,
      destroyOnClose: true,
      style: {
        width: '80%',
      },
      children: (
        <RejectedMaterialModal
          calendarDay={queryDS.current.get('date')}
          calendarShiftCode={queryDS.current.get('shift')}
          remark={remark}
          worker={headerDS.current.get('workerObj')}
          workcell={headerDS.current.get('workcellObj')}
          workerGroup={headerDS.current.get('workerGroupObj')}
          equipmentObj={headerDS.current.get('equipmentObj')}
          prodLine={headerDS.current.get('prodLineObj')}
          docObj={docObj}
          onOpenDetail={handelOpenRejectMaterialDetail}
          handleCancel={handleCancelRejectedMaterialModal}
        />
      ),
    });
    setShowMoreBtn(false);
  }
  function handleCancelRejectedMaterialModal() {
    _rejectedMaterialModal.close();
  }
  /**
   * 底部按钮 - 组件
   */
  async function handleFeeding() {
    if (!taskInfo.taskId) {
      notification.warning({
        message: '请先录入任务',
      });
      return;
    }

    feedingModal = Modal.open({
      key: 'feeding',
      title: '投料',
      className: styles['jc-task-report-feeding-modal'],
      movable: true,
      closable: true,
      footer: null,
      children: (
        <FeedingModal
          typeRef={typeRef}
          headerDS={headerDS}
          orgObj={orgObj}
          taskInfo={taskInfo}
          handleCancel={handleCancel}
          handleFeedingConfirm={handleFeedingConfirm}
        />
      ),
    });
  }

  // 取消
  function handleCancel() {
    feedingModal.close();
  }

  // 确认投料
  async function handleFeedingConfirm(list, assemblyTagCode) {
    const submitFlag = list.every((v) => v.warehouseId);
    if (!submitFlag) {
      notification.warning({
        message: '发料仓库不存在',
      });
      return;
    }

    const submitList = list.filter((v) => v.supplyType !== 'PULL' && v.issuedOkQty);
    submitList.forEach((el) => {
      const _el = el;
      if (_el.lineList) {
        _el.lineList = _el.lineList.filter((i) => i.checked);
      }
    });
    const params = {
      organizationId: orgObj.organizationId,
      organizationCode: orgObj.organizationCode,
      taskId: taskInfo.taskId,
      taskNum: taskInfo.taskNum,
      issuedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      workerId: headerDS.current.get('workerId') || '',
      worker: headerDS.current.get('workerCode') || '',
      prodLineId: headerDS.current.get('prodLineId') || '',
      prodLineCode: headerDS.current.get('prodLineCode') || '',
      equipmentId: headerDS.current.get('equipmentId') || '',
      equipmentCode: headerDS.current.get('equipmentCode') || '',
      workcellId: headerDS.current.get('workcellId') || '',
      workcellCode: headerDS.current.get('workcellCode') || '',
      assemblyTagCode,
      issueTaskItemList: submitList,
    };
    const res = await issueTasks(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '投料成功',
      });
    }
    feedingModal.close();
  }

  /**
   * 底部按钮 - 恒光PQC
   */
  async function handlePQC() {
    if (
      taskInfo.operation === '组立工序-ZL' ||
      taskInfo.operation === '试作工序-SZ' ||
      !headerDS.current.get('inputNum')
    ) {
      return;
    }

    if (!isSubmit) {
      notification.warning({
        message: '请先报工',
      });
      return;
    }

    const params = {
      organizationId: orgObj.organizationId,
      organizationCode: orgObj.organizationCode,
      itemControlType: taskType,
      itemId: taskInfo.itemId,
      itemCode: taskInfo.itemCode,
      inspectionTemplateType: 'PQC.LAST',
      declarerId: headerDS.current.get('workerId'),
      declarer: headerDS.current.get('worker'),
      batchQty: executeTotalQty,
      sampleQty: '1',
      sourceDocTypeId: docObj.documentTypeId,
      sourceDocTypeCode: docObj.documentTypeCode,
      sourceDocId: taskInfo.documentId,
      sourceDocNum: taskInfo.taskNum,
      prodLineId: headerDS.current.get('prodLineId'),
      prodLineCode: headerDS.current.get('prodLineCode'),
      workcellId: headerDS.current.get('workcellId'),
      workcellCode: headerDS.current.get('workcellCode'),
      equipmentId: headerDS.current.get('equipmentId'),
      equipmentCode: headerDS.current.get('equipmentCode'),
      workerGroupId: headerDS.current.get('workerGroupId'),
      workerGroup: headerDS.current.get('workerGroup'),
    };
    const res = await handleInspectionDocs(params);
    if (getResponse(res)) {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '提交成功',
        });
        setIsSubmit(false);
        requestData();
      }
    }
  }

  /**
   * 底部按钮 - 试模检
   */
  async function handleModelInspection() {
    if (taskInfo.operation !== '组立') {
      notification.warning({
        message: '工序不满足!',
      });
      return;
    }

    if (!isSubmit) {
      notification.warning({
        message: '请先报工',
      });
      return;
    }

    const params = {
      organizationId: orgObj.organizationId,
      organizationCode: orgObj.organizationCode,
      itemControlType: taskType,
      itemId: taskInfo.itemId,
      itemCode: taskInfo.itemCode,
      inspectionTemplateType: 'MQC.NORMAL',
      declarerId: headerDS.current.get('workerId'),
      declarer: headerDS.current.get('worker'),
      batchQty: executeTotalQty,
      sampleQty: '1',
      sourceDocTypeId: docObj.documentTypeId,
      sourceDocTypeCode: docObj.documentTypeCode,
      sourceDocId: taskInfo.documentId,
      sourceDocNum: taskInfo.taskNum,
      prodLineId: headerDS.current.get('prodLineId'),
      prodLineCode: headerDS.current.get('prodLineCode'),
      workcellId: headerDS.current.get('workcellId'),
      workcellCode: headerDS.current.get('workcellCode'),
      equipmentId: headerDS.current.get('equipmentId'),
      equipmentCode: headerDS.current.get('equipmentCode'),
      workerGroupId: headerDS.current.get('workerGroupId'),
      workerGroup: headerDS.current.get('workerGroup'),
    };
    const res = await handleInspectionDocs(params);
    if (getResponse(res)) {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '提交成功',
        });
        setIsSubmit(false);
        requestData();
      }
    }
  }

  // 获取任务信息
  async function handleQueryTask(taskNum) {
    const res = await queryTask({
      taskNum,
      organizationId: orgObj.organizationId,
    });
    if (getResponse(res)) {
      setDocObj(res);
    }
  }

  // 点击图纸按钮
  async function handleDrawing() {
    let url = null;
    const urlList = [];
    if (drawingDocument) {
      const { referenceDocument } = docObj;
      url = referenceDocument;
    } else {
      const res = await getLastestDrawing({
        dataRule: drawingRule,
        itemId: taskInfo.itemId,
        operationId: headerDS.current.get('operationId'),
      });
      if (res && res.fileUrl) {
        const urlRes = await queryFileByDirectory({ directory: res.fileUrl });
        if (urlRes && urlRes.content) {
          urlRes.content.forEach((i) => {
            urlList.push({
              fileId: i.fileId,
              fileUrl: i.fileUrl,
            });
          });
        }
      }
    }
    if (url || urlList.length) {
      Modal.open({
        key: modalKey,
        closable: true,
        footer: null,
        title: '图纸预览',
        className: styles['jc-task-report-draw-modal'],
        children: (
          <div>
            {urlList.length ? (
              urlList.map((i) => {
                return (
                  <embed
                    key={i.fileId}
                    src={i.fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="1500"
                  />
                );
              })
            ) : (
              <div>
                <div className={styles['draw-header']}>
                  <Button onClick={() => handleOpen(url)}>全屏</Button>
                  <Button onClick={() => handleChangeSize(true, imgRef)}>放大</Button>
                  <Button onClick={() => handleChangeSize(false, imgRef)}>缩小</Button>
                </div>
                <img
                  ref={(node) => {
                    imgRef.current = node;
                  }}
                  src={url}
                  alt=""
                />
              </div>
            )}
          </div>
        ),
      });
    } else {
      notification.warning({
        message: '无图纸',
      });
    }
  }

  function handleOpen(url) {
    window.open(url);
  }

  function handleChangeSize(flag, ref) {
    const _ref = ref;
    const { width, height } = _ref.current.style;
    const widthValue = width ? parseFloat(width) : _ref.current.offsetWidth;
    const heightValue = height ? parseFloat(height) : _ref.current.offsetHeight;
    if (flag) {
      _ref.current.style.width = `${widthValue + 50}px`;
      _ref.current.style.height = `${heightValue + 50}px`;
    } else {
      _ref.current.style.width = `${widthValue - 50 < 0 ? 0 : widthValue - 50}px`;
      _ref.current.style.height = `${heightValue - 50 < 0 ? 0 : heightValue - 50}px`;
    }
  }

  function converseValueShow(value) {
    if (showMainUom) {
      return Number(value * (taskInfo.uomConversionValue || 0)).toFixed(2);
    } else {
      return Number(value / (taskInfo.uomConversionValue || 0)).toFixed(2);
    }
  }

  function handleShowMore() {
    setShowMoreBtn(!showMoreBtn);
  }

  async function handlePause() {
    if (!taskInfo.taskId) return;

    setSubmitLoading(true);
    const res = await pauseTask([taskInfo.taskId]);
    setSubmitLoading(false);
    if (getResponse(res)) {
      notification.success();
      requestData();
    }
  }

  function handleSwitchMode() {
    changeIsReturn(!isReturn);
  }

  // 点击工艺路线按钮
  async function handleInstruction() {
    let result = null;
    const params = {
      productId: taskInfo.itemId,
      operationId: headerDS.current.get('operationId'),
    };
    const res = await getLatestEsop(params);
    if (res) {
      if (res && res.fileUrl) {
        const fileExt = res.fileUrl.replace(/.+\./, '');
        res.fileExt = fileExt;
        result = res;
      }
    }
    if (result && result.fileUrl) {
      Modal.open({
        key: modalKey,
        closable: true,
        footer: null,
        title: '工艺路线预览',
        className: styles['jc-task-report-draw-modal'],
        children: (
          <div>
            {result.fileType && result.fileType === 'pdf' ? (
              <embed src={result.fileUrl} type="application/pdf" width="100%" height="1500" />
            ) : (
              <div>
                <div className={styles['draw-header']}>
                  <Button onClick={() => handleOpen(result.fileUrl)}>全屏</Button>
                  <Button onClick={() => handleChangeSize(true, instructionRef)}>放大</Button>
                  <Button onClick={() => handleChangeSize(false, instructionRef)}>缩小</Button>
                </div>
                <img
                  ref={(node) => {
                    instructionRef.current = node;
                  }}
                  src={result.fileUrl}
                  alt=""
                />
              </div>
            )}
          </div>
        ),
      });
    } else {
      notification.warning({
        message: '无工艺文件预览',
      });
    }
  }

  function handleReport() {
    reportModal = Modal.open({
      key: 'feeding',
      title: '报检',
      className: styles['jc-task-report-report-modal'],
      movable: true,
      closable: true,
      footer: null,
      children: (
        <ReportModal
          // typeRef={typeRef}
          ds={taskDS}
          reportBatchQty={reportBatchQtyRef.current}
          taskInfo={taskInfo}
          footerExtraBtnArr={footerExtraBtnArr}
          inspectTypeList={inspectTypeList}
          handleChange={handleChange}
          handleRrportConfirm={handleRrportConfirm}
        />
      ),
    });
  }

  function handleChange(value) {
    if (value > 0) {
      // setReportBatchQty(value);
      reportBatchQtyRef.current = value;
    }
  }

  // 报检提交
  async function handleRrportConfirm(inspectionType) {
    const { taskId, itemId, itemControlType } = taskInfo;
    const params = {
      taskId,
      itemId,
      itemControlType,
      inspectionType,
      declarerId: headerDS.current.get('workerId'),
      declarer: headerDS.current.get('worker'),
      declaredDate: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      workerId: headerDS.current.get('workerId'),
      worker: headerDS.current.get('worker'),
      workerGroupId: headerDS.current.get('workerGroupId'),
      workerGroup: headerDS.current.get('workerGroup'),
      prodLineId: headerDS.current.get('prodLineId'),
      prodLineCode: headerDS.current.get('prodLineCode'),
      workcellId: headerDS.current.get('workcellId'),
      workcellCode: headerDS.current.get('workcellCode'),
      equipmentId: headerDS.current.get('equipmentId'),
      equipmentCode: headerDS.current.get('equipmentCode'),
      calendarDay: moment(queryDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
      calendarShiftCode: queryDS.current.get('shift'),
      autoFeedbackResult: 0,
      taskQcDocLineDtoList: [{ batchQty: reportBatchQtyRef.current }],
    };
    const res = await createTaskQcDoc([params]);
    if (getResponse(res)) {
      notification.success({
        message: '报检成功',
      });
      reportModal.close();
    }
  }

  function handlePerformance() {
    window.open(
      `/pub/lmes/report-performance?${encodeURIComponent(
        JSON.stringify(queryDS.current.get('workerObj'))
      )}`
    );
    setShowMoreBtn(false);
  }

  function handleByProduct() {
    if (isEmpty(taskInfo)) {
      notification.warning({
        message: '请先选择任务',
      });
      return;
    }
    productModal = Modal.open({
      key: 'byProduct',
      title: '副产品报工',
      className: styles['jc-task-report-by-product-modal'],
      footer: null,
      children: (
        <ByProductModal
          taskInfo={taskInfo}
          taskType={taskType}
          moInfo={moInfo}
          showInputArr={showByInputArr}
          showMainUom={showMainUom}
          makeLotNumber={makeLotNumber}
          organizationId={orgObj?.organizationId}
          onHistoryClick={handleShowHistoryModal}
          secondUomShow={secondUomShow()}
          converseValueShow={converseValueShow}
          onOk={handleByProductModalOk}
          onCancel={handleByProductModalCancel}
        />
      ),
    });
  }

  async function handleByProductModalOk(itemInfo, list, wmObj) {
    const paramsArr = [
      {
        organizationId: orgObj.organizationId,
        organizationCode: orgObj.organizationCode,
        itemControlType: itemInfo.itemControlType,
        itemOutputType: 'BYPRODUCT',
        itemId: itemInfo.itemId,
        itemCode: itemInfo.itemCode,
        uomId: itemInfo.uomId,
        uom: itemInfo.uom,
        taskId: taskInfo.taskId,
        taskNum: taskInfo.taskNum,
        taskStatus: taskInfo.taskStatus,
        executeTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        workerId: headerDS.current.get('workerId'),
        worker: headerDS.current.get('worker'),
        workerGroupId: headerDS.current.get('workerGroupId'),
        workerGroup: headerDS.current.get('workerGroup'),
        prodLineId: headerDS.current.get('prodLineId'),
        prodLineCode: headerDS.current.get('prodLineCode'),
        workcellId: headerDS.current.get('workcellId'),
        workcellCode: headerDS.current.get('workcellCode'),
        equipmentId: headerDS.current.get('equipmentId'),
        equipmentCode: headerDS.current.get('equipmentCode'),
        calendarDay: moment(queryDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
        calendarShiftCode: queryDS.current.get('shift'),
        warehouseId: wmObj?.warehouseId,
        warehouseCode: wmObj?.warehouseCode,
        wmAreaId: wmObj?.wmAreaId,
        wmAreaCode: wmObj?.wmAreaCode,
        remark: wmObj?.remark,
        submitOutputLineVoList: list,
      },
    ];
    if (isReturn) {
      const { taskId, taskNum } = taskInfo;
      const { itemId, itemCode } = itemInfo;
      const _list = list.slice();
      _list.map((item) => {
        const _item = item;
        if (showInputArr.findIndex((i) => i === 'ok') === -1) {
          delete _item.executeQty;
        }
        if (showInputArr.findIndex((i) => i === 'ng') === -1) {
          delete _item.executeNgQty;
        }
        if (showInputArr.findIndex((i) => i === 'scrapped') === -1) {
          delete _item.scrappedQty;
        }
        if (showInputArr.findIndex((i) => i === 'rework') === -1) {
          delete _item.reworkQty;
        }
        if (showInputArr.findIndex((i) => i === 'pending') === -1) {
          delete _item.pendingQty;
        }
        return _item;
      });
      const params = {
        taskId,
        taskNum,
        itemCode,
        itemId,
        executeTime: moment(new Date()).format(DEFAULT_DATE_FORMAT),
        workerId: headerDS.current.get('workerId'),
        worker: headerDS.current.get('worker'),
        workerGroupId: headerDS.current.get('workerGroupId'),
        workerGroup: headerDS.current.get('workerGroup'),
        prodLineId: headerDS.current.get('prodLineId'),
        prodLineCode: headerDS.current.get('prodLineCode'),
        workcellId: headerDS.current.get('workcellId'),
        workcellCode: headerDS.current.get('workcellCode'),
        equipmentId: headerDS.current.get('equipmentId'),
        equipmentCode: headerDS.current.get('equipmentCode'),
        calendarDay: moment(queryDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
        calendarShiftCode: queryDS.current.get('shift'),
        itemOutputType: 'BYPRODUCT',
        returnTaskOutputDetailDtoList: _list,
      };
      setSubmitLoading(true);
      const res = await returnTask([params]);
      setSubmitLoading(false);
      if (getResponse(res)) {
        notification.success({
          message: '退回成功',
        });
        productModal.close();
      }
    } else {
      setSubmitLoading(true);
      const res = await submitTaskByProduct(paramsArr);
      setSubmitLoading(false);
      if (getResponse(res)) {
        notification.success({
          message: '提交成功',
        });
        productModal.close();
      }
    }
  }

  function handleByProductModalCancel() {
    productModal.close();
  }

  return (
    <div className={styles['jc-task-report']}>
      <div className={styles['jc-task-report-header']}>
        <div className={styles['header-left']}>
          <img src={LogoImg} alt="" />
        </div>
        <div className={styles['header-right']}>
          <span className={styles['date-time']}>{timeComponent}</span>
          {shiftShow && (
            <span className={styles['class-type']}>
              <Select disabled dataSet={queryDS} name="shift" />
            </span>
          )}
        </div>
      </div>
      <Header
        headerDS={headerDS}
        avator={avator}
        reportType={reportType}
        workerLock={workerLock}
        prodLineLock={prodLineLock}
        resourceType={resourceType}
        operationLock={operationLock}
        onQuery={handleQueryChange}
        onLockChange={handleLockClick}
      />
      <div className={styles['jc-task-report-content']}>
        {!isEmpty(taskInfo) && (
          <ReportInfo
            taskInfo={taskInfo}
            moInfo={moInfo}
            moNull={moNull}
            isReturn={isReturn}
            taskTypeName={docObj.taskTypeName}
          />
        )}
        {!isEmpty(taskInfo) && taskType && (
          <ReportItem
            taskType={taskType}
            taskInfo={taskInfo}
            taskDS={taskDS}
            lotNumber={lotNumber}
            tagList={tagList}
            tagTotal={tagTotal}
            hideFlag={hideFlag}
            showMainUom={showMainUom}
            makeLotNumber={makeLotNumber}
            isReturn={isReturn}
            qcTypeList={qcTypeList}
            tagRef={tagRef}
            lotRef={lotRef}
            secondUomShow={secondUomShow()}
            converseValueShow={converseValueShow}
            defaultReportTypeArr={defaultReportTypeArr}
            // onQcTypeChange={handleQcTypeChange}
            onShowHistoryModal={handleShowHistoryModal}
            onLotInput={handleLotInput}
            onTagInput={handleTagInput}
            onQtyChange={handleQtyChange}
            onDelLot={handleDelLot}
            onTagInputChange={handleTagInputChange}
            onTagDel={handleTagDel}
            showInputArr={showInputArr}
          />
        )}
      </div>
      <Footer
        footerExtraBtnArr={footerExtraBtnArr}
        loginCheckArr={loginCheckArr}
        isReturn={isReturn}
        showMoreBtn={showMoreBtn}
        onChangeLogin={handleChangeLogin}
        onStart={handleStart}
        onSubmit={handleSubmit}
        onRemarkClick={handleRemark}
        onReset={handleReset}
        onClose={handleExit}
        onRejectedMaterial={handleRejectedMaterial}
        onFeeding={handleFeeding}
        onPQC={handlePQC}
        onModelInspection={handleModelInspection}
        onDrawing={handleDrawing}
        onPause={handlePause}
        onSwitchMode={handleSwitchMode}
        onMore={handleShowMore}
        onInstruction={handleInstruction}
        onReport={handleReport}
        onPerformance={handlePerformance}
        onReturnSubmit={handleReturnSubmit}
        onByProduct={handleByProduct}
      />
      {submitLoading && <Loading />}
    </div>
  );
};

export default formatterCollections({
  code: ['jc.taskReport', 'jc.common'],
})((props) => TaskReport(props));
