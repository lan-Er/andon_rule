/*
 * @Descripttion: 合格率排行图表
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-25 09:49:48
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-07-31 13:09:51
 */
import React, { Fragment, Component } from 'react';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import './index.less';
import echarts from 'echarts';
import chartData from './stockChartData';
import { queryList } from '../../../../services/api';

@connect()
export default class StockChart extends Component {
  state = {
    nameList: ['原材料', '半成品', '在制品', '成品', '在途', '不合格'],
    dataList: [],
  };

  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('stock-chart'));
    this.handleStockData();
  }

  componentDidUpdate(prevProps) {
    const { customer } = this.props;
    if (
      customer &&
      prevProps &&
      prevProps.customer &&
      prevProps.customer.toString() !== customer.toString()
    ) {
      this.handleStockData();
    }
  }

  @Bind()
  async handleStockData() {
    let yclNum = 0;
    let bcpNum = 0;
    let zzpNum = 0;
    let cpNum = 0;
    let ztNum = 0;
    let bhgNum = 0;
    // 原材料
    await queryList({
      unctionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: null,
      attribute2: '原材料',
      pageSize: 10000,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          yclNum += parseInt(record.attribute4, 10);
        });
      }
    });
    // 半成品
    await queryList({
      unctionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: null,
      attribute2: '半成品',
      pageSize: 10000,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          bcpNum += parseInt(record.attribute4, 10);
        });
      }
    });
    // 在制品
    await queryList({
      unctionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: null,
      attribute2: '在制品',
      pageSize: 10000,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          zzpNum += parseInt(record.attribute4, 10);
        });
      }
    });
    // 成品
    await queryList({
      unctionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: null,
      attribute2: '成品',
      pageSize: 10000,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          cpNum += parseInt(record.attribute4, 10);
        });
      }
    });
    // 在途
    await queryList({
      unctionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: null,
      attribute2: '在途',
      pageSize: 10000,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          ztNum += parseInt(record.attribute4, 10);
        });
      }
    });
    // 不合格
    await queryList({
      unctionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute3: null,
      attribute2: '不合格',
      pageSize: 10000,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        res.content.forEach((record) => {
          bhgNum += parseInt(record.attribute4, 10);
        });
      }
    });
    const stockList = [yclNum, bcpNum, zzpNum, cpNum, ztNum, bhgNum];
    this.setState(
      {
        dataList: stockList,
      },
      () => {
        this.resolverData();
      }
    );
  }

  // 处理数据
  @Bind()
  resolverData() {
    console.log('dataList', JSON.stringify(this.state.dataList));
    chartData.xAxis.data = this.state.nameList;
    chartData.series[0].data = this.state.dataList;
    this.drawLine();
  }

  @Bind()
  drawLine() {
    console.log('chartData', JSON.stringify(chartData));
    this.myChart.setOption(chartData);
  }

  @Bind()
  handleDetail() {
    const pathname = '/lisp/supplier-inventory-details';
    this.props.dispatch(
      routerRedux.push({
        pathname,
      })
    );
  }

  render() {
    return (
      <Fragment>
        <div className="quality-chart">
          <div className="title" onClick={() => this.handleStockData()}>
            <span>库存情况</span>
            <span className="title-more" onClick={() => this.handleDetail()}>
              更多
            </span>
          </div>
          <div className="stock-content" id="stock-chart" />
        </div>
      </Fragment>
    );
  }
}
