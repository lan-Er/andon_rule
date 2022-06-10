/*
 * @Descripttion:发货单创建&确认Ds
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-07-24 10:50:16
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-25 16:40:43
 */
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
// import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';

const url = `${HLOS_LISP}/v1/datas`;
const { loginName } = getCurrentUser();
export const ListDS = () => {
  return {
    autoQuery: true,
    selection: 'multiple',
    queryFields: [
      {
        name: 'attribute1',
        type: 'object',
        lovCode: 'LISP.ORGANIZATION',
        label: '发出组织',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute2',
        type: 'object',
        lovCode: 'LISP.STATEMENT_SHIP_ORDER',
        label: '发运单号',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute5',
        label: '发运单状态',
        type: 'object',
        lovCode: 'LISP.SHIP_SATUS',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute3',
        type: 'object',
        lovCode: 'LISP.CUSTOMER',
        label: '客户',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute9',
        label: '销售员',
        type: 'object',
        lovCode: 'LISP.SALER',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute6',
        // type: 'string',
        label: '销售订单号',
        // lookupAxiosConfig: getLookUpData('SO_NUM', 'attribute2'),
        type: 'object',
        lovCode: 'LISP.SO_NUMBER',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute23',
        type: 'object',
        lovCode: 'LISP.ITEM',
        label: '物料',
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
    ],
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        label: '发运组织',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '发运单号',
      },
      {
        name: 'attribute3',
        type: 'string',
        label: '客户',
      },
      {
        name: 'attribute5',
        type: 'string',
        label: '发货单状态',
      },
      // {
      //   name: 'attribute4',
      //   type: 'string',
      //   label: '客户地点',
      // },
      {
        name: 'attribute6',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute42',
        type: 'string',
        label: '销售订单行号',
      },
      {
        name: 'attribute7',
        type: 'string',
        label: '销售员',
      },
      {
        name: 'attribute8',
        type: 'string',
        label: '发出仓库',
      },
      {
        name: 'attribute9',
        type: 'string',
        label: '收货地点',
      },
      {
        name: 'attribute10',
        type: 'string',
        label: '客户联系人',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: '联系电话',
      },
      {
        name: 'attribute12',
        type: 'string',
        label: '客户采购订单号',
      },
      {
        name: 'attribute13',
        type: 'string',
        label: '客户采购订单行号',
      },
      {
        name: 'attribute14',
        type: 'string',
        label: '发运方式',
      },
      {
        name: 'attribute15',
        type: 'string',
        label: '承运人',
      },
      {
        name: 'attribute16',
        type: 'string',
        label: '联系方式',
      },
      {
        name: 'attribute17',
        type: 'string',
        label: '计划发运时间',
      },
      {
        name: 'attribute18',
        type: 'string',
        label: '发出时间',
      },
      {
        name: 'attribute19',
        type: 'string',
        label: '预计到达时间',
      },
      // {
      //   name: 'attribute20',
      //   type: 'string',
      //   label: '到达时间',
      // },
      {
        name: 'attribute21',
        type: 'string',
        label: '物料',
      },
      {
        name: 'attribute23',
        type: 'string',
        label: '客户物料',
      },
      {
        name: 'attribute25',
        type: 'string',
        label: '单位',
      },
      {
        name: 'attribute26',
        type: 'string',
        label: '申请数量',
      },
      {
        name: 'attribute27',
        type: 'string',
        label: '发出数量',
      },
      // {
      //   name: 'attribute28',
      //   type: 'string',
      //   label: '收获数量',
      // },
      // {
      //   name: 'attribute27',
      //   type: 'string',
      //   label: '发出数量',
      // },
      // {
      //   name: 'attribute28',
      //   type: 'string',
      //   label: '收获数量',
      // },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'SHIP_ORDER',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
