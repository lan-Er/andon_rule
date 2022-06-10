/**
 * @Description: 领料执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 120120-07-10 10:05:15
 * @LastEditors: yu.na
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Lov, DataSet, TextField, SelectBox } from 'choerodon-ui/pro';
import { Checkbox, Spin } from 'choerodon-ui';
import { isEmpty, xor } from 'lodash';
import moment from 'moment';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { Content } from 'components/Page';
import { queryDS } from '@/stores/issueRequestExecuteDS';
import { requestByNum, requestPickedExecute } from '@/services/issueRequestExecuteService';
import SendImg from 'hlos-front/lib/assets/icons/send.svg';
import Card from './Card';
import './style.less';

const { Option } = SelectBox;
const qDS = () => new DataSet(queryDS());

const IssueRequestExecute = (props) => {
  const ds = useDataSet(qDS, IssueRequestExecute);

  const shipOrderStatus = useRef('');
  // const [executeList, setExecuteList] = useState([]);
  const executeList = useRef([]);
  const [pickList, setPickList] = useState([]);
  const [spinning, changeSpinning] = useState(false);
  const [totalElements, setTotal] = useState(0);
  const [orderNum, setOrderNum] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDisabled, changePageDisabled] = useState(false);
  const [orderSearchNum, changeOrderSearchNum] = useState(0);
  const [lovChangeFlag, setLovChange] = useState(false);
  const [workObj, setWorker] = useState({});
  // const [refreshFlag, changeRefreshFlag] = useState(false);

  useEffect(() => {
    async function queryDefaultWorker() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (getResponse(res) && !res.failed && res.content && res.content[0]) {
        const { workerId, workerCode, workerName, organizationId } = res.content[0];
        setWorker({
          workerId,
          workerCode,
          workerName,
        });
        ds.queryDataSet.current.set('organizationId', organizationId);
        handleHeaderSearch('RELEASED');
      }
    }
    queryDefaultWorker();
  }, []);

  // useEffect(() => {
  //   handleHeaderSearch(shipOrderStatus);
  // }, [shipOrderStatus]);

  function handleChangeActive(value) {
    if (value !== shipOrderStatus.current) {
      // setExecuteList([]);
      executeList.current = [];
    }
    // changeActive(value);
    setCurrentPage(0);
    // setShipOrderStatus(value)
    shipOrderStatus.current = value;
    handleHeaderSearch(value);
  }

  async function handleHeaderSearch(value, page = 0, size, flag) {
    setOrderNum(null);
    changeSpinning(true);
    changeOrderSearchNum(-1);
    let params = {
      requestStatus: ds.queryDataSet.current.get('shipOrderStatus'),
      page: page || 0,
      size: size || 12,
      showImage: true,
    };
    if (ds.queryDataSet.current.get('shipOrderStatus') === 'EXECUTED') {
      params = {
        ...params,
        viaWarehouseFlag: 'Y',
      };
    }
    ds.queryParameter = params;
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      const list = executeList.current.slice();
      if (!res.content.length) {
        // setExecuteList([]);
        executeList.current = [];
      }
      if (lovChangeFlag || flag) {
        // setExecuteList(cloneDeep(res.content));
        executeList.current = res.content;
      } else if (xor(list, res.content).length) {
        list.push(...res.content);
        // setExecuteList(cloneDeep(list));
        executeList.current = list;
      }

      setTotal(res.totalElements);
      if (page === res.totalPages) {
        changePageDisabled(true);
      } else {
        changePageDisabled(false);
      }
    } else if (getResponse(res) && !res.content.length) {
      setTotal(0);
      // setExecuteList([]);
      executeList.current = [];
    }
    changeSpinning(false);
    setLovChange(false);
  }

  async function handleOrderSearch() {
    if (orderSearchNum !== 1) {
      changeOrderSearchNum(1);
    }
    if (!orderNum) return;

    // setExecuteList([]);
    executeList.current = [];
    changeSpinning(true);
    const res = await requestByNum({ requestNum: orderNum, showImage: true });
    setOrderNum(null);
    if (getResponse(res)) {
      changeSpinning(false);
      if (!isEmpty(res)) {
        if (res.requestStatus === ds.queryDataSet.current.get('shipOrderStatus')) {
          setTotal(1);
          if (res.requestStatus !== 'PICKED') {
            props.history.push({
              pathname: `/pub/lwms/issue-request-execute/pick`,
              state: {
                record: res,
              },
            });
          } else if (res.requestStatus === 'PICKED') {
            if (orderSearchNum !== -1 && pickList.filter((i) => i.requestNum === orderNum).length) {
              setPickList(pickList);
              // setExecuteList(pickList);
              executeList.current = pickList;
              return;
            }
            const newRes = {
              ...res,
              checked: true,
            };
            setPickList(pickList.concat(newRes));
            //  setExecuteList(pickList.concat(newRes));
            executeList.current = pickList.concat(newRes);
          }
        } else if (res.requestStatus !== ds.queryDataSet.current.get('shipOrderStatus')) {
          setTotal(0);
          notification.warning({
            message: `单据状态为${res.requestStatusMeaning}，不能在此界面操作`,
          });
        }
      } else {
        setTotal(0);
        changePageDisabled(true);
        notification.warning({
          message: '该领料单号不存在',
        });
      }
    }
  }

  function handleOrderNumChange(value) {
    setOrderNum(value);
  }

  function handleSelectAll() {
    const list = [];
    if (executeList.current.every((item) => item.checked)) {
      executeList.current.forEach((item) => {
        list.push({
          ...item,
          checked: false,
        });
      });
    } else {
      executeList.current.forEach((item) => {
        list.push({
          ...item,
          checked: true,
        });
      });
    }
    // setExecuteList(list);
    executeList.current = list;
  }

  function handleToPickPage(record) {
    props.history.push({
      pathname: `/pub/lwms/issue-request-execute/pick`,
      state: {
        record,
      },
    });
  }

  function handleSelect(item, e) {
    const index = executeList.current.findIndex((el) => el.requestId === item.requestId);
    const list = [];
    executeList.current.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...item,
      checked: e.target.checked,
    });
    // setExecuteList(list);
    executeList.current = list;
  }

  async function handleSend() {
    const checkedList = executeList.current.filter((item) => item.checked);

    if (!checkedList.length) {
      notification.warning({
        message: '请选中要发出的领料单',
      });
    }

    const arr = [];
    let params = {};
    if (!isEmpty(workObj)) {
      params = {
        executedWorkerId: workObj.workerId,
        executedWorker: workObj.workerName,
      };
    }

    checkedList.forEach((i) => {
      arr.push({
        ...params,
        requestId: i.requestId,
        requestNum: i.requestNum,
        executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      });
    });

    const res = await requestPickedExecute(arr);
    if (res && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      handleHeaderSearch(shipOrderStatus.current, 0, 12, true);
    }
  }

  function handlePaginationChange() {
    setCurrentPage(currentPage + 1);
    handleHeaderSearch(shipOrderStatus.current, currentPage + 1);
  }

  function handleQuerychange() {
    setLovChange(true);
  }

  return (
    <div className="lwms-issue-request-execute">
      <div className="lwms-issue-request-execute-header">
        <div className="lwms-issue-request-execute-header-left">
          {/* <Button
            className={shipOrderStatus === 'RELEASED' ? 'shipOrderStatus' : null}
            onClick={() => handleChangeActive('RELEASED')}
          >
            待拣料
          </Button>
          <Button
            className={shipOrderStatus === 'PICKED' ? 'shipOrderStatus' : null}
            onClick={() => handleChangeActive('PICKED')}
          >
            待发出
          </Button>
          <Button
            className={shipOrderStatus === 'EXECUTED' ? 'shipOrderStatus' : null}
            onClick={() => handleChangeActive('EXECUTED')}
          >
            待接收
          </Button> */}
          <SelectBox
            dataSet={ds.queryDataSet}
            mode="button"
            name="shipOrderStatus"
            onChange={(v) => handleChangeActive(v)}
          >
            <Option value="RELEASED">待挑库</Option>
            <Option value="PICKED">待发出</Option>
            <Option value="EXECUTED">待接收</Option>
          </SelectBox>
        </div>
        <div className="lwms-issue-request-execute-header-right">
          <Lov
            dataSet={ds.queryDataSet}
            name="requestTypeObj"
            placeholder="选择单据类型"
            onChange={() => handleQuerychange('requestType')}
          />
          <Lov
            dataSet={ds.queryDataSet}
            name="prodLineObj"
            placeholder="选择申领地点"
            onChange={() => handleQuerychange('prodLine')}
          />
          <Lov
            dataSet={ds.queryDataSet}
            name="creatorObj"
            placeholder="请选择制单人"
            onChange={() => handleQuerychange('creator')}
          />
          <Button
            color="primary"
            onClick={() => handleHeaderSearch(shipOrderStatus.current, 0, 12, true)}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
      <div className="sub-lwms-issue-request-execute-header">共搜索到 {totalElements} 条数据</div>
      <Content>
        <div className={`query ${shipOrderStatus.current === 'PICKED' ? 'check' : null}`}>
          {shipOrderStatus.current === 'PICKED' && (
            <div className="query-check">
              <Checkbox
                checked={
                  !!executeList.current.length && executeList.current.every((item) => item.checked)
                }
                onChange={handleSelectAll}
              >
                全选
              </Checkbox>
              <div onClick={handleSend}>
                <img src={SendImg} alt="" />
                <span>一键发出</span>
              </div>
            </div>
          )}
          <div className="query-main">
            <TextField
              dataSet={ds.queryDataSet}
              placeholder="请输入领料单号"
              value={orderNum}
              onChange={handleOrderNumChange}
            />
            <Button color="primary" onClick={handleOrderSearch}>
              {intl.get('lwms.common.button.search').d('搜索')}
            </Button>
          </div>
        </div>
        <Spin spinning={spinning}>
          <div
            className={`lwms-issue-request-execute-card-list ${
              shipOrderStatus.current === 'PICKED' ? 'check' : null
            }`}
          >
            {executeList.current?.map((item) => {
              if (shipOrderStatus.current === 'PICKED') {
                return (
                  <div className="lwms-issue-request-execute-card-wrapper" key={item.requestId}>
                    <div className="lwms-issue-request-execute-card-select">
                      <Checkbox
                        checked={item.checked || false}
                        onChange={(e) => handleSelect(item, e)}
                      />
                      <Card
                        active={shipOrderStatus.current}
                        item={item}
                        key={item.requestId}
                        onToPickPage={handleToPickPage}
                      />
                    </div>
                    <div className="lwms-issue-request-execute-card-foot">
                      <p>
                        <span className="circle">{item.creator && item.creator.slice(0, 1)}</span>
                        {item.creator}
                      </p>
                      <p className="right">{item.requestTypeName}</p>
                    </div>
                  </div>
                );
              }
              return (
                <Card
                  active={shipOrderStatus.current}
                  item={item}
                  key={item.requestId}
                  onToPickPage={handleToPickPage}
                />
              );
            })}
          </div>
        </Spin>
        <div
          className="lwms-issue-request-execute-pagination"
          onClick={!pageDisabled ? handlePaginationChange : () => {}}
        >
          {!pageDisabled ? '点击加载更多' : '暂无更多数据'}
        </div>
      </Content>
    </div>
  );
};

export default IssueRequestExecute;
