/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 16:47:53
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-07-31 13:08:19
 */
import React, { Fragment, Component } from 'react';
import { getCurrentUser } from 'utils/utils';
import './index.less';
import moment from 'moment';
import echarts from 'echarts';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ChartData from './ChartData';
import qualityRateImg from '../assets/quality-rate.svg';
import timeRateImg from '../assets/time-rate.svg';
import deliveryRateImg from '../assets/delivery-rate.svg';
import {
  // queryListWithDate,
  orderExcuteList,
  getSupplierQualityRateApi,
  getIqcRateApi,
  getTimeRateApi,
  getDayNumApi,
} from '../../../services/api';
import StockChart from './StockChart';

import { getdiffdate, getFirstDayOfWeek } from '@/utils/timeServer';

const { loginName } = getCurrentUser();

@connect()
export default class OrderExecute extends Component {
  state = {
    timeClass: 'WEEK',
    startTime: '',
    timeList: [],
    weekDayList: [],
    dqrData: [], // 待确认
    dhfData: [], // 待回复
    djhData: [], // 待计划
    dxdData: [], // 待下达
    sczData: [], // 生产中
    fyzData: [], // 发运中
    dqrNum: 0, // 待确认
    dhfNum: 0, // 待回复
    djhNum: 0, // 待计划
    dxdNum: 0, // 待下达
    sczNum: 0, // 生产中
    fyzNum: 0, // 发运中
    qualityRate: 0, // 生产合格率
    iqcRate: 0, // 客户iqc合格率
    timeRate: 0, // 到货及时率
    deliveryNum: 0, // 平均交货期
  };

  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('customer-execute'));
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
      this.myChart = echarts.init(document.getElementById('execute-chart'));
      this.handleTime(this.state.timeClass);
    }
  }

  // 查询所有数据
  @Bind()
  handleSearch() {
    this.handleExcuteData();
    this.getQualityRate();
    this.getIqcRate();
    this.getTimeRate();
    this.getDeliveryNum();
  }

  // 获取生产合格率
  @Bind()
  async getQualityRate() {
    const { customer } = this.props;
    const { startTime } = this.state;
    await getSupplierQualityRateApi({
      customer: customer.toString(),
      reportDate: startTime,
    }).then((res) => {
      if (res && res.length) {
        if (res[0] && res[0].qualityRate) {
          this.setState({
            qualityRate: res[0].qualityRate,
          });
        }
      }
    });
  }

  // 获取iqc客户合格率
  @Bind()
  async getIqcRate() {
    const { customer } = this.props;
    const { startTime } = this.state;
    await getIqcRateApi({
      customer: customer.toString(),
      reportDate: startTime,
    }).then((res) => {
      if (res && res.length) {
        if (res[0] && res[0].qualityRate) {
          this.setState({
            iqcRate: res[0].qualityRate,
          });
        }
      }
    });
  }

  // 获取到货及时率
  @Bind()
  async getTimeRate() {
    const { customer } = this.props;
    const { startTime } = this.state;
    await getTimeRateApi({
      customer: customer.toString(),
      reportDate: startTime,
    }).then((res) => {
      if (res && res.length) {
        if (res[0] && res[0].qualityRate) {
          this.setState({
            timeRate: res[0].qualityRate,
          });
        }
      }
    });
  }

  // 获取平均交期
  @Bind()
  async getDeliveryNum() {
    const { customer } = this.props;
    const { timeClass } = this.state;
    await getDayNumApi({
      user: loginName,
      customers: customer.toString(),
      latitude: timeClass,
    }).then((res) => {
      if (res && res.average) {
        this.setState({
          deliveryNum: res.average,
        });
      }
    });
  }

  @Bind()
  drawLine() {
    this.myChart.setOption(ChartData);
  }

  // 处理图表数据
  @Bind()
  handleChartData() {
    const {
      timeClass,
      timeList,
      weekDayList,
      dqrData, // 待确认
      dhfData, // 待回复
      djhData, // 待计划
      dxdData, // 待下达
      sczData, // 生产中
      fyzData, // 发运中
    } = this.state;
    if (timeClass === 'WEEK') {
      ChartData.xAxis.data = weekDayList;
    } else {
      ChartData.xAxis.data = timeList;
    }
    ChartData.series[0].data = dqrData;
    ChartData.series[1].data = dhfData;
    ChartData.series[2].data = djhData;
    ChartData.series[3].data = dxdData;
    ChartData.series[4].data = sczData;
    ChartData.series[5].data = fyzData;
    this.drawLine();
  }

  @Bind()
  handleTime(timeClass) {
    let timeList = [];
    let weekDayList = []; // 按周查询周一，周二，周三
    let startTime = moment(new Date()).format('YYYY-MM-DD');
    const endTime = moment(new Date()).format('YYYY-MM-DD');
    if (timeClass === 'DAY') {
      timeList = [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
      ];
      console.log('timeList', timeList);
    } else if (timeClass === 'WEEK') {
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD');
      weekDayList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      timeList = getdiffdate(startTime, endTime);
    } else if (timeClass === 'MONTH') {
      startTime = moment(new Date()).format('YYYY-MM-01');
      // const endTime = moment(new Date()).format('YYYY-MM-DD');
      timeList = getdiffdate(startTime, endTime);
      console.log('timeList', timeList);
    }
    this.setState(
      {
        timeClass,
        startTime,
        timeList,
        weekDayList,
      },
      () => {
        console.log('timeeList=======', this.state.timeList);
        this.handleSearch();
      }
    );
  }

  // 获取图表数据
  @Bind()
  async handleExcuteData() {
    const { supplier } = this.props;
    const { startTime, timeClass, timeList } = this.state;

    const dqrData = []; // 待确认
    const dhfData = []; // 待回复
    const djhData = []; // 待计划
    const dxdData = []; // 待下达
    const sczData = []; // 生产中
    const fyzData = []; // 发运中
    let dqrNum = 0; // 待确认
    let dhfNum = 0; // 待回复
    let djhNum = 0; // 待计划
    let dxdNum = 0; // 待下达
    let sczNum = 0; // 生产中
    let fyzNum = 0; // 发运中
    // -	待确认-新建dqrData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '新建',
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                dqrData.push(0);
              } else {
                dqrData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              dqrData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeDate, 10)) {
                // alert('不等于');
                // alert(parseInt(time, 10));
                // alert(parseInt(time, 10));
                dqrData.push(0);
              } else {
                dqrData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              dqrData.push(0);
            }
          });
        }
        console.log('dqrData===', JSON.stringify(dqrData));
        // let content = [{"attributeCount":"37","attributeDate":"2020-06-23","user":"24333","functionType":"SUPPLIER_CHAIN_OVERALL","dataType":"ORDER"}];
      }
    });

    // -	待回复-已确认 dhfData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已确认',
      // attribute15: startTime,
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                dhfData.push(0);
              } else {
                dhfData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              dhfData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                dhfData.push(0);
              } else {
                dhfData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              dhfData.push(0);
            }
          });
        }
        // let content = [{"attributeCount":"37","attributeDate":"2020-06-23","user":"24333","functionType":"SUPPLIER_CHAIN_OVERALL","dataType":"ORDER"}];
      }
    });

    // -	待计划-已回复
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已回复',
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                djhData.push(0);
              } else {
                djhData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              djhData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                djhData.push(0);
              } else {
                djhData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              djhData.push(0);
            }
          });
        }
      }
    });

    // -	待下达-已计划dxdData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '发运中',
      // attribute18: startTime,
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                dxdData.push(0);
              } else {
                dxdData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              dxdData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                dxdData.push(0);
              } else {
                dxdData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              dxdData.push(0);
            }
          });
        }
      }
    });

    // -	生产中-已下达sczData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已接收',
      // attribute19: startTime,
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                sczData.push(0);
              } else {
                sczData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              sczData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                sczData.push(0);
              } else {
                sczData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              sczData.push(0);
            }
          });
        }
      }
    });

    // -	-	发运中-发运中fyzData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已接收',
      // attribute19: startTime,
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                fyzData.push(0);
              } else {
                fyzData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              fyzData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                fyzData.push(0);
              } else {
                fyzData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              fyzData.push(0);
            }
          });
        }
      }
    });

    dqrData.forEach((num) => {
      dqrNum += parseInt(num, 10);
    });
    dhfData.forEach((num) => {
      dhfNum += parseInt(num, 10);
    });
    djhData.forEach((num) => {
      djhNum += parseInt(num, 10);
    });
    dxdData.forEach((num) => {
      dxdNum += parseInt(num, 10);
    });
    sczData.forEach((num) => {
      sczNum += parseInt(num, 10);
    });
    fyzData.forEach((num) => {
      fyzNum += parseInt(num, 10);
    });

    this.setState(
      {
        dqrData,
        dhfData,
        djhData,
        dxdData,
        sczData,
        fyzData,
        dqrNum,
        dhfNum,
        djhNum,
        dxdNum,
        sczNum,
        fyzNum,
      },
      () => {
        console.log('this.state', JSON.stringify(this.state));
        this.handleChartData();
      }
    );
  }

  @Bind()
  handleDetail() {
    const pathname = '/lisp/supplier-sales-order-perform';
    this.props.dispatch(
      routerRedux.push({
        pathname,
      })
    );
  }

  render() {
    console.log('ChartData', ChartData);
    const {
      timeClass,
      // dqrData,
      // dhfData,
      // djhData,
      // dxdData,
      // sczData,
      // fyzData,
      dqrNum,
      dhfNum,
      djhNum,
      dxdNum,
      sczNum,
      fyzNum,
      qualityRate, // 生产合格率
      iqcRate, // 客户iqc合格率
      timeRate, // 到货及时率
      deliveryNum, // 平均交货期
    } = this.state;
    return (
      <Fragment>
        <div className="customer-execute">
          <div className="title">
            <span onClick={() => this.handleSearch()}>订单执行</span>
            <span className="title-more" onClick={() => this.handleDetail()}>
              更多
            </span>
            <div className="chart-header">
              <div
                className={['time-day', timeClass === 'DAY' ? 'time-selected' : 'unselected'].join(
                  ' '
                )}
                onClick={() => this.handleTime('DAY')}
              >
                今日
              </div>
              <div
                className={[
                  'time-week',
                  timeClass === 'WEEK' ? 'time-selected' : 'unselected',
                ].join(' ')}
                onClick={() => this.handleTime('WEEK')}
              >
                本周
              </div>
              <div
                className={[
                  'time-month',
                  timeClass === 'MONTH' ? 'time-selected' : 'unselected',
                ].join(' ')}
                onClick={() => this.handleTime('MONTH')}
              >
                本月
              </div>
            </div>
          </div>
          <div className="customer-content">
            <div className="execute-top">
              <div className="chart-content" id="customer-execute" />
              <div className="chart-header-list">
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">待确认</div>
                  <div className="item-content">{dqrNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">待回复</div>
                  <div className="item-content">{dhfNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">待计划</div>
                  <div className="item-content">{djhNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">待下达</div>
                  <div className="item-content">{dxdNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">生产中</div>
                  <div className="item-content">{sczNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">发运中</div>
                  <div className="item-content" style={{ border: 'none' }}>
                    {fyzNum}
                  </div>
                </div>
              </div>
            </div>
            <div className="execute-bottom">
              <div className="execute-bottom-left">
                <div className="execute-bottom-left-title">合格率</div>
                <div className="execute-bottom-left-content">
                  <div className="right-item">
                    <div className="left-img">
                      <img src={qualityRateImg} alt="" />
                    </div>
                    <div className="right-text">
                      <div className="right-space" />
                      <span className="span-text">生产合格率</span>
                      <span className="span-num">{qualityRate}%</span>
                    </div>
                  </div>
                  <div className="right-item">
                    <div className="left-img">
                      <img src={timeRateImg} alt="" />
                    </div>
                    <div className="right-text">
                      <div className="right-space" />
                      <span className="span-text">客户IQC合格率</span>
                      <span className="span-num">{iqcRate}%</span>
                    </div>
                  </div>
                  <div className="right-item">
                    <div className="left-img">
                      <img src={deliveryRateImg} alt="" />
                    </div>
                    <div className="right-text">
                      <div className="right-space" />
                      <span className="span-text">及时交付率</span>
                      <span className="span-num">{timeRate}%</span>
                    </div>
                  </div>
                  <div className="right-item">
                    <div className="left-img">
                      <img src={qualityRateImg} alt="" />
                    </div>
                    <div className="right-text">
                      <div className="right-space" />
                      <span className="span-text">平均交货期</span>
                      <span className="span-num">{deliveryNum}天</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="execute-bottom-right">
                <StockChart customer={this.props.customer} />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
