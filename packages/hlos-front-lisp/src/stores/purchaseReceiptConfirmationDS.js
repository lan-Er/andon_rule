/*
 * @Description: 采购需求发布与确认 - DS
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 12:30:35
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-24 12:32:12
 * @Copyright: Copyright (c) 2018, Hand
 */

import notification from 'utils/notification';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser, filterNullValueObject } from 'utils/utils';

import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const { loginName } = getCurrentUser();

export const listDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'attribute6',
        type: 'object',
        label: '供应商',
        lovCode: common.suppliers,
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
        name: 'attribute2',
        type: 'object',
        label: '采购订单号',
        lovCode: common.poNum,
        transformRequest: (value) => value && value.attribute2,
      },
    ],
    fields: [
      {
        name: 'attribute12',
        type: 'string',
        label: '采购订单号',
      },
      {
        name: 'attribute13',
        type: 'string',
        label: '采购订单行号',
      },
      {
        name: 'attribute29',
        type: 'string',
        label: '供应商',
      },
      {
        name: 'attribute21',
        type: 'string',
        label: '物料',
      },
      {
        name: 'attribute22',
        type: 'string',
        label: '物料描述',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '发货单号',
      },
      {
        name: 'attribute38',
        type: 'number',
        label: '需求数量',
      },
      {
        name: 'attribute39',
        type: 'date',
        label: '需求日期',
      },
      {
        name: 'attribute33',
        type: 'date',
        label: '承诺时间',
      },
      {
        name: 'attribute18',
        type: 'date',
        label: '发货日期',
      },
      {
        name: 'attribute19',
        type: 'date',
        label: '计划到货日期',
      },
      {
        name: 'attribute15',
        type: 'string',
        label: '承运人',
      },
      {
        name: 'attribute27',
        type: 'number',
        label: '发货数量',
      },
      {
        name: 'attribute28',
        type: 'number',
        label: '接收数量',
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
            dataType: 'SHIP_ORDER',
          }),
          method: 'GET',
          transformResponse: (value) => {
            if (value) {
              let formatData;
              try {
                formatData = JSON.parse(value);
              } catch (e) {
                // TODO: JSON解析失败说明数据接口返回数据不合理，譬如 403，DS已经做了报错处理，因此此处暂不作处理
                return;
              }
              if (formatData && !formatData.failed && Array.isArray(formatData.content)) {
                const content = formatData.content.map((item) => ({
                  ...item,
                  attribute28: item.attribute27,
                }));
                return { ...formatData, content };
              } else {
                notification.error((formatData && formatData.message) || '');
              }
            }
          },
        };
      },
      // update: ({ data }) => {
      //   const newData = data.map(item => {
      //     return {
      //       ...item,
      //       attribute4: item.attribute29,
      //       user: loginName,
      //       functionType: 'SUPPLIER_CHAIN',
      //       dataType: 'ONHAND_QTY',
      //     };
      //   });
      //   return {
      //     url: `${HLOS_LISP}/v1/datas`,
      //     data: newData,
      //     method: 'PUT',
      //   };
      // },
      // submit: ({ data }) => {
      //   return {
      //     url: `${HLOS_LISP}/v1/datas`,
      //     data,
      //     method: 'POST',
      //   };
      // },
    },
  };
};
