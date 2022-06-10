/*
 * @Descripttion: 合格率排行图表
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-25 09:49:48
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-07-31 15:52:35
 */

import React, { Fragment, Component } from 'react';
import './index.less';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import up from '../../../../assets/up.svg';
import down from '../../../../assets/down.svg';
import red from '../../../../assets/red.svg';
import green from '../../../../assets/green.svg';
import { returnDataList } from '@/services/api';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';

export default class ReturnChart extends Component {
  state = {
    timeClass: 'day',
    startTime: '',
    rateTime: '', // 环比需要的时间
    sortFlag: true,
    // 模拟数据
  };

  componentDidMount() {
    console.log('componentDidMount');
    this.handleTime(this.state.timeClass);
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
      this.handleTime(this.state.timeClass);
    }
  }

  // 时间处理
  @Bind()
  handleTime(timeClass) {
    // let startTime = moment(new Date()).format('YYYY-MM-DD');
    let startTime = '2020-06-26';
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
        this.handleReturnData();
      }
    );
  }

  // 获取数据
  @Bind()
  async handleReturnData() {
    const { sortFlag, startTime, rateTime } = this.state;
    await returnDataList({
      // functionType: 'SUPPLIER_CHAIN_OVERALL',
      // dataType: 'RETURE',
      startDate: rateTime,
      endDate: startTime,
      amount: sortFlag ? '1' : '0',
    }).then((content) => {
      if (content && content.length) {
        // sortList
        this.setState({
          dataList: content,
        });
        console.log('content', content);
      } else {
        this.setState({
          dataList: [],
        });
      }
    });
  }

  // 修改正序倒序
  @Bind()
  changeSortFlag() {
    const newFlag = !this.state.sortFlag;
    this.setState(
      {
        sortFlag: newFlag,
      },
      () => {
        this.handleTime(this.state.timeClass);
      }
    );
  }

  render() {
    const { timeClass, sortFlag, dataList } = this.state;
    return (
      <Fragment>
        <div className="view-time-chart">
          <p className="title" onClick={() => this.handleTime(timeClass)}>
            退货原因排行
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
            <div className="chart-supply">退货原因</div>
            <div className="chart-img" onClick={() => this.changeSortFlag()}>
              <span>数量</span>
              <img src={sortFlag ? up : down} alt="" className="time-style" />
            </div>
            <div className="chart-num">环比</div>
          </div>
          {dataList && dataList.length
            ? dataList.map((record, index) => (
              <div className="chart-line">
                <div className="chart-no">{index + 1}</div>
                <div className="chart-supply">{record.returnReason}</div>
                <div className="chart-img">{record.amount ? record.amount : 0}</div>
                <div
                  className={
                      parseInt(record.sequentialGrowthRate, 10) >= 0 ? 'num-green' : 'num-red'
                    }
                >
                  <img
                    src={parseInt(record.sequentialGrowthRate, 10) >= 0 ? green : red}
                    alt=""
                    className="sort-style"
                  />
                  <span>
                    {`${
                        record.sequentialGrowthRate ? record.sequentialGrowthRate.toFixed(2) : 0
                      }%`}
                  </span>
                </div>
              </div>
              ))
            : null}
        </div>
      </Fragment>
    );
  }
}
