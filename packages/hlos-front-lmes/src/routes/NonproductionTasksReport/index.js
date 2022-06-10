/**
 * @Description: 非生产任务报工
 * @Author: liYuan.liu<liu.liyuan@hand-china.com>
 * @Date: 2020-12-23
 * @LastEditors: liYuan.liu
 */
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { Modal, DataSet, TextField } from 'choerodon-ui/pro';

import { isEmpty } from 'lodash';
import { closeTab } from 'utils/menuTab';
import codeConfig from '@/common/codeConfig';
import notification from 'utils/notification';
import { getResponse, getDateFormat } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import { QueryDS, TaskDS } from '@/stores/nonproductionTasksReportDS';
import {
  queryNonproductionTask,
  queryDefaultMeOu,
  runTask,
  queryWorkerGroup,
  pauseTask,
  completeTask,
} from '@/services/NonproductionTaskService';
// import defaultAvatar from 'hlos-front/lib/assets/img-default-avator.png';

import Header from './Header';
import ReportItem from './ReportItem';
import LoginModal from './LoginModal';
import Footer from './Footer';
import styles from './style.less';

const { common } = codeConfig.code;

const qDS = () => new DataSet(QueryDS());
const tDS = () => new DataSet(TaskDS());

const NonproductionTaskReport = ({ history }) => {
  let modal = null;

  const queryDS = useDataSet(qDS, NonproductionTaskReport);
  const taskDS = useDataSet(tDS);

  const typeRef = useRef();
  const [selectFleg, setSelectFleg] = useState(false);
  const [loginData, setLoginData] = useState({}); // 查询的的数据；
  const [selectList, setSelectList] = useState({}); // 选中行的数据;
  const [resourceType, setResourceType] = useState(null);
  // const [orgObj, setOrgObj] = useState({});
  // const [reportType, setReportType] = useState('MO');
  const [remark, setRemark] = useState(null);
  const [loginCheckArr, setLoginCheckArr] = useState([]);

  // 设置默认查询条件
  useEffect(() => {
    // 文档要求的默认显示单选框选中产线，且带出用户的默认的产线;
    // 让产线的单选必选，让其他两个字段不选中，且值为空；
    if (queryDS.current) {
      queryDS.current.reset();
      queryDS.fields.get('prodLineObj').set('required', true);
      const arr = ['prodLine', 'workcell', 'equipment'];
      const _arr = arr.filter((item) => item !== 'prodLine');
      _arr.forEach((arrItem) => {
        queryDS.fields.get(`${arrItem}Obj`).set('required', false);
        queryDS.current.set(`${arrItem}Obj`, null);
      });
    }
    const ruleArr = [
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
    ];
    // rule是获取用户的信息
    async function defaultLovSetting() {
      const ruleRes = await userSetting({
        defaultFlag: 'Y',
      });

      // 获取默认的工厂信息；
      const orgRes = await queryDefaultMeOu({ defaultFlag: 'Y' });
      if (getResponse(orgRes)) {
        if (orgRes && orgRes.content && orgRes.content[0]) {
          queryDS.current.set('orgId', orgRes.content[0].meOuId);
        }
      }

      // 查询操作工对应的值集的信息
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes)) {
        if (workerRes && workerRes.content && workerRes.content[0]) {
          queryDS.current.set('workerObj', {
            workerId: workerRes.content[0].workerId,
            workerCode: workerRes.content[0].workerCode,
            workerName: workerRes.content[0].workerName,
            fileUrl: workerRes.content[0].fileUrl,
          });
          const workerGroupRes = await queryWorkerGroup({
            workerId: workerRes.content[0].workerId,
          });
          if (getResponse(workerGroupRes)) {
            queryDS.current.set('workerGroupObj', {
              workerGroupId: workerGroupRes.workerGroupId,
              workerGroup: workerGroupRes.workerGroupCode,
              workerGroupName: ruleRes.content[0].workerGroupName,
            });
          }
        }
      }

      const prodLineRes = await queryLovData({ lovCode: common.prodLine, defaultFlag: 'Y' });
      if (
        getResponse(prodLineRes) &&
        prodLineRes &&
        prodLineRes.content &&
        prodLineRes.content[0]
      ) {
        queryDS.current.set('prodLineObj', {
          prodLineId: prodLineRes.content[0].prodLineId,
          prodLineCode: prodLineRes.content[0].prodLineCode,
          resourceName: prodLineRes.content[0].resourceName,
        });
      }
      setLoginCheckArr(ruleArr);
    }
    defaultLovSetting();
    setSelectList(loginData);
  }, [queryDS]);

  // 查询Modal中资源类型选择修改
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
          // onTypeChange={handleTypeChange}
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

  // 单选框改变的时候的逻辑;
  async function handleSetOption(value) {
    typeRef.current = value;
    setResourceType(value);
    queryDS.current.set('other', value);
    queryDS.fields.get(`${value}Obj`).set('required', true);
    // headerDS.fields.get(`${value}Obj`).set('required', true);

    let lovCode = common.prodLine;
    const arr = ['prodLine', 'workcell', 'equipment'];
    const _arr = arr.filter((item) => item !== value);
    _arr.forEach((arrItem) => {
      queryDS.fields.get(`${arrItem}Obj`).set('required', false);
      queryDS.current.set(`${arrItem}Obj`, null);
    });
    lovCode = common[value];
    const res = await queryLovData({ lovCode, defaultFlag: 'Y' });
    if (getResponse(res) && res && res.content && res.content[0]) {
      if (value === 'prodLine') {
        queryDS.current.set(`${value}Obj`, {
          [`${value}Id`]: res.content[0][`${value}Id`],
          [`${value}Code`]: res.content[0][`${value}Code`],
          resourceName: res.content[0].resourceName,
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

  // 当前标签类型改变
  // function handleTypeChange(value) {
  //   setReportType(value);
  // }

  // 点击查询确认；
  async function handleLoginClick() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const {
      workerId,
      workerGroupId,
      taskStatusList,
      taskTypeId,
      prodLineId,
      workcellId,
      equipmentId,
      calendarDay,
      calendarShiftCode,
    } = queryDS.current.toJSONData();
    const resQuery = await queryNonproductionTask({
      workerId,
      workerGroupId,
      taskStatusList,
      taskTypeId,
      prodLineId,
      workcellId,
      equipmentId,
      calendarDay: moment(calendarDay).format(getDateFormat()),
      calendarShiftCode,
    });
    // const resQueryList={...resQuery};
    // const oldContent=resQueryList&&resQueryList.content;
    // oldContent.forEach(item=>{
    //   return Object.assign(item, {taskCheck: false});
    // });
    // console.log({...resQueryList, content: oldContent}, '数据');
    setSelectList({});
    setLoginData(resQuery);
    modal.close();
  }

  // 查询关闭按钮 - 关闭弹框
  function handleExit() {
    modal.close();
  }

  // 点击多选框；
  function handleGetCheckedList(value, field) {
    if (value) {
      const newField = Object.assign(field, { taskCheck: true });
      loginData.content.forEach((item) => {
        if (value === item.taskId) {
          return Object.assign(item, { taskCheck: true });
        } else {
          return item;
        }
      });
      const newSelectList = Object.assign(selectList, { [value]: newField });
      const selectArr = Object.values(newSelectList);
      if (selectArr.length === loginData.content.length) {
        setSelectFleg(true);
      }
      setLoginData({ ...loginData });
      setSelectList(newSelectList);
    } else {
      delete selectList[field.taskId];
      loginData.content.forEach((item) => {
        if (field.taskId === item.taskId) {
          return Object.assign(item, { taskCheck: false });
        } else {
          return item;
        }
      });
      setLoginData({ ...loginData });
      setSelectFleg(false);
    }
  }

  /* 底部按钮 */
  // 底部退出按钮 - 关闭页签
  function handleClose() {
    history.push('/workplace');
    closeTab('/pub/lmes/task-report');
  }

  // 底部查询按钮
  function handleChangeLogin(ruleArr) {
    const flag = ruleArr.filter((i) => i.key === resourceType).length;
    const optionCheckVal = flag ? resourceType : ruleArr[0].key;
    handleSetOption(optionCheckVal);
    modal = Modal.open({
      key: 'login',
      title: '查询',
      className: styles['lmes-task-report-login-modal'],
      footer: null,
      movable: false,
      closable: true,
      children: (
        <LoginModal
          ds={queryDS}
          value={optionCheckVal}
          loginCheckArr={ruleArr}
          onLoginClick={handleLoginClick}
          onRadioChange={handleRadioChange}
          // onTypeChange={handleTypeChange}
          onExit={handleExit}
          ref={(node) => {
            typeRef.current = node;
          }}
        />
      ),
    });
  }

  // 底部全选按钮
  function handleCheckAll() {
    if (!selectFleg) {
      loginData.content.forEach((item) => Object.assign(item, { taskCheck: true }));
      let newObj = {};
      loginData.content.forEach((item) => {
        const oneObj = {};
        oneObj[item.taskId] = { ...item, taskCheck: true };
        newObj = Object.assign(newObj, oneObj);
      });
      setSelectList(newObj);
      setLoginData({ ...loginData });
      setSelectFleg(true);
    } else {
      loginData.content.forEach((item) => Object.assign(item, { taskCheck: false }));
      let newObj = {};
      loginData.content.forEach((item) => {
        const oneObj = {};
        oneObj[item.taskId] = { ...item, taskCheck: false };
        newObj = Object.assign(newObj, oneObj);
      });
      setSelectList({});
      setLoginData({ ...loginData });
      setSelectFleg(false);
    }
  }

  // 底部备注按钮 - 备注弹窗
  function handleRemark() {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: styles['lmes-task-report-login-modal'],
      movable: false,
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

  // 底部开始按钮
  async function handleStart() {
    if (!isEmpty(selectList)) {
      const taskIds = Object.keys(selectList);
      const res = await runTask({
        taskIds,
        workerId: queryDS.current.get('workerId'),
        worker: queryDS.current.get('worker'),
      });
      if (getResponse(res)) {
        if (res.failed) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success({
            message: '开工成功',
          });
          const resQuery = await queryNonproductionTask({
            taskNum: loginData.content[0].taskNum,
          });
          setSelectList({
            [resQuery.content[0].taskId]: resQuery.content[0],
          });
          setLoginData(resQuery);
        }
      }
    } else {
      notification.error({
        message: '请选中至少一条任务',
      });
    }
  }

  // 底部暂停按钮
  async function handlePause() {
    if (!isEmpty(selectList)) {
      const taskIds = Object.keys(selectList);
      const res = await pauseTask(taskIds);
      if (getResponse(res)) {
        notification.success();
        const resQuery = await queryNonproductionTask({
          taskNum: loginData.content[0].taskNum,
        });
        setSelectList({
          [resQuery.content[0].taskId]: resQuery.content[0],
        });
        setLoginData(resQuery);
      }
    } else {
      notification.error({
        message: '请选中至少一条任务',
      });
    }
  }

  // 底部完成按钮
  async function handleSubmit() {
    if (!loginData) return;
    const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
    const submitNpTaskResultDTOList = [];
    if (!isEmpty(selectList)) {
      // eslint-disable-next-line guard-for-in
      for (const key in selectList) {
        selectList[key].worker = workerRes.content[0].workerCode;
        submitNpTaskResultDTOList.push(selectList[key]);
      }
      const res = await completeTask(submitNpTaskResultDTOList);
      if (getResponse(res)) {
        notification.success();
        setLoginData({});
        setSelectList({});
      }
    } else {
      notification.error({
        message: '请选中至少一条任务',
      });
    }
  }

  async function handleSubQuery(event) {
    event.persist();
    const valueNum = event.target.value;
    if (!valueNum) {
      notification.warning({ message: '请输入任务号后再来查询' });
      return;
    }
    const resQuery = await queryNonproductionTask({
      taskNum: valueNum,
    });
    // const resQueryList={...resQuery};
    // const oldContent=resQueryList&&resQueryList.content;
    // oldContent.forEach(item=>{
    //   return Object.assign(item, {taskCheck: false});
    // });
    // console.log({...resQueryList, content: oldContent}, '数据');
    setLoginData(resQuery);
    setSelectList({});
  }

  function handleChangeInputValue(value, i) {
    loginData.content.forEach((item) => {
      if (item.taskId === i.taskId) {
        return Object.assign(item, { processedTime: value, taskCheck: value > 0 });
      }
    });
    selectList[i.taskId] = { ...i, processedTime: value, taskCheck: value > 0 };
    setSelectList(selectList);
    setLoginData({ ...loginData });
    setSelectFleg(false);
  }
  return (
    <div className={styles['lmes-non-task-report']}>
      <CommonHeader title="非生产任务报工" />
      <Header
        queryDS={queryDS}
        date={queryDS.current.get('calendarDay')}
        shift={queryDS.current.get('calendarShiftCode')}
        handleSubQuery={handleSubQuery}
      />
      <div className={styles['lmes-non-task-report-content']}>
        {!isEmpty(loginData) && (
          <ReportItem
            selectTask={selectList}
            loginData={loginData}
            handleCheck={handleGetCheckedList}
            handleChangeValue={handleChangeInputValue}
          />
        )}
      </div>
      <Footer
        selectFleg={selectFleg}
        loginCheckArr={loginCheckArr}
        onClose={handleClose}
        onQuery={handleChangeLogin}
        onCheckAll={handleCheckAll}
        onRemarkClick={handleRemark}
        onStart={handleStart}
        onPause={handlePause}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default formatterCollections({
  code: ['lmes.taskReport', 'lmes.common'],
})((props) => NonproductionTaskReport(props));
