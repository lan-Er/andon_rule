/*
 * @module: 内容滚动卡片
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-03 16:01:49
 * @LastEditTime: 2020-12-03 18:45:47
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';

import style from './index.module.less';

const scrollList = {
  titleList: [
    { name: 'MO', type: 'string' },
    { name: '批次', type: 'string' },
    { name: '采购日期', type: 'date' },
    { name: '到货日期', type: 'date' },
    { name: '物料', type: 'string' },
    { name: '负责人', type: 'string' },
  ],
  lineList: [
    {
      rowLineList: [
        { value: '2020', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2021', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2022', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2023', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2024', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2025', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2026', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2025', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2026', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2025', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2026', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2025', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2026', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2025', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2026', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2025', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
    {
      rowLineList: [
        { value: '2026', type: 'string' },
        { value: '2021-M-L', type: 'string' },
        { value: '2020-10-11', type: 'date' },
        { value: '2020-10-11', type: 'date' },
        { value: 'item2020', type: 'string' },
        { value: '张', type: 'string' },
      ],
    },
  ],
};
export default function ListScrollCard() {
  const { titleList, lineList } = scrollList;
  return (
    <div className={style['my-card-scroll-list']}>
      <div className={style['my-card-scroll-list']}>
        <ul className={style['my-card-title']}>
          <li>
            {titleList &&
              titleList.map((item) => {
                return <span>{item.name}</span>;
              })}
          </li>
        </ul>
        <div className={style['my-scroll-content']}>
          <ul className={style['my-card-list']}>
            {lineList &&
              lineList.map((i) => {
                return (
                  <li>
                    {i.rowLineList &&
                      i.rowLineList.map((list) => {
                        return <span>{list.value}</span>;
                      })}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
