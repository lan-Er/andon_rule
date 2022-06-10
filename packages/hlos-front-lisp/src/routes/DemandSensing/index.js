/*
 * @module-: 需求感知分析
 * @Author: <zhuangwei.zheng@hand-china.com>
 * @Date: 2020-06-24 10:33:27
 * @LastEditTime: 2020-06-30 10:22:39
 * @copyright: Copyright (c) 2018,Hand
 */

import { Content } from 'components/Page';
import React, { Component } from 'react';
import moment from 'moment';
import DeHeader from './components/DeHeader/DeHeader';
import DeContent from './components/DeContent/DeContent';
import DeFooter from './components/DeFooter/DeFooter';
import { queryListNotByUser, queryListByDateParams, queryMoDataByDateParams } from '@/services/api';

export default class DemandSensing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: {},
      contentData: {},
      footerData: [],
      curDate: moment('20200830', 'YYYYMMDD'),
    };
  }

  // 前一天
  doPreDate = () => {
    const { curDate } = this.state;
    const newDate = moment(curDate).subtract(-1, 'days');
    const newDateStr = moment(newDate).format('YYYY-MM-DD');
    this.getData(newDateStr);
    this.setState({
      curDate: newDate,
    });
  };

  // 后一天
  doAfterDate = () => {
    const { curDate } = this.state;
    const newDate = moment(curDate).subtract(1, 'days');
    const newDateStr = moment(newDate).format('YYYY-MM-DD');
    this.getData(newDateStr);
    this.setState({
      curDate: newDate,
    });
  };

  getData = (date) => {
    // 获取第一栏数据

    // 获取第二栏数据
    queryListByDateParams({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'Quantity_statistics',
      startDate: date,
      page: 0,
      size: 100,
    }).then((res) => {
      this.setState({
        contentData: res.content,
      });
    });

    queryMoDataByDateParams({
      startDate: date,
    }).then((res) => {
      if (res && res.length) {
        this.setState({
          footerData: res,
        });
      }
    });
  };

  componentDidMount() {
    const { curDate } = this.state;
    this.getData(moment(curDate).format('YYYY-MM-DD'));

    queryListNotByUser({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'Quantity_statistics',
      attribute5: '2020-08-30',
      page: 0,
      size: 100,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        const data1 = res.content[0];
        queryListNotByUser({
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'Check_Total',
          page: 0,
          size: 100,
        }).then((resData) => {
          if (resData && resData.content && resData.content.length) {
            const data2 = resData.content[0];
            const data = {
              attribute1: data1.attribute1,
              attribute2: `${Number(data1.attribute4) * 100}%`,
              attribute3: `${Number(data2.attribute1) * 100}%`,
              attribute4: `${Number(data2.attribute2) * 100}%`,
            };
            this.setState({
              headerData: data,
            });
          } else {
            const data = {
              attribute1: data1.attribute1,
              attribute2: data1.attribute4,
            };
            this.setState({
              headerData: data,
            });
          }
        });
      }
    });
  }

  render() {
    const { headerData, contentData, footerData, curDate } = this.state;
    const xData = [];
    let thisDate = curDate;

    let date1 = '';
    let date7 = '';
    for (let i = 0; i < 7; i++) {
      const x = moment(thisDate).format('YYYY-MM-DD');
      if (i === 0) {
        date7 = x;
      }
      if (i === 6) {
        date1 = x;
      }
      xData.push(x);
      thisDate = moment(thisDate).subtract(1, 'days');
    }

    const dateRangeStr = `${date1}~${date7}`;
    return (
      <Content>
        <DeHeader headerInfo={headerData} />
        <DeContent
          contentInfo={contentData}
          doAfterDate={this.doAfterDate}
          doPreDate={this.doPreDate}
          curDate={curDate}
          xData={xData}
          dateRangeStr={dateRangeStr}
        />
        <DeFooter footerData={footerData} dateRangeStr={dateRangeStr} />
      </Content>
    );
  }
}
