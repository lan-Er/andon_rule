/**
 * @Description: 生产报废 - index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React, { useEffect, useMemo, useState } from 'react';
import { DataSet, Modal, Select, Switch } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';
import {
  userSetting,
  queryLovData,
} from 'hlos-front/lib/services/api';
import Loading from 'hlos-front/lib/components/Loading';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { LoginDS, QueryDS } from '@/stores/productionScrapDS';
import {
  queryMoOperation,
  queryTaskItem,
  queryMo,
  runTask,
  pauseTask,
  submitTaskOutput,
} from '@/services/productionScrapService';
import codeConfig from '@/common/codeConfig';
import Header from './Header';
import Left from './ContentLeft';
import Right from './ContentRight';
import LoginModal from './LoginModal';
import SearchDrawer from './SearchDrawer';
import DetailDrawer from './DetailDrawer';
import styles from './index.less';

const { common } = codeConfig.code;

let loginModal = null;
let searchDrawer = null;
const preCode = 'lmes.productionScrap';

const ProductionScrap = ({
  history,
}) => {
  const loginDS = useMemo(() => new DataSet(LoginDS()), []);
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);

  const [loginData, setLoginData] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [currentListItem, setCurrentListItem] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [resourceList, setResourceList] = useState([
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
  ]);

  useEffect(() => {
    async function queryDefaultData() {
      let initResourceList = [
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
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const {
          meOuId, meOuCode,
          workerId, workerCode, workerName, fileUrl,
          workcellId, workcellCode, workcellName,
          executeLoginRuleId,
          // prodLineId, prodLineCode, prodLineName,
          // equipmentId, equipmentCode, equipmentName,
          // workerGroupId, workerGroupCode, workerGroupName,
        } = res.content[0];
        loginDS.current.set('organizationId', meOuId);
        loginDS.current.set('organizationCode', meOuCode);
        queryDS.current.set('organizationId', meOuId);
        loginDS.current.set('workerObj', {
          workerId, workerCode, workerName, fileUrl,
        });
        loginDS.current.set('workcellObj', {
          workcellId, workcellCode, workcellName,
        });
        if (executeLoginRuleId) {
          const jsonRes = await queryLovData({
            lovCode: common.rule,
            ruleId: executeLoginRuleId,
          });
          if (getResponse(jsonRes) && jsonRes.content && jsonRes.content[0]) {
            const arr = checkLoginRule(jsonRes.content[0].ruleJson);
            if(arr.length) {
              if(!arr.some(i => i.key === 'workcell')) {
                loginDS.current.set('resourceType', arr[0].key);
              }
              initResourceList = arr;
              setResourceList(arr);
            }
          }
        }
      }
      handleLogin(initResourceList);
    }
    queryDefaultData();
  }, []);

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
        loginDS.current.set('reportType', rule.document_class);
      }
    }
    return arr;
  }

  function handleLogin(arr) {
    loginModal = Modal.open({
      key: 'login',
      className: styles['production-scrap-login-modal'],
      footer: null,
      children: (
        <LoginModal
          ds={loginDS}
          loginData={loginData}
          resourceList={arr}
          onResourceChange={handleResourceChange}
          onExit={handleExit}
          onOk={handleLoginModalOk}
        />
      ),
    });
  }

  async function handleResourceChange(val) {
    const arr = ['workcell', 'equipment', 'prodLine', 'workerGroup'];
    const res = await userSetting({ defaultFlag: 'Y' });
    arr.forEach(i => {
      if (i === val) {
        if (res && res.content && res.content[0]) {
          loginDS.current.set(`${i}Obj`, {
            [`${i}Id`]: res.content[0][`${i}Id`],
            [`${i}Code`]: res.content[0][`${i}Code`],
            [`${i === 'prodLine' ? 'resource' : i}Name`]: res.content[0][`${i}Name`],
          });
        }
        loginDS.getField(`${i}Obj`).set('required', true);
      } else {
        loginDS.current.set(`${i}Obj`, null);
        loginDS.getField(`${i}Obj`).set('required', false);
      }
    });
    loginDS.current.set('resourceType', val);
  }

  function handleOpenSearchDrawer(showOperationFlag, list, inputValue) {
    if (!showOperationFlag) {
      const {
        warehouseId, warehouseCode, warehouseName,
        wmAreaId, wmAreaCode, wmAreaName,
      } = currentListItem;
      queryDS.current.set('warehouseObj', {
        warehouseId,
        warehouseCode,
        warehouseName,
      });
      queryDS.current.set('wmAreaObj', {
        wmAreaId,
        wmAreaCode,
        wmAreaName,
      });
    } else {
      queryDS.current.set('warehouseObj', null);
    }
    searchDrawer = Modal.open({
      key: 'search',
      title: '输入信息',
      className: styles['production-scrap-drawer'],
      drawer: true,
      children: (
        <SearchDrawer
          showOperationFlag={showOperationFlag}
          queryDS={queryDS}
          operationList={list}
        />
      ),
      okCancel: false,
      onOk: () => handleSearchDrawerOk(inputValue, showOperationFlag),
    });
  }

  async function handleOpenDetailDrawer(rec) {
    const res = await queryMo({
      moNum: rec.moNum,
      ownerOrganizationId: loginData.organizationId,
      taskItem: 1,
    });
    if (getResponse(res) && res.content && res.content[0]) {
      Modal.open({
        key: 'detail',
        title: 'MO信息',
        className: styles['production-scrap-drawer'],
        drawer: true,
        children: (
          <DetailDrawer data={res.content[0]} />
        ),
        footer: null,
        closable: true,
      });
    }
  }

  function handleExit() {
    loginModal.close();
    history.push('/workplace');
    closeTab('/pub/lmes/production-scrap');
  }

  async function handleLoginModalOk() {
    const validateValue = await loginDS.validate(false, false);
    if (!validateValue) return;
    setLoginData({
      ...loginDS.current.toJSONData(),
      shiftCodeMeaning: loginDS.current.get('shiftCode') === 'NIGHT' ? '晚班': '早班',
    });
    loginModal.close();
  }

  async function handleSearchDrawerOk(inputValue, showOperationFlag) {
    const {
      reworkFlag, operationId, moOperationId,
      warehouseId, warehouseCode, warehouseName,
      wmAreaId, wmAreaCode, wmAreaName,
    } = queryDS.current.toJSONData();
    if (showOperationFlag) {
      let params = {};
      if (loginData.reportType === 'MO') {
        if (!operationId) return false;
        if (taskList.findIndex(i => i.moNum === inputValue && i.operationId === operationId) > -1) {
          notification.warning({
            message: '数据重复',
          });
          return;
        }
        params = {
          moNum: inputValue,
          organizationId: loginData.organizationId,
          moQueryFlag: 'Y',
          taskTypeCode: reworkFlag ? 'REWORK_TASK' : 'OPERATION_TASK',
        };
        if (reworkFlag) {
          params.moOperationId = moOperationId;
        } else {
          params.operationId = operationId;
        }

      } else {
        if (taskList.findIndex(i => i.taskNum === inputValue) > -1) {
          notification.warning({
            message: '数据重复',
          });
          return;
        }
        params = {
          taskNum: inputValue,
          organizationId: loginData.organizationId,
          taskTypeCode: queryDS.current.get('reworkFlag') ? 'REWORK_TASK' : 'OPERATION_TASK',
        };
      }
      const res = await queryTaskItem(params);
      if (getResponse(res) && res.content && res.content.length) {
        res.content.forEach(i => {
          i.workerId = loginData.workerId;
          i.worker = loginData.worker;
          i.workerName = loginData.workerName;
          i.warehouseId = warehouseId;
          i.warehouseCode = warehouseCode;
          i.warehouseName = warehouseName;
          i.wmAreaId = wmAreaId;
          i.wmAreaCode = wmAreaCode;
          i.wmAreaName = wmAreaName;
        });
        setTaskList(taskList.concat(res.content));
        setCurrentListItem(res.content[0]);
      }
    } else {
      const cloneCurrentListItem = { ...currentListItem };
      const cloneTaskList = [...taskList];
      const idx = cloneTaskList.findIndex(i => i.taskItemLineId === currentListItem.taskItemLineId);
      cloneCurrentListItem.warehouseId = warehouseId;
      cloneCurrentListItem.warehouseCode = warehouseCode;
      cloneCurrentListItem.warehouseName = warehouseName;
      cloneCurrentListItem.wmAreaId = wmAreaId;
      cloneCurrentListItem.wmAreaCode = wmAreaCode;
      cloneCurrentListItem.wmAreaName = wmAreaName;
      cloneTaskList.splice(idx, 1, cloneCurrentListItem);
      setCurrentListItem(cloneCurrentListItem);
      setTaskList(cloneTaskList);
    }
    searchDrawer.close();
  }

  async function handleMoChange(val) {
    // MO202107130028 34 41
    // MO202107120001
    queryDS.current.set('operationObj', null);
    const res = await queryMoOperation({
      organizationId: loginData.organizationId,
      moNum: val,
      page: -1,
    });
    if (getResponse(res)) {
      if (res.content.length) {
        handleOpenSearchDrawer(true, res.content, val);
      } else {
        notification.warning({
          message: '该MO无工序',
        });
      }
    }
  }

  async function handleTaskChange(val) {
    handleOpenSearchDrawer(true, [], val);
  }

  function handleMoClick(rec) {
    handleOpenDetailDrawer(rec);
  }

  function handleLotOrTagChange(val, itemControlType) {
    const cloneCurrentListItem = { ...currentListItem };
    const cloneTaskList = [...taskList];
    const idx = taskList.findIndex(i => i.taskItemLineId === currentListItem.taskItemLineId);
    const obj = {
      [`${itemControlType.toLowerCase()}${itemControlType === 'TAG' ? 'Code' : 'Number'}`]: val,
      scrappedQty: 0,
    };
    if (cloneCurrentListItem.childrenList) {
      cloneCurrentListItem.childrenList.push(obj);
    } else {
      cloneCurrentListItem.childrenList = [obj];
    }
    setCurrentListItem(cloneCurrentListItem);
    cloneTaskList.splice(idx, 1, cloneCurrentListItem);
    setTaskList(cloneTaskList);
  }

  function handleListItemClick(rec) {
    setCurrentListItem(rec);
  }

  function handleLineScrappedQtyChange(val, lineIdx) {
    const cloneCurrentListItem = { ...currentListItem };
    const cloneTaskList = [...taskList];
    let qty = 0;
    const idx = taskList.findIndex(i => i.taskItemLineId === currentListItem.taskItemLineId);
    cloneCurrentListItem.childrenList[lineIdx].scrappedQty = val;
    cloneCurrentListItem.childrenList.forEach(i => {
      qty += i.scrappedQty;
    });
    cloneCurrentListItem.currentScrappedQty = qty;
    setCurrentListItem(cloneCurrentListItem);
    cloneTaskList.splice(idx, 1, cloneCurrentListItem);
    setTaskList(cloneTaskList);
  }

  function handleListItemDel(e, idx, rec) {
    if (e) e.stopPropagation();
    const cloneTaskList = [...taskList];
    cloneTaskList.splice(idx, 1);
    setTaskList(cloneTaskList);
    if (rec.taskItemLineId === currentListItem.taskItemLineId) {
      setCurrentListItem(cloneTaskList[0] || {});
    }
  }

  function handleLineDel(e, lineIdx) {
    if (e) e.stopPropagation();
    const cloneCurrentListItem = { ...currentListItem };
    const cloneTaskList = [...taskList];
    const idx = taskList.findIndex(i => i.taskItemLineId === currentListItem.taskItemLineId);
    cloneCurrentListItem.childrenList.splice(lineIdx, 1);
    setCurrentListItem(cloneCurrentListItem);
    cloneTaskList.splice(idx, 1, cloneCurrentListItem);
    setTaskList(cloneTaskList);
  }

  function handleScrappedQtyChange(val) {
    const cloneCurrentListItem = { ...currentListItem };
    const cloneTaskList = [...taskList];
    const idx = taskList.findIndex(i => i.taskItemLineId === currentListItem.taskItemLineId);
    cloneCurrentListItem.currentScrappedQty = val;
    cloneCurrentListItem.childrenList = [{
      scrappedQty: val,
    }];
    setCurrentListItem(cloneCurrentListItem);
    cloneTaskList.splice(idx, 1, cloneCurrentListItem);
    setTaskList(cloneTaskList);
  }

  async function handleStart() {
    if (isEmpty(currentListItem)) return;
    const ids = taskList.map(i => i.taskId);
    setSubmitLoading(true);
    const res = await runTask({
      taskIds: ids,
      workerId: loginData.workerId,
      worker: loginData.worker,
    });
    setSubmitLoading(false);
    if (getResponse(res)) {
      notification.success();
    }
  }

  async function handlePause() {
    if (isEmpty(currentListItem)) return;
    const ids = taskList.map(i => i.taskId);
    setSubmitLoading(true);
    const res = await pauseTask(ids);
    setSubmitLoading(false);
    if (getResponse(res)) {
      notification.success();
    }
  }

  function handleSubmitConfirm() {
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.submit`).d('是否提交所有报废信息')}</p>,
      onOk: handleSubmit,
    });
  }

  async function handleSubmit() {
    const validateValue = taskList.every(i => i.childrenList);
    if (!validateValue) {
      notification.warning({
        message: '未录入报废数据',
      });
      return;
    }
    const {
      organizationId,
      organizationCode,
      workerId,
      worker,
      workerGroupId,
      workerGroup,
      prodLineId,
      prodLineCode,
      workcellId,
      workcellCode,
      equipmentId,
      equipmentCode,
      date,
      shiftCode,
    } = loginData;
    const paramsArr = [];
    taskList.forEach(i => {
      const list = [];
      if (i.childrenList) {
        i.childrenList.forEach(c => {
          const { scrappedQty, ...otherParam } = c;
          if (queryDS.current.get('scrappedType') === 'RAW_NG') {
            list.push({
              ...otherParam,
              rawNgQty: scrappedQty,
            });
          } else {
            list.push(c);
          }
        });
      }
      paramsArr.push({
        organizationId,
        organizationCode,
        workerId,
        worker,
        workerGroupId,
        workerGroup,
        prodLineId,
        prodLineCode,
        workcellId,
        workcellCode,
        equipmentId,
        equipmentCode,
        calendarDay: moment(date).format(DEFAULT_DATE_FORMAT),
        executeTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        calendarShiftCode: shiftCode,
        itemControlType: i.taskType,
        itemOutputType: 'OUTPUT',
        itemId: i.itemId,
        itemCode: i.itemCode,
        taskId: i.taskId,
        taskNum: i.taskNum,
        taskStatus: i.taskStatus,
        submitOutputLineVoList: list,
      });
    });
    setSubmitLoading(true);
    const res = await submitTaskOutput(paramsArr);
    setSubmitLoading(false);
    if (getResponse(res)) {
      notification.success();
      setTaskList([]);
      setCurrentListItem([]);
    }
  }

  return (
    <div>
      <Header
        loginData={loginData}
        resourceList={resourceList}
        onLoginClick={handleLogin}
      />
      <div className={styles['production-scrap-content']}>
        <div className={styles['production-scrap-title']}>
          <div>
            <Select
              dataSet={queryDS}
              name="scrappedType"
              clearButton={false}
              suffix={<Icon type="arrow_drop_down" style={{ fontSize: 30 }} />}
            />
          </div>
          <div>
            <span>返修</span>
            <Switch dataSet={queryDS} name="reworkFlag" />
          </div>
        </div>
        <div className={styles['production-scrap-main']}>
          <Left
            loginData={loginData}
            currentListItem={currentListItem}
            onMoChange={handleMoChange}
            onTaskChange={handleTaskChange}
            onLotOrTagChange={handleLotOrTagChange}
            onScrappedQtyChange={handleLineScrappedQtyChange}
            onLineDel={handleLineDel}
            onQtyChange={handleScrappedQtyChange}
            onStart={handleStart}
            onPause={handlePause}
            onSubmit={handleSubmitConfirm}
          />
          <Right
            taskList={taskList}
            currentListItem={currentListItem}
            onMoClick={handleMoClick}
            onListItemClick={handleListItemClick}
            onListItemDel={handleListItemDel}
            onOpenLineModal={handleOpenSearchDrawer}
          />
        </div>
      </div>
      {submitLoading && <Loading />}
    </div>
  );
};

export default formatterCollections({ code: ['lmes.productionScrap', 'lmes.common'] })(ProductionScrap);