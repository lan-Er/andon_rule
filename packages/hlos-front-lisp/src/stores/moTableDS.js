/*
 * MO工作台-DS
 * date: 2020-07-23
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { filterNullValueObject } from 'utils/utils';

export const moTableDS = () => ({
  pageSize: 10,
  autoQuery: true,
  selection: 'multiple',
  queryFields: [
    {
      name: 'attribute1',
      type: 'object',
      lovCode: 'LISP.ORGANIZATION',
      label: '组织',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute2',
      type: 'object',
      lovCode: 'LISP.MO_NUMBER',
      label: 'MO号',
      transformRequest: (value) => {
        return value && value.attribute2;
      },
    },
    {
      name: 'attribute3',
      type: 'object',
      lovCode: 'LISP.ITEM',
      label: '物料',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute7',
      type: 'object',
      lovCode: 'LISP.MO_STATUS',
      label: 'MO状态',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute32',
      type: 'object',
      lovCode: 'LISP.CUSTOMER',
      label: '客户',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute8',
      type: 'string',
      lovCode: 'LISP.MO_TYPE',
      label: 'MO类型',
    },
    {
      name: 'attribute19',
      type: 'object',
      lovCode: 'LISP.PRODLINE',
      label: '生产线',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute21',
      type: 'object',
      lovCode: 'LISP.EQUIPMENT',
      label: '设备',
      transformRequest: (value) => {
        return value && value.attribute1;
      },
    },
    {
      name: 'attribute33',
      type: 'string',
      label: '销售订单',
    },
    {
      name: 'attribute37',
      type: 'string',
      label: '客户采购订单',
    },
    {
      name: 'importTimeStart',
      type: 'dateTime',
      label: '导入时间>=',
      max: 'importTimeEnd',
    },
    {
      name: 'importTimeEnd',
      type: 'dateTime',
      label: '导入时间<=',
      min: 'importTimeStart',
    },
  ],
  fields: [
    {
      label: '组织',
      name: 'attribute1',
      type: 'string',
    },
    {
      label: 'MO号',
      name: 'attribute2',
      type: 'string',
    },
    {
      name: 'attribute3',
      type: 'string',
    },
    {
      name: 'attribute4',
      type: 'string',
    },
    {
      label: '物料',
      name: 'attribute3&4',
      type: 'string',
    },
    {
      label: '需求数量',
      name: 'attribute5&6',
      type: 'string',
    },
    {
      label: 'MO状态',
      name: 'attribute7',
      type: 'string',
    },
    {
      label: 'MO类型',
      name: 'attribute8',
      type: 'string',
    },
    {
      label: '需求日期',
      name: 'attribute9',
      type: 'string',
    },
    {
      label: '制造数量',
      name: 'attribute10',
      type: 'string',
    },
    {
      label: '计划开始时间',
      name: 'attribute15',
      type: 'string',
    },
    {
      label: '计划结束时间',
      name: 'attribute16',
      type: 'string',
    },
    {
      label: '工厂',
      name: 'attribute17',
      type: 'string',
    },
    {
      label: '车间',
      name: 'attribute18',
      type: 'string',
    },
    {
      label: '生产线',
      name: 'attribute19',
      type: 'string',
    },
    {
      label: '工位',
      name: 'attribute20',
      type: 'string',
    },
    {
      label: '设备',
      name: 'attribute21',
      type: 'string',
    },
    {
      label: '完工数量',
      name: 'attribute11',
      type: 'string',
    },
    {
      label: '报废数量',
      name: 'attribute12',
      type: 'string',
    },
    {
      label: '已供应数量',
      name: 'attribute13',
      type: 'string',
    },
    {
      label: '入库数量',
      name: 'attribute14',
      type: 'string',
    },
    {
      label: 'BOM',
      name: 'attribute22',
      type: 'string',
    },
    {
      label: '工艺路线',
      name: 'attribute23',
      type: 'string',
    },
    {
      label: '入库仓库',
      name: 'attribute24',
      type: 'string',
    },
    {
      label: '入库货位',
      name: 'attribute25',
      type: 'string',
    },
    {
      label: '排期时间',
      name: 'attribute26',
      type: 'string',
    },
    {
      label: '下达时间',
      name: 'attribute27',
      type: 'string',
    },
    {
      label: '完工时间',
      name: 'attribute28',
      type: 'string',
    },
    {
      label: '关闭时间',
      name: 'attribute29',
      type: 'string',
    },
    {
      label: '暂挂时间',
      name: 'attribute30',
      type: 'string',
    },
    {
      label: '取消时间',
      name: 'attribute31',
      type: 'string',
    },
    {
      label: '客户',
      name: 'attribute32',
      type: 'string',
    },
    {
      label: '销售订单',
      name: 'attribute33',
      type: 'string',
    },
    {
      label: '销售订单行',
      name: 'attribute34',
      type: 'string',
    },
    {
      label: '客户物料',
      name: 'attribute35&36',
      type: 'string',
    },
    {
      label: '客户PO',
      name: 'attribute37',
      type: 'string',
    },
    {
      label: '客户PO行',
      name: 'attribute38',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LISP}/v1/datas/supplier-chain`,
        data: filterNullValueObject({
          ...data,
          sortFlag: true,
          field: 'attribute2',
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'MAKE_ORDER',
        }),
        method: 'GET',
      };
    },
  },
});
