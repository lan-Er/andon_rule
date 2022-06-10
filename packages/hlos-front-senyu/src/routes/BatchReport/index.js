import React, { useMemo, useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Modal, DataSet, TextField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import { getResponse, filterNullValueObject } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import uuidv4 from 'uuid/v4';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import Time from 'hlos-front/lib/components/Time';
import Loading from 'hlos-front/lib/components/Loading';
import { userSetting, queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import prodlineIcon from 'hlos-front/lib/assets/icons/prodline-gray.svg';
import carIcon from 'hlos-front/lib/assets/icons/car-gray.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import { LoginDS, QueryDS, TagQueryDS } from '@/stores/batchReportDS';
import {
  queryTaskItem,
  // runTask,
  submitTaskOutput,
  retreatTaskOutput,
  returnTaskOutput,
  queryTaskNum,
} from '@/services/batchReportService';
import styles from './style.less';
import ListItem from './ListItem';
import LoginModal from './LoginModal';
import Footer from './Footer';

let modal = null;
const { common } = codeConfig.code;

const loginFactory = () => new DataSet(LoginDS());
const queryFactory = () => new DataSet(QueryDS());
const tagFactory = () => new DataSet(TagQueryDS());

const BatchReport = ({ history }) => {
  const loginDS = useDataSet(loginFactory, BatchReport);
  const queryDS = useDataSet(queryFactory);
  const tagDS = useDataSet(tagFactory);

  const timeComponent = useMemo(() => <Time />, []);

  const typeRef = useRef();
  const autoFocusRef = useRef();

  const [loginData, setLoginData] = useState({});
  const [checkOptArr, setCheckOptArr] = useState([]);
  const [loginLovType, setLovType] = useState('prodLine');
  const [reportList, setReportList] = useState([]);
  const [orgObj, setOrgObj] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setRemark] = useState('');
  const [taskData, setTaskData] = useState({});
  const [workData, setWorkData] = useState({});
  const [isExecutedFlag, setIsExecutedFlag] = useState(false);
  const [callQty, setCallQty] = useState(0);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    if (loginDS.current) {
      loginDS.current.reset();
      loginDS.fields.get('workcellObj').set('required', true);
      const arr = ['prodLine', 'workcell', 'equipment', 'workerGroup'];
      const _arr = arr.filter((item) => item !== 'workcell');
      _arr.forEach((arrItem) => {
        loginDS.fields.get(`${arrItem}Obj`).set('required', false);
        loginDS.current.set(`${arrItem}Obj`, null);
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
          workerId,
          workerCode,
          workerName,
          workcellId,
          workcellCode,
          workcellName,
          executeLoginRuleId,
        } = ruleRes.content[0];
        if (meOuId) {
          setOrgObj({
            organizationId: meOuId,
            organizationCode: meOuCode,
          });
          loginDS.current.set('orgId', meOuId);
        }
        if (workerId) {
          loginDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
        }
        if (workcellId) {
          loginDS.current.set('workcellObj', {
            workcellId,
            workcellCode,
            workcellName,
          });
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
        handleLogin(ruleArr);
        setCheckOptArr(ruleArr);
      }
    }
    defaultLovSetting();
  }, [loginDS]);

  useEffect(() => {
    setReportList([]);
  }, [
    loginData.workerId,
    loginData.prodLineId,
    loginData.workcellId,
    loginData.equipmentId,
    loginData.workerGroupId,
    loginData.date,
    loginData.shift,
  ]);
  useEffect(() => {
    if (callQty > 0) {
      handleNumberChange(callQty, workData, 'call');
      setCallQty(0);
    }
  }, [callQty]);
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
    }
    return arr;
  }

  /**
   * 首次进入页面弹出的登录窗口/底部切换按钮
   */
  function handleLogin(arr) {
    const flag = arr.filter((i) => i.key === loginLovType).length;
    const optionCheckVal = flag ? loginLovType : arr[0].key;
    const loginCheckOptArr = arr || checkOptArr;
    handleSetOption(optionCheckVal);
    modal = Modal.open({
      key: 'login',
      title: '登录',
      className: styles['senyu-task-report-login-modal'],
      footer: null,
      children: (
        <LoginModal
          ds={loginDS}
          value={loginLovType}
          loginCheckArr={loginCheckOptArr}
          onLoginClick={handleLoginOk}
          onRadioChange={handleRadioChange}
          onExit={handleExit}
          ref={(node) => {
            typeRef.current = node;
          }}
        />
      ),
    });
  }

  async function handleSetOption(value) {
    typeRef.current = value;
    loginDS.current.set('other', value);
    loginDS.fields.get(`${value}Obj`).set('required', true);

    const arr = ['prodLine', 'workcell', 'equipment', 'workerGroup'];
    const _arr = arr.filter((item) => item !== value);
    _arr.forEach((arrItem) => {
      loginDS.fields.get(`${arrItem}Obj`).set('required', false);
      loginDS.current.set(`${arrItem}Obj`, null);
    });
    const res = await userSetting({
      defaultFlag: 'Y',
    });
    if (getResponse(res) && res && res.content && res.content[0]) {
      if (value === 'prodLine') {
        loginDS.current.set(`${value}Obj`, {
          [`${value}Id`]: res.content[0][`${value}Id`],
          [`${value}Code`]: res.content[0][`${value}Code`],
          resourceName: res.content[0][`${value}Name`],
        });
      } else {
        loginDS.current.set(`${value}Obj`, {
          [`${value}Id`]: res.content[0][`${value}Id`],
          [`${value}Code`]: res.content[0][`${value}Code`],
          [`${value}Name`]: res.content[0][`${value}Name`],
        });
      }
    }
  }

  /**
   * '其它选项'修改
   */
  async function handleRadioChange(val, arr) {
    handleSetOption(val);
    modal.update({
      children: (
        <LoginModal
          ds={loginDS}
          value={val || loginLovType}
          loginCheckArr={arr || checkOptArr}
          onLoginClick={handleLoginOk}
          onRadioChange={handleRadioChange}
          onExit={handleExit}
          ref={(node) => {
            typeRef.current = node;
          }}
        />
      ),
    });
    setLovType(val);
  }

  /**
   * 登录弹窗的登录按钮
   */
  async function handleLoginOk() {
    const validateValue = await loginDS.validate(false, false);
    if (!validateValue) return;
    setLoginData(loginDS.current.toJSONData());
    autoFocusRef.current.focus();
    modal.close();
  }

  /**
   *
   * 语音播报
   */
  function speckMessage(message) {
    const url = `http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=${encodeURI(message)}`; // baidu
    const n = new Audio(url);
    n.src = url;
    n.play();
  }

  // 查询任务号
  async function handleQueryTaskNum(value) {
    const res = await queryTaskNum({
      tagCode: value,
    });
    if (getResponse(res) && res?.length) {
      setTaskData(res[0]);
      handleSearch(true, res[0]);
      getWebSocket();
    }
  }

  /**
   * 获取串口webSocket
   * */
  async function getWebSocket() {
    const WsImpl = window.WebSocket || window.MozWebSocket;
    window.ws = new WsImpl('ws://localhost:7181/port');
    // 当数据从服务器服务中心发送后，继续向下运行过程
    // eslint-disable-next-line func-names
    window.ws.onmessage = function (evt) {
      // eslint-disable-next-line no-undef
      // timer = setTimeout(() => {
      setCallQty(parseFloat(/(\d+(\.\d+)?)/.exec(evt.data)[0]));
      window.ws.close();
      // }, 500);
      // console.log('socket信息===', evt.data);
    };

    // 当链接对象找到服务端成功对接后，提示正常打开
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line func-names
    window.ws.onopen = function () {
      // console.log('socket 打开');
    };

    // 当链接对象未找找到服务端成功对接后，提示打开失败，别切单项关闭
    // eslint-disable-next-line func-names
    window.ws.onclose = function () {
      // console.log('socket 关闭');
    };
  }
  /**
   * 查询任务列表
   */
  async function handleSearch(flag, paramData = taskData) {
    let params = {};
    if (reportList.findIndex((i) => i.taskNum === queryDS.current.get('taskNum')) > -1) return;
    if (reportList.filter((v) => v.dataStatus === 'WAIT').length >= 1) {
      notification.warning({
        message: '请完成当前任务',
      });
      return;
    }
    setWorkData(paramData);
    if (paramData.isExecutedFlag === '1') {
      setIsExecutedFlag(true);
    }
    params = {
      taskNum: paramData.taskNum,
      organizationId: loginDS.current.get('orgId'),
      taskTypeCode: 'OPERATION_TASK',
    };
    if (isEmpty(params)) return;
    setIsLoading(true);
    const res = await queryTaskItem(params);
    setIsLoading(false);
    if (getResponse(res) && res.content) {
      const _list = res.content.map((v) => ({
        ...v,
        okQty: null,
        dataStatus: 'WAIT',
        tagCode: paramData.tagCode,
      }));
      // speckMessage(res.content[0].moNum);
      if (flag) {
        setReportList([..._list, ...reportList]);
      } else {
        setReportList(_list);
      }
    }
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
    tagDS.current.reset();
    setReportList([]);
    setTaskData({});
    setIsExecutedFlag(false);
    autoFocusRef.current.focus();
  }

  /**
   * 备注
   */
  function handleRemarkModalShow(val) {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: styles['senyu-batch-report-remark-modal'],
      children: <TextField style={{ marginTop: 30, height: 48, width: '100%' }} />,
      onOk: () => setRemark(val),
    });
  }

  /**
   * 开工
   */
  // async function handleStart() {
  //   const taskIds = reportList.map((i) => i.taskId);

  //   setIsLoading(true);
  //   const res = await runTask({
  //     taskIds,
  //     workerId: loginDS.current.get('workerId'),
  //     worker: loginDS.current.get('worker'),
  //   });

  //   setIsLoading(false);
  //   if (getResponse(res)) {
  //     notification.success();
  //     let _reportList = reportList.slice();
  //     _reportList = _reportList.map(v => ({
  //       ...v,
  //       dataStatus: 'SUBMIT',
  //     }));
  //     setReportList(_reportList);
  //     // handleSearch(false);
  //   }
  // }

  /**
   * 提交
   */
  async function handleSubmit(data) {
    const checkList = data.filter((v) => v.dataStatus === 'WAIT');
    if (!checkList.length) {
      notification.warning({
        message: '暂无可提交数据',
      });
      return;
    }
    const submitList = [];
    checkList.forEach((i) => {
      const submitOutputLineVoList = [];
      const obj = {
        executeQty: i.okQty,
        executeNgQty: i.processNgQty,
        lotId: i.lotId,
        lotNumber: i.lotNumber,
        pendingQty: i.pendingQty,
        reworkQty: i.reworkQty,
        scrappedQty: i.scrappedQty,
        tagCode: workData.tagCode,
        tagId: workData.tagId,
        wipQty: i.wipQty,
      };
      submitOutputLineVoList.push(filterNullValueObject(obj));
      submitList.push({
        organizationId: orgObj.organizationId,
        organizationCode: orgObj.organizationCode,
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
        calendarShiftCode: loginDS.current.get('shift'),
        remark,
        submitOutputLineVoList,
      });
    });
    setIsLoading(true);
    if (isExecutedFlag) {
      const params = [
        {
          moId: workData.moId,
          moInventoryReturnLineDTOList: [
            {
              tagId: workData.tagId,
              tagCode: workData.tagCode,
              lotId: workData.lotId,
              lotNumber: workData.lotNumber,
              returnedQty: workData.executedQty,
            },
          ],
        },
      ];
      const retrunList = [];
      checkList.forEach((i) => {
        const returnTaskOutputDetailDtoList = [];
        const obj = {
          executeQty: workData.executedQty * 1,
          executeNgQty: i.processNgQty,
          lotId: i.lotId,
          lotNumber: i.lotNumber,
          pendingQty: i.pendingQty,
          reworkQty: i.reworkQty,
          scrappedQty: i.scrappedQty,
          tagCode: workData.tagCode,
          tagId: workData.tagId,
          wipQty: i.wipQty,
        };
        returnTaskOutputDetailDtoList.push(filterNullValueObject(obj));
        retrunList.push({
          organizationId: orgObj.organizationId,
          organizationCode: orgObj.organizationCode,
          itemOutputType: i.itemLineType,
          itemId: i.itemId,
          itemCode: i.itemCode,
          taskId: i.taskId,
          taskNum: i.taskNum,
          taskStatus: i.taskStatus,
          executeTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
          workerId: loginDS.current.get('workerId'),
          worker: loginDS.current.get('worker'),
          prodLineId: loginDS.current.get('prodLineId'),
          prodLineCode: loginDS.current.get('prodLineCode'),
          calendarDay: moment(loginDS.current.get('date')).format(DEFAULT_DATE_FORMAT),
          remark,
          returnTaskOutputDetailDtoList,
        });
      });
      const resp = await retreatTaskOutput(params);
      const res = await returnTaskOutput(retrunList);
      if (getResponse(resp) && getResponse(res)) {
        const resOutput = await submitTaskOutput(submitList);
        setIsLoading(false);
        if (getResponse(resOutput)) {
          notification.success();
          // handleSearch(false);
          let _reportList = data.slice();
          _reportList = _reportList.map((v) => {
            if (v.dataStatus === 'WAIT') {
              return {
                ...v,
                dataStatus: 'SUBMIT',
                processOkQty: (v.processOkQty || 0) + (v.okQty || 0),
                executableQty:
                  (v.executableQty || 0) - (v.okQty || 0) + (workData.executedQty * 1 || 0),
              };
            }
            return {
              ...v,
            };
          });
          if (_reportList[0].executableQty < 200) {
            speckMessage('可执行数量不足200kg');
          }
          setReportList(_reportList);
          tagDS.current.reset();
          autoFocusRef.current.focus();
        }
      } else {
        setIsLoading(false);
      }
    } else {
      const res = await submitTaskOutput(submitList);
      setIsLoading(false);
      if (getResponse(res)) {
        notification.success();
        // handleSearch(false);
        let _reportList = data.slice();
        _reportList = _reportList.map((v) => {
          if (v.dataStatus === 'WAIT') {
            return {
              ...v,
              dataStatus: 'SUBMIT',
              processOkQty: (v.processOkQty || 0) + (v.okQty || 0),
              executableQty:
                (v.executableQty || 0) - (v.okQty || 0) + (workData.executedQty * 1 || 0),
            };
          }
          return {
            ...v,
          };
        });
        if (_reportList[0].executableQty < 200) {
          speckMessage('可执行数量不足200kg');
        }
        setReportList(_reportList);
        tagDS.current.reset();
        autoFocusRef.current.focus();
      }
    }
  }

  function handleTagChange() {
    // code
  }

  function handleNumberChange(value, idx, type) {
    // if (value < 0) {
    //   notification.warning({
    //     message: '合格数量不可以为负数!',
    //   });
    //   return;
    // }
    let _reportList = reportList.slice();
    _reportList = _reportList.map((v, i) => {
      if (type === 'call' && v.tagCode === idx.tagCode && v.dataStatus === 'WAIT') {
        return {
          ...v,
          okQty: value,
        };
      } else if (i === idx) {
        return {
          ...v,
          okQty: value,
        };
      }
      return {
        ...v,
      };
    });
    setReportList(_reportList);
    handleSubmit(_reportList);
  }

  return (
    <div className={styles['senyu-batch-report']}>
      <div className={styles.header}>
        <Icons type="logo" size="36" color="#ffffff" />
        <div className={styles['header-right']}>
          {timeComponent}
          <span>{loginData.shift === 'NIGHT' ? '晚班' : '早班'}</span>
        </div>
      </div>
      <div className={styles['sub-header']}>
        <div className={styles['sub-header-left']}>
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
              <span>{loginData.resourceName}</span>
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
        <div className={styles['query-input']}>
          <TextField
            ref={(node) => {
              autoFocusRef.current = node;
            }}
            dataSet={tagDS}
            name="tagCode"
            placeholder="请扫描标签二维码"
            onChange={handleQueryTaskNum}
          />
          <img src={scanIcon} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.list}>
          {reportList.map((i, idx) => {
            return (
              <ListItem
                key={uuidv4()}
                tagCode={taskData.tagCode}
                isExecutedFlag={isExecutedFlag}
                data={i}
                onTagChange={handleTagChange}
                onNumberChange={(value) => handleNumberChange(value, idx)}
              />
            );
          })}
        </div>
      </div>
      <Footer
        loginCheckArr={checkOptArr}
        onLogin={handleLogin}
        onExit={handleExit}
        onReset={handleReset}
        onRemark={handleRemarkModalShow}
        // onStart={handleStart}
        onSubmit={() => handleSubmit(reportList)}
      />
      {isLoading && <Loading />}
    </div>
  );
};
export default BatchReport;
