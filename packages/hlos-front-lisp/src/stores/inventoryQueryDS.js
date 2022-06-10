/*
 * 核企侧库存查询-DS
 * date: 2020-07-23
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { filterNullValueObject } from 'utils/utils';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';

export const inventoryQueryDS = () => ({
  pageSize: 10,
  selection: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'attribute2',
      type: 'object',
      lovCode: 'LISP.ITEM',
      label: '物料',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute6',
      type: 'object',
      lovCode: 'LISP.INV_ITEM_TYPE',
      label: '物料类型',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute14',
      type: 'object',
      lovCode: 'LISP.INV_ITEM_CAT',
      label: '物料类别',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute4',
      type: 'object',
      lovCode: 'LISP.STATEMENT_SUPPLIER',
      label: '供应商',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'quantityStart',
      type: 'number',
      label: '数量>',
      max: 'quantityEnd',
      validator: positiveNumberValidator,
    },
    {
      name: 'quantityEnd',
      type: 'number',
      label: '数量<=',
      min: 'quantityStart',
      validator: positiveNumberValidator,
    },
  ],
  fields: [
    {
      label: '组织',
      name: 'attribute1',
      type: 'string',
    },
    {
      name: 'attribute2',
      type: 'string',
    },
    {
      name: 'attribute3',
      type: 'string',
    },
    {
      label: '物料',
      name: 'attribute2&3',
      type: 'string',
    },
    {
      name: 'attribute4',
      type: 'string',
    },
    {
      name: 'attribute5',
      type: 'string',
    },
    {
      label: '物料类别',
      name: 'attribute14',
      type: 'string',
    },
    {
      label: '寄售标识',
      name: 'attribute13',
      type: 'string',
    },
    {
      label: '供应商',
      name: 'attribute4&5',
      type: 'string',
    },
    {
      label: '关键供应商标识',
      name: 'attribute12',
      type: 'string',
    },
    {
      label: '物料类型',
      name: 'attribute6',
      type: 'string',
    },
    {
      label: '数量',
      name: 'attribute7',
      type: 'string',
    },
    {
      label: '安全库存',
      name: 'attribute9',
      type: 'string',
    },
    {
      name: 'attribute10',
      type: 'string',
    },
    {
      name: 'attribute11',
      type: 'string',
    },
    {
      label: '供应商物料',
      name: 'attribute10&11',
      type: 'string',
    },
    {
      name: 'attribute12',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data, dataSet }) => {
      const { queryParameter } = dataSet;
      return {
        url: `${HLOS_LISP}/v1/datas/supplier-chain`,
        data: filterNullValueObject({
          ...data,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'ONHAND_QTY',
          attribute13: queryParameter.attribute13 || '0',
        }),
        method: 'GET',
      };
    },
  },
});

// 汇总DS
export const totalInventoryQueryDS = () => ({
  pageSize: 10,
  selection: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'attribute2',
      type: 'object',
      lovCode: 'LISP.ITEM',
      label: '物料',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute4',
      type: 'object',
      lovCode: 'LISP.INV_ITEM_TYPE',
      label: '物料类型',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute8',
      type: 'object',
      lovCode: 'LISP.INV_ITEM_CAT',
      label: '物料类别',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
  ],
  fields: [
    {
      label: '组织',
      name: 'attribute1',
      type: 'string',
    },
    {
      name: 'attribute2',
      type: 'string',
    },
    {
      name: 'attribute3',
      type: 'string',
    },
    {
      label: '物料',
      name: 'attribute2&3',
      type: 'string',
    },
    {
      label: '物料类型',
      name: 'attribute4',
      type: 'string',
    },
    {
      label: '物料类别',
      name: 'attribute8',
      type: 'string',
    },
    {
      label: '寄售标识',
      name: 'attribute7',
      type: 'string',
    },
    // {
    //   label: '批次',
    //   name: 'attribute6',
    //   type: 'string',
    // },
    {
      label: '数量',
      name: 'attribute5',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data, dataSet }) => {
      const { queryParameter } = dataSet;
      return {
        url: `${HLOS_LISP}/v1/datas/supplier-chain`,
        data: filterNullValueObject({
          ...data,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'SUN_ONH_QTY',
          attribute7: queryParameter.attribute7 || '0',
        }),
        method: 'GET',
      };
    },
  },
});
