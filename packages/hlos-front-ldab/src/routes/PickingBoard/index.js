/*
 * @module-: 发货任务看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-05 16:16:39
 * @LastEditTime: 2020-11-10 17:06:21
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { Fragment, useEffect, useState } from 'react';

import { connect } from 'dva';
import { Spin } from 'choerodon-ui';
import notification from 'utils/notification';
import DashboardHeader from 'hlos-front/lib/components/DashboardHeader';

import MyHeader from './MyHeader';
import MyCenter from './MyCenter';
import MyFooter from './MyFooter';
import style from './index.module.less';

function pickingBoard(props) {
  const [headerList, setHeaderList] = useState([
    {
      code: 'request',
      title: '领料单总数',
      amount: 0,
      rate: 0,
    },
    {
      code: 'released',
      title: '待拣数',
      amount: 0,
      rate: 0,
    },
    {
      code: 'picked',
      title: '待发数',
      amount: 0,
      rate: 0,
    },
    {
      code: 'executed',
      title: '已发数',
      amount: 0,
      rate: 0,
    },
  ]);
  const [centerLeft, setCenterLeft] = useState([]);
  const [centerRight, setCenterRight] = useState({});
  const [bottomLeft, setBottomLeft] = useState([]);
  const [bottomRight, setBottomRight] = useState([]);
  const [totalLoading, setTotalLoading] = useState(true);
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const id = await getDefaultOrg();
    return Promise.all([
      getHeaderList(id),
      getContentLeft(id),
      getFooterLeft(id),
      getFooterRight(id),
      getCenterRight(id),
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

  function getDefaultOrg() {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'pickingBoardModel/getUserSetting',
        payload: {
          defaultFlag: 'Y',
        },
      })
        .then((res) => {
          if (res) {
            setOrgId(res.content[0].organizationId);
            response(res.content[0].organizationId);
          }
        })
        .catch((err) => rej(err));
    });
  }

  /**
   *获取头部数据
   *
   * @returns
   */
  function getHeaderList(organizationId) {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'pickingBoardModel/getTaskBoard',
        payload: {
          organizationId: organizationId || orgId,
        },
      })
        .then((res) => {
          if (res) {
            const statisticsList = headerList.slice();
            Object.keys(res).forEach((key) => {
              statisticsList.forEach((i) => {
                const _i = i;
                if (key.indexOf(_i.code) !== -1) {
                  if (key.indexOf('Amount') !== -1) {
                    _i.amount = res[key];
                  } else if (key.indexOf('Rate') !== -1) {
                    _i.rate = res[key];
                  }
                }
              });
            });
            setHeaderList(statisticsList);
            response(statisticsList);
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
  function getContentLeft(organizationId) {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'pickingBoardModel/getPending',
        payload: {
          organizationId: organizationId || orgId,
        },
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
  function getFooterLeft(organizationId) {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'pickingBoardModel/getReadyToGo',
        payload: {
          organizationId: organizationId || orgId,
        },
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
  function getFooterRight(organizationId) {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'pickingBoardModel/getSent',
        payload: {
          organizationId: organizationId || orgId,
        },
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
  function getCenterRight(organizationId) {
    const { dispatch } = props;
    return new Promise((response, rej) => {
      dispatch({
        type: 'pickingBoardModel/getPieList',
        payload: {
          organizationId: organizationId || orgId,
        },
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
      <DashboardHeader title="领料看板" history={props.history} />
      {totalLoading ? (
        <div className={style['my-loading']}>
          <Spin size="large" />
        </div>
      ) : (
        <Fragment>
          <MyHeader dataList={headerList} getHeader={getHeaderList} orgId={orgId} />
          <div className={style['my-shipment-task-auto']}>
            <div className={style['shipment-task-center']}>
              <MyCenter
                leftList={centerLeft}
                rightList={centerRight}
                getLeft={getContentLeft}
                getRight={getCenterRight}
                orgId={orgId}
              />
            </div>
            <div className={style['shipment-task-footer']}>
              <MyFooter
                footerLeft={bottomLeft}
                footerRight={bottomRight}
                getFooterLeft={getFooterLeft}
                getFooterRight={getFooterRight}
                orgId={orgId}
              />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
export default connect()(pickingBoard);
