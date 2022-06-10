/*
 * @module-: 发货任务看板-头信息
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-05 16:38:32
 * @LastEditTime: 2020-11-10 14:39:47
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { useMemo, useState, useEffect } from 'react';
import circleImg from 'hlos-front/lib/assets/icons/circle.svg';
import blueCircleImg from 'hlos-front/lib/assets/icons/blue-semi-circle.svg';
import orangeCircleImg from 'hlos-front/lib/assets/icons/orange-semi-circle.svg';
import greenCircleImg from 'hlos-front/lib/assets/icons/green-semi-circle.svg';
import yellowCircleImg from 'hlos-front/lib/assets/icons/yellow-semi-circle.svg';
import style from './index.module.less';

let timerHeader = null;
export default function MyHeader({ dataList, getHeader }) {
  const newHeaderList = useMemo(() => dataList, [dataList]);
  const [headerLoading, setHeaderLoading] = useState(false);

  useEffect(() => {
    clearInterval(timerHeader);
    timerHeader = setInterval(() => {
      setHeaderLoading(true);
      getHeader().then(() => setHeaderLoading(false));
    }, 1000 * 60);
  }, [newHeaderList, headerLoading]);

  useEffect(() => {
    return () => {
      clearInterval(timerHeader);
    };
  }, []);

  const topCircleRender = (data) => {
    const { code } = data;
    if (code === 'new') {
      return orangeCircleImg;
    } else if (code === 'completed') {
      return greenCircleImg;
    } else if (code === 'pass') {
      return yellowCircleImg;
    }
    return blueCircleImg;
  };

  return (
    <div className={style['my-header']}>
      {newHeaderList.map((i) => {
        return (
          <section>
            <div>
              {/* <img src={totalImg} alt="发货总量" /> */}
              <img src={circleImg} alt="" />
              <img className={style['top-circle']} src={topCircleRender(i)} alt="" />
              <span>{Math.round(i.rate * 100)}%</span>
            </div>
            <div className={style['my-header-list']}>
              <span>{i.title}</span>
              <div>
                <span>{i.amount}</span>
                <span>单</span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
