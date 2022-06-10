/*
 * @module-:
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-28 11:17:49
 * @LastEditTime: 2020-08-03 10:28:05
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import { Modal } from 'choerodon-ui/pro';
import { connect } from 'dva';

import { Bind } from 'lodash-decorators';
import { queryList } from '@/services/api';

import style from './index.less';
import supplierListImg from '../../assets/images/supplier-list.svg';
import numberOfAttached from '../../assets/images/number-of-attached.png';
import todayDemandImg from '../../assets/images/today-demand.svg';
import pickingTodayImg from '../../assets/images/picking-today.svg';
import deliveryRateImg from '../../assets/images/delivery-rate.svg';
import returnTodayImg from '../../assets/images/return-today.svg';
import unfinishedDemandImg from '../../assets/images/unfinished-demand.svg';
import TodaysDemand from '../../MyDynamicModel/TodayDemand/index';
import ReturnToday from '../../MyDynamicModel/ReturnToday/index';
import PickingToday from '../../MyDynamicModel/PickingToday/index';

const modalKey = Modal.key();
const maskStyle = {
  background: 'rgb(0, 193, 255,.3)',
};
@connect(({ CreativeDataLargeScreenModel }) => ({
  CreativeDataLargeScreenModel,
}))
export default class MyContentBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierList: [],
      // informationSummary: {
      //   todayDemand: 0, // 今日需求
      //   pickingToday: 0, // 今日领料
      //   returnToday: 0, // 今日退货
      //   unfinishedDemand: 0, // 未完需求
      // },
    };
  }

  componentDidMount() {
    queryList({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'BOARD-1',
      page: 0,
      size: 100,
    }).then((res) => {
      const { dispatch } = this.props;
      const { content } = res ?? { content: [] };
      let todayDemand = 0;
      let pickingToday = 0;
      let returnToday = 0;
      let unfinishedDemand = 0;
      content.forEach((item) => {
        todayDemand += Number(item.attribute6);
        pickingToday += Number(item.attribute8);
        returnToday += Number(item.attribute7);
        unfinishedDemand += Number(item.attribute9);
      });
      const informationSummary = {
        todayDemand,
        pickingToday,
        returnToday,
        unfinishedDemand,
      };
      const supplierList = content;
      dispatch({
        type: 'CreativeDataLargeScreenModel/updateInformationSummary',
        payload: { informationSummary, supplierList },
      });
      this.setState({
        supplierList: content,
        // informationSummary,
      });
    });
  }

  /**
   *今日需求弹出框
   *
   * @memberof MyContentBottom
   */
  @Bind()
  handleOpenModal(titles, suppliers, mask = true) {
    Modal.open({
      key: modalKey,
      title: `${titles}`,
      children: (
        <div>
          {titles === '今日需求' ? <TodaysDemand supplier={suppliers} /> : null}
          {titles === '今日退料' ? <ReturnToday supplier={suppliers} /> : null}
          {titles === '今日领料' ? <PickingToday supplier={suppliers} /> : null}
        </div>
      ),
      maskStyle,
      closable: true,
      mask,
      style: {
        width: '80%',
        height: '90%',
        top: '6%',
      },
      footer: null,
      maskClassName: 'mask-class-name',
    });
  }

  render() {
    const { supplierList } = this.state;
    return (
      <div className={style['my-content-bottom-supplier-list']}>
        {supplierList &&
          supplierList.map((item, index) => {
            return (
              <div className={style['my-content-bottom-list-every']} key={item.dataId}>
                <div className={style['my-content-bottom-list-every-header']}>
                  <div className={style['my-content-bottom-list-every-header-img']}>
                    <img src={supplierListImg} alt="图片" />
                  </div>
                  <div className={style['my-content-bottom-list-every-header-title']}>
                    <div>{item.attribute1}</div>
                    <span>{item.attribute2}</span>
                  </div>
                </div>
                <div className={style['my-content-bottom-list-every-detail']}>
                  <div className={style['my-content-bottom-list-every-left']}>
                    <div>
                      <img src={numberOfAttached} alt="配属数量" />
                      <span>配属数量:</span>
                      <span>
                        {item.attribute3}种 {item.attribute4}列
                      </span>
                    </div>
                    <div
                      onClick={() => this.handleOpenModal('今日需求', item.attribute1)}
                      className={style['crossed-hand']}
                    >
                      <img src={todayDemandImg} alt="今日需求" />
                      <span>今日需求：{item.attribute6}件</span>
                    </div>
                    <div
                      onClick={() => this.handleOpenModal('今日领料', item.attribute1)}
                      className={style['crossed-hand']}
                    >
                      <img src={pickingTodayImg} alt="今日领料" />
                      <span>今日领料：{item.attribute8}件</span>
                    </div>
                  </div>
                  <div className={style['my-content-bottom-list-every-right']}>
                    <div>
                      <img src={deliveryRateImg} alt="交付率" />
                      <span>交付率：{item.attribute5}%</span>
                    </div>
                    <div
                      onClick={() => this.handleOpenModal('今日退料', item.attribute1)}
                      className={style['crossed-hand']}
                    >
                      <img src={returnTodayImg} alt="今日退料" />
                      <span>今日退料：{item.attribute7}件</span>
                    </div>
                    <div>
                      <img src={unfinishedDemandImg} alt="未完需求" />
                      <span>未完需求：{item.attribute9}件</span>
                    </div>
                  </div>
                </div>
                {index !== 0 ? <div className={style['details-segmentation']} /> : null}
              </div>
            );
          })}
      </div>
    );
  }
}
