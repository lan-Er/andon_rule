/**
 * @Description: 进出炉报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-04-26 10:11:08
 * @LastEditors: yu.na
 */

import React, { createRef, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DataSet, Modal } from 'choerodon-ui/pro';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import { queryIndependentValueSet, userSetting, queryLovData } from 'hlos-front/lib/services/api';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import {
  moveInWip,
  moveOutWip,
  registerWip,
  getWip,
  queryTagThing,
  getTaskItemForWip,
  getDetail,
} from '@/services/onePieceFlowReportService';
import { queryTaskItem } from '@/services/taskService';
import {
  packWipPrepare,
  packWipClean,
  packWipInspection,
  getIdentifyBarcode,
  getTagThing,
  getFurnaceBatch,
  nitrideRelease,
  checkContainerNum,
} from '@/services/inOutFurnaceReportService';
import { LoginDS, QueryDS } from '@/stores/inOutFurnaceReportDS';
import LoginModal from './LoginModal';
import SubHeader from './SubHeader';
import Footer from './Footer';
import SelectArea from './SelectArea';
import MainLeft from './MainLeft';
import MainRight from './MainRight/index';
import styles from './index.less';

const loginFactory = () => new DataSet(LoginDS());
const queryFactory = () => new DataSet(QueryDS());

let modal = null;
let taskmodal = null;
let tagModal = null;
const modalKey = Modal.key();
const snRef = createRef();
const containerRef = createRef();
const lotRef = createRef();
const tagRef = createRef();

