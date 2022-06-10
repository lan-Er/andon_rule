/**
 * @Description: MO报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState, useRef, useMemo } from 'react';
import { Select, Modal, DataSet, TextField } from 'choerodon-ui/pro';
import moment from 'moment';
import { isEmpty, cloneDeep } from 'lodash';
import { closeTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import { QueryDS, MoDS, HeaderDS } from '@/stores/moReportDS';
import codeConfig from '@/common/codeConfig';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import defaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
import { queryDefaultMeOu, checkControlType, submitMoOutput } from '../../services/taskService';

import Header from './Header';
import ReportInfo from './ReportInfo';
import ReportItem from './ReportItem';
import LoginModal from './LoginModal';
import Footer from './Footer';
import HistoryModal from './HistoryModal';
import Time from './Time.js';
import './style.less';

const { common } = codeConfig.code;

const qDS = () => new DataSet(QueryDS());
const mDS = () => new DataSet(MoDS());
const hDS = () => new DataSet(HeaderDS());

const MoReport = (props) => {
  let modal = null;
  let historyModal = null;

  const queryDS = useDataSet(qDS, MoReport);
  const headerDS = useDataSet(hDS);
  const moDS = useDataSet(mDS);

  const typeRef = useRef();

  const [workerLock, changeWorkerLock] = useState(false);
  const [prodLineLock, changeProdlineLock] = useState(false);
  const [taskType, setTaskType] = useState('');
  const [lotList, setLotArr] = useState([]);
  const [avator, setAvator] = useState(defaultAvator);
  const [resourceType, setResourceType] = useState('workcell');
  const [moInfo, setMoInfo] = useState({});
  const [orgObj, setOrgObj] = useState({});
  const [lotNumber, setLotNum] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [tagTotal, setTagTotal] = useState(0);
  const [remark, setRemark] = useState(null);
  const [shiftShow, setShiftShow] = useState(false);
  const [newLotArr, setNewLotArr] = useState([]);
  const [hideFlag, changeHideFlag] = useState(false);
  const [showInputArr, setShowInputArr] = useState([]);
  const [footerExtraBtnArr, setFooterBtnArr] = useState([]);
  const [showMainUom, setShowMainUom] = useState(true);
  const [loginCheckArr, setLoginCheckArr] = useState([]);

  const timeComponent = useMemo(() => <Time />, []);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
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
      if (
        getResponse(ruleRes) &&
        ruleRes &&
        ruleRes.content &&
        ruleRes.content[0] &&
        ruleRes.content[0].executeLoginRule
      ) {
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

      const orgRes = await queryDefaultMeOu({ defaultFlag: 'Y' });
      if (getResponse(orgRes)) {
        if (orgRes && orgRes.content && orgRes.content[0]) {
          setOrgObj({
            organizationId: orgRes.content[0].meOuId,
            organizationCode: orgRes.content[0].meOuCode,
          });
          queryDS.current.set('orgId', orgRes.content[0].meOuId);
          headerDS.current.set('orgId', orgRes.content[0].meOuId);
        }
      }

      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes)) {
        if (workerRes && workerRes.content && workerRes.content[0]) {
          queryDS.current.set('workerObj', {
            workerId: workerRes.content[0].workerId,
            workerName: workerRes.content[0].workerName,
          });
          setAvator(workerRes.content[0].fileUrl);
        }
      }

      const workcellRes = await queryLovData({ lovCode: common.workcell, defaultFlag: 'Y' });
      if (
        getResponse(workcellRes) &&
        workcellRes &&
        workcellRes.content &&
        workcellRes.content[0]
      ) {
        queryDS.current.set('workcellObj', {
          workcellId: workcellRes.content[0].workcellId,
          workcellCode: workcellRes.content[0].workcellCode,
          workcellName: workcellRes.content[0].workcellName,
        });
      }
      setLoginCheckArr(ruleArr);
      handleChangeLogin(ruleArr);
    }
    defaultLovSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDS, headerDS.fields]);

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
   * 显示扫描标签历史Modal
   */
  function handleShowHistoryModal() {
    historyModal = Modal.open({
      key: 'history',
      title: `已扫描（${lotList.length}）`,
      className: 'lmes-mo-report-history-modal',
      children: (
        <HistoryModal
          moInfo={moInfo}
          lotList={lotList}
          secondUomShow={secondUomShow()}
          converseValueShow={converseValueShow}
          onHistoryQtyChange={handleHistoryQtyChange}
          onHistoryDel={handleHistoryDel}
          showInputArr={showInputArr}
        />
      ),
      onOk: handleHisOk,
      onCancel: handleHisCancel,
      movable: false,
    });
  }

  /**
   * 扫描历史Modal 删除按钮
   */
  function handleHistoryDel(index) {
    if (index === 0) {
      deleteLot(lotList);
    }
    const _lotList = lotList;
    const _newLotList = newLotArr;
    _lotList.splice(index, 1);
    setLotArr(_lotList);
    setNewLotArr(_newLotList);

    historyModal.update({
      children: (
        <HistoryModal
          moInfo={moInfo}
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
          _item[`${type}Exchange`] = Number(value * moInfo.uomConversionValue).toFixed(2);
        } else {
          _item[`${type}Exchange`] = Number(value / moInfo.uomConversionValue).toFixed(2);
        }
      }
    });

    historyModal.update({
      children: (
        <HistoryModal
          moInfo={moInfo}
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
   * 扫描历史Modal 确定按钮
   */
  function handleHisOk() {
    setNewLotArr(cloneDeep(lotList));
    if (lotList.length) {
      moDS.current.set('processOkQty', lotList[0].processOkQty);
      moDS.current.set('processNgQty', lotList[0].processNgQty);
      moDS.current.set('reworkQty', lotList[0].reworkQty);
      moDS.current.set('scrappedQty', lotList[0].scrappedQty);
      moDS.current.set('pendingQty', lotList[0].pendingQty);
    }
  }

  /**
   * 扫描历史Modal 取消按钮
   */
  function handleHisCancel() {
    setLotArr(newLotArr);
    if (newLotArr[0]) {
      moDS.current.set('processOkQty', newLotArr[0].processOkQty);
      moDS.current.set('processNgQty', newLotArr[0].processNgQty);
      moDS.current.set('reworkQty', newLotArr[0].reworkQty);
      moDS.current.set('scrappedQty', newLotArr[0].scrappedQty);
      moDS.current.set('pendingQty', newLotArr[0].pendingQty);
    }
  }

  /**
   * 登录Modal中资源类型选择修改
   */
  async function handleRadioChange(value, arr) {
    handleSetOption(value);
    modal.update({
      children: (
        <LoginModal
          ds={queryDS}
          value={value}
          loginCheckArr={arr}
          onLoginClick={handleLoginClick}
          onRadioChange={handleRadioChange}
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
    let lovCode = common.workcell;
    const arr = ['prodLine', 'workcell', 'equipment', 'workerGroup'];
    const _arr = arr.filter((item) => item !== value);
    _arr.forEach((arrItem) => {
      queryDS.fields.get(`${arrItem}Obj`).set('required', false);
      queryDS.current.set(`${arrItem}Obj`, null);
      headerDS.fields.get(`${arrItem}Obj`).set('required', false);
      headerDS.current.set(`${arrItem}Obj`, null);
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

  /**
   * 底部切换按钮
   */
  function handleChangeLogin(ruleArr) {
    const flag = ruleArr.filter((i) => i.key === resourceType).length;
    const optionCheckVal = flag ? resourceType : ruleArr[0].key;
    handleSetOption(optionCheckVal);
    modal = Modal.open({
      key: 'login',
      title: '登录',
      className: 'lmes-mo-report-login-modal',
      footer: null,
      movable: false,
      children: (
        <LoginModal
          ds={queryDS}
          value={optionCheckVal}
          loginCheckArr={ruleArr}
          onLoginClick={handleLoginClick}
          onRadioChange={handleRadioChange}
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
      moDS.current.set('lotInput', null);
      return;
    }
    setLotNum(e.target.value);
    const _lotArr = lotList;
    const defaultOK = moDS.current.get('defaultQty') || moInfo.executableQty || 0;
    const okExchange = showMainUom
      ? defaultOK * moInfo.uomConversionValue
      : defaultOK / moInfo.uomConversionValue;

    _lotArr.unshift({
      lotNumber: e.target.value,
      processOkQty: defaultOK,
      processOkQtyExchange: Number(okExchange).toFixed(2),
      reworkQty: 0,
      reworkQtyExchange: 0,
      processNgQty: 0,
      processNgExchange: 0,
      scrappedQty: 0,
      scrappedQtyExchange: 0,
      pendingQty: 0,
      pendingQtyExchange: 0,
    });
    setLotArr(_lotArr);
    setNewLotArr(cloneDeep(_lotArr));
    moDS.current.set('lotInput', null);
    moDS.current.set('processOkQty', moDS.current.get('defaultQty') || 0);
    moDS.current.set('processNgQty', 0);
    moDS.current.set('reworkQty', 0);
    moDS.current.set('scrappedQty', 0);
    moDS.current.set('pendingQty', 0);
  }

  /**
   * 扫描/输入标签
   */
  function handleTagInput(e) {
    if (!e.target.value.trim()) return;
    if (tagList.filter((item) => item.tagCode === e.target.value).length) {
      notification.warning({
        message: '该标签已录入',
      });
      moDS.current.set('tagInput', null);
      return;
    }
    if (!moDS.current.get('qcType')) {
      return;
    }

    const total = tagTotal + Number(moDS.current.get('defaultQty') || 0);

    const _list = tagList.slice();
    let obj = {};
    if (moDS.current.get('qcType') === 'OK') {
      obj = {
        executeQty: moDS.current.get('defaultQty') || 0,
      };
    } else if (moDS.current.get('qcType') === 'NG') {
      obj = {
        executeNgQty: moDS.current.get('defaultQty') || 0,
      };
    } else if (moDS.current.get('qcType') === 'SCRAPPED') {
      obj = {
        scrappedQty: moDS.current.get('defaultQty') || 0,
      };
    } else if (moDS.current.get('qcType') === 'REWORK') {
      obj = {
        reworkQty: moDS.current.get('defaultQty') || 0,
      };
    } else if (moDS.current.get('qcType') === 'PENDING') {
      obj = {
        pendingQty: moDS.current.get('defaultQty') || 0,
      };
    }
    _list.push({
      ...obj,
      tagCode: e.target.value,
      number: moDS.current.get('defaultQty') || 0,
      qcType: moDS.current.get('qcType'),
    });
    if (_list.length < 6 || _list.length === 6) {
      changeHideFlag(true);
    } else {
      changeHideFlag(false);
    }
    setTagList(_list);
    setTagTotal(total);
    moDS.current.set('tagInput', null);
  }

  /**
   * 查询条件修改
   */
  async function handleQueryChange() {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) {
      return;
    }

    moDS.queryParameter = {
      moNum: headerDS.current.get('inputNum'),
      ownerOrganizationId: orgObj.organizationId,
      taskItem: 1,
    };

    const res = await moDS.query();
    if (getResponse(res)) {
      if (res && res.content) {
        if (res.content[0]) {
          setMoInfo(res.content[0]);
          showInput(res.content[0].moExecuteList && res.content[0].moExecuteList[0]);
          if (
            res.content[0].moExecuteList &&
            res.content[0].moExecuteList[0] &&
            res.content[0].moExecuteList[0].executeRule &&
            JSON.parse(res.content[0].moExecuteList[0].executeRule) &&
            JSON.parse(res.content[0].moExecuteList[0].executeRule).item_control_type
          ) {
            setTaskType(JSON.parse(res.content[0].moExecuteList[0].executeRule).item_control_type);
          } else {
            const typeRes = await checkControlType([
              {
                organizationId: orgObj.organizationId,
                itemId: res.content[0].itemId,
                groupId: res.content[0].moId,
                tenantId: getCurrentOrganizationId(),
              },
            ]);
            if (typeRes && typeRes[0]) {
              setTaskType(typeRes[0].itemControlType);
            }
          }
        } else {
          notification.warning({
            message: '暂无数据',
          });
        }
      }
    }
  }

  function showInput(record) {
    const { executeRule } = record;
    const _showinputArr = [];
    const _showFooterBtnArr = [];
    const rule = executeRule && JSON.parse(executeRule);
    if (!isEmpty(rule)) {
      if (rule.ok_report === '1') {
        _showinputArr.push('ok');
      }
      if (rule.ng_report === '1') {
        _showinputArr.push('ng');
      }
      if (rule.scrapped_report === '1') {
        _showinputArr.push('scrap');
      }
      if (rule.rework_report === '1') {
        _showinputArr.push('rework');
      }
      if (rule.pending_report === '1') {
        _showinputArr.push('pending');
      }
      if (rule.issue_input === '1') {
        _showFooterBtnArr.push('issue');
      }
      if (rule.document === '1') {
        _showFooterBtnArr.push('document');
      }
      if (rule.inspection_report === '1') {
        _showFooterBtnArr.push('report');
      }
      if (rule.report_uom_type === 'MAIN') {
        setShowMainUom(true);
      } else if (rule.report_uom_type === 'SECOND') {
        setShowMainUom(false);
      }
    } else {
      _showinputArr.push('ok');
    }
    setShowInputArr(_showinputArr);
    setFooterBtnArr(_showFooterBtnArr);
  }

  function secondUomShow() {
    if (showMainUom) {
      if (moInfo.secondUomName) {
        return moInfo.secondUomName;
      } else {
        return null;
      }
    } else {
      return moInfo.uomName;
    }
  }

  function converseValueShow(value) {
    if (showMainUom) {
      return Number(value * moInfo.uomConversionValue).toFixed(2);
    } else {
      return Number(value / moInfo.uomConversionValue).toFixed(2);
    }
  }

  /**
   * 数量改变
   */
  function handleQtyChange(type, value) {
    const _lotList = lotList.slice();
    if (_lotList.length) {
      _lotList.forEach((item) => {
        const _item = item;
        if (_item.lotNumber === lotNumber) {
          _item[type] = value;
          if (showMainUom) {
            _item[`${type}Exchange`] = Number(value * moInfo.uomConversionValue).toFixed(2);
          } else {
            _item[`${type}Exchange`] = Number(value / moInfo.uomConversionValue).toFixed(2);
          }
        }
      });
    }
    setLotArr(_lotList);
    setNewLotArr(cloneDeep(_lotList));
  }

  /**
   * 底部开工按钮
   */
  function handleStart() {}

  /**
   * 底部提交按钮
   */
  async function handleSubmit() {
    if (isEmpty(moInfo)) return;
    const list = [];
    if (taskType === 'QUANTITY') {
      if (showMainUom) {
        list.push({
          executeQty: moDS.current.get('processOkQty'),
          executeNgQty: moDS.current.get('processNgQty'),
          scrappedQty: moDS.current.get('scrappedQty'),
          reworkQty: moDS.current.get('reworkQty'),
          pendingQty: moDS.current.get('pendingQty'),
        });
      } else {
        list.push({
          executeQty: moDS.current.get('processOkQty') / moInfo.uomConversionValue,
          executeNgQty: moDS.current.get('processNgQty') / moInfo.uomConversionValue,
          scrappedQty: moDS.current.get('scrappedQty') / moInfo.uomConversionValue,
          reworkQty: moDS.current.get('reworkQty') / moInfo.uomConversionValue,
          pendingQty: moDS.current.get('pendingQty') / moInfo.uomConversionValue,
          secondExecuteQty: moDS.current.get('processOkQty'),
        });
      }
    } else if (taskType === 'LOT') {
      if (!lotList.length) {
        notification.warning({
          message: '请录入批次后再提交',
        });
        return;
      }
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
            executeQty: item.processOkQty / moInfo.uomConversionValue,
            executeNgQty: item.processNgQty / moInfo.uomConversionValue,
            scrappedQty: item.scrappedQty / moInfo.uomConversionValue,
            reworkQty: item.reworkQty / moInfo.uomConversionValue,
            pendingQty: item.pendingQty / moInfo.uomConversionValue,
            secondExecuteQty: item.processOkQty,
          });
        }
      });
    } else if (taskType === 'TAG') {
      if (!tagList.length) {
        notification.warning({
          message: '请录入标签后再提交',
        });
        return;
      }
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
            executeQty: item.executeQty / moInfo.uomConversionValue,
            executeNgQty: item.executeNgQty / moInfo.uomConversionValue,
            scrappedQty: item.scrappedQty / moInfo.uomConversionValue,
            reworkQty: item.reworkQty / moInfo.uomConversionValue,
            pendingQty: item.pendingQty / moInfo.uomConversionValue,
            secondExecuteQty: item.executeQty,
          });
        }
      });
    }
    const paramsArr = [
      {
        organizationId: orgObj.organizationId,
        organizationCode: orgObj.organizationCode,
        moCompleteFlag: 1,
        itemControlType: taskType,
        moId: moInfo.moId,
        moNum: moInfo.moNum,
        executeTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        workerId: headerDS.current.get('workerId'),
        worker: headerDS.current.get('worker'),
        workerGroupId: headerDS.current.get('workerGroupId'),
        workerGroup: headerDS.current.get('workerGroupCode'),
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
    const res = await submitMoOutput(paramsArr);
    if (getResponse(res)) {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '提交成功',
        });
        setMoInfo({});
        setLotNum(null);
        setLotArr([]);
        setNewLotArr([]);
        setTagList([]);
        setTagTotal(0);
        setRemark(null);
        moDS.queryParameter = {
          moNum: headerDS.current.get('inputNum'),
          ownerOrganizationId: orgObj.organizationId,
          taskItem: 1,
        };
        const moRes = await moDS.query();
        if (getResponse(moRes) && !moRes.failed && moRes.content) {
          setMoInfo(moRes.content[0]);
          showInput(moRes.content[0]);
        }
      }
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

  /**
   * 删除批次公用方法
   */
  function deleteLot(list) {
    if (list.length > 1) {
      setLotNum(list[1].lotNumber);
      moDS.current.set('processOkQty', list[1].processOkQty);
      moDS.current.set('processNgQty', list[1].processNgQty);
      moDS.current.set('reworkQty', list[1].reworkQty);
      moDS.current.set('scrappedQty', list[1].scrappedQty);
      moDS.current.set('pendingQty', list[1].pendingQty);
    } else {
      setLotNum(null);
      moDS.current.set('processOkQty', 0);
      moDS.current.set('processNgQty', 0);
      moDS.current.set('reworkQty', 0);
      moDS.current.set('scrappedQty', 0);
      moDS.current.set('pendingQty', 0);
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
   * 备注Modal
   */
  function handleRemark() {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: 'lmes-mo-report-login-modal',
      movable: false,
      children: (
        <TextField
          dataSet={moDS}
          name="remark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
        />
      ),
      onOk: () => setRemark(moDS.current.get('remark')),
      onCancel: () => moDS.current.set('remark', remark),
    });
  }

  /**
   * 底部重置按钮
   */
  function handleReset() {
    if (!workerLock) {
      headerDS.current.set('workerObj', null);
    }
    if (!prodLineLock) {
      headerDS.current.set('prodLineObj', null);
      headerDS.current.set('workcellObj', null);
      headerDS.current.set('equipmentObj', null);
      headerDS.current.set('workerGroupObj', null);
    }

    headerDS.current.set('inputNum', null);
    moDS.current.set('remark', null);
    setMoInfo({});
    setLotNum(null);
    setLotArr([]);
    setNewLotArr([]);
    setTagList([]);
    setTagTotal(0);
    setRemark(null);
  }

  /**
   * 底部退出按钮
   */
  function handleExit() {
    props.history.push('/workplace');
    closeTab('/pub/lmes/mo-report');
  }

  /**
   * 底部撤销按钮
   */
  function handleRestore() {}

  return (
    <Fragment>
      <div id="lmes-mo-report">
        <div className="lmes-mo-report-header">
          <div className="header-left">
            <img src={LogoImg} alt="" />
          </div>
          <div className="header-right">
            <span className="date-time">{timeComponent}</span>
            {shiftShow && (
              <span className="class-type">
                <Select disabled dataSet={queryDS} name="shift" />
              </span>
            )}
          </div>
        </div>
        <Header
          headerDS={headerDS}
          avator={avator}
          workerLock={workerLock}
          prodLineLock={prodLineLock}
          resourceType={resourceType}
          onQuery={handleQueryChange}
          onLockChange={handleLockClick}
        />
        <div className="lmes-mo-report-content">
          {!isEmpty(moInfo) && <ReportInfo moInfo={moInfo} />}
          {!isEmpty(moInfo) && taskType && (
            <ReportItem
              taskType={taskType}
              moInfo={moInfo}
              moDS={moDS}
              lotNumber={lotNumber}
              tagList={tagList}
              tagTotal={tagTotal}
              hideFlag={hideFlag}
              showInputArr={showInputArr}
              showMainUom={showMainUom}
              secondUomShow={secondUomShow()}
              converseValueShow={converseValueShow}
              onShowHistoryModal={handleShowHistoryModal}
              onLotInput={handleLotInput}
              onTagInput={handleTagInput}
              onQtyChange={handleQtyChange}
              onDelLot={handleDelLot}
              onTagInputChange={handleTagInputChange}
              onTagDel={handleTagDel}
            />
          )}
        </div>
        <Footer
          footerExtraBtnArr={footerExtraBtnArr}
          loginCheckArr={loginCheckArr}
          onChangeLogin={handleChangeLogin}
          onStart={handleStart}
          onSubmit={handleSubmit}
          onRemarkClick={handleRemark}
          onReset={handleReset}
          onClose={handleExit}
          onRestore={handleRestore}
        />
      </div>
    </Fragment>
  );
};

export default formatterCollections({
  code: ['lmes.moReport', 'lmes.common'],
})((props) => MoReport(props));
