/*
 * @module-: 发货任务看板-头信息
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-05 16:38:32
 * @LastEditTime: 2020-11-10 14:39:47
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { useMemo, useState, useEffect } from 'react';

import sentImg from 'hlos-front/lib/assets/sent.png';
import totalImg from 'hlos-front/lib/assets/total.png';
import readImg from 'hlos-front/lib/assets/read-to-go.png';
import pendingImg from 'hlos-front/lib/assets/pending.png';
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
  return (
    <div className={style['my-header']}>
      <section>
        <div>
          <img src={totalImg} alt="发货总量" />
        </div>
        <div className={style['my-header-list']}>
          <span>发货总量</span>
          <div>
            <span>{newHeaderList.sumShipOrderCount}</span>
            <span>单</span>
          </div>
        </div>
      </section>
      <section>
        <div>
          <img src={pendingImg} alt="待拣" />
        </div>
        <div className={style['my-header-list']}>
          <span>待拣</span>
          <div>
            <span>{newHeaderList.releaseShipOrder}</span>
            <span>单</span>
          </div>
        </div>
      </section>
      <section>
        <div>
          <img src={readImg} alt="待发" />
        </div>
        <div className={style['my-header-list']}>
          <span>待发</span>
          <div>
            <span>{newHeaderList.pickedShipOrder}</span>
            <span>单</span>
          </div>
        </div>
      </section>
      <section>
        <div>
          <img src={sentImg} alt="已发" />
        </div>
        <div className={style['my-header-list']}>
          <span>已发</span>
          <div>
            <span>{newHeaderList.executedShipOrder}</span>
            <span>单</span>
          </div>
        </div>
      </section>
    </div>
  );
}
