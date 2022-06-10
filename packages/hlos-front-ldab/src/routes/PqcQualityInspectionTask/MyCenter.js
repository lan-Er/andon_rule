/*
 * @module-: 中间部分内容
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 09:49:04
 * @LastEditTime: 2020-11-11 17:51:05
 * @copyright: Copyright (c) 2018,Hand
 */
// import ReactEcharts from 'echarts-for-react';
import React, { useRef, useEffect, useState, useMemo } from 'react';

import { NumberField } from 'choerodon-ui/pro';
import moment from 'moment';
import style from './index.module.less';

let timer = null;
let timerCenterLeft = null;

const BoardDivider = () => {
  return (
    <div className={style.divider}>
      <div>
        {[1, 0.6, 0.25].map((item) => {
          return <span key={item} style={{ opacity: item }} />;
        })}
      </div>
      <div className={style.line} />
    </div>
  );
};

export default function MyCenter({ leftList, getLeft, firstAmount, lastAmount }) {
  const centerNode = useRef(null);
  const mainNode = useRef(null);
  const ulList = useRef(null);
  const [actualParentHeight, setActualParentHeight] = useState(0);
  const leftUpdate = useMemo(() => leftList, [leftList]);
  const [loading, setLoading] = useState(false);

  leftUpdate.forEach((item, index) => {
    return Object.assign(item, { key: index });
  });

  const [leftData, setLeftList] = useState(leftUpdate);

  useEffect(() => {
    const { current } = centerNode;
    const domHeight = current.offsetHeight;
    const parentHeightAll = mainNode && mainNode.current.offsetHeight;
    const actualParentHeights = parentHeightAll - 100; // 滚动视窗高度

    setActualParentHeight(actualParentHeights);
    ulList.current.style.overflow = 'hidden';
    handleChangeSize();
    current.style.zIndex = 2;
    if (actualParentHeight < domHeight && !loading) {
      scrollList(actualParentHeights);
    } else {
      handleDelayGetList();
    }
  }, [centerNode, leftData, ulList, actualParentHeight, loading]);

  useEffect(() => {
    window.addEventListener('resize', handleChangeSize);
    return () => handleClear();
  }, []);

  /**
   *当左侧数据没有滚动时候
   *
   */
  function handleDelayGetList() {
    clearInterval(timerCenterLeft);
    timerCenterLeft = setInterval(() => {
      setLoading(true);
      Promise.all([getLeft()])
        .then(() => setLoading(false))
        .catch((err) => console.log(err));
    }, 1000 * 60);
  }

  /**
   *清除副作用
   *
   */
  function handleClear() {
    clearInterval(timer);
    clearInterval(timerCenterLeft);
    window.removeEventListener('resize', handleChangeSize);
  }

  /**
   *缩放窗口时候自适应
   *
   */
  function handleChangeSize() {
    const actualHeight = actualParentHeight || mainNode.current.offsetHeight - 100;
    ulList.current.style.height = `${actualHeight}px`;
    setActualParentHeight(actualHeight);
  }

  /**
   *滚动操作
   *
   */
  function scrollList(domHeight) {
    const { current } = centerNode;
    current.style.top = `${actualParentHeight}px`;
    let top = Number(domHeight) || 0;
    clearInterval(timer);
    timer = setInterval(() => {
      if (-top > current.offsetHeight && !loading) {
        current.style.top = `${actualParentHeight}px`;
        clearInterval(timer);
        setLoading(true);
        Promise.all([getLeft()])
          .then(() => {
            setLoading(false);
            if (centerNode.current.offsetHeight < mainNode.current.offsetHeight - 100) {
              centerNode.current.style.top = '0px';
            }
          })
          .catch((err) => console.log(err));
      } else {
        top -= 1;
        current.style.top = `${top}px`;
      }
    }, 2000 / 60);
  }

  function computeDeclarerHour(time) {
    const currentTime = new Date().getTime();
    const declareTime = new Date(time).getTime();
    const diff = (currentTime - declareTime) / 1000 / 60 / 60;
    if (parseInt(diff, 10) === parseFloat(diff)) {
      return diff;
    } else {
      return diff.toFixed(2);
    }
  }

  async function handleTimeChange(val) {
    setLoading(true);
    getLeft().then((res) => {
      setLoading(false);
      if (centerNode.current.offsetHeight < mainNode.current.offsetHeight - 100) {
        centerNode.current.style.top = '0px';
      }
      res.forEach((item) => {
        const _i = item;
        const diff = computeDeclarerHour(_i.creationDate);
        if (diff > val || diff === val) {
          _i.highlight = true;
        }
      });

      setLeftList(res);
    });
  }

  return (
    <div className={style['my-center-list']}>
      <div
        className={style['my-center-main']}
        ref={(node) => {
          mainNode.current = node;
        }}
      >
        <div className={style['pending-header']}>
          <div>
            <span className={style['area-title']}>待检概况</span>
            <span>
              PQC首检：<span>{firstAmount}单</span>
            </span>
            <span>
              PQC完工检：<span>{lastAmount}单</span>
            </span>
          </div>
          <span className={style['declare-time']}>
            临界报检时间 <NumberField onChange={handleTimeChange} />H
          </span>
        </div>
        <BoardDivider />
        <div className={style['center-main-table']}>
          <ul>
            <li className={style['center-main-table-title']}>
              <span>物料</span>
              <span>检验类型</span>
              <span>地点</span>
              <span>操作员</span>
              <span>判定人</span>
              <span>检验数量</span>
              <span>报检时间</span>
              <span>任务号</span>
            </li>
          </ul>
          <ul
            ref={(node) => {
              ulList.current = node;
            }}
          >
            <div
              ref={(node) => {
                centerNode.current = node;
              }}
            >
              {leftData &&
                leftData.map((item) => {
                  return (
                    <li key={item.key}>
                      <span>
                        {item.itemCode}
                        {item.description && <span>-{item.description}</span>}
                        {item.operationName && <span>-{item.operationName}</span>}
                      </span>
                      <span>{item.inspectionTemplateTypeMeaning}</span>
                      <span>
                        {item.workcellName}
                        {item.prodLineName && <span>-{item.prodLineName}</span>}
                        {item.equipmentName && <span>-{item.equipmentName}</span>}
                        {item.locationName && <span>-{item.locationName}</span>}
                      </span>
                      <span>{item.declarerName}</span>
                      <span>{item.inspector}</span>
                      <span>
                        {item.sampleQty}
                        {item.uomName}
                      </span>
                      <span className={style.time}>
                        <span className={`${item.highlight ? style.highlight : ''}`}>
                          {moment(item.creationDate).format('MM-DD HH:mm')}
                          <span>{computeDeclarerHour(item.creationDate)}H</span>
                        </span>
                      </span>
                      <span>{item.sourceDocNum}</span>
                    </li>
                  );
                })}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
