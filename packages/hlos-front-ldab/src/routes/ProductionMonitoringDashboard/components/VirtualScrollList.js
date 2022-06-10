/*
 * @Description: 生产监控看板定制化虚拟滚动列表
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../index.module.less';
import ScrollItem from './ScrollItem';
import { throttle, debounce } from './utils';

// 数据项 key
let key = 0;

/**
 * @param {Object} props - properties
 * @param {Object[]} [props.items = []] - scroll item
 * @param {string} props.itemType - 用于类名定义 建议取全局唯一值
 * */
export default ({ items = [], itemType, handleUpdateData, coordinate }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [container, setContainer] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const [itemListWrapHeight, seItemListWrapHeight] = useState(0);
  const [scrollItems, setScrollItems] = useState([]);
  // const [mouseEnter, setMouseEnter] = useState(false);
  const intervalIdContainer = useRef(null);

  // 计算滚动列表
  useEffect(() => {
    /**
     * 一次性渲染 6 个元素，此处计算从滚动开始到滚动白屏最少需要的元素个数
     * 因此需要单独增加占位元素
     */
    const { length } = items;
    const _items = items.map((i) => ({
      ...i,
      key: key++,
    }));
    const appendBlankCount = length % 6;
    /**
     * 元素分为三部分：
     * 1. 数据本身
     * 2. 填补尾部空白（保证所有数据滚动出屏幕)
     * 3.在 2 的基础上加上前六个做无限滚动的过渡
     */
    const newItems = [
      ...new Array(6).fill('').map(() => ({
        key: key++,
        value: null,
      })),
      ..._items,
      ...new Array(appendBlankCount).fill('').map(() => ({
        key: key++,
        value: null,
      })),
    ];
    setScrollItems(newItems);
  }, [items]);

  // 初始化 container && 计算高度
  useEffect(() => {
    const _container = document.getElementById(`_infiniteVirtualScrollContainer_${itemType}`);
    setContainer(_container);
    setContainerHeight(_container.offsetHeight);
  }, [itemType]);

  useEffect(() => {
    const handleResize = debounce(() => {
      const vhBase = document.documentElement.clientHeight / 100;
      setItemHeight(vhBase * 12.7); // 单位高度为 11.3vh 中间 margin 为 1.4vh
    });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 计算 listwrap 高度
  useEffect(() => {
    if (scrollItems.length && itemHeight) {
      seItemListWrapHeight(scrollItems.length * itemHeight);
    }
  }, [scrollItems, itemHeight]);

  // 根据元素数量决定是否需要启动滚动
  useEffect(() => {
    if (itemHeight) {
      if (items.length <= 4) {
        clearInterval(intervalIdContainer.current);
        intervalIdContainer.current = null;
      } else if (!intervalIdContainer.current && container) {
        setScroll();
      }
    }
    return () => {
      clearInterval(intervalIdContainer.current);
      intervalIdContainer.current = null;
      key = null;
    };
  }, [items, setScroll, container, itemHeight]);

  const handleScroll = useCallback(
    throttle((target, scrollTop) => {
      // scroll count
      const count = Math.floor(scrollTop / itemHeight);
      // according to count dynamic update item content
      setStartIndex(count + 1);
      // updating style
      // eslint-disable-next-line no-param-reassign
      target.firstElementChild.style.marginTop = `${count * itemHeight}px`;
      // scroll to point
      if (itemHeight !== 0 && itemListWrapHeight) {
        const local =
          coordinate === 'left'
            ? scrollTop - itemHeight >= itemListWrapHeight - containerHeight
            : scrollTop >= itemListWrapHeight - containerHeight;
        const scrollToEnd = local;
        if (scrollToEnd && container) {
          setStartIndex(0);
          container.scrollTop = 0;
          handleUpdateData();
        }
      }
    }),
    [itemListWrapHeight, itemHeight, containerHeight, container]
  );

  // 滚动开始
  const setScroll = useCallback(() => {
    if (itemHeight) {
      intervalIdContainer.current = setInterval(() => {
        container.scrollTop += 1;
      }, 30);
    }
  }, [container, itemHeight]);

  // 鼠标进入时 停止滚动
  const handleMouseEnter = useCallback(() => {
    clearInterval(intervalIdContainer.current);
    intervalIdContainer.current = null;
  }, []);

  // 鼠标离开时 继续滚动
  const handleMouseLeave = useCallback(() => {
    if (intervalIdContainer.current === null && container && items.length > 4) {
      setScroll();
    }
  }, [items, container, setScroll]);

  return (
    <div
      className={styles.itemList}
      id={`_infiniteVirtualScrollContainer_${itemType}`}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.cell}
        style={{
          height: `${itemListWrapHeight}px`,
        }}
      >
        <div className={styles.gridWrap}>
          {items.length <= 4
            ? items.map((v) => {
                // eslint-disable-next-line react/no-array-index-key
                return <ScrollItem item={v} type={itemType} key={v.key} />;
              })
            : scrollItems.slice(startIndex, startIndex + 8).map((v) => {
                if (v.value === null) {
                  // eslint-disable-next-line react/no-array-index-key
                  return <div className={styles.itemWrap} key={v.key} />;
                } else {
                  return <ScrollItem item={v} type={itemType} key={v.key} />;
                }
              })}
        </div>
      </div>
    </div>
  );
};
