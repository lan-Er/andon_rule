/*
 * @Description: 销售订单执行 - DS
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-25 15:34:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-24 14:41:25
 * @Copyright: Copyright (c) 2018, Hand
 */
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser, filterNullValueObject } from 'utils/utils';

const { loginName } = getCurrentUser();

// 供应商
export const supplierListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'fieldDate',
        type: 'string',
        label: '订单状态',
        defaultValue: 'attribute14',
      },
      {
        name: 'orderDate',
        type: 'string',
        label: '订单日期',
      },
      {
        name: 'attribute2',
        type: 'object',
        lovCode: 'LMDS.DEMO_CUSTOMER',
        label: '客户',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute23',
        type: 'object',
        lovCode: 'LMDS.SALER',
        label: '销售员',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute25',
        type: 'object',
        lovCode: 'LMDS.DEMO_PRODUCT',
        label: '产品',
        transformRequest: (value) => {
          return value && value.attribute3;
        },
      },
      {
        name: 'totalPriceFrom',
        type: 'number',
        label: '金额＜＝',
        max: 'totalPriceTo',
      },
      {
        name: 'totalPriceTo',
        type: 'number',
        label: '金额＞＝',
        min: 'totalPriceFrom',
      },
      {
        name: 'startDate',
        type: 'date',
        label: '时间',
        max: 'endDate',
        ignore: 'always',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'endDate',
        type: 'date',
        label: '时间',
        min: 'startDate',
        ignore: 'always',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'confirmedDateFrom',
        type: 'date',
        label: '确认时间＞＝',
        max: 'confirmedDateTo',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'confirmedDateTo',
        type: 'date',
        label: '确认时间＜＝',
        min: 'confirmedDateFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'releasedDateFrom',
        type: 'date',
        label: '下达时间＞＝',
        max: 'releasedDateTo',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'releasedDateTo',
        type: 'date',
        label: '下达时间＜＝',
        min: 'releasedDateFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'reportDateFrom',
        type: 'date',
        label: '完工时间＞＝',
        max: 'reportDateTo',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'reportDateTo',
        type: 'date',
        label: '完工时间＞＝',
        min: 'reportDateFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'shipDateFrom',
        type: 'date',
        label: '发运时间＜＝',
        max: 'shipDateTo',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'shipDateTo',
        type: 'date',
        label: '发运时间＞＝',
        min: 'shipDateFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'receivedDateFrom',
        type: 'date',
        label: '接收时间＜＝',
        max: 'receivedDateTo',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'receivedDateTo',
        type: 'date',
        label: '接收时间＞＝',
        min: 'receivedDateFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'returnDateFrom',
        type: 'date',
        label: '退货时间＜＝',
        max: 'returnDateTo',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'returnDateTo',
        type: 'date',
        label: '退货时间＞＝',
        min: 'returnDateFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'attribute43',
        type: 'boolean',
        label: '是否关键客户',
        trueValue: '1',
        falseValue: '',
      },
    ],
    fields: [
      {
        name: 'attribute28',
        label: '销售订单号',
      },
      {
        name: 'attribute25',
        label: '产品',
      },
      {
        name: 'attribute2',
        label: '客户',
      },
      {
        name: 'attribute23',
        label: '销售员 ',
      },
      {
        name: 'attribute37',
        label: '确认数量',
      },
      {
        name: 'attribute38',
        label: '下达数量',
      },
      {
        name: 'attribute40',
        label: '完工数量',
      },
      {
        name: 'attribute41',
        label: '发运数量',
      },
      {
        name: 'attribute31',
        label: '接收数量',
      },
      {
        name: 'attribute42',
        label: '退货数量',
      },
      {
        name: 'attribute7',
        label: '金额',
      },
      {
        name: 'attribute9',
        label: '当前状态',
      },
      {
        name: 'attribute12',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'attribute14',
        type: 'dateTime',
        label: '确认时间',
      },
      {
        name: 'attribute15',
        type: 'dateTime',
        label: '下达时间',
      },
      {
        name: 'attribute17',
        type: 'dateTime',
        label: '完工时间',
      },
      {
        name: 'attribute18',
        type: 'dateTime',
        label: '发货时间',
      },
      {
        name: 'attribute19',
        type: 'dateTime',
        label: '接收时间',
      },
      {
        name: 'attribute32',
        type: 'dateTime',
        label: '退货时间',
      },
      {
        name: 'attribute36',
        label: '退货原因',
      },
      {
        name: 'attribute4',
        label: '客户物料',
      },
      {
        name: 'attribute1',
        label: '客户采购订单号',
      },
    ],
    transport: {
      read: ({ data, params }) => {
        const { page, size, sort } = params;
        let field;
        let sortFlag;
        if (sort) {
          [field, sortFlag] = sort && sort.split(',');
          sortFlag = sortFlag === 'asc';
          if (field === 'attribute7') {
            field = '';
          }
        }
        return {
          url: `${HLOS_LISP}/v1/datas/solution-pack`,
          data: filterNullValueObject({
            ...data,
            field,
            sortFlag,
            user: loginName,
            functionType: 'SUPPLIER_CHAIN_OVERALL',
            dataType: 'ORDER',
          }),
          params: {
            page,
            size,
          },
          method: 'GET',
        };
      },
    },
  };
};

