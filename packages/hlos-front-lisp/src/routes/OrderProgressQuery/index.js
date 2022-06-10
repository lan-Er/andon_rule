/*
 * @module-: 订单进度查询
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-25 21:38:41
 * @LastEditTime: 2020-06-30 10:32:06
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { useState, useEffect } from 'react';
import { Timeline, Progress, Spin, Tooltip } from 'choerodon-ui';

import moment from 'moment';
import { Content } from 'components/Page';
import notification from 'utils/notification';

import style from './index.less';
import { queryList } from '@/services/api.js';

const searchImg = require('./assets/search.svg');
const buyerImg = require('./assets/buyer.svg');
const buyCarImg = require('./assets/buy-char.svg');
const companyImg = require('./assets/company.svg');
const telephoneImg = require('./assets/telephone.svg');
const locationImg = require('./assets/location.svg');

const dotImg = require('./assets/dot.png');
const dotImgFast = require('./assets/dotFast.svg');
const dotImgLast = require('./assets/dotLast.svg');
const noDataImg = require('./assets/noDataImg.svg');

export default function OrderProgressQuery() {
  const [searchData, setSearchData] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderProgress, setOrderProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSeatch] = useState(false);
  useEffect(() => {
    // setSearchData('PO202006261001');
    setOrderList([]);
    setOrderDetails([]);
    setOrderProgress([]);
    setSeatch(false);
  }, []);

  // 查询订单信息
  function handleSearch() {
    setSeatch(true);
    if (searchData && loading === false) {
      setLoading(true);
      queryList({
        functionType: 'SUPPLIER_CHAIN_OVERALL',
        dataType: 'ORDER',
        attribute1: searchData,
      })
        .then((res) => {
          if (res && res.content && res.content.length > 0) {
            const orderDataList = res.content;
            setOrderList(orderDataList);
            queryList({
              functionType: 'SUPPLIER_CHAIN_OVERALL',
              dataType: 'SUPPLIER',
              attribute1: orderDataList[0].attribute3,
            })
              .then((response) => {
                setLoading(false);
                if (response && response.content && response.content.length > 0) {
                  const orderDataLists = response.content;
                  setOrderDetails(orderDataLists);
                }
              })
              .catch((rej) => {
                setLoading(false);
                window.console.log(rej);
              });
          } else {
            setLoading(false);
            setOrderList([]);
            setOrderDetails([]);
          }
        })
        .catch((rej) => {
          setLoading(false);
          window.console.log(rej);
        });

      // 查询进度
      queryList({
        functionType: 'SUPPLIER_CHAIN_OVERALL',
        dataType: 'ORDER_PROGRESS',
        attribute1: searchData,
      })
        .then((res) => {
          if (res && res.content && res.content.length > 0) {
            const getOrderProgress = res.content;
            const newOrderProgress = [];
            for (let i = 0; i < getOrderProgress.length; i++) {
              newOrderProgress.push({
                ...getOrderProgress[i],
                dataTimes: `${getOrderProgress[i].attribute3} ${getOrderProgress[i].attribute5}`,
              });
            }
            newOrderProgress.sort(handleSort('dataTimes'));
            setOrderProgress(newOrderProgress);
          } else {
            setOrderProgress([]);
          }
        })
        .catch((rej) => {
          window.console.log(rej);
        });
    } else if (loading === false) {
      setSeatch(false);
      notification.warning({
        message: '请先输入查询订单号，再来查询',
      });
    }
  }

  // 排序函数
  function handleSort(creationDate) {
    const sortBy = 1;
    return (a, b) => {
      if (a[creationDate] > b[creationDate]) {
        return -1 * sortBy;
      } else if (a[creationDate] < b[creationDate]) {
        return 1 * sortBy;
      } else if (a[creationDate] === b[creationDate]) {
        return 0;
      }
    };
  }
  // 输入框内容变化
  function handleChangeInputValue(e) {
    const inputValue = e.target.value;
    setSearchData(inputValue);
  }

  // 右侧自定义进度图案
  function dotImgDOM(dotImgs) {
    return (
      <div className={style['dot-img-auto']}>
        <img src={dotImgs} style={{ height: '100%', display: 'block' }} alt="节点图" />
      </div>
    );
  }

  // 根据不同索引渲染不同图片
  function getOrderLine(index) {
    if (index + 1 === orderProgress.length) {
      return dotImgDOM(dotImgFast);
    } else if (index === 0) {
      return dotImgDOM(dotImgLast);
    } else {
      return dotImgDOM(dotImg);
    }
  }
  return (
    <Content style={{ backgroundColor: '#f4f5f7', padding: 0 }}>
      <div className={style['order-progress-query']}>
        <div className={style['form-header']}>
          <input
            value={searchData}
            onChange={handleChangeInputValue}
            className={style['search-input']}
            placeholder="请输入要查询的订单号"
          />
          <div className={style['form-header-button']} onClick={handleSearch}>
            <img src={searchImg} alt="查询" />
          </div>
        </div>
        {orderList && orderList.length > 0 ? (
          <div className={style['order-progress-query-center']}>
            <section>
              <div className={style['order-progress-query-left-top']}>
                <div className={style['order-progress-query-header']}>
                  <span>{orderList[0] && orderList[0].attribute1}</span>
                  <span>{orderList[0] && orderList[0].attribute9}</span>
                  <div className={style['header-right']}>
                    <img src={buyCarImg} alt="采购员" />
                    <span>采购员：</span>
                    <span>{orderList[0] && orderList[0].attribute24}</span>
                    <span>{orderList[0] && orderList[0].attribute48}</span>
                  </div>
                </div>
                <div className={style['order-progress-query-bottom']}>
                  <div>
                    <img src={buyerImg} alt="供应商联系人" />
                    <span>{orderDetails[0] && orderDetails[0].attribute3}</span>
                  </div>
                  <div>
                    <img src={companyImg} alt="公司" />
                    <Tooltip title={orderList[0] && orderList[0].attribute3}>
                      <span>{orderList[0] && orderList[0].attribute3}</span>
                    </Tooltip>
                  </div>
                  <div>
                    <img src={telephoneImg} alt="电话" />
                    <span>{orderDetails[0] && orderDetails[0].attribute4}</span>
                  </div>
                  <div>
                    <img src={locationImg} alt="地理信息" />
                    <Tooltip title={orderDetails[0] && orderDetails[0].attribute5}>
                      <span>{orderDetails[0] && orderDetails[0].attribute5}</span>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className={style['order-progress-query-left-bottom']}>
                <div className={style['query-left-bottom-header']}>订单明细</div>
                <div className={style['query-left-bottom-content']}>
                  {orderList &&
                    orderList.length > 0 &&
                    orderList.map((item) => {
                      return (
                        <section key={item.dataId}>
                          <div className={style['query-left-bottom-content-top']}>
                            <div className={style['top-header']}>
                              <Tooltip title={item.attribute4}>
                                <span>{item.attribute4}</span>
                              </Tooltip>
                              <span>
                                {item.attribute11
                                  ? moment(item.attribute11).format('YYYY-MM-DD')
                                  : null}
                              </span>
                              <div
                                className={style['to-header-user']}
                                style={{
                                  background: `${
                                    Math.floor(
                                      `${
                                        (Number(item.attribute31) * 100) / Number(item.attribute5)
                                      }`
                                    ) === 100
                                      ? '#47cac2'
                                      : '#3f51b5'
                                  }`,
                                }}
                              >
                                {Math.floor(
                                  `${(Number(item.attribute31) * 100) / Number(item.attribute5)}`
                                ) === 100
                                  ? '已接受'
                                  : '部分接收'}
                              </div>
                              <div className={style['to-header-date']}>
                                <Tooltip title={item.attribute26}>
                                  <span>{item.attribute26}</span>
                                </Tooltip>
                                <Tooltip title={item.attribute27}>
                                  <span>{item.attribute27}</span>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          <div className={style['query-left-bottom-content-bottom']}>
                            <span>
                              {item.attribute31}/{item.attribute5}
                            </span>
                            <span />
                            <span>
                              <Progress
                                percent={Math.floor(
                                  `${(Number(item.attribute31) * 100) / Number(item.attribute5)}`
                                )}
                              />
                            </span>
                          </div>
                        </section>
                      );
                    })}
                </div>
              </div>
            </section>
            <section>
              <div className={style['query-right-title']}>订单进程</div>
              <div className={style['query-right-list']}>
                {orderProgress &&
                  orderProgress.length > 0 &&
                  orderProgress.map((item, index) => {
                    return (
                      <Timeline className={style['query-list-every']} key={item.dataId}>
                        <div className={style['query-right-content-left']}>
                          <span>
                            {item.attribute3}&nbsp;&nbsp;
                            <span className={style['query-right-content-list']}>
                              {item.attribute4}
                            </span>
                          </span>
                          <br />
                          <span className={style['query-time']}>{item.attribute5}</span>
                        </div>
                        <div className={style['query-right-content-right']}>
                          <Timeline.Item dot={getOrderLine(index)}>{item.attribute2}</Timeline.Item>
                        </div>
                        <div className={style['query-right-content-user']}>
                          <div className={style['query-right-content-user-header']}>
                            <span style={{ background: `${item.attribute7}` }}>
                              {item.attribute6 ? item.attribute6.substr(0, 1) : null}
                            </span>
                          </div>
                          <span className={style['query-right-content-name']}>
                            {item.attribute6}
                          </span>
                        </div>
                      </Timeline>
                    );
                  })}
              </div>
            </section>
          </div>
        ) : (
          <div className={style['no-data']}>
            <img src={noDataImg} alt="无数据" />
            <br />
            <div className={style['no-data-font']}>
              {!search ? (
                <p>请输入订单号进行查询</p>
              ) : (
                <React.Fragment>
                  <p>未查询到相关订单内容</p>
                  <p>建议您修改搜索订单号重新再试</p>
                </React.Fragment>
              )}
            </div>
          </div>
        )}
        {loading ? (
          <div className={style['search-loading']}>
            <Spin loading={loading.toString()} size="large" />
          </div>
        ) : null}
      </div>
    </Content>
  );
}
