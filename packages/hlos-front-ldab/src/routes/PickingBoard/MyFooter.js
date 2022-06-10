/*
 * @module-:底部组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 11:09:37
 * @LastEditTime: 2020-11-11 17:54:01
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { useRef, useEffect, useState, useMemo } from 'react';

import MyBr from './components/MyBr';
import style from './index.module.less';

let timerFooter = null;
let timerFooterLeftDelay = null;
let timerFooterRight = null;
let timerFooterRightDelay = null;
export default function MyFooter({ footerLeft, footerRight, getFooterLeft, getFooterRight }) {
  const footerNode = useRef(null);
  const footerMainNode = useRef(null);
  const footerUlList = useRef(null);
  const footerRightNode = useRef(null);
  const footerUlRightList = useRef(null);
  const [actualParentHeight, setActualParentHeight] = useState(0);
  const [actualParentRightHeight, setActualParentRightHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [footerRightLoading, setFooterRightLoading] = useState(false);
  const newFooterLeft = useMemo(() => footerLeft, [footerLeft]);
  const newFooterRight = useMemo(() => footerRight, [footerRight]);
  newFooterRight.forEach((item, index) => {
    return Object.assign(item, { key: index });
  });
  useEffect(() => {
    const { current } = footerNode;
    const domHeight = current.offsetHeight;
    const parentHeightAll = footerMainNode && footerMainNode.current.offsetHeight;
    const actualParentHeights = parentHeightAll - 100; // 滚动视窗高度
    setActualParentHeight(actualParentHeights);
    footerUlList.current.style.overflow = 'hidden';
    footerUlRightList.current.style.overflow = 'hidden';
    handleChangeSize();
    current.style.zIndex = 2;
    if (actualParentHeight < domHeight && !loading) {
      scrollList(actualParentHeights);
    } else {
      handleFooterDelayGetList();
    }
  }, [footerNode, footerUlList, newFooterLeft, actualParentHeight, loading]);

  useEffect(() => {
    const parentHeight = footerMainNode && footerMainNode.current.offsetHeight;
    const actualParentHeights = parentHeight - 100; // 滚动视窗高度
    setActualParentRightHeight(actualParentHeights);
    if (footerRightNode.current.offsetHeight > actualParentHeights && !footerRightLoading) {
      scrollRight(actualParentHeights);
    } else {
      handleFooterDelayRightList();
    }
  }, [
    footerRightNode,
    newFooterRight,
    footerRightLoading,
    actualParentRightHeight,
    footerUlRightList,
  ]);
  /**
   *滚动操作
   *
   */
  function scrollList(domHeight) {
    const { current } = footerNode;
    current.style.top = `${actualParentHeight}px`;
    let top = Number(domHeight) || 0;
    clearInterval(timerFooter);
    timerFooter = setInterval(() => {
      if (-top > current.offsetHeight && !loading) {
        clearInterval(timerFooter);
        current.style.top = `${actualParentHeight}px`;
        setLoading(true);
        getFooterLeft().then(() => {
          setLoading(false);
          if (footerNode.current.offsetHeight < footerMainNode.current.offsetHeight - 100) {
            footerNode.current.style.top = '0px';
          }
        });
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
    const { current } = footerRightNode;
    current.style.top = `${actualParentRightHeight}px`;
    let top = Number(domHeight) || 0;
    clearInterval(timerFooterRight);
    timerFooterRight = setInterval(() => {
      if (-top > current.offsetHeight) {
        clearInterval(timerFooterRight);
        setFooterRightLoading(true);
        getFooterRight().then(() => {
          setFooterRightLoading(false);
          if (footerRightNode.current.offsetHeight < footerMainNode.current.offsetHeight - 100) {
            footerRightNode.current.style.top = '0px';
          }
        });
      } else {
        top -= 1;
        current.style.top = `${top}px`;
      }
    }, 2000 / 60);
  }

  /**
   *左侧没有滚动时候加载
   *
   */
  function handleFooterDelayGetList() {
    clearInterval(timerFooterLeftDelay);
    timerFooterLeftDelay = setInterval(() => {
      setLoading(true);
      getFooterLeft()
        .then(() => {
          footerNode.current.style.top = '0px';
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }, 1000 * 60);
  }

  /**
   *右侧没有数据时候1min钟刷新一次
   *
   */
  function handleFooterDelayRightList() {
    clearInterval(timerFooterRightDelay);
    timerFooterRightDelay = setInterval(() => {
      setFooterRightLoading(true);
      getFooterRight()
        .then(() => {
          setFooterRightLoading(false);
          footerRightNode.current.style.top = '0px';
        })
        .catch((err) => console.log(err));
    }, 1000 * 60);
  }

  useEffect(() => {
    window.addEventListener('resize', handleChangeSize);
    return () => handleClear();
  }, []);

  /**
   *清除副作用
   *
   */
  function handleClear() {
    clearInterval(timerFooter);
    clearInterval(timerFooterRight);
    clearInterval(timerFooterLeftDelay);
    clearInterval(timerFooterRightDelay);
    window.removeEventListener('resize', handleChangeSize);
  }

  /**
   *缩放窗口时候自适应
   *
   */
  function handleChangeSize() {
    const actualHeight = footerMainNode.current.offsetHeight - 100;
    footerUlList.current.style.height = `${actualHeight}px`;
    footerUlRightList.current.style.height = `${actualHeight}px`;
    setActualParentHeight(actualHeight);
    setActualParentRightHeight(actualHeight);
  }

  return (
    <div className={style['my-footer-content']}>
      <div
        className={style['my-footer-left']}
        ref={(node) => {
          footerMainNode.current = node;
        }}
      >
        <MyBr title="待发概况" />
        <div className={style['footer-left-table']}>
          <ul className={style['my-footer-list']}>
            <li className={style['footer-left-table-title']}>
              <span>领料单号</span>
              <span>装配件</span>
              <span>目标产线</span>
              <span>地点</span>
            </li>
          </ul>
          <ul
            ref={(node) => {
              footerUlList.current = node;
            }}
          >
            <div
              ref={(node) => {
                footerNode.current = node;
              }}
            >
              {newFooterLeft &&
                newFooterLeft.map((item) => {
                  return (
                    <li key={item.requestNum}>
                      <span>{item.requestNum}</span>
                      <span>
                        {item.assemblyItemCode}-{item.assemblyItemDescription}
                      </span>
                      <span>{item.prodLineName}</span>
                      <span>{item.locationName}</span>
                    </li>
                  );
                })}
            </div>
          </ul>
        </div>
      </div>
      <div className={style['my-footer-right']}>
        <MyBr title="非生产领料单" />
        <ul className={style['my-footer-right-list-title-local']}>
          <li>
            <span>领料单号</span>
            <span>申领部门</span>
          </li>
        </ul>
        <ul
          className={style['my-footer-right-last']}
          ref={(node) => {
            footerUlRightList.current = node;
          }}
        >
          <div
            className={style['my-footer-right-table']}
            ref={(node) => {
              footerRightNode.current = node;
            }}
          >
            {newFooterRight &&
              newFooterRight.map((item) => {
                return (
                  <li key={item.key}>
                    <span>{item.requestNum}</span>
                    <span>{item.requestDepartment}</span>
                  </li>
                );
              })}
          </div>
        </ul>
      </div>
    </div>
  );
}
