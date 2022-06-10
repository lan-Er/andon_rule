/*
 * @module-: 发货任务看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-05 16:16:39
 * @LastEditTime: 2021-01-18 15:18:21
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { Fragment, useEffect, useState } from 'react';

import { connect } from 'dva';
import { Spin } from 'choerodon-ui';
import notification from 'utils/notification';
import DashboardHeader from '@/common/DashboardHeader';

import MyHeader from './MyHeader';
import MyCenter from './MyCenter';
import MyFooter from './MyFooter';
import style from './index.module.less';

function ShipmentTaskKanban(props) {
  const [headerList, setHeaderList] = useState({});
  const [centerLeft, setCenterLeft] = useState([]);
  const [centerRight, setCenterRight] = useState({});
  const [bottomLeft, setBottomLeft] = useState([]);
  const [bottomRight, setBottomRight] = useState([]);
  const [totalLoading, setTotalLoading] = useState(true);
  useEffect(() => {
    init();
  }, []);

  function init() {
    return Promise.all([
      getHeaderList(),
      getContentLeft(),
      getFooterLeft(),
      getFooterRight(),
      getCenterRight(),
    ])
      .then(() => {
        setTotalLoading(false);
        notification.success({
          message: '加载完成',
        });
      })
      .catch((err) => {
        console.log(err, '出现错误');
      });
  }
  /**
   *获取头部数据
   *
   * @returns
   */
  function getHeaderList() {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'shipmentTaskModel/getTaskBoard',
      })
        .then((res) => {
          if (res) {
            setHeaderList(res);
            response(res);
          }
        })
        .catch((err) => rej(err));
    });
  }

  /**
   *获取中间左侧数据
   *
   * @returns
   */
  function getContentLeft() {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'shipmentTaskModel/getPending',
      })
        .then((res) => {
          if (res) {
            setCenterLeft(res);
            response(res);
          }
        })
        .catch((err) => rej(err));
    });
  }

  /**
   *获取底部左侧数据
   *
   * @returns
   */
  function getFooterLeft() {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'shipmentTaskModel/getReadyToGo',
      })
        .then((res) => {
          if (res) {
            setBottomLeft(res);
            response(res);
          }
        })
        .catch((err) => rej(err));
    });
  }

  /**
   *获取底部右侧数据
   *
   * @returns
   */
  function getFooterRight() {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'shipmentTaskModel/getSent',
      })
        .then((res) => {
          if (res) {
            setBottomRight(res);
            response(res);
          }
        })
        .catch((err) => rej(err));
    });
  }

  /**
   *获取中间饼图数据
   *
   * @returns
   */
  function getCenterRight() {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'shipmentTaskModel/getPieList',
      })
        .then((res) => {
          if (res) {
            setCenterRight(res);
            response(res);
          }
        })
        .catch((err) => rej(err));
    });
  }
  return (
    <div className={style['shipment-task-kanban']}>
      <DashboardHeader title="发货任务看板" history={props.history} />
      {totalLoading ? (
        <div className={style['my-loading']}>
          <Spin size="large" />
        </div>
      ) : (
        <Fragment>
          <MyHeader dataList={headerList} getHeader={getHeaderList} />
          <div className={style['my-shipment-task-auto']}>
            <div className={style['shipment-task-center']}>
              <MyCenter
                leftList={centerLeft}
                rightPie={centerRight}
                getLeft={getContentLeft}
                getRight={getCenterRight}
              />
            </div>
            <div className={style['shipment-task-footer']}>
              <MyFooter
                footerLeft={bottomLeft}
                footerRight={bottomRight}
                getFooterLeft={getFooterLeft}
                getFooterRight={getFooterRight}
              />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
export default connect()(ShipmentTaskKanban);