// 核企
export const coreListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'fieldDate',
        type: 'string',
        label: '订单状态',
        defaultValue: 'attribute14',
      },
      {
        name: 'orderDate',
        type: 'string',
        label: '订单日期',
      },
      {
        name: 'attribute3',
        type: 'object',
        lovCode: 'LMDS.DEMO_SUPPLIER',
        label: '供应商',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute24',
        type: 'object',
        lovCode: 'LMDS.DEMO_BUYER',
        label: '采购员',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute4',
        type: 'object',
        lovCode: 'LMDS.DEMO_ITEM',
        label: '物料',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'totalPriceFrom',
        type: 'number',
        label: '金额＜＝',
        max: 'totalPriceTo',
      },
      {
        name: 'totalPriceTo',
        type: 'number',
        label: '金额＞＝',
        min: 'totalPriceFrom',
      },
      {
        name: 'startDate',
        type: 'date',
        label: '时间',
        max: 'endDate',
        ignore: 'always',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'endDate',
        type: 'date',
        label: '时间',
        min: 'startDate',
        ignore: 'always',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'confirmedDateFrom',
        type: 'date',
        label: '确认时间＞＝',
        max: 'confirmedDateTo',
        // bind: 'startDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'confirmedDateTo',
        type: 'date',
        label: '确认时间＜＝',
        min: 'confirmedDateFrom',
        // bind: 'endDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'releasedDateFrom',
        type: 'date',
        label: '下达时间＞＝',
        max: 'releasedDateTo',
        // bind: 'startDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'releasedDateTo',
        type: 'date',
        label: '下达时间＜＝',
        min: 'releasedDateFrom',
        // bind: 'endDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'reportDateFrom',
        type: 'date',
        label: '完工时间＞＝',
        max: 'reportDateTo',
        // bind: 'startDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'reportDateTo',
        type: 'date',
        label: '完工时间＞＝',
        min: 'reportDateFrom',
        // bind: 'endDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'shipDateFrom',
        type: 'date',
        label: '发运时间＜＝',
        max: 'shipDateTo',
        // bind: 'startDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'shipDateTo',
        type: 'date',
        label: '发运时间＞＝',
        min: 'shipDateFrom',
        // bind: 'endDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'receivedDateFrom',
        type: 'date',
        label: '接收时间＜＝',
        max: 'receivedDateTo',
        // bind: 'startDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'receivedDateTo',
        type: 'date',
        label: '接收时间＞＝',
        min: 'receivedDateFrom',
        // bind: 'endDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'attribute44',
        type: 'boolean',
        label: '是否关键供应商',
        trueValue: '1',
        falseValue: '',
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '采购订单号',
      },
      {
        name: 'attribute4',
        label: '物料',
      },
      {
        name: 'attribute3',
        label: '供应商',
      },
      {
        name: 'attribute24',
        label: '采购员',
      },
      {
        name: 'attribute27',
        label: '接收组织',
      },
      {
        name: 'attribute37',
        label: '确认数量',
      },
      {
        name: 'attribute38',
        label: '下达数量',
      },
      {
        name: 'attribute40',
        label: '完工数量',
      },
      {
        name: 'attribute41',
        label: '发运数量',
      },
      {
        name: 'attribute31',
        label: '接收数量',
      },
      {
        name: 'attribute7',
        label: '金额',
      },
      {
        name: 'attribute9',
        label: '当前状态',
      },
      {
        name: 'attribute12',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'attribute11',
        type: 'date',
        label: '需求日期',
      },
      {
        name: 'attribute14',
        type: 'dateTime',
        label: '确认时间',
      },
      {
        name: 'attribute15',
        type: 'dateTime',
        label: '下达时间',
      },
      {
        name: 'attribute17',
        type: 'dateTime',
        label: '完工时间',
      },
      {
        name: 'attribute18',
        type: 'dateTime',
        label: '发运时间',
      },
      {
        name: 'attribute19',
        type: 'dateTime',
        label: '接收时间',
      },
      {
        name: 'attribute33',
        label: '供应商产品',
      },
      {
        name: 'attribute28',
        label: '供应商销售订单号',
      },
    ],
    transport: {
      read: ({ data, params }) => {
        const { page, size, sort } = params;
        let field;
        let sortFlag;
        if (sort) {
          [field, sortFlag] = sort && sort.split(',');
          sortFlag = sortFlag === 'asc';
          if (field === 'attribute7') {
            field = '';
          }
        }
        return {
          url: `${HLOS_LISP}/v1/datas/solution-pack`,
          data: filterNullValueObject({
            ...data,
            field,
            sortFlag,
            user: loginName,
            functionType: 'SUPPLIER_CHAIN_OVERALL',
            dataType: 'ORDER',
          }),
          params: {
            page,
            size,
          },
          method: 'GET',
        };
      },
    },
  };
};
