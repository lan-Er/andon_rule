/*
 * @module-: 模具监控
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-24 10:33:27
 * @LastEditTime: 2020-10-23 16:06:38
 * @copyright: Copyright (c) 2018,Hand
 */
import { connect } from 'dva';
import React, { Component } from 'react';

import { Content } from 'components/Page';

import MyHeader from './MyHeader/index';
import MyContent from './MyContent/index';
import MyFooter from './MyFooter/index';
import { queryList } from '@/services/api';

@connect(({ MoldMonitoringModel }) => ({
  MoldMonitoringModel,
}))
export default class MoldMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getDataList: [],
      originalValue: [],
    };
  }

  componentDidMount() {
    queryList({
      functionType: 'DIE',
      dataType: 'DIE',
      page: 0,
      size: 100,
    }).then((res) => {
      if (res && res.content) {
        const oldValueList = res.content;
        const using = [];
        const unUsed = [];
        const service = []; // 维修中
        const scrapped = []; // 报废
        const Occupy = [];
        let newValue = [];
        for (let i = 0; i < oldValueList.length; i++) {
          if (oldValueList[i].attribute3 === '使用中') {
            using.push(oldValueList[i]);
          } else if (oldValueList[i].attribute3 === '未使用') {
            unUsed.push(oldValueList[i]);
          } else if (oldValueList[i].attribute3 === '维修中') {
            service.push(oldValueList[i]);
          } else if (oldValueList[i].attribute3 === '已报废') {
            scrapped.push(oldValueList[i]);
          } else {
            Occupy.push(oldValueList[i]);
          }
          newValue = [
            { attribute3: '使用中', data: using },
            { attribute3: '未使用', data: unUsed },
            { attribute3: '维修中', data: service },
            { attribute3: '已报废', data: scrapped },
          ];
        }
        this.setState({ getDataList: newValue, originalValue: oldValueList });
      }
    });
  }

  render() {
    const { getDataList, originalValue } = this.state;
    return (
      <Content style={{ backgroundColor: '#f4f5f7', margin: 0 }}>
        <MyHeader getDataList={getDataList} />
        <MyContent originalValue={originalValue} />
        <MyFooter
          originalValue={originalValue}
          moldMonitoringModel={this.props.MoldMonitoringModel}
        />
      </Content>
    );
  }
}
