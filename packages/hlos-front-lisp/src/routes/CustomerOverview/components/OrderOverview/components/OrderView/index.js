/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 15:46:35
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-07-31 15:52:11
 */

import React, { Fragment, Component } from 'react';
// import { Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { queryList, getOrderCount } from '@/services/api';
import { formatMoney } from '@/utils/timeServer';
import './index.less';
import orderCount from '../../../../assets/orderCount.svg';
import toConfirm from '../../../../assets/toConfirm.svg';
import toResponse from '../../../../assets/toResponse.svg';
import toSchedule from '../../../../assets/toSchedule.svg';
import toDo from '../../../../assets/toDo.svg';
import inProduction from '../../../../assets/inProduction.svg';
import toShipped from '../../../../assets/toShipped.svg';

@connect()
export default class OrderView extends Component {
  state = {
    sumData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
    unConfirmData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
    dhfData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
    djhData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
    dxdData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
    sczData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
    onRoadData: {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    },
  };

  componentDidMount() {
    this.searchData();
  }

  componentDidUpdate(prevProps) {
    const { customer } = this.props;
    if (
      customer &&
      prevProps &&
      prevProps.customer &&
      prevProps.customer.toString() !== customer.toString()
    ) {
      console.log('刷新');
      this.searchData();
    }
  }

  @Bind
  async searchData() {
    const { customer } = this.props;
    // 订单总量
    const sumData = {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };
    // 待确认=新建
    const unConfirmData = {
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };
    const dhfData = {
      // 待回复=已确认
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };
    const djhData = {
      // 待计划=已回复
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };
    const dxdData = {
      // 待下达已计划
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };
    const sczData = {
      // 生产中已下达
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };
    // 发运中
    const onRoadData = {
      // 发运中=发运中
      amount: 0, // 订单数
      qty: 0, // 数量
      totalPrice: 0, // 金额
      uom: 'EA', // 单位
      currency: '￥', // 币种
    };

    await getOrderCount({
      customer: customer.toString(),
    }).then((res) => {
      if (res && res.amount) {
        sumData.amount = res.amount ? res.amount : 0;
        sumData.qty = res.qty ? res.qty : 0;
        sumData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取新建数据 unConfirmData
    await getOrderCount({
      customer: customer.toString(),
      status: '新建',
    }).then((res) => {
      if (res && res.amount) {
        unConfirmData.amount = res.amount ? res.amount : 0;
        unConfirmData.qty = res.qty ? res.qty : 0;
        unConfirmData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取已确认数据-dhfData
    await getOrderCount({
      customer: customer.toString(),
      status: '已确认',
    }).then((res) => {
      console.log('res', res);
      if (res && res.amount) {
        dhfData.amount = res.amount ? res.amount : 0;
        dhfData.qty = res.qty ? res.qty : 0;
        dhfData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取已回复数据-djhData
    await getOrderCount({}).then((res) => {
      if (res && res.amount) {
        djhData.amount = res.amount ? res.amount : 0;
        djhData.qty = res.qty ? res.qty : 0;
        djhData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取已计划数据-dxdData
    await getOrderCount({
      customer: customer.toString(),
      status: '已计划',
    }).then((res) => {
      if (res && res.amount) {
        dxdData.amount = res.amount ? res.amount : 0;
        dxdData.qty = res.qty ? res.qty : 0;
        dxdData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取已下达数据-sczData
    await getOrderCount({
      customer: customer.toString(),
      status: '已计划',
      attribute9: '发运中',
    }).then((res) => {
      if (res && res.amount) {
        sczData.amount = res.amount ? res.amount : 0;
        sczData.qty = res.qty ? res.qty : 0;
        sczData.totalPrice = res.totalPrice ? res.totalPrice : 0;
      }
    });

    // 获取发运中数据-onRoadData
    await queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute2: customer,
      attribute9: '发运中',
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          onRoadData.amount++;
          onRoadData.qty += parseInt(record.attribute5, 10); // 数量汇总
          onRoadData.totalPrice += parseInt(record.attribute7, 10); // 数量汇总
        });
      }
    });
    this.setState({
      sumData,
      unConfirmData,
      dhfData,
      djhData,
      dxdData,
      sczData,
      onRoadData,
    });
  }

  @Bind()
  handleDetail() {
    const pathname = '/lisp/supplier-sales-order-details';
    this.props.dispatch(
      routerRedux.push({
        pathname,
      })
    );
  }

  render() {
    const { sumData, unConfirmData, dhfData, djhData, dxdData, sczData, onRoadData } = this.state;
    return (
      <Fragment>
        <div className="view-order-view">
          <p className="title" onClick={() => this.searchData()}>
            <span>订单总览</span>
            <span className="title-more" onClick={() => this.handleDetail()}>
              更多
            </span>
          </p>
          <div className="item-list">
            <div className="order-item">
              <div className="item-header">
                <img src={orderCount} alt="" />
                <span>订单总量</span>
              </div>
              <div className="item-content">
                <span>{sumData.amount}</span>
              </div>
              <div className="item-footer">
                <span>
                  {`${sumData.qty} 个`}
                  {/* {sumData.uom} */}
                </span>
                <span>
                  {sumData.currency}
                  {formatMoney(sumData.totalPrice)}
                </span>
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
                    {unConfirmData.currency}
                    {formatMoney(unConfirmData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={toResponse} alt="" />
                  <span>待回复</span>
                </div>
                <div className="item-content">{dhfData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${dhfData.qty} 个`}
                    {/* {dhfData.uom} */}
                  </span>
                  <span>
                    {dhfData.currency}
                    {formatMoney(dhfData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={toSchedule} alt="" />
                  <span>待计划</span>
                </div>
                <div className="item-content">{djhData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${djhData.qty} 个`}
                    {/* {djhData.uom} */}
                  </span>
                  <span>
                    {djhData.currency}
                    {formatMoney(djhData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={toDo} alt="" />
                  <span>待下达</span>
                </div>
                <div className="item-content">{dxdData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${dxdData.qty} 个`}
                    {/* {dxdData.uom} */}
                  </span>
                  <span>
                    {sumData.currency}
                    {formatMoney(sumData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={inProduction} alt="" />
                  <span>生产中</span>
                </div>
                <div className="item-content">{sczData.amount}</div>
                <div className="item-footer">
                  <span>
                    {`${sczData.qty} 个`}
                    {/* {sczData.uom} */}
                  </span>
                  <span>
                    {sczData.currency}
                    {formatMoney(sczData.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="order-item">
                <div className="item-header">
                  <img src={toShipped} alt="" />
                  <span>
                    发运中
                    {/* <span className="title-more">更多</span> */}
                  </span>
                </div>
                <div className="item-content" style={{ border: 'none' }}>
                  {onRoadData.amount}
                </div>
                <div className="item-footer">
                  <span>
                    {`${onRoadData.qty} 个`}
                    {/* {onRoadData.uom} */}
                  </span>
                  <span>
                    {onRoadData.currency}
                    {formatMoney(onRoadData.totalPrice)}
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
