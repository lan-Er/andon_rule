/*
 * @Description: 定制化虚拟无限滚动列表
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-08 16:23:35
 * @LastEditors: 赵敏捷
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AndonItem from './andonItem';
import styles from './index.module.less';

const throttle = (fun) => {
  let onProcessing = false;
  return (e) => {
    const {
      target,
      target: { scrollTop },
    } = e;
    if (onProcessing === false) {
      onProcessing = true;
      window.requestAnimationFrame(() => {
        // console.log('scrollTop: ', scrollTop);
        fun(target, scrollTop);
        onProcessing = false;
      });
    }
  };
};

// 数据项 key
let key = 0;

export default ({ items = [], modalOpen = false, itemType }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [container, setContainer] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const [itemListWrapHeight, seItemListWrapHeight] = useState(0);
  const [mouseEnter, setMouseEnter] = useState(false);
  const intervalIdContainer = useRef(null);
  const itemHeight = 104;
  const handleScroll = throttle((target, scrollTop) => {
    // scroll count
    const count = Math.floor(scrollTop / itemHeight);
    // according to count dynamic update item content
    setStartIndex(count * 2);
    // updating style
    // eslint-disable-next-line no-param-reassign
    target.firstElementChild.style.marginTop = `${count * itemHeight}px`;
    // scroll to point
    if (itemHeight !== 0 && itemListWrapHeight) {
      const scrollToEnd = scrollTop >= itemListWrapHeight - containerHeight;
      if (scrollToEnd && container) {
        container.scrollTop = 0;
      }
    }
  });
  /**
   * 根据 UI 界面，一次性渲染 6 个元素，此处计算从滚动开始到滚动白屏最少需要的元素个数
   * 因此需要单独增加占位元素
   */
  const { length } = items;
  items.forEach((i) => {
    // eslint-disable-next-line no-param-reassign
    i.key = key++;
  });
  const totalItemCountWithBlank = Math.ceil(length / 2) * 2 + 6;
  const appendBlankCount = totalItemCountWithBlank - length;
  /**
   * 元素分为三部分：
   * 1. 数据本身
   * 2. 填补空白（滚动到底是页面留白）
   * 3.在 2 的基础上加上前六个做无限滚动的过渡
   */
  const newItems = [
    ...new Array(6).fill('').map(() => ({
      key: key++,
      value: null,
    })),
    ...items,
    ...new Array(appendBlankCount).fill('').map(() => ({
      key: key++,
      value: null,
    })),
  ];

  const setScroll = useCallback(() => {
    intervalIdContainer.current = setInterval(() => {
      container.scrollTop += 1;
    }, 20);
    // console.log('set id: ', id);
  }, [container]);

  // 初始化 container && 计算高度
  useEffect(() => {
    const _container = document.getElementById(`_infiniteVirtualScrollContainer_${itemType}`);
    setContainer(_container);
    setContainerHeight(_container.offsetHeight);
    return () => {
      clearInterval(intervalIdContainer.current);
      key = null;
    };
  }, [itemType]);

  // update item list length
  useEffect(() => {
    seItemListWrapHeight(Math.ceil(newItems.length / 2) * itemHeight);
    if (items.length <= 4) {
      clearInterval(intervalIdContainer.current);
      intervalIdContainer.current = null;
    } else if (!intervalIdContainer.current) {
      setScroll();
    }
  }, [items, newItems, setScroll]);

  // reset scroll to 0
  useEffect(() => {
    if (intervalIdContainer.current === null && items.length <= 4 && container) {
      container.scrollTop = 0;
    }
  }, [items.length, container]);

  // 当弹窗打开 停止滚动
  useEffect(() => {
    if (container) {
      if (modalOpen) {
        clearInterval(intervalIdContainer.current);
        intervalIdContainer.current = null;
      } else if (intervalIdContainer.current === null && !mouseEnter && items.length > 4) {
        setScroll();
      }
    }
  }, [modalOpen, container, mouseEnter, setScroll, items]);

  // 鼠标进入时 停止滚动
  const handleMouseEnter = () => {
    clearInterval(intervalIdContainer.current);
    intervalIdContainer.current = null;
    setMouseEnter(true);
  };

  const handleMouseLeave = () => {
    if (intervalIdContainer.current === null && container && items.length > 4) {
      setScroll();
    }
  };

  return (
    <div
      className={styles.itemList}
      id={`_infiniteVirtualScrollContainer_${itemType}`}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.andonCell}
        style={{
          height: `${itemListWrapHeight}px`,
        }}
      >
        <div className={styles.gridWrap}>
          {items.length <= 4
            ? items.map((v) => (
                // eslint-disable-next-line react/no-array-index-key
              <AndonItem item={v} type={itemType} key={v.key} />
              ))
            : newItems.slice(startIndex, startIndex + 8).map((v) => {
                if (v.value === null) {
                  // eslint-disable-next-line react/no-array-index-key
                  return <div className={styles.itemWrap} key={v.key} />;
                } else {
                  return <AndonItem item={v} type={itemType} key={v.key} />;
                }
              })}
        </div>
      </div>
    </div>
  );
};
