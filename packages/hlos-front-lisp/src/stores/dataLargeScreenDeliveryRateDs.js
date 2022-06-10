/*
 * @module-: 工业互联网产业链融合创效数据大屏
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-29 14:48:26
 * @LastEditTime: 2020-07-31 18:01:30
 * @copyright: Copyright (c) 2018,Hand
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser } from 'utils/utils';

const queryUrl = `${HLOS_LISP}/v1/datas/solution-pack`;
const { loginName } = getCurrentUser();
// 交付率
export const deliveryRate = () => ({
  name: 'deliveryRate',
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'attribute1',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '物料编码',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '物料名称',
      type: 'string',
    },
    {
      name: 'attribute4',
      label: '出库单号',
      type: 'string',
    },
    {
      name: 'attribute5',
      label: '出库行号',
      type: 'string',
    },
    {
      name: 'attribute6',
      label: '发货数量',
      type: 'number',
    },
    {
      name: 'attribute7',
      label: '出库库存地点',
      type: 'string',
    },
  ],
  queryFields: [
    {
      name: 'attribute1',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '物料编码',
      type: 'string',
    },
    {
      name: 'attribute4',
      label: '出库单号',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const url = queryUrl;
      return {
        url,
        data: {
          ...data,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'BOARD-CUMULATIVE',
        },
        method: 'GET',
      };
    },
  },
});

// 今日需求
export const todayDemand = (supplier) => ({
  name: 'todayDemand',
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'attribute1',
      label: '供应商名称',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '需求客户',
      type: 'string',
    },
    {
      name: 'attribute4',
      label: '数量',
      type: 'number',
    },
    {
      name: 'attribute5',
      label: '状态',
      type: 'string',
    },
    {
      name: 'attribute6',
      label: '创建时间',
      type: 'string',
    },
    {
      name: 'attribute7',
      label: '创建时间',
      type: 'string',
    },
  ],
  queryFields: [
    {
      name: 'attribute2',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '需求客户',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const url = queryUrl;
      return {
        url,
        data: {
          ...data,
          attribute1: supplier,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'TODAY-DEMAND',
        },
        method: 'GET',
      };
    },
  },
});

// 今日退料
export const returnToday = (supplier) => ({
  name: 'returnToday',
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'attribute1',
      label: '供应商名称',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '物料编码',
      type: 'string',
    },
    {
      name: 'attribute5',
      label: '出库单号',
      type: 'string',
    },
    {
      name: 'attribute4',
      label: '物料名称',
      type: 'string',
    },
    {
      name: 'attribute6',
      label: '出库行号',
      type: 'string',
    },
    {
      name: 'attribute7',
      label: '出库数量',
      type: 'number',
    },
    {
      name: 'attribute8',
      label: '出库库区',
      type: 'string',
    },
    {
      name: 'attribute9',
      label: '出库时间',
      type: 'string',
    },
  ],
  queryFields: [
    {
      name: 'attribute2',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '物料编码',
      type: 'string',
    },
    {
      name: 'attribute5',
      label: '出库单号',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const url = queryUrl;
      return {
        url,
        data: {
          ...data,
          attribute1: supplier,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'TODAY-RETURN',
        },
        method: 'GET',
      };
    },
  },
});

// 今日领料
export const pickingToday = (supplier) => ({
  name: 'pickingToday',
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'attribute1',
      label: '供应商名称',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '物料编码',
      type: 'string',
    },
    {
      name: 'attribute5',
      label: '出库单号',
      type: 'string',
    },
    {
      name: 'attribute4',
      label: '物料名称',
      type: 'string',
    },
    {
      name: 'attribute6',
      label: '出库行号',
      type: 'string',
    },
    {
      name: 'attribute7',
      label: '出库数量',
      type: 'number',
    },
    {
      name: 'attribute8',
      label: '出库库区',
      type: 'string',
    },
    {
      name: 'attribute9',
      label: '出库时间',
      type: 'string',
    },
  ],
  queryFields: [
    {
      name: 'attribute2',
      label: '需求单号',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '物料编码',
      type: 'string',
    },
    {
      name: 'attribute5',
      label: '出库单号',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const url = queryUrl;
      return {
        url,
        data: {
          ...data,
          attribute1: supplier,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'TODAY-PICK',
        },
        method: 'GET',
      };
    },
  },
});
// 用户数
export const userNumber = () => ({
  name: 'userNumber',
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'attribute1',
      label: '用户编码',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '用户名称',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '所属供应商',
      type: 'string',
    },
    {
      name: 'attribute4',
      label: '是否可用',
      type: 'string',
    },
  ],
  queryFields: [
    {
      name: 'attribute1',
      label: '用户编码',
      type: 'string',
    },
    {
      name: 'attribute2',
      label: '用户名称',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const url = queryUrl;
      return {
        url,
        data: {
          ...data,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'USER',
        },
        method: 'GET',
      };
    },
  },
});
