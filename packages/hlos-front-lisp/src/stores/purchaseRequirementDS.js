/*
 * @Description: 采购需求发布与确认 - DS
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 12:30:35
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-24 12:32:12
 * @Copyright: Copyright (c) 2018, Hand
 */

import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser, filterNullValueObject } from 'utils/utils';

import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const url = `${HLOS_LISP}/v1/datas`;
const { loginName } = getCurrentUser();

export const purchaseRequirementReleaseDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'attribute1',
        type: 'object',
        label: '采购中心',
        lovCode: common.scmOu,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute2',
        type: 'object',
        label: '采购订单号',
        lovCode: common.poNum,
        transformRequest: (value) => value && value.attribute2,
      },
      {
        name: 'attribute6',
        label: '供应商',
        type: 'object',
        lovCode: common.suppliers,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute4',
        type: 'string',
        label: '订单状态',
        lookupCode: 'LMDS.PO_STATUS',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'SUPPLIER_CHAIN',
              dataType: 'PO_STATUS',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: item.attribute1,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
      },
      {
        name: 'attribute5',
        type: 'object',
        label: '采购员',
        lovCode: common.buyer,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute15',
        type: 'object',
        label: '物料',
        lovCode: common.item,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: '需求时间＞＝',
        max: 'demandDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: '需求时间＜＝',
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '采购中心',
      },
      {
        name: 'attribute2',
        label: '采购订单号',
      },
      {
        name: 'attribute3',
        label: '订单类型',
      },
      {
        name: 'attribute4',
        label: '订单状态',
      },
      {
        name: 'attribute5',
        label: '采购员',
      },
      {
        name: 'attribute6',
        label: '供应商',
      },
      {
        name: 'attribute7',
        label: '供应商地点',
      },
      {
        name: 'attribute8',
        label: '供应商联系人',
      },
      {
        name: 'attribute9',
        label: '收货组织',
      },
      {
        name: 'attribute10',
        label: '币种',
      },
      {
        name: 'attribute11',
        label: '税率(%)',
      },
      {
        name: 'attribute12',
        label: '汇率',
      },
      {
        name: 'attribute13',
        label: '付款方式',
      },
      {
        name: 'attribute14',
        label: '采购订单行号',
      },
      {
        name: 'attribute15',
        label: '物料',
      },
      {
        name: 'attribute16',
        label: '物料描述',
      },
      {
        name: 'attribute17',
        label: '单位',
      },
      {
        name: 'attribute18',
        label: '需求数量',
      },
      {
        name: 'attribute19',
        label: '需求日期',
      },
      {
        name: 'attribute20',
        label: '单价',
      },
      {
        name: 'attribute21',
        label: '总价',
      },
      {
        name: 'attribute22',
        label: '接收仓库',
      },
      {
        name: 'attribute23',
        label: '附件',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LISP}/v1/datas/solution-pack`,
          data: filterNullValueObject({
            ...data,
            user: loginName,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'PURCHASE_ORDER',
          }),
          method: 'GET',
        };
      },
    },
  };
};

export const releasedDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'attribute6',
        type: 'object',
        label: '销售中心',
        lovCode: common.sopOu,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute1',
        type: 'object',
        label: '客户',
        lovCode: common.customer,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute2',
        type: 'object',
        label: '客户采购订单号',
        lovCode: common.poNum,
        transformRequest: (value) => value && value.attribute2,
      },
      {
        name: 'attribute8',
        type: 'object',
        label: '销售员',
        lovCode: common.saler,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute15',
        type: 'object',
        label: '物料',
        lovCode: 'LISP.ITEM',
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: '需求时间＞＝',
        max: 'demandDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: '需求时间＜＝',
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'attribute6',
        label: '销售中心',
      },
      {
        name: 'saleOrderNum',
        label: '销售订单号',
      },
      {
        name: 'saleOrderLineNum',
        label: '销售订单行号',
      },
      {
        name: 'attribute8',
        label: '销售员',
      },
      {
        name: 'attribute1',
        label: '客户',
      },
      {
        name: 'attribute2',
        label: '客户采购订单号',
      },
      {
        name: 'attribute5',
        label: '客户联系人',
      },
      {
        name: 'attribute9',
        label: '收货组织',
      },
      {
        name: 'attribute10',
        label: '币种',
      },
      {
        name: 'attribute11',
        label: '税率(%)',
      },
      {
        name: 'attribute12',
        label: '汇率',
      },
      {
        name: 'attribute13',
        label: '付款方式',
      },
      {
        name: 'attribute14',
        label: '采购订单行号',
      },
      {
        name: 'attribute15',
        label: '物料',
      },
      {
        name: 'attribute16',
        label: '物料描述',
      },
      {
        name: 'attribute17',
        label: '单位',
      },
      {
        name: 'attribute18',
        label: '需求数量',
      },
      {
        name: 'attribute19',
        label: '需求日期',
      },
      {
        name: 'attribute20',
        label: '单价',
      },
      {
        name: 'attribute21',
        label: '总价',
      },
      {
        name: 'attribute22',
        label: '收货仓库',
      },
      {
        name: 'attribute23',
        label: '附件',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LISP}/v1/datas/solution-pack`,
          data: filterNullValueObject({
            ...data,
            attribute4: '已发布',
            user: loginName,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'PURCHASE_ORDER',
          }),
          method: 'GET',
        };
      },
    },
  };
};

