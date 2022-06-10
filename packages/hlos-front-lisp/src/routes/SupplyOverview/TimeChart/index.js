/*
 * @Descripttion: 合格率排行图表
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-25 09:49:48
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-06-28 15:13:01
 */
import React, { Fragment, Component } from 'react';
import { DataSet, Progress } from 'choerodon-ui/pro';
import moment from 'moment';
import './index.less';
import { Bind } from 'lodash-decorators';
import up from '../assets/up.svg';
import down from '../assets/down.svg';
import red from '../assets/red.svg';
import green from '../assets/green.svg';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';
import { qualityList } from '../../../services/api';

export default class TimeChart extends Component {
  state = {
    timeClass: 'day',
    startTime: '',
    rateTime: '', // 环比需要的时间
    sortFlag: true,
    dataList: [],
  };

  componentDidMount() {
    this.handleTime(this.state.timeClass);
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
      this.handleDataList();
    }
  }

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
        this.handleDataList();
      }
    );
  }

  @Bind()
  async resolveData() {
    const { dataList } = this.state;
    const newDataList = [];
    let newData = {};
    dataList.forEach((data) => {
      newData = JSON.parse(JSON.stringify(data));
      newData.ds = new DataSet({
        autoCreate: true,
        fields: [{ name: 'percent', type: 'number', defaultValue: parseInt(data.qualityRate, 10) }],
        // parseInt(data.qualityRate, 10)
      });
      newDataList.push(newData);
    });
    this.setState({
      dataList: newDataList,
    });
  }

  // 获取数据
  @Bind()
  async handleDataList() {
    // const { supplier } = this.props;
    const { startTime, rateTime, sortFlag } = this.state;
    await qualityList({
      startDate: rateTime,
      endDate: startTime,
      rankingType: 'arrival',
      rateOrder: sortFlag ? '1' : '0',
    }).then((content) => {
      if (content && content.length) {
        this.setState(
          {
            dataList: content,
          },
          () => {
            this.resolveData();
          }
        );
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
        <div className="supplier-time-chart">
          <p className="title">到货及时率</p>
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
            <div className="chart-supply">供应商</div>
            <div className="chart-img" onClick={() => this.changeSortFlag()}>
              <span>到货及时率</span>
              <img src={sortFlag ? up : down} alt="" className="time-style" />
            </div>
            <div className="chart-num">周环比</div>
          </div>
          {dataList.map((record, index) => (
            <div className="chart-line">
              <div className="chart-no">{index + 1}</div>
              <div className="chart-supply">{record.supplier}</div>
              <div className="chart-img">
                <Progress dataSet={record.ds} name="percent" strokeColor="#52C41A" />
              </div>
              <div className={parseInt(record.growthRate, 10) > 0 ? 'num-green' : 'num-red'}>
                <img
                  src={parseInt(record.growthRate, 10) > 0 ? green : red}
                  alt=""
                  className="sort-style"
                />
                <span>{`${record.growthRate ? record.growthRate : 0}%`}</span>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}
