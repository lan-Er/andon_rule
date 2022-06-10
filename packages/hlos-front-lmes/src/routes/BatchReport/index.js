/*
 * @Descripttion: 批量报工
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-22 13:44:22
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Lov, Modal, DataSet, Button, TextField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import { getResponse, filterNullValueObject } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import uuidv4 from 'uuid/v4';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import Time from 'hlos-front/lib/components/Time';
import Loading from 'hlos-front/lib/components/Loading';
import {
  userSetting,
  queryIndependentValueSet,
  queryFileByDirectory,
  // queryLovData,
} from 'hlos-front/lib/services/api';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import prodlineIcon from 'hlos-front/lib/assets/icons/prodline-gray.svg';
import carIcon from 'hlos-front/lib/assets/icons/car-gray.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import orgIcon from 'hlos-front/lib/assets/icons/org.svg';
import { LoginDS, QueryDS } from '@/stores/batchReportDS';
// import codeConfig from '@/common/codeConfig';
import {
  queryTaskItem,
  issueTasks,
  getLastestDrawing,
  getLastestEsop,
  runTask,
  pauseTask,
  submitTaskOutput,
} from '@/services/taskService';
import styles from './style.less';
import ListItem from './ListItem';
import LoginModal from './LoginModal';
import FeedingModal from './FeedingModal';
import ReturnModal from './ReturnModal';
import Footer from './Footer';

let modal = null;
let feedingModal = null;
let returnModal = null;

const loginFactory = () => new DataSet(LoginDS());
const queryFactory = () => new DataSet(QueryDS());
// const { common } = codeConfig.code;

const BatchReport = ({ history }) => {
  const loginDS = useDataSet(loginFactory, BatchReport);
  const queryDS = useDataSet(queryFactory);

  // const loginDS = new DataSet(LoginDS());
  // const queryDS = new DataSet(QueryDS());

  const timeComponent = useMemo(() => <Time />, []);

  const imgRef = useRef();

  const [loginData, setLoginData] = useState({});
  const [checkOptArr, setCheckOptArr] = useState([]);
  const [loginLovType, setLovType] = useState('workcell');
  const [reportList, setReportList] = useState([]);
  const [orgObj, setOrgObj] = useState({});
  const [showFooterBtnArr, setShowFooterBtn] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (loginDS.current) {
      loginDS.current.reset();
      loginDS.fields.get('workcellObj').set('required', true);
      const arr = ['prodline', 'workcell', 'equipment', 'workergroup'];
      const _arr = arr.filter((item) => item !== 'workcell');
      _arr.forEach((arrItem) => {
        loginDS.fields.get(`${arrItem}Obj`).set('required', false);
        loginDS.current.set(`${arrItem}Obj`, null);
      });
    }
    async function defaultSetting() {
      const resArr = await Promise.all([
        userSetting({ defaultFlag: 'Y' }),
        queryIndependentValueSet({
          lovCode: 'LMDS.SHIFT_CODE',
        }),
      ]);
      let ruleArr = [
        {
          key: 'prodline',
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
          key: 'workergroup',
          name: '班组',
        },
      ];
      if (resArr[0] && resArr[0].content && resArr[0].content[0]) {
        const {
          workerId,
          workerCode,
          workerName,
          workcellId,
          workcellCode,
          workcellName,
          fileUrl,
          // prodLineId,
          // prodLineCode,
          // prodLineName,
          // equipmentId,
          // equipmentCode,
          // equipmentName,
          // workerGroupId,
          // workerGroupCode,
          // workerGroupName,
          organizationId,
          organizationCode,
          organizationName,
          executeLoginRule,
          meOuId,
        } = resArr[0].content[0];
        setOrgObj({
          organizationId,
          organizationCode,
          organizationName,
        });
        loginDS.current.set('workerObj', {
          workerId,
          workerCode,
          workerName,
          fileUrl,
        });
        loginDS.current.set('workcellObj', {
          workcellId,
          workcellCode,
          workcellName,
        });
        loginDS.current.set('orgId', meOuId);
        queryDS.current.set('organizationId', meOuId);
        if (executeLoginRule) {
          const newArr = checkLoginRule(executeLoginRule);
          if (newArr.length) {
            ruleArr = newArr;
          }
        }
      }
      // if (resArr[1] && Array.isArray(resArr[1])) {};
      handleLogin(ruleArr);
      setCheckOptArr(ruleArr);
    }
    defaultSetting();
  }, []);

  /**
   * 首次进入页面弹出的登录窗口/底部切换按钮
   */
  function handleLogin(arr) {
    const loginCheckOptArr = arr || checkOptArr;
    modal = Modal.open({
      key: 'login',
      title: '登录',
      className: styles['lmes-batch-report-login-modal'],
      footer: null,
      children: (
        <LoginModal
          ds={loginDS}
          loginCheckArr={loginCheckOptArr}
          lovType={loginLovType}
          onOk={handleLoginOk}
          onRadioChange={handleRadioChange}
          onTypeChange={handleTypeChange}
          onExit={handleExit}
        />
      ),
    });
  }

  /**
   * '其它选项'修改
   */
  async function handleRadioChange(val, arr) {
    loginDS.fields.get(`${val}Obj`).set('required', true);
    const _arr = arr.filter((item) => item.key !== val);
    _arr.forEach((arrItem) => {
      loginDS.fields.get(`${arrItem.key}Obj`).set('required', false);
      loginDS.current.set(`${arrItem.key}Obj`, null);
    });
    const res = await userSetting({
      defaultFlag: 'Y',
    });
    if (getResponse(res) && res && res.content && res.content[0]) {
      if (val === 'prodline') {
        loginDS.current.set(`${val}Obj`, {
          prodLineId: res.content[0].prodLineId,
          prodLineCode: res.content[0].prodLineCode,
          resourceName: res.content[0].prodLineName,
        });
      } else if (val === 'workergroup') {
        loginDS.current.set(`${val}Obj`, {
          workerGroupId: res.content[0].workerGroupId,
          workerGroupCode: res.content[0].workerGroupCode,
          workerGroupName: res.content[0].workerGroupName,
        });
      } else {
        loginDS.current.set(`${val}Obj`, {
          [`${val}Id`]: res.content[0][`${val}Id`],
          [`${val}Code`]: res.content[0][`${val}Code`],
          [`${val}Name`]: res.content[0][`${val}Name`],
        });
      }
    }
    modal.update({
      children: (
        <LoginModal
          ds={loginDS}
          loginCheckArr={arr}
          lovType={loginDS.current.get('other')}
          onOk={handleLoginOk}
          onRadioChange={handleRadioChange}
          onTypeChange={handleTypeChange}
          onExit={handleExit}
        />
      ),
    });
    setLovType(val);
  }

  /**
   * 报工模式修改
   */
  function handleTypeChange(val) {
    // handleReset();
    loginDS.current.set('reportType', val);
    setReportList([]);
  }

  /**
   * 登录弹窗的登录按钮
   */
  async function handleLoginOk() {
    const validateValue = await loginDS.validate(false, false);
    if (!validateValue) return;
    setLoginData(loginDS.current.toJSONData());
    modal.close();
  }

  /**
   * 登录弹窗显示的‘其他选项’列表
   */
  function checkLoginRule(json) {
    const arr = [];
    const rule = JSON.parse(json);
    if (!isEmpty(rule)) {
      if (rule.resource_class) {
        const ruleArr = rule.resource_class.split(',');
        let name = null;
        ruleArr.forEach((i) => {
          if (i === 'PRODLINE') {
            name = '产线';
          } else if (i === 'WORKCELL') {
            name = '工位';
          } else if (i === 'EQUIPMENT') {
            name = '设备';
          } else if (i === 'WORKERGROUP') {
            name = '班组';
          }
          arr.push({
            key: i.toLowerCase(),
            name,
          });
        });
      }
      if (rule.document_class) {
        loginDS.current.set('reportType', rule.document_class);
      }
    }
    return arr;
  }

  /**
   * 查询任务列表
   */
  async function handleSearch(flag) {
    let params = {};
    if (loginDS.current.get('reportType') === 'MO') {
      if (!queryDS.current.get('moNum')) return;
      if (flag && reportList.findIndex((i) => i.moNum === queryDS.current.get('moNum')) > -1)
        {return;}
      params = {
        moNum: queryDS.current.get('moNum'),
        operationId: queryDS.current.get('operationId'),
        organizationId: loginDS.current.get('orgId'),
        moQueryFlag: 'Y',
        taskTypeCode: 'OPERATION_TASK',
      };
    } else if (loginDS.current.get('reportType') === 'TASK') {
      if (!queryDS.current.get('taskNum')) return;
      if (flag && reportList.findIndex((i) => i.taskNum === queryDS.current.get('taskNum')) > -1)
        {return;}
      params = {
        taskNum: queryDS.current.get('taskNum'),
        organizationId: loginDS.current.get('orgId'),
        taskTypeCode: 'OPERATION_TASK',
        // taskTypeCode: queryDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
      };
    }
    if (isEmpty(params)) return;
    setIsLoading(true);
    const res = await queryTaskItem(params);
    setIsLoading(false);
    if (getResponse(res) && res.content) {
      res.content.forEach((i) => {
        const _i = i;
        // _i.checked = true;
        _i.showinputArr = [];

        const rule = i.executeRule && JSON.parse(i.executeRule);
        if (!isEmpty(rule) && rule.report_type) {
          const rArr = rule.report_type.split(',');
          if (rArr.includes('OK')) {
            i.showinputArr.push('processOk');
          }
          if (rArr.includes('NG')) {
            i.showinputArr.push('processNg');
          }
          if (rArr.includes('SCRAPPED')) {
            i.showinputArr.push('scrapped');
          }
          if (rArr.includes('REWORK')) {
            i.showinputArr.push('rework');
          }
          if (rArr.includes('PENDING')) {
            i.showinputArr.push('pending');
          }
        }
      });
      if (flag) {
        setReportList(reportList.concat(...res.content));
      } else {
        setReportList(res.content);
      }
    }
  }

  /**
   * 选中/取消选中任务行
   */
  function handleItemCheck(val, rec) {
    const idx = reportList.findIndex((i) => i.taskItemLineId === rec.taskItemLineId);
    const cloneList = [...reportList];
    if (idx >= 0) {
      cloneList.splice(idx, 1, {
        ...rec,
        checked: val,
      });
    }
    setReportList(cloneList);
  }

  /**
   * 退出
   */
  function handleExit() {
    history.push('/');
    closeTab('/pub/lmes/batch-report');
  }

  /**
   * 重置 - 清空页面未锁定数据
   */
  function handleReset() {
    queryDS.current.reset();
    queryDS.current.set('organizationId', orgObj?.organizationId);
    setReportList([]);
  }

  function checkSelectList(message) {
    if (!reportList.some((i) => i.checked)) {
      notification.warning({
        message: '请先选择任务',
      });
      return false;
    } else if (reportList.filter((i) => i.checked).length > 1) {
      notification.warning({
        message: `只可选择一个任务${message}`,
      });
      return false;
    }
    return true;
  }

  /**
   * 组件
   */
  async function handleFeeding() {
    const flag = checkSelectList('投料');
    if (!flag) return;

    feedingModal = Modal.open({
      key: 'feeding',
      title: '投料',
      className: styles['lmes-batch-report-feeding-modal'],
      movable: true,
      closable: true,
      footer: null,
      children: (
        <FeedingModal
          loginLovType={loginLovType}
          loginDS={loginDS}
          orgObj={orgObj}
          taskInfo={reportList.filter((i) => i.checked)[0]}
          onCancel={handleFeedingModalCancel}
          onFeedingOk={handleFeedingOk}
        />
      ),
    });
  }

  // 确认投料
  async function handleFeedingOk(list) {
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
    const taskInfo = reportList.filter((i) => i.checked)[0];
    const params = {
      organizationId: orgObj.organizationId,
      organizationCode: orgObj.organizationCode,
      taskId: taskInfo.taskId,
      taskNum: taskInfo.taskNum,
      issuedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      workerId: loginDS.current.get('workerId') || '',
      worker: loginDS.current.get('worker') || '',
      prodLineId: loginDS.current.get('prodLineId') || '',
      prodLineCode: loginDS.current.get('prodLineCode') || '',
      equipmentId: loginDS.current.get('equipmentId') || '',
      equipmentCode: loginDS.current.get('equipmentCode') || '',
      workcellId: loginDS.current.get('workcellId') || '',
      workcellCode: loginDS.current.get('workcellCode') || '',
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
   * 组件弹窗取消按钮
   */
  function handleFeedingModalCancel() {
    feedingModal.close();
  }

  /**
   * 退料
   */
  function handleRejectedMaterial() {
    const flag = checkSelectList('进行退料');
    if (!flag) return;

    returnModal = Modal.open({
      key: 'return',
      title: '工单退料',
      className: styles['lmes-batch-report-return-modal'],
      footer: null,
      closable: true,
      destroyOnClose: true,
      style: {
        width: '80%',
      },
      children: (
        <ReturnModal
          calendarDay={loginDS.current.get('date')}
          calendarShiftCode={loginDS.current.get('calendarShiftCode')}
          remark={remark}
          worker={loginDS.current.get('workerObj')}
          workcell={loginDS.current.get('workcellObj')}
          workerGroup={loginDS.current.get('workergroupObj')}
          equipmentObj={loginDS.current.get('equipmentObj')}
          prodLine={loginDS.current.get('prodlineObj')}
          taskInfo={reportList.filter((i) => i.checked)[0]}
          orgObj={orgObj}
          handleCancel={handleReturnModalCancel}
        />
      ),
    });
  }

  /**
   * 退料弹窗取消按钮
   */
  function handleReturnModalCancel() {
    returnModal.close();
  }

  /**
   * 跳转员工实绩
   */
  function handlePerformance() {
    window.open(
      `/pub/lmes/report-performance?${encodeURIComponent(
        JSON.stringify(loginDS.current.get('workerObj'))
      )}`
    );
  }

  /**
   * 根据执行规则判断显示内容
   */
  function checkExecuteRule(task, type) {
    const rule = task.executeRule ? JSON.parse(task.executeRule) : {};
    const footerBtnArr = [];
    const obj = {};
    if (rule.drawing) {
      footerBtnArr.push('document');
      if (type === 'drawing') {
        obj.drawingRule = rule.drawing;
        if (rule.drawing.indexOf('DOCUMENT') !== -1) {
          obj.noRequest = true;
        } else if (
          rule.drawing.indexOf('ITEM') !== -1 ||
          rule.drawing.indexOf('OPERATION') !== -1 ||
          rule.drawing.indexOf('DRAWING') !== -1
        ) {
          obj.noRequest = false;
        }
      }
    }
    if (rule.esop) {
      footerBtnArr.push('instruction');
      if (type === 'esop') {
        obj.esopRule = rule.esop;
        if (rule.esop.indexOf('DOCUMENT') !== -1) {
          obj.noRequest = true;
        } else if (
          rule.esop.indexOf('ITEM') !== -1 ||
          rule.esop.indexOf('OPERATION') !== -1 ||
          rule.esop.indexOf('ESOP') !== -1
        ) {
          obj.noRequest = false;
        }
      }
    }
    setShowFooterBtn(footerBtnArr);
    return obj;
  }

  /**
   * 点击图纸/工艺路线按钮
   */
  async function handleDrawing(type) {
    const flag = checkSelectList(type === 'drawing' ? '查看图纸' : '查看工艺文件');
    if (!flag) return;

    let url = null;
    const urlList = [];
    const currentTask = reportList.find((i) => i.checked);
    const obj = checkExecuteRule(currentTask, type);
    const { drawingRule, noRequest, esopRule } = obj;
    if (noRequest) {
      const { referenceDocument } = currentTask;
      url = referenceDocument;
    } else {
      let res = {};
      setIsLoading(true);
      if (type === 'drawing') {
        res = await getLastestDrawing({
          dataRule: drawingRule,
          itemId: currentTask.itemId,
          operationId: queryDS.current.get('operationId'),
        });
      } else if (type === 'esop') {
        res = await getLastestEsop({
          dataRule: esopRule,
          itemId: currentTask.itemId,
          operationId: queryDS.current.get('operationId'),
        });
      }
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
    setIsLoading(false);
    if (url || urlList.length) {
      Modal.open({
        key: type,
        closable: true,
        footer: null,
        title: `${type === 'drawing' ? '图纸' : '工艺路线'}预览`,
        className: styles['lmes-batch-report-draw-modal'],
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
        message: `无${type === 'drawing' ? '图纸' : '工艺文件'}`,
      });
    }
  }

  /**
   * 打开新窗口显示图纸/工艺文件
   */
  function handleOpen(url) {
    window.open(url);
  }

  /**
   * 改变图纸/工艺文件显示大小
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
   * 备注
   */
  function handleRemarkModalShow(val) {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: styles['lmes-batch-report-login-modal'],
      children: <TextField style={{ marginTop: 30, height: 48, width: '100%' }} />,
      onOk: () => setRemark(val),
    });
  }

  /**
   * 开工
   */
  async function handleStart() {
    const checkList = reportList.filter((i) => i.checked);
    const taskIds = checkList.map((i) => i.taskId);

    setIsLoading(true);
    const res = await runTask({
      taskIds,
      workerId: loginDS.current.get('workerId'),
      worker: loginDS.current.get('worker'),
    });

    setIsLoading(false);
    if (getResponse(res)) {
      notification.success();
      handleSearch(false);
    }
  }

  /**
   * 提交
   */
  async function handleSubmit() {
    const checkList = reportList.filter((i) => i.checked);
    const submitList = [];
    let flag = true;
    checkList.forEach((i) => {
      if (i.submitOutputLineVoList) {
        const submitOutputLineVoList = [];
        i.submitOutputLineVoList.forEach((el) => {
          const obj = {
            ...el,
            executeQty: el.processOkQty,
            executeNgQty: el.processNgQty,
            processOkQty: null,
            processNgQty: null,
          };
          submitOutputLineVoList.push(filterNullValueObject(obj));
        });
        submitList.push({
          organizationId: orgObj.organizationId,
          organizationCode: orgObj.organizationCode,
          // itemControlType: taskType,
          itemOutputType: i.itemLineType,
          itemId: i.itemId,
          itemCode: i.itemCode,
          taskId: i.taskId,
          taskNum: i.taskNum,
          taskStatus: i.taskStatus,
          executeTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
          workerId: loginDS.current.get('workerId'),
          worker: loginDS.current.get('worker'),
          workerGroupId: loginDS.current.get('workerGroupId'),
          workerGroup: loginDS.current.get('workerGroup'),
          prodLineId: loginDS.current.get('prodLineId'),
          prodLineCode: loginDS.current.get('prodLineCode'),
          workcellId: loginDS.current.get('workcellId'),
          workcellCode: loginDS.current.get('workcellCode'),
          equipmentId: loginDS.current.get('equipmentId'),
          equipmentCode: loginDS.current.get('equipmentCode'),
          calendarDay: moment(loginDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
          calendarShiftCode: loginDS.current.get('calendarShiftCode'),
          remark,
          submitOutputLineVoList,
        });
      } else {
        flag = false;
      }
    });
    if (flag) {
      setIsLoading(true);
      const res = await submitTaskOutput(submitList);
      setIsLoading(false);
      if (getResponse(res)) {
        notification.success();
        handleSearch(false);
      }
    } else {
      notification.warning({
        message: '执行数量不可为空',
      });
    }
  }

  function handleCheckAll() {
    const cloneList = reportList.map((i) => {
      return { ...i, checked: !i.checked };
    });
    setReportList(cloneList);
  }

  /**
   * 暂停
   */
  async function handlePause() {
    const checkList = reportList.filter((i) => i.checked);
    const taskIds = checkList.map((i) => i.taskId);
    setIsLoading(true);
    const res = await pauseTask(taskIds);
    setIsLoading(false);
    if (getResponse(res)) {
      notification.success();
      handleSearch(false);
    }
  }

  /**
   * 任务行数量修改
   */
  function handleNumChange(val, type, rec) {
    const idx = reportList.findIndex((i) => i.taskItemLineId === rec.taskItemLineId);
    const cloneList = [...reportList];
    const obj = rec.submitOutputLineVoList ? rec.submitOutputLineVoList[0] : {};
    cloneList.splice(idx, 1, {
      ...rec,
      checked: true,
      submitOutputLineVoList: [
        {
          ...obj,
          [`${type}Qty`]: val,
        },
      ],
    });
    setReportList(cloneList);
  }

  return (
    <div className={styles['lmes-batch-report']}>
      <div className={styles.header}>
        <Icons type="logo" size="36" color="#ffffff" />
        <div className={styles['header-right']}>
          {timeComponent}
          <span>{loginData.calendarShiftCode === 'NIGHT' ? '晚班' : '早班'}</span>
        </div>
      </div>
      <div className={styles['sub-header']}>
        <div className={styles.worker}>
          <img src={loginData.fileUrl ? loginData.fileUrl : defaultAvatorImg} alt="" />
          <span>{loginData.workerName}</span>
        </div>
        {loginData.workcellId && (
          <div>
            <img src={carIcon} alt="" />
            <span>{loginData.workcellName}</span>
          </div>
        )}
        {loginData.prodLineId && (
          <div>
            <img src={prodlineIcon} alt="" />
            <span>{loginData.prodLineName}</span>
          </div>
        )}
        {loginData.equipmentId && (
          <div>
            <img src={prodlineIcon} alt="" />
            <span>{loginData.equipmentName}</span>
          </div>
        )}
        {loginData.workerGroupId && (
          <div>
            <img src={prodlineIcon} alt="" />
            <span>{loginData.workerGroupName}</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles['query-area']}>
          <div className={`${styles['query-input']} ${styles.left}`}>
            {loginDS.current.get('reportType') === 'MO' ? (
              <Lov
                className={styles.operation}
                dataSet={queryDS}
                name="operationObj"
                onChange={() => handleSearch(false)}
                placeholder="选择工序"
                prefix={<img src={orgIcon} alt="" />}
              />
            ) : (
              <Lov
                dataSet={queryDS}
                name="taskObj"
                onChange={handleSearch}
                placeholder="请扫描或输入任务号"
              />
            )}
            <img src={scanIcon} alt="" />
          </div>
          {loginDS.current.get('reportType') === 'MO' && (
            <div className={styles['query-input']}>
              <Lov
                dataSet={queryDS}
                name="moObj"
                placeholder="请扫描或输入MO号"
                onChange={handleSearch}
              />
              <img src={scanIcon} alt="" />
            </div>
          )}
        </div>
        <div className={styles.list}>
          {reportList.map((i) => {
            return (
              <ListItem
                key={uuidv4()}
                onItemClick={handleItemCheck}
                data={i}
                onNumChange={handleNumChange}
              />
            );
          })}
        </div>
      </div>
      <Footer
        showFooterBtnArr={showFooterBtnArr}
        onLogin={handleLogin}
        onExit={handleExit}
        onReset={handleReset}
        onFeeding={handleFeeding}
        onRejectedMaterial={handleRejectedMaterial}
        onPerformance={handlePerformance}
        onDrawing={handleDrawing}
        onRemark={handleRemarkModalShow}
        onStart={handleStart}
        onSubmit={handleSubmit}
        onPause={handlePause}
        onCheckAll={handleCheckAll}
      />
      {isLoading && <Loading />}
    </div>
  );
};
export default BatchReport;
