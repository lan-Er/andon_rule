/**
 * @Description: 领料执行--捡料页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-10 10:05:15
 * @LastEditors: yu.na
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Button, TextField, Modal, DataSet } from 'choerodon-ui/pro';
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
} from '@/services/issueRequestExecuteService';
import { modalTableDSConfig } from '@/stores/issueRequestExecuteDS';
import { queryLovData } from 'hlos-front/lib/services/api';
import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import CopyImg from 'hlos-front/lib/assets/icons/copy.svg';
// import DownImg from 'hlos-front/lib/assets/icons/down-blue.svg';
import Footer from './Footer';
import PickModal from './PickModal';
import ListItem from './ListItem';
import './style.less';

const ExecutePick = (props) => {
  const modalTableDS = useMemo(() => new DataSet(modalTableDSConfig()), []);
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
  const [workObj, setWorker] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const { state = {} } = props.location;

  let modal = null;

  useEffect(() => {
    if (state.record) {
      checkTitleArr(state.record);
      setHeaderData(state.record);
      queryLine();
    }
    return () => {
      closeTab('/pub/lwms/issue-request-execute/pick');
    };
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

  async function queryLine() {
    setLoading(true);
    const res = await requestLine({
      requestId: state.record.requestId,
      page: -1,
      // size: 6,
    });
    if (res && res.content) {
      const _list = [];
      res.content.forEach((item) => {
        if (item.itemControlType === 'QUANTITY') {
          _list.push({
            ...item,
            requestPickDetailList: [
              {
                pickedQty1: item.applyQty,
                pickedQty: item.applyQty,
                warehouseId: item.warehouseId,
                warehouseCode: item.warehouseCode,
                warehouseName: item.warehouseName,
                wmAreaId: item.wmAreaId,
                wmAreaCode: item.wmAreaCode,
                wmAreaName: item.wmAreaName,
                wmUnitId: item.wmUnitId,
                wmUnitCode: item.wmUnitCode,
                wmUnitName: item.wmUnitName,
              },
            ],
            active: false,
          });
        } else {
          _list.push({
            ...item,
            active: false,
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
      arr[1].completed = true;
      arr[1].ongoing = false;
      arr[2].completed = true;
      arr[2].ongoing = false;
      arr[3].completed = false;
      arr[3].ongoing = true;
      setFooterHide(true);
      setInputDisabled(false);
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
          modalTableDS={modalTableDS}
          type={record.itemControlType}
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
      onClose: () => handleModalTable(),
    });
  }

  function handlePickOk(record) {
    const _checkedList = modalTableDS.selected; // checkedList.slice();
    let qty = 0;
    _checkedList.forEach((item) => {
      const _item = item.toJSONData();
      if (record.itemControlType === 'LOT') {
        item.set('pickedQty', _item.pickedQty || _item.advisedQty || 0);
        qty += _item.advisedQty || _item.pickedQty || 0;
      } else {
        item.set('pickedQty', _item.initialQty || _item.quantity || 0);
        qty += _item.quantity;
      }
    });
    const _record = {
      ...record,
      pickedQty1: qty,
      requestPickDetailList: _checkedList.map((j) => j.toJSONData()),
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
    handleModalTable();
    modal.close();
  }

  function handleModalTable() {
    modalTableDS.loadData([]);
  }

  function handlePickCancel() {
    handleModalTable();
    modal.close();
  }

  function handleInputChange(value) {
    setInputValue(value);
  }

  async function handleSearchLine(flag, itemCode) {
    setLoading(true);
    const res = await requestLine({
      requestId: state.record.requestId,
      itemCode,
      page: -1,
    });
    if (res && res.content) {
      if (flag) {
        const _list = [];
        res.content.forEach((item) => {
          if (item.itemControlType === 'QUANTITY') {
            _list.push({
              ...item,
              requestPickDetailList: [
                {
                  pickedQty1: item.applyQty,
                  pickedQty: item.applyQty,
                  warehouseId: item.warehouseId,
                  warehouseCode: item.warehouseCode,
                  warehouseName: item.warehouseName,
                  wmAreaId: item.wmAreaId,
                  wmAreaCode: item.wmAreaCode,
                  wmAreaName: item.wmAreaName,
                  wmUnitId: item.wmUnitId,
                  wmUnitCode: item.wmUnitCode,
                  wmUnitName: item.wmUnitName,
                },
              ],
              active: false,
            });
          } else {
            _list.push({
              ...item,
              active: false,
            });
          }
        });
        setLineList(_list);
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
    props.history.push('/lwms/issue-request-execute');
    closeTab('/pub/lwms/issue-request-execute/pick');
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
          if (i.warehouseId) {
            item.warehouseId = i.warehouseId;
            item.warehouseCode = i.warehouseCode;
            item.warehouseName = i.warehouseName;
          } else {
            item.warehouseId = null;
            item.warehouseCode = null;
            item.warehouseName = null;
          }
          if (i.wmAreaId) {
            item.wmAreaId = i.wmAreaId;
            item.wmAreaCode = i.wmAreaCode;
            item.wmAreaName = i.wmAreaName;
          } else {
            item.wmAreaId = null;
            item.wmAreaCode = null;
            item.wmAreaName = null;
          }
          if (i.wmUnitId) {
            item.wmUnitId = i.wmUnitId;
            item.wmUnitCode = i.wmUnitCode;
            item.wmUnitName = i.wmUnitName;
          } else {
            item.wmUnitId = null;
            item.wmUnitCode = null;
            item.wmUnitName = null;
          }
          _lineList.push({
            ...item,
            requestExecuteDetailList: [i],
            executedQty: item.pickedQty1,
          });
        });
        // _lineList.push({
        //   ...item,
        //   requestExecuteDetailList: item.requestExecuteDetailList || item.requestPickDetailList,
        //   executedQty: item.pickedQty1,
        // });
      } else {
        _lineList.push(item);
      }
    });
    // setLineList(_lineList);

    let res = {};
    setLoading(true);
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
    setLoading(false);
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
      queryLine();
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
        item.requestPickDetailList.forEach((detail) => {
          if (detail.warehouseId) {
            item.warehouseId = detail.warehouseId;
            item.warehouseCode = detail.warehouseCode;
            item.warehouseName = detail.warehouseName;
          } else {
            item.warehouseId = null;
            item.warehouseCode = null;
            item.warehouseName = null;
          }
          if (detail.wmAreaId) {
            item.wmAreaId = detail.wmAreaId;
            item.wmAreaCode = detail.wmAreaCode;
            item.wmAreaName = detail.wmAreaName;
          } else {
            item.wmAreaId = null;
            item.wmAreaCode = null;
            item.wmAreaName = null;
          }
          if (detail.wmUnitId) {
            item.wmUnitId = detail.wmUnitId;
            item.wmUnitCode = detail.wmUnitCode;
            item.wmUnitName = detail.wmUnitName;
          } else {
            item.wmUnitId = null;
            item.wmUnitCode = null;
            item.wmUnitName = null;
          }
          _lineList.push({
            ...item,
            requestPickDetailList: [detail],
            pickedQty: item.pickedQty1,
            toWarehouseId: null,
            toWarehouseCode: null,
            toWarehouseName: null,
          });
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
    // setLineList(_lineList);
    setLoading(true);
    const res = await requestPick({
      ...params,
      ...headerData,
      pickedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      requestPickLineList: detailList,
    });
    setLoading(false);
    if (res && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      checkTitleArr(res);
      if (res.requestHeader && res.requestHeader.requestStatus) {
        setHeaderData({ ...headerData, requestStatus: res.requestHeader.requestStatus });
      }
      queryLine();
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
          warehouseId: record.warehouseId,
          warehouseCode: record.warehouseCode,
          warehouseName: record.warehouseName,
          wmAreaId: record.wmAreaId,
          wmAreaCode: record.wmAreaCode,
          wmAreaName: record.wmAreaName,
          wmUnitId: record.wmUnitId,
          wmUnitCode: record.wmUnitCode,
          wmUnitName: record.wmUnitName,
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
        wmAreaId: null,
        wmAreaCode: null,
        wmAreaName: null,
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
        wmAreaId: null,
        wmAreaCode: null,
        wmAreaName: null,
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
            {lineList.map((el) => {
              return (
                <ListItem
                  key={el.requestLineId}
                  data={el}
                  inputDisabled={inputDisabled}
                  headerData={headerData}
                  handleItemClick={handleItemClick}
                  handleNumChange={handleNumChange}
                  onWarehouseChange={handleWarehouseChange}
                  onWmAreaChange={handleWmAreaChange}
                />
              );
            })}
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
        isHide={footerHide}
        status={status}
      />
      {loading && <Loading />}
    </div>
  );
};

export default ExecutePick;
