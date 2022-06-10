/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-08-21 16:30:47
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-07 10:58:02
 */

import { getCurrentUser } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';

const { loginName } = getCurrentUser();
const url = `${HLOS_LISP}/v1/datas/get-replenishment-line`;
const updateUrl = `${HLOS_LISP}/v1/datas`;

export const ListDS = (itemList) => {
  return {
    autoQuery: true,
    selection: 'multiple',
    queryFields: [
      {
        name: 'itemList',
        type: 'string',
        multiple: true,
        defaultValue: itemList,
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '补货计划订单号',
        type: 'string',
      },
      {
        name: 'attribute2',
        label: '物料号',
        type: 'string',
      },
      {
        name: 'attribute3',
        label: '是否紧急采购',
        type: 'string',
      },
      {
        name: 'attribute4',
        label: '供应商名称',
        type: 'string',
      },
      {
        name: 'attribute5',
        label: '库存现有量',
        type: 'string',
      },
      {
        name: 'attribute6',
        label: '补货数量',
        type: 'string',
      },
      {
        name: 'attribute7',
        label: '要求到货时间',
        type: 'date',
        format: DEFAULT_DATE_FORMAT,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'attribute8',
        label: '单位',
        type: 'string',
      },
      {
        name: 'attribute9',
        label: '送货地点',
        type: 'string',
      },
      {
        name: 'attribute10',
        label: '状态',
        type: 'string',
      },
      {
        name: 'attribute11',
        label: '物料描述',
        type: 'string',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'Check_mangenment_Line',
            user: loginName,
            itemList,
          },
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: updateUrl,
          data,
          method: 'PUT',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};
