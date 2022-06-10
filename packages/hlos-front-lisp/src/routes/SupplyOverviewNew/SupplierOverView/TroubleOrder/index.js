/*
 * @Descripttion: 异常订单追踪
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 23:46:50
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-30 20:43:41
 */

import React, { Fragment, Component } from 'react';
// import { Content } from 'components/Page';
import './index.less';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'query-string';
import { getTroubleCount } from '../../../../services/api';
import jiaji from '../assets/jiaji.svg';
import biangeng from '../assets/biangeng.svg';
import cancle from '../assets/cancle.svg';
import yanjiao from '../assets/yanjiao.svg';
import ng from '../assets/ng.svg';

@connect()
export default class TroubleOrder extends Component {
  state = {
    urgentNum: 0, // 加急数量
    changeNum: 0, // 变更数量
    cancelNum: 0, // 取消数量
    delayNum: 0, // 延交数量
    unstandardNum: 0, // 不合格数量
  };

  componentDidMount() {
    this.handleTroubleData();
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
      this.handleTroubleData();
    }
  }

  @Bind()
  async handleTroubleData() {
    const { supplier } = this.props;
    // 加急数据
    await getTroubleCount({
      supplier,
      exception: '加急',
    }).then((res) => {
      if (res && res.amount) {
        this.setState({
          urgentNum: res.amount,
        });
      }
    });
    // 变更
    await getTroubleCount({
      supplier,
      exception: '变更',
    }).then((res) => {
      if (res && res.amount) {
        this.setState({
          changeNum: res.amount,
        });
      }
    });
    // 取消
    await getTroubleCount({
      supplier,
      exception: '取消',
    }).then((res) => {
      if (res && res.amount) {
        this.setState({
          cancelNum: res.amount,
        });
      }
    });
    // 延交
    await getTroubleCount({
      supplier,
      exception: '延交',
    }).then((res) => {
      if (res && res.amount) {
        this.setState({
          delayNum: res.amount,
        });
      }
    });
    // 不合格
    await getTroubleCount({
      supplier,
      exception: '不合格',
    }).then((res) => {
      if (res && res.amount) {
        this.setState({
          unstandardNum: res.amount,
        });
      }
    });
  }
  // this.props.dispatch(
  //   routerRedux.push({
  //     pathname: url,
  //   })
  // );

  @Bind()
  handleTrouble(type) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/lisp/enterprise-abnormal-order/${type}`,
        search: querystring.stringify({
          numObj: encodeURIComponent(JSON.stringify(this.state)),
        }),
      })
    );
  }

  render() {
    const { urgentNum, changeNum, cancelNum, delayNum, unstandardNum } = this.state;
    return (
      <Fragment>
        <div className="trouble-order-new">
          <div className="title" onClick={() => this.handleTroubleData()}>
            <span>异常订单跟踪{this.state.numFlag}</span>
            {/* <span className="title-more">更多</span> */}
          </div>
          <div className="order-content">
            <div className="item-box">
              <div className="flex-item" onClick={() => this.handleTrouble('urgent')}>
                <div className="item-text">加急</div>
                <div className="item-num">{urgentNum}</div>
                <div className="item-img">
                  <img src={jiaji} alt="" />
                </div>
              </div>
              <div className="flex-item" onClick={() => this.handleTrouble('change')}>
                <div className="item-text">变更</div>
                <div className="item-num">{changeNum}</div>
                <div className="item-img">
                  <img src={biangeng} alt="" />
                </div>
              </div>
              <div className="flex-item" onClick={() => this.handleTrouble('cancel')}>
                <div className="item-text">取消</div>
                <div className="item-num">{cancelNum}</div>
                <div className="item-img">
                  <img src={cancle} alt="" />
                </div>
              </div>
              <div className="flex-item" onClick={() => this.handleTrouble('delay')}>
                <div className="item-text">延交</div>
                <div className="item-num">{delayNum}</div>
                <div className="item-img">
                  <img src={yanjiao} alt="" />
                </div>
              </div>
              <div className="flex-item" onClick={() => this.handleTrouble('unstandard')}>
                <div className="item-text">不合格</div>
                <div className="item-num">{unstandardNum}</div>
                <div className="item-img">
                  <img src={ng} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
