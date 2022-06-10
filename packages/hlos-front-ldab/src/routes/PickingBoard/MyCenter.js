/*
 * @module-: 中间部分内容
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 09:49:04
 * @LastEditTime: 2020-11-11 17:51:05
 * @copyright: Copyright (c) 2018,Hand
 */
// import ReactEcharts from 'echarts-for-react';
import React, { useRef, useEffect, useState, useMemo } from 'react';

import style from './index.module.less';
import MyBr from './components/MyBr';

let timer = null;
let timerCenterLeft = null;
let timerCenterRight = null;
let timerRightDelay = null;
export default function MyCenter({ leftList, rightList, getLeft, getRight }) {
  const centerNode = useRef(null);
  const centerRightNode = useRef(null);
  const mainNode = useRef(null);
  const ulList = useRef(null);
  const ulRightList = useRef(null);
  const [actualParentHeight, setActualParentHeight] = useState(0);
  const [actualParentRightHeight, setActualParentRightHeight] = useState(0);
  const leftUpdate = useMemo(() => leftList, [leftList]);
  const rightUpdate = useMemo(() => rightList, [rightList]);
  const [loading, setLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);

  leftUpdate.forEach((item, index) => {
    return Object.assign(item, { key: index });
  });
  useEffect(() => {
    const { current } = centerNode;
    const domHeight = current.offsetHeight;
    const parentHeightAll = mainNode && mainNode.current.offsetHeight;
    const actualParentHeights = parentHeightAll - 100; // 滚动视窗高度

    setActualParentHeight(actualParentHeights);
    ulList.current.style.overflow = 'hidden';
    ulRightList.current.style.overflow = 'hidden';
    handleChangeSize();
    current.style.zIndex = 2;
    if (actualParentHeight < domHeight && !loading) {
      scrollList(actualParentHeights);
    } else {
      handleDelayGetList();
    }
  }, [centerNode, leftUpdate, ulList, actualParentHeight, loading]);

  useEffect(() => {
    const parentHeight = mainNode && mainNode.current.offsetHeight;
    const actualParentHeights = parentHeight - 100; // 滚动视窗高度
    setActualParentRightHeight(actualParentHeights);
    if (centerRightNode.current.offsetHeight > actualParentHeights && !rightLoading) {
      scrollRight(actualParentHeights);
    } else {
      handleDelayRightList();
    }
  }, [centerRightNode, rightUpdate, rightLoading, actualParentRightHeight, ulRightList]);

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
      Promise.all([getRight(), getLeft()])
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
    clearInterval(timerCenterRight);
    clearInterval(timerRightDelay);
    window.removeEventListener('resize', handleChangeSize);
  }

  /**
   *缩放窗口时候自适应
   *
   */
  function handleChangeSize() {
    const actualHeight = actualParentHeight || mainNode.current.offsetHeight - 100;
    ulList.current.style.height = `${actualHeight}px`;
    ulRightList.current.style.height = `${actualHeight}px`;
    setActualParentHeight(actualHeight);
    setActualParentRightHeight(actualHeight);
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
        Promise.all([getRight(), getLeft()])
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

  /**
   *右侧滚动
   *
   * @param {*} domHeight
   */
  function scrollRight(domHeight) {
    const { current } = centerRightNode;
    current.style.top = `${actualParentRightHeight}px`;
    let top = Number(domHeight) || 0;
    clearInterval(timerCenterRight);
    timerCenterRight = setInterval(() => {
      if (-top > current.offsetHeight) {
        clearInterval(timerCenterRight);
        setRightLoading(true);
        getRight().then(() => {
          setRightLoading(false);
          if (centerRightNode.current.offsetHeight < mainNode.current.offsetHeight - 100) {
            centerRightNode.current.style.top = '0px';
          }
        });
      } else {
        top -= 1;
        current.style.top = `${top}px`;
      }
    }, 2000 / 60);
  }

  /**
   *右侧没有数据时候1min钟刷新一次
   *
   */
  function handleDelayRightList() {
    clearInterval(timerRightDelay);
    timerRightDelay = setInterval(() => {
      setRightLoading(true);
      getRight()
        .then(() => {
          setRightLoading(false);
          centerRightNode.current.style.top = '0px';
        })
        .catch((err) => console.log(err));
    }, 1000 * 60);
  }

  return (
    <div className={style['my-center-list']}>
      <div
        className={style['my-center-main']}
        ref={(node) => {
          mainNode.current = node;
        }}
      >
        <MyBr title="待拣概况" />
        <div className={style['center-main-table']}>
          <ul>
            <li className={style['center-main-table-title']}>
              <span>产品</span>
              <span>来源仓库</span>
              <span>工单号</span>
              <span>目标产线</span>
              <span>待拣数</span>
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
              {leftUpdate &&
                leftUpdate.map((item) => {
                  return (
                    <li key={item.key}>
                      <span>
                        {item.itemCode}-{item.itemDescription}
                      </span>
                      <span>{item.warehouseName}</span>
                      <span>{item.moNum}</span>
                      <span>{item.prodLineName}</span>
                      <span>
                        {item.applyQty} {item.uomName}
                      </span>
                    </li>
                  );
                })}
            </div>
          </ul>
        </div>
      </div>
      {/* <div className={style['my-center-right']}>
        <MyBr title="已发概况" />
        <div className={style['center-right-table']}>
          <ul className={style['my-center-right-list-title-local']}>
            <li className={style['center-right-table-title']}>
              <span>领料单号</span>
              <span>目标产线</span>
            </li>
          </ul>
          <ul
            className={style['my-center-right-last']}
            ref={(node) => {
              ulRightList.current = node;
            }}
          >
            <div
              className={style['my-center-right-table']}
              ref={(node) => {
                centerRightNode.current = node;
              }}
            >
              {rightUpdate &&
                rightUpdate.map((item) => {
                  return (
                    <li key={item.key}>
                      <span>{item.requestNum}</span>
                      <span>{item.prodLineName}</span>
                    </li>
                  );
                })}
            </div>
          </ul>
        </div>
      </div> */}
      <div className={`${style['my-center-main']} ${style['my-center-right']}`}>
        <MyBr title="已发概况" />
        <div className={style['center-main-table']}>
          <ul>
            <li
              className={`${style['center-main-table-title']} ${style['center-right-table-title']}`}
            >
              <span>领料单号</span>
              <span>目标产线</span>
            </li>
          </ul>
          <ul
            ref={(node) => {
              ulRightList.current = node;
            }}
          >
            <div
              ref={(node) => {
                centerRightNode.current = node;
              }}
            >
              {rightUpdate &&
                rightUpdate.map((item) => {
                  return (
                    <li key={item.key}>
                      <span>{item.requestNum}</span>
                      <span>{item.prodLineName}</span>
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
