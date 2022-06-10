/*
 * @module: 超出文本滚动组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-01 19:15:07
 * @LastEditTime: 2021-03-02 14:40:05
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { useEffect, useRef } from 'react';

import style from './marquee.module.less';

export default function MyMarquee(props) {
  const parentOverFlowNode = useRef(null);
  const childrenOverFlowNode = useRef(null);

  useEffect(() => {
    if (childrenOverFlowNode && parentOverFlowNode) {
      const widthOne = parentOverFlowNode && parentOverFlowNode.current.offsetWidth;
      const childWidth = parentOverFlowNode && parentOverFlowNode.current.scrollWidth;
      if (childWidth > widthOne) {
        childrenOverFlowNode.current.style.width = `${childWidth}px`;
        childrenOverFlowNode.current.className = style['need-marquee'];
      }
    }
  }, [parentOverFlowNode, childrenOverFlowNode]);
  return (
    <div
      className={style['my-marquee-list']}
      ref={(node) => {
        parentOverFlowNode.current = node;
      }}
    >
      <div
        ref={(node) => {
          childrenOverFlowNode.current = node;
        }}
        className={style['my-text-list']}
      >
        {props.children}
      </div>
    </div>
  );
}
