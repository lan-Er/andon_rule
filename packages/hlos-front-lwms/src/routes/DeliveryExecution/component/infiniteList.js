/*
 * @Description: 虚拟滚动列表
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-10 15:34:28
 * @LastEditors: 赵敏捷
 */

import React, { useCallback, useEffect, useState } from 'react';
import { debounce, throttle } from 'lodash';

import styles from '../index.module.less';
import ListItem from './listItem';

export default function InfiniteList({ recList = [], workerObj, onSearch, history }) {
  // 最外层
  const [wrapRef, setWrapRef] = useState(null);
  // 列表
  const [containerRef, setContainerRef] = useState(null);
  // 占位 div （用于占据实际滚动高度）
  const [paddingRef, setPaddingRef] = useState(null);
  // 单排滚动元素高度
  const [itemHeight, setItemHeight] = useState(0);
  // 最大滚动距离
  const [maxTranslate, setMaxTranslate] = useState(0);
  // 当前已滚动元素行数
  const [scrolledItemsCount, setScrolledItemsCount] = useState(0);

  const init = useCallback(() => {
    if (wrapRef && paddingRef) {
      // 计算单位可视范围高度 由此根据布局可以计算出单排元素高度
      const wrapHeight = wrapRef.offsetHeight;
      const _totalHeight = Math.ceil(recList.length / 12) * wrapHeight;
      const _maxTranslate = _totalHeight - wrapHeight;
      // grid-row height: 32% + grid-gap 2%
      setItemHeight(wrapHeight * 0.34);
      setMaxTranslate(_maxTranslate);
      paddingRef.style.height = `${_totalHeight}px`;
    }
  }, [wrapRef, paddingRef, recList]);

  useEffect(() => {
    init();
    const debouncedResizeHandler = debounce(() => init(), 200);
    // 窗口 resize 导致可视窗口宽度变化需重新初始化
    window.addEventListener('resize', debouncedResizeHandler);
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, [init]);

  const throttledScrollHandler = useCallback(
    throttle((e) => {
      e.persist();
      const { scrollTop } = e.target;
      const _scrolledItemsCount = Math.floor(scrollTop / itemHeight);
      setScrolledItemsCount(_scrolledItemsCount);
      containerRef.style.transform = `translateY(${Math.min(
        _scrolledItemsCount * itemHeight,
        maxTranslate
      )}px)`;
    }, 10),
    [containerRef, maxTranslate, itemHeight]
  );

  const handleScroll = useCallback(
    (e) => {
      e.persist();
      throttledScrollHandler(e);
    },
    [throttledScrollHandler]
  );

  return (
    <div
      className={styles['content-part']}
      onScroll={handleScroll}
      ref={(node) => setWrapRef(node)}
    >
      <div ref={(node) => setPaddingRef(node)} />
      <div className={styles['infinite-list']} ref={(node) => setContainerRef(node)}>
        {recList.slice(scrolledItemsCount * 4, scrolledItemsCount * 4 + 16).map((rec) => (
          <ListItem
            rec={rec}
            recList={recList}
            key={rec.shipOrderId}
            workerObj={workerObj}
            onSearch={onSearch}
            history={history}
          />
        ))}
      </div>
    </div>
  );
}
