/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 16:47:53
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-06-28 09:51:48
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
  getTimeRateApi,
  getDayNumApi,
} from '../../../services/api';
import { getdiffdate, getFirstDayOfWeek } from '@/utils/timeServer';

const { loginName } = getCurrentUser();

@connect()
export default class OrderExecute extends Component {
  state = {
    timeClass: 'WEEK',
    startTime: '',
    timeList: [],
    weekDayList: [],
    yqrData: [], // 已确认
    yxdData: [], // 已下达
    ywgData: [], // 已完工
    yfyData: [], // 已发运
    yjsData: [], // 已接收
    yqrNum: 0, // 已确认
    yxdNum: 0, // 已下达
    ywgNum: 0, // 已完工
    yfyNum: 0, // 已发运
    yjsNum: 0, // 已接收
    qualityRate: 0, // 合格率
    timeRate: 0, // 合格率
    deliveryNum: 0, // 平均交期
  };

  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('execute-chart'));
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
      yqrData,
      yxdData,
      ywgData,
      yfyData,
      yjsData,
    } = this.state;
    if (timeClass === 'WEEK') {
      ChartData.xAxis.data = weekDayList;
    } else {
      ChartData.xAxis.data = timeList;
    }
    ChartData.series[0].data = yqrData;
    ChartData.series[1].data = yxdData;
    ChartData.series[2].data = ywgData;
    ChartData.series[3].data = yfyData;
    ChartData.series[4].data = yjsData;
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

  // 查询所有数据
  @Bind()
  handleSearch() {
    this.handleExcuteData();
    this.getQualityRate();
    this.getTimeRate();
    this.getDeliveryNum();
  }

  // 获取合格率
  @Bind()
  async getQualityRate() {
    const { supplier } = this.props;
    const { startTime } = this.state;
    await getSupplierQualityRateApi({
      supplier: supplier.toString(),
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

  // 获取到货及时率
  @Bind()
  async getTimeRate() {
    const { supplier } = this.props;
    const { startTime } = this.state;
    await getTimeRateApi({
      supplier: supplier.toString(),
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
    const { supplier } = this.props;
    const { timeClass } = this.state;
    await getDayNumApi({
      user: loginName,
      suppliers: supplier.toString(),
      latitude: timeClass,
    }).then((res) => {
      if (res && res.average) {
        this.setState({
          deliveryNum: res.average,
        });
      }
    });
  }

  // 获取图表数据
  @Bind()
  async handleExcuteData() {
    const { supplier } = this.props;
    const { startTime, timeClass, timeList } = this.state;
    const yqrData = []; // 已确认
    const yxdData = []; // 已下达
    const ywgData = []; // 已完工
    const yfyData = []; // 已发运
    const yjsData = []; // 已接收
    let yqrNum = 0; // 已确认
    let yxdNum = 0; // 已下达
    let ywgNum = 0; // 已完工
    let yfyNum = 0; // 已发运
    let yjsNum = 0; // 已接收
    // 已确认数据
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已确认',
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                yqrData.push(0);
              } else {
                yqrData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yqrData.push(0);
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
                yqrData.push(0);
              } else {
                yqrData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yqrData.push(0);
            }
          });
        }
        console.log('yqrData===', JSON.stringify(yqrData));
        // let content = [{"attributeCount":"37","attributeDate":"2020-06-23","user":"24333","functionType":"SUPPLIER_CHAIN_OVERALL","dataType":"ORDER"}];
      }
    });

    // 已下达yxdData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已下达',
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
                yxdData.push(0);
              } else {
                yxdData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yxdData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                yxdData.push(0);
              } else {
                yxdData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yxdData.push(0);
            }
          });
        }
        // let content = [{"attributeCount":"37","attributeDate":"2020-06-23","user":"24333","functionType":"SUPPLIER_CHAIN_OVERALL","dataType":"ORDER"}];
      }
    });

    // // 已完工ywgData
    await orderExcuteList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      attribute3: supplier,
      attribute9: '已完工',
      orderDate: startTime,
      latitude: timeClass === 'DAY' ? 'DAY' : null,
    }).then((content) => {
      if (content && content.length) {
        if (timeClass === 'WEEK' || timeClass === 'MONTH') {
          let num = 0;
          timeList.forEach((day) => {
            if (content[num] && content[num].attributeDate) {
              if (day !== content[num].attributeDate) {
                ywgData.push(0);
              } else {
                ywgData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              ywgData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                ywgData.push(0);
              } else {
                ywgData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              ywgData.push(0);
            }
          });
        }
      }
    });

    // // 已发运yfyData
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
                yfyData.push(0);
              } else {
                yfyData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yfyData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                yfyData.push(0);
              } else {
                yfyData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yfyData.push(0);
            }
          });
        }
      }
    });

    // // 已接收yjsData
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
                yjsData.push(0);
              } else {
                yjsData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yjsData.push(0);
            }
          });
        } else {
          let num = 0;
          timeList.forEach((time) => {
            if (content[num] && content[num].attributeDate) {
              if (parseInt(time, 10) !== parseInt(content[num].attributeCount, 10)) {
                yjsData.push(0);
              } else {
                yjsData.push(parseInt(content[num].attributeCount, 10));
                num += 1;
              }
            } else {
              yjsData.push(0);
            }
          });
        }
      }
    });
    yqrData.forEach((num) => {
      yqrNum += parseInt(num, 10);
    });
    yxdData.forEach((num) => {
      yxdNum += parseInt(num, 10);
    });
    ywgData.forEach((num) => {
      ywgNum += parseInt(num, 10);
    });
    yfyData.forEach((num) => {
      yfyNum += parseInt(num, 10);
    });
    yjsData.forEach((num) => {
      yjsNum += parseInt(num, 10);
    });

    this.setState(
      {
        yqrData,
        yxdData,
        ywgData,
        yfyData,
        yjsData,
        // 数量
        yqrNum,
        yxdNum,
        ywgNum,
        yfyNum,
        yjsNum,
      },
      () => {
        console.log('this.state', JSON.stringify(this.state));
        this.handleChartData();
      }
    );
  }

  // 跳转明细
  @Bind()
  handleDetail() {
    const pathname = '/lisp/core-sales-order-perform';
    this.props.dispatch(
      routerRedux.push({
        pathname,
      })
    );
  }

  // 获取订单合格率

  render() {
    // console.log('ChartData', ChartData);
    const {
      timeClass,
      // yqrData,
      // yxdData,
      // ywgData,
      // yfyData,
      // yjsData,
      yqrNum,
      yxdNum,
      ywgNum,
      yfyNum,
      yjsNum,
      qualityRate, // 合格率
      timeRate, // 到货及时率
      deliveryNum, // 平均交期
    } = this.state;
    return (
      <Fragment>
        <div className="order-execute">
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
          <div className="execute-content">
            <div className="execute-left">
              <div className="chart-header-list">
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">已确认</div>
                  <div className="item-content">{yqrNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">已下达</div>
                  <div className="item-content">{yxdNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">已完工</div>
                  <div className="item-content">{ywgNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">已发运</div>
                  <div className="item-content">{yfyNum}</div>
                </div>
                <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">已接收</div>
                  <div className="item-content" style={{ border: 'none' }}>
                    {yjsNum}
                  </div>
                </div>
                {/* <div className="header-item">
                  <div className="item-top" />
                  <div className="item-title">客户退货</div>
                  <div className="item-content">1245</div>
                </div> */}
              </div>
              <div className="chart-content" id="execute-chart" />
            </div>
            <div className="execute-right">
              <div className="right-item">
                <div className="left-img">
                  <img src={qualityRateImg} alt="" />
                </div>
                <div className="right-text">
                  <div className="right-space" />
                  <span className="span-text">合格率</span>
                  <span className="span-num">{qualityRate}%</span>
                </div>
              </div>
              <div className="right-item">
                <div className="left-img">
                  <img src={timeRateImg} alt="" />
                </div>
                <div className="right-text">
                  <div className="right-space" />
                  <span className="span-text">到货及时率</span>
                  <span className="span-num">{timeRate}%</span>
                </div>
              </div>
              <div className="right-item">
                <div className="left-img">
                  <img src={deliveryRateImg} alt="" />
                </div>
                <div className="right-text">
                  <div className="right-space" />
                  <span className="span-text">平均交货期</span>
                  <span className="span-num">{deliveryNum}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
