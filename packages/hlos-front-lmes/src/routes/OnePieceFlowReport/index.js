/**
 * @Description: 单件流报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 15:11:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState, useRef, createRef } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Modal, DataSet, Button, TextField, Form, Lov } from 'choerodon-ui/pro';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
// import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import {
  queryIndependentValueSet,
  userSetting,
  queryLovData,
  queryFileByDirectory,
} from 'hlos-front/lib/services/api';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import { LoginDS, QueryDS, UnbindDS } from '@/stores/onePieceFlowReportDS';
import {
  queryTaskItem,
  // queryTagThing,
  queryIssueItem,
  issueTasks,
  getLastestDrawing,
  getLastestEsop,
  returnTaskInputBatch,
} from '@/services/taskService';
import {
  registerWip,
  moveInWip,
  moveOutWip,
  loadWip,
  getWip,
  getTaskItemForWip,
  packWip,
  unloadWip,
  bindWipProdTag,
  getTagForPack,
  getDetail,
  getInspectionTemplate,
  getExceptionAssign,
  getTemplateLine,
  inspectWip,
  getPackingTagCode,
  getUnbindTagInfo,
  inventoryFilter,
  queryTagThing,
} from '@/services/onePieceFlowReportService';

import SubHeader from './SubHeader/index';
import SelectArea from './SelectArea/index';
import MainLeft from './MainLeft/index';
import MainRight from './MainRight/index';
import Footer from './Footer/index';
import LoginModal from './LoginModal/index';
import InspectModal from './InspectModal/index';
import styles from './index.less';

let modal = null;
let taskmodal = null;
let tagModal = null;
let inspectModal = null;
const snRef = createRef();
const productRef = createRef();
const modalKey = Modal.key();
const preCode = 'lmes.onePieceFlowReport';

const loginFactory = () => new DataSet(LoginDS());
const queryFactory = () => new DataSet(QueryDS());
const unbindFactory = () => new DataSet(UnbindDS());

const OnePieceFlowReport = ({ history, tagList, lotList, quantityList, dispatch }) => {
  const loginDS = useDataSet(loginFactory, OnePieceFlowReport);
  const queryDS = useDataSet(queryFactory);
  const unbindDS = useDataSet(unbindFactory);

  const [showActiveSelect, changeShowActiveSelect] = useState(false); // 是否展示报工类型列表 默认不展示
  const [activeSelectList, setActiveSelectList] = useState([]); // 报工类型列表
  const [currentActive, setCurrentActive] = useState({}); // 当前选中的报工类型
  const [loginData, setLoginData] = useState({}); // 登录弹窗选择的登录信息
  const [operationLock, setOperationLock] = useState(false); // 工序lov是否锁定
  const [snDisabled, setSnDisabled] = useState(true); // sn号输入框是否禁用
  const [prodDisabled, setProdDisabled] = useState(true); // 产品码是否禁用
  const [leftData, setLeftData] = useState({}); // 左侧信息
  const [tagData, setLeftTagData] = useState({}); // 左侧标签信息
  const [rightList, setRightList] = useState([]); // 右侧列表数据
  const [shiftList, setShiftList] = useState([]); // 班次列表数据
  const [outTagInfo, setOutTagInfo] = useState({}); // 外层标签信息
  const [outTagList, setOutTagList] = useState([]); // 外层标签列表
  const [outTagCode, setOutTagCode] = useState(null); // 外层标签编码
  const [detailList, setDetailList] = useState([]); // 明细列表
  const [bindObj, setBindObj] = useState({}); // 绑定的sn和产品码
  const [issueTabs, setIssueTabs] = useState([]); // 投料类型展示的tab页签
  const [issueData, setIssueData] = useState({}); // 投料信息
  const [currenTask, setCurrentTask] = useState({}); // 当前选中的task
  const [isSubmit, setIsSubmit] = useState(false); // 是否已经提交
  const [initialActiveTypeList, setInitialActiveTypeList] = useState([]); // 初始报工类型列表
  const [inspectionList, setInspectList] = useState([]); // 检验类型时右侧展示的列表数据
  const [inspectionData, setInspectData] = useState({}); // 检验数据
  const [exceptionList, setExceptList] = useState([]); // 异常列表数据
  const [registQty, setRegistQty] = useState(null); // 注册类型时 输入的注册数量
  // const [qcOkQty, setQcOkQty] = useState(null); // 合格数量
  // const [qcNgQty, setQcNgQty] = useState(null); // 不合格数量
  const [resultList, setResultList] = useState([]); // 判定结果列表数据
  const [currentResult, setCurrentResult] = useState({}); // 当前选中的判定结果
  const [limitLength, setLimitLength] = useState(0); // 限制扫描标签的长度
  const [rightUnbindList, setRightUnbindList] = useState([]); // 解绑时右侧展示的列表数据
  // 检验时 如果重新输入sn号 且存在未提交的数据 需要重新提交 如果提交报错
  // 根据这个属性 判断是忽略本次提交 直接进入下一次
  const [firstInspectSubmit, setFirstInspectSubmit] = useState(true);
  const [packSumitFlag, setPackSumitFlag] = useState(false);
  const [submitLoading, setSumitLoading] = useState(false);
  const [autoPrint, setAutoPrint] = useState(false);

  const imgRef = useRef();
  const instructionRef = useRef();

  useEffect(() => {
    async function init() {
      const resArr = await Promise.all([
        await queryIndependentValueSet({
          lovCode: 'LMDS.SHIFT_CODE', // 获取班次数据
        }),
        await userSetting({ defaultFlag: 'Y' }), // 获取用户默认设置
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
          loginDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
            fileUrl,
          });
          loginDS.current.set('organizationId', meOuId);
          loginDS.current.set('organizationCode', meOuCode);
          loginDS.current.set('organizationName', meOuName);
          queryDS.current.set('organizationId', meOuId);
          unbindDS.current.set('organizationId', meOuId);
          if (workcellCode) {
            const workcellRes = await queryLovData({
              lovCode: 'LMDS.WORKCELL',
              workcellCode,
              organizationId: meOuId,
            });
            if (workcellRes && workcellRes.content && workcellRes.content[0]) {
              const list = await queryActiveTypeList();
              changeWorkcell(workcellRes.content[0], list);
            } else {
              loginDS.current.set('workcellObj', {
                workcellId,
                workcellCode,
                workcellName,
              });
            }
          }
        }
      }
    }
    // 获取检验结果列表数据
    async function queryResultList() {
      const res = await queryIndependentValueSet({
        lovCode: 'LMES.QC_RESULT',
      });
      if (res && Array.isArray(res)) {
        const passResult = res.find((i) => i.value === 'OK');
        setResultList(res);
        setCurrentResult(passResult);
      }
    }

    init();
    queryActiveTypeList();
    handleShowLoginModal();
    queryResultList();
  }, []);

  useEffect(() => {
    const newCode = queryDS.current.get('snCode');
    if (newCode) {
      quertTag();
    }
    async function quertTag() {
      const tagRes = await queryTagThing({
        tagCode: newCode,
        wmsOrganizationId: loginDS.current.get('organizationId'),
        tagThingType: 'THING',
      });
      if (tagRes && Array.isArray(tagRes)) {
        if (tagRes.length === 1) {
          handleSelectTag(tagRes[0], leftData, newCode);
        } else if (tagRes.length > 1) {
          handleShowSelectTagModal(tagRes, leftData, newCode);
        } else {
          notification.warning({
            message: '暂无数据',
          });
        }
      }
    }
  }, [packSumitFlag]);

  // 获取初始报工类型列表数据
  async function queryActiveTypeList() {
    const res = await queryIndependentValueSet({
      lovCode: 'LMDS.ACTIVE_TYPE',
    });
    if (res) {
      setInitialActiveTypeList(res);
    }
    return res;
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
    queryDS.current.set('productCode', null);
    queryDS.current.set('outTagCode', null);
    setLeftData({});
    setLeftTagData({});
    setRightList([]);
    setOutTagInfo({});
    setOutTagList([]);
    setOutTagCode(null);
    setDetailList([]);
    setBindObj({});
    setIssueData({});
    setIssueTabs([]);
    setCurrentTask({});
    setIsSubmit(false);
    // setQcOkQty(null);
    // setQcNgQty(null);
    setInspectList([]);
    setExceptList([]);
    setInspectData({});
    setRegistQty(null);
    setPackSumitFlag(true);
    setAutoPrint(false);
    const passResult = resultList.find((i) => i.value === 'OK');
    setCurrentResult(passResult);
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
        const { meaning } = arr.find((t) => t.value === i) || {};
        list.push({
          value: i,
          meaning,
        });
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
   * 选中报工类型
   * 1. 需要默认带出之前选中的工序 不同类型的工序Lov 值集可能不同
   * 2. 进站出站时 需要默认查询右侧数据
   * 3. 需要改变选中类型/未选中类型的样式
   * @param {import('react').EventHandler} e event
   * @param {Object} rec 选中的报工类型
   */
  function handleActiveSelect(e, rec) {
    handleReset();
    setCurrentActive(rec);

    if (rec.value === 'UNBIND') {
      setSnDisabled(false);
    } else {
      const { operationObj, moOperationObj, moObj } = queryDS.current.data;
      const currentOperation = !isEmpty(operationObj) ? operationObj : moOperationObj;
      // setOutTagCode(null);
      if (rec.value === 'REGISTER' || rec.value === 'LOAD') {
        if (!isEmpty(operationObj) || !isEmpty(moOperationObj)) {
          queryDS.current.set('moOperationObj', currentOperation);
          if (!isEmpty(currentOperation) && !isEmpty(moObj)) {
            queryLeftData(currentOperation);
          }
        }
      } else if (rec.value !== 'REGISTER' && rec.value !== 'LOAD') {
        queryDS.current.set('operationObj', currentOperation);
      }
      if (rec.value === 'IN' || rec.value === 'OUT') {
        handleQueryInOrOutList('inner');
      }
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

  /**
   * 登录弹窗
   */
  function handleShowLoginModal() {
    if (showActiveSelect) {
      changeShowActiveSelect(false);
    }
    modal = Modal.open({
      key: 'lmes-one-piece-flow-report-login-modal',
      title: '登录',
      className: styles['lmes-one-piece-flow-report-login-modal'],
      children: (
        <LoginModal
          onLogin={handleLogin}
          ds={loginDS}
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
   * 退出单件流报工页面
   */
  function handleExit() {
    history.push('/workplace');
    closeTab('/pub/lmes/one-piece-flow-report');
  }

  /**
   * 锁定/解锁 工序lov
   */
  function handleLock() {
    setOperationLock(!operationLock);
  }

  /**
   * 工序lov修改
   * @param {Object} rec 当前选中的工序
   */
  function handleOperationChange(rec) {
    if (rec) {
      setSnDisabled(false);
      if (currentActive.value === 'REGISTER' || currentActive.value === 'LOAD') {
        // 注册和上线根据mo和工序查询task数据
        queryLeftData(rec);
      }
    } else if (!snDisabled) {
      setSnDisabled(true);
    }
    setOutTagList([]);
  }

  /**
   * 查询左侧部分展示信息
   * @param {Object} rec 当前选中的工序
   */
  async function queryLeftData(rec) {
    let _operationId = null;
    if (rec) {
      _operationId = rec.operationId;
    } else if (currentActive.value === 'REGISTER' || currentActive.value === 'LOAD') {
      _operationId = queryDS.current.get('moOperationId');
    } else {
      _operationId = queryDS.current.get('operationId');
    }
    getTaskItem(queryDS.current.get('moNum'), _operationId);
  }

  async function getTaskItem(moNum, operationId, val, tagRes) {
    const res = await queryTaskItem({
      moNum,
      organizationId: loginDS.current.get('organizationId'),
      operationId,
      moQueryFlag: 'Y',
      taskTypeCode: loginDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
    });
    if (getResponse(res) && res.content) {
      if (res.content.length > 1) {
        if (!isEmpty(currenTask)) {
          const idx = res.content.findIndex((i) => i.taskItemLineId === currenTask.taskItemLineId);
          if (idx >= 0) {
            handleSelectTask(res.content[idx], val, tagRes);
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
                    <a
                      style={{ fontSize: '22px' }}
                      onClick={() => handleSelectTask(i, val, tagRes)}
                    >
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
        handleSelectTask(res.content[0], val, tagRes);
      }
    }
  }

  /**
   * 选中要执行的任务
   * @param {Object} rec 有多条任务时选中的标签/只有一个任务时直接使用
   */
  async function handleSelectTask(rec, val, tag) {
    if (taskmodal) {
      taskmodal.close();
    }
    setCurrentTask(rec);
    setLeftData(rec);
    queryDS.current.set('taskId', rec.taskId);
    if (currentActive.value === 'REGISTER') {
      const { organizationId, organizationCode } = loginDS.current.toJSONData();
      const queryRes = await getWip({
        organizationId,
        organizationCode,
        taskId: rec.taskId,
        taskNum: rec.taskNum,
      });
      if (getResponse(queryRes) && Array.isArray(queryRes)) {
        setRightList(queryRes);
      }
    }
    if (loginDS.current.get('reworkFlag')) {
      setLeftData({
        ...rec,
        tagCode: tag?.tagCode,
        tagId: tag?.tagId,
      });
      if (!isEmpty(rec) && currentActive.value === 'PACK') {
        if (outTagList.findIndex((i) => i.tagId === tag.tagId) >= 0) {
          notification.warning({
            message: '标签重复',
          });
          return;
        }
        const newTagObj = {
          ...rec,
          tagCode: tag?.tagCode,
          tagId: tag?.tagId,
          executeQty: tag?.quantity,
        };
        if (packSumitFlag) {
          setOutTagList([newTagObj]);
        } else {
          setOutTagList(outTagList.concat(newTagObj));
        }
        checkOutTagCode(rec);
        queryDS.current.set('snCode', null);
        snRef.current.focus();
      }
      initialMainListAndData(rec);
      afterSnChangeAndSumit(rec, tag, tag?.tagCode, val);
    }
  }

  async function checkOutTagCode(res) {
    if (!queryDS.current.get('outerTagCode')) {
      const codeRes = await getPackingTagCode({
        organizationId: loginData?.organizationId,
        packingRule: res?.packingRule,
      });
      if (codeRes && codeRes.packingTagCode) {
        queryDS.current.set('outerTagCode', codeRes.packingTagCode);
      }
      // showNextBox();
      handleBoxModalOk();
    }
  }

  /**
   * 查询并返回左侧展示信息(除了注册和上线之外)
   * 其他类型获取task数据的接口为getTaskItemForWip
   * @param {String} val 当前输入的sn号
   * @param {Object} tagRes 选中的标签信息
   * @returns leftData
   */
  async function queryLeftDataByOther(val, tagRes) {
    const res = await getTaskItemForWip({
      organizationId: loginDS.current.get('organizationId'),
      operationId:
        currentActive.value === 'REGISTER' || currentActive.value === 'LOAD'
          ? queryDS.current.get('moOperationId')
          : queryDS.current.get('operationId'),
      tagCode: val,
      taskTypeCode: loginDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
    });
    if (getResponse(res) && res) {
      if (!isEmpty(res) && currentActive.value === 'PACK') {
        if (outTagList.findIndex((i) => i.tagId === res.tagId) >= 0) {
          notification.warning({
            message: '标签重复',
          });
          return;
        }
        if (packSumitFlag) {
          setOutTagList([
            {
              ...res,
              executeQty: tagRes?.quantity,
            },
          ]);
        } else {
          setOutTagList(
            outTagList.concat({
              ...res,
              executeQty: tagRes?.quantity,
            })
          );
        }
        checkOutTagCode(res);
        queryDS.current.set('snCode', null);
      }
      queryDS.current.set('taskId', res.taskId);
      setLeftData(res);
      setLeftTagData(res);
      snRef.current.focus();
      return res;
    }
    return {};
  }

  /**
   * Sn码输入回车事件
   * @param {import('react').EventHandler} e event
   */
  async function handleSnChange(e) {
    e.persist();
    if (e.keyCode === 13) {
      const val = e.target.value;
      // 查询左侧数据 leftData & leftTagData
      const _leftData = { ...leftData };
      if (currentActive.value === 'LOAD') {
        // 上线要根据sn号 查询标签数据
        const res = await queryTagThing({
          tagCode: val,
          wmsOrganizationId: loginDS.current.get('organizationId'),
          tagThingType: 'THING',
        });
        if (getResponse(res) && Array.isArray(res)) {
          if (res.length === 1) {
            handleSelectTag(res[0], _leftData, val);
          } else if (res.length > 1) {
            handleShowSelectTagModal(res, _leftData, val);
          } else {
            notification.warning({
              message: '暂无数据',
            });
          }
          queryDS.current.set('snCode', null);
          snRef.current.focus();
        }
      } else if (currentActive.value === 'UNBIND') {
        const res = await getUnbindTagInfo({
          tagCode: val,
          organizationId: loginDS.current.get('organizationId'),
        });
        if (res && res.content && res.content[0]) {
          const { tagCode, tagId, moId, organizationId } = res.content[0];
          setLeftData(res.content[0]);
          if (moId) {
            unbindDS.current.set('moId', moId);
          }
          if (organizationId) {
            unbindDS.current.set('organizationId', organizationId);
          }
          setLeftTagData({
            tagCode,
            tagId,
          });
          queryDetailData({
            tagCode,
            moId,
          });
        }
        snRef.current.focus();
      } else if (currentActive.value !== 'REGISTER') {
        if (currentActive.value === 'PACK') {
          if (packSumitFlag) {
            setOutTagList([]);
            setOutTagInfo({});
            setOutTagCode(null);
            queryDS.current.set('outerTagCode', null);
            setPackSumitFlag(false);
            setAutoPrint(false);
          } else if (limitLength && outTagList.length >= limitLength) {
            const rule = JSON.parse(leftData.executeRule);
            if (leftData.executeRule && rule && rule.auto_submit) {
              if (rule.auto_submit.includes('SUBMIT')) {
                packSubmit(rule.auto_submit.includes('PRINT'));
              } else {
                notification.warning({
                  message: '装箱已满',
                });
              }
            }
            return;
          }
          snRef.current.focus();
        } else if (currentActive.value === 'INSPECT') {
          if (!isEmpty(leftData) && firstInspectSubmit) {
            setFirstInspectSubmit(false);
            handleSubmit();
            return;
          }
          queryDS.current.set('snCode', null);
          snRef.current.focus();
        } else if (currentActive.value === 'BIND') {
          productRef.current.focus();
        }
        const tagRes = await queryTagThing({
          tagCode: val,
          wmsOrganizationId: loginDS.current.get('organizationId'),
          tagThingType: 'THING',
        });
        if (tagRes && Array.isArray(tagRes)) {
          if (tagRes.length === 1) {
            handleSelectTag(tagRes[0], _leftData, val);
          } else if (tagRes.length > 1) {
            handleShowSelectTagModal(tagRes, _leftData, val);
          } else {
            notification.warning({
              message: '暂无数据',
            });
          }
        }
      } else if (currentActive.value === 'REGISTER') {
        setLeftTagData({ tagCode: val });
        handleSelectTag({}, _leftData, val);
      }
    }
  }

  function handleShowMoModal(val, tagRes) {
    Modal.open({
      key: 'lmes-one-piece-flow-report-mo-modal',
      title: 'MO',
      className: styles['lmes-one-piece-flow-report-pack-modal'],
      children: <Lov dataSet={queryDS} name="moObj" />,
      onOk: () => handleMoModalOk(val, tagRes),
    });
  }

  async function handleMoModalOk(val, tagRes) {
    const { moNum, operationId } = queryDS.current.toJSONData();
    getTaskItem(moNum, operationId, val, tagRes);
  }

  /**
   * 输入sn号后返回多条标签时 需要选中一条要操作的标签
   * @param {Array} arr 返回的多条标签
   * @param {Object} data 左侧信息
   * @param {String} val 当前输入的sn号
   */
  function handleShowSelectTagModal(arr, data, val) {
    tagModal = Modal.open({
      key: modalKey,
      title: '标签列表',
      className: styles['lmes-one-piece-flow-report-login-modal'],
      children: (
        <div>
          {arr.map((i) => {
            return (
              <p key={i.tagThingId}>
                <a style={{ fontSize: '22px' }} onClick={() => handleSelectTag(i, data, val)}>
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
   * @param {String} val 当前输入的sn号
   */
  async function handleSelectTag(rec, data, val) {
    if (tagModal) {
      tagModal.close();
    }
    setLeftTagData(rec);
    const reworkShowMoArr = ['PACK', 'IN', 'OUT', 'ISSUE', 'BIND', 'INSPECT'];
    const reworkShowMoFlag =
      !isEmpty(rec) &&
      loginDS.current.get('reworkFlag') &&
      reworkShowMoArr.includes(currentActive.value);
    let _leftData = { ...data };
    const { tagId, tagCode, quantity } = rec;
    let tagInfo = {
      tagId,
      tagCode,
    };
    if (currentActive.value === 'REGISTER') {
      tagInfo = {};
    } else if (currentActive.value !== 'LOAD') {
      tagInfo = {
        ...tagInfo,
        executeQty: quantity,
      };
      _leftData = await queryLeftDataByOther(tagCode || val, rec);
      if (!isEmpty(_leftData)) {
        queryDetailData(_leftData);
      } else if (reworkShowMoFlag) {
        handleShowMoModal(val, rec);
        return;
      }
      initialMainListAndData(_leftData);
    }
    afterSnChangeAndSumit(_leftData, tagInfo, tagCode, val);
  }

  /**
   * 根据报工类型初始化数据属性
   * @param {Object} data 左侧信息
   */
  function initialMainListAndData(data) {
    if (currentActive.value === 'BIND') {
      setProdDisabled(false);
      productRef.current.focus();
    } else if (currentActive.value === 'ISSUE' && !isEmpty(data)) {
      // 投料页面 需要查询右侧数据(标签/批次/数量 判断显示页签和获取数量类型的数据)
      queryIssueData(data);
    } else if (currentActive.value === 'INSPECT') {
      setInspectList([]);
      setExceptList([]);
      // setQcOkQty(tagInfo.executeQty);
      queryInspectTabList(true, data);
      setFirstInspectSubmit(true);
    }
  }

  /**
   * sn号变化后 自动提交 提交后刷新数据
   * @param {Object} data 左侧信息
   * @param {Object} tagInfo 标签信息
   * @param {Object} tagCode 标签编码
   * @param {Object} val 当前sn编码框输入的值
   */
  async function afterSnChangeAndSumit(data, tagInfo, tagCode, val) {
    let submitRes = {};
    const arr = ['PACK', 'BIND', 'ISSUE', 'INSPECT'];
    if (!arr.includes(currentActive.value) && !isEmpty(data)) {
      const params = getSubmitData(data, tagInfo, tagCode || val);
      if (currentActive.value === 'REGISTER') {
        submitRes = await registerWip(params);
      } else if (currentActive.value === 'LOAD') {
        submitRes = await loadWip(params);
      } else if (currentActive.value === 'IN') {
        submitRes = await moveInWip(params);
      } else if (currentActive.value === 'OUT') {
        submitRes = await moveOutWip(params);
      }
      if (getResponse(submitRes)) {
        notification.success({
          message: `${currentActive.meaning}成功`,
        });
        queryDS.current.set('snCode', null);
        snRef.current.focus();
        // 提交成功 重新查询数据
        // 如果为末工序 不重新查询数据
        if (data.lastOperationFlag) return;
        if (currentActive.value === 'REGISTER' || currentActive.value === 'LOAD') {
          queryLeftData();
        } else {
          queryLeftDataByOther(tagCode || val);
        }
        const queryRes = await getWip({
          organizationId: params?.organizationId,
          organizationCode: params?.organizationCode,
          taskId: data.taskId,
          taskNum: data.taskNum,
        });
        if (getResponse(queryRes) && Array.isArray(queryRes)) {
          setRightList(queryRes);
        }
      }
      if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
        snRef.current.focus();
      }
    }
  }

  /**
   * 获取提交的参数
   * (注册 上线 进站出站输入sn号后直接执行提交 其他类型需要点击提交按钮提交)
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
    const _operationId =
      currentActive.value === 'REGISTER' || currentActive.value === 'LOAD'
        ? moOperationId
        : operationId;
    const _operationCode =
      currentActive.value === 'REGISTER' || currentActive.value === 'LOAD'
        ? moOperationCode
        : operationCode;
    const wipLineList = !isEmpty(tagInfo)
      ? [
          {
            ...tagInfo,
          },
        ]
      : [
          {
            tagCode: val,
            executeQty: registQty,
            inspectedResult: data?.wip?.inspectedResult,
          },
        ];
    if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      wipLineList[0].inspectedResult = data?.wip?.inspectedResult;
    }
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
      wipLineList,
    };
  }

  /**
   * 获取解绑类型 右侧展示的列表数据
   * @param {Object} params 查询参数
   */
  async function queryUnBindList(params) {
    const { tagCode, lotNumber, itemIdList } = params;
    const res = await inventoryFilter({
      moId: unbindDS.current.get('moId'),
      assembleTagId: leftData?.tagId,
      tagCode: 'tagCode' in params ? tagCode : unbindDS.current.get('tagCode'),
      lotNumber: 'lotNumber' in params ? lotNumber : unbindDS.current.get('lotNumber'),
      itemIdList: 'itemIdList' in params ? itemIdList : unbindDS.current.get('itemId'),
    });
    if (res && Array.isArray(res)) {
      res.forEach((i) => {
        i.returnedOkQty = i.executeQty;
      });
      setRightUnbindList(res);
    } else {
      notification.warning({
        message: '暂无数据',
      });
    }
  }

  /**
   * 获取投料类型时 右侧展示的列表数据
   * @param {Object} data 左侧信息(leftData)
   */
  async function queryIssueData(data) {
    const issueRes = await queryIssueItem({
      organizationId: loginData.organizationId,
      taskId: data.taskId,
      resourceClass: 'WKC',
      resourceId: loginDS.current.get('workcellId'),
      supplyType: 'PUSH',
    });
    if (issueRes) {
      const tabs = ['quantity'];
      let issueInfo = {};
      if (issueRes.LOT) {
        tabs.unshift('lot');
        // eslint-disable-next-line prefer-destructuring
        issueInfo = issueRes.LOT[0];
      }
      if (issueRes.TAG) {
        tabs.unshift('tag');
        if (isEmpty(issueInfo)) {
          // eslint-disable-next-line prefer-destructuring
          issueInfo = issueRes.TAG[0];
        }
      }
      if (issueRes.QUANTITY) {
        if (isEmpty(issueInfo)) {
          // eslint-disable-next-line prefer-destructuring
          issueInfo = issueRes.QUANTITY[0];
        }
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            quantityList: issueRes.QUANTITY.map((i) => ({
              ...i,
              itemControlType: 'QUANTITY',
              issuedOkQty: 0,
            })),
          },
        });
      }
      setIssueTabs(tabs);
      setIssueData(issueInfo);
    }
  }

  /**
   * 获取明细数据
   * @param {Object} data 左侧展示的信息
   */
  async function queryDetailData(data = { wip: {} }) {
    const res = await getDetail({
      organizationId: loginDS.current.get('organizationId'),
      tagCode: data.tagCode || data.wip.tagCode,
      moId: data.moId || data.wip.moId,
      page: -1,
    });
    if (res && res.content) {
      setDetailList(res.content.reverse());
    }
  }

  /**
   * 新打开一个窗口展示图纸/工艺文件
   * @param {String} url 图纸/工艺文件连接
   */
  function handleOpen(url) {
    window.open(url);
  }

  /**
   * 图纸/工艺文件 改变图片大小
   * @param {Boolean} flag true为变大 false为变小
   * @param {import('react').Ref} ref imgRef/instructionRef
   */
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

  /**
   * 获取并展示图纸
   */
  async function handleDraw() {
    const { executeRule } = leftData;
    let url = null;
    const urlList = [];
    if (executeRule && JSON.parse(executeRule) && JSON.parse(executeRule).drawing) {
      const rule = JSON.parse(executeRule);
      if (rule.drawing.includes('DOCUMENT')) {
        url = leftData.referenceDocument;
      } else if (
        rule.drawing.includes('ITEM') ||
        rule.drawing.includes('OPERATION') ||
        rule.drawing.includes('DRAWING')
      ) {
        const res = await getLastestDrawing({
          dataRule: rule.drawing,
          itemId: leftData.itemId,
          operationId:
            currentActive.value === 'REGISTER' || currentActive.value === 'LOAD'
              ? queryDS.current.get('moOperationId')
              : queryDS.current.get('operationId'),
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
    }
    if (url || urlList.length) {
      Modal.open({
        key: modalKey,
        closable: true,
        footer: null,
        title: '图纸预览',
        className: styles['lmes-one-piece-flow-report-draw-modal'],
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

  /**
   * 获取并展示工艺文件
   */
  async function handleInstruction() {
    const { executeRule } = leftData;
    let url = null;
    const urlList = [];
    if (executeRule && JSON.parse(executeRule) && JSON.parse(executeRule).esop) {
      const rule = JSON.parse(executeRule);
      if (rule.esop.includes('DOCUMENT')) {
        url = leftData.referenceDocument;
      } else if (
        rule.esop.includes('ITEM') ||
        rule.esop.includes('OPERATION') ||
        rule.esop.includes('ESOP')
      ) {
        const res = await getLastestEsop({
          dataRule: rule.esop,
          itemId: leftData.itemId,
          operationId:
            currentActive.value === 'REGISTER' || currentActive.value === 'LOAD'
              ? queryDS.current.get('moOperationId')
              : queryDS.current.get('operationId'),
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
    }
    if (url || urlList) {
      Modal.open({
        key: modalKey,
        closable: true,
        footer: null,
        title: '工艺文件预览',
        className: styles['lmes-one-piece-flow-report-draw-modal'],
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
                  <Button onClick={() => handleChangeSize(true, instructionRef)}>放大</Button>
                  <Button onClick={() => handleChangeSize(false, instructionRef)}>缩小</Button>
                </div>
                <img
                  ref={(node) => {
                    instructionRef.current = node;
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
        message: '无工艺文件',
      });
    }
  }

  async function packSubmit(autoPrintFlag) {
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
    const { itemId, itemCode, taskId, taskNum } = leftData;
    const { tag = {} } = outTagInfo;
    const { tagId, tagCode } = tag;
    const list = [];
    outTagList.forEach((i) => {
      list.push({
        tagId: i.tagId,
        tagCode: i.tagCode,
        executeQty: tagData.quantity,
      });
    });
    setSumitLoading(true);
    const res = await packWip({
      organizationId,
      organizationCode,
      itemId,
      itemCode,
      taskId,
      taskNum,
      workerId,
      worker,
      prodLineId,
      prodLineCode,
      workcellId,
      workcellCode,
      calendarDay,
      calendarShiftCode,
      outTags: [
        {
          outerTagId: tagId,
          outerTagCode: tagCode || outTagCode,
          innerTags: list,
        },
      ],
    });
    setSumitLoading(false);
    if (getResponse(res)) {
      notification.success({
        message: `${currentActive.meaning}成功`,
      });
      setOutTagList([]);
      setOutTagInfo({});
      setOutTagCode(null);
      queryDS.current.set('outerTagCode', null);
      setPackSumitFlag(true);
      if (autoPrintFlag) {
        setAutoPrint(true);
      }
    }
  }

  /**
   * 底部提交按钮
   */
  async function handleSubmit() {
    if (currentActive.value === 'PACK') {
      if (!outTagList.length) {
        notification.warning({
          message: '请扫描或输入SN号',
        });
        return;
      }
      if (outTagList.length < limitLength) {
        Modal.confirm({
          children: <p>包装未完成，是否提交</p>,
          onOk: async () => {
            packSubmit();
          },
        });
      } else {
        packSubmit();
      }
    } else if (currentActive.value === 'ISSUE') {
      const concatList = tagList.concat(lotList, quantityList);
      const issueTaskItemList = [];
      concatList.forEach((i) => {
        const idx = issueTaskItemList.findIndex((n) => n.itemId === i.itemId);
        const {
          itemId,
          itemCode,
          uomId,
          uom,
          taskItemLineId,
          tagId,
          tagCode,
          lotId,
          lotNumber,
          issuedOkQty,
          itemControlType,
        } = i;
        const { warehouseId, warehouseCode, wmAreId, wmAreaCode, wmUnitId, wmUnitCode } = issueData;
        if (issuedOkQty > 0) {
          if (issueTaskItemList.length && idx >= 0) {
            issueTaskItemList.splice(idx, 1, {
              ...issueTaskItemList[idx],
              lineList: issueTaskItemList[idx].lineList.concat({
                tagId,
                tagCode,
                lotId,
                lotNumber,
                issuedOkQty,
              }),
            });
          } else {
            issueTaskItemList.push({
              itemId,
              itemCode,
              uomId,
              uom,
              taskItemLineId,
              warehouseId,
              warehouseCode,
              wmAreId,
              wmAreaCode,
              wmUnitId,
              wmUnitCode,
              itemControlType,
              lineList: [
                {
                  tagId,
                  tagCode,
                  lotId,
                  lotNumber,
                  issuedOkQty,
                },
              ],
            });
          }
        }
      });
      const {
        organizationId,
        organizationCode,
        prodLineId,
        prodLineCode,
        workerId,
        worker,
        workcellId,
        workcellCode,
      } = loginData;
      setSumitLoading(true);
      const res = await issueTasks({
        taskId: leftData.taskId,
        taskNum: leftData.taskNum,
        organizationId,
        organizationCode,
        prodLineId,
        prodLineCode,
        workerId,
        worker,
        workcellId,
        workcellCode,
        issuedTime: moment().format(DEFAULT_DATETIME_FORMAT),
        calendarDay: loginDS.current.get('calendarDay')
          ? moment(loginDS.current.get('calendarDay')).format(DEFAULT_DATETIME_FORMAT)
          : null,
        calendarShiftCode: loginDS.current.get('calendarShiftCode'),
        assemblyTagId: leftData.tagId,
        assemblyTagCode: leftData.tagCode,
        issueTaskItemList,
      });
      setSumitLoading(false);
      if (getResponse(res)) {
        notification.success({
          message: `${currentActive.meaning}成功`,
        });
        setIsSubmit(!isSubmit);
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            lotList: [],
            tagList: [],
            quantityList: [],
            currentList: [],
          },
        });
        queryIssueData(leftData);
      }
    } else if (currentActive.value === 'INSPECT') {
      const params = {
        organizationId: loginData.organizationId,
        organizationCode: loginData.organizationCode,
        itemId: leftData.itemId,
        itemCode: leftData.itemCode,
        taskId: leftData.taskId,
        taskNum: leftData.taskNum,
        inspectionTemplateType: inspectionData?.inspectionTemplateType,
        templateId: inspectionData?.templateId,
        executeTime: moment().format(DEFAULT_DATETIME_FORMAT),
        wipStatus: leftData?.wip?.wipStatus,
        workerId: loginData.workerId,
        worker: loginData.worker,
        prodLineId: loginData.prodLineId,
        prodLineCode: loginData.prodLineCode,
        workcellId: loginData.workcellId,
        workcellCode: loginData.workcellCode,
        calendarDay: loginData.calendarDay,
        calendarShiftCode: loginData.calendarShiftCode,
        qcResult: currentResult?.value,
        tagOrLotLines: [
          {
            tagId: leftData?.tagId,
            tagCode: leftData?.tagCode,
            qcResult: currentResult?.value,
            qcOkQty:
              currentResult.value === 'OK' || currentActive.value === 'CONCESSION'
                ? leftData?.wip?.wipQty
                : 0,
            qcNgQty: currentResult.value === 'NG' ? leftData?.wip?.wipQty : 0,
            inspectLines: inspectionList,
            exceptionLines: exceptionList.filter((i) => i.checked),
          },
        ],
      };
      setSumitLoading(true);
      const res = await inspectWip(params);
      setSumitLoading(false);
      if (getResponse(res)) {
        notification.success({
          message: `${currentActive.meaning}成功`,
        });
        setLeftData({});
        setLeftTagData({});
        setInspectList([]);
        setExceptList([]);
        const newCode = queryDS.current.get('snCode');
        if (newCode) {
          const tagRes = await queryTagThing({
            tagCode: newCode,
            wmsOrganizationId: loginDS.current.get('organizationId'),
            tagThingType: 'THING',
          });
          if (tagRes && Array.isArray(tagRes)) {
            if (tagRes.length === 1) {
              handleSelectTag(tagRes[0], {}, newCode);
            } else if (tagRes.length > 1) {
              handleShowSelectTagModal(tagRes, {}, newCode);
            } else {
              notification.warning({
                message: '暂无数据',
              });
            }
            queryDS.current.set('snCode', null);
          }
        }
      }
    } else if (currentActive.value === 'UNBIND') {
      Modal.open({
        key: 'lmes-one-piece-flow-report-unbind-modal',
        title: '选择仓库',
        className: styles['lmes-one-piece-flow-report-pack-modal'],
        okText: '提交',
        children: (
          <Form dataSet={unbindDS} labelLayout="placeholder">
            <Lov name="warehouseObj" />
            <Lov name="wmAreaObj" />
          </Form>
        ),
        onOk: handleUnbindModalOk,
      });
    }
  }

  /**
   * 解绑点击提交时 弹出仓库货位选择弹窗 选中后点击确定执行解绑提交操作
   */
  async function handleUnbindModalOk() {
    const checkedList = rightUnbindList.filter((i) => i.checked);
    const submitList = [];
    // taskItemList
    // taskItemLineList
    checkedList.forEach((i) => {
      const {
        organizationId,
        organizationCode,
        taskId,
        taskNum,
        calendarDay,
        calendarShiftCode,
        tagId,
        tagCode,
        itemId,
        itemCode,
        taskItemLineId,
        returnedOkQty,
        lotId,
        lotNumber,
      } = i;
      const obj = {
        organizationId,
        organizationCode,
        taskId,
        taskNum,
        prodLineId: loginData?.prodLineId,
        prodLineCode: loginData?.prodLineCode,
        workcellId: loginData?.workcellId,
        workcellCode: loginData?.workcellCode,
        calendarDay,
        calendarShiftCode,
        workerId: loginData?.workerId,
        worker: loginData?.worker,
        assemblyTagId: leftData?.tagId,
        assemblyTagCode: leftData?.tagCode,
      };

      const idx = submitList.findIndex((s) => s.taskId === i.taskId);
      if (submitList.length && idx > -1) {
        const lIdx = submitList[idx].taskItemList.findIndex((v) => v.itemId === i.itemId);
        if (lIdx > -1) {
          submitList[idx].taskItemList[lIdx].taskItemLineList.push({
            returnedOkQty,
            lotId,
            lotNumber,
            tagId,
            tagCode,
          });
        } else {
          submitList[idx].taskItemList.push({
            itemId,
            itemCode,
            taskItemLineId,
            warehouseId: unbindDS.current.get('warehouseId'),
            warehouseCode: unbindDS.current.get('warehouseCode'),
            wmAreaId: unbindDS.current.get('wmAreaId'),
            wmAreaCode: unbindDS.current.get('wmAreaCode'),
            taskItemLineList: [
              {
                returnedOkQty,
                lotId,
                lotNumber,
                tagId,
                tagCode,
              },
            ],
          });
        }
      } else {
        submitList.push({
          ...obj,
          taskItemList: [
            {
              itemId,
              itemCode,
              taskItemLineId,
              warehouseId: unbindDS.current.get('warehouseId'),
              warehouseCode: unbindDS.current.get('warehouseCode'),
              wmAreaId: unbindDS.current.get('wmAreaId'),
              wmAreaCode: unbindDS.current.get('wmAreaCode'),
              taskItemLineList: [
                {
                  returnedOkQty,
                  lotId,
                  lotNumber,
                  tagId,
                  tagCode,
                },
              ],
            },
          ],
        });
      }
    });
    setSumitLoading(true);
    const res = await returnTaskInputBatch(submitList);
    setSumitLoading(false);
    if (getResponse(res)) {
      queryUnBindList({});
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
   * 登录弹窗工位改变
   * @param {*} rec 选中工位
   */
  async function handleLoginWorkcellChange(rec) {
    if (rec) {
      if (isEmpty(initialActiveTypeList)) {
        const list = await queryActiveTypeList();
        changeWorkcell(rec, list);
      } else {
        changeWorkcell(rec, initialActiveTypeList);
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

  // /**
  //  * 切换到装箱类型时 先弹出箱码弹窗
  //  */
  // function showNextBox() {
  //   Modal.open({
  //     key: 'lmes-one-piece-flow-report-pack-modal',
  //     title: '下一箱',
  //     className: styles['lmes-one-piece-flow-report-pack-modal'],
  //     children: (
  //       <TextField
  //         dataSet={queryDS}
  //         name="outerTagCode"
  //         placeholder="请扫描或输入箱码"
  //         suffix={<img src={scanIcon} alt="" />}
  //       />
  //     ),
  //     okCancel: false,
  //     onOk: handleBoxModalOk,
  //   });
  // }

  /**
   * 箱码弹窗确认
   */
  async function handleBoxModalOk() {
    const { outerTagCode } = queryDS.current.data;
    if (!outerTagCode) return false;
    const res = await getTagForPack({
      organizationId: loginDS.current.get('organizationId'),
      tagCode: outerTagCode,
    });
    if (getResponse(res)) {
      setOutTagInfo(res);
      setOutTagCode(outerTagCode);
      if (res.outTagList) {
        setOutTagList(res.outTagList);
      }
      queryDS.current.set('snCode', null);
    }
    snRef.current.focus();
  }

  /**
   * 产品码变化
   * @param {import('react').EventHandler} e event
   */
  async function handleProdChange(e) {
    e.persist();
    if (e.keyCode === 13) {
      snRef.current.focus();
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
      const { itemId, itemCode, taskId, taskNum, tagId, tagCode } = leftData;
      const params = {
        organizationId,
        organizationCode,
        itemId,
        itemCode,
        taskId,
        taskNum,
        workerId,
        worker,
        prodLineId,
        prodLineCode,
        workcellId,
        workcellCode,
        calendarDay,
        calendarShiftCode,
        wipLineList: [
          {
            tagId,
            tagCode,
            productTagCode: e.target.value,
          },
        ],
      };
      const res = await bindWipProdTag(params);
      if (getResponse(res)) {
        setBindObj({
          snCode: queryDS.current.get('snCode'),
          productCode: e.target.value,
        });
      }
    }
  }

  /**
   * 删除装箱列表项
   * @param {Object} rec 要执行删除操作的装箱标签
   */
  function handleDeleteOutTagItem(rec) {
    const idx = outTagList.findIndex((i) => i.tagId === rec.tagId);
    const list = [...outTagList];
    list.splice(idx, 1);
    setOutTagList(list);
  }

  /**
   * 切换检验页签
   */
  async function handleChangeInpectTab(type) {
    if (type === 'inspection') {
      queryInspectTabList(!inspectionList.length);
    } else if (type === 'exception' && !exceptionList.length) {
      const res = await getExceptionAssign({
        sourceType: 'PQC',
        itemId: leftData.itemId,
        operationId: queryDS.current.get('operationId'),
      });
      if (res && Array.isArray(res)) {
        setExceptList(res);
      }
    }
  }

  /**
   * 获取检验页签列表数据
   * @param {Object} data leftData
   */
  async function queryInspectTabList(flag, data) {
    if (flag) {
      const res = await getInspectionTemplate({
        organizationId: loginData.organizationId,
        itemId: data ? data.itemId : leftData.itemId,
        resourceId: loginData.workcellId,
        // operationId: queryDS.current.get('operationId'),
        inspectionTemplateType: 'PQC.ONLINE',
      });
      if (!isEmpty(res) && !res.failed) {
        setInspectData(res);
        const itemRes = await getTemplateLine({
          inspectionTemplateId: res.templateId,
        });
        if (itemRes && itemRes.content) {
          itemRes.content.map((i) => {
            const _i = i;
            _i.qcResult = true;
            return _i;
          });
          setInspectList(itemRes.content);
        }
      } else {
        setInspectList([]);
      }
    }
  }

  /**
   * 选中异常项 修改样式
   * @param {Object} rec 选中的异常项
   */
  function handleExceptionClick(rec) {
    const idx = exceptionList.findIndex((i) => i.exceptionId === rec.exceptionId);
    const cloneList = [...exceptionList];
    if (idx >= 0) {
      cloneList.splice(idx, 1, {
        ...rec,
        checked: !rec.checked,
      });
    }
    setExceptList(cloneList);
  }

  /**
   * 检验项 检验结果修改
   * @param {Number | Boolean} val
   * @param {Object} rec 修改的检验项
   * @param {String} type 修改检验项类型
   */
  function handleInspectionItemChange(val, rec, type) {
    const idx = inspectionList.findIndex((i) => i.inspectionItemId === rec.inspectionItemId);
    const cloneList = [...inspectionList];
    if (idx >= 0) {
      let qcResult = false;
      if (type === 'qcValue' && val <= rec.ucl && val >= rec.lcl) {
        qcResult = true;
      }
      cloneList.splice(idx, 1, {
        ...rec,
        qcResult,
        [type]: val,
      });
    }
    setInspectList(cloneList);
  }

  /**
   * 注册数据变化
   * @param {Number} val
   */
  function handleRegistQtyChange(val) {
    setRegistQty(val);
  }

  // /**
  //  * 合格/不合格数量变化
  //  * @param {Number} val
  //  * @param {String} type 输入框类型
  //  */
  // function handleQcQtyChange(val, type) {
  //   if (type === 'ok') {
  //     setQcOkQty(val);
  //   } else if (type === 'ng') {
  //     setQcNgQty(val);
  //   }
  // }

  /**
   * 当前选中的检验结果
   * @param {Object} rec
   */
  function handleChangeCurrentResult(rec) {
    setCurrentResult(rec);
  }

  /**
   * 当前选中的检验结果
   * @param {Number} value
   */
  function handleLimitChange(value) {
    setLimitLength(value);
  }

  /**
   * 解绑 根据标签/批次查询
   * @param {import('react').EventHandler} e event
   * @param {String} type 输入框类型
   */
  function handleUnbindInputChange(e, type) {
    if (e.keyCode === 13) {
      const val = e.target.value;
      unbindDS.current.set(`${type}`, val || null);
      queryUnBindList({
        [type]: val || null,
      });
    }
  }

  /**
   * 解绑 根据物料查询
   * @param {Array} rec 选中物料
   */
  function handleUnbindItemChange(rec) {
    if (rec) {
      queryUnBindList({
        itemIdList: rec.map((i) => i.componentItemId),
      });
    }
  }

  /**
   *  解绑行操作
   * @param {*} val
   * @param {*} idx 行索引
   * @param {*} type 操作类型
   */
  function handleUnbindLineChange(val, idx, type) {
    const list = [...rightUnbindList];
    list[idx][type] = val;
    setRightUnbindList(list);
  }

  function handleShowUnloadModal() {
    Modal.open({
      key: 'lmes-one-piece-flow-report-unload-modal',
      title: '强制下线',
      className: styles['lmes-one-piece-flow-report-pack-modal'],
      okText: '提交',
      children: (
        <TextField
          dataSet={queryDS}
          name="unloadCode"
          placeholder="请输入或扫描SN号"
          suffix={<img src={scanIcon} alt="" />}
        />
      ),
      onOk: handleUnload,
    });
  }

  /**
   * 强制下线
   */
  async function handleUnload() {
    if (!queryDS.current.get('unloadCode')) return false;
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
    const { itemId, itemCode, taskId, taskNum } = leftData;
    const params = {
      organizationId,
      organizationCode,
      itemId,
      itemCode,
      taskId,
      taskNum,
      workerId,
      worker,
      prodLineId,
      prodLineCode,
      workcellId,
      workcellCode,
      calendarDay,
      calendarShiftCode,
      unloadWipLineDTOList: [
        {
          // tagId,
          tagCode: queryDS.current.get('unloadCode'),
          // executeQty: currentActive.value === 'REGISTER' ? registQty : tagData?.quantity,
        },
      ],
    };
    const res = await unloadWip([params]);
    if (getResponse(res)) {
      notification.success({
        message: `强制下线成功`,
      });
      return true;
    }
    return false;
  }

  function handleInspectModalShow() {
    inspectModal = Modal.open({
      key: 'lmes-one-piece-flow-report-inspect-modal',
      title: '报检',
      className: styles['lmes-one-piece-flow-report-inspect-modal'],
      children: (
        <InspectModal
          organizationId={loginData?.organizationId}
          leftData={leftData}
          loginData={loginData}
          onInspectionModalClose={handleInspectionModalClose}
        />
      ),
      closable: true,
      footer: null,
    });
  }

  function handleInspectionModalClose() {
    inspectModal.close();
  }

  function handleOutTagCodeChange(val) {
    queryDS.current.set('outerTagCode', val);
    setOutTagCode(val);
  }

  return (
    <div className={styles['lmes-one-piece-flow-report']}>
      <CommonHeader title="单件流报工" />
      {!isEmpty(loginData) && <SubHeader data={loginData} shiftList={shiftList} />}
      <div className={styles.content}>
        <SelectArea
          ds={queryDS}
          snRef={snRef}
          productRef={productRef}
          snDisabled={snDisabled}
          prodDisabled={prodDisabled}
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
          onProdChange={handleProdChange}
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
              unbindDS={unbindDS}
              currentActive={currentActive}
              list={rightList}
              outTagInfo={outTagInfo}
              outTagList={outTagList}
              tagCode={outTagCode}
              bindObj={bindObj}
              issueTabs={issueTabs}
              loginData={loginData}
              issueData={issueData}
              leftData={leftData}
              isSubmit={isSubmit}
              autoPrint={autoPrint}
              setAutoPrint={setAutoPrint}
              // qcOkQty={qcOkQty}
              // qcNgQty={qcNgQty}
              currentResult={currentResult}
              resultList={resultList}
              inspectionList={inspectionList}
              exceptionList={exceptionList}
              limitLength={limitLength}
              rightUnbindList={rightUnbindList}
              onQueryInOrOutList={handleQueryInOrOutList}
              onWorkcellChange={handleWorkcellChange}
              onDeleteOutTagItem={handleDeleteOutTagItem}
              onChangeInspectTab={handleChangeInpectTab}
              onExceptionClick={handleExceptionClick}
              onInspectionItemChange={handleInspectionItemChange}
              // onQcQtyChange={handleQcQtyChange}
              onChangeCurrentResult={handleChangeCurrentResult}
              onLimitChange={handleLimitChange}
              onUnbindInputChange={handleUnbindInputChange}
              onUnbindItemChange={handleUnbindItemChange}
              onUnbindLineChange={handleUnbindLineChange}
              onOutTagCodeChange={handleOutTagCodeChange}
            />
          ) : null}
        </div>
      </div>
      <Footer
        onWorkerChange={handleShowLoginModal}
        onExit={handleExit}
        onDraw={handleDraw}
        onDoc={handleInstruction}
        onSubmit={handleSubmit}
        onUnload={handleShowUnloadModal}
        onInspect={handleInspectModalShow}
      />
      {submitLoading && <Loading />}
    </div>
  );
};

export default connect(({ onePieceFlowReport: { lotList, tagList, quantityList } }) => ({
  lotList,
  tagList,
  quantityList,
}))(
  formatterCollections({
    code: [`${preCode}`],
  })(OnePieceFlowReport)
);
