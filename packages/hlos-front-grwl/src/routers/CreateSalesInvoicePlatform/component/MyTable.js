/*
 * @module: 表格组件封装
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-23 11:22:56
 * @LastEditTime: 2021-03-25 15:08:24
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import { Table } from 'choerodon-ui/pro';

export default function MyTable(props) {
  const { talbeConfig } = props;
  return <Table {...talbeConfig} />;
}
