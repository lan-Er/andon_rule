/**
 * @Description: 领料接收--详情页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-10 10:05:15
 * @LastEditors: yu.na
 */

import React, { useMemo, useEffect, useState } from 'react';
import { Button, TextField, Spin, Tooltip, Lov, DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import notification from 'utils/notification';
import { requestLine } from '@/services/issueRequestReceiveService';
import { receiveDS } from '@/stores/IssueRequestReceiveDS';
import { queryLovData } from 'hlos-front/lib/services/api';
import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import CopyImg from 'hlos-front/lib/assets/icons/copy.svg';
import SquartImg from 'hlos-front/lib/assets/icons/cube-blue.svg';
import DepartImg from 'hlos-front/lib/assets/icons/org.svg';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import LocationImg from 'hlos-front/lib/assets/icons/location.svg';
import DateImg from 'hlos-front/lib/assets/icons/date.svg';
import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import NumImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import Footer from './Footer';
import Time from './Time.js';
import './index.less';

const ReceiveDS = () => new DataSet(receiveDS());

const IssueRequestReceiveDetail = (props) => {
  const ds = useDataSet(ReceiveDS, IssueRequestReceiveDetail);
  const timeComponent = useMemo(() => <Time />, []);
  const [headerData, setHeaderData] = useState({});
  const [lineList, setLineList] = useState([]);
  const [inputValue, setInputValue] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [workObj, setWorker] = useState([]);

  useEffect(() => {
    const { state = {} } = props.location;

    async function queryLine() {
      setLoading(true);
      const res = await requestLine({
        requestId: state.record.requestId,
      });
      if (res && res.content) {
        const _list = [];
        res.content.forEach((item) => {
          _list.push({
            ...item,
            active: false,
          });
        });
        setLineList(_list);
      }

      setLoading(false);
    }

    if (state.record) {
      setHeaderData(state.record);
      queryLine();
    }
  }, [props.location]);

  useEffect(() => {
    async function queryDefaultWorker() {
      const res = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
      if (getResponse(res) && !res.failed && res.content && res.content[0]) {
        // setWorker(res.content[0]);
      }
    }
    queryDefaultWorker();
  }, []);

  function handleInputChange(value) {
    setInputValue(value);
  }

  async function handleSearchLine(flag, itemCode, page, pageSize) {
    const { state = {} } = props.location;
    setLoading(true);
    const res = await requestLine({
      requestId: state.record.requestId,
      itemCode,
      page: page || 0,
      size: pageSize || 6,
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
    }
    setLoading(false);
  }

  function handleExit() {
    props.history.push('/workplace');
    closeTab(`/pub/lwms/issue-request-receive/detail/${props.match.params.requestId}`);
  }

  function handleReset() {
    setInputValue(null);
    handleSearchLine(true);
  }

  async function handleReceive() {
    const validateValue = await ds.validate(false, false);
    if (!validateValue) return;
    console.log('emmm');
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

  function imgEle(el) {
    if (el.itemControlType === 'QUANTITY') {
      return <img src={NumImg} alt="" />;
    } else if (el.itemControlType === 'TAG') {
      return <img src={TagImg} alt="" />;
    }
    return <img src={LotImg} alt="" />;
  }

  function handleToggleExpand(el) {
    if (!el.details.length) return;
    const idx = lineList.findIndex((i) => i.requestLineId === el.requestLineId);
    const _lineList = lineList.slice();
    _lineList.splice(idx, 1, {
      ...el,
      expand: !el.expand,
    });
    setLineList(_lineList);
  }

  return (
    <div className="lwms-issue-request-receive-pick">
      <div className="lwms-issue-request-receive-pick-top">
        <img src={LogoImg} alt="" />
        {timeComponent}
      </div>
      <div className="lwms-issue-request-receive-content">
        <div className="lwms-issue-request-receive-content-left">
          <div className="lwms-issue-request-receive-content-left-header">
            <div>
              <img src={headerData.imageUrl || DefaultAvatorImg} alt="" />
              <span className="name">{headerData.executedWorker}</span>
              <span className="status">{headerData.requestStatusMeaning}</span>
            </div>
            <Tooltip placement="top" title={headerData.requestTypeName}>
              <span className="type">{headerData.requestTypeName}</span>
            </Tooltip>
          </div>
          <div className="lwms-issue-request-receive-content-left-content">
            <p className="order">
              <input value={headerData.requestNum || ''} id="num" readOnly />
              {headerData.requestNum}
              <img src={CopyImg} alt="" onClick={handleCopy} />
            </p>
            <p>
              <img src={SquartImg} alt="" />
              {headerData.assemblyItemCode}
            </p>
            <p>
              <img src={DepartImg} alt="" />
              {headerData.requestDepartment}
            </p>
            <p>
              <img src={OrderImg} alt="" />
              {headerData.moNum}
            </p>
            <p>
              <img src={LocationImg} alt="" />
              {headerData.prodLineName}
            </p>
            <p>
              <img src={DateImg} alt="" />
              {moment(headerData.planDemandDate).format(DEFAULT_DATE_FORMAT)}
            </p>
          </div>
        </div>
        <div className="lwms-issue-request-receive-content-right">
          <div className="lwms-issue-request-receive-content-right-header">
            <div>
              <TextField
                placeholder="请输入物料号"
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button color="primary" onClick={() => handleSearchLine(true, inputValue)}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
            <div>
              <Lov dataSet={ds} name="organizationObj" placeholder="请选择接收组织" noCache />
              <Lov dataSet={ds} name="warehouseObj" placeholder="请选择接收仓库" noCache />
              <Lov dataSet={ds} name="wmAreaObj" placeholder="请选择接收货位" noCache />
            </div>
          </div>
          <Spin spinning={loading}>
            <div className="lwms-issue-request-receive-content-right-content">
              {lineList.map((el) => {
                return (
                  <div key={el.requestLineId} className="list-item">
                    <div className="item-header">
                      <div className="receive-qty">
                        <span
                          className={`icon ${!el.details.length ? 'disabled' : null}`}
                          onClick={() => handleToggleExpand(el)}
                        >
                          {el.expand ? '-' : '+'}
                        </span>
                        {imgEle(el)}
                        <span className="qty">{el.executedQty}</span>
                        <span className="uom">{el.uomName}</span>
                      </div>
                      <div className="receive-item">
                        <p>{el.itemDescription}</p>
                        <p className="item-code">{el.itemCode}</p>
                      </div>
                      <div className="receive-date">
                        {moment(headerData.executedTime).format(DEFAULT_DATE_FORMAT)}
                      </div>
                    </div>
                    {el.details.length
                      ? el.details.map((i) => {
                          return (
                            <div className="item-line">
                              <p>
                                <span className="qty">{i.executedQty}</span>
                                {i.uomName || i.uom}
                              </p>
                              <p>{i.itemDescription}</p>
                              <p>{i.itemCode}</p>
                              <p>{i.lotNum || i.tagCode}</p>
                            </div>
                          );
                        })
                      : null}
                  </div>
                );
              })}
            </div>
          </Spin>
        </div>
      </div>
      <Footer onExit={handleExit} onReset={handleReset} onReceive={handleReceive} />
    </div>
  );
};

export default IssueRequestReceiveDetail;
