/**
 * @Description: 供应商异常订单
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-25 10:02:02
 * @LastEditors: yu.na
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import { moneyFormat } from '@/utils/renderer';

const preCode = 'lisp.abnormalOrder.model';
const url = `${HLOS_LISP}/v1/datas/solution-pack`;
const { loginName } = getCurrentUser();

export const ListDS = () => {
  return {
    selection: false,
    pageSize: 20,
    queryFields: [
      {
        name: 'attribute1',
        type: 'string',
        label: intl.get(`${preCode}.orderNum`).d('订单号'),
      },
      {
        name: 'attribute2',
        type: 'string',
        label: intl.get(`${preCode}.supplier`).d('客户'),
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'SUPPLIER_CHAIN_OVERALL',
              dataType: 'CUSTOMER',
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
        name: 'attribute25',
        type: 'string',
        label: intl.get(`${preCode}.product`).d('产品'),
      },
      {
        name: 'orderDate',
        type: 'date',
        label: intl.get(`${preCode}.sureDate`).d('确认日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'order',
        label: intl.get(`${preCode}.order`).d('序号'),
      },
      {
        name: 'attribute4',
        label: intl.get(`${preCode}.item-itemDesc`).d('物料'),
      },
      {
        name: 'attribute2',
        label: intl.get(`${preCode}.supplier`).d('客户'),
      },
      {
        name: 'attribute23',
        label: intl.get(`${preCode}.buyer`).d('销售员'),
      },
      {
        name: 'attribute5',
        label: intl.get(`${preCode}.qty`).d('数量'), // 5-6
      },
      {
        name: 'attribute36',
        label: intl.get(`${preCode}.unstandardReason`).d('不合格原因'),
      },
      {
        name: 'attribute34',
        label: intl.get(`${preCode}.changeQty`).d('变更数量'),
      },
      {
        name: 'receiveQty',
        label: intl.get(`${preCode}.receiveQty`).d('交货数量'), // 31-6
        transformResponse: (val, object) =>
          val || `${object.attribute31}${object.attribute6}`.replace(/undefined/g, ' '),
      },
      {
        name: 'qty',
        label: intl.get(`${preCode}.qty`).d('数量'), // 31-6
        transformResponse: (val, object) =>
          val || `${object.attribute5}${object.attribute6}`.replace(/undefined/g, ' '),
      },
      {
        name: 'unstandradQty',
        label: intl.get(`${preCode}.receiveQty`).d('不合格数量'), // 31-6
        transformResponse: (val, object) =>
          val || `${object.attribute31}${object.attribute6}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute27',
        label: intl.get(`${preCode}.receiveOrg`).d('目的组织'),
      },
      {
        name: 'attribute11',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
      },
      {
        name: 'attribute35',
        label: intl.get(`${preCode}.changeDays`).d('变更天数'),
      },
      {
        name: 'attribute12',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      },
      {
        name: 'playDate',
        label: intl.get(`${preCode}.playDate`).d('交货期'), // 12-14
        transformResponse: (val, object) =>
          `${Math.floor(
            (new Date(object.attribute12).getTime() - new Date(object.attribute14).getTime()) /
              (24 * 3600 * 1000)
          )}天`,
      },
      {
        name: 'attribute1',
        label: intl.get(`${preCode}.orderNum`).d('订单号'),
      },
      {
        name: 'price',
        label: intl.get(`${preCode}.price-currency`).d('金额'), // 7-8
        transformResponse: (val, object) =>
          `${object.attribute8} ${moneyFormat(object.attribute7)}`.replace(/undefined/g, ' '),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN_OVERALL',
            dataType: 'ORDER',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
