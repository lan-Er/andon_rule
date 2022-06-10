/*
 * @Descripttion: 订单排行图表
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-25 09:49:48
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-07-31 15:51:44
 */
import React, { Fragment, Component } from 'react';
import './index.less';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { orderRateList } from '@/services/api';
import up from '../../../../assets/up.svg';
import down from '../../../../assets/down.svg';
import normal from '../../../../assets/normal.svg';
import red from '../../../../assets/red.svg';
import green from '../../../../assets/green.svg';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';

export default class OrderChart extends Component {
  state = {
    timeClass: 'day',
    startTime: '',
    rateTime: '', // 环比需要的时间
    moneyFlag: 'down',
    moneyImg: down, // 默认金额排序方式
    flagList: ['up', 'down', 'normal'],
    sortImgList: [up, down, normal],
    numFlag: 'normal',
    numImg: normal, // 默认金额排序方式
    // 模拟数据
    dataList: [],
  };

  componentDidMount() {
    console.log('componentDidMount');
    this.handleTime(this.state.timeClass);
  }

  // componentDidUpdate(prevProps) {
  //   const { customer } = this.props;
  //   if (
  //     customer &&
  //     prevProps &&
  //     prevProps.customer &&
  //     prevProps.customer.toString() !== customer.toString()
  //   ) {
  //     console.log('刷新');
  //     // this.handleOrderData();
  //   }
  // }

  // 时间处理
  @Bind()
  handleTime(timeClass) {
    let startTime = moment(new Date()).format('YYYY-MM-DD');
    // let startTime = '2020-06-26';
    let rateTime = moment(getPrevDate(startTime, 1)).format('YYYY-MM-DD');
    if (timeClass === 'week') {
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD');
      rateTime = moment(getPrevDate(startTime, 7)).format('YYYY-MM-DD');
    } else if (timeClass === 'month') {
      startTime = moment(new Date()).format('YYYY-MM-01');
      rateTime = moment(getPrevMonth(startTime)).format('YYYY-MM-DD');
    }
    this.setState(
      {
        timeClass,
        startTime,
        rateTime,
      },
      () => {
        this.handleOrderData();
      }
    );
  }

  // 获取数据
  @Bind()
  async handleOrderData() {
    const { startTime, rateTime, numFlag, moneyFlag } = this.state;
    await orderRateList({
      startDate: rateTime,
      endDate: startTime,
      amount: numFlag === 'down' ? '0' : '1',
      totalPrice: moneyFlag === 'down' ? '00' : '1',
    }).then((content) => {
      if (content && content.length) {
        this.setState({
          dataList: content,
        });
      } else {
        this.setState({
          dataList: [],
        });
      }
    });
  }

  // 修改金额正序倒序
  @Bind()
  changeMoneyFlag() {
    const { moneyFlag, flagList, sortImgList } = this.state;
    let index = flagList.indexOf(moneyFlag);
    if (index < flagList.length - 1) {
      index += 1;
    } else {
      index = 0;
    }
    if (index === 0 || index === 1) {
      // 本排序方式生效，取消其他排序方式
      this.setState({
        numFlag: 'normal',
        numImg: normal,
      });
    }
    const newFlag = flagList[index];
    this.setState(
      {
        moneyFlag: newFlag,
        moneyImg: sortImgList[index],
      },
      () => {
        this.handleOrderData();
      }
    );
  }

  // 修改数量倒序
  @Bind()
  changeNumFlag() {
    const { numFlag, flagList, sortImgList } = this.state;
    let index = flagList.indexOf(numFlag);
    if (index < flagList.length - 1) {
      index += 1;
    } else {
      index = 0;
    }
    if (index === 0 || index === 1) {
      // 本排序方式生效，取消其他排序方式
      this.setState({
        moneyFlag: 'normal',
        moneyImg: normal,
      });
    }
    const newFlag = flagList[index];
    this.setState(
      {
        numFlag: newFlag,
        numImg: sortImgList[index],
      },
      () => {
        this.handleOrderData();
      }
    );
  }

  render() {
    const { timeClass, moneyImg, numImg, dataList } = this.state;
    return (
      <Fragment>
        <div className="view-order-chart">
          <p className="title" onClick={() => this.handleTime(timeClass)}>
            订单量排行
          </p>
          <div className="chart-header">
            <div
              className={['time-day', timeClass === 'day' ? 'time-selected' : 'unselected'].join(
                ' '
              )}
              onClick={() => this.handleTime('day')}
            >
              今日
            </div>
            <div
              className={['time-week', timeClass === 'week' ? 'time-selected' : 'unselected'].join(
                ' '
              )}
              onClick={() => this.handleTime('week')}
            >
              本周
            </div>
            <div
              className={[
                'time-month',
                timeClass === 'month' ? 'time-selected' : 'unselected',
              ].join(' ')}
              onClick={() => this.handleTime('month')}
            >
              本月
            </div>
          </div>
          <div className="chart-theader">
            <div className="chart-no">排名</div>
            <div className="chart-supply">客户</div>
            <div className="chart-money" onClick={() => this.changeMoneyFlag()}>
              <span>金额</span>
              <img src={moneyImg} alt="" className="sort-style" />
            </div>
            <div className="chart-num" onClick={() => this.changeNumFlag()}>
              <span>数量</span>
              <img src={numImg} alt="" className="sort-style" />
            </div>
            <div className="chart-weight">环比</div>
          </div>
          {dataList.map((record, index) => (
            <div className="chart-line">
              <div className="chart-no">{index + 1}</div>
              <div className="chart-supply">{record.customer}</div>
              <div className="chart-money">{record.totalPrice.toFixed(2)}</div>
              <div className="chart-num">{record.amount.toFixed(2)}</div>
              <div className={(record.sequentialGrowthRate, 10) >= 0 ? 'num-green' : 'num-red'}>
                <img
                  src={parseInt(record.sequentialGrowthRate, 10) >= 0 ? green : red}
                  alt=""
                  className="sort-style"
                />
                <span>{`${record.sequentialGrowthRate ? record.sequentialGrowthRate : 0}%`}</span>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}
