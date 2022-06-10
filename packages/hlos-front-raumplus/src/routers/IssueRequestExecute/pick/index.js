/**
 * @Description: 领料执行--捡料页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-10 10:05:15
 * @LastEditors: yu.na
 */

import React, { useEffect, useState } from 'react';
import { Button, TextField, Modal, Spin } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import moment from 'moment';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import Icons from 'components/Icons';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import {
  requestLine,
  requestPick,
  requestExecute,
  requestPickedExecute,
  autoExecute,
} from '@/services/issueRequestExecuteService';
import { queryLovData } from 'hlos-front/lib/services/api';
import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import CopyImg from 'hlos-front/lib/assets/icons/copy.svg';
// import DownImg from 'hlos-front/lib/assets/icons/down-blue.svg';
import Footer from './Footer';
import PickModal from './PickModal';
import ListItem from './ListItem';
import './style.less';

const ExecutePick = (props) => {
  const [headerData, setHeaderData] = useState({});
  const [lineList, setLineList] = useState([]);
  const [inputValue, setInputValue] = useState(null);
  const [titleArr, setTitleArr] = useState([]);
  const [footerHide, setFooterHide] = useState(false);
  const [status, setStatus] = useState('RELEASED');
  const [inputDisabled, setInputDisabled] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageDisabled, changePageDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [workObj, setWorker] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const [defaultWmAreaObj, setDefaultWmAreaObj] = useState({});

  let modal = null;

  useEffect(() => {
    const { state = {} } = props.location;
    setDefaultWmAreaObj(state.defaultWmAreaObj);

    async function queryLine() {
      setLoading(true);
      const res = await requestLine({
        requestId: state.record.requestId,
        page: -1,
        // size: 6,
      });
      // console.log('defaultWmAreaObj为000', JSON.stringify(state.defaultWmAreaObj));
      if (res && res.content) {
        // console.log('defaultWmAreaObj为111', JSON.stringify(state.defaultWmAreaObj));
        const _list = [];
        res.content.forEach((item) => {
          if (item.itemControlType === 'QUANTITY') {
            _list.push({
              ...item,
              ...state.defaultWmAreaObj,
              requestPickDetailList: [
                {
                  pickedQty1: item.applyQty,
                  pickedQty: item.applyQty,
                },
              ],
              active: false,
            });
          } else {
            // console.log('defaultWmAreaObj为', JSON.stringify(state.defaultWmAreaObj));
            _list.push({
              ...item,
              active: false,
              ...state.defaultWmAreaObj,
              // warehouseObj: {
              //   warehouseName: defaultWmAreaObj.warehouseName,
              //   warehouseCode: defaultWmAreaObj.warehouseCode,
              //   warehouseId: defaultWmAreaObj.warehouseId,
              // },
              // wmAreaObj: {
              //   wmAreaName: defaultWmAreaObj.wmAreaName,
              //   wmAreaCode: defaultWmAreaObj.wmAreaCode,
              //   wmAreaId: defaultWmAreaObj.wmAreaId,
              // },
            });
          }
        });
        setLineList(_list);
        // if (res.totalElements <= 6) {
        //   changePageDisabled(true);
        // }
      }

      setLoading(false);
    }

    if (state.record) {
      checkTitleArr(state.record);
      setHeaderData(state.record);
      queryLine();
    }
  }, [props.location]);

  useEffect(() => {
    async function queryDefaultWorker() {
      const res = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
      if (getResponse(res) && !res.failed && res.content && res.content[0]) {
        setWorker(res.content[0]);
      }
    }
    queryDefaultWorker();
  }, []);

  async function handleItemClick(record) {
    const _list = [];
    lineList.forEach((item) => {
      if (item.requestLineId === record.requestLineId) {
        _list.push({
          ...item,
          active: true,
        });
      } else {
        _list.push({
          ...item,
          active: false,
        });
      }
    });

    // 遍历列表 将item对应项的active属性置为true 其他置为false
    setLineList(_list);

    if (status !== 'RELEASED') return;
    if (record.itemControlType === 'QUANTITY') return;

    handlePickModalShow(record);
  }

  function checkTitleArr(record) {
    let _status = '';
    if (record.requestStatus) {
      _status = record.requestStatus;
    } else if (record.requestHeader && record.requestHeader.requestStatus) {
      _status = record.requestHeader.requestStatus;
    }
    setStatus(_status);
    const arr = [
      {
        key: 1,
        title: '已提交',
        completed: true,
      },
      {
        key: 2,
        title: '待拣料',
        completed: false,
        ongoing: true,
      },
      {
        key: 3,
        title: '待发出',
        completed: false,
      },
      {
        key: 4,
        title: '待接收',
        completed: false,
      },
    ];
    if (_status === 'PICKED') {
      arr[1].completed = true;
      arr[1].ongoing = false;
      arr[2].completed = false;
      arr[2].ongoing = true;
      setInputDisabled(true);
    } else if (_status === 'EXECUTED') {
      arr[1].ongoing = false;
      arr[1].completed = true;
      arr[2].completed = true;
      arr[3].ongoing = true;
      setFooterHide(true);
      setInputDisabled(true);
    }
    setTitleArr(arr);
  }

  function handlePickModalShow(record) {
    modal = Modal.open({
      key: 'lot-pick',
      title: record.itemControlType === 'LOT' ? '批次拣料' : '标签拣料',
      className: 'lwms-issue-request-execute-pick-modal',
      children: (
        <PickModal
          data={record}
          headerData={headerData}
          inputDisabled={inputDisabled}
          onModalClose={handlePickCancel}
          onModalSure={handlePickOk}
        />
      ),
      style: {
        top: 10,
      },
      footer: null,
      movable: false,
      closable: true,
    });
  }

  function handlePickOk(record, qty, checkedList) {
    const _checkedList = checkedList.slice();
    _checkedList.forEach((item) => {
      const _item = item;
      if (!_item.pickedQty) {
        _item.pickedQty = _item.initialQty;
      }
    });
    const _record = {
      ...record,
      pickedQty1: qty,
      requestPickDetailList: checkedList,
    };
    const _list = [];
    lineList.forEach((item) => {
      if (item.requestLineId === record.requestLineId) {
        _list.push(_record);
      } else {
        _list.push(item);
      }
    });
    setLineList(_list);
    modal.close();
  }

  function handlePickCancel() {
    modal.close();
  }

  function handleInputChange(value) {
    setInputValue(value);
  }

  async function handleSearchLine(flag, itemCode) {
    const { state = {} } = props.location;
    setLoading(true);
    const res = await requestLine({
      requestId: state.record.requestId,
      itemCode,
      page: -1,
      attributeString1: '1',
    });
    if (res && res.content) {
      if (flag) {
        setLineList(res.content);
      } else {
        if (
          res.content[0] &&
          lineList.filter((i) => i.requestLineId === res.content[0].requestLineId).length
        ) {
          return;
        }
        setLineList(lineList.concat(res.content));
      }

      // if (page === res.totalPages) {
      //   changePageDisabled(true);
      // }
    }
    setLoading(false);
  }

  function handleExit() {
    props.history.push('/raumplus/issue-request-execute');
    closeTab('/pub/raumplus/issue-request-execute/pick');
  }

  function handleReset() {
    setInputValue(null);
    handleSearchLine(true);
  }

  async function handleSend() {
    let params = {};
    if (!isEmpty(workObj)) {
      params = {
        executedWorkerId: workObj.workerId,
        executedWorker: workObj.workerName,
      };
    }
    const _lineList = [];
    lineList.forEach((item) => {
      if (item.requestPickDetailList) {
        item.requestPickDetailList.forEach((i) => {
          const _i = i;
          _i.executedQty = _i.pickedQty;
        });
        _lineList.push({
          ...item,
          requestExecuteDetailList: item.requestExecuteDetailList || item.requestPickDetailList,
          executedQty: item.pickedQty1,
        });
      } else {
        _lineList.push(item);
      }
    });
    setLineList(_lineList);

    let res = {};
    setSubmitLoading(true);
    if (status === 'PICKED') {
      res = await requestPickedExecute([
        {
          ...params,
          requestId: headerData.requestId,
          requestNum: headerData.requestNum,
          executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        },
      ]);
    } else {
      res = await requestExecute({
        ...params,
        ...headerData,
        requestStatus: status,
        executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        requestExecuteLineList: _lineList,
      });
    }
    setSubmitLoading(false);
    if (res && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      if (status === 'PICKED') {
        checkTitleArr({
          requestStatus: 'EXECUTED',
        });
      } else {
        checkTitleArr(res);
      }
      props.history.push('/raumplus/issue-request-execute');
      closeTab('/pub/raumplus/issue-request-execute/pick');
    }
  }

  function handleCancel() {}

  async function handlePick() {
    let params = {};
    if (!isEmpty(workObj)) {
      params = {
        pickedWorkerId: workObj.workerId,
        pickedWorker: workObj.workerName,
      };
    }
    const _lineList = [];
    lineList.forEach((item) => {
      if (item.requestPickDetailList) {
        _lineList.push({
          ...item,
          pickedQty: item.pickedQty1,
          toWarehouseId: null,
          toWarehouseCode: null,
          toWarehouseName: null,
        });
      } else {
        _lineList.push({
          ...item,
          toWarehouseId: null,
          toWarehouseCode: null,
          toWarehouseName: null,
        });
      }
    });
    const detailList = [];
    _lineList.forEach((i) => {
      if (i.requestPickDetailList && i.requestPickDetailList.length) {
        detailList.push(i);
      }
    });
    setLineList(_lineList);
    setSubmitLoading(true);
    const res = await requestPick({
      ...params,
      ...headerData,
      pickedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      requestPickLineList: detailList,
    });
    setSubmitLoading(false);
    if (res && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      checkTitleArr(res);
    }
  }

  async function handleAutoSend() {
    let params = {};
    if (!isEmpty(workObj)) {
      params = {
        executedWorkerId: workObj.workerId,
        executedWorker: workObj.workerName,
      };
    }
    const _lineList = [];
    lineList.forEach((item) => {
      if (item.requestPickDetailList) {
        item.requestPickDetailList.forEach((i) => {
          const _i = i;
          _i.executedQty = _i.pickedQty;
        });
        _lineList.push({
          ...item,
          requestExecuteDetailDTOS: item.requestExecuteDetailList || item.requestPickDetailList,
          executedQty: item.pickedQty1,
        });
      } else {
        _lineList.push(item);
      }
    });
    setLineList(_lineList);

    let res = {};
    setSubmitLoading(true);
    res = await autoExecute({
      ...params,
      ...headerData,
      requestStatus: status,
      executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      raumplusRequestLineDTOS: _lineList,
    });
    // if (status === 'PICKED') {
    //   res = await autoExecute([
    //     {
    //       ...params,
    //       requestId: headerData.requestId,
    //       requestNum: headerData.requestNum,
    //       executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
    //     },
    //   ]);
    // } else {
    //   res = await autoExecute({
    //     ...params,
    //     ...headerData,
    //     requestStatus: status,
    //     executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
    //     raumplusRequestLineDTOS: _lineList,
    //   });
    // }
    setSubmitLoading(false);
    if (res && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      if (status === 'PICKED') {
        checkTitleArr({
          requestStatus: 'EXECUTED',
        });
      } else {
        checkTitleArr(res);
      }
      props.history.push('/raumplus/issue-request-execute');
      closeTab('/pub/raumplus/issue-request-execute/pick');
    }
  }

  function handleCopy() {
    const obj = document.getElementById('num');
    obj.focus();
    obj.select();
    try {
      if (document.execCommand('Copy', false, null)) {
        // console.log('复制成功');
      } else {
        // console.log('复制失败');
      }
    } catch (err) {
      // console.log(err);
    }
  }

  function handleNumChange(value, record) {
    const index = lineList.findIndex((item) => item.requestLineId === record.requestLineId);
    const list = [];
    lineList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      pickedQty1: value || 0,
      requestPickDetailList: [
        {
          pickedQty: value || 0,
        },
      ],
    });
    setLineList(list);
  }

  // function handlePageChange() {
  //   if (pageDisabled) return;
  //   handleSearchLine(false, inputValue, currentPage - 1, 6);
  //   setCurrentPage(currentPage + 1);
  // }

  function handleWarehouseChange(rec, data) {
    const idx = lineList.findIndex((i) => i.requestLineId === data.requestLineId);
    const cloneList = [...lineList];
    if (rec) {
      cloneList.splice(idx, 1, {
        ...data,
        warehouseId: rec.warehouseId,
        warehouseCode: rec.warehouseCode,
        warehouseName: rec.warehouseName,
        requestPickDetailList: null,
        requestExecuteDetailList: null,
        pickedQty1: 0,
      });
    } else {
      cloneList.splice(idx, 1, {
        ...data,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        requestPickDetailList: null,
        requestExecuteDetailList: null,
        pickedQty1: 0,
      });
    }
    setLineList(cloneList);
  }

  function handleWmAreaChange(rec, data) {
    const idx = lineList.findIndex((i) => i.requestLineId === data.requestLineId);
    const cloneList = [...lineList];
    if (rec) {
      cloneList.splice(idx, 1, {
        ...data,
        wmAreaId: rec.wmAreaId,
        wmAreaCode: rec.wmAreaCode,
        wmAreaName: rec.wmAreaName,
        requestPickDetailList: null,
        requestExecuteDetailList: null,
        pickedQty1: 0,
      });
    } else {
      cloneList.splice(idx, 1, {
        ...data,
        requestPickDetailList: null,
        requestExecuteDetailList: null,
        wmAreaId: null,
        wmAreaCode: null,
        wmAreaName: null,
        pickedQty1: 0,
      });
    }
    setLineList(cloneList);
  }

  function handleChangeExpand() {
    setIsExpand(!isExpand);
  }

  return (
    <div className="lwms-issue-request-execute-pick">
      <CommonHeader />
      <div className="lwms-issue-request-execute-header">
        {titleArr.map((el, index) => (
          <div key={el.key}>
            <div className={`circle ${!el.completed && !el.ongoing ? 'gray' : null}`}>
              {el.completed ? <span /> : index + 1}
            </div>
            <div className={`title ${!el.completed && !el.ongoing ? 'gray' : null}`}>
              {el.title}
            </div>
            {index !== titleArr.length - 1 && (
              <div className={`line ${el.completed && !el.ongoing ? null : 'gray'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="lwms-issue-request-execute-content">
        <div className="lwms-issue-request-execute-content-top">
          <div className="lwms-issue-request-execute-content-left-top">
            <div className="lwms-issue-request-execute-content-avator">
              <img src={headerData.imageUrl || DefaultAvatorImg} alt="" />
              <span className="name">{headerData.creator}</span>
            </div>
            <p className="order">
              <input value={headerData.requestNum || ''} id="num" readOnly />
              <span>{headerData.requestNum}</span>
              <img src={CopyImg} alt="" onClick={handleCopy} />
            </p>
            <span className="type">{headerData.requestTypeName}</span>
          </div>
          <div className="lwms-issue-request-execute-content-right-top">
            <TextField placeholder="请输入物料号" value={inputValue} onChange={handleInputChange} />
            <Button color="primary" onClick={() => handleSearchLine(true, inputValue)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <div className="lwms-issue-request-execute-content-bottom">
          {isExpand ? (
            <div className="lwms-issue-request-execute-content-bottom-left">
              <div>
                {headerData.assemblyItemCode && (
                  <p>
                    <Icons type="cube-blue" size="32" color="#9E9E9E" />
                    {/* <img src={SquartImg} alt="" /> */}
                    {headerData.assemblyItemCode}
                  </p>
                )}
                {headerData.requestDepartmentName && (
                  <p>
                    <Icons type="org" size="32" color="#9E9E9E" />
                    {headerData.requestDepartmentName}
                  </p>
                )}
                {headerData.moNum && (
                  <p>
                    <Icons type="tubiao_gongyingshangbeifen3" size="32" color="#9E9E9E" />
                    {headerData.moNum}
                  </p>
                )}
                {headerData.prodLineName && (
                  <p>
                    <Icons type="location" size="32" color="#9E9E9E" />
                    {headerData.prodLineName}
                  </p>
                )}
                {headerData.planDemandDate && (
                  <p>
                    <Icons type="tubiao_gongyingshangbeifen5" size="32" color="#9E9E9E" />
                    {moment(headerData.planDemandDate).format(DEFAULT_DATE_FORMAT)}
                  </p>
                )}
              </div>
              <div
                className="lwms-issue-request-execute-content-expand-icon"
                onClick={handleChangeExpand}
              >
                {'<<'}
              </div>
            </div>
          ) : (
            <div
              className="lwms-issue-request-execute-content-bottom-left-hide"
              onClick={handleChangeExpand}
            >
              <Icon type="navigate_next" />
            </div>
          )}
          <div className="lwms-issue-request-execute-content-bottom-right">
            <Spin spinning={loading}>
              {lineList.map((el) => {
                return (
                  <ListItem
                    key={el.requestLineId}
                    data={el}
                    inputDisabled={inputDisabled}
                    headerData={headerData}
                    defaultWmAreaObj={defaultWmAreaObj}
                    handleItemClick={handleItemClick}
                    handleNumChange={handleNumChange}
                    onWarehouseChange={handleWarehouseChange}
                    onWmAreaChange={handleWmAreaChange}
                  />
                );
              })}
            </Spin>
          </div>
          {/* <img
             className="down-icon"
             src={DownImg}
             alt=""
             onClick={handlePageChange}
             style={{ cursor: !pageDisabled ? 'pointer' : 'not-allowed' }}
           /> */}
        </div>
      </div>
      <Footer
        onClose={handleExit}
        onReset={handleReset}
        onSend={handleSend}
        onCancel={handleCancel}
        onPick={handlePick}
        onAutoSend={handleAutoSend}
        isHide={footerHide}
        status={status}
      />
      {submitLoading && <Loading />}
    </div>
  );
};

export default ExecutePick;
