/**
 * @Description: 领料执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 120120-07-10 10:05:15
 * @LastEditors: yu.na
 */

import React, { useState, useEffect, useMemo } from 'react';
// import { withRouter } from 'react-router-dom';
import { Button, Lov, DataSet, TextField, CheckBox, Row, Col, DatePicker } from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { isEmpty, xor } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import intl from 'utils/intl';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting, queryLovData } from 'hlos-front/lib/services/api';
import { Content } from 'components/Page';
import { queryDS, DefaultDS } from '@/stores/issueRequestExecuteDS';
import { requestByNum, requestPickedExecute } from '@/services/issueRequestExecuteService';
import SendImg from 'hlos-front/lib/assets/icons/send.svg';
import Card from './Card';
import './style.less';

const qDS = () => new DataSet(queryDS());

function IssueRequestExecute(props) {
  // console.log('propsdefaultWarehouseObj', props.defaultWarehouseObj);
  const ds = useDataSet(qDS, IssueRequestExecute);
  const defaultds = useMemo(
    () =>
      new DataSet({
        ...DefaultDS(),
        events: {
          update: ({ name, value }) => {
            if (name === 'warehouseObj' && value && value !== {} && value !== '') {
              localStorage.setItem('defaultWarehouseObj', JSON.stringify(value));
              // props.dispatch({
              //   type: 'updateDefaultWarehouseObj',
              //   payload: {
              //     defaultWarehouseObj: value,
              //   },
              // });
            }
          },
        },
      }),
    []
  );

  const [active, changeActive] = useState('RELEASED,PICKED');
  const [executeList, setExecuteList] = useState([]);
  // const [pickList, setPickList] = useState([]);
  const [spinning, changeSpinning] = useState(false);
  const [totalElements, setTotal] = useState(0);
  const [orderNum, setOrderNum] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDisabled, changePageDisabled] = useState(false);
  const [orderSearchNum, changeOrderSearchNum] = useState(0);
  const [lovChangeFlag, setLovChange] = useState(false);
  const [workObj, setWorker] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  // const [refreshFlag, changeRefreshFlag] = useState(false);

  useEffect(() => {
    const textNode = document.getElementById('textNode');
    textNode.focus();
    async function loadData() {
      await queryDefaultWorker();
      if (localStorage.getItem('defaultWarehouseObj')) {
        console.log('进入缓存');
        defaultds.current.set(
          'warehouseObj',
          JSON.parse(localStorage.getItem('defaultWarehouseObj'))
        );
      } else {
        await queryDefaultWmArea();
        localStorage.setItem(
          'defaultWarehouseObj',
          JSON.stringify(defaultds.current.get('warehouseObj'))
        );
        // props.dispatch({
        //   type: 'updateDefaultWarehouseObj',
        //   payload: {
        //     defaultWarehouseObj: defaultds.current.get('warehouseObj'),
        //   },
        // });
      }
    }
    loadData();
  }, []);

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
      ds.queryDataSet.current.set('attributeString1', '1');
      defaultds.current.set('organizationId', organizationId);
    }
  }

  async function queryDefaultWmArea() {
    const res = await queryLovData({
      lovCode: 'LMDS.WM_AREA',
      categoryCode: 'LC',
      organizationId: ds.queryDataSet.current.get('organizationId'),
    });
    if (getResponse(res) && !res.failed && res.content && res.content[0]) {
      setWorker(res.content[0]);
      defaultds.current.set('warehouseObj', res.content[0]);
      // dataSet={defaultds} name="warehouseObj"
    }
  }

  useEffect(() => {
    handleHeaderSearch(active);
  }, [active]);

  function handleChangeActive(value) {
    if (value !== active) {
      setExecuteList([]);
      changeActive(value);
      setCurrentPage(0);
    }
  }

  async function handleHeaderSearch(value, page = 0, size, flag) {
    setOrderNum(null);
    changeSpinning(true);
    changeOrderSearchNum(-1);
    let params = {
      requestStatus: value,
      page: page || 0,
      size: size || 12,
      showImage: true,
      attributeString1: '1',
    };
    if (value === 'EXECUTED') {
      params = {
        ...params,
        viaWarehouseFlag: 'Y',
      };
    }
    ds.queryParameter = params;
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      const list = executeList.slice();
      if (!res.content.length) {
        setExecuteList([]);
      }
      if (lovChangeFlag || flag) {
        setExecuteList(res.content);
      } else if (xor(list, res.content).length) {
        list.push(...res.content);
        setExecuteList(list);
      }

      setTotal(res.totalElements);
      if (page === res.totalPages) {
        changePageDisabled(true);
      } else {
        changePageDisabled(false);
      }
    } else if (getResponse(res) && !res.content.length) {
      setTotal(0);
      setExecuteList([]);
    }
    changeSpinning(false);
    setLovChange(false);
  }

  async function handleOrderSearch() {
    if (
      !defaultds ||
      !defaultds.current ||
      !defaultds.current.data ||
      !defaultds.current.data.warehouseObj
    ) {
      return notification.warning({
        message: '请先选择默认货位！',
      });
    }
    if (orderSearchNum !== 1) {
      changeOrderSearchNum(1);
    }
    if (!orderNum) return;

    setExecuteList([]);
    changeSpinning(true);
    const res = await requestByNum({ requestNum: orderNum, showImage: true });
    setOrderNum(null);
    if (getResponse(res)) {
      changeSpinning(false);
      if (!isEmpty(res)) {
        console.log('active', active);
        if (active.indexOf(res.requestStatus) > -1) {
          setTotal(1);
          props.history.push({
            pathname: `/pub/raumplus/issue-request-execute/pick`,
            state: {
              record: res,
              defaultWmAreaObj: { ...defaultds.current.data?.warehouseObj },
            },
          });
          // if (res.requestStatus !== 'PICKED') {
          //   props.history.push({
          //     pathname: `/pub/raumplus/issue-request-execute/pick`,
          //     state: {
          //       record: res,
          //       defaultWmAreaObj: { ...defaultds.current.data?.warehouseObj },
          //     },
          //   });
          // } else if (res.requestStatus === 'PICKED') {
          //   if (orderSearchNum !== -1 && pickList.filter((i) => i.requestNum === orderNum).length) {
          //     setPickList(pickList);
          //     setExecuteList(pickList);
          //     return;
          //   }
          //   const newRes = {
          //     ...res,
          //     checked: true,
          //   };
          //   setPickList(pickList.concat(newRes));
          //   setExecuteList(pickList.concat(newRes));
          // }
        } else if (res.requestStatus !== active) {
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
    if (executeList.every((item) => item.checked)) {
      executeList.forEach((item) => {
        list.push({
          ...item,
          checked: false,
        });
      });
    } else {
      executeList.forEach((item) => {
        list.push({
          ...item,
          checked: true,
        });
      });
    }
    setExecuteList(list);
  }

  function handleToPickPage(record) {
    if (
      !defaultds ||
      !defaultds.current ||
      !defaultds.current.data ||
      !defaultds.current.data.warehouseObj
    ) {
      return notification.warning({
        message: '请先选择默认货位！',
      });
    }
    props.history.push({
      pathname: `/pub/raumplus/issue-request-execute/pick`,
      state: {
        record,
        defaultWmAreaObj: { ...defaultds.current.data?.warehouseObj },
      },
    });
  }

  function handleSelect(item, e) {
    const index = executeList.findIndex((el) => el.requestId === item.requestId);
    const list = [];
    executeList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...item,
      checked: e.target.checked,
    });
    setExecuteList(list);
  }

  async function handleSend() {
    const checkedList = executeList.filter((item) => item.checked);

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
      handleHeaderSearch(active, 0, 12, true);
    }
  }

  function handlePaginationChange() {
    setCurrentPage(currentPage + 1);
    handleHeaderSearch(active, currentPage + 1);
  }

  function handleQuerychange() {
    setLovChange(true);
  }

  // 添加勾选

  // 单选
  function handleSingleCheck(index) {
    // event.stopPropagation();
    const list = executeList.slice();
    list[index].checked = !list[index].checked;
    const all = list.every((i) => i.checked);
    setAllChecked(all);
    setExecuteList(list);
  }

  // 全选
  const handleAllCheck = () => {
    const list = [...executeList];
    setAllChecked(list.every((i) => i.checked));
    if (allChecked) {
      list.forEach((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.checked = false;
      });
      setAllChecked(false);
      setExecuteList(list);
    } else {
      list.forEach((ele) => {
        ele.checked = true;
      });
      setAllChecked(true);
      setExecuteList(list);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handlePrint = async () => {
    // eslint-disable-next-line array-callback-return
    const printList = [];
    executeList.forEach((item) => {
      if (item.checked) {
        // printList.push({
        //   externalNum: item.externalNum,
        //   requestNum: item.requestNum,
        // });
        printList.push(item.requestId);
      }
    });
    if (printList.length === 0) {
      return notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
    }

    props.history.push({
      pathname: `/raumplus/issue-request-execute/print/DL_REQUEST`,
      search: `tenantId=${getCurrentOrganizationId()}`,
      printList,
      backPath: '/raumplus/issue-request-execute',
    });
  };

  return (
    <div className="lwms-issue-request-execute">
      <div className="lwms-issue-request-execute-header">
        <div className="lwms-issue-request-execute-header-left">
          <Button
            className={active === 'RELEASED,PICKED' ? 'active' : null}
            onClick={() => handleChangeActive('RELEASED,PICKED')}
          >
            待拣料
          </Button>
          <Button
            className={active === 'PICKED' ? 'active' : null}
            onClick={() => handleChangeActive('PICKED')}
          >
            待发出
          </Button>
          <Button
            className={active === 'EXECUTED' ? 'active' : null}
            onClick={() => handleChangeActive('EXECUTED')}
          >
            待接收
          </Button>
        </div>
        <div className="lwms-issue-request-execute-header-right">
          <DatePicker
            dataSet={ds.queryDataSet}
            name="planDemandDateStart"
            placeholder="需求日期从"
            onChange={() => handleQuerychange('planDemandDateStart')}
          />
          <DatePicker
            dataSet={ds.queryDataSet}
            name="planDemandDateEnd"
            placeholder="需求日期至"
            onChange={() => handleQuerychange('planDemandDateEnd')}
          />
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
          <Button color="primary" onClick={() => handleHeaderSearch(active, 0, 12, true)}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
      <div className="sub-lwms-issue-request-execute-header">共搜索到 {totalElements} 条数据</div>
      <Content>
        <div className={`query ${active === 'PICKED' ? 'check' : null}`}>
          {active === 'PICKED' && (
            <div className="query-check">
              <CheckBox checked={allChecked} onChange={handleSelectAll}>
                全选
              </CheckBox>
              <div onClick={handleSend}>
                <img src={SendImg} alt="" />
                <span>一键发出</span>
              </div>
            </div>
          )}
          <div className="query-main">
            <TextField
              id="textNode"
              placeholder="请输入领料单号"
              value={orderNum}
              onChange={handleOrderNumChange}
            />
            <Button color="primary" onClick={handleOrderSearch}>
              {intl.get('lwms.common.button.search').d('搜索')}
            </Button>
            <Lov style={{ marginLeft: '50px' }} dataSet={defaultds} name="warehouseObj" />
            {/* placeholder="料仓默认货位" */}
            <Row className="content-header">
              <Col style={{ textAlign: 'right', paddingRight: '12px' }}>
                <CheckBox value="全选" checked={allChecked} onChange={handleAllCheck}>
                  全选
                </CheckBox>
              </Col>
            </Row>
            <Button color="primary" onClick={handlePrint}>
              打印
            </Button>
          </div>
        </div>
        <Spin spinning={spinning}>
          <div
            className={`lwms-issue-request-execute-card-list ${
              active === 'PICKED' ? 'check' : null
            }`}
          >
            {executeList.map((item, index) => {
              if (active === 'PICKED') {
                return (
                  <div className="lwms-issue-request-execute-card-wrapper" key={item.requestId}>
                    <div className="lwms-issue-request-execute-card-select">
                      <CheckBox
                        checked={item.checked || false}
                        onChange={(e) => handleSelect(item, e)}
                      />
                      <Card
                        active={active}
                        item={item}
                        key={item.requestId}
                        handleSingleCheck={() => handleSingleCheck(item)}
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
                  active={active}
                  item={item}
                  key={item.requestId}
                  handleSingleCheck={() => handleSingleCheck(index)}
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
}

const mapStateToProps = ({ issueRequestExecute }) => {
  return {
    defaultWarehouseObj: issueRequestExecute.defaultWarehouseObj,
  };
};

export default connect(mapStateToProps)(IssueRequestExecute);