const InOutFurnaceReport = ({ history }) => {
  const loginDS = useDataSet(loginFactory, InOutFurnaceReport);
  const queryDS = useDataSet(queryFactory);

  const [shiftList, setShiftList] = useState([]); // 班次列表数据
  const [loginData, setLoginData] = useState({}); // 登录弹窗选择的登录信息
  const [showActiveSelect, changeShowActiveSelect] = useState(false); // 是否展示报工类型列表 默认不展示
  const [initialActiveTypeList, setInitialActiveTypeList] = useState([]); // 初始报工类型列表
  const [activeSelectList, setActiveSelectList] = useState([]); // 报工类型列表
  const [currentActive, setCurrentActive] = useState({}); // 当前选中的报工类型
  const [snDisabled, setSnDisabled] = useState(true); // sn号输入框是否禁用
  const [operationLock, setOperationLock] = useState(false); // 工序lov是否锁定
  const [rightList, setRightList] = useState([]); // 右侧列表数据
  const [leftData, setLeftData] = useState({}); // 左侧信息
  const [tagData, setLeftTagData] = useState({}); // 左侧标签信息
  const [detailList, setDetailList] = useState([]); // 明细列表
  const [currenTask, setCurrentTask] = useState({}); // 当前选中的task
  const [rightInspectList, setRightInspectList] = useState([]); // 已检验列表
  const [qcResultList, setQcResultList] = useState([]);
  const [prepareBindList, setPrepareBindList] = useState([]);
  const [registQty, setRegistQty] = useState(null); // 注册类型时 输入的注册数量
  const [showSupplierLov, setShowSupplierLov] = useState(false); // 准备类型时 是否展示供应商lov输入框
  const [workerDisabled, setWorkerDisabled] = useState(false); // 登录弹窗操作工是否禁用
  const [submitLoading, setSubmitLoading] = useState(false); // 提交loading

  useEffect(() => {
    // 获取初始报工类型列表数据
    async function queryActiveTypeList() {
      const res = await queryIndependentValueSet({
        lovCode: 'LMES.TREATMENT_TYPE',
      });
      if (res) {
        setInitialActiveTypeList(res);
      }
      return res;
    }
    async function init() {
      let _workerDisabled = false;
      const resArr = await Promise.all([
        await queryIndependentValueSet({
          lovCode: 'LMDS.SHIFT_CODE', // 获取班次数据
        }),
        await userSetting({ defaultFlag: 'Y' }), // 获取用户默认设置
        await queryIndependentValueSet({ lovCode: 'LMES.TAG_TYPE' }),
      ]);
      if (resArr) {
        if (resArr[0]) {
          setShiftList(resArr[0]);
        }
        if (resArr[1] && resArr[1].content && resArr[1].content[0]) {
          const {
            workerId,
            workerCode,
            workerName,
            fileUrl,
            workcellId,
            workcellCode,
            workcellName,
            meOuId,
            meOuCode,
            meOuName,
          } = resArr[1].content[0];
          if (workerId) {
            loginDS.current.set('workerObj', {
              workerId,
              workerCode,
              workerName,
              fileUrl,
            });
            _workerDisabled = true;
            setWorkerDisabled(true);
          }
          loginDS.current.set('organizationId', meOuId);
          loginDS.current.set('organizationCode', meOuCode);
          loginDS.current.set('organizationName', meOuName);
          queryDS.current.set('organizationId', meOuId);
          if (workcellCode) {
            const workcellRes = await queryLovData({
              lovCode: 'LMDS.WORKCELL',
              workcellCode,
              organizationId: meOuId,
            });
            if (workcellRes && workcellRes.content && workcellRes.content[0]) {
              const list = await queryActiveTypeList();
              const currentWorkcell = workcellRes.content.find(
                (i) => i.workcellCode === workcellCode
              );
              changeWorkcell(currentWorkcell, list);
            } else {
              loginDS.current.set('workcellObj', {
                workcellId,
                workcellCode,
                workcellName,
              });
            }
          }
        }
        if (resArr[2] && Array.isArray(resArr[2])) {
          setQcResultList(resArr[2]);
        }
      }
      queryActiveTypeList();
      handleShowLoginModal(_workerDisabled);
    }

    init();
  }, []);

  useDataSetEvent(queryDS, 'update', ({ name, record }) => {
    if (name === 'ruleFlag') {
      setShowSupplierLov(record.get('ruleFlag'));
    }
  });

  /**
   * 登录弹窗
   */
  function handleShowLoginModal(disabled) {
    if (showActiveSelect) {
      changeShowActiveSelect(false);
    }
    modal = Modal.open({
      key: 'lmes-in-out-furnace-report-login-modal',
      title: '登录',
      className: styles['lmes-in-out-furnace-report-login-modal'],
      children: (
        <LoginModal
          onLogin={handleLogin}
          ds={loginDS}
          workerDisabled={disabled}
          onExit={handleExit}
          onWorkcellChange={handleLoginWorkcellChange}
        />
      ),
      footer: null,
    });
  }

  /**
   * 确认登录
   */
  async function handleLogin() {
    const validateValue = await loginDS.validate(false, false);
    if (!validateValue) return;
    setLoginData(loginDS.current.toJSONData());
    modal.close();
  }

  /**
   * 登录弹窗工位改变
   * @param {*} rec 选中工位
   */
  function handleLoginWorkcellChange(rec) {
    if (rec) {
      changeWorkcell(rec, initialActiveTypeList);
    }
  }

  /**
   * 退出进出炉报工页面
   */
  function handleExit() {
    history.push('/workplace');
    closeTab('/pub/lmes/in-out-furnace-report');
  }

  /**
   * 登录弹窗 修改工位
   * 需要根据工位返回的 activityType 字段 设置报工类型列表数据
   * @param {Object} rec 选中的工位数据
   * @param {Array} typeList 初始的报工类型列表
   */
  function changeWorkcell(rec, typeList) {
    const arr = typeList;
    const {
      workcellId,
      workcellCode,
      workcellName,
      prodLineId,
      prodLineCode,
      prodLineName,
      activityType,
    } = rec;
    loginDS.current.set('workcellObj', {
      workcellId,
      workcellCode,
      workcellName,
      prodLineId,
      prodLineCode,
      prodLineName,
    });
    if (activityType) {
      const typeArr = activityType.split(',');
      const list = [];
      typeArr.forEach((i) => {
        const typeObj = arr.find((t) => t.value === i);
        if (!isEmpty(typeObj)) {
          list.push({
            value: i,
            meaning: typeObj?.meaning,
          });
        }
      });
      setActiveSelectList(list);
      if (list[0]) {
        setCurrentActive({
          value: list[0].value,
          meaning: list[0].meaning,
        });
      }
    } else {
      setActiveSelectList(arr);
      if (arr[0]) {
        setCurrentActive({
          value: arr[0].value,
          meaning: arr[0].meaning,
        });
      }
    }
  }

  /**
   * 锁定/解锁 工序lov
   */
  function handleLock() {
    setOperationLock(!operationLock);
  }

  /**
   * 工序lov修改 查询左侧数据
   * @param {Object} rec 当前选中的工序
   */
  function handleOperationChange(rec) {
    if (rec) {
      setSnDisabled(false);
      if (currentActive.value !== 'IN' && currentActive.value !== 'OUT') {
        queryLeftData(rec);
      }
    } else if (!snDisabled) {
      setSnDisabled(true);
    }
  }

  /**
   * 选中报工类型
   * 1. 需要默认带出之前选中的工序 不同类型的工序Lov 值集可能不同
   * 2. 进站出站时 需要默认查询右侧数据
   * 3. 需要改变选中类型/未选中类型的样式
   * @param {import('react').EventHandler} e event
   * @param {Object} rec 选中的报工类型
   */
  function handleActiveSelect(e, rec) {
    if (rec.value === currentActive.value) return;
    handleReset();
    setCurrentActive(rec);

    const { operationObj, moOperationObj } = queryDS.current.data;
    const currentOperation = !isEmpty(operationObj) ? operationObj : moOperationObj;
    if (rec.value === 'IN' || rec.value === 'OUT') {
      if (!isEmpty(operationObj) || !isEmpty(moOperationObj)) {
        queryDS.current.set('operationObj', currentOperation);
      }
      handleQueryInOrOutList('inner');
    } else {
      queryDS.current.set('moOperationObj', currentOperation);
    }

    if (e) e.stopPropagation();
    const list = [];
    activeSelectList.forEach((i) => {
      if (i.value === rec.value) {
        list.push({
          ...i,
          active: true,
        });
      } else {
        list.push({
          ...i,
          active: false,
        });
      }
    });
    setActiveSelectList(list);
    changeShowActiveSelect(false);
  }

  async function handleQueryDefaultFurnace(rec) {
    const res = await getFurnaceBatch({
      calendarDate: moment(loginData.calendarDay).format(DEFAULT_DATETIME_FORMAT),
      documentType: rec.documentTypeCode,
      operation: queryDS.current.get('moOperationName'),
      itemCode: rec.itemCode,
      equipment: loginData?.workcellCode,
    });
    if (res && res.traceNum) {
      queryDS.current.set('furnaceLot', res.traceNum);
    }
  }

  async function queryReadyOperation(rec) {
    const res = await queryLovData({
      lovCode: 'LMES.MO_OPERATION',
      operationCode: 'Ready',
      moId: rec.moId,
    });
    if (res && res.content && res.content.length === 1) {
      queryDS.current.set('moOperationObj', res.content[0]);
      queryLeftData(res.content[0]);
    }
  }

  /**
   * 根据所选工位请求站内数据
   * @param {String} type 页签类型 为inner或者attention
   */
  async function handleQueryInOrOutList(type) {
    // 根据所选工位请求站内数据 type为inner或者attention
    if (type === 'inner') {
      const { workcellId, workcellCode } = loginDS.current.toJSONData();
      queryRightListByWorkcell(workcellId, workcellCode);
    } else {
      const { workcellId, workcellCode } = queryDS.current.toJSONData();
      if (workcellId) {
        queryRightListByWorkcell(workcellId, workcellCode);
      } else {
        setRightList([]);
      }
    }
  }

  /**
   * 进站出站时 根据工位获取右侧列表展示数据
   * @param {*} workcellId 工位Id
   * @param {*} workcellCode 工位code
   */
  async function queryRightListByWorkcell(workcellId, workcellCode) {
    const { organizationId, organizationCode } = loginDS.current.toJSONData();
    const res = await getWip({
      organizationId,
      organizationCode,
      workcellId,
      workcellCode,
    });
    if (getResponse(res) && Array.isArray(res)) {
      setRightList(res);
    }
  }

  /**
   * 点击报工类型选择框 显示报工类型列表
   */
  function handleShowActiveSelect() {
    changeShowActiveSelect(!showActiveSelect);
  }

  /**
   * 页面底部重置按钮
   */
  function handleReset() {
    queryDS.current.set('snCode', null);
    queryDS.current.set('moObj', null);
    queryDS.current.set('snNumber', null);
    queryDS.current.set('containerNumber', null);
    queryDS.current.set('furnaceLot', null);
    setRightList([]);
    setLeftData({});
    setLeftTagData({});
    setRightInspectList([]);
    setCurrentTask({});
    setDetailList([]);
    setPrepareBindList([]);
    // setCurrentQty(0);
    setRegistQty(null);
  }

  /**
   * Sn码输入回车事件
   * @param {import('react').EventHandler} e event
   */
  async function handleSnChange(e) {
    e.persist();
    if (e.keyCode === 13) {
      const val = e.target.value;
      if (currentActive.value === 'REGISTER') {
        setLeftTagData({ tagCode: val });
        handleSelectTag({ tagCode: val });
      } else {
        const tagRes = await queryTagThing({
          tagCode: val,
          wmsOrganizationId: loginDS.current.get('organizationId'),
          tagThingType: 'THING',
        });
        if (tagRes && Array.isArray(tagRes)) {
          if (tagRes.length === 1) {
            handleSelectTag(tagRes[0]);
          } else if (tagRes.length > 1) {
            handleShowSelectTagModal(tagRes);
          }
        }
      }
    }
  }

  /**
   * 输入sn号后返回多条标签时 需要选中一条要操作的标签
   * @param {Array} arr 返回的多条标签
   * @param {Object} data 左侧信息
   * @param {String} val 当前输入的sn号
   */
  function handleShowSelectTagModal(arr) {
    tagModal = Modal.open({
      key: modalKey,
      title: '标签列表',
      className: styles['lmes-one-piece-flow-report-login-modal'],
      children: (
        <div>
          {arr.map((i) => {
            return (
              <p key={i.tagThingId}>
                <a style={{ fontSize: '22px' }} onClick={() => handleSelectTag(i)}>
                  {i.tagCode}
                </a>
              </p>
            );
          })}
        </div>
      ),
      footer: null,
    });
  }

  /**
   * 选中标签后执行提交/重新查新
   * @param {Object} rec 选中的标签
   * @param {Object} data 左侧的信息
   */
  async function handleSelectTag(rec) {
    if (tagModal) {
      tagModal.close();
    }
    let _leftData = { ...leftData };
    const { tagId, tagCode, quantity } = rec;
    let tagInfo = {};
    if (currentActive.value !== 'REGISTER') {
      tagInfo = {
        tagId,
        tagCode,
        executeQty: quantity,
      };
    }
    if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      _leftData = await queryInOrOutLeftData(tagCode);
      tagRef.current.focus();
    }
    if (!isEmpty(_leftData)) {
      queryDetailData(_leftData);
      let submitRes = {};
      const params = getSubmitData(_leftData, tagInfo, tagCode);
      if (currentActive.value === 'IN') {
        submitRes = await moveInWip(params);
      } else if (currentActive.value === 'OUT') {
        submitRes = await moveOutWip(params);
      } else if (currentActive.value === 'REGISTER') {
        submitRes = await registerWip(params);
      }
      if (getResponse(submitRes)) {
        notification.success({
          message: `${currentActive.meaning}成功`,
        });
        queryDS.current.set('snCode', null);
        // 提交成功 重新查询数据
        // 如果提交的工序为末工序 不重新查询数据
        if (_leftData.lastOperationFlag) return;
        if (currentActive.value === 'REGISTER') {
          queryLeftData();
        } else {
          queryInOrOutLeftData(tagCode);
        }
        const queryRes = await getWip({
          organizationId: params?.organizationId,
          organizationCode: params?.organizationCode,
          taskId: _leftData.taskId,
          taskNum: _leftData.taskNum,
        });
        if (getResponse(queryRes) && Array.isArray(queryRes)) {
          setRightList(queryRes);
        }
      }
    }
  }

  /**
   * 查询左侧部分展示信息
   * @param {Object} rec 当前选中的工序
   */
  async function queryLeftData(rec) {
    let _operationId = null;
    if (rec) {
      _operationId = rec.operationId;
    } else if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      _operationId = queryDS.current.get('operationId');
    } else {
      _operationId = queryDS.current.get('moOperationId');
    }
    const res = await queryTaskItem({
      moNum: queryDS.current.get('moNum'),
      organizationId: loginDS.current.get('organizationId'),
      operationId: _operationId,
      moQueryFlag: 'Y',
      taskTypeCode: 'OPERATION_TASK',
    });
    if (getResponse(res) && res.content) {
      if (res.content.length > 1) {
        if (!isEmpty(currenTask)) {
          const idx = res.content.findIndex((i) => i.taskItemLineId === currenTask.taskItemLineId);
          if (idx >= 0) {
            handleSelectTask(res.content[idx]);
          }
          return;
        }
        taskmodal = Modal.open({
          key: modalKey,
          title: '任务列表',
          className: styles['lmes-one-piece-flow-report-login-modal'],
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
      }
    }
  }

  /**
   * 选中要执行的任务
   * @param {Object} rec 有多条任务时选中的标签/只有一个任务时直接使用
   */
  function handleSelectTask(rec) {
    if (taskmodal) {
      taskmodal.close();
    }
    setCurrentTask(rec);
    setLeftData(rec);
    queryDS.current.set('taskId', rec.taskId);
    if (currentActive.value === 'PREPARE' || currentActive.value === 'BIND') {
      handleQueryDefaultFurnace(rec);
    }
  }

  /**
   * 查询并返回左侧展示信息(进站出站)
   * 其他类型获取task数据的接口为getTaskItemForWip
   * @param {String} val 当前输入的sn号
   * @returns leftData
   */
  async function queryInOrOutLeftData(val) {
    const res = await getTaskItemForWip({
      organizationId: loginDS.current.get('organizationId'),
      operationId: queryDS.current.get('operationId'),
      tagCode: val,
      taskTypeCode: 'OPERATION_TASK',
    });
    if (getResponse(res) && res) {
      queryDS.current.set('taskId', res.taskId);
      setLeftData(res);
      setLeftTagData(res);
      return res;
    }
    return {};
  }

  /**
   * 进站出站时 工位改变 查询工位相关的列表数据
   * @param {Object} rec 选中工位
   */
  function handleWorkcellChange(rec) {
    if (rec) {
      queryRightListByWorkcell(rec.workcellId, rec.workcellCode);
    } else {
      setRightList([]);
    }
  }

  /**
   * 获取明细数据
   * @param {Object} data 左侧展示的信息
   */
  async function queryDetailData(data = {}) {
    const res = await getDetail({
      organizationId: loginDS.current.get('organizationId'),
      tagCode: data.tagCode,
      moId: data.moId,
      page: -1,
    });
    if (res && res.content) {
      setDetailList(res.content.reverse());
    }
  }

  /**
   * 获取提交的参数
   * (进站出站输入sn号后直接执行提交 其他类型需要点击提交按钮提交)
   * @param {Object} data 左侧数据
   * @param {Object} tagInfo 标签信息
   * @param {String} val 当前输入的sn号
   * @returns 提交参数
   */
  function getSubmitData(data, tagInfo, val) {
    const {
      organizationId,
      organizationCode,
      workerId,
      worker,
      prodLineId,
      prodLineCode,
      workcellId,
      workcellCode,
      calendarDay,
      calendarShiftCode,
    } = loginDS.current.toJSONData();
    const {
      operationId,
      operationCode,
      moOperationId,
      moOperationCode,
    } = queryDS.current.toJSONData();
    const _operationId = currentActive.value === 'REGISTER' ? moOperationId : operationId;
    const _operationCode = currentActive.value === 'REGISTER' ? moOperationCode : operationCode;
    return {
      organizationId,
      organizationCode,
      operationId: _operationId,
      operationCode: _operationCode,
      workerId,
      worker,
      prodLineId,
      prodLineCode,
      workcellId,
      workcellCode,
      calendarDay: moment(calendarDay).format(DEFAULT_DATETIME_FORMAT),
      calendarShiftCode,
      taskId: data.taskId,
      taskNum: data.taskNum,
      itemId: data.itemId,
      itemCode: data.itemCode,
      wipLineList: !isEmpty(tagInfo)
        ? [
          {
            ...tagInfo,
          },
        ]
        : [
          {
            tagCode: val,
            executeQty: registQty,
          },
        ],
    };
  }

  async function handleTagChange(val, flag) {
    if (!flag) {
      const res = await queryTagThing({
        tagCode: val,
        wmsOrganizationId: loginDS.current.get('organizationId'),
        tagThingType: 'THING',
      });
      if (res && Array.isArray(res)) {
        if (res.length) {
          let repeatFlag = false;
          res.forEach((i) => {
            if (rightList.findIndex((r) => r.tagId === i.tagId) > -1) {
              repeatFlag = true;
            } else {
              i.executeQty = i.quantity;
            }
          });
          if (repeatFlag) {
            notification.warning({
              message: '标签已存在',
            });
          } else {
            queryDS.current.set('tagCode', null);
            setRightList(rightList.concat(res));
          }
        } else {
          notification.warning({
            message: '标签不存在',
          });
        }
      }
    } else {
      const cloneRightInspectList = [...rightInspectList];
      const { defaultQty, qcType } = queryDS.current.toJSONData();
      const meaning = qcResultList.find((i) => i.value === qcType)?.meaning;
      if (cloneRightInspectList.findIndex((i) => i.tagCode === val) > -1) {
        notification.warning({
          message: '标签已存在',
        });
      } else {
        cloneRightInspectList.push({
          executeQty: defaultQty || 0,
          qcType,
          qcTypeMeaning: meaning,
          tagCode: val,
          itemId: leftData?.itemId,
          itemCode: leftData?.itemCode,
          uomId: leftData?.uomId,
          uom: leftData?.uom,
          itemDescription: leftData?.itemDescription,
        });
        setRightInspectList(cloneRightInspectList);
        queryDS.current.set('tagCode', null);
      }
    }
  }

  function getTagIndex(rec, flag) {
    let idx = -1;
    if (flag) {
      idx = rightInspectList.findIndex((i) => i.tagCode === rec.tagCode);
    } else {
      idx = rightList.findIndex((i) => i.tagThingId === rec.tagThingId);
    }
    return idx;
  }

  function handleTagQtyChange(val, rec, flag) {
    const idx = getTagIndex(rec, flag);
    if (idx > -1) {
      const cloneRightList = flag ? [...rightInspectList] : [...rightList];
      cloneRightList.splice(idx, 1, {
        ...rec,
        executeQty: val,
      });
      if (flag) {
        setRightInspectList(cloneRightList);
      } else {
        setRightList(cloneRightList);
      }
    }
  }

  function handleDelTagItem(rec, flag) {
    const idx = getTagIndex(rec, flag);
    if (idx > -1) {
      const cloneRightList = flag ? [...rightInspectList] : [...rightList];
      cloneRightList.splice(idx, 1);
      if (flag) {
        setRightInspectList(cloneRightList);
      } else {
        setRightList(cloneRightList);
      }
    }
  }

  async function handleSubmit() {
    const arr = ['REGISTER', 'IN', 'OUT'];
    if (arr.includes(currentActive.value)) return;
    const {
      organizationId,
      organizationCode,
      workerId,
      worker,
      prodLineId,
      prodLineCode,
      workcellId,
      workcellCode,
      calendarDay,
      calendarShiftCode,
    } = loginDS.current.toJSONData();
    const commonParams = {
      calendarDay: moment(calendarDay).format(DEFAULT_DATETIME_FORMAT),
      calendarShiftCode,
      executeTime: moment().format(DEFAULT_DATETIME_FORMAT),
      organizationCode,
      organizationId,
      prodLineCode,
      prodLineId,
      taskId: leftData?.taskId,
      taskNum: leftData?.taskNum,
      workcellCode,
      workcellId,
      worker,
      workerId,
    };
    let res = {};
    if (currentActive.value === 'PREPARE' || currentActive.value === 'BIND') {
      if (prepareBindList.length) {
        const submitList = [];
        prepareBindList.forEach((i) => {
          submitList.push({
            ...commonParams,
            packTagCode: i.containerNumber,
            itemId: leftData?.itemId,
            itemCode: leftData?.itemCode,
            lineDTOList: [
              {
                executeQty: i.quantity,
                tagCode: i.snNumber,
                traceNum: i.furnaceLot,
              },
            ],
          });
        });
        if (currentActive.value === 'PREPARE') {
          setSubmitLoading(true);
          res = await packWipPrepare(submitList);
          setSubmitLoading(false);
        } else {
          const wipLineList = [];
          prepareBindList.forEach((i) => {
            wipLineList.push({
              executeQty: i.quantity,
              tagCode: i.snNumber,
              traceNumber: i.furnaceLot,
            });
          });
          const bindParams = {
            ...commonParams,
            itemId: leftData?.itemId,
            itemCode: leftData?.itemCode,
            operationId: queryDS.current.get('moOperationId'),
            operationCode: queryDS.current.get('moOperationCode'),
            wipLineList,
          };
          setSubmitLoading(true);
          res = await nitrideRelease(bindParams);
          setSubmitLoading(false);
        }
      } else {
        notification.warning({
          message: '请输入绑定数据',
        });
        return;
      }
    } else if (currentActive.value === 'WASH') {
      if (!rightList.length) return;
      const lineDTOList = [];
      rightList.forEach((i) => {
        const idx = lineDTOList.findIndex((el) => el.itemId === i.itemId);
        if (idx < 0) {
          lineDTOList.push({
            itemCode: i.itemCode,
            // itemControlType: "string",
            itemId: i.itemId,
            uom: i.uom,
            uomId: i.uomId,
            detailDTOList: [
              {
                executeQty: i.executeQty,
                lotId: i.lotId,
                lotNumber: i.lotNumber,
                tagCode: i.tagCode,
                tagId: i.tagId,
              },
            ],
          });
        } else {
          lineDTOList[idx].detailDTOList.push({
            executeQty: i.executeQty,
            lotId: i.lotId,
            lotNumber: i.lotNumber,
            tagCode: i.tagCode,
            tagId: i.tagId,
          });
        }
      });
      setSubmitLoading(true);
      res = await packWipClean({
        ...commonParams,
        lineDTOList,
      });
      setSubmitLoading(false);
    } else if (currentActive.value === 'INSPECT') {
      if (!rightList.length && !rightInspectList.length) return;
      const lineDTOList = [];
      const lineDTOList1 = [];
      rightList.forEach((i) => {
        const idx = lineDTOList1.findIndex((el) => el.itemId === i.itemId);
        if (idx < 0) {
          lineDTOList1.push({
            itemCode: leftData?.itemCode,
            // itemControlType: "string",
            itemId: leftData?.itemId,
            uom: i.uom,
            uomId: i.uomId,
            detailDTOList: [
              {
                issuedOkQty: i.executeQty,
                lotId: i.lotId,
                lotNumber: i.lotNumber,
                tagCode: i.tagCode,
                tagId: i.tagId,
              },
            ],
          });
        } else {
          lineDTOList1[idx].detailDTOList.push({
            issuedOkQty: i.executeQty,
            lotId: i.lotId,
            lotNumber: i.lotNumber,
            tagCode: i.tagCode,
            tagId: i.tagId,
          });
        }
      });
      rightInspectList.forEach((i) => {
        const idx = lineDTOList.findIndex((el) => el.itemId === i.itemId);
        if (idx < 0) {
          lineDTOList.push({
            itemCode: i.itemCode,
            // itemControlType: "string",
            itemId: i.itemId,
            uom: i.uom,
            uomId: i.uomId,
            detailDTOList: [
              {
                executeQty: i.executeQty,
                executeNgQty: i.executeNgQty,
                reworkQty: i.reworkQty,
                scrappedQty: i.scrappedQty,
                pendingQty: i.pendingQty,
                lotId: i.lotId,
                lotNumber: i.lotNumber,
                tagCode: i.tagCode,
                tagId: i.tagId,
              },
            ],
          });
        } else {
          lineDTOList[idx].detailDTOList.push({
            executeQty: i.executeQty,
            executeNgQty: i.executeNgQty,
            reworkQty: i.reworkQty,
            scrappedQty: i.scrappedQty,
            pendingQty: i.pendingQty,
            lotId: i.lotId,
            lotNumber: i.lotNumber,
            tagCode: i.tagCode,
            tagId: i.tagId,
          });
        }
      });
      const submitList = [];
      if (lineDTOList.length) {
        submitList.push({
          ...commonParams,
          inspectionFlag: true,
          lineDTOList,
        });
      }
      if (lineDTOList1.length) {
        submitList.push({
          ...commonParams,
          inspectionFlag: false,
          lineDTOList: lineDTOList1,
        });
      }
      setSubmitLoading(true);
      res = await packWipInspection(submitList);
      setSubmitLoading(false);
    }
    if (getResponse(res)) {
      notification.success({
        message: `${currentActive.meaning}成功`,
      });
      setPrepareBindList([]);
      setRightInspectList([]);
      setRightList([]);
      if (leftData.lastOperationFlag) return;
      queryLeftData();
    }
  }

  async function handleUnload() {
    // const unloadWipLineDTOList = [];
    // const params = {
    //   calendarDay: moment(calendarDay).format(DEFAULT_DATETIME_FORMAT),
    //   calendarShiftCode,
    //   executeTime: moment().format(DEFAULT_DATETIME_FORMAT),
    //   organizationCode,
    //   organizationId,
    //   prodLineCode,
    //   prodLineId,
    //   taskId: leftData?.taskId,
    //   taskNum: leftData?.taskNum,
    //   workcellCode,
    //   workcellId,
    //   worker,
    //   workerId,
    //   unloadWipLineDTOList: [
    //     {
    //       tagId,
    //       tagCode,
    //     }
    //   ]
    // };
  }

  async function handlePrepareInputKeyDown(e, type) {
    if (e.keyCode === 13) {
      const { snNumber, containerNumber, furnaceLot } = queryDS.current.toJSONData();
      const obj = {
        snNumber: type === 'snNumber' ? e.target.value : snNumber,
        containerNumber: type === 'containerNumber' ? e.target.value : containerNumber,
        furnaceLot: type === 'furnaceLot' ? e.target.value : furnaceLot,
      };
      if (type === 'snNumber' && queryDS.current.get('ruleFlag')) {
        const res = await getIdentifyBarcode({
          barcodeText: e.target.value,
          identifyRuleClass: 'TAG',
          identifyRuleType: 'IN',
          partyId: queryDS.current.get('supplierId'),
          organizationId: queryDS.current.get('organizationId'),
        });
        if (getResponse(res) && Array.isArray(res) && res[0]) {
          if (typeof res[0].tagCode === 'string') {
            queryDS.current.set('snNumber', res[0]?.tagCode);
          } else if (typeof res[0].tagCode === 'object' && res[0].tagCode !== null) {
            queryDS.current.set('snNumber', res[0]?.tagCode?.tagCode);
          }
          if (currentActive.value === 'PREPARE') {
            queryDS.current.set('containerNumber', res[0]?.containerCode);
            obj.containerNumber = res[0].containerCode;
          } else if (currentActive.value === 'BIND') {
            queryDS.current.set('furnaceLot', res[0]?.containerCode);
            obj.furnaceLot = res[0].containerCode;
          }
          obj.snNumber = res[0].tagCode;
        }
      }
      const flag =
        (obj.snNumber &&
          obj.containerNumber &&
          obj.furnaceLot &&
          currentActive.value === 'PREPARE') ||
        (obj.snNumber && obj.furnaceLot && currentActive.value === 'BIND');
      if (!flag) {
        if (type === 'snNumber') {
          containerRef.current.focus();
        } else if (type === 'containerNumber') {
          lotRef.current.focus();
        } else if (type === 'furnaceLot') {
          snRef.current.focus();
        }
        return;
      }

      if (prepareBindList.findIndex((i) => i.snNumber === obj.snNumber) > -1) {
        notification.warning({
          message: 'SN号重复录入',
        });
        return;
      }
      const containerObj = prepareBindList.find((i) => i.containerNumber === obj.containerNumber);
      if (!isEmpty(containerObj)) {
        notification.warning({
          message: `容器${containerObj.containerNumber}已装载标签${containerObj.snNumber}`,
        });
        return;
      }
      const res = await checkContainerNum({
        tagStatusList: 'EMPTY',
        tagCode: obj.containerNumber,
        tagType: 'COMMON',
        wmsOrganizationId: loginDS.current.get('organizationId'),
      });
      if (res && res.content && res.content[0]) {
        const quantity = await queryPrepareSnData(obj.snNumber);
        if (quantity !== 'none') {
          obj.quantity = quantity;
          setPrepareBindList(prepareBindList.concat(obj));
          queryDS.current.set('snNumber', null);
          queryDS.current.set('containerNumber', null);
          snRef.current.focus();
        }
      } else {
        notification.warning({
          message: '容器状态不符',
        });
        containerRef.current.focus();
      }
    }
  }

  async function queryPrepareSnData(val) {
    const res = await getTagThing({
      tagCode: val,
    });
    if (res && res[0]) {
      return res[0].quantity;
    } else {
      notification.warning({
        message: '标签不存在',
      });
      return 'none';
    }
  }

  function handlePrepareItemDel(idx) {
    const clonePrepareBindList = [...prepareBindList];
    clonePrepareBindList.splice(idx, 1);
    setPrepareBindList(clonePrepareBindList);
  }

  function handleMoChange(rec) {
    if (rec && currentActive.value === 'PREPARE') {
      queryReadyOperation(rec);
    }
  }

  /**
   * 注册数据变化
   * @param {Number} val
   */
  function handleRegistQtyChange(val) {
    setRegistQty(val);
  }

  return (
    <div className={styles['lmes-in-out-furnace-report']}>
      <CommonHeader title="进出炉报工" />
      {!isEmpty(loginData) && <SubHeader data={loginData} shiftList={shiftList} />}
      <div className={styles.content}>
        <SelectArea
          ds={queryDS}
          tagRef={tagRef}
          snDisabled={snDisabled}
          currentActive={currentActive}
          showActiveSelect={showActiveSelect}
          activeSelectList={activeSelectList}
          operationLock={operationLock}
          onLock={handleLock}
          registQty={registQty}
          onActiveSelect={handleActiveSelect}
          onShowActiveSelect={handleShowActiveSelect}
          onOperactionChange={handleOperationChange}
          onSnChange={handleSnChange}
          onMoChange={handleMoChange}
          onRegistQtyChange={handleRegistQtyChange}
        />
        <div className={styles.main}>
          {!isEmpty(leftData) ? (
            <MainLeft
              currentActive={currentActive}
              data={leftData}
              tagData={tagData}
              detailList={detailList}
            />
          ) : null}
          {!isEmpty(leftData) ? (
            <MainRight
              ds={queryDS}
              snRef={snRef}
              containerRef={containerRef}
              lotRef={lotRef}
              currentActive={currentActive}
              list={rightList}
              loginData={loginData}
              leftData={leftData}
              inspectedList={rightInspectList}
              bindList={prepareBindList}
              showSupplierLov={showSupplierLov}
              onQueryInOrOutList={handleQueryInOrOutList}
              onWorkcellChange={handleWorkcellChange}
              onTagChange={handleTagChange}
              onTagQtyChange={handleTagQtyChange}
              onDelTagItem={handleDelTagItem}
              onDelPrepareItem={handlePrepareItemDel}
              // onPrepareSnChange={handlePrepareSnChange}
              onPrepareInputKeyDown={handlePrepareInputKeyDown}
            />
          ) : null}
        </div>
      </div>
      <Footer
        workerDisabled={workerDisabled}
        onWorkerChange={handleShowLoginModal}
        onExit={handleExit}
        onSubmit={handleSubmit}
        onUnload={handleUnload}
      />
      {submitLoading && <Loading />}
    </div>
  );
};

export default InOutFurnaceReport;
