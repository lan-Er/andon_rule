/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 15:46:35
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-30 20:37:47
 */

import React, { Fragment, Component } from 'react';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMoney } from '../../../../utils/timeServer';
import { queryList, getOrderCount } from '../../../../services/api';
import './index.less';
import orderCount from '../assets/orderCount.svg';
import toConfirm from '../assets/toConfirm.svg';
import dxd from '../assets/dxd.svg';
import yxd from '../assets/yxd.svg';
import scz from '../assets/scz.svg';
import fyz from '../assets/fyz.svg';
import gyzk from '../assets/gyzk.svg';

@connect()
export default class OrderView extends Component {
  state = {
    sumData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
    unConfirmData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
    dxdData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
    yxdData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
    sczData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
    fyzData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
    stockData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
    },
  };

  componentDidMount() {
    this.searchOrderViewData();
  }

  componentDidUpdate(prevProps) {
    const { supplier } = this.props;
    if (
      supplier &&
      prevProps &&
      prevProps.supplier &&
      prevProps.supplier.toString() !== supplier.toString()
    ) {
      console.log('刷新');
      this.searchOrderViewData();
    }
  }

  // 查询订单个数
  @Bind()
  async searchOrderViewData() {
    const { supplier } = this.props;
    const sumData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    const unConfirmData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    const dxdData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    const yxdData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    const sczData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    const fyzData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    const stockData = {
      amount: 0,
      qty: 0,
      totalPrice: 0,
    };
    // 订单汇总
    await getOrderCount({
      supplier: supplier ? supplier.toString() : null,
    }).then((res) => {
      if (res && res.amount) {
        sumData.amount = res.amount ? res.amount : 0;
        sumData.qty = res.qty ? res.qty : 0;
        sumData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 新建订单
    await getOrderCount({
      supplier: supplier ? supplier.toString() : null,
      status: '新建',
    }).then((res) => {
      if (res && res.amount) {
        unConfirmData.amount = res.amount ? res.amount : 0;
        unConfirmData.qty = res.qty ? res.qty : 0;
        unConfirmData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 已确认
    await getOrderCount({
      supplier: supplier ? supplier.toString() : null,
      status: '已确认',
    }).then((res) => {
      if (res && res.amount) {
        dxdData.amount = res.amount ? res.amount : 0;
        dxdData.qty = res.qty ? res.qty : 0;
        dxdData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 已下达
    await getOrderCount({
      supplier: supplier ? supplier.toString() : null,
      status: '已下达',
    }).then((res) => {
      if (res && res.amount) {
        yxdData.amount = res.amount ? res.amount : 0;
        yxdData.qty = res.qty ? res.qty : 0;
        yxdData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 生产中
    await getOrderCount({
      supplier: supplier ? supplier.toString() : null,
      status: '生产中',
    }).then((res) => {
      if (res && res.amount) {
        sczData.amount = res.amount ? res.amount : 0;
        sczData.qty = res.qty ? res.qty : 0;
        sczData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 已发运
    await getOrderCount({
      supplier: supplier ? supplier.toString() : null,
      status: '已发运',
    }).then((res) => {
      if (res && res.amount) {
        fyzData.amount = res.amount ? res.amount : 0;
        fyzData.qty = res.qty ? res.qty : 0;
        fyzData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取供应在库
    await queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: supplier,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        console.log('供应在库', res);
        res.content.forEach((record) => {
          stockData.amount++;
          stockData.qty += parseInt(record.attribute4, 10); // 数量汇总
          stockData.totalPrice += parseInt(record.attribute6, 10); // 数量汇总
        });
      }
    });

    this.setState({
      sumData,
      unConfirmData,
      dxdData,
      yxdData,
      sczData,
      fyzData,
      stockData,
    });
  }

  @Bind()
  handleStockDetail() {
    const { supplier } = this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lisp/inventory-details',
        supplier,
      })
    );
  }

  @Bind()
  handleDetail() {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lisp/core-sales-order-details',
      })
    );
  }

  render() {
    const { sumData, unConfirmData, dxdData, yxdData, sczData, fyzData, stockData } = this.state;
    return (
      <Fragment>
        <div className="order-view-new">
          <p className="title">
            <span onClick={() => this.searchOrderViewData()}>订单总览</span>
            <span className="title-more" onClick={() => this.handleDetail()}>
              更多
            </span>
          </p>
          <div className="item-list">
            <div className="order-item">
              <div className="item-header" style={{ textAlign: 'center' }}>
                <img src={orderCount} alt="" />
                <span>订单总量</span>
              </div>
              <div className="item-content">{sumData.amount ? sumData.amount : 0}</div>
              <div className="item-footer">
                <span>
                  {`${sumData.qty} 个`}
                  {/* {sumData.uom} */}
                </span>
                <span>¥{formatMoney(sumData.totalPrice ? sumData.totalPrice : 0)}</span>
              </div>
            </div>
            <div className="list-right">
              <div className="order-item">
                <div className="item-header">
                  <img src={toConfirm} alt="" />
                  <span>待确认</span>
                </div>
                <div className="item-content">{unConfirmData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${unConfirmData.qty} 个`}
                    {/* {unConfirmData.uom} */}
                  </span>
                  <span>
                    {/* {unConfirmData.currency} */}¥{formatMoney(unConfirmData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={dxd} alt="" />
                  <span>待下达</span>
                </div>
                <div className="item-content">{dxdData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${dxdData.qty} 个`}
                    {/* {dxdData.uom} */}
                  </span>
                  <span>
                    {/* {dxdData.currency} */}¥{formatMoney(dxdData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={yxd} alt="" />
                  <span>已下达</span>
                </div>
                <div className="item-content">{yxdData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${yxdData.qty} 个`}
                    {/* {yxdData.uom} */}
                  </span>
                  <span>
                    {/* {yxdData.currency} */}¥{formatMoney(yxdData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={scz} alt="" />
                  <span>生产中</span>
                </div>
                <div className="item-content">{sczData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${sczData.qty} 个`}
                    {/* {sczData.uom} */}
                  </span>
                  <span>
                    {/* {sczData.currency} */}¥{formatMoney(sczData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={fyz} alt="" />
                  <span>发运中</span>
                </div>
                <div className="item-content">{fyzData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${fyzData.qty} 个`}
                    {/* {fyzData.uom} */}
                  </span>
                  <span>
                    {/* {fyzData.currency} */}¥{formatMoney(fyzData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={gyzk} alt="" />
                  <span>供应商在库</span>
                  <span className="title-more" onClick={() => this.handleStockDetail()}>
                    更多
                  </span>
                </div>
                <div className="item-content" style={{ border: 'none' }}>
                  {stockData.amount}
                </div>
                <div className="item-footer">
                  <span>{`${stockData.qty} 个`}</span>
                  <span>
                    {stockData.currency}
                    {formatMoney(stockData.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
