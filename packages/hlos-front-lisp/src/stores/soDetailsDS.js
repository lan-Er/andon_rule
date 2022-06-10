import { getCurrentUser, filterNullValueObject } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const { loginName } = getCurrentUser();

// 供应商
export const supplierListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'attribute9',
        type: 'string',
        label: '订单状态',
        defaultValue: '新建',
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
        name: 'attribute23',
        type: 'object',
        lovCode: 'LMDS.SALER',
        label: '销售员',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
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
        name: 'attribute33',
        label: '产品',
      },
      {
        name: 'attribute2',
        label: '客户',
      },
      {
        name: 'attribute23',
        label: '销售员',
      },
      {
        name: 'attribute5',
        label: '数量',
      },
      {
        name: 'attribute6',
        label: '数量',
      },
      {
        name: 'attribute7',
        label: '金额',
      },
      {
        name: 'attribute8',
        label: '币种',
      },
      {
        name: 'attribute9',
        label: '状态',
      },
      {
        name: 'attribute12',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'attribute29',
        label: '进度信息',
      },
      {
        name: 'attribute30',
        label: '发运进度',
      },
      {
        name: 'attribute4',
        label: '客户物料',
      },
      {
        name: 'attribute26',
        label: '客户物料',
      },
      {
        name: 'attribute1',
        label: '客户采购订单号',
      },
    ],
    transport: {
      read: ({ data, params }) => {
        const { sort, page, size } = params;
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
        name: 'attribute9',
        type: 'string',
        label: '订单状态',
        defaultValue: '新建',
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
        name: 'attribute24',
        type: 'object',
        lovCode: 'LMDS.DEMO_BUYER',
        label: '采购员',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
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
        name: 'attribute26',
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
        name: 'attribute5',
        label: '数量',
      },
      {
        name: 'attribute6',
        label: '数量',
      },
      {
        name: 'attribute7',
        label: '金额',
      },
      {
        name: 'attribute8',
        label: '币种',
      },
      {
        name: 'attribute9',
        label: '状态',
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
        name: 'attribute29',
        label: '进度信息',
      },
      {
        name: 'attribute30',
        label: '发运进度',
      },
      {
        name: 'attribute25',
        label: '供应商产品',
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