export const confirmedDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'attribute1',
        type: 'object',
        label: '销售中心',
        lovCode: common.sopOu,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute3',
        type: 'object',
        label: '客户',
        lovCode: common.customer,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute28',
        type: 'object',
        label: '客户采购订单号',
        lovCode: common.poNum,
        transformRequest: (value) => value && value.attribute2,
      },
      {
        name: 'attribute7',
        type: 'object',
        label: '销售员',
        lovCode: common.saler,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'attribute11',
        type: 'object',
        label: '物料',
        lovCode: common.item,
        transformRequest: (value) => value && value.attribute1,
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: '需求时间＞＝',
        max: 'demandDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: '需求时间＜＝',
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '销售中心',
      },
      {
        name: 'attribute5',
        label: '销售订单号',
      },
      {
        name: 'attribute6',
        label: '销售订单行号',
      },
      {
        name: 'attribute7',
        label: '销售员',
      },
      {
        name: 'attribute3',
        label: '客户',
      },
      {
        name: 'attribute28',
        label: '客户采购订单号',
      },
      {
        name: 'attribute30',
        label: '客户联系人',
      },
      {
        name: 'attribute25',
        label: '收货组织',
      },
      {
        name: 'attribute20',
        label: '币种',
      },
      {
        name: 'attribute22',
        label: '税率(%)',
      },
      {
        name: 'attribute23',
        label: '汇率',
      },
      {
        name: 'attribute24',
        label: '付款方式',
      },
      {
        name: 'attribute29',
        label: '采购订单行号',
      },
      {
        name: 'attribute11',
        label: '物料',
      },
      {
        name: 'attribute12',
        label: '物料描述',
      },
      {
        name: 'attribute13',
        label: '单位',
      },
      {
        name: 'attribute14',
        label: '需求数量',
      },
      {
        name: 'attribute17',
        label: '需求日期',
      },
      {
        name: 'attribute15',
        label: '单价',
      },
      {
        name: 'attribute21',
        label: '总价',
      },
      {
        name: 'attribute26',
        label: '收货仓库',
      },
      {
        name: 'attribute27',
        label: '附件',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LISP}/v1/datas/solution-pack`,
          data: filterNullValueObject({
            ...data,
            user: loginName,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'SALE_ORDER',
          }),
          method: 'GET',
        };
      },
    },
  };
};

export const componentDS = () => ({
  fields: [
    {
      name: 'attribute3',
      label: '行号',
    },
    {
      name: 'attribute4&5',
      label: '组件物料',
    },
    {
      name: 'attribute6',
      label: '组件类型',
    },
    {
      name: 'attribute7',
      label: '单位',
    },
    {
      name: 'attribute8',
      label: '需求数量',
    },
    {
      name: 'attribute9',
      label: '发货数量',
    },
    {
      name: 'attribute11',
      label: 'BOM用量',
    },
    {
      name: 'attribute12',
      label: '损耗率',
    },
  ],
  transport: {
    read: ({ data }) => ({
      url,
      data: {
        ...data,
        user: loginName,
        functionType: 'SUPPLIER_CHAIN',
        dataType: 'PO_COMPONENT',
      },
      method: 'GET',
    }),
  },
});
