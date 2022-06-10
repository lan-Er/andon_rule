/*
 * @module-: 顶部
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-24 10:39:56
 * @LastEditTime: 2020-06-26 17:04:42
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { Component } from 'react';

import style from './index.less';

import unUsed from '../assets/un-used.svg';
import allData from '../assets/all-data.svg';
import using from '../assets/using.svg';
import service from '../assets/service.svg';
import scrapped from '../assets/scrapped.svg';

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerList: [
        { title: '模具总数量(个)', number: '0', image: allData, id: 1 },
        { title: '待使用', number: '0', image: unUsed, id: 2 },
        { title: '使用中', number: '0', image: using, id: 3 },
        { title: '维修中', number: '0', image: service, id: 4 },
        { title: '已报废', number: '0', image: scrapped, id: 5 },
      ],
      stateProps: [],
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.getDataList !== this.state.stateProps) {
      let total = 0;
      const { getDataList } = nextProps;
      const newHeaderList = this.state.headerList;
      for (let i = 0; i < getDataList.length; i++) {
        if (getDataList[i].attribute3 === '未使用') {
          newHeaderList[1] = { ...newHeaderList[1], number: getDataList[i].data.length };
          total += getDataList[i].data.length;
        } else if (getDataList[i].attribute3 === '使用中') {
          total += getDataList[i].data.length;
          newHeaderList[2] = { ...newHeaderList[2], number: getDataList[i].data.length };
        } else if (getDataList[i].attribute3 === '维修中') {
          total += getDataList[i].data.length;
          newHeaderList[3] = { ...newHeaderList[3], number: getDataList[i].data.length };
        } else {
          total += getDataList[i].data.length;
          newHeaderList[4] = { ...newHeaderList[4], number: getDataList[i].data.length };
        }
      }
      newHeaderList[0] = { ...newHeaderList[0], number: total };
      this.setState({ stateProps: nextProps.getDataList, headerList: newHeaderList });
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { headerList } = this.state;
    return (
      <div className={style['my-content-interface']}>
        {headerList &&
          headerList.map((item) => {
            return (
              <div key={item.id}>
                <section className={style['my-content-header-left-title']}>
                  <header>{item.title}</header>
                  <span>{item.number}</span>
                </section>
                <section className={style['my-content-header-right-img']}>
                  <img src={item.image} alt="总数" />
                </section>
              </div>
            );
          })}
      </div>
    );
  }
}
